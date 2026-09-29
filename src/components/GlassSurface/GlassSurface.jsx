import LiquidGlass from "liquid-glass-react";

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
