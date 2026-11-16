import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { IssueFormParseError, parseIssueForm } from "../lib/issue-form-parser.mjs";
import { getIssueFormFields } from "../lib/issue-form-template.mjs";
import { event } from "../lib/handlers/event.mjs";
import { news } from "../lib/handlers/news.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..", "..", "..");

function submission(kind, overrides = {}) {
  const labels = getIssueFormFields(kind);
  const fixture = fs.readFileSync(path.join(here, "fixtures", `${kind}-valid.md`), "utf8");
  const answers = { ...parseIssueForm(fixture, labels), ...overrides };
  return labels.map((label) => `### ${label}\n\n${answers[label] || "_No response_"}`).join("\n\n");
}

test("Markdown sections survive parsing and generated event and news files", async () => {
  const cases = [
    { handler: event, data: "events", field: "Full description (Markdown)", heading: "Agenda" },
    { handler: news, data: "news", field: "Full content (Markdown)", heading: "Highlights" },
  ];
  for (const { handler, data, field, heading } of cases) {
    const content = `Opening paragraph.\n\n### ${heading}\n\nThis content must survive.\n\n#### Details\n\nFinal paragraph.`;
    const body = submission(handler.label, { [field]: content });
    const fields = parseIssueForm(body.replace(/\n/g, "\r\n"), getIssueFormFields(handler.label));
    assert.equal(fields[field], content);
    const plan = handler.buildPlan(fields);
    assert.equal(plan.ok, true, JSON.stringify(plan));

    const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-form-markdown-"));
    try {
      fs.mkdirSync(path.join(sandbox, "src/data"), { recursive: true });
      for (const name of new Set([data, "team"])) {
        fs.copyFileSync(
          path.join(repoRoot, `src/data/${name}.json`),
          path.join(sandbox, `src/data/${name}.json`)
        );
      }
      const result = await handler.apply(sandbox, plan);
      assert.equal(result.ok, true, JSON.stringify(result));
      const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
      assert.ok(markdown.includes(content), `${handler.label} lost its Markdown sections`);
    } finally {
      fs.rmSync(sandbox, { recursive: true, force: true });
    }
  }
});

test("only headings belonging to the selected form delimit answers", () => {
  const content = "### Headline\n\nAn event section, not a news field.";
  const fields = parseIssueForm(
    submission("event", { "Full description (Markdown)": content }),
    getIssueFormFields("event")
  );
  assert.equal(fields["Full description (Markdown)"], content);
  assert.equal(fields.Headline, undefined);
});

test("code fences preserve form-like headings and require a matching closing fence", () => {
  for (const [open, inside, close] of [
    ["```markdown", "### Headline\n\nLiteral title", "```"],
    ["~~~markdown", "### Headline\n\n```\n### Contributors / people involved", "~~~~"],
    ["  ````markdown", "```\n### Headline\n~~~\n### Contributors / people involved", "   `````"],
  ]) {
    const content = `Opening paragraph.\n\n${open}\n${inside}\n${close}\n\n### Findings\n\nAfter the code block.`;
    const fields = parseIssueForm(
      submission("news", { "Full content (Markdown)": content }),
      getIssueFormFields("news")
    );
    assert.equal(fields["Full content (Markdown)"], content);
    assert.equal(fields.Headline, "Pipeline drafted news post");
  }
});

test("a duplicate field-like heading is rejected instead of overwriting an answer", () => {
  const body = submission("event", {
    "Full description (Markdown)":
      "Opening paragraph.\n\n### Event title\n\nA conflicting heading.",
  });
  assert.throws(
    () => parseIssueForm(body, getIssueFormFields("event")),
    (err) =>
      err instanceof IssueFormParseError && /Duplicate form heading "Event title"/.test(err.message)
  );
});

test("a future field name inside an answer is rejected when its real field follows", () => {
  const body = submission("event", {
    "Full description (Markdown)":
      "Opening paragraph.\n\n### Registration / RSVP link\n\nA section.",
  });
  assert.throws(
    () => parseIssueForm(body, getIssueFormFields("event")),
    /Duplicate form heading "Registration \/ RSVP link"/
  );
});

test("out-of-order form headings are rejected with actionable feedback", () => {
  assert.throws(
    () =>
      parseIssueForm(
        "### Title\n\nPaper\n\n### Type\n\nPreprints\n\n### Contributors\n\nAlice",
        getIssueFormFields("publication")
      ),
    /Form heading "Contributors" is out of order.*original form order/
  );
});

test("unclosed fences cannot silently absorb subsequent form fields", () => {
  assert.throws(
    () =>
      parseIssueForm(
        submission("news", { "Full content (Markdown)": "Intro.\n\n```markdown\nUnclosed" }),
        getIssueFormFields("news")
      ),
    /Unclosed code fence.*before the next form field/
  );
});

test("ambiguous submissions produce workflow validation feedback before writing content", () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-form-invalid-"));
  try {
    const output = path.join(sandbox, "output");
    const result = spawnSync(
      process.execPath,
      [path.join(repoRoot, ".github/scripts/issue-to-content.mjs")],
      {
        cwd: repoRoot,
        encoding: "utf8",
        env: {
          ...process.env,
          ISSUE_LABELS: "content,event",
          ISSUE_BODY: submission("event", {
            "Full description (Markdown)": "### Event title\n\nConflicting heading.",
          }),
          GITHUB_OUTPUT: output,
        },
      }
    );
    assert.equal(result.status, 2, result.stderr);
    const feedback = fs.readFileSync(output, "utf8");
    assert.match(feedback, /status=invalid/);
    assert.match(feedback, /Duplicate form heading "Event title"/);
    assert.match(feedback, /kind=event/);
    assert.doesNotMatch(feedback, /changed_paths=/);
  } finally {
    fs.rmSync(sandbox, { recursive: true, force: true });
  }
});
