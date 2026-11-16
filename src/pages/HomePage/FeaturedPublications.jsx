import PageLink from "../../components/PageLink/PageLink.jsx";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import home from "../../data/home.json";

const { featuredPublications } = home.sections;

export default function FeaturedPublications() {
  const [active, setActive] = useState(0);

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
        {featuredPublications.map((paper, index) => (
          <article
            className={`neue-publication-panel neue-publication-panel-${index} ${active === index ? "is-open" : ""}`}
            key={paper.link}
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
              <span>{paper.type}</span>
              <span>{index + 1}</span>
            </button>
            <div
              className="neue-publication-content"
              id={`paper-content-${index}`}
              role="region"
              aria-labelledby={`paper-tab-${index}`}
            >
              <div className="neue-publication-venue">
                <p>{paper.venue}</p>
                <span>{paper.year}</span>
              </div>
              <h3>{paper.title}</h3>
              <div
                className="neue-publication-abstract"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                role="region"
                aria-label={`Abstract of ${paper.title}`}
                data-lenis-prevent
              >
                <ReactMarkdown allowedElements={["p", "em", "strong"]} unwrapDisallowed>
                  {paper.abstract}
                </ReactMarkdown>
              </div>
              <PageLink
                className="neue-publication-link"
                href={paper.link}
                target="_blank"
                rel="noreferrer"
              >
                Read publication
              </PageLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
