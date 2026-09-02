import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "../../lib/translations";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import SectionDivider from "../../components/SectionDivider/SectionDivider.jsx";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";

export default function CommunityTimelinePage({ title, data, basePath }) {
  const { t } = useTranslations();
  const [activeYear, setActiveYear] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);
  const sectionRefs = useRef({});
  const yearRefs = useRef({});

  const tickItems = useMemo(
    () =>
      data.map((group) => ({
        id: group.year,
        label: group.year,
        subItems: group.months.map((monthGroup) => ({
          id: monthGroup.month,
          label: monthGroup.month,
        })),
      })),
    [data]
  );

  useEffect(() => {
    const handleScroll = () => {
      let currentYear = null;
      let currentMonth = null;
      let found = false;

      for (const group of data) {
        for (const monthGroup of group.months) {
          const key = `${group.year}-${monthGroup.month}`;
          const element = sectionRefs.current[key];
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
              currentYear = group.year;
              currentMonth = monthGroup.month;
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) {
        const firstGroup = data[0];
        const firstMonth = firstGroup?.months?.[0]?.month;
        if (firstGroup && firstMonth) {
          const firstKey = `${firstGroup.year}-${firstMonth}`;
          const firstElement = sectionRefs.current[firstKey];
          if (firstElement) {
            const rect = firstElement.getBoundingClientRect();
            if (rect.top > window.innerHeight / 2) {
              currentYear = null;
              currentMonth = null;
            }
          }
        }
      }

      setActiveYear(currentYear);
      setActiveMonth(currentMonth);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [data]);

  return (
    <PageShell
      ticks={{
        variant: "timeline",
        items: tickItems,
        activeId: activeYear,
        activeSubId: activeMonth,
        onSelect: (yearId) =>
          yearRefs.current[yearId]?.scrollIntoView({ behavior: "smooth", block: "start" }),
        onSelectSub: (yearId, monthId) =>
          sectionRefs.current[`${yearId}-${monthId}`]?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
      }}
    >
      <PageTitle className="mb-20">{t(`community.${title.toLowerCase()}.title`, title)}</PageTitle>

      <div className="space-y-32 pb-32">
        {data.map((group) => (
          <div key={group.year} className="space-y-16">
            <SectionDivider label={group.year} />

            <div className="space-y-16">
              {group.months.map((monthGroup, monthIndex) => (
                <div
                  key={`${group.year}-${monthGroup.month}`}
                  ref={(element) => {
                    const key = `${group.year}-${monthGroup.month}`;
                    sectionRefs.current[key] = element;
                    if (monthIndex === 0) {
                      yearRefs.current[group.year] = element;
                    }
                  }}
                  className="scroll-mt-32"
                >
                  <SectionDivider label={monthGroup.month} tone="muted" className="mb-8" />

                  <div className="space-y-0">
                    {monthGroup.items.map((item, index) => (
                      <EntryRow key={item.title} to={`${basePath}/${item.slug}`} variant="detailed">
                        <div className="md:col-span-1 text-xs uppercase tracking-widest text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <EntryRowBody variant="detailed" className="md:col-span-7 space-y-3">
                          <EntryRowTitle
                            variant="detailed"
                            className="text-2xl md:text-3xl uppercase"
                          >
                            {item.title}
                          </EntryRowTitle>
                        </EntryRowBody>
                        <div className="md:col-span-2 text-xs uppercase tracking-widest text-muted-foreground">
                          <span>Contributors</span>
                          <p className="mt-3 text-sm normal-case tracking-normal text-foreground/80">
                            {item.contributors.join(", ")}
                          </p>
                        </div>
                      </EntryRow>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
