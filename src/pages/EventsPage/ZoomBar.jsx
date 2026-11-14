import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ZOOM_LEVELS } from "./eventsCalendar";

const SPRING = { type: "spring", stiffness: 200, damping: 16 };
const MIN_THUMB = 84;

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" aria-hidden="true">
    <path
      d="M 0 6 C 0 5.586 0.336 5.25 0.75 5.25 L 11.25 5.25 C 11.664 5.25 12 5.586 12 6 L 12 6 C 12 6.414 11.664 6.75 11.25 6.75 L 0.75 6.75 C 0.336 6.75 0 6.414 0 6 Z"
      fill="currentColor"
    />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" aria-hidden="true">
    <path
      d="M 5.25 0.75 C 5.25 0.336 5.586 0 6 0 C 6.414 0 6.75 0.336 6.75 0.75 L 6.75 5.25 L 11.25 5.25 C 11.664 5.25 12 5.586 12 6 C 12 6.414 11.664 6.75 11.25 6.75 L 6.75 6.75 L 6.75 11.25 C 6.75 11.664 6.414 12 6 12 C 5.586 12 5.25 11.664 5.25 11.25 L 5.25 6.75 L 0.75 6.75 C 0.336 6.75 0 6.414 0 6 C 0 5.586 0.336 5.25 0.75 5.25 L 5.25 5.25 Z"
      fill="currentColor"
    />
  </svg>
);

export default function ZoomBar({ scrollerRef, scrollTo, zoom, onZoom, layoutKey }) {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);
  const metrics = useRef({ ratio: 1, max: 0, free: 0 });
  const drag = useRef(null);
  const thumbTarget = useMotionValue(100);
  const xTarget = useMotionValue(0);
  const thumb = useSpring(thumbTarget, SPRING);
  const x = useSpring(xTarget, SPRING);
  const width = useTransform(thumb, (value) => `${value}%`);
  const settled = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const track = trackRef.current;
    if (!scroller || !track) return undefined;
    const measure = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const visible = scroller.scrollWidth
        ? Math.min(1, scroller.clientWidth / scroller.scrollWidth)
        : 1;
      const ratio = track.clientWidth
        ? Math.min(1, Math.max(visible, MIN_THUMB / track.clientWidth))
        : visible;
      const free = track.clientWidth * (1 - ratio);
      const progress = max > 0 ? scroller.scrollLeft / max : 0;
      metrics.current = { ratio, max, free };
      thumbTarget.set(ratio * 100);
      xTarget.set(progress * free);
      thumbRef.current?.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
      if (!settled.current && track.clientWidth > 0) {
        settled.current = true;
        thumb.jump(ratio * 100);
        x.jump(xTarget.get());
      }
    };
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    observer.observe(track);
    if (scroller.firstElementChild) observer.observe(scroller.firstElementChild);
    return () => {
      scroller.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [scrollerRef, layoutKey, thumb, thumbTarget, x, xTarget]);

  const startDrag = (event) => {
    if (event.button !== 0) return;
    const scroller = scrollerRef.current;
    const { max, free } = metrics.current;
    if (!scroller || max <= 0 || free <= 0) return;
    drag.current = { pointer: event.clientX, scroll: scroller.scrollLeft, perPixel: max / free };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    if (!drag.current) return;
    const { pointer, scroll, perPixel } = drag.current;
    scrollTo(scroll + (event.clientX - pointer) * perPixel, { immediate: true });
  };
  const endDrag = () => {
    drag.current = null;
  };
  const stepScroll = (event) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const column = scroller.querySelector("[data-column]")?.offsetWidth ?? 200;
    const delta = { ArrowLeft: -column, ArrowRight: column, PageUp: -scroller.clientWidth }[
      event.key
    ];
    const target = {
      Home: 0,
      End: scroller.scrollWidth,
      PageDown: scroller.scrollLeft + scroller.clientWidth,
    }[event.key];
    if (delta === undefined && target === undefined) return;
    event.preventDefault();
    scrollTo(target ?? scroller.scrollLeft + delta);
  };

  const level = ZOOM_LEVELS[zoom];
  return (
    <div className="evcal-bar">
      <button
        type="button"
        className="evcal-bar-button"
        onClick={() => onZoom(zoom - 1)}
        disabled={zoom === 0}
        aria-label={zoom > 0 ? `Zoom out to ${ZOOM_LEVELS[zoom - 1].toLowerCase()}` : "Zoom out"}
      >
        <MinusIcon />
      </button>
      <div ref={trackRef} className="evcal-bar-track">
        <motion.div
          className="evcal-bar-thumb"
          style={{ x, width }}
          role="scrollbar"
          aria-controls="evcal-scroller"
          aria-orientation="horizontal"
          aria-label={`Timeline position, showing ${level.toLowerCase()}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={100}
          ref={thumbRef}
          tabIndex={0}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={stepScroll}
        >
          <div className="evcal-bar-handle">
            <motion.div
              className="evcal-bar-labels"
              initial={false}
              animate={{ top: `${-zoom * 100}%` }}
              transition={SPRING}
              aria-hidden="true"
            >
              {ZOOM_LEVELS.map((label) => (
                <div key={label} className="evcal-bar-label">
                  {label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <button
        type="button"
        className="evcal-bar-button"
        onClick={() => onZoom(zoom + 1)}
        disabled={zoom === ZOOM_LEVELS.length - 1}
        aria-label={
          zoom < ZOOM_LEVELS.length - 1
            ? `Zoom in to ${ZOOM_LEVELS[zoom + 1].toLowerCase()}`
            : "Zoom in"
        }
      >
        <PlusIcon />
      </button>
      <span className="sr-only" aria-live="polite">
        Showing {level.toLowerCase()}
      </span>
    </div>
  );
}
