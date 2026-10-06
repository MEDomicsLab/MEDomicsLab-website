import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import teamData from "../../data/team.json";
import { cn } from "../../lib/utils";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import SectionDivider from "../../components/SectionDivider/SectionDivider.jsx";
import SocialIcons from "../../components/SocialIcons/SocialIcons.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";

const IN_COLOUR = new Set(["Lab Principal Investigator", "Current"]);

const getTimelineLabel = (year) => (year === "Lab Principal Investigator" ? "Lab PI" : year);

const data = [...teamData].sort((a, b) => {
  const rank = (group) =>
    group.year === "Lab Principal Investigator" ? 0 : group.year === "Current" ? 1 : 2;
  return rank(a) - rank(b);
});

export default function TeamPage() {
  const [activeYear, setActiveYear] = useState(data[0]?.year ?? "");
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => {
      let currentYear = activeYear;

      for (const group of data) {
        const element = sectionRefs.current[group.year];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
            currentYear = group.year;
            break;
          }
        }
      }

      if (currentYear !== activeYear) {
        setActiveYear(currentYear);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeYear]);

  return (
    <PageShell
      className="team-index"
      ticks={{
        variant: "team",
        items: data.map((group) => ({ id: group.year, label: getTimelineLabel(group.year) })),
        activeId: activeYear,
        onSelect: (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" }),
      }}
    >
      <PageTitle className="mb-12">The Team</PageTitle>

      <div className="space-y-12 md:space-y-16">
        {data.map((group, groupIndex) => (
          <div
            key={group.year}
            id={`year-${group.year}`}
            ref={(element) => {
              sectionRefs.current[group.year] = element;
            }}
            className="scroll-mt-32"
          >
            <SectionDivider label={group.year} className="team-divider mb-6 md:mb-8" />

            <div
              className={cn(
                "grid gap-x-8 gap-y-14",
                groupIndex === 0
                  ? "grid-cols-1"
                  : groupIndex === 1
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              )}
            >
              {group.members.map((member) => {
                const isLarge = groupIndex <= 1;
                const inColour = IN_COLOUR.has(group.year);
                const avatarSize = groupIndex === 0 ? 256 : isLarge ? 160 : 128;
                const initials = member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("");

                return (
                  <article
                    key={member.name}
                    className={cn("team-card group", groupIndex === 0 && "team-card-pi")}
                  >
                    <div
                      className="team-portrait relative overflow-hidden bg-secondary/40 shrink-0"
                      style={{ width: avatarSize, height: avatarSize }}
                    >
                      {member.image ? (
                        <AvatarImage
                          src={member.image}
                          alt={member.name}
                          size={avatarSize}
                          className="team-avatar"
                          imgClassName={cn(
                            "transition-all duration-500 group-hover:scale-105",
                            !inColour &&
                              "grayscale group-hover:grayscale-0 group-focus-within:grayscale-0"
                          )}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-base uppercase">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "team-card-copy min-w-0 space-y-2",
                        isLarge && "team-card-current"
                      )}
                    >
                      <h2
                        className={cn(
                          "font-bold normal-case tracking-tight leading-tight group-hover:text-primary transition-colors",
                          isLarge ? "text-2xl" : "text-xl"
                        )}
                      >
                        {member.slug ? (
                          <Link className="team-profile-link" to={`/team/${member.slug}`}>
                            {member.name}
                            <HoverArrow size="lg" />
                          </Link>
                        ) : (
                          member.name
                        )}
                      </h2>
                      <p
                        className={cn(
                          "team-position text-muted-foreground leading-snug",
                          isLarge ? "text-base" : "text-sm",
                          group.year === "Lab Principal Investigator"
                            ? "whitespace-pre-line"
                            : "line-clamp-2"
                        )}
                      >
                        {group.year === "Lab Principal Investigator" ? (
                          <>
                            <span className="hidden md:inline">
                              {member.position.replace(", ", "\n")}
                            </span>
                            <span className="md:hidden">
                              {member.position.replace(" | ", "\n\n").replaceAll(", ", ",\n")}
                            </span>
                          </>
                        ) : (
                          member.position
                        )}
                      </p>
                      {member.note && (
                        <p className={cn("text-primary", isLarge ? "text-base" : "text-sm")}>
                          {member.note}
                        </p>
                      )}
                      <SocialIcons
                        member={member}
                        stopPropagation
                        className="team-socials flex flex-wrap gap-5 w-fit pt-3"
                        iconClassName={isLarge ? "h-5 w-5" : "h-[18px] w-[18px]"}
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
