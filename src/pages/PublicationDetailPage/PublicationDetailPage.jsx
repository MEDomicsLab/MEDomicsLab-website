import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import pubData from "../../data/publications.json";
import { hasPublicationLink } from "../../lib/publications";
import { getMemberByName } from "../../lib/team";
import BackLink from "../../components/BackLink/BackLink.jsx";
import DetailNotFound from "../../components/DetailNotFound/DetailNotFound.jsx";
import MarkdownContent from "../../components/MarkdownContent/MarkdownContent";
import HoverArrow from "../../components/HoverArrow/HoverArrow.jsx";
import BrandName from "../../components/BrandName/BrandName.jsx";

export default function PublicationDetailPage() {
  const { slug } = useParams();

  const match = pubData
    .flatMap((group) => group.items.map((publication) => ({ publication, year: group.year })))
    .find(({ publication }) => publication.slug === slug);

  const publication = match?.publication;
  const hasExternalLink = hasPublicationLink(publication);
  const shouldRedirect = Boolean(publication?.redirect && hasExternalLink);

  useEffect(() => {
    if (!shouldRedirect) return;
    window.location.assign(publication.link);
  }, [shouldRedirect, publication]);

  if (!match) {
    return (
      <DetailNotFound title="Publication" to="/publications" linkLabel="Return to Publications" />
    );
  }

  const { year } = match;
  const authors = publication.contributors ?? [];

  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs uppercase tracking-widest">
        Redirecting to publication...
      </div>
    );
  }

  return (
    <div className="publication-detail min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 md:px-8 pt-24">
        <BackLink to="/publications">Back to Publications</BackLink>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <h1 className="text-3xl md:text-5xl font-bold normal-case tracking-tight leading-tight">
              <BrandName>{publication.title}</BrandName>
            </h1>
            {authors.length > 0 && (
              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
                {authors.map((author, index) => {
                  const teamSlug = getMemberByName(author)?.slug;
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
