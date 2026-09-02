import { motion, useInView } from "framer-motion";
import { useMemo, useRef } from "react";

export default function WritingText({
  inView = false,
  inViewMargin = "0px",
  inViewOnce = true,
  spacing = 5,
  text,
  transition = { type: "spring", bounce: 0, duration: 2, delay: 0.5 },
  ...props
}) {
  const localRef = useRef(null);
  const inViewResult = useInView(localRef, {
    once: inViewOnce,
    margin: inViewMargin,
  });
  const isInView = !inView || inViewResult;

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <span data-slot="writing-text" ref={localRef} {...props}>
      {words.map((word, index) => (
        <motion.span
          animate={isInView ? { opacity: 1, y: 0 } : undefined}
          className="inline-block will-change-transform will-change-opacity"
          initial={{ opacity: 0, y: 10 }}
          key={`${word}-${index}`}
          style={{ marginRight: spacing }}
          transition={{
            ...transition,
            delay: index * (transition?.delay ?? 0),
          }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </span>
  );
}
