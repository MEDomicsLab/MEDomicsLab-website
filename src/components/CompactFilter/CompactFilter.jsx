import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { toggleFilter } from "../../lib/filters";
import { cn } from "../../lib/utils";
import "./CompactFilter.css";

const SPRING = { type: "spring", stiffness: 520, damping: 34 };

export default function CompactFilter({ options, selected, onChange, label, total, className }) {
  const rootRef = useRef(null);
  const measureRef = useRef(null);
  const [folded, setFolded] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const measure = measureRef.current;
    const fit = () => setFolded(measure.offsetWidth > root.clientWidth);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    observer.observe(measure);
    return () => observer.disconnect();
  }, []);

  const items = [{ value: null, label: "All", count: total }, ...options];
  const isActive = (item) =>
    item.value === null ? !selected.length : selected.includes(item.value);
  const pick = (item) =>
    onChange(item.value === null ? [] : toggleFilter(selected, item.value, options.length));

  return (
    <div ref={rootRef} className={cn("compact-filter", className)}>
      <div
        ref={measureRef}
        className="compact-filter-chips compact-filter-measure"
        aria-hidden="true"
      >
        {items.map((item, index) => (
          <ChipContent key={item.label} item={item} as="span" withRule={index === 0} />
        ))}
      </div>

      {folded ? (
        <FilterMenu
          items={items}
          selected={selected}
          isActive={isActive}
          onPick={pick}
          label={label}
        />
      ) : (
        <div role="group" aria-label={label} className="compact-filter-chips">
          {items.map((item, index) => (
            <ChipContent
              key={item.label}
              item={item}
              withRule={index === 0}
              active={isActive(item)}
              onClick={() => pick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ChipContent({ item, as, withRule, active, onClick }) {
  const content = (
    <>
      {item.label ?? item.value}
      <span className="compact-filter-count">{item.count}</span>
    </>
  );
  return (
    <>
      {as === "span" ? (
        <span className="compact-filter-chip">{content}</span>
      ) : (
        <motion.button
          type="button"
          className="compact-filter-chip"
          aria-pressed={active}
          whileTap={{ scale: 0.96 }}
          onClick={onClick}
        >
          {content}
        </motion.button>
      )}
      {withRule && <span className="compact-filter-rule" aria-hidden="true" />}
    </>
  );
}

function FilterMenu({ items, selected, isActive, onPick, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const labelOf = (value) => items.find((item) => item.value === value)?.label ?? value;
  const summary = !selected.length
    ? "All"
    : selected.length === 1
      ? labelOf(selected[0])
      : `${labelOf(selected[0])} +${selected.length - 1}`;
  const count = items
    .filter((item) => item.value !== null && (!selected.length || selected.includes(item.value)))
    .reduce((sum, item) => sum + item.count, 0);

  return (
    <div
      ref={rootRef}
      className="compact-filter-menu-root"
      onBlur={(event) => {
        if (!rootRef.current.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <motion.button
        ref={triggerRef}
        type="button"
        className="compact-filter-trigger"
        aria-expanded={open}
        aria-controls={menuId}
        data-filtered={selected.length > 0 || undefined}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">{label}, </span>
        {summary}
        <span className="compact-filter-count">{count}</span>
        <ChevronDown className="compact-filter-chevron" aria-hidden="true" />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="group"
            aria-label={label}
            className="compact-filter-menu"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98, transition: { duration: 0.14 } }}
            transition={SPRING}
          >
            {items.map((item, index) => (
              <button
                key={item.label}
                type="button"
                className={cn("compact-filter-option", index === 0 && "is-all")}
                aria-pressed={isActive(item)}
                onClick={() => onPick(item)}
              >
                <span className="compact-filter-check" aria-hidden="true">
                  <Check />
                </span>
                <span className="compact-filter-option-label">{item.label ?? item.value}</span>
                <span className="compact-filter-count">{item.count}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
