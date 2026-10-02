import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GlassFrame } from "../GlassSurface/GlassSurface.jsx";
import { cn } from "../../lib/utils";
import { NAV_TEXT_CLASS, NAV_MIXED_CASE_TEXT_CLASS } from "./NavDropdown.jsx";

export default function AnimatedShortcut({
  label,
  labelSuffix,
  accessibleName,
  icon,
  href,
  to,
  liquid,
  className,
  surfaceClassName,
  style,
  onActivity,
}) {
  const Element = to ? Link : "a";
  const destination = to ? { to } : { href, target: "_blank", rel: "noreferrer" };
  return (
    <GlassFrame
      {...liquid.nav}
      padding="0px"
      className={cn("liquid-action-anchor", className)}
      surfaceClassName={surfaceClassName}
      style={{ position: "fixed", zIndex: 50, ...style }}
    >
      <Element
        {...destination}
        aria-label={accessibleName}
        className={cn(NAV_TEXT_CLASS, NAV_MIXED_CASE_TEXT_CLASS, "nav-action-link")}
        onPointerEnter={onActivity}
        onPointerDown={onActivity}
        onFocus={onActivity}
        onBlur={onActivity}
      >
        <span className="nav-action-slide">
          <span className="nav-action-slide__icon" aria-hidden="true">
            {icon}
          </span>
          <span className="nav-action-slide__text">
            {label}
            {labelSuffix && <span className="nav-action-slide__suffix">{labelSuffix}</span>}
          </span>
          <span className="nav-action-slide__arrow" aria-hidden="true">
            <ArrowRight />
          </span>
        </span>
      </Element>
    </GlassFrame>
  );
}
