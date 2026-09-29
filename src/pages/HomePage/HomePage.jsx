import { useEffect, useRef, useState } from "react";
import { LabVideoProvider } from "./LabVideo.jsx";
import useHeroLayout from "./useHeroLayout.js";
import useHeroEntrance from "./useHeroEntrance.js";
import useHomepageMotion from "./useHomepageMotion.js";
import HomeHero from "./HomeHero.jsx";
import PrincipalInvestigator from "./PrincipalInvestigator.jsx";
import Ecosystem from "./Ecosystem.jsx";
import VideoReel from "./VideoReel.jsx";
import FeaturedPublications from "./FeaturedPublications.jsx";
import LatestNews from "./LatestNews.jsx";
import HomeEvents from "./HomeEvents.jsx";
import NextSteps from "./NextSteps.jsx";
import "./HomePage.css";

export default function HomePage() {
  const root = useRef(null);
  const [paused, setPaused] = useState(false);

  useHeroLayout(root, paused);
  const { onPosterReady, videoStarted } = useHeroEntrance(root, paused);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPaused(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useHomepageMotion(root);
  return (
    <LabVideoProvider paused={paused || !videoStarted}>
      <div ref={root} className={`neue-home ${paused ? "neue-motion-paused" : ""}`}>
        <HomeHero
          paused={paused}
          onTogglePause={() => setPaused((value) => !value)}
          onPosterReady={onPosterReady}
        />
        <PrincipalInvestigator paused={paused} />
        <Ecosystem />
        <VideoReel />
        <FeaturedPublications />
        <LatestNews />
        <HomeEvents />
        <NextSteps paused={paused} />
      </div>
    </LabVideoProvider>
  );
}
