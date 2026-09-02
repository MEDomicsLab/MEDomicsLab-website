import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ResearchProject from "../../schemas/ResearchProject";
import { useTranslations } from "../../lib/translations";
import { useEffect } from "react";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import AvatarImage from "../../components/AvatarImage/AvatarImage";
import { getMemberBySlug } from "../../lib/team";

export default function ProjectDetail() {
  const { t } = useTranslations();
  const { slug } = useParams();

  const { data: projects, isLoading } = ResearchProject.useGet();
  const project = projects?.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest">
        {t("common.loading", "Initializing Data...")}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl uppercase tracking-widest font-bold">Project Not Found</div>
        <Link to="/research" className="text-primary hover:underline text-sm uppercase">
          Return to Index
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative h-[60vh] w-full overflow-hidden">
        {project.coverImage ? (
          <img
            src={project.coverImage.url}
            alt={project.coverImage.alt}
            className="w-full h-full object-cover grayscale opacity-50"
            data-fimo-source={`ResearchProject.${project.slug}.coverImage`}
          />
        ) : (
          <div className="w-full h-full bg-secondary/20 flex items-center justify-center">
            <span className="text-muted-foreground uppercase tracking-widest">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

        <div className="absolute bottom-12 left-0 right-0 px-4 md:px-8">
          <div className="container mx-auto">
            <Link
              to="/research"
              className="inline-flex items-center text-xs uppercase tracking-widest text-primary mb-6 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("project.back", "Back to Research")}
            </Link>
            <h1
              className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none max-w-4xl"
              data-fimo-source={`ResearchProject.${project.slug}.title`}
            >
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <p
              className="text-2xl md:text-3xl font-light leading-relaxed mb-12 text-foreground/90"
              data-fimo-source={`ResearchProject.${project.slug}.summary`}
            >
              {project.summary}
            </p>

            {project.markdown ? (
              <MarkdownContent
                markdownPath={project.markdown}
                className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-a:text-primary hover:prose-a:text-white"
              />
            ) : (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Full project details coming soon.
              </p>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32 h-fit">
            <div className="border-t border-border pt-6">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                Status
              </h3>
              <div className="inline-block px-3 py-1 border border-primary/50 text-primary text-xs uppercase tracking-widest">
                {project.status || "Active"}
              </div>
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground">
                Researchers
              </h3>
              <div className="space-y-4">
                {project.researchers?.map((researcherSlug) => {
                  const member = getMemberBySlug(researcherSlug);
                  if (!member) return null;
                  return (
                    <div key={researcherSlug} className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary/40">
                        <AvatarImage
                          src={member.image}
                          alt={member.name}
                          size={40}
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <Link
                          to={`/team/${member.slug}`}
                          className="text-sm font-bold uppercase hover:text-primary transition-colors"
                        >
                          {member.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{member.position}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
