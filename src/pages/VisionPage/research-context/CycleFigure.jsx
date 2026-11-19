import { useId } from "react";
import "./CycleFigure.css";

const ARCS = [
  "M212.0 106.9A132 132 0 0 1 348.0 106.9",
  "M393.1 152.0A132 132 0 0 1 393.1 288.0",
  "M348.0 333.1A132 132 0 0 1 212.0 333.1",
  "M166.9 288.0A132 132 0 0 1 166.9 152.0",
];
const STEPS = [
  { name: "Optimize", x: 168, y: 108, anchor: "end" },
  { name: "Guide", x: 392, y: 108, anchor: "start" },
  { name: "Discover", x: 392, y: 352, anchor: "start" },
  { name: "Validate", x: 168, y: 352, anchor: "end" },
];

export default function CycleFigure() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className="cycle-art"
      viewBox="20 70 520 300"
      role="img"
      aria-label="The MEDomics research cycle runs clockwise from optimize to guide, discover and validate, then back to optimize."
    >
      <defs>
        <marker
          id={`${id}-tip`}
          className="cycle-tip"
          viewBox="0 0 12 12"
          refX="10"
          refY="6"
          markerWidth="11"
          markerHeight="11"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M2 1.5 10 6 2 10.5" />
        </marker>
      </defs>
      {ARCS.map((d) => (
        <path key={d} className="cycle-arc" d={d} markerEnd={`url(#${id}-tip)`} />
      ))}
      <image
        href="/images/homepage-neue/MEDomics-white-320.webp"
        x="222"
        y="162"
        width="116"
        height="112"
      />
      {STEPS.map((step) => (
        <text
          key={step.name}
          className="cycle-label"
          x={step.x}
          y={step.y}
          textAnchor={step.anchor}
        >
          {step.name}
        </text>
      ))}
    </svg>
  );
}
