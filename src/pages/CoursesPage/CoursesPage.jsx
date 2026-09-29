import { useMemo, useState } from "react";
import coursesData from "../../data/courses.json";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import EntryRow, { EntryRowBody, EntryRowTitle } from "../../components/EntryRow/EntryRow.jsx";
import FilterChips from "../../components/FilterChips/FilterChips.jsx";

const INSTITUTIONS = [...new Set(coursesData.map((course) => course.institution))];

export default function CoursesPage() {
  const [selected, setSelected] = useState([]);

  const counts = useMemo(
    () =>
      coursesData.reduce(
        (acc, course) => ({ ...acc, [course.institution]: (acc[course.institution] ?? 0) + 1 }),
        {}
      ),
    []
  );

  const groups = useMemo(
    () =>
      INSTITUTIONS.filter((institution) => !selected.length || selected.includes(institution))
        .map((institution) => ({
          institution,
          courses: coursesData.filter((course) => course.institution === institution),
        }))
        .filter((group) => group.courses.length > 0),
    [selected]
  );
  const shown = groups.reduce((sum, group) => sum + group.courses.length, 0);

  return (
    <PageShell className="collection-index courses-index">
      <PageTitle className="mb-6">Courses</PageTitle>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-10">
        Explore the MEDomicsLab course offerings and course materials.
      </p>
      <FilterChips
        className="mb-16"
        label="Filter courses by institution"
        options={INSTITUTIONS.map((institution) => ({
          value: institution,
          count: counts[institution] ?? 0,
        }))}
        selected={selected}
        onChange={setSelected}
        total={coursesData.length}
        shown={shown}
        noun="courses"
      />

      <div className="space-y-20">
        {groups.map((group) => (
          <div key={group.institution}>
            <h2 className="collection-group-title text-4xl md:text-5xl mb-6">
              {group.institution}
            </h2>
            <div className="h-px w-full bg-border" />
            <div className="mt-6">
              {group.courses.map((course) => (
                <EntryRow
                  key={course.slug}
                  to={`/community/courses/${course.slug}`}
                  variant="detailed"
                >
                  <EntryRowBody variant="detailed">
                    <EntryRowTitle variant="detailed">{course.title}</EntryRowTitle>
                    {course.summary && course.summary !== course.title && (
                      <p className="text-base text-muted-foreground">{course.summary}</p>
                    )}
                    {course.sessions?.length ? (
                      <p className="text-sm italic text-muted-foreground/80">
                        {course.sessions.join(" · ")}
                      </p>
                    ) : null}
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
