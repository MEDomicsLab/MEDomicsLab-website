import path from "node:path";
import { splitList } from "../issue-form-parser.mjs";
import { slugify } from "../slug.mjs";
import {
  readJson,
  writeJson,
  writeMarkdown,
  insertCommunityItem,
  isValidIsoDate,
  monthName,
} from "../data-store.mjs";
import { validateAgainst } from "../validate.mjs";

const FIELD = {
  title: "Headline",
  slug: "Suggested slug",
  category: "Category",
  date: "Publish date",
  displayDate: "Date to display",
  endDate: "Event end date",
  kind: "Event kind",
  venue: "Event venue",
  contributors: "Contributors / people involved",
  body: "Full content (Markdown)",
  additional: "Additional context",
};

export const news = {
  label: "news",
  emoji: "📰",
  buildPlan(fields) {
    const errors = [];
    const required = ["title", "slug", "category", "date", "contributors", "body"];
    for (const key of required) {
      if (!fields[FIELD[key]]) errors.push(`Missing required field: \`${FIELD[key]}\``);
    }
    if (errors.length) return { ok: false, errors };

    const date = fields[FIELD.date].trim();
    if (!isValidIsoDate(date)) {
      return {
        ok: false,
        errors: [
          `Publish date must be a real calendar date in \`YYYY-MM-DD\` format (got \`${date}\`).`,
        ],
      };
    }
    const displayDate = (fields[FIELD.displayDate] || "").trim();
    const endDate = (fields[FIELD.endDate] || "").trim();
    const kind = (fields[FIELD.kind] || "").trim();
    const venue = (fields[FIELD.venue] || "").trim();
    for (const [label, value] of [
      [FIELD.displayDate, displayDate],
      [FIELD.endDate, endDate],
    ]) {
      if (value && !isValidIsoDate(value)) {
        errors.push(`${label} must be a real calendar date in YYYY-MM-DD format.`);
      }
    }
    if (endDate && !displayDate) errors.push("Event end date requires a date to display.");
    if (endDate && displayDate && endDate < displayDate) {
      errors.push("Event end date cannot be before the date to display.");
    }
    if (errors.length) return { ok: false, errors };
    const eventDetails =
      kind || venue || endDate
        ? {
            ...(displayDate ? { date: displayDate } : {}),
            ...(endDate ? { endDate } : {}),
            ...(kind ? { kind } : {}),
            ...(venue ? { venue } : {}),
          }
        : null;
    const year = date.slice(0, 4);
    const month = monthName(date);
    const slug = slugify(fields[FIELD.slug]);
    if (!slug)
      return { ok: false, errors: [`Suggested slug must contain at least one letter or number.`] };
    const markdownRel = `community/news/${slug}.md`;

    const entry = {
      title: fields[FIELD.title].trim(),
      slug,
      category: fields[FIELD.category].trim(),
      ...(eventDetails ? { event: eventDetails } : displayDate ? { date: displayDate } : {}),
      contributors: splitList(fields[FIELD.contributors]),
      markdown: markdownRel,
    };

    const body = fields[FIELD.body].trim();
    const additional = (fields[FIELD.additional] || "").trim();
    const markdownBody = additional
      ? `${body}\n\n<!-- Additional context\n${additional}\n-->`
      : body;

    return { ok: true, year, month, slug, entry, markdownRel, markdownBody };
  },
  async apply(root, plan) {
    const dataFile = path.join(root, "src/data/news.json");
    const current = readJson(dataFile);
    const next = insertCommunityItem(current, {
      year: plan.year,
      month: plan.month,
      item: plan.entry,
    });
    const result = validateAgainst("news.schema.json", next);
    if (!result.ok) return { ok: false, errors: result.errors };
    await writeJson(dataFile, next);
    const mdPath = path.join(root, "src/content", plan.markdownRel);
    await writeMarkdown(mdPath, plan.markdownBody);
    return {
      ok: true,
      paths: [dataFile, mdPath],
      branch: `content/news-${plan.slug}`,
      commit: `feat(news): add ${plan.entry.title}`,
      prTitle: `feat(news): add ${plan.entry.title}`,
      summary: [
        `**Year/month:** ${plan.year} / ${plan.month}`,
        `**Slug:** \`${plan.slug}\``,
        `**Category:** ${plan.entry.category}`,
        `**Contributors:** ${plan.entry.contributors.join(", ") || "(none)"}`,
      ].join("\n"),
    };
  },
};
