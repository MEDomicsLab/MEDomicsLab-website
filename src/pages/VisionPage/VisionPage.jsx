import "./VisionPage.css";
import BannerSlot from "./banners/BannerSlot.jsx";
import VisionHero from "./hero/VisionHero.jsx";
import ResearchOverview from "./research-overview/ResearchOverview.jsx";
import ResearchContext from "./research-context/ResearchContext.jsx";
import RecentProgress from "./recent-progress/RecentProgress.jsx";
import CurrentWork from "./current-work/CurrentWork.jsx";
import PlatformGallery from "./platform/PlatformGallery.jsx";
import SelectedPublications from "./publications/SelectedPublications.jsx";
import useEntrance from "./shared/useEntrance.js";

export default function VisionPage() {
  const entrance = useEntrance();
  return (
    <article className="vision-page" data-entrance={entrance}>
      <VisionHero />
      <ResearchOverview />
      <ResearchContext />
      <BannerSlot slot="progress" className="vision-divider" />
      <RecentProgress />
      <BannerSlot slot="work" className="vision-divider" />
      <CurrentWork />
      <PlatformGallery />
      <BannerSlot slot="publications" className="vision-divider" />
      <SelectedPublications />
    </article>
  );
}
