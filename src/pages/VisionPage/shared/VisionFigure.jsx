import { cn } from "../../../lib/utils";
import useReveal from "./useReveal.js";
import "./VisionFigure.css";

export default function VisionFigure({ title, caption, label, className, children }) {
  const ref = useReveal();

  return (
    <figure ref={ref} className={cn("vision-figure", className)} aria-label={label} data-reveal="">
      {children}
      <figcaption>
        <b>{title}</b> {caption}
      </figcaption>
    </figure>
  );
}
