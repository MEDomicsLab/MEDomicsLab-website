import { useState } from "react";
import { Plus } from "lucide-react";
import vision from "../../../data/vision.json";
import useReveal from "../shared/useReveal.js";
import VisionFigure from "../shared/VisionFigure.jsx";
import ScopeFigure from "./ScopeFigure.jsx";
import "./RecentProgress.css";

const citationGroup = /(\[(?:JA|CP)\d+(?:, (?:JA|CP)\d+)*\])/g;

function CitedParagraph({ children }) {
  return (
    <p>
      {children.split(citationGroup).map((part, i) => {
        if (i % 2 === 0) return part;
        const codes = part.slice(1, -1).split(", ");
        return (
          <span className="vision-cites" key={i}>
            [
            {codes.map((code, index) => {
              const publication = vision.publications[code];
              return (
                <span key={code}>
                  {index > 0 && ", "}
                  {publication ? (
                    <a href={`#paper-${code}`} aria-label={`${code}: ${publication.title}`}>
                      {code}
                    </a>
                  ) : (
                    code
                  )}
                </span>
              );
            })}
            ]
          </span>
        );
      })}
    </p>
  );
}

function ScopeMap({ axis }) {
  return (
    <VisionFigure
      label="Scope of the current research program"
      className="vision-scope-figure"
      {...vision.figures.scope}
    >
      <ScopeFigure highlight={axis} />
    </VisionFigure>
  );
}

export default function RecentProgress() {
  const [axis, setAxis] = useState("");
  const intro = useReveal();
  const axes = useReveal();
  return (
    <section id="progress" className="vision-section">
      <div className="vision-row vision-section-head">
        <h2>Recent progress</h2>
        <div ref={intro} className="vision-opening">
          <p className="vision-lede" data-reveal="">
            {vision.integration.replace(/\.$/, "")} (
            <a href="#selected-publications">see list of selected publications below</a>).
          </p>
        </div>
      </div>
      <ScopeMap axis={axis} />
      <section ref={axes} className="vision-row vision-axes" aria-labelledby="vision-axes-title">
        <h3 id="vision-axes-title" className="vision-subtitle" data-reveal="">
          {vision.axesTitle}
        </h3>
        <div className="vision-axis-list">
          {vision.axes.map((item, i) => (
            <details
              key={item.id}
              className="vision-axis"
              open={i === 0}
              onPointerEnter={() => setAxis(item.id)}
              onPointerLeave={() => setAxis("")}
              onFocus={() => setAxis(item.id)}
              onBlur={() => setAxis("")}
            >
              <summary>
                <span className="vision-kicker">Axis {item.id}</span>
                <h4>{item.title}</h4>
                <Plus size={22} aria-hidden="true" />
              </summary>
              <div className="vision-axis-clip">
                <div className="vision-axis-body">
                  {item.paragraphs.map((paragraph, index) => (
                    <CitedParagraph key={paragraph}>
                      {item.id === "III" && index === 0
                        ? `${vision.progressMilestone} ${paragraph}`
                        : paragraph}
                    </CitedParagraph>
                  ))}
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>
    </section>
  );
}
