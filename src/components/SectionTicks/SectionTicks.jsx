import { cn } from "../../lib/utils";

const SCALE_PROFILES = {
  team: [1.45, 1.2, 1.05, 0.9],
  publications: [1.45, 1.2, 1.05, 0.9],
  timeline: [1.4, 1.15, 1.05, 0.9],
};

const VARIANT_STYLES = {
  team: {
    inactiveOpacity: "opacity-40 hover:opacity-100",
    activeText: "text-primary font-bold",
    inactiveText: "text-muted-foreground",
  },
  publications: {
    inactiveOpacity: "opacity-40 hover:opacity-100",
    activeText: "text-primary font-bold",
    inactiveText: "text-muted-foreground",
  },
  timeline: {
    inactiveOpacity: "opacity-40 hover:opacity-100",
    activeText: "text-primary font-bold",
    inactiveText: "text-muted-foreground",
  },
};

const VARIANT_DEFAULTS = {
  timeline: { className: "w-28 shrink-0" },
};

const getDockScale = (distance, profile) => {
  if (distance < profile.length) return profile[distance];
  return profile[profile.length - 1];
};

function Tick({ isActive }) {
  return (
    <div
      className={cn(
        "absolute -left-[40px] h-[1px] bg-primary transition-all duration-300",
        isActive ? "w-10 opacity-100" : "w-3 opacity-50 group-hover:w-6"
      )}
    />
  );
}

function TickButton({ item, isActive, scale, onClick, tooltip, variantStyles }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={tooltip}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group relative flex items-center transition-all duration-300",
        isActive ? "opacity-100" : variantStyles.inactiveOpacity
      )}
      style={{ transform: `scale(${scale})` }}
    >
      <Tick isActive={isActive} />
      <span
        className={cn(
          "text-sm tracking-widest transition-transform duration-300",
          isActive ? variantStyles.activeText : variantStyles.inactiveText
        )}
      >
        {item.label}
      </span>
    </button>
  );
}

export default function SectionTicks({
  variant = "team",
  items,
  activeId,
  activeSubId,
  onSelect,
  onSelectSub,
  tooltip,
  className,
}) {
  const variantStyles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.team;
  const profile = SCALE_PROFILES[variant] ?? SCALE_PROFILES.team;
  const defaults = VARIANT_DEFAULTS[variant] ?? {};
  const resolvedClassName = cn(defaults.className, className);
  const activeIndex = items.findIndex((item) => item.id === activeId);

  return (
    <div
      className={cn(
        "section-ticks hidden lg:block sticky top-32 self-start z-20 h-fit",
        resolvedClassName
      )}
    >
      <div className="flex flex-col items-start gap-8 border-l border-border/30 pl-12 relative">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          const distance = activeIndex < 0 ? 0 : Math.abs(index - activeIndex);
          const scale = getDockScale(distance, profile);

          if (variant === "timeline" && item.subItems?.length) {
            const activeSubIndex = item.subItems.findIndex((sub) => sub.id === activeSubId);
            return (
              <div key={item.id} className="space-y-4">
                <TickButton
                  item={item}
                  isActive={isActive}
                  scale={scale}
                  onClick={() => onSelect?.(item.id)}
                  tooltip={tooltip?.(item)}
                  variantStyles={variantStyles}
                />
                <div
                  aria-hidden={!isActive}
                  className={cn(
                    "transition-all duration-300 overflow-hidden",
                    isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex flex-col items-start gap-3 overflow-visible">
                    {item.subItems.map((sub, subIndex) => {
                      const isSubActive = activeSubId === sub.id;
                      const subDistance =
                        activeSubIndex === -1 ? 0 : Math.abs(subIndex - activeSubIndex);
                      return (
                        <button
                          key={sub.id}
                          type="button"
                          tabIndex={isActive ? 0 : -1}
                          aria-current={isActive && isSubActive ? "true" : undefined}
                          onClick={() => onSelectSub?.(item.id, sub.id)}
                          className={cn(
                            "group relative inline-flex items-center w-fit transition-all duration-300",
                            isSubActive ? "opacity-100" : "opacity-40 hover:opacity-100"
                          )}
                        >
                          <span
                            className={cn(
                              "uppercase tracking-widest transition-all duration-300",
                              isSubActive
                                ? "text-xs text-primary"
                                : "text-xs text-muted-foreground",
                              subDistance > 1 ? "opacity-70" : "opacity-100"
                            )}
                          >
                            {sub.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <TickButton
              key={item.id}
              item={item}
              isActive={isActive}
              scale={scale}
              onClick={() => onSelect?.(item.id)}
              tooltip={tooltip?.(item)}
              variantStyles={variantStyles}
            />
          );
        })}
      </div>
    </div>
  );
}
