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

/**
 * Downloads are authenticated (see `fetchWithToken`), so a file is normally
 * served at the first attempt. Retries are a safety net for transient GitHub
 * errors: ten retries 20 s apart keep trying for about 3.5 minutes.
 * Tests lower `delayMs`.
 */
export const DOWNLOAD_RETRY = { retries: 10, delayMs: 20000 };

/** The contributor's file breaks a rule (size); fixing the issue resolves it. */
class AttachmentRejectedError extends Error {}

export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isFile = (res) => res?.ok && !/text\/html/i.test(res.headers.get("content-type") || "");

/**
 * A `github.com/user-attachments/…` URL answers 404 to anonymous requests
 * until GitHub makes the file public, which took minutes after the issue was
 * posted in live tests; with a token it is served at once. The token is sent
 * to github.com only: the redirect to GitHub's storage host is followed
 * without it.
 */
async function fetchWithToken(url) {
  const token = process.env.GITHUB_TOKEN;
  if (!token || new URL(url).hostname !== "github.com") return null;
  const res = await fetch(url, {
    headers: { ...USER_AGENT, authorization: `Bearer ${token}` },
    redirect: "manual",
  });
  const location = res.headers.get("location");
  if (res.status >= 300 && res.status < 400 && location) {
    return fetch(new URL(location, url), { headers: USER_AGENT, redirect: "follow" });
  }
  return res;
}

/** One download attempt. Returns the response, which may be an error status. */
async function fetchAttachmentOnce(url) {
  const authenticated = await fetchWithToken(url);
  if (isFile(authenticated)) return authenticated;
  // Without a usable token, a public attachment may still download directly.
  // Fall back to a signed URL when GitHub answers with an error or a sign-in page.
  const res = await fetch(url, { headers: USER_AGENT, redirect: "follow" });
  if (isFile(res)) return res;
  return fetch(await resolveSignedAttachmentUrl(url), {
    headers: USER_AGENT,
    redirect: "follow",
  });
}

async function downloadAttachment(url) {
  const tooLarge = (bytes) =>
    new AttachmentRejectedError(
      `Attachment ${url} is ${formatSize(bytes)}, over the ${MAX_ATTACHMENT_BYTES / 1024 / 1024} MB limit. Compress it or link to it instead.`
    );

  let res;
  let lastProblem = "";
  for (let attempt = 0; attempt <= DOWNLOAD_RETRY.retries; attempt++) {
    if (attempt > 0) await sleep(DOWNLOAD_RETRY.delayMs);
    try {
      res = await fetchAttachmentOnce(url);
      if (res.ok) break;
      lastProblem = `${res.status} ${res.statusText}`;
      // Only "not there yet" and server-side failures can heal by waiting.
      if (res.status !== 404 && res.status !== 429 && res.status < 500) break;
    } catch (err) {
      res = undefined;
      lastProblem = err.message;
    }
  }
  if (!res?.ok) {
    throw new Error(
      `Could not download attachment ${url} (${lastProblem}) after ${DOWNLOAD_RETRY.retries} retries.`
    );
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
 *                  | {ok: false, errors: string[], investigate: boolean}>}
 *   `investigate` is true when a download failed for a reason the contributor
 *   cannot fix (GitHub or pipeline side), so a maintainer should be told.
 */
export async function mirrorAttachments(root, text, { slug }) {
  const urls = findAttachmentUrls(text);
  if (!urls.length) return { ok: true, text, urlMap: new Map(), paths: [], summary: [] };

  const errors = [];
  const downloads = [];
  let investigate = false;
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
      // Anything but a rule the contributor can fix points at GitHub or this
      // pipeline, so a maintainer should look rather than the contributor.
      if (!(err instanceof AttachmentRejectedError)) investigate = true;
    }
  }
  if (errors.length) return { ok: false, errors, investigate };

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
    summary.push(`- \`${publicPath}\` (${formatSize(buffer.length)}) ← ${url}`);
  }

  let rewritten = text;
  // Replace longer URLs first so a URL that prefixes another cannot clobber it.
  for (const url of [...urlMap.keys()].sort((a, b) => b.length - a.length)) {
    rewritten = rewritten.split(url).join(urlMap.get(url));
  }
  return { ok: true, text: rewritten, urlMap, paths, summary };
}
