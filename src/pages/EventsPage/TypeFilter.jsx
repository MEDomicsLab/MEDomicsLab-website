import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_COLORS, calendarCategories } from "./eventsCalendar";

const SPRING = { type: "spring", stiffness: 420, damping: 30 };

export default function TypeFilter({ selected, onChange, hidden }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const shown = selected.length ? selected : calendarCategories;

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  useEffect(() => {
    if (!open) return undefined;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  const toggle = (category) => {
    const next = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];
    onChange(next.length === calendarCategories.length ? [] : next);
  };

  return (
    <div ref={root} className="evcal-filter">
      <AnimatePresence>
        {open && (
          <motion.div
            id="evcal-filter-menu"
            className="evcal-filter-menu"
            role="group"
            aria-label="Event types"
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6, transition: { duration: 0.15 } }}
            transition={SPRING}
          >
            <button
              type="button"
              className="evcal-filter-option is-all"
              aria-pressed={selected.length === 0}
              onClick={() => onChange([])}
            >
              <span className="evcal-filter-swatch" aria-hidden="true">
                {calendarCategories.map((category) => (
                  <span key={category} data-color={CATEGORY_COLORS[category]} />
                ))}
              </span>
              All events
            </button>
            {calendarCategories.map((category, index) => (
              <motion.button
                key={category}
                type="button"
                className="evcal-filter-option"
                data-color={CATEGORY_COLORS[category]}
                aria-pressed={selected.includes(category)}
                onClick={() => toggle(category)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: 0.03 * (index + 1) }}
              >
                <span className="evcal-filter-dot" aria-hidden="true" />
                {category}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        type="button"
        className="evcal-filter-button"
        aria-label="Filter events by type"
        aria-expanded={open}
        aria-controls="evcal-filter-menu"
        data-filtered={selected.length ? "" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="evcal-filter-dots" aria-hidden="true">
          {shown.map((category) => (
            <motion.span
              key={category}
              layout
              data-color={CATEGORY_COLORS[category]}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={SPRING}
            />
          ))}
        </span>
      </button>
    </div>
  );
}
