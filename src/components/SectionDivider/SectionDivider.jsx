import { cn } from "../../lib/utils";

export default function SectionDivider({ label, className }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="text-primary">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
