import fs from "node:fs";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const TEMPLATE_FILES = {
  event: "add_event.yaml",
  news: "add_news.yaml",
  publication: "add_publication.yaml",
  team: "add_team_member.yaml",
};
const cache = new Map();

/** Read answer labels in display order directly from the selected Issue Form. */
export function getIssueFormFields(kind) {
  if (cache.has(kind)) return cache.get(kind);
  const filename = TEMPLATE_FILES[kind];
  if (!filename) throw new Error(`Unknown issue form: ${kind}`);
  const file = fileURLToPath(new URL(`../../ISSUE_TEMPLATE/${filename}`, import.meta.url));
  const form = yaml.load(fs.readFileSync(file, "utf8"), { schema: yaml.JSON_SCHEMA });
  const labels = form.body
    .filter((field) => field.type !== "markdown")
    .map((field) => field.attributes.label);
  if (
    !labels.length ||
    labels.some((label) => typeof label !== "string" || !label.trim()) ||
    new Set(labels).size !== labels.length
  ) {
    throw new Error(`Issue form ${filename} must have unique, non-empty answer labels.`);
  }
  cache.set(kind, Object.freeze(labels));
  return cache.get(kind);
}
