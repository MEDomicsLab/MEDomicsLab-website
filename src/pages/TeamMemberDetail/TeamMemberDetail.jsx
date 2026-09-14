import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Award, BookOpen, Copy, Activity } from "lucide-react";
import teamData from "../../data/team.json";
import { useTranslations } from "../../lib/translations";
import { getMemberActivity } from "../../lib/memberActivity";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import FilterMenu from "../../components/FilterMenu/FilterMenu.jsx";
import RevealList from "../../components/RevealList/RevealList.jsx";

/** Order the Latest filter lists its options in, and the order rows tie-break on. */
const ACTIVITY_KINDS = ["Publication", "News", "Event", "Project"];

const VISIBLE_ACTIVITY_COUNT = 3;

const SOCIAL_ITEMS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "email", label: "Email" },
  { key: "scholar", label: "Scholar" },
  { key: "researchgate", label: "ResearchGate" },
  { key: "stackoverflow", label: "StackOverflow" },
  { key: "cv", label: "CV" },
];

export default function TeamMemberDetail() {
  const { t } = useTranslations();
  const { slug } = useParams();

  const data = teamData;

  let member = null;
  for (const yearGroup of data) {
    const found = yearGroup.members.find((item) => item.slug === slug);
    if (found) {
      member = found;
      break;
    }
  }

  const [isCopied, setIsCopied] = useState(false);
  const activity = useMemo(() => (member ? getMemberActivity(member) : []), [member]);

  // Only offer the kinds this member actually has something in.
  const availableKinds = useMemo(
    () => ACTIVITY_KINDS.filter((kind) => activity.some((entry) => entry.kind === kind)),
    [activity]
  );
  const [activeKinds, setActiveKinds] = useState(ACTIVITY_KINDS);
  const visibleActivity = useMemo(
    () => activity.filter((entry) => activeKinds.includes(entry.kind)),
    [activity, activeKinds]
  );

  // Guard against emptying the list. `activeKinds` spans every kind so the
  // choice carries between profiles, but only the kinds this member has can
  // keep the list non-empty, so those are what the guard counts.
  const toggleKind = (kind) =>
    setActiveKinds((prev) => {
      const next = prev.includes(kind) ? prev.filter((item) => item !== kind) : [...prev, kind];
      return availableKinds.some((available) => next.includes(available)) ? next : prev;
    });

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl uppercase tracking-widest font-bold">Member Not Found</div>
        <Link to="/team" className="text-primary hover:underline text-sm uppercase">
          Return to Team
        </Link>
      </div>
    );
  }

  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("");
  const socials = member.socials ?? {};

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <Link
          to="/team"
          className="inline-flex items-center text-xs uppercase tracking-widest text-muted-foreground hover:text-primary mb-12 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("team.back", "Back to Team")}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5 space-y-8">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-secondary/20 relative border border-border/60 shrink-0">
              {member.image ? (
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                  size={128}
                  loading="eager"
                  className="rounded-full"
                  imgClassName="rounded-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase tracking-widest">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              {member.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <a
                    href={`mailto:${member.email}`}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {member.email}
                  </a>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(member.email);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 1500);
                    }}
                    aria-label="Copy email to clipboard"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  {isCopied && (
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Copied
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Social + Links
              </h3>
              <ul className="space-y-2 text-sm">
                {SOCIAL_ITEMS.map((item) => {
                  const value = item.key === "email" ? member.email : socials[item.key];
                  const isActive = Boolean(value);
                  const href = item.key === "email" ? `mailto:${value}` : value;

                  return (
                    <li key={item.key}>
                      {isActive ? (
                        <a
                          href={href}
                          className="text-primary hover:text-white transition-colors text-xs uppercase tracking-widest"
                          target={item.key === "email" ? undefined : "_blank"}
                          rel={item.key === "email" ? undefined : "noreferrer"}
                        >
                          {item.label}
                        </a>
                      ) : (
                        <span className="text-xs uppercase tracking-widest text-muted-foreground/60">
                          {item.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none mb-4">
                {member.name}
              </h1>
              <div className="text-xl md:text-2xl text-primary font-mono">{member.position}</div>
            </div>

            {member.bio && (
              <div className="prose prose-invert prose-lg max-w-none">
                <p>{member.bio}</p>
              </div>
            )}

            {member.expertise && (
              <div className="space-y-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground flex items-center">
                  <Award className="w-4 h-4 mr-2" />
                  Research Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 border border-border rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {member.education?.length ? (
              <div className="space-y-6 border-t border-border pt-12">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Education
                </h3>
                <ul className="space-y-4 text-sm">
                  {member.education.map((item) => (
                    <li
                      key={`${item.course}-${item.institution}-${item.year}`}
                      className="space-y-1"
                    >
                      <div className="text-primary font-medium">{item.course}</div>
                      <div className="text-muted-foreground">{item.institution}</div>
                      {item.year && (
                        <div className="text-xs uppercase tracking-widest text-muted-foreground">
                          {item.year}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {activity.length > 0 && (
              <div className="space-y-6 border-t border-border pt-12">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-sm uppercase tracking-widest text-muted-foreground flex items-center">
                    <Activity className="w-4 h-4 mr-2" />
                    {t("team.latest", "Latest")}
                  </h3>
                  {availableKinds.length > 1 && (
                    <FilterMenu
                      options={availableKinds}
                      active={activeKinds}
                      onToggle={toggleKind}
                      label={`Filter ${member.name}'s latest activity`}
                    />
                  )}
                </div>
                <RevealList
                  visibleCount={VISIBLE_ACTIVITY_COUNT}
                  moreLabel={t("team.latest.more", "See more")}
                  lessLabel={t("team.latest.less", "See less")}
                >
                  {visibleActivity.map((entry) => (
                    <EntryRow key={entry.to} to={entry.to}>
                      <EntryRowBody>
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                          <span className="border border-white/10 rounded-full px-2 py-1 bg-white/5 text-white/70">
                            {entry.kind}
                          </span>
                          {entry.dateLabel && <span>{entry.dateLabel}</span>}
                        </div>
                        <EntryRowTitle className="text-base normal-case tracking-normal">
                          {entry.title}
                        </EntryRowTitle>
                      </EntryRowBody>
                    </EntryRow>
                  ))}
                </RevealList>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
