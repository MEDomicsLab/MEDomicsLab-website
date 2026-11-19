import { useEffect, useRef } from "react";

// Keep content visible until the entrance observer is ready.
export default function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const targets = [root, ...root.querySelectorAll("[data-reveal]")].filter(
      (node) => node.dataset.reveal !== "in" && node.hasAttribute("data-reveal")
    );
    if (!targets.length) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.dataset.reveal = "in";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    root.dataset.revealReady = "";
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return ref;
}
