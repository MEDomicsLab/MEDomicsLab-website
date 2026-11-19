import { mountDistantButterflies } from "../shared/horizonButterflies.js";
import { mountSky } from "./sky.js";

// The two spruce islands and the wooded point on the right of the original painting.
// Each pair stays by a grove that is visible through the current crop.
const wideGroves = [0.449, 0.482, 0.761, 0.793];
const narrowGroves = [0.373, 0.399, 0.451, 0.485];

export function mount(host, context) {
  let stopFlight;
  let view;
  function groveX(row) {
    const farPointVisible = view.originX + view.cropX > 0.84;
    const anchors = farPointVisible ? wideGroves : narrowGroves;
    return (anchors[row] - view.originX) / view.cropX;
  }
  function treeline(x) {
    const sourceX = view.originX + x * view.cropX;
    // The small western island is shallower. Both larger groves rise toward their centre.
    let crown = 0.827;
    if (sourceX > 0.42 && sourceX < 0.6) crown = 0.796 + Math.abs(sourceX - 0.475) * 0.39;
    if (sourceX >= 0.6) crown = 0.799 + Math.abs(sourceX - 0.782) * 0.32;
    return (crown - view.originY) / view.cropY;
  }
  const stopSky = mountSky(host, context, (nextView) => {
    view = nextView;
    // Match the still image to the shader so its treetops also anchor the flock without WebGL.
    host.style.backgroundSize = `${100 / view.cropX}% ${100 / view.cropY}%`;
    host.style.backgroundPosition = "37% 86%";
    stopFlight ??= mountDistantButterflies(host, context, treeline, groveX);
  });
  return () => {
    stopFlight?.();
    stopSky();
    host.style.removeProperty("background-size");
    host.style.removeProperty("background-position");
  };
}
