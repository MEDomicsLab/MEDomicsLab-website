import LoopingMarquee from "./LoopingMarquee.jsx";

export default function PartnerLogos({ institutes }) {
  return (
    <LoopingMarquee
      className="neue-institutes"
      trackClassName="neue-institute-track"
      setClassName="neue-institute-set"
      label="Research affiliations"
    >
      {(duplicate) =>
        institutes.map((institute) => (
          <a
            href={institute.url}
            title={institute.name}
            aria-label={institute.name}
            key={institute.url}
            target="_blank"
            rel="noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            className={institute.wide ? "is-wide" : undefined}
          >
            <img src={institute.logo} alt="" loading="lazy" />
          </a>
        ))
      }
    </LoopingMarquee>
  );
}
