import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import pubData from "../../data/publications.json";
import teamData from "../../data/team.json";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";

const normalizeAuthorName = (value) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const buildTeamAuthorMap = () => {
  const map = new Map();
  teamData.forEach((group) => {
    group.members.forEach((member) => {
      map.set(normalizeAuthorName(member.name), member.slug);
    });
  });
  return map;
};

export default function PublicationDetailPage() {
  const { slug } = useParams();
  const authorMap = buildTeamAuthorMap();

  const match = pubData
    .flatMap((group) => group.items.map((publication) => ({ publication, year: group.year })))
    .find(({ publication }) => publication.slug === slug);

  if (!match) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="text-xl uppercase tracking-widest font-bold">Publication Not Found</div>
        <Link to="/publications" className="text-primary hover:underline text-sm uppercase">
          Return to Publications
        </Link>
      </div>
    );
  }

  const { publication, year } = match;
  const hasExternalLink = publication.link && publication.link !== "#";
  const shouldRedirect = Boolean(publication.redirect && hasExternalLink);
  const authors = publication.contributors ?? [];

  useEffect(() => {
    if (!shouldRedirect) return;
    window.location.assign(publication.link);
  }, [shouldRedirect, publication.link]);

  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest">
        Redirecting to publication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-24">
        <Link
          to="/publications"
          className="inline-flex items-center text-xs uppercase tracking-widest text-primary mb-8 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Publications
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
              {publication.title}
            </h1>
            {authors.length > 0 && (
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                {authors.map((author, index) => {
                  const normalized = normalizeAuthorName(author);
                  const teamSlug = authorMap.get(normalized);
                  return (
                    <span key={`${author}-${index}`}>
                      {teamSlug ? (
                        <Link
                          to={`/team/${teamSlug}`}
                          className="text-primary hover:text-white transition-colors"
                        >
                          {author}
                        </Link>
                      ) : (
                        author
                      )}
                      {index < authors.length - 1 ? ", " : ""}
                    </span>
                  );
                })}
              </p>
            )}
            {publication.markdown ? (
              <MarkdownContent markdownPath={publication.markdown} />
            ) : (
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                Full article details coming soon.
              </p>
            )}
            {hasExternalLink && (
              <a
                href={publication.link}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 inline-flex items-center text-xs uppercase tracking-widest text-primary hover:text-white transition-colors"
              >
                View publication
                <HoverArrow className="ml-2 h-4 w-4" />
              </a>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="border-t border-border pt-6 space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Journal
                </h3>
                <p className="text-sm text-foreground/80">{publication.journal}</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Year
                </h3>
                <p className="text-sm text-foreground/80">{year}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
