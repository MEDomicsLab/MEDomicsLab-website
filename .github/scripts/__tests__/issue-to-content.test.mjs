import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";

import { parseIssueForm, splitList, parseChecklist } from "../lib/issue-form-parser.mjs";
import { slugify } from "../lib/slug.mjs";
import { publication } from "../lib/handlers/publication.mjs";
import { news } from "../lib/handlers/news.mjs";
import { event } from "../lib/handlers/event.mjs";
import { team } from "../lib/handlers/team.mjs";
import { validateAgainst } from "../lib/validate.mjs";
import { writeJson, insertCommunityItem, communityOrderProblems } from "../lib/data-store.mjs";

const __filename = fileURLToPath(import.meta.url);
const here = path.dirname(__filename);
const repoRoot = path.resolve(here, "..", "..", "..");
const fixtures = path.join(here, "fixtures");

const fixture = (name) => fs.readFileSync(path.join(fixtures, name), "utf8");

test("slugify normalises punctuation, accents, and whitespace", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
  assert.equal(slugify("Martín Vallières"), "martin-vallieres");
  assert.equal(slugify("  multiple   spaces  "), "multiple-spaces");
  assert.equal(slugify("a—b—c"), "a-b-c");
});

test("parseIssueForm splits a body into label/value pairs", () => {
  const body = [
    "### Title",
    "",
    "Hello",
    "",
    "### Authors",
    "",
    "Alice, Bob",
    "",
    "### Notes",
    "",
    "_No response_",
  ].join("\n");
  const fields = parseIssueForm(body);
  assert.equal(fields.Title, "Hello");
  assert.equal(fields.Authors, "Alice, Bob");
  assert.equal(fields.Notes, "");
});

test("splitList trims and ignores empties", () => {
  assert.deepEqual(splitList("Alice, Bob ,, Carol"), ["Alice", "Bob", "Carol"]);
  assert.deepEqual(splitList(""), []);
});

test("parseChecklist returns only checked options", () => {
  const text = "- [x] One\n- [ ] Two\n- [X] Three";
  assert.deepEqual(parseChecklist(text), ["One", "Three"]);
});

test("publication handler builds a valid plan from a fixture", () => {
  const fields = parseIssueForm(fixture("publication-valid.md"));
  const plan = publication.buildPlan(fields);
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));
  assert.equal(plan.year, "2025");
  assert.match(plan.slug, /^test-publication-for-the-deterministic-pipeline-2025$/);
  assert.equal(plan.entry.type, "Journal Papers");
  assert.deepEqual(plan.entry.contributors, [
    "Hakima Laribi",
    "Nicolas Raymond",
    "Martin Vallières",
  ]);
  assert.deepEqual(plan.markdownInput.contributors, [
    "Hakima Laribi",
    "Nicolas Raymond",
    "Martin Vallières",
  ]);
});

test("publication handler reports missing required fields", () => {
  const fields = parseIssueForm(fixture("publication-missing-required.md"));
  const plan = publication.buildPlan(fields);
  assert.equal(plan.ok, false);
  assert.ok(plan.errors.some((e) => e.includes("Title")));
  assert.ok(plan.errors.some((e) => e.includes("Contributors")));
});

test("handlers reject impossible dates and empty normalized slugs", () => {
  const invalidNewsDate = news.buildPlan({
    Headline: "Example news",
    "Suggested slug": "example-news",
    Category: "Other",
    "Publish date": "2026-02-31",
    "Contributors / people involved": "Example Person",
    "Full content (Markdown)": "Example body.",
  });
  assert.equal(invalidNewsDate.ok, false);
  assert.match(invalidNewsDate.errors.join("\n"), /real calendar date/);

  const emptyEventSlug = event.buildPlan({
    "Event title": "Example event",
    "Suggested slug": "!!!",
    "Event kind": "Workshop",
    "Start date": "2026-09-02",
    Location: "Example room",
    "Contributors / speakers": "Example Person",
    "Full description (Markdown)": "Example body.",
  });
  assert.equal(emptyEventSlug.ok, false);
  assert.match(emptyEventSlug.errors.join("\n"), /Suggested slug/);
});

