import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseIssueForm } from "../lib/issue-form-parser.mjs";
import { getIssueFormFields } from "../lib/issue-form-template.mjs";
import {
  DOWNLOAD_RETRY,
  MAX_ATTACHMENT_BYTES,
  detectFileType,
  findAttachmentUrls,
  formatSize,
} from "../lib/attachments.mjs";
import { news } from "../lib/handlers/news.mjs";
import { event } from "../lib/handlers/event.mjs";
import { publication } from "../lib/handlers/publication.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");
const fixtures = path.join(here, "fixtures");

// Keep the retry count real but do not actually wait between attempts.
DOWNLOAD_RETRY.delayMs = 0;

const parseFixture = (name) =>
  parseIssueForm(
    fs.readFileSync(path.join(fixtures, name), "utf8"),
    getIssueFormFields(name.split("-")[0])
  );

const PNG = fs.readFileSync(path.join(fixtures, "team-photo.png"));
const PDF = Buffer.from("%PDF-1.7\n1 0 obj << >> endobj\ntrailer << >>\n%%EOF\n");
const SVG = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

const IMAGE_URL = "https://github.com/user-attachments/assets/0b1c2d3e-4f50-6172-8394-a5b6c7d8e9f0";
const PDF_URL = "https://github.com/user-attachments/files/34749986/2-14_Steven_Ravary.pdf";

/** A sandbox repo holding the data files and schemas a handler reads. */
function sandboxWith(dataFiles) {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-attachments-"));
  const dataDir = path.join(sandbox, "src/data");
  fs.mkdirSync(path.join(dataDir, "_schemas"), { recursive: true });
  for (const name of dataFiles) {
    fs.copyFileSync(path.join(repoRoot, "src/data", name), path.join(dataDir, name));
    const schema = `_schemas/${name.replace(/\.json$/, ".schema.json")}`;
    if (fs.existsSync(path.join(repoRoot, "src/data", schema))) {
      fs.copyFileSync(path.join(repoRoot, "src/data", schema), path.join(dataDir, schema));
    }
  }
  return sandbox;
}

/** Serve `files` (url → Buffer | Response factory) from a stubbed fetch. */
function stubFetch(t, files) {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url: String(url), init });
    const entry = files[String(url)];
    if (!entry) return new Response("not found", { status: 404, statusText: "Not Found" });
    return typeof entry === "function" ? entry(init) : new Response(entry);
  });
  return calls;
}

test("findAttachmentUrls finds every form GitHub uses, once each", () => {
  const text = [
    `![poster](${IMAGE_URL})`,
    `<img width="800" alt="poster" src="${IMAGE_URL}" />`,
    `[2-14_Steven_Ravary.pdf](${PDF_URL})`,
    `See ${PDF_URL}.`,
    "![external](https://example.com/photo.jpg)",
    "https://github.com/MEDomicsLab/MEDomicsLab-website/issues/17",
  ].join("\n\n");
  assert.deepEqual(findAttachmentUrls(text), [IMAGE_URL, PDF_URL]);
  assert.deepEqual(findAttachmentUrls("no attachments here"), []);
});

test("detectFileType trusts file bytes, not names, and refuses SVG", () => {
  assert.deepEqual(detectFileType(PNG), { kind: "image", ext: "png" });
  assert.deepEqual(detectFileType(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0])), {
    kind: "image",
    ext: "jpg",
  });
  assert.deepEqual(detectFileType(Buffer.from("GIF89a....")), { kind: "image", ext: "gif" });
  assert.deepEqual(detectFileType(Buffer.from("RIFF\0\0\0\0WEBPVP8 ")), {
    kind: "image",
    ext: "webp",
  });
  assert.deepEqual(detectFileType(PDF), { kind: "pdf", ext: "pdf" });
  assert.equal(detectFileType(SVG), null);
  assert.equal(detectFileType(Buffer.alloc(0)), null);
});

