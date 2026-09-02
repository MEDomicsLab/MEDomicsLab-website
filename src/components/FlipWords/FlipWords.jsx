import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { cn } from "../../lib/utils";

const FlipWords = React.forwardRef(function FlipWords(
  {
    words,
    duration = 3000,
    letterDelay = 0.05,
    wordDelay = 0.3,
    exitScale = 2,
    className,
    ...props
  },
  ref
) {
  const localRef = React.useRef(null);
  React.useImperativeHandle(ref, () => localRef.current);

  const wordsKey = React.useMemo(() => words.join("||"), [words]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const currentWord = words[currentIndex] ?? "";

  React.useEffect(() => {
    if (!words.length) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);

    return () => clearInterval(intervalId);
  }, [duration, words.length, wordsKey]);

  React.useEffect(() => {
    if (currentIndex >= words.length) {
      setCurrentIndex(0);
    }
  }, [currentIndex, words.length, wordsKey]);

  if (!words.length) {
    return null;
  }

  return (
    <span data-slot="flip-words" ref={localRef} {...props}>
      <AnimatePresence>
        <motion.span
          animate={{
            opacity: 1,
            y: 0,
          }}
          className={cn(
            "inline-block relative text-left px-2 will-change-transform will-change-opacity will-change-filter",
            className
          )}
          exit={{
            opacity: 0,
            y: -40,
            x: 40,
            filter: "blur(8px)",
            scale: exitScale,
            position: "absolute",
          }}
          initial={{
            opacity: 0,
            y: 10,
          }}
          key={currentWord}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
        >
          {currentWord.split(" ").map((word, wordIndex) => (
            <motion.span
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="inline-block whitespace-nowrap"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              key={`${word}-${wordIndex}`}
              transition={{
                delay: wordIndex * wordDelay,
                duration: 0.3,
              }}
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  className="inline-block will-change-transform will-change-opacity will-change-filter"
                  initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                  key={`${word}-${letterIndex}`}
                  transition={{
                    delay: wordIndex * wordDelay + letterIndex * letterDelay,
                    duration: 0.2,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
              <span className="inline-block">&nbsp;</span>
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

export default FlipWords;
