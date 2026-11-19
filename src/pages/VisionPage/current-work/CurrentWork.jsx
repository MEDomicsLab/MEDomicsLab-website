import vision from "../../../data/vision.json";
import CoreQuestion from "../shared/CoreQuestion.jsx";
import useReveal from "../shared/useReveal.js";
import "./CurrentWork.css";

export default function CurrentWork() {
  const gaps = useReveal();

  return (
    <section id="current-work" className="vision-section vision-work">
      <div ref={gaps} className="vision-row vision-gaps" data-reveal="">
        <div>
          <h3 className="vision-subtitle">{vision.gapsTitle}</h3>
        </div>
        <p className="vision-argument">{vision.gaps}</p>
      </div>
      <h2 className="vision-work-title">Current work</h2>
      <CoreQuestion className="vision-goal">{vision.work}</CoreQuestion>
    </section>
  );
}
