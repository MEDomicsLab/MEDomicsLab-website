// the places across the stage the sheets' edges are drawn through, as the pricing horizon's are
const ACROSS = Array.from({ length: 129 }, (_, i) => -1.6 + (3.2 * i) / 128);

// How far the sun is up when nothing moves (reduced motion): a little more than half out of the water.
const STILL_RISE = 0.62;

export function aubeMode(k, { host, still, onSun }) {
  const { PRICING, LINES, LAND_INK, STIR, PAINTS, clamp, smooth } = k;

  // a slow swell along a line, `high` CSS pixels either way over `long` of them, in the stage's own units
  const swell = (stage, x, high, long, phase = 0) =>
    (high / stage.room) * Math.sin(((x * stage.w) / 2 / long) * Math.PI * 2 + phase);
  // the far edge of the water, which the sky's foot, the sea's top and the shore's feet are laid along
  const horizon = (stage, x, lift = 0) => lift + swell(stage, x, 1.5, 1900, 0.9);
  const along = (stage, curve) => ACROSS.map((x) => [x, curve(x)]);

  const sunRadius = (w) => clamp(w * 0.068, 27, 104);
  const sunAcross = (w) => (w < 700 ? 0.3 : 0.24);
  let rise = STILL_RISE;
  const riseNow = () => {
    if (still) return STILL_RISE;
    const box = host.getBoundingClientRect();
    const through = clamp((innerHeight - box.top) / (innerHeight + box.height), 0, 1);
    return smooth(0.1, 0.86, through);
  };

  const dome = (x, at, wide, high) => {
    const d = (x - at) / wide;
    return Math.abs(d) >= 1 ? 0 : high * (1 - d * d) ** 1.35;
  };
  // the highest dome at a place, with a little of the others, so the saddles between them stay round
  const range = (domes) => (x) => {
    let most = 0;
    let sum = 0;
    for (const [at, wide, high] of domes) {
      const h = dome(x, at, wide, high);
      most = Math.max(most, h);
      sum += h;
    }
    return most + 0.22 * (sum - most);
  };
  const FAR = range([
    [-1.34, 0.44, 0.7],
    [-0.88, 0.48, 1],
    [-0.44, 0.42, 0.78],
    [-0.1, 0.3, 0.42],
    [0.06, 0.12, 0.08],
  ]);
  const NEAR = range([
    [-1.5, 0.36, 0.6],
    [-1.08, 0.44, 0.8],
    [-0.66, 0.38, 0.62],
    [-0.32, 0.3, 0.44],
    [-0.06, 0.18, 0.16],
  ]);
  // a range's height in CSS pixels: shares of the sea's room, a little flatter on a phone
  const hillScale = (stage) => clamp(0.55 + (0.45 * stage.w) / 1232, 0.7, 1.05);
  const farTop = (stage) => {
    const high = stage.room * 0.34 * hillScale(stage);
    return ACROSS.filter((x) => x <= 0.2).map((x) => [
      x,
      horizon(stage, x) - (high * FAR(x)) / stage.room,
    ]);
  };
  const nearTop = (stage) => {
    const high = stage.room * 0.2 * hillScale(stage);
    return ACROSS.filter((x) => x <= 0.1).map((x) => [
      x,
      horizon(stage, x) - (high * NEAR(x)) / stage.room,
    ]);
  };
  const shoreFoot = (to) => (stage) =>
    ACROSS.filter((x) => x <= to).map((x) => [x, horizon(stage, x, 0.014)]);
  const POINT_FROM = 0.56;
  const point = (x) => smooth(POINT_FROM, 0.8, x) * (0.84 + 0.16 * Math.sin((x - 0.62) * 7.3));
  const pointTop = (stage) => {
    const high = stage.room * 0.085 * hillScale(stage);
    return ACROSS.filter((x) => x >= POINT_FROM - 0.02).map((x) => [
      x,
      horizon(stage, x) - (high * point(x)) / stage.room,
    ]);
  };

  const sea = (stage) => {
    const r = sunRadius(stage.w);
    return { at: [sunAcross(stage.w), 0.36], half: [(r * 0.62) / (stage.w / 2), 0.62] };
  };

  return {
    ...PRICING,
    // nothing to keep clear: the banner holds no words
    words: null,
    // built in idle time from the moment it is bound, as the tree is, and hurried once within a screen
    wake: "idle",
    near: "100% 0px",
    // the lines shoot in once, from the left, the first time the banner is reached
    lines: {
      ...LINES,
      lift: 0.15,
      veil: [0, 0],
      veilCore: 0.5,
      sink: 64,
      introMs: 800,
      whole: true,
    },
    inks: {
      ...LAND_INK,
      night: ["#c4d6f1", "#0e214d"],
      zenith: ["#a7c2ec", "#163170"],
      deep: ["#8eb1e6", "#1f4387"],
      quebec: ["#7aa3e0", "#2b5aa6"],
      azure: ["#8fb6e8", "#4b81c9"],
      blue: ["#a6c6ef", "#77a4da"],
      pale: ["#cfe0f4", "#aac5e6"],
      ice: ["#e7eff9", "#d5e3f2"],
      // the warmth round the sun, kept to its own corner of the sky
      dawn: ["#efe7d0", "#c9d2d8"],
      straw: ["#f4e6bb", "#eadbac"],
      paleGold: ["#f6e1a6", "#f2d996"],
      gold: ["#f3cf7d", "#efc877"],
      apricot: ["#f3c290", "#efbe8a"],
      // the water: ice under the far edge, then the blues in stripes that run through each other, deepening to us
      shine: ["#dfe9f5", "#c9dbef"],
      seaPale: ["#a9c6ea", "#8fb2e0"],
      seaHigh: ["#86aee2", "#5f8fd0"],
      sea: ["#6f9bdc", "#3f73c0"],
      seaDeep: ["#4f80cc", "#2a5aa6"],
      seaNight: ["#3a68b6", "#1b4086"],
      seaFoot: ["#2d589f", "#132f68"],
      // the sun's road on the water
      sunWater: ["#f7e4ac", "#f3dea4"],
      sunWaterLow: ["#e6dcb4", "#d8d3b2"],
      // the far edge of the water, ice with the sun's gold where it comes up
      rim: ["#f2f6fb", "#e8f0f8"],
      rimLow: ["#d6e4f4", "#b9cfea"],
      // the hills: the far range in haze, its crest catching the first light; the near range deeper; spruce on both
      crest: ["#cbd9ee", "#a8bde0"],
      crestLit: ["#f3e3b4", "#e9d7a2"],
      farHill: ["#8ba5d4", "#5874aa"],
      farShade: ["#7894c8", "#4a659b"],
      nearHill: ["#6582bd", "#334f88"],
      nearShade: ["#55729f", "#283f71"],
      spruce: ["#4c6a8a", "#1f3a5a"],
      // the mist on the water at their foot
      mist: ["#eef4fb", "#d6e3f2"],
      // the lines of the water the pointer has just ruffled catch the light
      sheen: ["#f4f8fd", "#dbe8f6"],
      sunCore: ["#fffbf1", "#fff8e8"],
      sunFace: ["#fdf0c8", "#fbebbd"],
      sunRim: ["#f6d98e", "#f4d283"],
      sunGlow: ["#f3c992", "#f1c38a"],
      sunHalo: ["#efe4c2", "#e6dcb8"],
    },
    glow: {
      place: (stage) => ({ at: [sunAcross(stage.w), -0.02], half: [0.46, 0.72] }),
      breathe: [0.06, 15],
    },
    waves: true,
    sun: {
      place: (stage) => {
        const r = sunRadius(stage.w);
        const { base } = stage;
        return {
          x: stage.w / 2 + sunAcross(stage.w) * (stage.w / 2),
          r,
          // read on every frame, so the sun climbs as the page is scrolled
          get y() {
            rise = riseNow();
            const y = base + r * (0.6 - 1.05 * rise);
            onSun?.(this.x, y, r);
            return y;
          },
        };
      },
      face: 0.86,
      halo: 0.55,
      rim: 0.1,
      // its light comes in a little under the canvas's top, so the top of the sky stays the page's
      rise: (stage) => [0, stage.h * 0.1],
      inks: ["sunCore", "sunFace", "sunRim", "sunGlow", "sunHalo"],
      // its face shines through the lines, its rim glows and its halo is a soft light on the sky round it
      light: [
        [0.5, 0.82],
        [0.45, 0.62],
        [0.3, 0.34],
      ],
      lines: [
        [0.8, 0.78],
        [0.6, 0.1],
      ],
      breathe: [0.05, 11],
    },
    fade: {
      at: (stage) => [stage.h * 0.02, stage.base * 0.62],
      ease: 1.5,
      pale: 0.55,
      sparse: 0.8,
      specks: 2.4,
    },
    land: {
      ...PRICING.land,
      // the land's line is the water's far edge, level across the stage, with the sky above it and the river below
      profile: [
        [-1.6, 0],
        [1.6, 0],
      ],
      crest: 0,
      relief: [1, 1],
      room: ({ h }) => h * 0.43,
      foot: 6,
      head: 0,
      least: 96,
      sheets: [
        {
          name: "air",
          top: (stage) =>
            along(
              stage,
              (x) =>
                (2 - stage.base) / stage.room +
                Math.max(
                  0,
                  (0.012 * stage.w * (1 - x)) / stage.room + swell(stage, x, 6, 1700, 0.6)
                )
            ),
          foot: (stage) => along(stage, (x) => horizon(stage, x, -0.008)),
          paint: [
            [0, "night", 0.08],
            [0.06, "night", 0.6],
            [0.14, "night", 0.95],
            [0.3, "zenith", 1],
            [0.46, "deep", 1],
            [0.6, "quebec", 1],
            [0.72, "azure", 1],
            [0.83, "blue", 1],
            [0.92, "pale", 1],
            [1, "ice", 1],
          ],
          glow: [
            [0, "night", 0.08],
            [0.06, "night", 0.6],
            [0.14, "night", 0.95],
            [0.3, "zenith", 1],
            [0.46, "deep", 1],
            [0.6, "azure", 1],
            [0.72, "dawn", 1],
            [0.82, "straw", 1],
            [0.9, "paleGold", 1],
            [0.97, "gold", 1],
            [1, "apricot", 1],
          ],
          glowTake: 1.25,
          sun: [1, 1],
          fade: true,
          fill: 0.6,
          under: 0.74,
          patch: 0.14,
          lean: 0.05,
          beads: [1, 0.55],
          flow: 0.55,
          breath: 3,
        },
        {
          name: "river",
          top: (stage) => along(stage, (x) => horizon(stage, x, -0.012)),
          foot: (stage) =>
            along(
              stage,
              (x) => 0.985 + swell(stage, x, 8, 900, 2.2) + swell(stage, x, 4, 430, 0.7)
            ),
          paint: [
            [0, "shine", 0.95],
            [0.05, "seaPale", 1],
            [0.14, "seaHigh", 1],
            [0.26, "sea", 1],
            [0.34, "seaHigh", 1],
            [0.44, "seaDeep", 1],
            [0.53, "sea", 1],
            [0.64, "seaNight", 1],
            [0.74, "seaDeep", 1],
            [0.84, "seaFoot", 0.85],
            [0.93, "seaFoot", 0.38],
            [1, "seaFoot", 0],
          ],
          glow: [
            [0, "sunWater", 0.95],
            [0.3, "sunWater", 1],
            [0.62, "sunWaterLow", 1],
            [0.84, "sunWaterLow", 0.8],
            [0.93, "sunWaterLow", 0.35],
            [1, "sunWaterLow", 0],
          ],
          glowAt: sea,
          get glowTake() {
            return 0.62 + 0.38 * rise;
          },
          shimmer: 1,
          fill: 0.62,
          under: 0.8,
          patch: 0.26,
          beads: [0.5, 0.32],
          flow: 0.3,
          breath: 2.2,
          sheen: 0.55,
          wave: [2.2, 760, 0.28, 1.3],
        },
        // The water's far edge: a thin bright line, ice across the river and gold where the sun comes up out of it.
        {
          name: "edge",
          opaque: true,
          laid: true,
          top: (stage) =>
            along(
              stage,
              (x) =>
                horizon(stage, x, -0.03) +
                swell(stage, x, 2, 1500, 2.1) +
                swell(stage, x, 1, 610, 0.3)
            ),
          foot: (stage) => along(stage, (x) => horizon(stage, x, 0.008)),
          paint: [
            [0, "rim", 0],
            [0.2, "rim", 0.7],
            [0.5, "rim", 1],
            [1, "rimLow", 1],
          ],
          glow: [
            [0, "paleGold", 0],
            [0.2, "gold", 0.8],
            [0.5, "sunRim", 1],
            [1, "gold", 1],
          ],
          glowAt: (stage) => ({
            at: [sunAcross(stage.w), 0],
            half: [(sunRadius(stage.w) * 1.4) / (stage.w / 2), 0.3],
          }),
          glowTake: 0.85,
          sun: [0.6, 0.5],
          fill: 0.72,
          under: 0.9,
          patch: 0.1,
          flow: 0.45,
          breath: 1.5,
        },
        {
          name: "far range",
          opaque: true,
          top: farTop,
          foot: shoreFoot(0.2),
          paint: [
            [0, "crest", 0],
            [0.03, "crest", 0.85],
            [0.1, "farHill", 1],
            [0.45, "farShade", 1],
            [0.7, "farHill", 1],
            [1, "farShade", 1],
          ],
          glow: [
            [0, "crestLit", 0],
            [0.03, "crestLit", 0.9],
            [0.12, "farHill", 1],
            [1, "farShade", 1],
          ],
          lean: 0.3,
          fill: 0.7,
          under: 0.58,
          patch: 0.24,
          flow: 0.3,
          breath: 0.3,
        },
        // the near range, darker and lower, its spruce closer
        {
          name: "near range",
          opaque: true,
          top: nearTop,
          foot: shoreFoot(0.1),
          paint: [
            [0, "crest", 0],
            [0.04, "farHill", 0.9],
            [0.14, "nearHill", 1],
            [0.42, "spruce", 1],
            [0.6, "nearShade", 1],
            [1, "spruce", 1],
          ],
          glow: [
            [0, "crestLit", 0],
            [0.04, "crestLit", 0.8],
            [0.16, "nearHill", 1],
            [1, "spruce", 1],
          ],
          lean: 0.35,
          fill: 0.72,
          under: 0.62,
          patch: 0.3,
          flow: 0.35,
          breath: 0.3,
        },
        // the point of spruce on the right, low on the water
        {
          name: "point",
          opaque: true,
          top: pointTop,
          foot: (stage) =>
            ACROSS.filter((x) => x >= POINT_FROM - 0.02).map((x) => [x, horizon(stage, x, 0.014)]),
          paint: [
            [0, "crest", 0],
            [0.06, "nearHill", 0.9],
            [0.2, "spruce", 1],
            [0.6, "nearShade", 1],
            [1, "spruce", 1],
          ],
          glow: [
            [0, "crestLit", 0],
            [0.06, "crestLit", 0.7],
            [0.2, "nearHill", 1],
            [1, "spruce", 1],
          ],
          lean: 0.2,
          fill: 0.72,
          under: 0.62,
          patch: 0.3,
          flow: 0.35,
          breath: 0.3,
        },
        {
          name: "mist",
          top: (stage) =>
            ACROSS.filter((x) => x <= 0.4).map((x) => [
              x,
              horizon(stage, x, -0.07 * smooth(0.4, -0.2, x)),
            ]),
          foot: (stage) =>
            ACROSS.filter((x) => x <= 0.4).map((x) => [
              x,
              horizon(stage, x, 0.1 * smooth(0.4, -0.3, x) + 0.002),
            ]),
          paint: [
            [0, "mist", 0],
            [0.3, "mist", 0.32],
            [0.55, "mist", 0.38],
            [0.8, "mist", 0.2],
            [1, "mist", 0],
          ],
          fill: 0.42,
          under: 0.3,
          patch: 0.4,
          beads: [0.4, 0.3],
          flow: 1.6,
          breath: 1.4,
        },
      ],
    },
    grass: null,
    passer: null,
    // the pointer ruffles the water as it goes over it
    pointer: true,
    stir: { ...STIR, reach: 58, life: 3, every: 8 },
    flowers: null,
    clouds: [],
    flock: [],
    orbit: null,
    paints: { ...PAINTS },
    stillAt: 6,
  };
}
