import { ArrowRight } from "lucide-react";
import { useLinkClickHandler } from "react-router-dom";
import { Vaso } from "vaso";
import { GlassFrame } from "../GlassSurface/GlassSurface.jsx";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams.js";
import { isChromiumEngine } from "../../lib/glassRenderer.js";
import { VASO_GLASS } from "../../lib/vasoPresets.js";
import { cn } from "../../lib/utils";
import { NAV_TEXT_CLASS, NAV_MIXED_CASE_TEXT_CLASS } from "./NavDropdown.jsx";

export default function AnimatedShortcut({
  label,
  labelSuffix,
  accessibleName,
  icon,
  href,
  to,
  className,
  surfaceClassName,
  style,
  onActivity,
}) {
  const handleLinkClick = useLinkClickHandler(to || "/");
  const destination = to
    ? { href: to, onClick: handleLinkClick }
    : { href, target: "_blank", rel: "noreferrer" };
  const link = (
    <a
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
    </a>
  );
  if (!isChromiumEngine()) {
    return (
      <GlassFrame
        {...LIQUID_PARAMS.nav}
        padding="0px"
        className={cn("liquid-action-anchor", className)}
        surfaceClassName={surfaceClassName}
        style={{ position: "fixed", zIndex: 50, ...style }}
      >
        {link}
      </GlassFrame>
    );
  }
  return (
    <div className={cn("liquid-action-anchor", className)}>
      <div
        className={cn("shortcut-position", surfaceClassName)}
        style={{ position: "fixed", zIndex: 50, transform: "translate(-50%, -50%)", ...style }}
      >
        <Vaso {...VASO_GLASS.buttons} className="shortcut-glass medomics-glass">
          {link}
        </Vaso>
      </div>
    </div>
  );
}
