import { useEffect, useMemo, useRef, useState } from "react";
import pubData from "../../data/publications.json";
import { cn } from "../../lib/utils";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import FilterChips from "../../components/FilterChips/FilterChips.jsx";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";

const PUBLICATION_TYPES = ["Journal Papers", "Conference Papers", "Preprints"];

const TYPE_COUNTS = pubData
  .flatMap((group) => group.items)
  .reduce((counts, item) => ({ ...counts, [item.type]: (counts[item.type] ?? 0) + 1 }), {});
const typeOrder = Object.fromEntries(PUBLICATION_TYPES.map((type, index) => [type, index]));

const TOTAL = Object.values(TYPE_COUNTS).reduce((sum, count) => sum + count, 0);

export default function PublicationsPage() {
  const [activeYear, setActiveYear] = useState(pubData[0]?.year ?? "");
  const [isFocused, setIsFocused] = useState(false);
  const sectionRefs = useRef({});

  const [selectedTypes, setSelectedTypes] = useState([]);
  const activeTypes = selectedTypes.length ? selectedTypes : PUBLICATION_TYPES;

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
  const shownCount = filteredGroups.reduce((sum, group) => sum + group.items.length, 0);

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
      className="collection-index publications-index"
      ticks={{
        variant: "publications",
        items: filteredGroups.map((group) => ({ id: group.year, label: String(group.year) })),
        activeId: activeYear,
        onSelect: (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth" }),
      }}
    >
      <PageTitle className="mb-6">Publications</PageTitle>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-10">
        MEDomicsLab publications are curated for lab-specific outputs. For a broader view of Martin
        Vallières’ work, see{" "}
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
      <FilterChips
        className="mb-16"
        label="Filter publications by type"
        options={PUBLICATION_TYPES.map((type) => ({ value: type, count: TYPE_COUNTS[type] ?? 0 }))}
        selected={selectedTypes}
        onChange={setSelectedTypes}
        total={TOTAL}
        shown={shownCount}
        noun="publications"
      />

      <div className="space-y-20">
        {filteredGroups.map((yearGroup) => (
          <div
            key={yearGroup.year}
            ref={(element) => {
              sectionRefs.current[yearGroup.year] = element;
            }}
            className="collection-group publication-year scroll-mt-32"
            data-active={activeYear === yearGroup.year}
          >
            <div className="relative">
              <h2
                className={cn(
                  "collection-group-title publication-year-title mb-6 transition-all duration-500",
                  isFocused ? "text-6xl md:text-7xl" : "text-4xl md:text-5xl"
                )}
              >
                {yearGroup.year}
              </h2>
              <div className="h-px w-full bg-border" />
            </div>

            <div className="space-y-0 mt-6">
              {yearGroup.items.map((pub, idx) => (
                <EntryRow key={idx} to={`/publications/${pub.slug}`} variant="detailed">
                  <EntryRowBody variant="detailed">
                    {activeTypes.length > 1 && (
                      <span className="inline-block text-xs uppercase tracking-widest border border-white/10 rounded-full px-3 py-1 text-white/70 bg-white/5 w-fit mb-3">
                        {pub.type}
                      </span>
                    )}
                    <EntryRowTitle variant="detailed">{pub.title}</EntryRowTitle>
                    <p className="text-base text-muted-foreground">{pub.contributors.join(", ")}</p>
                    <p className="text-sm italic text-muted-foreground/80">{pub.journal}</p>
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
