import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { GithubIcon } from "../Icons/Icons.jsx";
import { cn } from "../../lib/utils";
import homeData from "../../data/home.json";
import AnimatedShortcut from "./AnimatedShortcut.jsx";
import useShortcutPositions from "./useShortcutPositions.js";

export default function SiteShortcuts({ href, liquid }) {
  const [idle, setIdle] = useState(false);
  const idleTimer = useRef(null);
  const location = useLocation();
  const { root, docked } = useShortcutPositions(location.pathname === "/");
  const wake = useCallback(() => {
    clearTimeout(idleTimer.current);
    setIdle(false);
    if (docked) idleTimer.current = setTimeout(() => setIdle(true), 5000);
  }, [docked]);

  useEffect(() => {
    wake();
    window.addEventListener("scroll", wake, { passive: true });
    return () => {
      clearTimeout(idleTimer.current);
      window.removeEventListener("scroll", wake);
    };
  }, [location.key, wake]);
  const medomics = homeData.sections.ecosystem.apps.find((app) => app.name === "MEDomics");

  return (
    <div ref={root} className="site-shortcuts">
      <AnimatedShortcut
        label="GitHub"
        labelSuffix=" Organization"
        accessibleName={docked ? "GitHub" : "GitHub Organization"}
        icon={<GithubIcon className="nav-action-icon" />}
        href={href}
        liquid={liquid}
        className={cn(docked && idle && "is-idle", !docked && "is-in-hero")}
        surfaceClassName="liquid-github-anchor"
        style={{
          top: "var(--shortcut-github-y, 40px)",
          left: "var(--shortcut-github-x, calc(100% - 80px))",
        }}
        onActivity={wake}
      />
      <AnimatedShortcut
        label="MEDomics Ecosystem"
        icon={<img className="nav-action-icon nav-action-logo" src={medomics.logo} alt="" />}
        to="/#ecosystem"
        liquid={liquid}
        className={cn(docked && idle && "is-idle", !docked && "is-in-hero")}
        surfaceClassName="liquid-ecosystem-anchor"
        style={{
          top: "var(--shortcut-ecosystem-y, 92px)",
          left: "var(--shortcut-ecosystem-x, calc(100% - 120px))",
        }}
        onActivity={wake}
      />
    </div>
  );
}
