import { useEffect, useMemo, useRef, useState } from "react";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import FilterChips from "../../components/FilterChips/FilterChips.jsx";

export default function CommunityTimelinePage({ title, data: allData, basePath, categories = [] }) {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const allItems = useMemo(
    () => allData.flatMap((group) => group.months.flatMap((monthGroup) => monthGroup.items)),
    [allData]
  );
  const categoryOptions = useMemo(
    () =>
      categories
        .map((category) => ({
          value: category,
          count: allItems.filter((item) => item.category === category).length,
        }))
        .filter((option) => option.count > 0),
    [allItems, categories]
  );

  const data = useMemo(() => {
    if (!selectedCategories.length) return allData;
    return allData
      .map((group) => ({
        ...group,
        months: group.months
          .map((monthGroup) => ({
            ...monthGroup,
            items: monthGroup.items.filter((item) => selectedCategories.includes(item.category)),
          }))
          .filter((monthGroup) => monthGroup.items.length > 0),
      }))
      .filter((group) => group.months.length > 0);
  }, [allData, selectedCategories]);
  const shownCount = data.reduce(
    (sum, group) =>
      sum + group.months.reduce((acc, monthGroup) => acc + monthGroup.items.length, 0),
    0
  );
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
      className="collection-index community-timeline"
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
      <PageTitle>{title}</PageTitle>
      {categoryOptions.length > 1 && (
        <FilterChips
          className="mb-16"
          label={`Filter ${title.toLowerCase()} by category`}
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
          total={allItems.length}
          shown={shownCount}
          noun={title.toLowerCase()}
        />
      )}

      <div className="space-y-20">
        {data.map((group) => (
          <section
            key={group.year}
            ref={(element) => {
              yearRefs.current[group.year] = element;
            }}
            className="collection-group scroll-mt-32"
            data-active={activeYear === group.year}
            aria-labelledby={`timeline-year-${group.year}`}
          >
            <h2
              id={`timeline-year-${group.year}`}
              className="collection-group-title text-4xl md:text-5xl mb-6"
            >
              {group.year}
            </h2>
            <div className="h-px w-full bg-border" />

            <div className="space-y-12 mt-8">
              {group.months.map((monthGroup) => (
                <div
                  key={`${group.year}-${monthGroup.month}`}
                  ref={(element) => {
                    const key = `${group.year}-${monthGroup.month}`;
                    sectionRefs.current[key] = element;
                  }}
                  className="scroll-mt-32"
                >
                  <h3 className="timeline-month-title">{monthGroup.month}</h3>

                  <div className="space-y-0">
                    {monthGroup.items.map((item) => (
                      <EntryRow key={item.title} to={`${basePath}/${item.slug}`} variant="detailed">
                        <EntryRowBody variant="detailed">
                          {item.category && (
                            <span className="inline-block text-xs uppercase tracking-widest border border-white/10 rounded-full px-3 py-1 text-white/70 bg-white/5 w-fit">
                              {item.category}
                            </span>
                          )}
                          <EntryRowTitle as="h4" variant="detailed">
                            {item.title}
                          </EntryRowTitle>
                          <p className="text-base text-muted-foreground">
                            {item.contributors.join(", ")}
                          </p>
                        </EntryRowBody>
                      </EntryRow>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
