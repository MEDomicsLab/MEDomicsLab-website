import SectionTicks from "../SectionTicks/SectionTicks.jsx";
import { cn } from "../../lib/utils";

export function PageTitle({ as: Tag = "h1", className, children, ...rest }) {
  return (
    <Tag className={cn("page-title", className)} {...rest}>
      {children}
    </Tag>
  );
}

export default function PageShell({ ticks, children, className }) {
  return (
    <div
      className={cn(
        "page-shell container mx-auto px-4 md:px-8 min-h-screen flex relative",
        className
      )}
    >
      {ticks ? <SectionTicks {...ticks} /> : null}
      <div className="page-shell-content w-full">{children}</div>
    </div>
  );
}
