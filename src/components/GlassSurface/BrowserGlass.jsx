import { Vaso } from "vaso";
import GlassSurface, { GlassFrame } from "./GlassSurface.jsx";
import { isChromiumEngine } from "../../lib/glassRenderer.js";
import { LIQUID_PARAMS } from "../../lib/liquidGlassParams.js";
import { cn } from "../../lib/utils.js";

export default function BrowserGlass({ surface, children, className, style, ...props }) {
  if (isChromiumEngine()) {
    return (
      <Vaso {...props} className={className} style={style}>
        {children}
      </Vaso>
    );
  }

  if (surface === "hover") {
    const glass = LIQUID_PARAMS.tabHighlight;
    return (
      <div
        className={cn(className, "legacy-hover-glass")}
        style={{
          backdropFilter: `blur(${glass.blurAmount}px) saturate(${glass.saturation}%)`,
          WebkitBackdropFilter: `blur(${glass.blurAmount}px) saturate(${glass.saturation}%)`,
          backgroundColor: `rgba(255, 255, 255, ${glass.tintOpacity * glass.opacity})`,
          borderRadius: glass.cornerRadius,
          boxShadow: [
            `0 0 0 0.5px rgba(255, 255, 255, ${glass.borderOpacity * glass.opacity}) inset`,
            `0 1px 2px rgba(255, 255, 255, ${glass.innerHighlightOpacity * glass.opacity}) inset`,
            `0 4px 14px rgba(0, 0, 0, ${glass.shadowOpacity * glass.opacity})`,
          ].join(", "),
          ...style,
        }}
      >
        {children}
      </div>
    );
  }

  const { padding = "0px", transform: _transform, ...position } = style ?? {};
  const legacyClassName = className?.replace(/\bmedomics-glass\b/g, "");
  if (surface === "community") {
    return (
      <GlassSurface
        {...LIQUID_PARAMS.communityModal}
        padding={padding}
        className={legacyClassName}
        style={position}
      >
        {children}
      </GlassSurface>
    );
  }
  return (
    <GlassFrame
      {...LIQUID_PARAMS.nav}
      padding={padding}
      surfaceClassName={legacyClassName}
      style={position}
    >
      {children}
    </GlassFrame>
  );
}
