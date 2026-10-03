import teamData from "../data/team.json";

export const normalizeName = (value) =>
  value
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

let bySlug = null;
let byName = null;

const buildMaps = () => {
  bySlug = new Map();
  byName = new Map();
  teamData.forEach((cohort, cohortIndex) => {
    for (const member of cohort.members ?? []) {
      const entry = { member, cohort: cohort.year, cohortIndex };
      if (member.slug) bySlug.set(member.slug, entry);
      byName.set(normalizeName(member.name), entry);
    }
  });
};

const lookup = (map, key) => {
  if (!bySlug) buildMaps();
  return (map === "slug" ? bySlug : byName).get(key) ?? null;
};

export const getMemberByName = (name) => lookup("name", normalizeName(name))?.member ?? null;

/**
 * Order people the way team.json orders its cohorts: the PI, then the current
 * team, then former members by the year they left, newest first; ties keep
 * their original order. People not on the team go last, in their given order.
 */
const byCohort = (people) =>
  people
    .map((person, position) => ({ ...person, position }))
    .sort(
      (a, b) => (a.cohortIndex ?? Infinity) - (b.cohortIndex ?? Infinity) || a.position - b.position
    )
    .map(({ member, cohort, name }) => (member ? { member, cohort } : { name }));

/**
 * Resolve researcher slugs (research projects) to `{ member, cohort }`,
 * ordered by cohort. Unknown slugs are dropped.
 */
export const getMembersByCohort = (slugs) =>
  byCohort((slugs ?? []).map((slug) => lookup("slug", slug)).filter(Boolean));

/**
 * Resolve contributor names (news, events) the same way. Names that match a
 * team member become `{ member, cohort }`; anyone else (external
 * collaborators, "MEDomicsLab" itself) stays as `{ name }`.
 */
export const getPeopleByNames = (names) =>
  byCohort(
    (names ?? []).map((name) => lookup("name", normalizeName(name)) ?? { name: name.trim() })
  );
