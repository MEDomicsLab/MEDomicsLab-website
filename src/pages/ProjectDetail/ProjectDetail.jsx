import { useParams } from "react-router-dom";
import projects from "../../data/research-projects.json";
import BackLink from "../../components/BackLink/BackLink.jsx";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import { getMembersByCohort } from "../../lib/team";
import ResearcherList from "../../components/ResearcherList/ResearcherList.jsx";
import BrandName from "../../components/BrandName/BrandName.jsx";
import { imageSrcSet } from "../../lib/images";

export default function ProjectDetail() {
  const { slug } = useParams();

  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <DetailNotFound title="Project" to="/research" />;
  }

  return (
    <div className="project-detail min-h-screen bg-background pb-20">
      <header className="project-header container mx-auto px-4 md:px-8">
        <BackLink to="/research">Back to Research</BackLink>
        <div className="project-heading-grid">
          <div>
            <p className="interior-eyebrow">
              {[project.track, project.ecosystem && "MEDomics Ecosystem", "Research project"]
                .filter(Boolean)
                .join(" · ")}
            </p>
            <h1>
              <BrandName>{project.title}</BrandName>
            </h1>
          </div>
          {project.homeCard && (
            <figure className="project-cover">
              <img
                src={project.homeCard}
                srcSet={imageSrcSet(project.homeCard, [480, 880], "webp")}
                sizes="(max-width: 1023px) min(100vw, 420px), 420px"
                alt={project.coverImage?.alt ?? project.title}
              />
            </figure>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="project-article lg:col-span-8">
            <p className="text-2xl md:text-3xl font-light leading-relaxed mb-12 text-foreground/90">
              {project.summary}
            </p>

            {project.markdown ? (
              <MarkdownContent markdownPath={project.markdown} className="project-markdown" />
            ) : (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Full project details coming soon.
              </p>
            )}
          </div>

          <div className="project-metadata lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="border-t border-border pt-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Status
              </h3>
              <div className="inline-block px-3 py-1 border border-primary/50 text-primary text-xs uppercase tracking-widest">
                {project.status || "Active"}
              </div>
            </div>

            {project.track && (
              <div className="border-t border-border pt-6">
                <h3 className="text-sm text-muted-foreground mb-3">Track</h3>
                <p>{project.track}</p>
                {project.ecosystem && <p>MEDomics Ecosystem</p>}
              </div>
            )}
            <ResearcherList
              people={[
                ...getMembersByCohort(project.researchers),
                ...(project.externalResearchers ?? []).map((p) =>
                  typeof p === "string" ? { name: p } : p
                ),
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
