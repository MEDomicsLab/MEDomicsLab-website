import { Link } from "react-router-dom";
import AvatarImage from "../AvatarImage/AvatarImage";
import BrandName from "../BrandName/BrandName.jsx";
import LabAvatar from "../LabAvatar/LabAvatar.jsx";
import HoverArrow from "../HoverArrow/HoverArrow.jsx";

const cohortLabel = (cohort) => {
  if (cohort === "Lab Principal Investigator") return "PI";
  if (cohort === "Current") return "Current";
  return `Team ${cohort}`;
};

/**
 * Shared researcher sidebar. `{ member, cohort }` entries link to profiles;
 * external contributors use `{ name, url?, affiliation?, role? }`, tagged "External"
 * (or "External <role>", e.g. "External PI"), with the name linking out when `url` is set.
 */
export default function ResearcherList({ people, title = "Researchers" }) {
  if (!people?.length) return null;

  return (
    <div className="border-t border-border pt-6 space-y-4">
      <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{title}</h3>
      <ul className="space-y-4">
        {people.map((person) =>
          person.member ? (
            <li key={person.member.slug} className="flex items-center space-x-3">
              {person.member.image ? (
                <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/40 shrink-0">
                  <AvatarImage
                    src={person.member.image}
                    alt={person.member.name}
                    size={48}
                    loading="lazy"
                  />
                </div>
              ) : (
                <LabAvatar size={48} />
              )}
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  <Link
                    to={`/team/${person.member.slug}`}
                    className="text-base font-bold hover:text-primary transition-colors"
                  >
                    {person.member.name}
                  </Link>
                  <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                    {cohortLabel(person.cohort)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {person.member.position.split(" | ")[0]}
                </div>
              </div>
            </li>
          ) : (
            <li key={person.name} className="flex items-center space-x-3">
              <LabAvatar size={48} />
              <div className="min-w-0">
                <div className="flex items-baseline gap-2">
                  {person.url ? (
                    <a
                      href={person.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1 text-base font-bold hover:text-primary transition-colors"
                    >
                      <BrandName>{person.name}</BrandName>
                      <HoverArrow size="xs" />
                    </a>
                  ) : (
                    <span className="text-base font-bold">
                      <BrandName>{person.name}</BrandName>
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground/70 whitespace-nowrap">
                    {person.role ? `External ${person.role}` : "External"}
                  </span>
                </div>
                {person.affiliation && (
                  <div className="text-sm text-muted-foreground">{person.affiliation}</div>
                )}
              </div>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
