import { useEffect, useRef } from "react";

function useSpotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const list = ref.current;
    if (!list || matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const rows = [...list.children];
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = innerHeight * 0.5;
      const centers = rows.map((row) => {
        const { top, height } = row.getBoundingClientRect();
        return top + height / 2;
      });
      rows.forEach((row, i) => {
        const distance = line - centers[i];
        const next = centers[i + Math.sign(distance)];
        const reach = Math.min(innerHeight * 0.32, Math.abs(next - centers[i]) || Infinity);
        const t = 1 - Math.min(1, Math.abs(distance) / reach);
        row.style.setProperty("--focus", (t * t * (3 - 2 * t)).toFixed(3));
      });
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
    list.dataset.spotlight = "";
    measure();
    observer.observe(list);
    addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      delete list.dataset.spotlight;
    };
  }, []);

  return ref;
}

export default function Premises({ title, scope, items }) {
  const list = useSpotlight();

  return (
    <section className="vision-row vision-premises" aria-labelledby="vision-premises-title">
      <h3 id="vision-premises-title" className="vision-subtitle">
        <span>{title}</span>{" "}
        <span className="vision-subtitle-scope">
          {scope.split("\n").map((phrase) => (
            <span key={phrase}>{phrase} </span>
          ))}
        </span>
      </h3>
      <ul ref={list} className="vision-premise-list">
        {items.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
    </section>
  );
}
