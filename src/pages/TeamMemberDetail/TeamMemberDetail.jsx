import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, Award, BookOpen, Copy, Activity, Building2 } from "lucide-react";
import teamData from "../../data/team.json";
import BackLink from "../../components/BackLink/BackLink.jsx";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import { getMemberActivity } from "../../lib/memberActivity";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import RevealList from "../../components/RevealList/RevealList.jsx";
import SocialIcons from "../../components/SocialIcons/SocialIcons.jsx";
import PositionText from "../../components/PositionText/PositionText.jsx";

const VISIBLE_ACTIVITY_COUNT = 3;

export default function TeamMemberDetail() {
  const { slug } = useParams();

  const data = teamData;

  let member = null;
  let cohort = "";
  for (const yearGroup of data) {
    const found = yearGroup.members.find((item) => item.slug === slug);
    if (found) {
      member = found;
      cohort = yearGroup.year;
      break;
    }
  }

  const [isCopied, setIsCopied] = useState(false);
  const activity = useMemo(() => (member ? getMemberActivity(member) : []), [member]);

  if (!member) {
    return <DetailNotFound title="Member" to="/team" linkLabel="Return to Team" />;
  }

  const initials = member.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="member-detail min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        <BackLink to="/team">Back to Team</BackLink>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          <div className="lg:col-span-5 space-y-8">
            <div className="member-portrait group overflow-hidden bg-secondary/20 relative shrink-0">
              {member.image ? (
                <AvatarImage
                  src={member.image}
                  alt={member.name}
                  size={256}
                  loading="eager"
                  className="member-avatar"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground uppercase tracking-widest">
                  {initials}
                </div>
              )}
            </div>

            <div className="space-y-4 border-t border-border pt-6">
              {member.email && (
                <div className="member-email flex flex-wrap items-center gap-3">
                  <Mail className="w-6 h-6 shrink-0 text-primary" />
                  <a
                    href={`mailto:${member.email}`}
                    className="text-lg hover:text-primary transition-colors"
                  >
                    {member.email}
                  </a>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(member.email);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 1500);
                    }}
                    aria-label="Copy email to clipboard"
                  >
                    <Copy className="w-6 h-6" />
                  </button>
                  {isCopied && (
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Copied
                    </span>
                  )}
                </div>
              )}
            </div>

            {member.affiliations?.length ? (
              <div className="member-affiliations border-t border-border pt-6">
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4 flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Affiliations
                </h3>
                <ul className="space-y-3 text-base">
                  {member.affiliations.map((affiliation) => (
                    <li
                      key={`${affiliation.role}-${affiliation.organization}`}
                      className="leading-snug"
                    >
                      <span className="block md:inline font-semibold text-foreground">
                        {affiliation.role}
                      </span>
                      <span aria-hidden="true" className="mr-2 md:ml-2 text-muted-foreground/60">
                        |
                      </span>
                      <span className="sr-only">, </span>
                      {affiliation.url ? (
                        <a
                          href={affiliation.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-current transition-colors"
                        >
                          {affiliation.organization}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">{affiliation.organization}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="border-t border-border pt-6">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Social + Links
              </h3>
              <SocialIcons member={member} className="member-socials" iconClassName="h-8 w-8" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <div>
              <p className="member-cohort">
                {cohort === "Lab Principal Investigator"
                  ? "Lab Principal Investigator"
                  : cohort === "Current"
                    ? "Current team"
                    : `Team · ${cohort}`}
              </p>
              <h1 className="text-4xl md:text-6xl font-bold normal-case tracking-tight leading-none mb-4">
                {member.name}
              </h1>
              <PositionText
                position={member.position}
                stacked
                className="member-position block text-xl md:text-2xl text-primary leading-snug"
              />
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
                <h3 className="text-sm uppercase tracking-widest text-muted-foreground flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Latest
                </h3>
                <RevealList
                  visibleCount={VISIBLE_ACTIVITY_COUNT}
                  moreLabel="See more"
                  lessLabel="See less"
                >
                  {activity.map((entry) => (
                    <EntryRow key={entry.to} to={entry.to}>
                      <EntryRowBody>
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
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
