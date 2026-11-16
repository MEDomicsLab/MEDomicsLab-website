import path from "node:path";
import { splitList } from "../issue-form-parser.mjs";
import { slugify } from "../slug.mjs";
import { isValidIsoDate, readJson, writeJson, insertPublication } from "../data-store.mjs";
import { validateAgainst } from "../validate.mjs";

const FIELD = {
  title: "Title",
  contributors: "Contributors",
  journal: "Venue / journal / conference",
  type: "Type",
  date: "Publication date",
  year: "Display year",
  link: "Primary link (DOI / publisher URL)",
};

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

    const entry = {
      title,
      slug,
      contributors,
      journal: fields[FIELD.journal].trim(),
      link: fields[FIELD.link].trim(),
      type,
      date,
    };
    return { ok: true, year, slug, entry };
  },
  async apply(root, plan) {
    const dataFile = path.join(root, "src/data/publications.json");
    const current = readJson(dataFile);
    const updated = insertPublication(current, plan.year, plan.entry);
    const validation = validateAgainst("publications.schema.json", updated);
    if (!validation.ok) return { ok: false, errors: validation.errors };
    await writeJson(dataFile, updated);
    return {
      ok: true,
      paths: [dataFile],
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
