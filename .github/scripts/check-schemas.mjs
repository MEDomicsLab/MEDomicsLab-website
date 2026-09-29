#!/usr/bin/env node
/**
 * Validate every JSON file under src/data against its sibling schema in
 * src/data/_schemas/<name>.schema.json, and check article references.
 * Run via `npm run lint:schemas`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { communityOrderProblems } from "./lib/data-store.mjs";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");
const dataDir = path.join(root, "src/data");
const schemaDir = path.join(dataDir, "_schemas");

const pairs = [
  ["publications.json", "publications.schema.json"],
  ["news.json", "news.schema.json"],
  ["events.json", "events.schema.json"],
  ["courses.json", "courses.schema.json"],
  ["research-projects.json", "research-projects.schema.json"],
  ["research-tracks.json", "research-tracks.schema.json"],
  ["team.json", "team.schema.json"],
  ["home.json", "home.schema.json"],
  ["layout.json", "layout.schema.json"],
  ["theme.json", "theme.schema.json"],
  ["seo.json", "seo.schema.json"],
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let failed = false;
const markdownReferences = new Set();
function collectMarkdownReferences(value) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (key === "markdown" && typeof child === "string") {
      markdownReferences.add(child.replace(/^\/src\/content\/|^\.\/?/, ""));
    } else {
      collectMarkdownReferences(child);
    }
  }
}

for (const [dataFile, schemaFile] of pairs) {
  const dataPath = path.join(dataDir, dataFile);
  const schemaPath = path.join(schemaDir, schemaFile);
  if (!fs.existsSync(dataPath) || !fs.existsSync(schemaPath)) {
    console.error(`Missing pair: ${dataFile} <-> ${schemaFile}`);
    failed = true;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  collectMarkdownReferences(data);
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    failed = true;
    console.error(`✗ ${dataFile} fails ${schemaFile}:`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
  } else if (dataFile === "news.json" || dataFile === "events.json") {
    const problems = communityOrderProblems(data);
    if (problems.length) {
      failed = true;
      console.error(`✗ ${dataFile} is out of chronological order:`);
      for (const problem of problems) console.error(`    ${problem}`);
    } else {
      console.log(`✓ ${dataFile}`);
    }
  } else {
    console.log(`✓ ${dataFile}`);
  }
}

const contentDir = path.join(root, "src/content");
const articles = new Set(
  fs
    .readdirSync(contentDir, { recursive: true })
    .map((file) => file.split(path.sep).join("/"))
    .filter((file) => file.endsWith(".md") && !file.startsWith("_templates/"))
);
for (const reference of markdownReferences) {
  if (!articles.has(reference)) {
    console.error(`Missing article referenced in JSON: ${reference}`);
    failed = true;
  }
}
for (const article of articles) {
  if (!markdownReferences.has(article)) {
    console.error(`Unused article not referenced in JSON: ${article}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(
  `All ${pairs.length} data files match their schemas; ${articles.size} articles are referenced.`
);
