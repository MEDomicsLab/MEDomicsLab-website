import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import teamData from "../../data/team.json";
import { useTranslations } from "../../lib/translations";
import { cn } from "../../lib/utils";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import SectionDivider from "../../components/SectionDivider/SectionDivider.jsx";

const SOCIAL_ITEMS = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "email", label: "Email" },
  { key: "scholar", label: "Scholar" },
  { key: "researchgate", label: "ResearchGate" },
  { key: "stackoverflow", label: "StackOverflow" },
  { key: "cv", label: "CV" },
];

const getTimelineLabel = (year) => (year === "Lab Principal Investigator" ? "Lab PI" : year);

export default function TeamPage() {
  const { t } = useTranslations();
  const data = teamData;
  const navigate = useNavigate();
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
  }, [activeYear, data]);

  return (
    <PageShell
      ticks={{
        variant: "team",
        items: data.map((group) => ({ id: group.year, label: getTimelineLabel(group.year) })),
        activeId: activeYear,
        onSelect: (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" }),
      }}
    >
      <PageTitle className="mb-20">{t("team.title", "The Team")}</PageTitle>

      <div className="space-y-32 pb-32">
        {data.map((group, groupIndex) => (
          <div
            key={group.year}
            id={`year-${group.year}`}
            ref={(element) => {
              sectionRefs.current[group.year] = element;
            }}
            className="scroll-mt-32"
          >
            <SectionDivider label={group.year} className="mb-12" />

            <div
              className={cn(
                "grid gap-x-8 gap-y-6 md:gap-y-16 lg:gap-y-12",
                groupIndex === 0
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              )}
            >
              {group.members.map((member) => {
                const isLarge = groupIndex === 0;
                const initials = member.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("");

                const socials = member.socials ?? {};
                const emailValue = member.email ?? "";

                const cardHeight = isLarge
                  ? "h-[240px] md:h-[260px] lg:h-[320px]"
                  : "h-[240px] md:h-[260px] lg:h-[240px]";
                const isLabPI = group.year === "Lab Principal Investigator";

                return (
                  <div
                    key={member.name}
                    className={cn(
                      "group cursor-pointer space-y-4 flex flex-col h-full",
                      isLabPI ? null : cardHeight
                    )}
                    role={member.slug ? "button" : undefined}
                    tabIndex={member.slug ? 0 : undefined}
                    onClick={() => {
                      if (member.slug) {
                        navigate(`/team/${member.slug}`);
                      }
                    }}
                    onKeyDown={(event) => {
                      if (member.slug && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        navigate(`/team/${member.slug}`);
                      }
                    }}
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden bg-secondary/40 border border-border/60 shrink-0">
                      {member.image ? (
                        <AvatarImage
                          src={member.image}
                          alt={member.name}
                          size={80}
                          className="rounded-full"
                          imgClassName="grayscale group-hover:grayscale-0 transition-all duration-500 rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs uppercase">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div
                      className={cn(
                        "space-y-1 transition-all flex-1 flex flex-col",
                        isLarge
                          ? "border-l border-primary pl-4 group-hover:pl-6"
                          : "opacity-70 group-hover:opacity-100"
                      )}
                    >
                      <h2
                        className={cn(
                          "font-bold uppercase tracking-tight group-hover:text-primary transition-colors leading-tight",
                          isLabPI ? null : "line-clamp-1",
                          isLarge
                            ? isLabPI
                              ? "text-xl"
                              : "text-xl min-h-[28px] max-h-[28px]"
                            : "text-sm min-h-[20px] max-h-[20px]"
                        )}
                      >
                        {member.name}
                      </h2>
                      <p
                        className={cn(
                          "uppercase tracking-widest text-muted-foreground leading-tight",
                          isLabPI ? null : "line-clamp-1",
                          isLarge
                            ? isLabPI
                              ? "text-xs"
                              : "text-xs min-h-[16px] max-h-[16px]"
                            : "text-[10px] min-h-[14px] max-h-[14px]"
                        )}
                      >
                        {member.position}
                      </p>
                      <p
                        className={cn(
                          "uppercase tracking-widest text-primary",
                          isLabPI ? null : "line-clamp-1",
                          isLarge
                            ? isLabPI
                              ? "text-xs"
                              : "text-xs min-h-[16px] max-h-[16px]"
                            : "text-[10px] min-h-[14px] max-h-[14px]"
                        )}
                      >
                        {member.note}
                      </p>

                      <div
                        className={cn(
                          "hidden lg:flex lg:flex-col lg:gap-3",
                          isLabPI ? "mt-3" : "mt-auto"
                        )}
                      >
                        <div className="h-px w-20 bg-border/50" />
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                          {SOCIAL_ITEMS.map((item) => {
                            const value = item.key === "email" ? emailValue : socials[item.key];
                            const isActive = Boolean(value);
                            const label = item.label;
                            const content = (
                              <span
                                className={cn(
                                  "text-[10px] uppercase tracking-widest transition-transform",
                                  isActive
                                    ? "text-white font-bold hover:text-primary hover:scale-110"
                                    : "text-muted-foreground/60"
                                )}
                              >
                                {label}
                              </span>
                            );

                            if (isActive) {
                              const href = item.key === "email" ? `mailto:${value}` : value;
                              return (
                                <a
                                  key={item.key}
                                  href={href}
                                  className="transition-colors"
                                  target={item.key === "email" ? undefined : "_blank"}
                                  rel={item.key === "email" ? undefined : "noreferrer"}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {content}
                                </a>
                              );
                            }

                            return <div key={item.key}>{content}</div>;
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
