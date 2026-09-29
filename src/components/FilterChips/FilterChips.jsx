import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "../../lib/utils";

const VISIBLE_OPTIONS = 3;

/**
 * Match any selected tag; an empty selection shows all items.
 * Keep selected tags inline and put overflow in the More menu.
 * `options` is `[{ value, label?, count }]`; `selected` is an array of values.
 */
export default function FilterChips({
  options,
  selected,
  onChange,
  label,
  total,
  shown,
  noun = "items",
  className,
}) {
  const isAll = selected.length === 0;
  let inline = options.filter(
    (option, index) => index < VISIBLE_OPTIONS || selected.includes(option.value)
  );
  let folded = options.filter((option) => !inline.includes(option));
  if (folded.length < 2) {
    inline = options;
    folded = [];
  }

  const toggle = (value) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(next.length === options.length ? [] : next);
  };

  return (
    <div className={cn("filter-chips space-y-4", className)}>
      <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2 md:gap-3">
        <Chip active={isAll} onClick={() => onChange([])} count={total}>
          All
        </Chip>
        <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />
        {inline.map((option) => (
          <Chip
            key={option.value}
            active={selected.includes(option.value)}
            onClick={() => toggle(option.value)}
            count={option.count}
          >
            {option.label ?? option.value}
          </Chip>
        ))}
        {folded.length > 0 && <MoreMenu options={folded} onPick={toggle} />}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground" aria-live="polite">
        <span>
          Showing <span className="text-foreground font-semibold">{shown}</span> of {total} {noun}
        </span>
        {!isAll && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="inline-flex items-center gap-1 text-primary hover:text-white transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, count, children }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold transition-colors duration-200",
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-white/15 bg-white/5 text-foreground/80 backdrop-blur-xl hover:border-primary/60 hover:text-primary"
      )}
    >
      {children}
      {typeof count === "number" && (
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs tabular-nums transition-colors",
            active ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}

function MoreMenu({ options, onPick }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const [menuLeft, setMenuLeft] = useState(0);

  useLayoutEffect(() => {
    if (!isOpen) return undefined;
    const place = () => {
      const left = rootRef.current.getBoundingClientRect().left;
      const width = menuRef.current.offsetWidth;
      setMenuLeft(Math.max(16 - left, Math.min(0, window.innerWidth - 16 - left - width)));
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setIsOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileTap={{ scale: 0.96 }}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold transition-colors duration-200",
          isOpen
            ? "border-primary/60 text-primary bg-white/5"
            : "border-dashed border-white/25 text-foreground/80 hover:border-primary/60 hover:text-primary"
        )}
      >
        More
        <Plus
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-45")}
          aria-hidden="true"
        />
      </motion.button>
      {isOpen && (
        <div
          ref={menuRef}
          style={{ left: menuLeft }}
          className="absolute top-full z-30 mt-2 flex min-w-[220px] max-w-[calc(100vw-32px)] flex-col gap-2 rounded-2xl border border-white/10 bg-background/80 p-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.45)] backdrop-blur-xl"
          role="group"
          aria-label="More filters"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onPick(option.value);
                setIsOpen(false);
              }}
              className="flex items-center justify-between gap-4 rounded-full px-3 py-2 text-left text-sm md:text-base font-semibold text-foreground/85 hover:bg-white/5 hover:text-primary transition-colors"
            >
              {option.label ?? option.value}
              {typeof option.count === "number" && (
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {option.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