test("news apply() copies dropped images and PDFs into the PR and rewrites the links", async (t) => {
  stubFetch(t, { [IMAGE_URL]: PNG, [PDF_URL]: PDF });
  const sandbox = sandboxWith(["news.json"]);
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] = [
    "Intro paragraph.",
    `<img width="800" alt="Poster 2-14" src="${IMAGE_URL}" />`,
    `![Poster 2-14](${IMAGE_URL})`,
    `[Download the poster (PDF)](${PDF_URL})`,
  ].join("\n\n");
  const plan = news.buildPlan(fields);
  assert.equal(plan.ok, true);

  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));

  const imagePath = `/images/albums/${plan.slug}/image-1.png`;
  const pdfPath = `/publications/${plan.slug}/2-14-steven-ravary.pdf`;
  assert.deepEqual(fs.readFileSync(path.join(sandbox, "public", imagePath)), PNG);
  assert.deepEqual(fs.readFileSync(path.join(sandbox, "public", pdfPath)), PDF);
  assert.ok(result.paths.includes(path.join(sandbox, "public", imagePath)));
  assert.ok(result.paths.includes(path.join(sandbox, "public", pdfPath)));

  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.ok(!markdown.includes("user-attachments"), markdown);
  assert.equal(markdown.split(imagePath).length - 1, 2, "both image references are rewritten");
  assert.ok(markdown.includes(`[Download the poster (PDF)](${pdfPath})`));
  assert.match(result.summary, /### Attachments/);
  assert.ok(result.summary.includes(`(${formatSize(PNG.length)})`), result.summary);
  assert.ok(!result.summary.includes("0.0 MB"), "small files are shown in B or KB");
});

test("event apply() copies attachments the same way", async (t) => {
  stubFetch(t, { [IMAGE_URL]: PNG });
  const sandbox = sandboxWith(["events.json"]);
  const fields = parseFixture("event-valid.md");
  fields["Full description (Markdown)"] = `![Group photo](${IMAGE_URL})`;
  const plan = event.buildPlan(fields);
  assert.equal(plan.ok, true);

  const result = await event.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.ok(markdown.includes(`![Group photo](/images/albums/${plan.slug}/image-1.png)`));
});

test("publication apply() points the primary link at a mirrored PDF", async (t) => {
  stubFetch(t, { [PDF_URL]: PDF });
  const sandbox = sandboxWith(["publications.json", "team.json"]);
  const fields = parseFixture("publication-valid.md");
  fields["Primary link (DOI / publisher URL)"] = PDF_URL;
  const plan = publication.buildPlan(fields);
  assert.equal(plan.ok, true);

  const result = await publication.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  const localPdf = `/publications/${plan.slug}/2-14-steven-ravary.pdf`;
  const entry = JSON.parse(fs.readFileSync(path.join(sandbox, "src/data/publications.json")))
    .flatMap((bucket) => bucket.items)
    .find((item) => item.slug === plan.slug);
  assert.equal(entry.link, localPdf);
  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.ok(markdown.includes(`[Primary link](${localPdf})`));
});

test("oversized or unsupported attachments are rejected before anything is written", async (t) => {
  const tooBig = "https://github.com/user-attachments/files/1/huge.pdf";
  const svgUrl = "https://github.com/user-attachments/files/2/logo.svg";
  stubFetch(t, {
    [tooBig]: () =>
      new Response(PDF, {
        headers: { "content-length": String(Math.round(MAX_ATTACHMENT_BYTES * 1.25)) },
      }),
    [svgUrl]: SVG,
    [IMAGE_URL]: PNG,
  });
  const sandbox = sandboxWith(["news.json"]);
  const before = fs.readFileSync(path.join(sandbox, "src/data/news.json"), "utf8");
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] =
    `![ok](${IMAGE_URL})\n\n[big](${tooBig})\n\n[logo](${svgUrl})`;
  const plan = news.buildPlan(fields);

  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, false);
  assert.equal(result.errors.length, 2, JSON.stringify(result.errors));
  assert.equal(result.investigate, false, "the contributor can fix these; no maintainer ping");
  assert.match(result.errors[0], /huge\.pdf is 12\.5 MB, over the 10 MB limit/);
  assert.match(result.errors[1], /logo\.svg is not a supported file type/);
  assert.equal(fs.readFileSync(path.join(sandbox, "src/data/news.json"), "utf8"), before);
  assert.equal(fs.existsSync(path.join(sandbox, "public")), false, "no partial assets");
  assert.equal(fs.existsSync(path.join(sandbox, "src/content", plan.markdownRel)), false);
});