test("event handler rejects an invalid or earlier end date", () => {
  const base = {
    "Event title": "Example event",
    "Suggested slug": "example-event",
    "Event kind": "Workshop",
    "Start date": "2026-09-02",
    Location: "Example room",
    "Contributors / speakers": "Example Person",
    "Full description (Markdown)": "Example body.",
  };
  const impossibleEndDate = event.buildPlan({ ...base, "End date": "2026-02-31" });
  assert.equal(impossibleEndDate.ok, false);
  const earlierEndDate = event.buildPlan({ ...base, "End date": "2026-09-01" });
  assert.equal(earlierEndDate.ok, false);
  assert.match(earlierEndDate.errors.join("\n"), /before the start date/);
});

test("publication Markdown links only contributors with a team profile", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-publication-"));
  const dataDir = path.join(sandbox, "src/data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "src/data/publications.json"),
    path.join(dataDir, "publications.json")
  );
  fs.writeFileSync(
    path.join(dataDir, "team.json"),
    JSON.stringify([{ year: "Current", members: [{ slug: "linked-author" }] }]),
    "utf8"
  );

  const plan = publication.buildPlan({
    Title: "Contributor linking test",
    Contributors: "Linked Author, External Author",
    "Venue / journal / conference": "Example Journal",
    Type: "Journal Papers",
    "Publication date": "2027-01-02",
    "Display year": "2027",
    "Primary link (DOI / publisher URL)": "https://doi.org/10.5555/test",
  });
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));

  const result = await publication.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.match(result.prTitle, /^feat\(publications\): add /);
  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.match(markdown, /\[Linked Author\]\(\/team\/linked-author\)/);
  assert.match(markdown, /- External Author/);
  assert.doesNotMatch(markdown, /\/team\/external-author/);
});

