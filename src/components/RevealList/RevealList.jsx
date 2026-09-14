import { Children, cloneElement, isValidElement, useId, useState } from "react";
import { cn } from "../../lib/utils";
import "./RevealList.css";

const STAGGER_MS = 45;

/**
 * Shows the first `visibleCount` children and hides the rest behind a
 * "See more" toggle, revealing them with a staggered slide-down.
 */
export default function RevealList({
  children,
  visibleCount = 3,
  moreLabel = "See more",
  lessLabel = "See less",
  className,
  toggleClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  const items = Children.toArray(children);
  const hiddenCount = Math.max(0, items.length - visibleCount);

  return (
    <>
      <ul id={listId} className={cn("reveal-list", isOpen && "is-open", className)}>
        {items.map((child, index) => {
          const isExtra = index >= visibleCount;
          const isHidden = isExtra && !isOpen;

          return (
            <li
              key={child.key ?? index}
              className={isExtra ? "reveal-list-extra" : undefined}
              aria-hidden={isExtra ? !isOpen : undefined}
              style={
                isExtra
                  ? { "--reveal-list-delay": `${(index - visibleCount) * STAGGER_MS}ms` }
                  : undefined
              }
            >
              {/* Plain wrapper so the collapsing track has something with no
                  padding. */}
              <div>
                {isHidden && isValidElement(child) ? cloneElement(child, { tabIndex: -1 }) : child}
              </div>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 && (
        <button
          type="button"
          className={cn(
            "reveal-list-toggle mt-6 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary",
            toggleClassName
          )}
          aria-expanded={isOpen}
          aria-controls={listId}
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? lessLabel : `${moreLabel} (+${hiddenCount})`}
        </button>
      )}
    </>
  );
}