test("an attachment GitHub will not serve directly is fetched through a signed URL", async (t) => {
  const signed = "https://private-user-images.githubusercontent.com/1/abc.png?jwt=token";
  const previousToken = process.env.GITHUB_TOKEN;
  process.env.GITHUB_TOKEN = "test-token";
  t.after(() => {
    if (previousToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  });
  const calls = stubFetch(t, {
    [IMAGE_URL]: () =>
      new Response("<html>Sign in</html>", { headers: { "content-type": "text/html" } }),
    "https://api.github.com/markdown": () => new Response(`<p><img src="${signed}"></p>`),
    [signed]: PNG,
  });
  const sandbox = sandboxWith(["news.json"]);
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] = `![poster](${IMAGE_URL})`;
  const plan = news.buildPlan(fields);

  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.deepEqual(
    calls.map((c) => c.url),
    [IMAGE_URL, "https://api.github.com/markdown", signed]
  );
  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.ok(!markdown.includes(signed), "the expiring signed URL never reaches content");
});

/** Run `fn` with GITHUB_TOKEN set, restoring the previous value afterwards. */
function withToken(t) {
  const previousToken = process.env.GITHUB_TOKEN;
  process.env.GITHUB_TOKEN = "test-token";
  t.after(() => {
    if (previousToken === undefined) delete process.env.GITHUB_TOKEN;
    else process.env.GITHUB_TOKEN = previousToken;
  });
}

// For `files/` URLs the Markdown API echoes the same URL back, as GitHub does.
const echoMarkdownApi = (url) => () => new Response(`<p><img src="${url}"></p>`);

test("formatSize reports small files in B or KB and large ones in MB", () => {
  assert.equal(formatSize(329), "329 B");
  assert.equal(formatSize(4782), "4.7 KB");
  assert.equal(formatSize(5067245), "4.8 MB");
});

test("a just-uploaded attachment that 404s at first is retried until it is served", async (t) => {
  withToken(t);
  let pdfHits = 0;
  stubFetch(t, {
    [PDF_URL]: () => (++pdfHits <= 3 ? new Response("", { status: 404 }) : new Response(PDF)),
    "https://api.github.com/markdown": echoMarkdownApi(PDF_URL),
  });
  const sandbox = sandboxWith(["news.json"]);
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] = `[poster](${PDF_URL})`;
  const plan = news.buildPlan(fields);

  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  // Attempt 1: direct and signed fallback both 404. Attempt 2: direct 404, fallback served.
  assert.equal(pdfHits, 4);
});

test("an attachment that never becomes available fails after ten retries and asks for a maintainer", async (t) => {
  withToken(t);
  let pdfHits = 0;
  stubFetch(t, {
    [PDF_URL]: () => {
      pdfHits++;
      return new Response("", { status: 404, statusText: "Not Found" });
    },
    "https://api.github.com/markdown": echoMarkdownApi(PDF_URL),
  });
  const sandbox = sandboxWith(["news.json"]);
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] = `[poster](${PDF_URL})`;
  const plan = news.buildPlan(fields);

  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, false);
  assert.equal(result.investigate, true);
  assert.match(result.errors[0], /\(404 Not Found\) after 10 retries\.$/);
  assert.equal(pdfHits, 2 * (DOWNLOAD_RETRY.retries + 1), "one first try plus ten retries");
  assert.equal(fs.existsSync(path.join(sandbox, "public")), false);
});

test("a refusal that waiting cannot fix is not retried", async (t) => {
  withToken(t);
  let pdfHits = 0;
  stubFetch(t, {
    [PDF_URL]: () => {
      pdfHits++;
      return new Response("", { status: 403, statusText: "Forbidden" });
    },
    "https://api.github.com/markdown": echoMarkdownApi(PDF_URL),
  });
  const sandbox = sandboxWith(["news.json"]);
  const fields = parseFixture("news-valid.md");
  fields["Full content (Markdown)"] = `[poster](${PDF_URL})`;

  const result = await news.apply(sandbox, news.buildPlan(fields));
  assert.equal(result.ok, false);
  assert.equal(result.investigate, true);
  assert.equal(pdfHits, 2, "direct try and signed fallback, once");
});
