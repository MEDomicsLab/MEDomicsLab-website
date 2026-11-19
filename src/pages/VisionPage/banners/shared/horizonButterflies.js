import { stage } from "./canvas.js";
import { withPlate } from "./texture.js";
import atlas from "./horizon-butterflies.webp";

// Each row of the atlas contains one wingbeat for one butterfly.
const flock = [
  { start: 0.18, size: 0.85, pace: 0.92, height: 0.04, seed: 0.13 },
  { start: 0.41, size: 1, pace: 1.1, height: 0.065, seed: 0.46 },
  { start: 0.65, size: 0.68, pace: 0.85, height: 0.025, seed: 0.79 },
  { start: 0.82, size: 0.76, pace: 1.03, height: 0.095, seed: 0.31 },
];
const frames = 24;
const turn = Math.PI * 2;

// A smaller, cooler copy gives distant wings the colour of the air between
// the observer and the trees. Each cell still contains the original wing pose.
let distantPlate;
function throughHaze(original) {
  if (distantPlate) return distantPlate;
  const atlas = document.createElement("canvas");
  atlas.width = frames * 36;
  atlas.height = flock.length * 36;
  const ctx = atlas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(original, 0, 0, atlas.width, atlas.height);
  const image = ctx.getImageData(0, 0, atlas.width, atlas.height);
  const rgba = image.data;
  for (let i = 0; i < rgba.length; i += 4) {
    const grey = rgba[i] * 0.21 + rgba[i + 1] * 0.72 + rgba[i + 2] * 0.07;
    rgba[i] = rgba[i] * 0.64 + grey * 0.31 + 3;
    rgba[i + 1] = rgba[i + 1] * 0.64 + grey * 0.32 + 6;
    rgba[i + 2] = rgba[i + 2] * 0.64 + grey * 0.34 + 12;
  }
  ctx.putImageData(image, 0, 0);
  distantPlate = atlas;
  return atlas;
}

export function mountDistantButterflies(host, context, treeline, groveX) {
  return mountFlight(host, context, treeline, groveX);
}

export function mountHorizonButterflies(host, context, horizon = 0.76) {
  return mountFlight(host, context, horizon);
}

function mountFlight(host, { reducedMotion }, horizon, groveX) {
  return withPlate(atlas, (original) => {
    const plate = groveX ? throughHaze(original) : original;
    const cell = plate.width / frames;
    const phases = [0.02, 0.68, 0.85, 0.44];
    const previous = [];
    return stage(host, {
      still: reducedMotion,
      stillTime: 0,
      maxPixels: 1.75,
      layout({ canvas }) {
        canvas.classList.add("horizon-butterfly-flight");
        if (groveX) canvas.classList.add("distant-butterfly-flight");
        previous.length = 0;
      },
      draw({ ctx, width, height, pixels, time, delta, pointer }) {
        ctx.setTransform(pixels, 0, 0, pixels, 0, 0);
        for (const area of previous) ctx.clearRect(...area);
        previous.length = 0;

        const largest = groveX
          ? Math.min(17, Math.max(11.5, width * 0.012 + 4))
          : Math.min(44, Math.max(26, width * 0.032));
        const travel = width + 2 * largest;
        flock.forEach(({ start, size, pace, height: lift, seed }, row) => {
          const span = largest * size;
          let x,
            drift,
            facing = 1;
          if (groveX) {
            // A little circuit over each crown. Neighbours turn independently
            // and their wings briefly foreshorten as they change direction.
            drift = time * (0.37 + seed * 0.13) + seed * 17;
            const orbit = time * pace * 0.29 + seed * 11.7 + 0.7;
            const radius = Math.min(25, Math.max(9, width * 0.022));
            x = groveX(row, width, height) * width + Math.sin(orbit) * radius;
            facing = Math.tanh(3.4 * Math.cos(orbit));
          } else {
            x = ((start * travel + time * pace * (22 + width * 0.019)) % travel) - largest;
            drift = time * (0.72 + seed * 0.16) + seed * 23;
          }
          const across = Math.max(0, Math.min(1, x / width));
          const shore = typeof horizon === "function" ? horizon(across, width, height) : horizon;
          const liftPx = groveX ? 2.5 + lift * 79 : height * lift;
          const y = height * shore - liftPx + Math.sin(drift) * span * 0.28;
          const near =
            !groveX && pointer.inside && !reducedMotion
              ? Math.exp(-((x - pointer.x) ** 2 + (y - pointer.y) ** 2) / 3600)
              : 0;
          // The original alternates quick strokes and glides. Ease into an
          // open-wing pose between bursts and let the flight path bank gently.
          const glide = Math.max(0, Math.min(1, (-Math.sin(drift * 1.3) - 0.47) / 0.38));
          const toOpen = ((0.75 - phases[row] + 1.5) % 1) - 0.5;
          const rate = 3.4 * (0.85 + seed * 0.3) * (1 - glide) + 5 * glide * toOpen;
          phases[row] = (phases[row] + delta * rate + 1) % 1;
          const frame = Math.floor(phases[row] * frames);
          const cy = y - near * 12 - Math.cos(turn * phases[row]) * (1 - glide) * span * 0.032;
          ctx.save();
          ctx.translate(x, cy);
          ctx.rotate(0.075 * Math.cos(drift) - near * 0.12);
          if (groveX) ctx.scale(facing, 1);
          ctx.globalAlpha = groveX ? 0.39 + size * 0.33 : 0.76 + size * 0.2;
          ctx.drawImage(
            plate,
            frame * cell,
            row * cell,
            cell,
            cell,
            -span / 2,
            -span * 0.55,
            span,
            span
          );
          ctx.restore();
          previous.push([x - span, cy - span, span * 2, span * 2]);
        });
      },
    });
  });
}
