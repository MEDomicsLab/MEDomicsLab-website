import { useEffect, useRef } from "react";
import "./WavyFrame.css";
import { wavyFramePath } from "./wavyFramePath.js";

export default function WavyFrame({
  as: Element = "div",
  children,
  className = "",
  wavelength = 25,
  depth = 5,
  ...props
}) {
  const frame = useRef(null);
  useEffect(() => {
    const element = frame.current;
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];
      if (width <= 0 || height <= 0) return;
      element.style.setProperty(
        "--wavy-frame-outline",
        `path("${wavyFramePath(width, height, Math.max(4, wavelength), Math.max(0, depth))}")`
      );
    });
    observer.observe(element, { box: "border-box" });
    return () => observer.disconnect();
  }, [wavelength, depth]);

  return (
    <Element ref={frame} className={`wavy-frame ${className}`} {...props}>
      {children}
    </Element>
  );
}
