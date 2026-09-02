import { AnimatePresence, motion } from "framer-motion";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { cn } from "../../lib/utils";

const MotionHighlightContext = createContext(undefined);

const useMotionHighlight = () => {
  const context = useContext(MotionHighlightContext);
  if (!context) {
    throw new Error("useMotionHighlight must be used within a MotionHighlightProvider");
  }
  return context;
};

export function MotionHighlight({
  children,
  value,
  defaultValue,
  onValueChange,
  className,
  transition = { type: "spring", stiffness: 350, damping: 35 },
  hover = false,
  enabled = true,
  controlledItems,
  disabled = false,
  exitDelay = 0.2,
  mode = "children",
  boundsOffset,
  containerClassName,
  forceUpdateBounds,
  itemsClassName,
  style: highlightStyle,
  ...props
}) {
  const localRef = useRef(null);
  useImperativeHandle(props.ref, () => localRef.current);

  const [activeValue, setActiveValue] = useState(value ?? defaultValue ?? null);
  const [boundsState, setBoundsState] = useState(null);
  const [activeClassNameState, setActiveClassNameState] = useState("");

  const safeSetActiveValue = useCallback(
    (id) => {
      setActiveValue((prev) => (prev === id ? prev : id));
      if (id !== activeValue) {
        onValueChange?.(id);
      }
    },
    [activeValue, onValueChange]
  );

  const safeSetBounds = useCallback(
    (bounds) => {
      if (!localRef.current) {
        return;
      }

      const offset = boundsOffset ?? {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      };

      const containerRect = localRef.current.getBoundingClientRect();
      const newBounds = {
        top: bounds.top - containerRect.top + (offset.top ?? 0),
        left: bounds.left - containerRect.left + (offset.left ?? 0),
        width: bounds.width + (offset.width ?? 0),
        height: bounds.height + (offset.height ?? 0),
      };

      setBoundsState((prev) => {
        if (
          prev &&
          prev.top === newBounds.top &&
          prev.left === newBounds.left &&
          prev.width === newBounds.width &&
          prev.height === newBounds.height
        ) {
          return prev;
        }
        return newBounds;
      });
    },
    [boundsOffset]
  );

  const clearBounds = useCallback(() => {
    setBoundsState((prev) => (prev === null ? prev : null));
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      setActiveValue(value);
    } else if (defaultValue !== undefined) {
      setActiveValue(defaultValue);
    }
  }, [value, defaultValue]);

  const id = useId();

  useEffect(() => {
    if (mode !== "parent") {
      return;
    }
    const container = localRef.current;
    if (!container) {
      return;
    }

    const onScroll = () => {
      if (!activeValue) {
        return;
      }
      const activeEl = container.querySelector(
        `[data-value="${activeValue}"][data-highlight="true"]`
      );
      if (activeEl) {
        safeSetBounds(activeEl.getBoundingClientRect());
      }
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [mode, activeValue, safeSetBounds]);

  const render = useCallback(
    (innerChildren) => {
      if (mode === "parent") {
        return (
          <div
            className={cn("relative", containerClassName)}
            data-slot="motion-highlight-container"
            ref={localRef}
          >
            <AnimatePresence initial={false}>
              {boundsState && (
                <motion.div
                  animate={{
                    top: boundsState.top,
                    left: boundsState.left,
                    width: boundsState.width,
                    height: boundsState.height,
                    opacity: 1,
                  }}
                  className={cn("absolute bg-muted z-0", className, activeClassNameState)}
                  data-slot="motion-highlight"
                  style={highlightStyle}
                  exit={{
                    opacity: 0,
                    transition: {
                      ...transition,
                      delay: (transition?.delay ?? 0) + (exitDelay ?? 0),
                    },
                  }}
                  initial={{
                    top: boundsState.top,
                    left: boundsState.left,
                    width: boundsState.width,
                    height: boundsState.height,
                    opacity: 0,
                  }}
                  transition={transition}
                />
              )}
            </AnimatePresence>
            {innerChildren}
          </div>
        );
      }

      return innerChildren;
    },
    [
      mode,
      containerClassName,
      boundsState,
      className,
      activeClassNameState,
      transition,
      exitDelay,
      highlightStyle,
    ]
  );

  return (
    <MotionHighlightContext.Provider
      value={{
        mode,
        activeValue,
        setActiveValue: safeSetActiveValue,
        id,
        hover,
        className,
        transition,
        disabled,
        enabled,
        exitDelay,
        setBounds: safeSetBounds,
        clearBounds,
        activeClassName: activeClassNameState,
        setActiveClassName: setActiveClassNameState,
        forceUpdateBounds,
      }}
    >
      {enabled
        ? controlledItems
          ? render(children)
          : render(
              children &&
                [children].flat().map((child, index) => (
                  <MotionHighlightItem className={itemsClassName} key={index}>
                    {child}
                  </MotionHighlightItem>
                ))
            )
        : children}
    </MotionHighlightContext.Provider>
  );
}

const getNonOverridingDataAttributes = (element, dataAttributes) =>
  Object.keys(dataAttributes).reduce((acc, key) => {
    if (element.props?.[key] === undefined) {
      acc[key] = dataAttributes[key];
    }
    return acc;
  }, {});

export function MotionHighlightItem({
  children,
  id,
  value,
  className,
  transition,
  disabled = false,
  activeClassName,
  exitDelay,
  asChild = false,
  forceUpdateBounds,
  ...props
}) {
  const itemId = useId();
  const {
    activeValue,
    setActiveValue,
    mode,
    setBounds,
    clearBounds,
    hover,
    enabled,
    className: contextClassName,
    transition: contextTransition,
    id: contextId,
    disabled: contextDisabled,
    exitDelay: contextExitDelay,
    forceUpdateBounds: contextForceUpdateBounds,
    setActiveClassName,
  } = useMotionHighlight();

  const element = children;
  const childValue = id ?? value ?? element.props?.["data-value"] ?? element.props?.id ?? itemId;
  const isActive = activeValue === childValue;
  const isDisabled = disabled === undefined ? contextDisabled : disabled;
  const itemTransition = transition ?? contextTransition;

  const localRef = useRef(null);
  useImperativeHandle(props.ref, () => localRef.current);

  useEffect(() => {
    if (mode !== "parent") {
      return;
    }
    let rafId;
    let previousBounds = null;
    const shouldUpdateBounds =
      forceUpdateBounds === true || (contextForceUpdateBounds && forceUpdateBounds !== false);

    const updateBounds = () => {
      if (!localRef.current) {
        return;
      }

      const bounds = localRef.current.getBoundingClientRect();

      if (shouldUpdateBounds) {
        if (
          previousBounds &&
          previousBounds.top === bounds.top &&
          previousBounds.left === bounds.left &&
          previousBounds.width === bounds.width &&
          previousBounds.height === bounds.height
        ) {
          rafId = requestAnimationFrame(updateBounds);
          return;
        }
        previousBounds = bounds;
        rafId = requestAnimationFrame(updateBounds);
      }

      setBounds(bounds);
    };

    if (isActive && !isDisabled) {
      updateBounds();
      setActiveClassName(activeClassName ?? "");
    } else if (!activeValue || (isDisabled && isActive)) {
      clearBounds();
    }

    if (shouldUpdateBounds) {
      return () => cancelAnimationFrame(rafId);
    }
  }, [
    mode,
    isActive,
    activeValue,
    setBounds,
    clearBounds,
    activeClassName,
    setActiveClassName,
    forceUpdateBounds,
    contextForceUpdateBounds,
    isDisabled,
  ]);

  if (!element || typeof element !== "object") {
    return element;
  }

  const dataAttributes = {
    "data-active": isActive ? "true" : "false",
    "data-disabled": isDisabled,
    "data-value": childValue,
    "data-highlight": true,
  };

  const commonHandlers = hover
    ? {
        onMouseEnter: (e) => {
          if (!isDisabled) {
            setActiveValue(childValue);
          }
          element.props?.onMouseEnter?.(e);
        },
        onMouseLeave: (e) => {
          if (!isDisabled) {
            setActiveValue(null);
          }
          element.props?.onMouseLeave?.(e);
        },
      }
    : {
        onClick: (e) => {
          setActiveValue(childValue);
          element.props?.onClick?.(e);
        },
      };

  if (asChild) {
    if (mode === "children") {
      return (
        <>
          <AnimatePresence initial={false}>
            {isActive && !isDisabled && (
              <motion.div
                animate={{ opacity: 1 }}
                className={cn("absolute inset-0 bg-muted z-0", contextClassName, activeClassName)}
                data-slot="motion-highlight"
                exit={{
                  opacity: 0,
                  transition: {
                    ...itemTransition,
                    delay: (itemTransition?.delay ?? 0) + (exitDelay ?? contextExitDelay ?? 0),
                  },
                }}
                initial={{ opacity: 0 }}
                layoutId={`transition-background-${contextId}`}
                transition={itemTransition}
                {...dataAttributes}
              />
            )}
          </AnimatePresence>

          {element &&
            element.type &&
            element.type !== "fragment" &&
            element.type !== React.Fragment &&
            React.cloneElement(
              element,
              {
                key: childValue,
                ref: localRef,
                className: cn("relative", element.props?.className),
                ...getNonOverridingDataAttributes(element, {
                  ...dataAttributes,
                  "data-slot": "motion-highlight-item-container",
                }),
                ...commonHandlers,
                ...props,
              },
              <>
                <div
                  className={cn("relative z-[1]", className)}
                  data-slot="motion-highlight-item"
                  {...dataAttributes}
                >
                  {element.props?.children}
                </div>
              </>
            )}
        </>
      );
    }

    return React.cloneElement(element, {
      ref: localRef,
      ...getNonOverridingDataAttributes(element, {
        ...dataAttributes,
        "data-slot": "motion-highlight-item",
      }),
      ...commonHandlers,
    });
  }

  return enabled ? (
    <div
      className={cn(mode === "children" && "relative", className)}
      data-slot="motion-highlight-item-container"
      key={childValue}
      ref={localRef}
      {...dataAttributes}
      {...props}
      {...commonHandlers}
    >
      {mode === "children" && (
        <AnimatePresence initial={false}>
          {isActive && !isDisabled && (
            <motion.div
              animate={{ opacity: 1 }}
              className={cn("absolute inset-0 bg-muted z-0", contextClassName, activeClassName)}
              data-slot="motion-highlight"
              exit={{
                opacity: 0,
                transition: {
                  ...itemTransition,
                  delay: (itemTransition?.delay ?? 0) + (exitDelay ?? contextExitDelay ?? 0),
                },
              }}
              initial={{ opacity: 0 }}
              layoutId={`transition-background-${contextId}`}
              transition={itemTransition}
              {...dataAttributes}
            />
          )}
        </AnimatePresence>
      )}

      {React.cloneElement(element, {
        className: cn("relative z-[1]", element.props?.className),
        ...getNonOverridingDataAttributes(element, {
          ...dataAttributes,
          "data-slot": "motion-highlight-item",
        }),
      })}
    </div>
  ) : (
    children
  );
}
