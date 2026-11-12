/**
 * Copy files that contributors drag into an issue form (GitHub user
 * attachments) into the repository, and point the generated content at the
 * local copies instead of GitHub's attachment storage.
 *
 * Only PNG, JPEG, GIF, WebP, and PDF are accepted, detected from the file's
 * bytes rather than its name. Each file must be at most 10 MB.
 *
 *   images → public/images/albums/<slug>/<name>.<ext>   (served at /images/albums/…)
 *   PDFs   → public/publications/<slug>/<name>.pdf       (served at /publications/…)
 */
import fs from "node:fs";
import path from "node:path";

import { slugify } from "./slug.mjs";
import { ensureDir } from "./data-store.mjs";

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const GITHUB_ATTACHMENT_RE =
  /^https?:\/\/(?:github\.com\/user-attachments\/|user-images\.githubusercontent\.com\/|private-user-images\.githubusercontent\.com\/)/i;

// Matches attachment URLs wherever GitHub puts them: Markdown images and links,
// `<img src="…">`, or a bare URL. Stops at characters that close those forms.
const ATTACHMENT_URL_GLOBAL_RE =
  /https?:\/\/(?:github\.com\/user-attachments\/(?:assets|files)\/|user-images\.githubusercontent\.com\/|private-user-images\.githubusercontent\.com\/)[^\s)"'<>\]]+/gi;

const PUBLIC_DIRS = {
  image: (slug) => `images/albums/${slug}`,
  pdf: (slug) => `publications/${slug}`,
};

const USER_AGENT = { "user-agent": "medomicslab-issue-to-pr" };

/**
 * Exchange a GitHub user-attachment URL for a short-lived signed download URL.
 * Attachments of type "assets" (images) are not always downloadable without
 * this step; the Markdown API returns the signed URL in the rendered `<img>`.
 */
export async function resolveSignedAttachmentUrl(rawUrl) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GitHub user-attachment URLs require GITHUB_TOKEN to be exposed to the workflow step."
    );
  }
  const repo = process.env.GITHUB_REPOSITORY || "";
  const apiBase = process.env.GITHUB_API_URL || "https://api.github.com";
  const res = await fetch(`${apiBase}/markdown`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
      ...USER_AGENT,
    },
    body: JSON.stringify({
      text: `![attachment](${rawUrl})`,
      mode: repo ? "gfm" : "markdown",
      context: repo || undefined,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `Could not resolve user-attachment URL via Markdown API (${res.status} ${res.statusText}).`
    );
  }
  const html = await res.text();
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(html);
  if (!match) {
    throw new Error("Markdown API did not return a signed URL for the attachment.");
  }
  return match[1];
}

/** Every distinct GitHub attachment URL in `text`, in order of appearance. */
export function findAttachmentUrls(text) {
  const urls = (text || "").match(ATTACHMENT_URL_GLOBAL_RE) ?? [];
  // A URL at the end of a sentence picks up the full stop; drop it.
  return [...new Set(urls.map((url) => url.replace(/[.,;:!?]+$/, "")))];
}

/** Identify a supported file type from its leading bytes. */
export function detectFileType(buffer) {
  const starts = (bytes, offset = 0) =>
    buffer.length >= offset + bytes.length && bytes.every((byte, i) => buffer[offset + i] === byte);
  const ascii = (str, offset = 0) => starts([...Buffer.from(str, "ascii")], offset);

  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    return { kind: "image", ext: "png" };
  if (starts([0xff, 0xd8, 0xff])) return { kind: "image", ext: "jpg" };
  if (ascii("GIF87a") || ascii("GIF89a")) return { kind: "image", ext: "gif" };
  if (ascii("RIFF") && ascii("WEBP", 8)) return { kind: "image", ext: "webp" };
  if (ascii("%PDF-")) return { kind: "pdf", ext: "pdf" };
  return null;
}

