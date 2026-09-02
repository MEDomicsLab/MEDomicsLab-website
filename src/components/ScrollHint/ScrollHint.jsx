import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export default function ScrollHint({ label = "Scroll Down", bounce = false, className, ...props }) {
  return (
    <motion.div
      className={cn(
        "text-white/60 text-xs uppercase tracking-widest",
        bounce && "animate-bounce",
        className
      )}
      aria-hidden="true"
      {...props}
    >
      {label}
    </motion.div>
  );
}
