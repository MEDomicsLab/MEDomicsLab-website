import { createContext, useContext, useId } from "react";
import { Bot } from "lucide-react";
import useDotField from "../shared/useDotField.js";
import "./ProgramFigure.css";

// Solid lines mark the current program, dashed lines the long-term vision.
const LOGO = "/images/homepage-neue/MEDomics-white-160.webp";
const GRID = 7.5;
const INSET = 4.5;
const Dots = createContext("");

const FIELD = {
  art: (stage) => stage.querySelector(".pf-art"),
  shapes: (svg) =>
    [...svg.querySelectorAll("rect.pf-box")].map((rect) => ({
      rect: [rect.x, rect.y, rect.width, rect.height, rect.rx].map(
        (length) => length.baseVal.value
      ),
      bit: rect.classList.contains("pf-key") ? 4 : rect.classList.contains("pf-later") ? 2 : 1,
    })),
  words: (svg) => svg.querySelectorAll("text, image, svg"),
  base: GRID,
  inset: INSET,
  reach: 70,
  weigh: () => [0.2, 0.11, 0.26],
};

function Markers({ id }) {
  return (
    <defs>
      <pattern
        id={`${id}-dots`}
        className="pf-dot-grid"
        width={GRID}
        height={GRID}
        patternUnits="userSpaceOnUse"
      >
        <circle cx={GRID / 2} cy={GRID / 2} r="0.78" />
      </pattern>
      {["now", "later"].map((tone) => (
        <marker
          key={tone}
          id={`${id}-${tone}`}
          className={`pf-tip pf-${tone}`}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          markerUnits="userSpaceOnUse"
          orient="auto-start-reverse"
        >
          <path d="M2 1.5 8.5 5 2 8.5" />
        </marker>
      ))}
    </defs>
  );
}

function Wire({ id, tone, d, from = false, to = true }) {
  return (
    <path
      className={`pf-wire pf-${tone}`}
      d={d}
      markerStart={from ? `url(#${id}-${tone})` : undefined}
      markerEnd={to ? `url(#${id}-${tone})` : undefined}
    />
  );
}

function Qualified({ name }) {
  const [qualifier, ...rest] = name.split(" ");
  return (
    <>
      <tspan className="pf-em">{qualifier}</tspan> {rest.join(" ")}
    </>
  );
}

function Box({ tone, x, y, width, height, rx = 12, keyNode = false }) {
  const dots = useContext(Dots);
  const kind = `pf-${tone}${keyNode ? " pf-key" : ""}`;
  return (
    <>
      <rect
        className={`pf-dots dot-static ${kind}`}
        x={x + INSET}
        y={y + INSET}
        width={width - 2 * INSET}
        height={height - 2 * INSET}
        rx={Math.max(0, rx - INSET)}
        fill={`url(#${dots})`}
      />
      <rect className={`pf-box ${kind}`} x={x} y={y} width={width} height={height} rx={rx} />
    </>
  );
}

function Model({ domain, tone, x, y, width, sizes }) {
  const [domains, approach] = domain.details;
  const cx = x + width / 2;
  return (
    <g className={`pf-${tone}`}>
      <Box tone={tone} x={x} y={y} width={width} height={sizes.height} />
      <text className="pf-title pf-model" x={cx} y={y + sizes.lines[0]}>
        {domain.model}
      </text>
      <text className="pf-sub pf-domain" x={cx} y={y + sizes.lines[1]}>
        {domains}
      </text>
      <text className="pf-line" x={cx} y={y + sizes.lines[2]}>
        {approach}
      </text>
    </g>
  );
}

function Agents({ x, y, width, height }) {
  const icon = 36;
  const logo = 60;
  const textX = x + 137;
  return (
    <g className="pf-now pf-agents">
      <Box tone="now" x={x} y={y} width={width} height={height} rx={16} keyNode />
      <Bot
        className="pf-icon"
        x={x + 20}
        y={y + (height - icon) / 2}
        width={icon}
        height={icon}
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <text className="pf-title" x={textX} y={y + height / 2 - 4}>
        <tspan className="pf-em">Specialized</tspan>
      </text>
      <text className="pf-title" x={textX} y={y + height / 2 + 22}>
        AI Agents
      </text>
      <image
        href={LOGO}
        x={x + width - logo - 22}
        y={y + (height - logo * 0.966) / 2}
        width={logo}
        height={logo * 0.966}
      />
    </g>
  );
}

