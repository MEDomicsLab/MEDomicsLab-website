import { useLayoutEffect, useRef } from "react";
import LiquidGlass from "liquid-glass-react";
import { cn } from "../../lib/utils";
import "./GlassSurface.css";

export default function GlassSurface({
  children,
  className,
  style,
  padding,
  cornerRadius,
  ...props
}) {
  if (import.meta.env.SSR) {
    return (
      <div
        className={className}
        style={{
          ...style,
          padding,
          borderRadius: cornerRadius,
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <LiquidGlass
      {...props}
      className={className}
      style={style}
      padding={padding}
      cornerRadius={cornerRadius}
    >
      {children}
    </LiquidGlass>
  );
}

/**
 * Keep LiquidGlass's rims on the surface and fade every layer together. The
 * library sizes its sibling rims only on window resize and eases them 200ms
 * behind the surface; an ancestor's opacity (or a box that isolates their
 * blending) would flatten the backdrop blur, so this group renders no box and
 * fades each layer through `--glass-opacity`.
 */
export function GlassFrame({ className, surfaceClassName, children, ...glass }) {
  const frame = useRef(null);
  useLayoutEffect(() => {
    const host = frame.current;
    const surface = host.querySelector(":scope > .glass-frame__surface");
    const fit = () => {
      host.style.setProperty("--glass-width", `${surface.offsetWidth}px`);
      host.style.setProperty("--glass-height", `${surface.offsetHeight}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={frame} className={cn("glass-frame", className)}>
      <GlassSurface {...glass} className={cn("glass-frame__surface", surfaceClassName)}>
        {children}
      </GlassSurface>
    </div>
  );
}
