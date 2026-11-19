import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import PageLink from "../../../components/PageLink/PageLink.jsx";
import { imageSrcSet } from "../../../lib/images";
import useMediaQuery from "../../../lib/useMediaQuery";
import useRepoStats from "../../../lib/useRepoStats";
import "./EcosystemRing.css";

const clamp = (n, low, high) => Math.max(low, Math.min(high, n));

// Repeat the posters to fill all twelve positions.
function ringSlots(count) {
  const spare = Math.max(0, 12 - count);
  const lead = Math.ceil(spare / 2);
  return Array.from({ length: count + spare }, (_, position) => {
    const ring = position - lead;
    return { ring, index: ((ring % count) + count) % count };
  });
}

function useRing({ apps, enabled, onSelect }) {
  const track = useRef(null);
  const stage = useRef(null);
  const viewport = useRef(null);
  const safeArea = useRef(null);
  const select = useRef(onSelect);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  select.current = onSelect;

  useEffect(() => {
    if (!enabled || failed) return undefined;
    let disposed = false;
    let cleanup;
    const mount = ({ mountRing }) => {
      if (disposed) return;
      try {
        const api = mountRing({
          section: track.current,
          stage: stage.current,
          viewport: viewport.current,
          safeArea: safeArea.current,
          slots: ringSlots(apps.length).map(({ ring, index }) => ({
            ring,
            source: apps[index].card,
            website: apps[index].website,
          })),
          count: apps.length,
          onSelect: (index) => select.current(index),
        });
        cleanup = api.dispose;
        setReady(true);
      } catch {
        // Without WebGL the cards fall back to the static grid.
        setFailed(true);
      }
    };
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        import("./ecosystemRingScene.js").then(mount).catch(() => setFailed(true));
      },
      { rootMargin: "150% 0px" }
    );
    approach.observe(track.current);
    return () => {
      disposed = true;
      approach.disconnect();
      cleanup?.();
      setReady(false);
    };
  }, [apps, enabled, failed]);

  return { track, stage, viewport, safeArea, ready, orbit: enabled && !failed };
}

function AppCaption({ app, stars, orbit = false, showLinks = true }) {
  return (
    <p className={orbit ? "vision-ring-details" : "vision-ring-caption"}>
      <span className="vision-ring-name" aria-hidden={orbit || undefined}>
        {app.caption}
      </span>
      {showLinks && (
        <span className="vision-ring-links">
          {app.website && (
            <PageLink
              href={app.website}
              arrowSize="xs"
              target="_blank"
              rel="noreferrer"
              aria-label={`${app.name} website`}
            >
              {app.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
            </PageLink>
          )}
          {stars != null && (
            <span className="vision-ring-stars">
              <Star size={14} aria-hidden="true" />
              {stars}
              <span className="sr-only"> GitHub stars</span>
            </span>
          )}
        </span>
      )}
    </p>
  );
}

function Poster({ app, linked }) {
  const image = (
    <img
      src={app.card}
      srcSet={`${imageSrcSet(app.card, [360, 720], "webp")}, ${app.card} 1080w`}
      sizes="(min-width: 1100px) 24vw, (min-width: 700px) 44vw, 82vw"
      alt={app.alt}
      width="1080"
      height="1350"
      loading="lazy"
      decoding="async"
      draggable="false"
    />
  );
  return linked && app.website ? (
    <a
      className="vision-ring-poster-link"
      href={app.website}
      target="_blank"
      rel="noreferrer"
      aria-label={`Open ${app.name} website from poster`}
    >
      {image}
    </a>
  ) : (
    image
  );
}

export default function EcosystemRing({ apps, label, children }) {
  const motion = useMediaQuery("(prefers-reduced-motion: no-preference)");
  const [active, setActive] = useState(0);
  const stats = useRepoStats(
    apps.map((app) => app.repo),
    Object.fromEntries(apps.map((app) => [app.repo, app.statsSnapshot]))
  );
  const { track, stage, viewport, safeArea, ready, orbit } = useRing({
    apps,
    enabled: Boolean(motion),
    onSelect: setActive,
  });
  const current = apps[clamp(active, 0, apps.length - 1)];

  return (
    <section
      className="vision-ring"
      aria-label={label}
      data-gallery={orbit ? "orbit" : "static"}
      data-ready={ready ? "" : undefined}
      style={{ "--steps": apps.length - 1 }}
    >
      {children}
      <div ref={track} className="vision-ring-track">
        <div ref={stage} className="vision-ring-stage">
          <div ref={viewport} className="vision-ring-viewport" />
          <div ref={safeArea} className="vision-ring-safe" aria-hidden="true" />
          <ul className="vision-ring-cards">
            {apps.map((app, index) => (
              <li
                key={app.name}
                className="vision-ring-card"
                data-current={index === active ? "" : undefined}
              >
                <Poster app={app} linked={!orbit || (index === active && !ready)} />
                <AppCaption app={app} stars={stats[app.repo]?.stars} showLinks={!orbit} />
              </li>
            ))}
          </ul>
          {orbit && <AppCaption app={current} stars={stats[current.repo]?.stars} orbit />}
        </div>
      </div>
    </section>
  );
}
