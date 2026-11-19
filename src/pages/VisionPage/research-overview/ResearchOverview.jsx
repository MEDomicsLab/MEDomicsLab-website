import vision from "../../../data/vision.json";
import VisionFigure from "../shared/VisionFigure.jsx";
import ProgramFigure from "./ProgramFigure.jsx";

export default function ResearchOverview() {
  return (
    <VisionFigure
      label="The long-term research vision"
      className="vision-program-figure"
      {...vision.figures.program}
    >
      <ProgramFigure domains={vision.domains} />
    </VisionFigure>
  );
}
