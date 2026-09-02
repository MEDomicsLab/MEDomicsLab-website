#!/usr/bin/env node
/**
 * Validate every JSON file under src/data against its sibling schema in
 * src/data/_schemas/<name>.schema.json. Run via `npm run lint:schemas`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

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
  ["visions.json", "visions.schema.json"],
];

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

let failed = false;
for (const [dataFile, schemaFile] of pairs) {
  const dataPath = path.join(dataDir, dataFile);
  const schemaPath = path.join(schemaDir, schemaFile);
  if (!fs.existsSync(dataPath) || !fs.existsSync(schemaPath)) {
    console.error(`Missing pair: ${dataFile} <-> ${schemaFile}`);
    failed = true;
    continue;
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
  const validate = ajv.compile(schema);
  if (!validate(data)) {
    failed = true;
    console.error(`✗ ${dataFile} fails ${schemaFile}:`);
    for (const err of validate.errors ?? []) {
      console.error(`    ${err.instancePath || "(root)"} ${err.message}`);
    }
  } else {
    console.log(`✓ ${dataFile}`);
  }
}

if (failed) process.exit(1);
console.log(`All ${pairs.length} data files match their schemas.`);
