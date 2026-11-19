import { Link } from "react-router-dom";
import home from "../../../data/home.json";
import vision from "../../../data/vision.json";
import CoreQuestion from "../shared/CoreQuestion.jsx";
import useReveal from "../shared/useReveal.js";
import VisionFigure from "../shared/VisionFigure.jsx";
import CycleFigure from "./CycleFigure.jsx";
import Premises from "./Premises.jsx";
import "./ResearchContext.css";

const medomics = home.sections.ecosystem.apps.find(({ name }) => name === "MEDomics");

function Overview() {
  const opening = useReveal();
  const [lede, ...argument] = vision.overview;
  return (
    <div className="vision-row vision-section-head">
      <h2>Research context</h2>
      <div ref={opening} className="vision-opening">
        <p className="vision-lede" data-reveal="">
          {lede}
        </p>
        {argument.map((paragraph, i) => (
          <p key={paragraph} className="vision-argument" style={{ "--i": i + 1 }} data-reveal="">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function Cycle() {
  return (
    <VisionFigure
      label="The MEDomics platform"
      className="vision-cycle-figure"
      {...vision.figures.cycle}
    >
      <CycleFigure />
    </VisionFigure>
  );
}

function LongTerm() {
  const longTerm = useReveal();

  return (
    <section
      ref={longTerm}
      id="long-term-vision"
      className="vision-longterm"
      aria-labelledby="long-term-title"
    >
      <div className="vision-row" data-reveal="">
        <h3 id="long-term-title" className="vision-chapter-title">
          Long-term vision
        </h3>
        <p className="vision-lede">{vision.longTermVision}</p>
      </div>
      <CoreQuestion lead={vision.researchQuestionLead}>{vision.researchQuestion}</CoreQuestion>
      <div className="vision-approach">
        <p className="vision-approach-text" data-reveal="">
          {vision.approach.lead} <Link to="/research/medomics-platform">MEDomics</Link> (
          <a href={medomics.website}>medomics.app</a>), {vision.approach.description}
        </p>
        <Cycle />
      </div>
    </section>
  );
}

export default function ResearchContext() {
  return (
    <section id="program" className="vision-section">
      <Overview />
      <Premises {...vision.premises} />
      <LongTerm />
    </section>
  );
}
