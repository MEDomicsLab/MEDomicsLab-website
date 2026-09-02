import SectionTicks from "../SectionTicks/SectionTicks.jsx";
import { cn } from "../../lib/utils";

export function PageTitle({ as: Tag = "h1", className, children, ...rest }) {
  return (
    <Tag
      className={cn(
        "text-6xl md:text-9xl font-bold tracking-tighter uppercase leading-none",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default function PageShell({
  ticks,
  children,
  className,
  contentClassName,
  outerClassName,
}) {
  return (
    <div
      className={cn(
        "container mx-auto px-4 md:px-8 py-24 min-h-screen flex relative",
        outerClassName,
        className
      )}
    >
      {ticks ? <SectionTicks {...ticks} /> : null}
      <div className={cn("w-full lg:pl-32", contentClassName)}>{children}</div>
    </div>
  );
}