const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function downloadAttachment(url) {
  const tooLarge = (bytes) =>
    new Error(
      `Attachment ${url} is ${formatMb(bytes)}, over the ${MAX_ATTACHMENT_BYTES / 1024 / 1024} MB limit. Compress it or link to it instead.`
    );

  // Public-repository attachments usually download directly. Fall back to a
  // signed URL when GitHub answers with an error or a sign-in page.
  let res = await fetch(url, { headers: USER_AGENT, redirect: "follow" });
  if (!res.ok || /text\/html/i.test(res.headers.get("content-type") || "")) {
    res = await fetch(await resolveSignedAttachmentUrl(url), {
      headers: USER_AGENT,
      redirect: "follow",
    });
  }
  if (!res.ok) {
    throw new Error(`Could not download attachment ${url} (${res.status} ${res.statusText}).`);
  }
  const declared = Number(res.headers.get("content-length"));
  if (declared > MAX_ATTACHMENT_BYTES) throw tooLarge(declared);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length > MAX_ATTACHMENT_BYTES) throw tooLarge(buffer.length);
  return buffer;
}

/** A readable file name from the URL, e.g. `.../files/123/2-14_Poster.pdf` → `2-14-poster`. */
function baseNameFromUrl(url) {
  const last = new URL(url).pathname.split("/").pop() || "";
  let decoded = last;
  try {
    decoded = decodeURIComponent(last);
  } catch {
    // keep the raw segment
  }
  const ext = path.extname(decoded);
  // `assets/<uuid>` uploads carry no original name; a UUID is not a useful one.
  if (!ext) return "";
  return slugify(decoded.slice(0, -ext.length));
}

function uniqueFileName(dir, base, ext, taken) {
  for (let n = 1; ; n++) {
    const name = `${n === 1 ? base : `${base}-${n}`}.${ext}`;
    const full = path.join(dir, name);
    if (!taken.has(full) && !fs.existsSync(full)) {
      taken.add(full);
      return name;
    }
  }
}

/**
 * Download every GitHub attachment referenced in `text`, save it under
 * `public/`, and return the text rewritten to use the local paths.
 *
 * Nothing is written unless every attachment downloads and passes the checks,
 * so a rejected file never leaves a partial set behind.
 *
 * @returns {Promise<{ok: true, text: string, urlMap: Map<string,string>, paths: string[], summary: string[]}
 *                  | {ok: false, errors: string[]}>}
 */
export async function mirrorAttachments(root, text, { slug }) {
  const urls = findAttachmentUrls(text);
  if (!urls.length) return { ok: true, text, urlMap: new Map(), paths: [], summary: [] };

  const errors = [];
  const downloads = [];
  for (const url of urls) {
    try {
      const buffer = await downloadAttachment(url);
      const type = detectFileType(buffer);
      if (!type) {
        errors.push(
          `Attachment ${url} is not a supported file type. Use PNG, JPG, GIF, WebP, or PDF.`
        );
        continue;
      }
      downloads.push({ url, buffer, type });
    } catch (err) {
      errors.push(err.message);
    }
  }
  if (errors.length) return { ok: false, errors };

  const urlMap = new Map();
  const paths = [];
  const summary = [];
  const taken = new Set();
  const counters = { image: 0, pdf: 0 };
  for (const { url, buffer, type } of downloads) {
    counters[type.kind] += 1;
    const publicDir = PUBLIC_DIRS[type.kind](slug);
    const diskDir = path.join(root, "public", publicDir);
    const base =
      baseNameFromUrl(url) ||
      `${type.kind === "pdf" ? "document" : "image"}-${counters[type.kind]}`;
    const name = uniqueFileName(diskDir, base, type.ext, taken);
    ensureDir(diskDir);
    const diskPath = path.join(diskDir, name);
    fs.writeFileSync(diskPath, buffer);
    const publicPath = `/${publicDir}/${name}`;
    urlMap.set(url, publicPath);
    paths.push(diskPath);
    summary.push(`- \`${publicPath}\` (${formatMb(buffer.length)}) ← ${url}`);
  }

  let rewritten = text;
  // Replace longer URLs first so a URL that prefixes another cannot clobber it.
  for (const url of [...urlMap.keys()].sort((a, b) => b.length - a.length)) {
    rewritten = rewritten.split(url).join(urlMap.get(url));
  }
  return { ok: true, text: rewritten, urlMap, paths, summary };
}
