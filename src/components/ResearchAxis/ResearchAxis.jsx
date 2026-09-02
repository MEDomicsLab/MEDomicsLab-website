import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../lib/utils";
import SkeletonImage from "../SkeletonImage/SkeletonImage";
import "./ResearchAxis.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export default function ResearchAxis({ items = [], eyebrow = "Research Axis", className }) {
  const sectionRef = useRef(null);
  const activeIndexRef = useRef(0);
  const scrollProgressRef = useRef(0);
  const revealProgressRef = useRef(0);
  const scrollIdleTimeoutRef = useRef(null);
  const scrollActiveRef = useRef(false);
  const imageProgressRef = useRef(0);
  const imageFrameRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isScrollActive, setIsScrollActive] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);

  const rulerSteps = useMemo(() => Array.from({ length: 36 }), []);
  const lastIndex = Math.max(0, items.length - 1);

  useEffect(() => {
    if (items.length === 0) return undefined;

    const update = () => {
      const node = sectionRef.current;
      if (!node) return;

      const sectionTop = node.offsetTop;
      const nextProgress = clamp((window.scrollY - sectionTop) / window.innerHeight, 0, lastIndex);
      const revealDistance = window.innerHeight * 0.72;
      const nextReveal = clamp(
        (window.scrollY - (sectionTop - revealDistance)) / revealDistance,
        0,
        1
      );
      const nextIndex = clamp(Math.round(nextProgress), 0, lastIndex);

      if (Math.abs(nextProgress - scrollProgressRef.current) > 0.0005) {
        scrollProgressRef.current = nextProgress;
        setScrollProgress(nextProgress);
      }

      if (Math.abs(nextReveal - revealProgressRef.current) > 0.0005) {
        revealProgressRef.current = nextReveal;
        setRevealProgress(nextReveal);
      }

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        startTransition(() => setActiveIndex(nextIndex));
      }
    };

    const setActivity = (value) => {
      if (scrollActiveRef.current === value) return;
      scrollActiveRef.current = value;
      setIsScrollActive(value);
    };

    const onScroll = () => {
      setActivity(true);
      window.clearTimeout(scrollIdleTimeoutRef.current);
      scrollIdleTimeoutRef.current = window.setTimeout(() => setActivity(false), 140);
      update();
    };

    update();
    setActivity(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(scrollIdleTimeoutRef.current);
    };
  }, [items.length, lastIndex]);

  useEffect(() => {
    const targetProgress = isScrollActive ? scrollProgress : activeIndex;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.cancelAnimationFrame(imageFrameRef.current);

    if (reduceMotion) {
      imageProgressRef.current = targetProgress;
      setImageProgress(targetProgress);
      return undefined;
    }

    const animate = () => {
      const nextProgress =
        imageProgressRef.current + (targetProgress - imageProgressRef.current) * 0.14;

      if (Math.abs(targetProgress - nextProgress) < 0.001) {
        imageProgressRef.current = targetProgress;
        setImageProgress(targetProgress);
        return;
      }

      imageProgressRef.current = nextProgress;
      setImageProgress(nextProgress);
      imageFrameRef.current = window.requestAnimationFrame(animate);
    };

    imageFrameRef.current = window.requestAnimationFrame(animate);

    return () => window.cancelAnimationFrame(imageFrameRef.current);
  }, [activeIndex, isScrollActive, scrollProgress]);

  if (items.length === 0) return null;

  const previewProgress = imageProgress;
  const stageProgress = clamp((revealProgress - 0.14) / 0.72, 0, 1);
  const stageEase = 1 - (1 - stageProgress) ** 3;
  const stageShift = `${(1 - stageEase) * 72}px`;

  return (
    <section ref={sectionRef} className={cn("research-axis", className)} aria-label={eyebrow}>
      <div className="research-axis__sticky">
        <div
          className="research-axis__layout"
          style={{
            "--research-axis-stage-opacity": stageEase,
            "--research-axis-stage-shift": stageShift,
          }}
        >
          <div
            className="research-axis__ruler"
            style={{
              "--cursor-y": `${(scrollProgress / Math.max(lastIndex, 1)) * 467}px`,
            }}
            aria-hidden="true"
          >
            {rulerSteps.map((_, index) => (
              <span
                className={cn("research-axis__tick", index % 10 === 0 && "is-major")}
                key={index}
              />
            ))}
            <span className="research-axis__cursor" />
          </div>

          <div className="research-axis__copy">
            <p className="research-axis__eyebrow">{eyebrow}</p>

            <div className="research-axis__titles">
              {items.map((item, index) => {
                const offset = index - activeIndex;
                const directionClass =
                  index === activeIndex
                    ? "is-active"
                    : index === activeIndex + 1
                      ? "is-next"
                      : index < activeIndex
                        ? "is-prev"
                        : "is-hidden";

                return (
                  <article
                    className={cn("research-axis__title", directionClass)}
                    key={item.id ?? `${item.title}-${index}`}
                    style={{
                      transform: `translate3d(0, ${offset * 72}px, 0) scale(${
                        index === activeIndex ? 1 : 0.97
                      })`,
                    }}
                  >
                    {item.axis && <span className="research-axis__axis-label">{item.axis}</span>}
                    <h2>{item.title}</h2>
                    {item.statements && item.statements.length > 0 && (
                      <ul className="research-axis__statements">
                        {item.statements.map((statement) => (
                          <li key={statement}>{statement}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                );
              })}
            </div>

            <p className="research-axis__progress" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
            </p>
          </div>

          <div className="research-axis__preview" aria-hidden="true">
            {items.map((item, index) => {
              const distance = index - previewProgress;
              const transitionProgress = Math.min(Math.abs(distance), 1);
              const distortion = Math.sin(transitionProgress * Math.PI);
              const direction = distance === 0 ? 1 : Math.sign(distance);
              const cardOpacity = clamp((1 - Math.abs(distance)) * 3, 0, 1);

              return (
                <div
                  className="research-axis__preview-item"
                  key={item.id ?? `${item.title}-preview-${index}`}
                  style={{
                    opacity: cardOpacity,
                    transform: `translate3d(0, ${distance * 102}%, 0)`,
                    zIndex: 20 - Math.round(Math.abs(distance) * 10),
                    "--reel-zoom": 1 + distortion * 0.13,
                    "--reel-stretch": 1 + distortion * 0.055,
                    "--reel-squeeze": 1 - distortion * 0.035,
                    "--reel-skew": `${direction * distortion * 1.8}deg`,
                    "--reel-blur": `${distortion * 0.45}px`,
                  }}
                >
                  <SkeletonImage
                    src={item.imageUrl}
                    alt=""
                    fill
                    loading={index <= 1 ? "eager" : "lazy"}
                    decoding="async"
                    formats={[]}
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        className="research-axis__markers"
        style={{ "--project-count": items.length }}
        aria-hidden="true"
      >
        {items.map((item, index) => (
          <div className="research-axis__marker" key={item.id ?? `marker-${index}`} />
        ))}
      </div>

      <div className="research-axis__mobile">
        <p className="research-axis__mobile-eyebrow">{eyebrow}</p>
        {items.map((item, index) => (
          <article className="research-axis__mobile-card" key={item.id ?? `mobile-${index}`}>
            <div className="research-axis__mobile-image">
              <SkeletonImage
                src={item.imageUrl}
                alt={item.title}
                fill
                loading="lazy"
                decoding="async"
                formats={[]}
                imgClassName="h-full w-full object-cover"
              />
            </div>
            {item.axis && <span className="research-axis__axis-label">{item.axis}</span>}
            <h2>{item.title}</h2>
            {item.statements && item.statements.length > 0 && (
              <ul className="research-axis__statements">
                {item.statements.map((statement) => (
                  <li key={statement}>{statement}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
