import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "../../lib/utils";

/**
 * Round glass button that opens a checklist of filter options.
 */
export default function FilterMenu({ options, active, onToggle, label, className }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (!menuRef.current) return;
      if (menuRef.current.contains(event.target)) return;
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} aria-hidden="true" />
      )}
      <div ref={menuRef} className={cn("relative flex justify-end", className)}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] backdrop-blur-xl flex items-center justify-center hover:text-primary transition-colors"
          aria-label={label}
          aria-expanded={isOpen}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        <div
          className={cn(
            "absolute right-0 top-full mt-2 min-w-[220px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transition-all duration-200 z-30",
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          <div className="flex flex-col gap-2 px-4 py-4">
            {options.map((option) => {
              const isActive = active.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => onToggle(option)}
                  aria-pressed={isActive}
                  className={cn(
                    "text-left text-xs uppercase tracking-widest transition-colors cursor-pointer hover:text-primary",
                    isActive
                      ? "text-white scale-[1.01] animate-scale-bounce"
                      : "text-muted-foreground scale-95 animate-scale-down-bounce"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
