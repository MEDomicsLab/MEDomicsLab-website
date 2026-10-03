import { AnimatePresence, motion } from "framer-motion";
import {
  cloneElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";

const MotionHighlightContext = createContext(null);
const transition = { type: "spring", stiffness: 350, damping: 35 };

function useMotionHighlight() {
  const context = useContext(MotionHighlightContext);
  if (!context) throw new Error("MotionHighlightItem must be used within MotionHighlight");
  return context;
}

export function MotionHighlight({ children, className, boundsOffset, containerClassName, style }) {
  const containerRef = useRef(null);
  const [activeValue, setActiveValue] = useState(null);
  const [bounds, setBounds] = useState(null);

  const updateBounds = useCallback(
    (rect) => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next = {
        top: rect.top - containerRect.top + (boundsOffset?.top ?? 0),
        left: rect.left - containerRect.left + (boundsOffset?.left ?? 0),
        width: rect.width + (boundsOffset?.width ?? 0),
        height: rect.height + (boundsOffset?.height ?? 0),
      };
      setBounds((previous) =>
        previous && Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next
      );
    },
    [boundsOffset]
  );
  const clearBounds = useCallback(() => setBounds(null), []);

  useEffect(() => {
    const container = containerRef.current;
    const onScroll = () => {
      if (!activeValue) return;
      const item = container.querySelector(`[data-value="${activeValue}"][data-highlight="true"]`);
      if (item) updateBounds(item.getBoundingClientRect());
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeValue, updateBounds]);

  return (
    <MotionHighlightContext.Provider
      value={{ activeValue, setActiveValue, updateBounds, clearBounds }}
    >
      <div
        ref={containerRef}
        className={cn("relative", containerClassName)}
        data-slot="motion-highlight-container"
      >
        <AnimatePresence initial={false}>
          {bounds && (
            <motion.div
              animate={{ ...bounds, opacity: 1 }}
              initial={{ ...bounds, opacity: 0 }}
              exit={{ opacity: 0, transition: { ...transition, delay: 0.2 } }}
              transition={transition}
              className={cn("absolute bg-muted z-0", className)}
              data-slot="motion-highlight"
              style={style}
            />
          )}
        </AnimatePresence>
        {children}
      </div>
    </MotionHighlightContext.Provider>
  );
}

export function MotionHighlightItem({ children, className, disabled = false }) {
  const { activeValue, setActiveValue, updateBounds, clearBounds } = useMotionHighlight();
  const id = useId();
  const itemRef = useRef(null);
  const isActive = activeValue === id;

  useEffect(() => {
    if (isActive && !disabled) {
      updateBounds(itemRef.current.getBoundingClientRect());
    } else if (!activeValue || (disabled && isActive)) {
      clearBounds();
    }
  }, [activeValue, isActive, disabled, updateBounds, clearBounds]);

  const dataAttributes = {
    "data-active": isActive ? "true" : "false",
    "data-disabled": disabled,
    "data-value": id,
    "data-highlight": true,
  };

  return (
    <div
      ref={itemRef}
      className={className}
      data-slot="motion-highlight-item-container"
      {...dataAttributes}
      onMouseEnter={(event) => {
        if (!disabled) setActiveValue(id);
        children.props.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!disabled) setActiveValue(null);
        children.props.onMouseLeave?.(event);
      }}
    >
      {cloneElement(children, {
        ...dataAttributes,
        ...children.props,
        className: cn("relative z-[1]", children.props.className),
        "data-slot": children.props["data-slot"] ?? "motion-highlight-item",
      })}
    </div>
  );
}
