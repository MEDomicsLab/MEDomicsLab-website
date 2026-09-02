import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import HoverArrow from "../HoverArrow/HoverArrow.jsx";

const VARIANT_STYLES = {
  compact: {
    wrapper: "border-t border-border py-6",
    layout: "flex items-baseline justify-between gap-4",
    title: "text-lg font-bold uppercase tracking-tight",
    arrow:
      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 text-primary",
  },
  detailed: {
    wrapper: "border-b border-border/50 py-8",
    layout: "grid grid-cols-1 md:grid-cols-12 gap-6 items-baseline",
    title: "text-xl md:text-2xl font-bold leading-tight mt-1",
    arrow: "w-6 h-6 text-primary",
  },
};

const BASE_WRAPPER = "group block pl-[5px] hover:bg-white/5 transition-colors relative";

function ResolveAnchor({ to, href, target, rel, children, className, ...rest }) {
  if (to) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={target ?? "_blank"}
      rel={rel ?? "noreferrer"}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
}

export default function EntryRow({
  to,
  href,
  target,
  rel,
  variant = "compact",
  className,
  children,
  hideArrow = false,
  arrowClassName,
  arrowWrapperClassName,
  ...rest
}) {
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.compact;

  return (
    <ResolveAnchor
      to={to}
      href={href}
      target={target}
      rel={rel}
      className={cn(BASE_WRAPPER, styles.wrapper, className)}
      {...rest}
    >
      <div className={styles.layout}>
        {children}
        {!hideArrow && (
          <div
            className={cn(
              variant === "detailed" ? "md:col-span-2 flex justify-end" : "flex-shrink-0",
              arrowWrapperClassName
            )}
          >
            {variant === "detailed" ? (
              <span className="inline-flex items-center text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                <HoverArrow className={cn(styles.arrow, arrowClassName)} />
              </span>
            ) : (
              <HoverArrow className={cn(styles.arrow, arrowClassName)} />
            )}
          </div>
        )}
      </div>
    </ResolveAnchor>
  );
}

export function EntryRowBody({ variant = "compact", className, children }) {
  if (variant === "detailed") {
    return <div className={cn("md:col-span-10 space-y-2", className)}>{children}</div>;
  }
  return <div className={cn("space-y-1", className)}>{children}</div>;
}

export function EntryRowTitle({ variant = "compact", className, children, ...rest }) {
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.compact;
  return (
    <h3
      className={cn(styles.title, "group-hover:text-primary transition-colors", className)}
      {...rest}
    >
      {children}
    </h3>
  );
}
