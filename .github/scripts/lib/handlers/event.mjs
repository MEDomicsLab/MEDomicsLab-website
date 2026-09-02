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
  title: "Event title",
  slug: "Suggested slug",
  kind: "Event kind",
  startDate: "Start date",
  endDate: "End date",
  time: "Time (with timezone)",
  location: "Location",
  contributors: "Contributors / speakers",
  blurb: "Short blurb",
  body: "Full description (Markdown)",
  registration: "Registration / RSVP link",
  additional: "Additional context",
};

export const event = {
  label: "event",
  emoji: "📅",
  buildPlan(fields) {
    const errors = [];
    const required = ["title", "slug", "kind", "startDate", "location", "contributors", "body"];
    for (const key of required) {
      if (!fields[FIELD[key]]) errors.push(`Missing required field: \`${FIELD[key]}\``);
    }
    if (errors.length) return { ok: false, errors };

    const startDate = fields[FIELD.startDate].trim();
    if (!isValidIsoDate(startDate)) {
      return {
        ok: false,
        errors: [
          `Start date must be a real calendar date in \`YYYY-MM-DD\` format (got \`${startDate}\`).`,
        ],
      };
    }
    const endDate = (fields[FIELD.endDate] || "").trim();
    if (endDate && !isValidIsoDate(endDate)) {
      return {
        ok: false,
        errors: [
          `End date must be a real calendar date in \`YYYY-MM-DD\` format (got \`${endDate}\`).`,
        ],
      };
    }
    if (endDate && endDate < startDate) {
      return { ok: false, errors: [`End date cannot be before the start date.`] };
    }
    const year = startDate.slice(0, 4);
    const month = monthName(startDate);
    const slug = slugify(fields[FIELD.slug]);
    if (!slug)
      return { ok: false, errors: [`Suggested slug must contain at least one letter or number.`] };
    const markdownRel = `community/events/${slug}.md`;

    const entry = {
      title: fields[FIELD.title].trim(),
      slug,
      contributors: splitList(fields[FIELD.contributors]),
      markdown: markdownRel,
    };

    const blurb = (fields[FIELD.blurb] || "").trim();
    const lines = [];
    if (blurb) lines.push(blurb, "");
    lines.push(`**Kind:** ${fields[FIELD.kind].trim()}`);
    lines.push(`**Date:** ${startDate}${endDate ? ` – ${endDate}` : ""}`);
    if (fields[FIELD.time]) lines.push(`**Time:** ${fields[FIELD.time].trim()}`);
    lines.push(`**Location:** ${fields[FIELD.location].trim()}`);
    if (fields[FIELD.registration]) {
      lines.push(`**Registration:** ${fields[FIELD.registration].trim()}`);
    }
    lines.push("", fields[FIELD.body].trim());
    if (fields[FIELD.additional]) {
      lines.push("", "<!-- Additional context", fields[FIELD.additional].trim(), "-->");
    }

    return {
      ok: true,
      year,
      month,
      slug,
      entry,
      markdownRel,
      markdownBody: lines.join("\n"),
    };
  },
  async apply(root, plan) {
    const dataFile = path.join(root, "src/data/events.json");
    const current = readJson(dataFile);
    const next = insertCommunityItem(current, {
      year: plan.year,
      month: plan.month,
      item: plan.entry,
    });
    const result = validateAgainst("events.schema.json", next);
    if (!result.ok) return { ok: false, errors: result.errors };
    await writeJson(dataFile, next);
    const mdPath = path.join(root, "src/content", plan.markdownRel);
    await writeMarkdown(mdPath, plan.markdownBody);
    return {
      ok: true,
      paths: [dataFile, mdPath],
      branch: `content/event-${plan.slug}`,
      commit: `feat(events): add ${plan.entry.title}`,
      prTitle: `feat(events): add ${plan.entry.title}`,
      summary: [
        `**Year/month:** ${plan.year} / ${plan.month}`,
        `**Slug:** \`${plan.slug}\``,
        `**Contributors:** ${plan.entry.contributors.join(", ") || "(none)"}`,
      ].join("\n"),
    };
  },
};
