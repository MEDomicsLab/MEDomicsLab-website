import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { GitFork, Star } from "lucide-react";
import { GlassFrame } from "../../components/GlassSurface/GlassSurface.jsx";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams";
import useRepoStats from "../../lib/useRepoStats";
import { ecosystemApps } from "./homepageContent";

const LEAVE_DELAY_MS = 220;
const SPOTLIGHT_QUERY = "(hover: hover) and (min-width: 768px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const shortestTurn = (degrees) => ((((degrees + 180) % 360) + 360) % 360) - 180;

function slotPose({ stage, orbit, slot, card }, index) {
  const stageBox = stage.getBoundingClientRect();
  const slotBox = slot.getBoundingClientRect();
  const [a, b] = new DOMMatrixReadOnly(getComputedStyle(orbit).transform).toFloat64Array();
  return {
    x: slotBox.left + slotBox.width / 2 - stageBox.left,
    y: slotBox.top + slotBox.height / 2 - stageBox.top,
    rotation: shortestTurn((Math.atan2(b, a) * 180) / Math.PI + index * 72),
    scale: slot.offsetWidth / card.offsetWidth,
  };
}

const focusPose = (stage, side) => ({
  x: stage.offsetWidth * (side === "left" ? 0.2 : 0.8),
  y: stage.offsetHeight / 2,
  rotation: 0,
  scale: 1,
});

export default function Ecosystem() {
  const [spotlight, setSpotlight] = useState({ index: null, open: false, side: "left" });
  const stage = useRef(null);
  const orbit = useRef(null);
  const slots = useRef([]);
  const card = useRef(null);
  const shown = useRef(null);
  const leaveTimer = useRef(null);
  const stats = useRepoStats(
    ecosystemApps.map((app) => app.repo),
    Object.fromEntries(ecosystemApps.map((app) => [app.repo, app.statsSnapshot]))
  );
  const app = spotlight.index === null ? null : ecosystemApps[spotlight.index];
  const current = app ? stats[app.repo] : null;

  useLayoutEffect(() => {
    const { index, open, side } = spotlight;
    if (index === null) return undefined;
    const duration = matchMedia(REDUCED_MOTION_QUERY).matches ? 0 : 0.95;
    const ease = "expo.out";
    const parts = {
      stage: stage.current,
      orbit: orbit.current,
      slot: slots.current[index],
      card: card.current,
    };
    let tween;
    if (open && shown.current !== index) {
      shown.current = index;
      tween = gsap.fromTo(
        card.current,
        { xPercent: -50, yPercent: -50, ...slotPose(parts, index) },
        { ...focusPose(parts.stage, side), duration, ease }
      );
    } else if (open) {
      tween = gsap.to(card.current, { ...focusPose(parts.stage, side), duration, ease });
    } else {
      tween = gsap.to(card.current, {
        ...slotPose(parts, index),
        duration: duration * 0.85,
        ease: "power3.inOut",
        onComplete: () => {
          shown.current = null;
          setSpotlight((state) => (state.open ? state : { ...state, index: null }));
        },
      });
    }
    return () => tween.kill();
  }, [spotlight]);

  useEffect(() => () => clearTimeout(leaveTimer.current), []);

  const stay = () => clearTimeout(leaveTimer.current);
  const leave = (delay = LEAVE_DELAY_MS) => {
    clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(
      () => setSpotlight((state) => (state.open ? { ...state, open: false } : state)),
      delay
    );
  };
  const enter = (index) => {
    stay();
    if (!matchMedia(SPOTLIGHT_QUERY).matches) return;
    if (spotlight.open && spotlight.index === index) return;
    if (spotlight.index !== null && spotlight.index !== index) shown.current = null;
    const stageBox = stage.current.getBoundingClientRect();
    const slotBox = slots.current[index].getBoundingClientRect();
    const side =
      slotBox.left + slotBox.width / 2 < stageBox.left + stageBox.width / 2 ? "left" : "right";
    setSpotlight({ index, open: true, side });
  };

  const sectionState = [
    spotlight.index !== null && "is-spotlit",
    spotlight.open && "is-open",
    `is-${spotlight.side}`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="ecosystem"
      className={`neue-ecosystem ${sectionState}`}
      aria-labelledby="ecosystem-heading"
    >
      <div ref={stage} className="neue-ecosystem-stage">
        <div className="neue-ecosystem-centre">
          <h2 id="ecosystem-heading" className="neue-ecosystem-title">
            <span>
              <span className="ecosystem-line">The</span>
            </span>
            <span>
              <span className="ecosystem-line">MEDomics</span>
            </span>
            <span>
              <span className="ecosystem-line ecosystem-line-last">Ecosystem.</span>
            </span>
          </h2>
        </div>
        <div ref={orbit} className="neue-ecosystem-orbit">
          {ecosystemApps.map((item, index) => (
            <a
              key={item.name}
              ref={(node) => {
                slots.current[index] = node;
              }}
              className={`neue-ecosystem-app neue-ecosystem-app-${index} ${
                spotlight.index === index ? "is-lifted" : ""
              }`}
              style={{ "--orbit-angle": `${index * 72}deg` }}
              href={item.website || item.repo}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => enter(index)}
              onMouseLeave={() => leave()}
              onFocus={() => enter(index)}
              onBlur={() => leave(0)}
              aria-label={`${item.name}, ${item.website ? "website" : "GitHub repository"}`}
            >
              <img
                src={item.card}
                alt=""
                width="1080"
                height="1350"
                loading="lazy"
                decoding="async"
                draggable="false"
              />
            </a>
          ))}
        </div>
        <div className="neue-ecosystem-spotlight">
          <a
            ref={card}
            className="neue-ecosystem-feature"
            href={app ? app.website || app.repo : undefined}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            onMouseEnter={stay}
            onMouseLeave={() => leave()}
          >
            {app && <img src={app.card} alt="" width="1080" height="1350" draggable="false" />}
          </a>
          <div className="neue-ecosystem-stain" onMouseEnter={stay} onMouseLeave={() => leave()}>
            <GlassFrame
              {...LIQUID_PARAMS.nav}
              padding="0"
              style={{ position: "absolute", top: "50%", left: "50%" }}
            >
              <div className="neue-ecosystem-stain-body" aria-live="polite" aria-atomic="true">
                {app && (
                  <>
                    <img
                      className="neue-stat-logo"
                      src={app.logo}
                      alt={`${app.name} logo`}
                      width="128"
                      height="128"
                    />
                    <div className="neue-stat-counts">
                      <div>
                        <span>{current?.stars ?? "…"}</span>
                        <small>
                          <Star size={16} /> Stars
                        </small>
                      </div>
                      <div>
                        <span>{current?.forks ?? "…"}</span>
                        <small>
                          <GitFork size={16} /> Forks
                        </small>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </GlassFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
