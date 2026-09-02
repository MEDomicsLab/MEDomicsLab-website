#!/usr/bin/env node
/**
 * Verifies that every team avatar referenced from team.json has the
 * responsive variants AvatarImage.jsx expects: <base>-{80,128,160,256}.{avif,webp}
 *
 * Exits 1 if any are missing.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");

const teamPath = path.join(root, "src/data/team.json");
const team = JSON.parse(fs.readFileSync(teamPath, "utf8"));

const SIZES = [80, 128, 160, 256];
const FORMATS = ["avif", "webp"];

const missing = [];

const collectImages = (data) => {
  const images = [];
  for (const cohort of data) {
    for (const member of cohort.members ?? []) {
      if (member.image) images.push(member.image);
    }
  }
  return images;
};

for (const image of collectImages(team)) {
  if (!image.startsWith("/")) continue;
  const dotIndex = image.lastIndexOf(".");
  if (dotIndex === -1) continue;
  const base = image.slice(0, dotIndex);
  for (const size of SIZES) {
    for (const format of FORMATS) {
      const variant = `${base}-${size}.${format}`;
      const fsPath = path.join(root, "public", variant);
      if (!fs.existsSync(fsPath)) missing.push(variant);
    }
  }
}

if (missing.length > 0) {
  console.error(`Missing ${missing.length} avatar variant(s):`);
  for (const m of missing) console.error(`  - ${m}`);
  process.exit(1);
}

console.log("All avatar variants present.");
