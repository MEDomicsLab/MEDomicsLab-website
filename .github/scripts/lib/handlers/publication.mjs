import path from "node:path";
import { splitList } from "../issue-form-parser.mjs";
import { slugify } from "../slug.mjs";
import {
  isValidIsoDate,
  readJson,
  writeJson,
  writeMarkdown,
  insertPublication,
} from "../data-store.mjs";
import { validateAgainst } from "../validate.mjs";

const FIELD = {
  title: "Title",
  contributors: "Contributors",
  journal: "Venue / journal / conference",
  type: "Type",
  date: "Publication date",
  year: "Display year",
  link: "Primary link (DOI / publisher URL)",
  redirect: "Direct redirect?",
  abstract: "Abstract / summary (Markdown)",
  bibtex: "BibTeX (optional)",
  additional: "Additional context",
};

/**
 * GitHub serializes a textarea with `render: bibtex` as a fenced code block.
 * Remove that outer fence before wrapping the generated content in its own
 * consistently highlighted BibTeX block.
 */
function normaliseBibtex(value) {
  const trimmed = value.trim();
  const fenced = /^```(?:bibtex|bib|latex|tex|text|shell)?\s*\n([\s\S]*?)\n```\s*$/i.exec(trimmed);
  return fenced ? fenced[1].trim() : trimmed;
}

export const publication = {
  label: "publication",
  emoji: "📚",
  buildPlan(fields) {
    const errors = [];
    const required = ["title", "contributors", "journal", "type", "date", "year", "link"];
    for (const key of required) {
      if (!fields[FIELD[key]]) errors.push(`Missing required field: \`${FIELD[key]}\``);
    }
    if (errors.length) return { ok: false, errors };

    const title = fields[FIELD.title].trim();
    const year = fields[FIELD.year].trim();
    if (!/^\d{4}$/.test(year)) {
      return { ok: false, errors: [`Display year must be a four-digit year (got \`${year}\`).`] };
    }
    const titleSlug = slugify(title);
    if (!titleSlug)
      return { ok: false, errors: [`Title must contain at least one letter or number.`] };
    const slug = `${titleSlug}-${year}`;
    const contributors = splitList(fields[FIELD.contributors]);
    const date = fields[FIELD.date].trim();
    if (!isValidIsoDate(date)) {
      return {
        ok: false,
        errors: [
          `Publication date must be a real calendar date in \`YYYY-MM-DD\` format (got \`${date}\`).`,
        ],
      };
    }
    const type = fields[FIELD.type].trim();
    const markdownRel = `publications/${slug}.md`;

    const entry = {
      title,
      slug,
      contributors,
      journal: fields[FIELD.journal].trim(),
      link: fields[FIELD.link].trim(),
      markdown: markdownRel,
      type,
      date,
    };
    const redirectRaw = (fields[FIELD.redirect] || "").trim().toLowerCase();
    if (redirectRaw === "yes" || redirectRaw === "true") entry.redirect = true;

    const markdownInput = {
      date,
      contributors,
      summary: fields[FIELD.abstract] || "",
      bibtex: fields[FIELD.bibtex] || "",
      additional: fields[FIELD.additional] || "",
      link: entry.link,
    };

    return {
      ok: true,
      year,
      slug,
      entry,
      markdownRel,
      markdownInput,
    };
  },
  async apply(root, plan) {
    const dataFile = path.join(root, "src/data/publications.json");
    const current = readJson(dataFile);
    const next = insertPublication(current, plan.year, plan.entry);
    const result = validateAgainst("publications.schema.json", next);
    if (!result.ok) return { ok: false, errors: result.errors };
    await writeJson(dataFile, next);
    const team = readJson(path.join(root, "src/data/team.json"));
    const teamSlugs = new Set(
      team.flatMap((cohort) => cohort.members ?? []).map((member) => member.slug)
    );
    const mdPath = path.join(root, "src/content", plan.markdownRel);
    await writeMarkdown(mdPath, renderMarkdown(plan.markdownInput, teamSlugs));
    return {
      ok: true,
      paths: [dataFile, mdPath],
      branch: `content/publication-${plan.slug}`,
      commit: `feat(publications): add ${plan.entry.title}`,
      prTitle: `feat(publications): add ${plan.entry.title}`,
      summary: [
        `**Year:** ${plan.year}`,
        `**Type:** ${plan.entry.type}`,
        `**Slug:** \`${plan.slug}\``,
        `**Contributors:** ${plan.entry.contributors.join(", ")}`,
        `**Link:** ${plan.entry.link}`,
      ].join("\n"),
    };
  },
};

function renderMarkdown({ date, contributors, summary, bibtex, additional, link }, teamSlugs) {
  const authors = contributors
    .map((name) => {
      const slug = slugify(name);
      return teamSlugs.has(slug) ? `- [${name}](/team/${slug})` : `- ${name}`;
    })
    .join("\n");
  const sections = [
    "## Date",
    "",
    date,
    "",
    "## Authors",
    "",
    authors || "<!-- replace: list contributors -->",
    "",
    "## Summary",
    "",
    summary.trim() || "<!-- replace: add a short summary -->",
    "",
    "## Links",
    "",
    `- [Primary link](${link})`,
  ];
  if (bibtex.trim()) {
    sections.push("", "## BibTeX", "", "```bibtex", normaliseBibtex(bibtex), "```");
  }
  if (additional.trim()) {
    sections.push("", "## Additional context", "", additional.trim());
  }
  return sections.join("\n");
}
