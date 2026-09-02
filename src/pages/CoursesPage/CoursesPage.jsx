import { useMemo, useState } from "react";
import { useTranslations } from "../../lib/translations";
import coursesData from "../../data/courses.json";
import { cn } from "../../lib/utils";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";

const INSTITUTIONS = ["Sherbrooke", "McGill"];

export default function CoursesPage() {
  const { t } = useTranslations();
  const [activeInstitution, setActiveInstitution] = useState(INSTITUTIONS[0]);

  const filteredCourses = useMemo(
    () => coursesData.filter((course) => course.institution === activeInstitution),
    [activeInstitution]
  );

  return (
    <PageShell
      ticks={{
        variant: "compact",
        items: INSTITUTIONS.map((institution) => ({ id: institution, label: institution })),
        activeId: activeInstitution,
        onSelect: (id) => setActiveInstitution(id),
      }}
    >
      <PageTitle className="mb-6">{t("community.courses.title", "Courses")}</PageTitle>
      <p className="text-sm md:text-base text-muted-foreground max-w-3xl mb-6">
        {t(
          "community.courses.description",
          "Explore the MEDomicsLab course offerings and course materials."
        )}
      </p>
      <div className="flex flex-wrap gap-3 mb-10 lg:hidden">
        {INSTITUTIONS.map((institution) => (
          <button
            key={institution}
            type="button"
            onClick={() => setActiveInstitution(institution)}
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors",
              institution === activeInstitution
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary"
            )}
          >
            {institution}
          </button>
        ))}
      </div>

      <div className="space-y-0">
        {filteredCourses.length === 0 ? (
          <div className="border border-border/60 rounded-2xl p-10 text-muted-foreground text-sm uppercase tracking-widest">
            No courses for the time being.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <EntryRow key={course.slug} to={`/community/courses/${course.slug}`} variant="detailed">
              <EntryRowBody variant="detailed">
                <span className="text-[10px] uppercase tracking-widest border border-white/10 rounded-full px-2 py-1 text-white/70 bg-white/5 w-fit mb-3">
                  {course.institution}
                </span>
                <EntryRowTitle variant="detailed">{course.title}</EntryRowTitle>
              </EntryRowBody>
            </EntryRow>
          ))
        )}
      </div>
    </PageShell>
  );
}
