import LoopingMarquee from "./LoopingMarquee.jsx";
import PageLink from "../../components/PageLink/PageLink.jsx";
import { Link } from "react-router-dom";
import { nextCards } from "./homepageContent";

export default function NextSteps({ paused }) {
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
        className={`neue-marquee ${paused ? "is-paused" : ""}`}
        trackClassName="neue-marquee-track"
        setClassName="neue-marquee-set"
      >
        {(duplicate) =>
          nextCards.map((card) => (
            <Link
              key={card.slug}
              to={card.href}
              tabIndex={duplicate ? -1 : undefined}
              className="neue-next-card group"
            >
              <img src={card.image} alt={card.title} loading="lazy" />
            </Link>
          ))
        }
      </LoopingMarquee>
    </section>
  );
}
