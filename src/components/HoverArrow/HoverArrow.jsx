import { ArrowUpRight, ArrowRight, ArrowDown } from "lucide-react";
import { cn } from "../../lib/utils";

const VARIANTS = {
  rotate: {
    Icon: ArrowUpRight,
    motion: "group-hover:rotate-45 hover:rotate-45",
  },
  slide: {
    Icon: ArrowRight,
    motion: "group-hover:translate-x-1 hover:translate-x-1",
  },
  "slide-up-right": {
    Icon: ArrowUpRight,
    motion:
      "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 hover:-translate-y-0.5 hover:translate-x-0.5",
  },
  drop: {
    Icon: ArrowDown,
    motion: "group-hover:translate-y-1 hover:translate-y-1",
  },
};

const SIZES = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export default function HoverArrow({ variant = "rotate", size = "sm", className, ...props }) {
  const { Icon, motion } = VARIANTS[variant] ?? VARIANTS.rotate;
  const sizeClass = SIZES[size] ?? size;

  return (
    <Icon
      className={cn("transition-transform duration-300 ease-out", motion, sizeClass, className)}
      {...props}
    />
  );
}
