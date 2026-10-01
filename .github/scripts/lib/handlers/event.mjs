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
  listingMonth: "Listing month",
  time: "Time (with timezone)",
  location: "Location",
  contributors: "Contributors / speakers",
  blurb: "Short blurb",
  body: "Full description (Markdown)",
  registration: "Registration / RSVP link",
  additional: "Additional context",
};

const CATEGORY_BY_KIND = {
  "Thesis defense (PhD)": "Thesis Defenses",
  "Thesis defense (MSc)": "Thesis Defenses",
  Symposium: "Symposiums",
  Workshop: "Workshops",
  "Invited talk": "Presentations",
  "Conference talk / poster": "Presentations",
  "Lab meeting / seminar": "Seminars",
  "Lab life / social": "Lab Life",
  Outreach: "Outreach",
  Other: "Other",
};

export const event = {
  label: "event",
  emoji: "📅",
  buildPlan(fields) {
    const errors = [];
    const required = ["title", "slug", "kind", "contributors", "body"];
    for (const key of required) {
      if (!fields[FIELD[key]]) errors.push(`Missing required field: \`${FIELD[key]}\``);
    }
    if (errors.length) return { ok: false, errors };

    const startDate = (fields[FIELD.startDate] || "").trim();
    if (startDate && !isValidIsoDate(startDate)) {
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
    if (endDate && !startDate) {
      return { ok: false, errors: ["End date requires a start date."] };
    }
    if (endDate && endDate < startDate) {
      return { ok: false, errors: [`End date cannot be before the start date.`] };
    }
    const listingMonth = (fields[FIELD.listingMonth] || "").trim();
    if (!startDate && !/^\d{4}-(0[1-9]|1[0-2])$/.test(listingMonth)) {
      return { ok: false, errors: ["Provide a start date or a listing month in YYYY-MM format."] };
    }
    const groupingDate = startDate || `${listingMonth}-01`;
    const year = groupingDate.slice(0, 4);
    const month = monthName(groupingDate);
    const slug = slugify(fields[FIELD.slug]);
    if (!slug)
      return { ok: false, errors: [`Suggested slug must contain at least one letter or number.`] };
    const markdownRel = `community/events/${slug}.md`;
    const kind = fields[FIELD.kind].trim();
    const category = CATEGORY_BY_KIND[kind];
    if (!category) {
      return {
        ok: false,
        errors: [`Unknown event kind \`${kind}\`; pick one of the form's options.`],
      };
    }

    const entry = {
      title: fields[FIELD.title].trim(),
      slug,
      category,
      ...(startDate ? { date: startDate } : {}),
      kind,
      ...(fields[FIELD.location]?.trim() ? { venue: fields[FIELD.location].trim() } : {}),
      ...(endDate ? { endDate } : {}),
      contributors: splitList(fields[FIELD.contributors]),
      markdown: markdownRel,
    };

    const blurb = (fields[FIELD.blurb] || "").trim();
    const lines = [];
    if (blurb) lines.push(blurb, "");
    if (fields[FIELD.time]) lines.push(`**Time:** ${fields[FIELD.time].trim()}`, "");
    if (fields[FIELD.registration]) {
      lines.push(`**Registration:** ${fields[FIELD.registration].trim()}`, "");
    }
    lines.push(fields[FIELD.body].trim());
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
        `**Category:** ${plan.entry.category}`,
        `**Contributors:** ${plan.entry.contributors.join(", ") || "(none)"}`,
      ].join("\n"),
    };
  },
};
