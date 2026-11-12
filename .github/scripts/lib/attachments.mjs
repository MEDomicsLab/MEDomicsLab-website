import fs from "node:fs";
import path from "node:path";

import { slugify } from "./slug.mjs";
import { ensureDir } from "./data-store.mjs";

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export const GITHUB_ATTACHMENT_RE =
  /^https?:\/\/(?:github\.com\/user-attachments\/|user-images\.githubusercontent\.com\/|private-user-images\.githubusercontent\.com\/)/i;

const ATTACHMENT_URL_GLOBAL_RE =
  /https?:\/\/(?:github\.com\/user-attachments\/(?:assets|files)\/|user-images\.githubusercontent\.com\/|private-user-images\.githubusercontent\.com\/)[^\s)"'<>\]]+/gi;

const PUBLIC_DIRS = {
  image: (slug) => `images/albums/${slug}`,
  pdf: (slug) => `publications/${slug}`,
};

const USER_AGENT = { "user-agent": "medomicslab-issue-to-pr" };

// GitHub only serves images through a signed URL, found in the Markdown API's rendered <img>.
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

export function findAttachmentUrls(text) {
  const urls = (text || "").match(ATTACHMENT_URL_GLOBAL_RE) ?? [];
  return [...new Set(urls.map((url) => url.replace(/[.,;:!?]+$/, "")))];
}

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

// Without ATTACHMENTS_TOKEN, a PDF next to an image 404s until the issue gets a comment.
export const DOWNLOAD_RETRY = { retries: 10, delayMs: 20000 };

class AttachmentRejectedError extends Error {}

export const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isFile = (res) => res?.ok && !/text\/html/i.test(res.headers.get("content-type") || "");

// GITHUB_TOKEN counts as anonymous here; only a personal token gets unpublished files.
// The token goes to github.com only, never to the storage host it redirects to.
async function fetchWithToken(url) {
  const token = process.env.ATTACHMENTS_TOKEN || process.env.GITHUB_TOKEN;
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

async function fetchAttachmentOnce(url) {
  const authenticated = await fetchWithToken(url);
  if (isFile(authenticated)) return authenticated;
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

function baseNameFromUrl(url) {
  const last = new URL(url).pathname.split("/").pop() || "";
  let decoded;
  try {
    decoded = decodeURIComponent(last);
  } catch {
    decoded = last;
  }
  const ext = path.extname(decoded);
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
