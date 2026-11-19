import BannerSlot from "../banners/BannerSlot.jsx";
import vision from "../../../data/vision.json";
import "./VisionHero.css";

export default function VisionHero() {
  return (
    <header className="vision-cover">
      <BannerSlot slot="horizon" className="vision-horizon">
        <div className="hl-copy vision-cover-copy">
          <h1>Vision</h1>
          <p>
            {vision.headline.split(/(\S+-\S+)/g).map((part, index) =>
              index % 2 ? (
                <span key={index} className="whitespace-nowrap">
                  {part}
                </span>
              ) : (
                part
              )
            )}
          </p>
        </div>
      </BannerSlot>
    </header>
  );
}
