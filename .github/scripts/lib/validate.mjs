import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const __filename = fileURLToPath(import.meta.url);
const here = path.dirname(__filename);
const schemaDir = path.resolve(here, "..", "..", "..", "src", "data", "_schemas");

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const cache = new Map();

export function getValidator(schemaFile) {
  if (cache.has(schemaFile)) return cache.get(schemaFile);
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, schemaFile), "utf8"));
  const validate = ajv.compile(schema);
  cache.set(schemaFile, validate);
  return validate;
}

/**
 * Validate `data` against `schemaFile` and return either {ok: true} or
 * {ok: false, errors: [...human-readable strings]}.
 */
export function validateAgainst(schemaFile, data) {
  const validate = getValidator(schemaFile);
  if (validate(data)) return { ok: true };
  const errors = (validate.errors ?? []).map((e) => `${e.instancePath || "(root)"} ${e.message}`);
  return { ok: false, errors };
}
