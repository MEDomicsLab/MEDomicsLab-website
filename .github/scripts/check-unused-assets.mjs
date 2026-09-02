#!/usr/bin/env node
/**
 * Flags files under public/images/** that are not referenced anywhere in
 * src/data, src/content, src/**.{js,jsx,css}, or index.html.
 *
 * Smart matching:
 * - For files matching <base>-<size>.<ext>, also looks for the canonical
 *   <base>.<ext> reference (since AvatarImage / SkeletonImage derive variants
 *   at runtime from the canonical filename).
 * - Ignores _index.md (legacy Hugo bio frontmatter, not consumed by React).
 *
 * Exits 1 if unused assets are found.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"]);
const SEARCH_DIRS = ["src", "index.html"];

// Optional allow-list of image paths (relative to public/, leading slash) that
// should be ignored by this checker — e.g. assets staged for upcoming content.
const ignoreFile = path.join(root, ".unused-assets-ignore");
const allowList = new Set(
  fs.existsSync(ignoreFile)
    ? fs
        .readFileSync(ignoreFile, "utf8")
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#"))
    : []
);

const walk = (dir, out = []) => {
  if (!fs.existsSync(dir)) return out;
  const stat = fs.statSync(dir);
  if (stat.isFile()) {
    out.push(dir);
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
};

// Concatenate all source files into one big haystack.
const haystackParts = [];
for (const rel of SEARCH_DIRS) {
  for (const file of walk(path.join(root, rel))) {
    try {
      haystackParts.push(fs.readFileSync(file, "utf8"));
    } catch {
      // binary or unreadable -> skip
    }
  }
}
const haystack = haystackParts.join("\n");

const publicImages = walk(path.join(root, "public/images"));
const unused = [];

const VARIANT_RE = /-(\d{2,4})$/;

for (const filePath of publicImages) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTS.has(ext)) continue;
  const base = path.basename(filePath, ext);
  if (base === "_index") continue;

  const publicRel =
    "/" + path.relative(path.join(root, "public"), filePath).split(path.sep).join("/");
  const publicRelNoSlash = publicRel.slice(1);

  if (allowList.has(publicRel)) continue;

  // Direct reference?
  if (haystack.includes(publicRel) || haystack.includes(publicRelNoSlash)) continue;

  // Variant fallback: foo-128.webp -> look for foo.<ext> referenced
  const variantMatch = base.match(VARIANT_RE);
  if (variantMatch) {
    const canonicalBase = base.slice(0, -variantMatch[0].length);
    const dir = path.dirname(publicRel);
    // Try same ext and common source exts (jpg, png) since variants are derived.
    const candidates = [ext, ".jpg", ".jpeg", ".png"];
    let found = false;
    for (const candidateExt of candidates) {
      const canonical = `${dir}/${canonicalBase}${candidateExt}`;
      if (haystack.includes(canonical)) {
        found = true;
        break;
      }
    }
    if (found) continue;
  }

  unused.push(publicRel);
}

if (unused.length > 0) {
  console.error(`Found ${unused.length} unused image(s) under public/images:`);
  for (const u of unused) console.error(`  - ${u}`);
  process.exit(1);
}

console.log("No unused images detected.");
