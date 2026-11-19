import home from "../../../data/home.json";
import vision from "../../../data/vision.json";
import useReveal from "../shared/useReveal.js";
import EcosystemRing from "./EcosystemRing.jsx";

const platformApps = vision.ecosystem.apps.map(({ name, alt, caption = name }) => {
  const { website, repo, statsSnapshot } = home.sections.ecosystem.apps.find(
    (entry) => entry.name === name
  );
  return {
    name,
    alt,
    caption,
    website,
    repo,
    statsSnapshot,
    card: `/images/homepage-neue/ecosystem/${name.toLowerCase()}.webp`,
  };
});

export default function PlatformGallery() {
  const platform = useReveal();
  return (
    <EcosystemRing apps={platformApps} label="The MEDomics platform and its sub-applications">
      <header ref={platform} id="medomics-platform" className="vision-platform-lead" data-reveal="">
        <h2 className="vision-subtitle">{vision.ecosystem.title}</h2>
        {vision.ecosystem.lead.map((sentence) => (
          <p key={sentence} className="vision-lede">
            {sentence}
          </p>
        ))}
      </header>
    </EcosystemRing>
  );
}
