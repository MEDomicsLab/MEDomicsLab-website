#!/usr/bin/env node
/**
 * Issue → PR pipeline (Option 1: rigid, deterministic, no AI).
 *
 * Reads a GitHub Issue Form submission, parses the body into key/value
 * fields, hands the parsed payload to a per-template handler that
 * - builds a JSON entry conforming to the matching schema in src/data/_schemas/,
 * - renders a markdown skeleton under src/content/<entity>/<slug>.md,
 * - re-validates the resulting JSON tree with Ajv,
 * and writes a machine-readable plan to GITHUB_OUTPUT so the calling
 * workflow can branch / commit / open a PR.
 *
 * Local usage (no GitHub):
 *   node .github/scripts/issue-to-content.mjs --fixture path/to/event.md --label content,publication
 *
 * Workflow usage:
 *   ISSUE_BODY=...  ISSUE_LABELS=content,publication  ISSUE_NUMBER=123
 *   ISSUE_AUTHOR=...  GITHUB_OUTPUT=$GITHUB_OUTPUT
 *   node .github/scripts/issue-to-content.mjs
 *
 * Exit codes:
 *   0  – success (plan + files written, output emitted)
 *   2  – validation failure (errors emitted to GITHUB_OUTPUT for comment)
 *   1  – unexpected error (workflow should fail noisily)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseIssueForm } from "./lib/issue-form-parser.mjs";
import { publication } from "./lib/handlers/publication.mjs";
import { news } from "./lib/handlers/news.mjs";
import { event } from "./lib/handlers/event.mjs";
import { team } from "./lib/handlers/team.mjs";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..", "..");

const HANDLERS = { publication, news, event, team };

function pickHandler(labels) {
  const lower = labels.map((l) => l.toLowerCase());
  for (const key of Object.keys(HANDLERS)) {
    if (lower.includes(key)) return HANDLERS[key];
  }
  return null;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      out[arg.slice(2)] = argv[i + 1];
      i++;
    }
  }
  return out;
}

function setOutput(key, value) {
  const out = process.env.GITHUB_OUTPUT;
  if (!out) {
    console.log(`::set-output name=${key}::${value.replace(/\n/g, "%0A")}`);
    return;
  }
  const isMultiline = String(value).includes("\n");
  if (isMultiline) {
    const eof = `EOF_${Math.random().toString(36).slice(2)}`;
    fs.appendFileSync(out, `${key}<<${eof}\n${value}\n${eof}\n`);
  } else {
    fs.appendFileSync(out, `${key}=${value}\n`);
  }
}

function logErrors(handler, errors) {
  console.error(`✗ ${handler.label} submission rejected:`);
  for (const err of errors) console.error(`  - ${err}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let body = process.env.ISSUE_BODY ?? "";
  const labels = (args.label ?? process.env.ISSUE_LABELS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const issueNumber = process.env.ISSUE_NUMBER ?? args.number ?? "0";
  const issueAuthor = process.env.ISSUE_AUTHOR ?? args.author ?? "unknown";

  if (args.fixture) body = fs.readFileSync(args.fixture, "utf8");

  if (!body) {
    console.error("No issue body provided (set ISSUE_BODY or --fixture).");
    process.exit(1);
  }

  const handler = pickHandler(labels);
  if (!handler) {
    console.log(`No content handler matched labels: ${labels.join(", ") || "(none)"} – skipping.`);
    setOutput("status", "skipped");
    return;
  }

  const fields = parseIssueForm(body);
  const plan = handler.buildPlan(fields);
  if (!plan.ok) {
    logErrors(handler, plan.errors);
    setOutput("status", "invalid");
    setOutput("errors", plan.errors.map((e) => `- ${e}`).join("\n"));
    setOutput("kind", handler.label);
    process.exit(2);
  }

  const fixtureRoot = args.fixture ? path.dirname(path.resolve(args.fixture)) : undefined;
  const result = await handler.apply(root, plan, { fixtureRoot });
  if (!result.ok) {
    logErrors(handler, result.errors);
    setOutput("status", "invalid");
    setOutput("errors", result.errors.map((e) => `- schema: ${e}`).join("\n"));
    setOutput("kind", handler.label);
    process.exit(2);
  }

  const branch = `${result.branch}-issue-${issueNumber}`;
  const body_md = [
    `Closes #${issueNumber}.`,
    "",
    `Submitted by @${issueAuthor} via the **${handler.emoji} ${handler.label}** issue form.`,
    "",
    "## Summary",
    "",
    result.summary,
    "",
    "## Files",
    "",
    ...result.paths.map((p) => `- \`${path.relative(root, p)}\``),
    "",
    "_Generated automatically by `.github/scripts/issue-to-content.mjs`._",
  ].join("\n");

  setOutput("status", "ok");
  setOutput("kind", handler.label);
  setOutput("branch", branch);
  setOutput("commit_message", result.commit);
  setOutput("pr_title", result.prTitle);
  setOutput("pr_body", body_md);
  setOutput("changed_paths", result.paths.map((p) => path.relative(root, p)).join("\n"));

  console.log(`✓ ${handler.label} plan applied. Branch: ${branch}`);
}

main().catch((err) => {
  console.error(err);
  setOutput("status", "error");
  setOutput("errors", `- ${err.message || err}`);
  process.exit(1);
});
