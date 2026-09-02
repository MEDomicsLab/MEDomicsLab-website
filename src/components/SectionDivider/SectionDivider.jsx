import { cn } from "../../lib/utils";

const TONE_CLASSES = {
  primary: {
    label: "text-primary font-mono text-xl md:text-2xl font-bold",
    line: "h-[1px] flex-1 bg-border",
  },
  muted: {
    label: "text-xs uppercase tracking-widest text-muted-foreground",
    line: "h-[1px] flex-1 bg-border/60",
  },
};

export default function SectionDivider({
  label,
  tone = "primary",
  bracketed = true,
  className,
  labelClassName,
  lineClassName,
}) {
  const styles = TONE_CLASSES[tone] ?? TONE_CLASSES.primary;
  const display = bracketed && tone === "primary" ? `[${label}]` : label;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className={cn(styles.label, labelClassName)}>{display}</span>
      <div className={cn(styles.line, lineClassName)} />
    </div>
  );
}
