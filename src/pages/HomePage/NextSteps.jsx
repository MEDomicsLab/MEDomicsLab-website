import { useState } from "react";
import { imageSrcSet } from "../../lib/images.js";
import LoopingMarquee from "./LoopingMarquee.jsx";
import PageLink from "../../components/PageLink/PageLink.jsx";
import { Link } from "react-router-dom";
import { nextCards } from "./homepageContent";

export default function NextSteps({ paused }) {
  const [failed, setFailed] = useState(() => new Set());
  const hideCard = (slug) =>
    setFailed((current) => (current.has(slug) ? current : new Set(current).add(slug)));
  const cards = nextCards.filter((card) => !failed.has(card.slug));

  return (
    <section className="neue-next" aria-labelledby="next-heading">
      <div className="neue-next-intro">
        <h2 id="next-heading" data-neue-reveal>
          Where next?
        </h2>
        <p>
          Come explore the lab’s projects, meet the team, or get in touch to discuss a possible
          collaboration.
        </p>
        <div className="neue-next-links">
          <PageLink to="/research">Our research</PageLink>
          <PageLink to="/team">Meet the team</PageLink>
          <PageLink to="/community/contact">Get in touch</PageLink>
        </div>
      </div>
      <LoopingMarquee
        pauseOffscreenOnMobile
        className={`neue-marquee ${paused ? "is-paused" : ""}`}
        trackClassName="neue-marquee-track"
        setClassName="neue-marquee-set"
      >
        {(duplicate) =>
          cards.map((card) => (
            <Link
              key={card.slug}
              to={card.href}
              tabIndex={duplicate ? -1 : undefined}
              className="neue-next-card group"
            >
              <img
                src={card.image}
                srcSet={imageSrcSet(card.image, [480, 880], "webp")}
                sizes="(max-width: 767px) 72vw, 26vw"
                decoding="async"
                alt={card.title}
                loading="lazy"
                onError={() => hideCard(card.slug)}
              />
            </Link>
          ))
        }
      </LoopingMarquee>
    </section>
  );
}
