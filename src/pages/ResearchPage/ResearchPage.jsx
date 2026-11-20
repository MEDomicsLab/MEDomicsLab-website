import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import projects from "../../data/research-projects.json";
import trackMeta from "../../data/research-tracks.json";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import FilterChips from "../../components/FilterChips/FilterChips.jsx";
import SearchField from "../../components/SearchField/SearchField.jsx";
import RevealList from "../../components/RevealList/RevealList.jsx";
import BrandName from "../../components/BrandName/BrandName.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";
import { imageSrcSet } from "../../lib/images.js";
import { matchesTerms, searchTerms } from "../../lib/filters.js";

const TAGS = Object.keys(trackMeta);

const tagsOf = (project) => [
  project.track,
  ...(project.ecosystem ? ["MEDomics Ecosystem"] : []),
  ...(project.status === "Completed" ? ["Completed"] : []),
];

const sortKey = (project) =>
  (project.status === "Completed" ? TAGS.length : 0) + TAGS.indexOf(project.track);

export default function ResearchPage() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [query, setQuery] = useState("");

  const orderedProjects = useMemo(
    () =>
      projects
        .map((project, index) => ({ project, index }))
        .sort((a, b) => sortKey(a.project) - sortKey(b.project) || a.index - b.index)
        .map(({ project }) => project),
    []
  );

  const tagCounts = useMemo(
    () =>
      orderedProjects.reduce((counts, project) => {
        for (const tag of tagsOf(project)) counts[tag] = (counts[tag] ?? 0) + 1;
        return counts;
      }, {}),
    [orderedProjects]
  );

  const matches = useMemo(() => {
    const terms = searchTerms(query);
    return orderedProjects.map(
      (project) =>
        (!selectedTags.length || tagsOf(project).some((tag) => selectedTags.includes(tag))) &&
        matchesTerms(project.title, terms)
    );
  }, [orderedProjects, selectedTags, query]);

  const previousNumbers = useRef({});
  const numbers = {};
  let shown = 0;
  orderedProjects.forEach((project, index) => {
    numbers[project.slug] = matches[index]
      ? ++shown
      : (previousNumbers.current[project.slug] ?? index + 1);
  });
  useEffect(() => {
    previousNumbers.current = numbers;
  });

  return (
    <PageShell className="research-index">
      <PageTitle className="mb-10">Research Projects</PageTitle>
      <FilterChips
        label="Filter research projects by tag"
        options={TAGS.map((tag) => ({ value: tag, count: tagCounts[tag] ?? 0 }))}
        visibleOptions={TAGS.length}
        selected={selectedTags}
        onChange={setSelectedTags}
        total={orderedProjects.length}
        shown={shown}
        noun="projects"
      >
        <SearchField
          value={query}
          onChange={setQuery}
          placeholder="Search projects"
          label="Search research projects by title"
          className="research-search"
        />
      </FilterChips>

      <RevealList className="research-list" visibleCount={Infinity} matches={matches}>
        {orderedProjects.map((project) => (
          <Link
            key={project.slug}
            to={`/research/${project.slug}`}
            className="research-project group relative block border-t border-border pt-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-1 text-sm tabular-nums text-muted-foreground">
                {String(numbers[project.slug]).padStart(2, "0")}
              </div>

              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center text-xs uppercase tracking-widest px-3 py-1 border border-border text-muted-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                    {project.status}
                  </span>
                  {tagsOf(project)
                    .filter((tag) => tag !== "Completed")
                    .map((tag) => (
                      <span
                        key={tag}
                        title={trackMeta[tag]?.description}
                        className="inline-flex items-center rounded-full text-sm px-3 py-1 bg-white/5 border border-white/10 text-foreground/80"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold normal-case tracking-tight leading-tight group-hover:text-primary transition-colors">
                  <BrandName>{project.title}</BrandName>
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {project.summary}
                </p>
                <span className="project-link-label">
                  View Project <HoverArrow size="lg" />
                </span>
              </div>

              <div
                className={`project-image lg:col-span-4 relative aspect-[4/5] overflow-hidden bg-secondary/20 ${
                  project.homeCard ? "project-image--card" : ""
                }`}
              >
                {project.homeCard ? (
                  <img
                    src={project.homeCard}
                    srcSet={imageSrcSet(project.homeCard, [480, 880], "webp")}
                    sizes="(max-width: 1023px) min(100vw, 420px), 30vw"
                    alt={project.coverImage?.alt ?? project.title}
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full transition-[scale] duration-700 ease-out group-hover:scale-105"
                  />
                ) : (
                  project.coverImage && (
                    <img
                      src={project.coverImage.url}
                      alt={project.coverImage.alt}
                      loading="lazy"
                      className="object-cover w-full h-full transition-[scale] duration-700 ease-out group-hover:scale-105"
                    />
                  )
                )}
              </div>
            </div>
          </Link>
        ))}
      </RevealList>

      {shown === 0 && (
        <p className="research-empty">
          No project titles match <span className="text-foreground">“{query.trim()}”</span>.
        </p>
      )}
    </PageShell>
  );
}
