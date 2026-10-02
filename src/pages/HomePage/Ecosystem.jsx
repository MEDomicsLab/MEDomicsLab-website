import { useState } from "react";
import { GitFork, Star } from "lucide-react";
import useRepoStats from "../../lib/useRepoStats";
import { ecosystemApps } from "./homepageContent";

export default function Ecosystem() {
  const [active, setActive] = useState(null);
  const stats = useRepoStats(
    ecosystemApps.map((app) => app.repo),
    Object.fromEntries(ecosystemApps.map((app) => [app.repo, app.statsSnapshot]))
  );
  const current = active ? stats[active.repo] : null;
  return (
    <section id="ecosystem" className="neue-ecosystem" aria-labelledby="ecosystem-heading">
      <div className="neue-ecosystem-stage">
        <div className={`neue-ecosystem-centre ${active ? "is-active" : ""}`}>
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
          <div className="neue-ecosystem-stats" aria-live="polite" aria-atomic="true">
            {active && (
              <>
                <img
                  className="neue-stat-logo"
                  src={active.logo}
                  alt={`${active.name} logo`}
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
        </div>
        <div className="neue-ecosystem-orbit">
          {ecosystemApps.map((app, index) => (
            <a
              key={app.name}
              className={`neue-ecosystem-app neue-ecosystem-app-${index} group`}
              style={{ "--orbit-angle": `${index * 72}deg` }}
              href={app.website || app.repo}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setActive(app)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(app)}
              onBlur={() => setActive(null)}
              aria-label={`${app.name}, ${app.website ? "website" : "GitHub repository"}`}
            >
              <img
                src={app.card}
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
      </div>
    </section>
  );
}
