import { ArrowDown } from "lucide-react";
import LabVideo from "./LabVideo.jsx";

export default function VideoReel() {
  return (
    <section className="neue-reel" aria-label="Discover our publications, news and events">
      <div className="neue-reel-stage">
        <LabVideo />
        <div className="neue-video-shade" />
        <div className="neue-reel-copy">
          <p>Scroll to learn more about our</p>
          <div className="neue-reel-words" aria-hidden="true">
            {["Publications", "News", "Events"].map((word, index) => (
              <div className={`neue-reel-word neue-reel-word-${index}`} key={word}>
                {word}
              </div>
            ))}
          </div>
          <p className="neue-reel-reduced">Publications · News · Events</p>
        </div>
        <ArrowDown className="neue-reel-arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
