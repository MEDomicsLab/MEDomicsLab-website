import { useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";

const ENTRY_ANIMATION = {
  initial: { rotateX: 0 },
  animate: { rotateX: 90 },
};

const EXIT_ANIMATION = {
  initial: { rotateX: 90 },
  animate: { rotateX: 0 },
};

const formatCharacter = (char) => (char === " " ? "\u00A0" : char);

export default function RollingText({
  className,
  transition = { duration: 0.5, delay: 0.08, ease: "easeOut" },
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  text,
  ...props
}) {
  const characters = useMemo(() => text.split(""), [text]);
  const ref = useRef(null);
  const inViewResult = useInView(ref, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  return (
    <span data-slot="rolling-text" {...props} ref={ref} className={className}>
      {characters.map((char, idx) => (
        <span
          aria-hidden="true"
          className="relative inline-block"
          key={`${char}-${idx}`}
          style={{ perspective: "9999999px" }}
        >
          <motion.span
            animate={isInView ? ENTRY_ANIMATION.animate : undefined}
            className="absolute inline-block"
            initial={ENTRY_ANIMATION.initial}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0),
            }}
            style={{ backfaceVisibility: "hidden", transformOrigin: "50% 25%" }}
          >
            {formatCharacter(char)}
          </motion.span>
          <motion.span
            animate={isInView ? EXIT_ANIMATION.animate : undefined}
            className="absolute inline-block"
            initial={EXIT_ANIMATION.initial}
            transition={{
              ...transition,
              delay: idx * (transition?.delay ?? 0) + 0.3,
            }}
            style={{ backfaceVisibility: "hidden", transformOrigin: "50% 100%" }}
          >
            {formatCharacter(char)}
          </motion.span>
          <span className="invisible">{formatCharacter(char)}</span>
        </span>
      ))}
      <span className="sr-only">{text}</span>
    </span>
  );
}
