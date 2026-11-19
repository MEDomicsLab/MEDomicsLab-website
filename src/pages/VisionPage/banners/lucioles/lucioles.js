import { seeded, stage } from "../shared/canvas.js";
import { mountLandscape } from "../shared/landscape.js";
import { mountDistantButterflies } from "../shared/horizonButterflies.js";
import { composition } from "./scene.js";
import { plan } from "./shore.js";

const groves = [0.13, 0.22, 0.68, 0.8];

const TAU = Math.PI * 2;

function oval(ctx, x, y, rx, ry, ink) {
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  ctx.fill();
}

function wash(ctx, x, y, radius, stops) {
  const paint = ctx.createRadialGradient(x, y, 0, x, y, radius);
  for (const [at, ink] of stops) paint.addColorStop(at, ink);
  ctx.fillStyle = paint;
  ctx.fillRect(x - radius, y - radius, 2 * radius, 2 * radius);
}

export function mount(host, context) {
  const opening = new ResizeObserver(() => {
    host.style.setProperty("--copy-w", context.words.clientWidth * 0.6 + 40 + "px");
    host.style.setProperty(
      "--copy-h",
      context.words.offsetTop + context.words.clientHeight + 24 + "px"
    );
  });
  opening.observe(context.words);
  const releaseLand = mountLandscape(host, "lucioles", composition);
  const random = seeded(1806);
  const lights = Array.from({ length: 64 }, () => ({
    u: random(),
    lift: random(),
    phase: random() * 8,
    size: 0.65 + random() ** 2 * 1.3,
    speed: 0.5 + random() * 1.4,
  }));
  let shore;
  const releaseLights = stage(host, {
    still: context.reducedMotion,
    layout({ width, height }) {
      shore = plan(width, height, context.words.offsetTop + context.words.offsetHeight);
    },
    draw({ ctx, width, height, pixels, time }) {
      if (!width || !height) return;
      ctx.save();
      ctx.setTransform(pixels, 0, 0, pixels, 0, 0);
      ctx.clearRect(0, 0, width, height);
      for (const light of lights.slice(0, Math.min(64, Math.round(width / 16) + 9))) {
        const { u, lift, phase, size, speed } = light;
        const x = u * width + 7 * Math.sin(phase + time * 0.45);
        const y =
          shore.bank(x) - 5 - shore.room * 0.39 * lift ** 2 + 5 * Math.cos(phase + time * 0.61);
        const glow = (0.5 + 0.5 * Math.sin(time * speed + phase)) ** 3;
        ctx.globalAlpha = 0.1 + 0.9 * glow;
        wash(ctx, x, y, size * 7, [
          [0, "#f9ffbdcc"],
          [0.18, "#e4f88877"],
          [1, "#cae67a00"],
        ]);
        oval(ctx, x, y, size, size * 0.8, "#ffffcd");
        if (lift > 0.5 && y < shore.bank(x) - 12) {
          ctx.globalAlpha = glow * 0.36;
          oval(ctx, x, shore.bank(x) - 3 - glow * 4, size * 3, 0.55, "#cedc81");
        }
      }
      ctx.restore();
    },
  });
  const flight = mountDistantButterflies(
    host,
    context,
    (u) => {
      const crown = Math.max(shore.near(u * shore.w), shore.water - 0.075 * shore.room);
      return crown / shore.h;
    },
    (row) => groves[row]
  );
  return () => {
    flight();
    opening.disconnect();
    releaseLights();
    releaseLand();
  };
}
