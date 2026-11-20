import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { getLenis } from "../../lib/lenis";
import { cn } from "../../lib/utils";
import "./SearchField.css";

const SHORTCUT = "/";

const isEditable = (target) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

const reveal = (element) => {
  const clearance = window.innerWidth <= 1100 ? 210 : 170;
  const box = element.getBoundingClientRect();
  if (box.top >= clearance - 60 && box.bottom <= window.innerHeight - 24) return;
  const fieldTop = window.scrollY + box.top;
  const target = fieldTop + box.height <= window.innerHeight - 24 ? 0 : fieldTop - clearance;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.1, immediate: reducedMotion, force: true });
  } else {
    window.scrollTo({ top: target, behavior: reducedMotion ? "instant" : "smooth" });
  }
};

export default function SearchField({ value, onChange, label, placeholder, className }) {
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== SHORTCUT || event.defaultPrevented || event.isComposing) return;
      if (event.metaKey || event.ctrlKey || event.altKey || isEditable(event.target)) return;
      event.preventDefault();
      inputRef.current.focus({ preventScroll: true });
      inputRef.current.select();
      reveal(rootRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div ref={rootRef} role="search" className={cn("search-field", className)}>
      <Search className="search-field-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          if (value) onChange("");
          else event.currentTarget.blur();
        }}
        placeholder={placeholder}
        aria-label={label}
        aria-keyshortcuts={SHORTCUT}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        enterKeyHint="search"
        className="search-field-input"
      />
      {value ? (
        <button
          type="button"
          className="search-field-clear"
          aria-label="Clear search"
          onClick={() => {
            onChange("");
            inputRef.current.focus();
          }}
        >
          <X aria-hidden="true" />
        </button>
      ) : (
        <kbd className="search-field-key" aria-hidden="true">
          {SHORTCUT}
        </kbd>
      )}
    </div>
  );
}
