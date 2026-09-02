import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "../../lib/utils";

export default function ShimmeringText({
  text,
  duration = 1,
  transition,
  wave = false,
  className,
  color = "var(--color-neutral-500)",
  shimmeringColor = "var(--color-neutral-300)",
  inView = true,
  inViewMargin = "0px",
  inViewOnce = true,
  animate = true,
  ...props
}) {
  const localRef = useRef(null);
  const isInView = useInView(localRef, { once: inViewOnce, margin: inViewMargin });
  const shouldAnimate = animate && (!inView || isInView);

  return (
    <motion.span
      className={cn("relative inline-block [perspective:500px]", className)}
      style={{
        "--shimmering-color": shimmeringColor,
        "--color": color,
        color: "var(--color)",
      }}
      ref={localRef}
      {...props}
    >
      {text?.split("")?.map((char, i) => (
        <motion.span
          animate={
            shouldAnimate
              ? {
                  ...(wave
                    ? {
                        x: [0, 5, 0],
                        y: [0, -5, 0],
                        scale: [1, 1.1, 1],
                        rotateY: [0, 15, 0],
                      }
                    : {}),
                  color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
                }
              : undefined
          }
          className="inline-block whitespace-pre [transform-style:preserve-3d]"
          initial={{
            ...(wave
              ? {
                  scale: 1,
                  rotateY: 0,
                }
              : {}),
            color: "var(--color)",
          }}
          key={`${char}-${i}`}
          transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            repeatDelay: text.length * 0.05,
            delay: (i * duration) / text.length,
            ease: "easeInOut",
            ...transition,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
}
