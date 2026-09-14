import eventsData from "../data/events.json";
import newsData from "../data/news.json";
import publicationsData from "../data/publications.json";
import researchProjects from "../data/research-projects.json";

/**
 * Everything a team member shows up in, newest first.
 */

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** Lowercase, de-accent and strip punctuation so "Guillaume Cléroux" matches "guillaume cleroux". */
const normalizeName = (value) =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const credits = (contributors, name) =>
  (contributors ?? []).some((contributor) => normalizeName(contributor) === normalizeName(name));

/**
 * Community slugs are date-prefixed (`2026-03-31-post-med3pa-article`). Fall back to the
 * year/month headings the item is filed under when a slug carries no date.
 */
const resolveDate = (slug, year, month) => {
  const fromSlug = /^(\d{4})-(\d{2})-(\d{2})/.exec(slug);
  if (fromSlug) return `${fromSlug[1]}-${fromSlug[2]}-${fromSlug[3]}`;

  const monthIndex = MONTHS.indexOf(String(month ?? "").toLowerCase());
  if (monthIndex !== -1) return `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;

  return /^\d{4}$/.test(String(year)) ? `${year}-01-01` : null;
};

const formatDate = (date) => {
  if (!date) return null;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};

const collectTimeline = (data, name, kind, basePath) => {
  const entries = [];
  for (const yearGroup of data) {
    for (const monthGroup of yearGroup.months ?? []) {
      for (const item of monthGroup.items ?? []) {
        if (!credits(item.contributors, name)) continue;
        entries.push({
          kind,
          title: item.title,
          to: `${basePath}/${item.slug}`,
          date: resolveDate(item.slug, yearGroup.year, monthGroup.month),
        });
      }
    }
  }
  return entries;
};

const collectPublications = (name) => {
  const entries = [];
  for (const yearGroup of publicationsData) {
    for (const item of yearGroup.items ?? []) {
      if (!credits(item.contributors, name)) continue;
      entries.push({
        kind: "Publication",
        title: item.title,
        to: `/publications/${item.slug}`,
        date: item.date ?? resolveDate(item.slug, yearGroup.year),
      });
    }
  }
  return entries;
};

const collectProjects = (slug) =>
  researchProjects
    .filter((project) => (project.researchers ?? []).includes(slug))
    .map((project) => ({
      kind: "Project",
      title: project.title,
      to: `/research/${project.slug}`,
      date: null,
    }));

/**
 * @param {{ slug: string, name: string }} member
 * @returns {Array<{ kind: string, title: string, to: string, date: string|null, dateLabel: string|null }>}
 */
export const getMemberActivity = (member) => {
  if (!member?.name) return [];

  const entries = [
    ...collectPublications(member.name),
    ...collectTimeline(newsData, member.name, "News", "/community/news"),
    ...collectTimeline(eventsData, member.name, "Event", "/community/events"),
    ...collectProjects(member.slug),
  ];

  // Dated entries newest first; undated projects trail them, alphabetically.
  entries.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  return entries.map((entry) => ({ ...entry, dateLabel: formatDate(entry.date) }));
};
