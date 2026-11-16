#!/usr/bin/env node
/**
 * Verifies that every homepage "Where next?" card referenced from
 * research-projects.json (`homeCard`) exists, is named after its project slug,
 * and has the responsive variants NextSteps.jsx requests: <base>-{480,880}.webp
 *
 * Generate missing variants with: node scripts/optimise-homepage-images.mjs
 *
 * Exits 1 if anything is missing or misnamed.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");

const projects = JSON.parse(
  fs.readFileSync(path.join(root, "src/data/research-projects.json"), "utf8")
);

const SIZES = [480, 880];
const problems = [];

for (const { slug, homeCard } of projects) {
  if (!homeCard) continue;
  const expected = `/images/homepage-neue/next/${slug}.webp`;
  if (homeCard !== expected) {
    problems.push(`${slug}: homeCard should be ${expected} (got ${homeCard})`);
    continue;
  }
  const base = homeCard.slice(0, -".webp".length);
  for (const file of [homeCard, ...SIZES.map((size) => `${base}-${size}.webp`)]) {
    if (!fs.existsSync(path.join(root, "public", file))) problems.push(`${slug}: missing ${file}`);
  }
}

if (problems.length > 0) {
  console.error(`Found ${problems.length} homepage card problem(s):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

const withoutCard = projects.filter((project) => !project.homeCard).map((p) => p.slug);
console.log(
  `All homepage cards present.${
    withoutCard.length ? ` Not in the carousel (no homeCard): ${withoutCard.join(", ")}.` : ""
  }`
);
