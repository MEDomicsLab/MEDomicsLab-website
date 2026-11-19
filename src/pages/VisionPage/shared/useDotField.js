import { useEffect, useRef } from "react";
import { mountDotField } from "./dotField.js";
import "./dotField.css";

// Mount the dot field as the figure approaches the viewport.
export default function useDotField(field, mood = "") {
  const stage = useRef(null);
  const mounted = useRef(null);
  const latest = useRef(mood);

  useEffect(() => {
    const node = stage.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        mounted.current = mountDotField({
          ...field,
          stage: node,
          weights: field.weigh(latest.current),
          still: matchMedia("(prefers-reduced-motion: reduce)").matches,
        });
      },
      { rootMargin: "100% 0px" }
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      mounted.current?.release();
      mounted.current = null;
    };
  }, [field]);

  useEffect(() => {
    latest.current = mood;
    mounted.current?.weigh(field.weigh(mood));
  }, [field, mood]);

  return stage;
}
