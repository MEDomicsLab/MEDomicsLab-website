import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { cn } from "../../lib/utils";

export default function TextGenerateEffect({
  words,
  className,
  filter = true,
  duration = 0.5,
  staggerDelay = 0.2,
  inViewMargin = "-10% 0px",
  inViewOnce = true,
  onComplete,
  ...props
}) {
  const localRef = useRef(null);
  const wordsArray = useMemo(() => words.split(" "), [words]);
  const isInView = useInView(localRef, { once: inViewOnce, margin: inViewMargin });
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (isInView && onComplete && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const totalDuration = duration + Math.max(wordsArray.length - 1, 0) * staggerDelay;
      const timeoutId = window.setTimeout(() => {
        onComplete?.();
      }, totalDuration * 1000);
      return () => window.clearTimeout(timeoutId);
    }
    return undefined;
  }, [duration, inViewMargin, isInView, onComplete, staggerDelay, wordsArray.length]);

  return (
    <div
      className={cn("font-bold", className)}
      data-slot="text-generate-effect"
      ref={localRef}
      {...props}
    >
      <motion.div>
        {wordsArray.map((word, idx) => (
          <motion.span
            animate={
              isInView
                ? {
                    opacity: 1,
                    filter: filter ? "blur(0px)" : "none",
                  }
                : undefined
            }
            className="opacity-0 will-change-transform will-change-opacity will-change-filter"
            key={`${word}-${idx}`}
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
            transition={{
              duration,
              delay: idx * staggerDelay,
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
}
