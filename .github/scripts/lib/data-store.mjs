import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const PRINT_WIDTH = 100;

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

async function formatGeneratedContent(source, file, parser) {
  // Resolve the same repository configuration that the Prettier CLI uses,
  // rather than duplicating formatting rules in the automation.
  const config = (await prettier.resolveConfig(path.join(repoRoot, "package.json"))) ?? {};
  return prettier.format(source, { ...config, filepath: file, parser });
}

export async function writeJson(file, data) {
  const source = fs.readFileSync(file, "utf8");
  const original = parseJsonNode(source, 0).node;
  const rendered = renderJson(data, original, 0);
  const output = await formatGeneratedContent(rendered, file, "json");
  fs.writeFileSync(file, output.endsWith("\n") ? output : output + "\n", "utf8");
}

/**
 * The content data files contain hand-formatted JSON. Re-serialising their
 * complete object graph rewrites unrelated entries (notably short arrays),
 * which makes generated content PRs noisy. Keep byte-for-byte source text for
 * nodes whose values have not changed, and format only new or changed parents.
 */
function parseJsonNode(source, index) {
  let cursor = skipWhitespace(source, index);
  const start = cursor;
  const char = source[cursor];

  if (char === "{") {
    cursor = skipWhitespace(source, cursor + 1);
    const properties = new Map();
    const value = {};
    while (source[cursor] !== "}") {
      const key = parseJsonString(source, cursor);
      cursor = skipWhitespace(source, key.end);
      if (source[cursor] !== ":") throw new Error(`Expected ':' at position ${cursor}.`);
      const parsed = parseJsonNode(source, cursor + 1);
      value[key.value] = parsed.node.value;
      properties.set(key.value, parsed.node);
      cursor = skipWhitespace(source, parsed.next);
      if (source[cursor] === ",") cursor = skipWhitespace(source, cursor + 1);
      else if (source[cursor] !== "}") throw new Error(`Expected '}' at position ${cursor}.`);
    }
    return { node: { source, start, end: cursor + 1, value, properties }, next: cursor + 1 };
  }

  if (char === "[") {
    cursor = skipWhitespace(source, cursor + 1);
    const children = [];
    const value = [];
    while (source[cursor] !== "]") {
      const parsed = parseJsonNode(source, cursor);
      children.push(parsed.node);
      value.push(parsed.node.value);
      cursor = skipWhitespace(source, parsed.next);
      if (source[cursor] === ",") cursor = skipWhitespace(source, cursor + 1);
      else if (source[cursor] !== "]") throw new Error(`Expected ']' at position ${cursor}.`);
    }
    return { node: { source, start, end: cursor + 1, value, children }, next: cursor + 1 };
  }

  if (char === '"') {
    const parsed = parseJsonString(source, cursor);
    return { node: { source, start, end: parsed.end, value: parsed.value }, next: parsed.end };
  }

  const match = /^(?:true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/.exec(source.slice(cursor));
  if (!match) throw new Error(`Unexpected JSON token at position ${cursor}.`);
  const end = cursor + match[0].length;
  return { node: { source, start, end, value: JSON.parse(match[0]) }, next: end };
}

function parseJsonString(source, index) {
  let cursor = index + 1;
  while (cursor < source.length) {
    if (source[cursor] === "\\") cursor += 2;
    else if (source[cursor++] === '"') {
      const end = cursor;
      return { value: JSON.parse(source.slice(index, end)), end };
    }
  }
  throw new Error("Unterminated JSON string.");
}

function skipWhitespace(source, index) {
  while (/\s/.test(source[index])) index++;
  return index;
}

function renderJson(value, original, level, inlineWidth = 0) {
  if (original && deepEqual(value, original.value)) {
    return originalSourceSlice(original);
  }

  const indent = "  ".repeat(level);
  const nextIndent = "  ".repeat(level + 1);

  if (Array.isArray(value)) {
    if (!value.length) return "[]";
    const inline = `[${value.map((item) => JSON.stringify(item)).join(", ")}]`;
    if (
      value.every((item) => item === null || typeof item !== "object") &&
      inline.length <= inlineWidth
    ) {
      return inline;
    }
    const available = original?.children ? [...original.children] : [];
    const items = value.map((item) => {
      const matching = takeMatchingNode(available, item);
      return `${nextIndent}${renderJson(item, matching, level + 1, PRINT_WIDTH - nextIndent.length)}`;
    });
    return `[\n${items.join(",\n")}\n${indent}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return "{}";
    const properties = entries.map(([key, item]) => {
      const matching = original?.properties?.get(key);
      const keyText = JSON.stringify(key);
      const width = PRINT_WIDTH - nextIndent.length - keyText.length - 2;
      return `${nextIndent}${keyText}: ${renderJson(item, matching, level + 1, width)}`;
    });
    return `{\n${properties.join(",\n")}\n${indent}}`;
  }

  return JSON.stringify(value);
}

function takeMatchingNode(nodes, value) {
  const index = nodes.findIndex((node) => deepEqual(node.value, value));
  return index === -1 ? undefined : nodes.splice(index, 1)[0];
}

function deepEqual(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function originalSourceSlice(node) {
  return node.source.slice(node.start, node.end);
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export async function writeMarkdown(file, content) {
  ensureDir(path.dirname(file));
  const output = await formatGeneratedContent(content, file, "markdown");
  fs.writeFileSync(file, output.endsWith("\n") ? output : output + "\n", "utf8");
}

export function monthName(isoDate) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m || !isValidIsoDate(isoDate)) throw new Error(`Invalid ISO date: ${isoDate}`);
  return MONTH_NAMES[Number(m[2]) - 1];
}

/** Return whether a value is a real Gregorian calendar date in YYYY-MM-DD form. */
export function isValidIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/**
 * Insert a publication entry into the publications.json structure.
 * Returns the updated array. Mutates a deep copy so callers can diff.
 */
export function insertPublication(arr, year, item) {
  const next = JSON.parse(JSON.stringify(arr));
  let bucket = next.find((b) => b.year === year);
  if (!bucket) {
    bucket = { year, items: [] };
    next.unshift(bucket);
    next.sort((a, b) => b.year.localeCompare(a.year));
  }
  if (bucket.items.some((p) => p.slug === item.slug)) {
    throw new Error(`Slug already exists in publications.json: ${item.slug}`);
  }
  bucket.items.push(item);
  bucket.items.sort((a, b) => (a.date < b.date ? 1 : -1));
  return next;
}

/**
 * Insert a community item (news or event) into a year/months tree.
 * `month` is the human-readable month name; entries are inserted in the
 * most-recent-first order callers already use.
 */
export function insertCommunityItem(arr, { year, month, item }) {
  const next = JSON.parse(JSON.stringify(arr));
  let yearBucket = next.find((y) => y.year === year);
  if (!yearBucket) {
    yearBucket = { year, months: [] };
    next.unshift(yearBucket);
    next.sort((a, b) => b.year.localeCompare(a.year));
  }
  let monthBucket = yearBucket.months.find((m) => m.month === month);
  if (!monthBucket) {
    monthBucket = { month, items: [] };
    yearBucket.months.unshift(monthBucket);
  }
  if (monthBucket.items.some((i) => i.slug === item.slug)) {
    throw new Error(`Slug already exists: ${item.slug}`);
  }
  monthBucket.items.push(item);
  return next;
}

/**
 * Insert a member into a team.json cohort, creating the cohort if needed.
 */
export function insertTeamMember(arr, cohort, member) {
  const next = JSON.parse(JSON.stringify(arr));
  let bucket = next.find((c) => c.year === cohort);
  if (!bucket) {
    bucket = { year: cohort, members: [] };
    next.push(bucket);
  }
  if (bucket.members.some((m) => m.slug === member.slug)) {
    throw new Error(`Slug already exists in team.json: ${member.slug}`);
  }
  bucket.members.push(member);
  return next;
}