test("publication handler normalises GitHub-form BibTeX fences", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-publication-bibtex-"));
  const dataDir = path.join(sandbox, "src/data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "src/data/publications.json"),
    path.join(dataDir, "publications.json")
  );
  fs.writeFileSync(path.join(dataDir, "team.json"), "[]", "utf8");

  const plan = publication.buildPlan({
    Title: "BibTeX fence test",
    Contributors: "External Author",
    "Venue / journal / conference": "Example Journal",
    Type: "Journal Papers",
    "Publication date": "2027-01-02",
    "Display year": "2027",
    "Primary link (DOI / publisher URL)": "https://doi.org/10.5555/bibtex-test",
    "BibTeX (optional)": "```bibtex\n@article{bibtexTest,\n  title = {Fence test}\n}\n```",
  });
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));

  const result = await publication.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  const markdown = fs.readFileSync(path.join(sandbox, "src/content", plan.markdownRel), "utf8");
  assert.match(markdown, /```bibtex\n@article\{bibtexTest,/);
  assert.doesNotMatch(markdown, /```bibtex\n```bibtex/);
});

test("news handler infers year/month from publish date", () => {
  const fields = parseIssueForm(fixture("news-valid.md"));
  const plan = news.buildPlan(fields);
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));
  assert.equal(plan.year, "2025");
  assert.equal(plan.month, "March");
  assert.equal(plan.entry.markdown, `community/news/${plan.slug}.md`);
  assert.equal(plan.entry.category, "Publications");
});

test("event handler refuses a kind it has no filter category for", () => {
  const plan = event.buildPlan({
    "Event title": "Example event",
    "Suggested slug": "example-event",
    "Event kind": "Something new",
    "Start date": "2026-09-02",
    Location: "Example room",
    "Contributors / speakers": "Example Person",
    "Full description (Markdown)": "Example body.",
  });
  assert.equal(plan.ok, false);
  assert.match(plan.errors.join("\n"), /Unknown event kind/);
});

test("event handler stores sidebar metadata separately from the markdown body", () => {
  const fields = parseIssueForm(fixture("event-valid.md"));
  const plan = event.buildPlan(fields);
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));
  assert.equal(plan.year, "2026");
  assert.equal(plan.month, "May");
  assert.equal(plan.entry.kind, "Thesis defense (PhD)");
  assert.equal(plan.entry.category, "Thesis Defenses");
  assert.equal(plan.entry.date, "2026-05-01");
  assert.equal(plan.entry.venue, "Université de Sherbrooke, room D7-1010");
  assert.equal(plan.entry.time, undefined);
  assert.equal(plan.entry.endDate, undefined);
  assert.equal(plan.entry.registration, undefined);
  assert.equal(
    plan.markdownBody,
    "Test Person's PhD defense.\n\n**Time:** 14:00–16:00 EDT\n\nBody of the event description."
  );
});

test("event handler preserves multi-day logistics in sidebar data", () => {
  const plan = event.buildPlan({
    ...parseIssueForm(fixture("event-valid.md")),
    "End date": "2026-05-03",
    "Registration / RSVP link": "https://example.com/register",
  });
  assert.equal(plan.ok, true);
  assert.equal(plan.entry.endDate, "2026-05-03");
  assert.equal(plan.entry.registration, undefined);
  assert.match(plan.markdownBody, /https:\/\/example.com\/register/);
  assert.doesNotMatch(plan.markdownBody, /2026-05-03/);
});

test("event apply() generates a conventional PR title", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-event-"));
  const dataDir = path.join(sandbox, "src/data");
  const schemaDir = path.join(dataDir, "_schemas");
  fs.mkdirSync(schemaDir, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "src/data/_schemas/events.schema.json"),
    path.join(schemaDir, "events.schema.json")
  );
  fs.copyFileSync(path.join(repoRoot, "src/data/events.json"), path.join(dataDir, "events.json"));

  const plan = event.buildPlan(parseIssueForm(fixture("event-valid.md")));
  assert.equal(plan.ok, true);
  const result = await event.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.match(result.prTitle, /^feat\(events\): add /);
});

test("apply() writes JSON + markdown into a sandbox repo", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-"));
  // Mirror the data + schemas the handlers need.
  const dataDir = path.join(sandbox, "src/data");
  const schemaDir = path.join(dataDir, "_schemas");
  const contentDir = path.join(sandbox, "src/content");
  fs.mkdirSync(schemaDir, { recursive: true });
  fs.mkdirSync(contentDir, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "src/data/_schemas/news.schema.json"),
    path.join(schemaDir, "news.schema.json")
  );
  fs.copyFileSync(path.join(repoRoot, "src/data/news.json"), path.join(dataDir, "news.json"));

  const fields = parseIssueForm(fixture("news-valid.md"));
  const plan = news.buildPlan(fields);
  assert.equal(plan.ok, true);
  const result = await news.apply(sandbox, plan);
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.match(result.prTitle, /^feat\(news\): add /);
  const newsJson = JSON.parse(fs.readFileSync(path.join(dataDir, "news.json"), "utf8"));
  const found = newsJson
    .flatMap((y) => y.months.flatMap((m) => m.items))
    .find((i) => i.slug === plan.slug);
  assert.ok(found, "expected new entry in news.json");
  assert.ok(
    fs.existsSync(path.join(contentDir, plan.markdownRel)),
    "expected markdown file to exist"
  );
});

test("writeJson preserves unchanged hand-formatted entries", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-json-"));
  const file = path.join(sandbox, "data.json");
  const existing = [
    "[",
    "  {",
    '    "contributors": ["Existing Author", "Another Author"]',
    "  }",
    "]",
    "",
  ].join("\n");
  fs.writeFileSync(file, existing, "utf8");

  await writeJson(file, [
    { contributors: ["New Author"] },
    { contributors: ["Existing Author", "Another Author"] },
  ]);

  const updated = fs.readFileSync(file, "utf8");
  assert.match(updated, /"contributors": \["Existing Author", "Another Author"\]/);
});

test("team handler builds a plan with parsed expertise, education, and affiliations", () => {
  const fields = parseIssueForm(fixture("team-valid.md"));
  const plan = team.buildPlan(fields);
  assert.equal(plan.ok, true, JSON.stringify(plan, null, 2));
  assert.equal(plan.cohort, "Current");
  assert.equal(plan.slug, "test-member");
  assert.deepEqual(plan.member.expertise, [
    "Machine learning",
    "Medical imaging",
    "Federated learning",
  ]);
  assert.equal(plan.member.education.length, 2);
  assert.deepEqual(plan.member.affiliations, [
    {
      role: "Associate Member",
      organization: "Dept. of Biomedical Engineering, McGill University",
      url: "https://www.mcgill.ca/bme/",
    },
  ]);
  assert.equal(plan.member.socials.linkedin, "https://www.linkedin.com/in/test-member/");
  assert.equal(plan.photoSource, "team-photo.png");

  const invalidAffiliation = team.buildPlan({
    ...fields,
    Affiliations: "Associate Member | Biomedical Engineering | javascript:alert(1)",
  });
  assert.equal(invalidAffiliation.ok, false);
  assert.match(invalidAffiliation.errors.join("\n"), /absolute HTTP\(S\) URL/);
});

test("team apply() writes resized avatar variants and updates team.json", async () => {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "issue-to-pr-team-"));
  const dataDir = path.join(sandbox, "src/data");
  const schemaDir = path.join(dataDir, "_schemas");
  fs.mkdirSync(schemaDir, { recursive: true });
  fs.copyFileSync(
    path.join(repoRoot, "src/data/_schemas/team.schema.json"),
    path.join(schemaDir, "team.schema.json")
  );
  fs.copyFileSync(path.join(repoRoot, "src/data/team.json"), path.join(dataDir, "team.json"));

  const fields = parseIssueForm(fixture("team-valid.md"));
  const plan = team.buildPlan(fields);
  assert.equal(plan.ok, true);
  const result = await team.apply(sandbox, plan, { fixtureRoot: fixtures });
  assert.equal(result.ok, true, JSON.stringify(result, null, 2));
  assert.match(result.prTitle, /^feat\(team\): add /);

  const teamJson = JSON.parse(fs.readFileSync(path.join(dataDir, "team.json"), "utf8"));
  const cohort = teamJson.find((c) => c.year === plan.cohort);
  const member = cohort.members.find((m) => m.slug === plan.slug);
  assert.ok(member, "expected new member in team.json");
  assert.equal(member.image, `/images/team/${plan.slug}/avatar.png`);
  assert.deepEqual(member.affiliations, plan.member.affiliations);
  const teamSource = fs.readFileSync(path.join(dataDir, "team.json"), "utf8");
  assert.equal(
    await prettier.check(teamSource, { parser: "json", printWidth: 100 }),
    true,
    "generated team JSON must pass Prettier without a follow-up rewrite"
  );

  const avatarDir = path.join(sandbox, "public/images/team", plan.slug);
  for (const size of [80, 128, 160, 256]) {
    for (const ext of ["avif", "webp", "png"]) {
      const file = path.join(avatarDir, `avatar-${size}.${ext}`);
      assert.ok(fs.existsSync(file), `expected ${file}`);
    }
  }
});

test("insertCommunityItem keeps years and months newest first regardless of insertion order", () => {
  const item = (slug) => ({ title: slug, slug, contributors: [] });
  let tree = [{ year: "2025", months: [{ month: "March", items: [item("a")] }] }];
  tree = insertCommunityItem(tree, { year: "2025", month: "February", item: item("b") });
  tree = insertCommunityItem(tree, { year: "2025", month: "November", item: item("c") });
  tree = insertCommunityItem(tree, { year: "2026", month: "January", item: item("d") });
  assert.deepEqual(
    tree.map((y) => [y.year, y.months.map((m) => m.month)]),
    [
      ["2026", ["January"]],
      ["2025", ["November", "March", "February"]],
    ]
  );
  assert.deepEqual(communityOrderProblems(tree), []);
});

test("communityOrderProblems flags reversed months and non-month labels", () => {
  const tree = [
    {
      year: "2024",
      months: [
        { month: "February", items: [] },
        { month: "March", items: [] },
        { month: "Symposium", items: [] },
      ],
    },
  ];
  assert.deepEqual(communityOrderProblems(tree), [
    "2024: March must come before February",
    '2024: "Symposium" is not a month name',
  ]);
  assert.throws(() => insertCommunityItem([], { year: "2024", month: "Symposium", item: {} }));
});

test("event submissions can omit an unknown day and venue without inventing metadata", () => {
  const fields = parseIssueForm(fixture("event-valid.md"));
  delete fields["Start date"];
  delete fields.Location;
  fields["Listing month"] = "2026-05";
  const plan = event.buildPlan(fields);
  assert.equal(plan.ok, true);
  assert.equal(plan.year, "2026");
  assert.equal(plan.month, "May");
  assert.equal(plan.entry.date, undefined);
  assert.equal(plan.entry.venue, undefined);
  assert.equal(event.buildPlan({ ...fields, "Listing month": "2026-13" }).ok, false);
  assert.equal(event.buildPlan({ ...fields, "Listing month": "" }).ok, false);
  assert.equal(event.buildPlan({ ...fields, "End date": "2026-05-03" }).ok, false);
  const dated = event.buildPlan({ ...fields, "Start date": "2026-06-01" });
  assert.equal(dated.month, "June");
  assert.equal(dated.entry.date, "2026-06-01");
});

test("news sidebar dates are independent of the timeline publish date", () => {
  const fields = parseIssueForm(fixture("news-valid.md"));
  const undated = news.buildPlan(fields);
  assert.equal(undated.entry.date, undefined);
  assert.equal(undated.entry.event, undefined);
  const dated = news.buildPlan({ ...fields, "Date to display": "2025-02-27" });
  assert.equal(dated.ok, true);
  assert.equal(dated.month, "March");
  assert.equal(dated.entry.date, "2025-02-27");
  assert.equal(dated.entry.event, undefined);
});

test("news accepts partial event metadata and rejects invalid date ranges", () => {
  const fields = parseIssueForm(fixture("news-valid.md"));
  for (const details of [
    { "Event kind": "Workshop" },
    { "Event venue": "Mila, Montréal" },
    { "Event kind": "Workshop", "Date to display": "2025-02-27" },
    { "Date to display": "2025-02-27", "Event end date": "2025-02-28" },
  ]) {
    const plan = news.buildPlan({ ...fields, ...details });
    assert.equal(plan.ok, true);
    assert.equal(plan.entry.event.date, details["Date to display"]);
    assert.equal(plan.entry.event.venue, details["Event venue"]);
    assert.equal(plan.entry.event.kind, details["Event kind"]);
    assert.equal(plan.entry.event.endDate, details["Event end date"]);
    const result = validateAgainst("news.schema.json", [
      { year: plan.year, months: [{ month: plan.month, items: [plan.entry] }] },
    ]);
    assert.equal(result.ok, true, JSON.stringify(result));
  }
  for (const details of [
    { "Date to display": "2025-02-30" },
    { "Event end date": "2025-02-28" },
    { "Date to display": "2025-02-27", "Event end date": "2025-02-26" },
    { "Date to display": "2025-02-27", "Event end date": "2025-02-30" },
  ]) {
    assert.equal(news.buildPlan({ ...fields, ...details }).ok, false);
  }
});
