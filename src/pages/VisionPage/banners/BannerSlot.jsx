import { useEffect, useRef } from "react";
import useMediaQuery from "../../../lib/useMediaQuery.js";
import "./BannerSlot.css";
import "./lucioles/lucioles.css";
import "./aurore/aurore.css";
import "./aube/aube.css";
import "./butterfly-flight/flight.css";

const scenes = {
  horizon: () => import("./lucioles/lucioles.js"),
  progress: () => import("./aurore/aurore.js"),
  work: () => import("./aube/aube.js"),
  publications: () => import("./butterfly-flight/butterfly-flight.js"),
};

export default function BannerSlot({ slot, className, children }) {
  const host = useRef(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const node = host.current;
    let active = true;
    let release;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        scenes[slot]()
          .then(({ mount }) => {
            if (active)
              release = mount(node, { words: node.querySelector(".hl-copy"), reducedMotion });
          })
          .catch((error) => console.error(`Vision artwork ${slot} could not load`, error));
      },
      { rootMargin: "450px 0px" }
    );
    observer.observe(node);
    return () => {
      active = false;
      observer.disconnect();
      release?.();
    };
  }, [slot, reducedMotion]);

  return (
    <div
      ref={host}
      id={`banner-${slot}`}
      className={`vision-banner ${className}`}
      data-banner-slot={slot}
      aria-hidden={children || slot === "work" ? undefined : true}
    >
      {children}
    </div>
  );
}
