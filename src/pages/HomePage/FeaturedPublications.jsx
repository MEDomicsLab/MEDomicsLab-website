import PageLink from "../../components/PageLink/PageLink.jsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import publicationsData from "../../data/publications.json";
import { getMarkdownContent } from "../../lib/markdown";

const papers = publicationsData
  .flatMap((group) => group.items.map((paper) => ({ ...paper, year: group.year })))
  .sort((a, b) => (b.date || b.year).localeCompare(a.date || a.year))
  .slice(0, 4)
  .map((paper) => ({
    ...paper,
    title: paper.title.replace(/\s*\((?:Journal Article|Preprint|Conference Paper)\)$/i, ""),
    venue: paper.journal.replace(/\s*\([A-Z][A-Z0-9. -]+\)$/, ""),
  }));

export default function FeaturedPublications() {
  const [active, setActive] = useState(0);
  const [abstracts, setAbstracts] = useState({});
  useEffect(() => {
    let cancelled = false;
    Promise.all(
      papers.map(async (paper) => {
        const markdown = await getMarkdownContent(paper.markdown);
        const abstract = markdown?.match(/## Abstract\s*\n([\s\S]*?)(?=\n## |$)/)?.[1]?.trim();
        return [paper.slug, abstract];
      })
    ).then((entries) => {
      if (!cancelled) setAbstracts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="neue-publications" aria-labelledby="publications-heading">
      <div className="neue-publications-intro">
        <h2 id="publications-heading">
          Featured
          <br />
          Publications
        </h2>
        <div>
          <PageLink className="neue-publications-all" to="/publications">
            View all publications
          </PageLink>
        </div>
      </div>
      <div className="neue-publication-panels" onMouseLeave={() => setActive(0)}>
        {papers.map((paper, index) => (
          <article
            className={`neue-publication-panel neue-publication-panel-${index} ${active === index ? "is-open" : ""}`}
            key={paper.slug}
          >
            <button
              className="neue-publication-tab"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              aria-expanded={active === index}
              aria-controls={`paper-content-${index}`}
              id={`paper-tab-${index}`}
              aria-label={`Read publication ${index + 1}: ${paper.title}`}
            >
              <span>
                {paper.type === "Journal Papers"
                  ? "Journal Paper"
                  : paper.type === "Conference Papers"
                    ? "Conference Paper"
                    : "Preprint"}
              </span>
              <span>{index + 1}</span>
            </button>
            <div
              className="neue-publication-content"
              id={`paper-content-${index}`}
              role="region"
              aria-labelledby={`paper-tab-${index}`}
              hidden={active !== index}
            >
              <div className="neue-publication-venue">
                <p title={paper.journal}>{paper.venue}</p>
                <span>{paper.year}</span>
              </div>
              <h3>
                <Link to={`/publications/${paper.slug}`}>{paper.title}</Link>
              </h3>
              <div
                className="neue-publication-abstract"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                role="region"
                aria-label={`Abstract of ${paper.title}`}
                data-lenis-prevent
              >
                {abstracts[paper.slug] ? (
                  <ReactMarkdown>{abstracts[paper.slug]}</ReactMarkdown>
                ) : (
                  <p>Loading abstract…</p>
                )}
              </div>
              <PageLink className="neue-publication-link" to={`/publications/${paper.slug}`}>
                Read publication
              </PageLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
