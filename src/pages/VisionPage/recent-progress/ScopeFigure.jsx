import { Fragment, useId, useRef, useState } from "react";
import HoverArrow from "../../../components/HoverArrow/HoverArrow.jsx";
import home from "../../../data/home.json";
import vision from "../../../data/vision.json";
import useDotField from "../shared/useDotField.js";
import "./ScopeFigure.css";

// The translucent circles share a dot grid.
const RADIUS = 245;
const GRID = 6.5;
const AXES = [
  {
    id: "I",
    cx: 500,
    cy: 290,
    label: "I · Medical data modeling & deployment",
    arc: "M269.6 157A266 266 0 0 1 730.4 157",
  },
  {
    id: "II",
    cx: 360,
    cy: 532,
    label: "II · Medical image analysis",
    arc: "M106.9 599.8A262 262 0 0 0 337.2 793",
  },
  {
    id: "III",
    cx: 640,
    cy: 532,
    label: "III · Software engineering",
    arc: "M662.8 793A262 262 0 0 0 893.1 599.8",
  },
];

const TOPICS = [
  { axes: "I", name: ["Multimodal modeling"], cites: ["JA1", "CP1", "CP2"], x: 500, y: 150 },
  { axes: "I", name: ["Longitudinal modeling"], cites: ["JA2", "CP3"], x: 500, y: 190 },
  { axes: "I", name: ["Model evaluation"], cites: ["JA3", "CP4"], x: 500, y: 230 },
  {
    axes: "I II",
    name: ["Deep learning"],
    cites: ["JA4", "JA5", "CP5"],
    x: 360,
    y: 384,
    stack: true,
  },
  { axes: "II", name: ["Radiomics"], cites: ["JA6", "JA7"], x: 236, y: 590, stack: true },
  {
    axes: "III",
    name: ["Synergy with", "clinical researchers"],
    cites: ["JA8"],
    x: 764,
    y: 576,
    stack: true,
  },
];

const platformApps = home.sections.ecosystem.apps;
const medomics = platformApps.find(({ name }) => name === "MEDomics");
const APPS = [
  { name: "MED3pa", axes: "I III", x: 640, y: 366 },
  { name: "MEDfl", axes: "I III", x: 640, y: 456 },
  { name: "MEDiml", axes: "II III", x: 500, y: 678 },
].map((placement) => {
  const { website, repo, logo } = platformApps.find(({ name }) => name === placement.name);
  return { ...placement, logo, href: website ?? repo };
});

function Cites({ codes }) {
  return codes.map((code, i) => (
    <Fragment key={code}>
      {i > 0 && " · "}
      <a href={`#paper-${code}`} aria-label={`${code}: ${vision.publications[code].title}`}>
        {code}
      </a>
    </Fragment>
  ));
}

function AppLabel({ name, x, y }) {
  return (
    <foreignObject className="scope-app-label" x={x - 52} y={y - 18} width={104} height={24}>
      <span className="scope-app-link">
        {name}
        <HoverArrow size="xs" className="scope-arrow" />
      </span>
    </foreignObject>
  );
}

function Topic({ axes, name, cites, x, y, stack }) {
  return (
    <g className="scope-item scope-topic" data-axes={axes}>
      {name.map((line, i) => (
        <text key={line} x={x} y={y + i * 23}>
          {line}
          {!stack && i === name.length - 1 && (
            <tspan className="scope-cites" dx="12">
              <Cites codes={cites} />
            </tspan>
          )}
        </text>
      ))}
      {stack && (
        <text className="scope-cites" x={x} y={y + name.length * 23 + 2}>
          <Cites codes={cites} />
        </text>
      )}
    </g>
  );
}

function inside(point) {
  return AXES.filter(({ cx, cy }) => Math.hypot(point.x - cx, point.y - cy) <= RADIUS).map(
    ({ id }) => id
  );
}

