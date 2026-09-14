import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "../../lib/translations";
import pubData from "../../data/publications.json";
import { cn } from "../../lib/utils";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import FilterMenu from "../../components/FilterMenu/FilterMenu.jsx";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";

const PUBLICATION_TYPES = ["Journal Papers", "Conference Papers", "Preprints", "Presentations"];

export default function PublicationsPage() {
  const { t } = useTranslations();
  const [activeYear, setActiveYear] = useState(pubData[0]?.year ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const sectionRefs = useRef({});

  const [activeTypes, setActiveTypes] = useState(PUBLICATION_TYPES);
  // Never let the selection empty out: the last active type stays active.
  const toggleType = (type) =>
    setActiveTypes((prev) => {
      if (!prev.includes(type)) return [...prev, type];
      return prev.length === 1 ? prev : prev.filter((item) => item !== type);
    });

  const typeOrder = {
    "Journal Papers": 0,
    "Conference Papers": 1,
    Preprints: 2,
    Presentations: 3,
  };

  const filteredGroups = useMemo(() => {
    return [...pubData]
      .map((group) => {
        const items = [...group.items]
          .filter((item) => activeTypes.includes(item.type))
          .sort((a, b) => {
            const typeDelta = (typeOrder[a.type] ?? 0) - (typeOrder[b.type] ?? 0);
            if (typeDelta !== 0) return typeDelta;
            return new Date(b.date) - new Date(a.date);
          });
        return { ...group, items };
      })
      .filter((group) => group.items.length > 0)
      .sort((a, b) => b.year - a.year);
  }, [activeTypes]);

  useEffect(() => {
    if (!filteredGroups.length) return;
    if (!filteredGroups.some((group) => group.year === activeYear)) {
      setActiveYear(filteredGroups[0].year);
    }
  }, [activeYear, filteredGroups]);

  useEffect(() => {
    const handleScroll = () => {
      setIsFocused(window.scrollY > 160);
      let currentYear = activeYear;

      for (const group of filteredGroups) {
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
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeYear, filteredGroups]);

  return (
    <PageShell
      ticks={{
        variant: "publications",
        items: filteredGroups.map((group) => ({ id: group.year, label: String(group.year) })),
        activeId: activeYear,
        onSelect: (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" }),
      }}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <PageTitle className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl mb-6">
            {t("publications.title", "Publications")}
          </PageTitle>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mb-16">
            MEDomicsLab publications are curated for lab-specific outputs. For a broader view of
            Martin Vallières’ work, see{" "}
            <a
              href="https://scholar.google.com/citations?user=fRkjFK4AAAAJ&hl=en"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-white transition-colors"
            >
              Google Scholar
            </a>
            .
          </p>
        </div>
      </div>

      <div className="space-y-20">
        {filteredGroups.map((yearGroup, yearIndex) => (
          <div
            key={yearGroup.year}
            ref={(element) => {
              sectionRefs.current[yearGroup.year] = element;
            }}
            className="relative"
          >
            <div className="relative">
              <div className="flex items-start justify-between gap-6">
                <h2
                  className={cn(
                    "font-bold text-muted-foreground/30 mb-6 transition-all duration-500",
                    isFocused ? "text-7xl md:text-8xl" : "text-4xl md:text-5xl"
                  )}
                >
                  {yearGroup.year}
                </h2>
                {yearIndex === 0 && (
                  <FilterMenu
                    options={PUBLICATION_TYPES}
                    active={activeTypes}
                    onToggle={toggleType}
                    label="Filter publications"
                  />
                )}
              </div>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="space-y-0 mt-6">
              {yearGroup.items.map((pub, idx) => (
                <EntryRow key={idx} to={`/publications/${pub.slug}`} variant="detailed">
                  <EntryRowBody variant="detailed">
                    {activeTypes.length > 1 && (
                      <span className="text-[10px] uppercase tracking-widest border border-white/10 rounded-full px-2 py-1 text-white/70 bg-white/5 w-fit mb-3">
                        {pub.type}
                      </span>
                    )}
                    <EntryRowTitle variant="detailed">{pub.title}</EntryRowTitle>
                    <p className="text-sm text-muted-foreground">{pub.contributors.join(", ")}</p>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground/70">
                      {pub.journal}
                    </p>
                  </EntryRowBody>
                </EntryRow>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
