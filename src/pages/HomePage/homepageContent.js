import homeData from "../../data/home.json";
import researchProjects from "../../data/research-projects.json";
import teamData from "../../data/team.json";

export const principalInvestigator = teamData.find(
  (group) => group.year === "Lab Principal Investigator"
)?.members[0];

const [firstName, ...remainingNames] = principalInvestigator.name.split(" ");
export const investigatorName = { firstName, rest: remainingNames.join(" ") };

export const ecosystemApps = ["MEDomics", "MED3pa", "MEDfl", "MEDiml", "MEDprofiles"].map(
  (name) => ({
    ...homeData.sections.ecosystem.apps.find((app) => app.name === name),
    card: `/images/homepage-neue/ecosystem/${name.toLowerCase()}.webp`,
  })
);

export const nextCards = researchProjects.map((project, index) => ({
  ...project,
  image: `/images/homepage-neue/next/${String(index + 1).padStart(2, "0")}-${project.slug}.webp`,
  href: `/research/${project.slug}`,
}));
