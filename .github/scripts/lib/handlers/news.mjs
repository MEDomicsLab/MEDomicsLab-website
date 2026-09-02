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
  date: "Publish date",
  contributors: "Contributors / people involved",
  body: "Full content (Markdown)",
  additional: "Additional context",
};

export const news = {
  label: "news",
  emoji: "📰",
  buildPlan(fields) {
    const errors = [];
    const required = ["title", "slug", "date", "contributors", "body"];
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
    const year = date.slice(0, 4);
    const month = monthName(date);
    const slug = slugify(fields[FIELD.slug]);
    if (!slug)
      return { ok: false, errors: [`Suggested slug must contain at least one letter or number.`] };
    const markdownRel = `community/news/${slug}.md`;

    const entry = {
      title: fields[FIELD.title].trim(),
      slug,
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
        `**Contributors:** ${plan.entry.contributors.join(", ") || "(none)"}`,
      ].join("\n"),
    };
  },
};
