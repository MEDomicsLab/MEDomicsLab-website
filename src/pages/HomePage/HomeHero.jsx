import { ArrowDown, Pause, Play } from "lucide-react";
import LabVideo from "./LabVideo.jsx";
import homeData from "../../data/home.json";
import { investigatorName, principalInvestigator } from "./homepageContent";

export default function HomeHero({ paused, onTogglePause, onPosterReady }) {
  return (
    <section className="neue-hero blue-paper" aria-labelledby="home-heading">
      <div className="neue-hero-composition">
        <h1 id="home-heading" aria-label={homeData.brand.name}>
          <span className="neue-hero-medomics">MEDomics</span>
          <span className="neue-hero-lab">Lab</span>
        </h1>
        <div className="neue-hero-film">
          <LabVideo onPosterReady={onPosterReady} />
          <button
            type="button"
            className="neue-motion-toggle"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={
              paused
                ? "Play background videos and animations"
                : "Pause background videos and animations"
            }
          >
            {paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
        </div>
      </div>
      <div className="neue-hero-bottom">
        <p className="neue-hero-description">
          The MEDomicsLab research laboratory focuses on the development of predictive models with
          heterogeneous medical data.
        </p>
        <img
          className="neue-hero-logo"
          src={homeData.brand.lightLogoUrl}
          alt={`${homeData.brand.name} logo`}
        />
        <a
          className="neue-hero-credit group"
          href="#lab"
          aria-label={`By Professor ${principalInvestigator.name}. Discover the laboratory`}
        >
          <span>
            <span className="neue-hero-by">By</span>
            Professor
            <br />
            {investigatorName.firstName}{" "}
            <span className="neue-hero-credit-end">
              {investigatorName.rest}
              <ArrowDown aria-hidden="true" />
            </span>
          </span>
        </a>
      </div>
    </section>
  );
}
