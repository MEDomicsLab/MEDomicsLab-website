import { cn } from "../../lib/utils";
import {
  EnvelopeIcon,
  GithubIcon,
  GoogleScholarIcon,
  LinkedinIcon,
  CvIcon,
  ResearchGateIcon,
} from "../Icons/Icons.jsx";

const SOCIAL_ITEMS = [
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "scholar", label: "Google Scholar", Icon: GoogleScholarIcon },
  { key: "researchgate", label: "ResearchGate", Icon: ResearchGateIcon },
  { key: "cv", label: "CV", Icon: CvIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "email", label: "Email", Icon: EnvelopeIcon },
];

const hrefFor = (member, key) => {
  const value = key === "email" ? member.email : member.socials?.[key];
  if (!value) return null;
  return key === "email" ? `mailto:${value}` : value;
};

export default function SocialIcons({
  member,
  keys,
  className,
  iconClassName = "h-5 w-5",
  stopPropagation = false,
}) {
  const items = keys ? SOCIAL_ITEMS.filter((item) => keys.includes(item.key)) : SOCIAL_ITEMS;
  const ordered = keys ? keys.map((key) => items.find((item) => item.key === key)) : items;

  return (
    <ul className={cn("flex flex-wrap items-center gap-4", className)}>
      {ordered.map(({ key, label, Icon }) => {
        const href = hrefFor(member, key);
        const name = `${member.name} — ${label}`;
        return (
          <li key={key} className="flex">
            {href ? (
              <a
                href={href}
                target={key === "email" ? undefined : "_blank"}
                rel={key === "email" ? undefined : "noreferrer"}
                aria-label={name}
                title={label}
                onClick={stopPropagation ? (event) => event.stopPropagation() : undefined}
                className="text-zinc-300 transition-[color,scale] duration-300 ease-out hover:text-primary hover:scale-110"
              >
                <Icon className={iconClassName} />
              </a>
            ) : (
              <span
                role="img"
                title={`${label} not available`}
                aria-label={`${name} (not available)`}
                className="text-muted-foreground/25"
              >
                <Icon className={iconClassName} />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
