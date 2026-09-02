import DomeGallery from "../DomeGallery/DomeGallery";
import { albumImages } from "../../data/albums";

export default function EventGallery({ album }) {
  const images = albumImages[album] ?? [];

  return (
    <div className="event-gallery">
      <DomeGallery
        images={images}
        fit={0.8}
        minRadius={600}
        maxVerticalRotationDeg={0}
        segments={34}
        dragDampening={2}
      />
    </div>
  );
}
