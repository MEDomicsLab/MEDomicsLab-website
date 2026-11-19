import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./VisionSectionNav.css";

const contents = [
  ["program", "Research context", "Context"],
  ["long-term-vision", "Long-term vision", "Vision"],
  ["progress", "Recent progress", "Progress"],
  ["current-work", "Current work", "Work"],
  ["selected-publications", "Selected publications", "Papers"],
];

export default function VisionSectionNav() {
  const { search } = useLocation();
  const [active, setActive] = useState(-1);
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const page = document.querySelector(".vision-page");
    const footer = document.querySelector(".neue-footer");
    const sections = contents.map(([id]) => document.getElementById(id));
    let frame;

    function measure() {
      frame = undefined;
      const line = Math.min(window.innerHeight * 0.3, 260);
      const index = sections.findLastIndex((node) => node.getBoundingClientRect().top <= line);
      setActive(index);

      setOverFooter(footer.getBoundingClientRect().top < window.innerHeight);
    }

    function schedule() {
      if (frame === undefined) frame = requestAnimationFrame(measure);
    }
    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(page);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [search]);

  const links = contents.map(([id, label, shortLabel], index) => (
    <li key={id}>
      <Link
        to={{ search, hash: `#${id}` }}
        aria-label={label}
        aria-current={index === active ? "location" : undefined}
        style={{
          "--tick-width": `${active < 0 ? 7 : [32, 24, 16, 10, 7][Math.abs(index - active)]}px`,
        }}
      >
        <span className="vision-section-label">{label}</span>
        <span className="vision-section-label-short" aria-hidden="true">
          {shortLabel}
        </span>
        <span className="vision-section-tick" aria-hidden="true" />
      </Link>
    </li>
  ));

  return (
    <nav className="vision-section-nav" aria-label="Vision page sections" hidden={overFooter}>
      <ul className="vision-section-rail">{links}</ul>
    </nav>
  );
}