function Legend() {
  const starts = [40, 232];
  const length = 26;
  return (
    <g className="pf-legend">
      {[
        ["now", "Current program"],
        ["later", "Long-term vision"],
      ].map(([tone, label], index) => {
        const x = starts[index];
        return (
          <g key={tone}>
            <path className={`pf-sample pf-${tone}`} d={`M${x} -22h${length}`} />
            <text className="pf-start" x={x + length + 10} y={-17}>
              {label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function Diagram({ id, domains }) {
  const [generalist, specialist, precision] = domains;
  const model = { height: 92, lines: [29, 53, 76] };
  return (
    <svg className="pf-art" viewBox="0 -44 1000 590" aria-hidden="true" focusable="false">
      <Markers id={id} />
      <Legend />
      <Dots.Provider value={`${id}-dots`}>
        <g className="pf-later">
          <Box tone="later" x={40} y={1} width={920} height={76} rx={14} />
          <text className="pf-title pf-head" x="500" y="33">
            Long-term research vision
          </text>
          <text className="pf-sub" x="500" y="58">
            Precision Medicine through AI-informed Clinical Decision Support
          </text>
        </g>

        <Wire id={id} tone="later" d="M150 77V170" />
        <Wire id={id} tone="later" d="M850 77V170" />
        <Wire id={id} tone="now" d="M500 77V102" />
        <g className="pf-now">
          <rect className="pf-tag" x="420" y="108" width="160" height="30" rx="15" />
          <text className="pf-tag-label" x="500" y="128">
            Current program
          </text>
        </g>
        <Wire id={id} tone="now" d="M500 138V170" />

        <g className="pf-later">
          <Box tone="later" x={40} y={176} width={220} height={72} />
          <text className="pf-title pf-family" x="150" y="220">
            <Qualified name={generalist.name} />
          </text>
        </g>
        <g className="pf-now">
          <Box tone="now" x={390} y={176} width={220} height={72} keyNode />
          <text className="pf-title pf-family" x="500" y="220">
            <Qualified name={specialist.name} />
          </text>
        </g>
        <g className="pf-later">
          <Box tone="later" x={740} y={176} width={220} height={72} />
          <text className="pf-title pf-family" x="850" y="220">
            <Qualified name={precision.name} />
          </text>
        </g>

        <Wire id={id} tone="now" d="M268 212H382" from />
        <text className="pf-label pf-now" x="325" y="201">
          Agentic AI
        </text>
        <Wire id={id} tone="later" d="M618 212H732" from />
        <text className="pf-label pf-later" x="675" y="201">
          Agentic AI
        </text>

        <Wire id={id} tone="later" d="M150 248V282" />
        <Wire id={id} tone="now" d="M500 248V282" />
        <Wire id={id} tone="later" d="M850 248V282" />
        <Model domain={generalist} tone="later" x={20} y={288} width={260} sizes={model} />
        <Model domain={specialist} tone="now" x={370} y={288} width={260} sizes={model} />
        <Model domain={precision} tone="later" x={720} y={288} width={260} sizes={model} />

        <Wire id={id} tone="now" d="M500 380V418" />
        <Agents x={350} y={424} width={300} height={92} />

        <g className="pf-now">
          <Box tone="now" x={40} y={432} width={240} height={76} />
          <text className="pf-title pf-small" x="160" y="465">
            <tspan className="pf-em">Reusable</tspan> AI Agents
          </text>
          <text className="pf-line" x="160" y="488">
            for External Agentic AI
          </text>
        </g>
        <Wire id={id} tone="now" d="M350 470H280" to={false} />
        <Wire id={id} tone="now" d="M325 470V219" />

        <g className="pf-now">
          <Box tone="now" x={720} y={432} width={240} height={76} />
          <text className="pf-title pf-small" x="840" y="465">
            <tspan className="pf-em">Local</tspan> &amp;{" "}
            <tspan className="pf-em">Lightweight</tspan>
          </text>
          <text className="pf-line" x="840" y="488">
            Agentic AI Assistant
          </text>
        </g>
        <Wire id={id} tone="now" d="M720 470H656" />
      </Dots.Provider>
    </svg>
  );
}

export default function ProgramFigure({ domains }) {
  const id = useId().replace(/:/g, "");
  const stage = useDotField(FIELD);
  return (
    <div className="pf">
      <div ref={stage} className="dot-stage pf-stage">
        <canvas className="dot-canvas" aria-hidden="true" />
        <Diagram id={id} domains={domains} />
      </div>
      <div className="sr-only">
        <p>Solid lines mark the current program. Dashed lines mark the long-term vision.</p>
        <p>
          The long-term research vision is Precision Medicine through AI-informed Clinical Decision
          Support. It spans Generalist AI (foundation models for multiple medical domains and
          generative AI), Specialist AI (integrative models for specialized medical domains and
          predictive modeling) and Precision AI (causal models for personalized care and continual
          causal learning), with Agentic AI between Generalist and Specialist AI, and between
          Specialist and Precision AI.
        </p>
        <p>
          The current program covers Specialist AI. Its integrative models lead to Specialized AI
          Agents in the MEDomics platform, which serve as Reusable AI Agents for External Agentic
          AI, linked to the Agentic AI between Generalist and Specialist AI, and which a Local and
          Lightweight Agentic AI Assistant works with.
        </p>
      </div>
    </div>
  );
}
