import teamData from "../data/team.json";

let memberMap = null;

const buildMap = () => {
  const map = new Map();
  for (const cohort of teamData) {
    for (const member of cohort.members ?? []) {
      if (member.slug) map.set(member.slug, member);
    }
  }
  return map;
};

export const getMemberBySlug = (slug) => {
  if (!memberMap) memberMap = buildMap();
  return memberMap.get(slug) ?? null;
};
