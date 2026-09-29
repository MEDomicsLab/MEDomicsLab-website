import { Link } from "react-router-dom";
import AvatarImage from "../AvatarImage/AvatarImage";
import BrandName from "../BrandName/BrandName.jsx";

const cohortLabel = (cohort) => {
  if (cohort === "Lab Principal Investigator") return "PI";
  if (cohort === "Current") return "Current";
  return `Team ${cohort}`;
};

/**
 * Shared researcher sidebar. `{ member, cohort }` entries link to profiles;
 * external contributors use `{ name }` and render as text.
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
              <div className="w-12 h-12 rounded-full overflow-hidden bg-secondary/40 shrink-0">
                <AvatarImage
                  src={person.member.image}
                  alt={person.member.name}
                  size={48}
                  loading="lazy"
                />
              </div>
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
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-full bg-secondary/40 border border-border/60 shrink-0"
              />
              <span className="text-base font-bold">
                <BrandName>{person.name}</BrandName>
              </span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
