import { useEffect, useRef } from "react";
import "./CoreQuestion.css";

// Brighten the words as the statement enters the viewport.
export default function CoreQuestion({ lead, children, className = "" }) {
  const ref = useRef(null);
  const words = children.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const measure = () => {
      frame = 0;
      // Finish lighting the words in the upper third of the viewport.
      const { top } = node.getBoundingClientRect();
      const progress = (innerHeight * 0.92 - top) / (innerHeight * 0.6);
      node.style.setProperty("--progress", Math.min(1, Math.max(0, progress)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        addEventListener("scroll", schedule, { passive: true });
        schedule();
      } else removeEventListener("scroll", schedule);
    });
    measure();
    observer.observe(node);
    addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className={`vision-question ${className}`} style={{ "--words": words.length }}>
      {lead && <p className="sr-only">{lead}</p>}
      <p className="vision-question-text">
        {words.map((word, i) => (
          <span key={i} style={{ "--word": i }}>
            {word}{" "}
          </span>
        ))}
      </p>
    </div>
  );
}
