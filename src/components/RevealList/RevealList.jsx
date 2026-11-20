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
  matches,
  moreLabel = "See more",
  lessLabel = "See less",
  className,
  toggleClassName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const listId = useId();

  const items = Children.toArray(children);
  let rank = 0;
  const ranks = items.map((_, index) => (matches && !matches[index] ? -1 : rank++));
  const hiddenCount = Math.max(0, rank - visibleCount);

  return (
    <>
      <ul id={listId} className={cn("reveal-list", className)}>
        {items.map((child, index) => {
          const isExtra = ranks[index] >= visibleCount;
          const isHidden = ranks[index] === -1 || (isExtra && !isOpen);

          return (
            <li
              key={child.key ?? index}
              data-hidden={isHidden}
              aria-hidden={isHidden || undefined}
              style={
                isExtra
                  ? { "--reveal-list-delay": `${(ranks[index] - visibleCount) * STAGGER_MS}ms` }
                  : undefined
              }
            >
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
