import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ResearchProject from "../../schemas/ResearchProject";
import { useTranslations } from "../../lib/translations";
import { cn } from "../../lib/utils";
import trackMeta from "../../data/research-tracks.json";
import PageShell, { PageTitle } from "../../components/PageShell/PageShell.jsx";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";

const TRACKS = ["General", "Doctorate", "Master's", "Completed"];

export default function ResearchPage() {
  const { t } = useTranslations();
  const { data: projects, isLoading } = ResearchProject.useGet();
  const [activeTrack, setActiveTrack] = useState(TRACKS[0]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTrack]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeTrack === "Completed") {
      return projects.filter((project) => project.status === "Completed");
    }
    return projects.filter(
      (project) => project.track === activeTrack && project.status === "Active"
    );
  }, [projects, activeTrack]);

  const activeIndex = TRACKS.indexOf(activeTrack);
  const nextTrack = TRACKS[(activeIndex + 1) % TRACKS.length];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest">
        {t("common.loading", "Initializing Data...")}
      </div>
    );
  }

  return (
    <PageShell
      ticks={{
        variant: "team",
        items: TRACKS.map((track) => ({ id: track, label: track })),
        activeId: activeTrack,
        onSelect: (id) => setActiveTrack(id),
        tooltip: (item) => trackMeta[item.id]?.description,
      }}
    >
      <PageTitle className="mb-20">{t("research.title", "Research Projects")}</PageTitle>
      <div className="flex flex-wrap gap-3 mb-10 lg:hidden">
        {TRACKS.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => setActiveTrack(track)}
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors",
              track === activeTrack
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-primary hover:border-primary"
            )}
          >
            {track}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-20">
        {filteredProjects.map((project, index) => (
          <div key={project.slug} className="group relative border-t border-border pt-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-2 text-xs uppercase tracking-widest text-muted-foreground">
                0{index + 1} / {project.status}
              </div>

              <div className="lg:col-span-6 space-y-8">
                <div className="inline-flex items-center text-[10px] uppercase tracking-widest px-2 py-1 border border-border text-muted-foreground w-fit">
                  {project.status}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight uppercase group-hover:text-primary transition-colors">
                  {project.title}
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                  {project.summary}
                </p>
                <div className="pt-4">
                  <Link
                    to={`/research/${project.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest border border-border px-6 py-3 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                  >
                    {t("research.view", "View Project")}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 relative aspect-[4/3] overflow-hidden bg-secondary/20 rounded-2xl border border-border/60">
                {project.coverImage && (
                  <img
                    src={project.coverImage.url}
                    alt={project.coverImage.alt}
                    className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 pt-8 border-t border-border/60 flex justify-end">
        <button
          type="button"
          onClick={() => setActiveTrack(nextTrack)}
          className="inline-flex items-center text-xs uppercase tracking-widest hover:text-primary transition-colors group"
        >
          Next track: {nextTrack}
          <HoverArrow variant="slide" className="ml-2" />
        </button>
      </div>
    </PageShell>
  );
}