// Highlighted axes brighten their dots and the others recede, as the veils and rings do.
const FIELD = {
  art: (stage) => stage.querySelector(".scope-art"),
  shapes: () => AXES.map(({ cx, cy }, i) => ({ circle: [cx, cy, RADIUS], bit: 1 << i })),
  words: (svg) => svg.querySelectorAll("text:not(.scope-arc-label), image, .scope-app-label"),
  base: GRID,
  inset: 3,
  reach: 90,
  weigh: (active) => {
    const lit = active ? active.split(" ") : [];
    return AXES.map(({ id }) => {
      if (!lit.length) return 0.19;
      return lit.includes(id) ? 0.34 : 0.07;
    });
  },
};

export default function ScopeFigure({ highlight }) {
  const id = useId().replace(/:/g, "");
  const svg = useRef(null);
  const [hovered, setHovered] = useState("");
  const active = hovered || highlight || "";
  const stage = useDotField(FIELD, active);

  const track = (event) => {
    const matrix = svg.current.getScreenCTM()?.inverse();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix);
    const next = inside(point).join(" ");
    if (next !== hovered) setHovered(next);
  };

  return (
    <div className="scope">
      <p className="scope-title">{vision.scopeTitle}</p>
      <div ref={stage} className="dot-stage scope-stage">
        <canvas className="dot-canvas" aria-hidden="true" />
        <svg
          ref={svg}
          className="scope-art"
          viewBox="80 0 840 812"
          data-active={active}
          onPointerMove={track}
          onPointerDown={track}
          onPointerLeave={() => setHovered("")}
          aria-describedby={`${id}-desc`}
        >
          <desc id={`${id}-desc`}>
            Three overlapping research axes. Axis I, medical data modeling and deployment, covers
            multimodal modeling, longitudinal modeling and model evaluation. Axis II, medical image
            analysis, covers radiomics, and shares deep learning with axis I. Axis III, software
            engineering, covers synergy with clinical researchers. MED3pa and MEDfl sit between axes
            I and III, MEDiml between axes II and III, and the MEDomics platform at the centre of
            all three.
          </desc>
          <defs>
            <pattern
              id={`${id}-dots`}
              className="scope-dots"
              width={GRID}
              height={GRID}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={GRID / 2} cy={GRID / 2} r="0.72" />
            </pattern>
            {AXES.map((axis) => (
              <path key={axis.id} id={`${id}-arc-${axis.id}`} d={axis.arc} />
            ))}
          </defs>

          {AXES.map((axis) => (
            <g key={axis.id} className="scope-axis" data-axis={axis.id}>
              <circle className="scope-fill" cx={axis.cx} cy={axis.cy} r={RADIUS} />
              <circle
                className="scope-grid dot-static"
                cx={axis.cx}
                cy={axis.cy}
                r={RADIUS - 3}
                fill={`url(#${id}-dots)`}
              />
              <circle className="scope-ring" cx={axis.cx} cy={axis.cy} r={RADIUS} />
            </g>
          ))}

          {AXES.map((axis) => (
            <text key={axis.id} className="scope-arc-label" data-axis={axis.id}>
              <textPath href={`#${id}-arc-${axis.id}`} startOffset="50%">
                {axis.label.toUpperCase()}
              </textPath>
            </text>
          ))}
          {TOPICS.map((topic) => (
            <Topic key={topic.name.join(" ")} {...topic} />
          ))}

          {APPS.map((app) => (
            <g key={app.name} className="scope-item scope-app" data-axes={app.axes}>
              <a
                className="group"
                href={app.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${app.name} website`}
              >
                <image
                  href={app.logo}
                  x={app.x - 28}
                  y={app.y - 72}
                  width="56"
                  height="56"
                  preserveAspectRatio="xMidYMid meet"
                />
                <AppLabel name={app.name} x={app.x} y={app.y} />
              </a>
            </g>
          ))}

          <g className="scope-item scope-core" data-axes="I II III">
            <a
              className="group"
              href={medomics.website ?? medomics.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="MEDomics website"
            >
              <image
                href="/images/homepage-neue/MEDomics-white-320.webp"
                x="452"
                y="406"
                width="96"
                height="92.6"
              />
              <AppLabel name={medomics.name} x={500} y={520} />
            </a>
          </g>
        </svg>
      </div>
    </div>
  );
}
