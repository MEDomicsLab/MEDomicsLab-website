import { plan } from "./shore.js";

// Places across the land, in the engine's own measure: -1 at the box's left edge, 1 at its right.
const ACROSS = Array.from({ length: 161 }, (_, k) => -1.6 + (3.2 * k) / 160);

// Every colour is a night colour, the same on a light page as on a dark one.
const night = (hex) => [hex, hex];
const INKS = {
  // the sky, from its top under the words down to the light that lingers over the hills
  nightTop: night("#0b1431"),
  nightHigh: night("#0e1b46"),
  nightMid: night("#13265f"),
  nightLow: night("#1b367c"),
  twilight: night("#2a4a96"),
  twilightPale: night("#4562ad"),
  // the sky where the Milky Way's heart lights it, low over the hills
  starlit: night("#26407f"),
  starlitPale: night("#4c66ad"),
  // the Milky Way: its pale streams, the dust lane between them, and their light in the water
  milk: night("#93a7dc"),
  milkPale: night("#c9d4f1"),
  milkWarm: night("#ded9ea"),
  rift: night("#1e2f66"),
  milkWater: night("#7389c9"),
  // the far hills, hazy with distance, and their rims in the sky's last light
  ridgeRim: night("#5068ad"),
  ridgeFar: night("#25397a"),
  ridgeFarDeep: night("#1a2b62"),
  ridgeNearRim: night("#2c427f"),
  ridgeNear: night("#16244f"),
  ridgeNearDeep: night("#111c40"),
  // the black spruce along the far shore
  forest: night("#0a1226"),
  forestDeep: night("#070d1c"),
  // the lake: the shore's shade under it, then the sky's light, deepening towards us
  lakeShade: night("#111c44"),
  lakeTwilight: night("#253d82"),
  lakeMid: night("#192e6a"),
  lakeDeep: night("#0f1d4b"),
  lakeFoot: night("#0b1638"),
  lakeGlow: night("#5d76bd"),
  lakeGlowPale: night("#8295d0"),
  // the hills and the shore as the water gives them back
  waterRidgeFar: night("#1c2e66"),
  waterRidgeFarRim: night("#3a529a"),
  waterRidgeNear: night("#131f48"),
  waterForest: night("#0b1430"),
  // the meadow on this side, in the dark: a little sky on its rim, then deep green-blue
  bankRim: night("#1f3a4a"),
  bank: night("#11222c"),
  bankDeep: night("#0b161e"),
  // the grass, from its dark roots to the tips that catch the sky
  grassRoot: night("#0d1a20"),
  grass: night("#142a2e"),
  grassLit: night("#1d3a3c"),
  grassPale: night("#2a4a4b"),
  grassTip: night("#3a5b5c"),
  // the paler side the grass shows where the pointer parts it
  sheen: night("#2f5352"),
};

// The strokes laid on the land: stars, spruce, flowers.
const PAINTED = {
  star: night("#ffffff"),
  starBlue: night("#dfe7ff"),
  starGlow: night("#bccbff"),
  starWarm: night("#fff1cf"),
  speck: night("#d4ddfa"),
  spruce: night("#060c19"),
  spruceEdge: night("#0d1729"),
  spruceWater: night("#0a1431"),
  lupin: night("#4c5daa"),
  lupinTip: night("#7384cf"),
  lupinDeep: night("#34428a"),
  daisy: night("#c3cadf"),
  daisyShade: night("#8f98b6"),
  daisyHeart: night("#a59a62"),
  cattail: night("#0b1018"),
  cattailHead: night("#151821"),
};

const noise1 = (hashed, x) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return hashed(i * 12.9898) * (1 - u) + hashed((i + 1) * 12.9898) * u;
};

// A shallow valley around the complete title block, measured after wrapping.
function openingAt(x, w, words) {
  const distance = Math.min(1, Math.abs(x - words.x) / (words.a + Math.max(55, w * 0.105)));
  const weight = (1 + Math.cos(Math.PI * distance ** 2)) * 0.5;
  const shoulder = words.y - words.b * 0.38;
  return shoulder + (words.y + words.b + 27 - shoulder) * weight;
}

export function composition(k) {
  const { HERO, LINES, LENS, FOOTER, PAINTS, LAND_INK, GRASS, SK_TWINKLE, SK_GLIMMER, SK_HAZE } = k;
  const { hashed, clamp, smooth } = k;
  const EVEN = 0.25 + 0.005;

  const planOf = (stage) => plan(stage.w, stage.h, stage.base);
  const xOf = (stage, across) => stage.w / 2 + (across * stage.w) / 2;
  const acrossOf = (stage, x) => (x - stage.w / 2) / (stage.w / 2);
  const downOf = (stage, y) => (y - stage.base) / stage.room;
  // a sheet's edge from a line across the box, in CSS pixels, given as the engine wants it
  const edge = (pick) => (stage) => {
    const p = planOf(stage);
    const line = pick(p, stage);
    return ACROSS.map((a) => [a, downOf(stage, line(xOf(stage, a)))]);
  };
  const shoreLine = (p) => (x) =>
    p.water - p.room * (0.02 + 0.014 * noise1(hashed, x / (p.room * 0.11)));

  return {
    ...HERO,
    words: ".hl-copy",
    lines: {
      ...LINES,
      lift: 0.06,
      veil: [70, 14],
      veilCore: 0.5,
      beadChance: 0.18,
      sink: 46,
      introMs: 800,
      whole: true,
    },
    film: FOOTER.film,
    dprCap: (w) => Math.min(2, 2 * Math.sqrt(1800 / w)),
    inks: { ...LAND_INK, ...INKS },
    paints: { ...PAINTS, ...PAINTED },
    twinkle: true,
    marks: true,
    glyphs: true,
    onPage: true,
    fade: {
      at: (stage) => [
        stage.words.y - stage.words.b * 0.45,
        stage.base + (planOf(stage).water - stage.base) * 0.45,
      ],
      ease: 1.5,
      pale: 0.55,
      sparse: 0.8,
      specks: 2.2,
    },
    glow: { place: { at: [0, 0], half: [1, 1] }, breathe: [0.05, 17] },
    waves: true,
    land: {
      ...HERO.land,
      profile: [
        [-1.6, 0],
        [1.6, 0],
      ],
      crest: 0,
      relief: [1, 1],
      // the land is laid out from the words' foot (down 0) to the box's foot (down 1)
      room: 1e4,
      foot: 0,
      head: ({ words }) => words.y + words.b,
      least: 40,
      sheets: [
        {
          name: "air",
          top: (stage) => {
            return ACROSS.map((a) => [
              a,
              downOf(stage, openingAt(xOf(stage, a), stage.w, stage.words)),
            ]);
          },
          foot: (stage) => {
            const foot = downOf(stage, planOf(stage).water + 4);
            return [
              [-1.6, foot],
              [1.6, foot],
            ];
          },
          paint: [
            [0, "nightTop", 0.85],
            [0.3, "nightHigh", 1],
            [0.55, "nightMid", 1],
            [0.74, "nightLow", 1],
            [0.88, "twilight", 1],
            [1, "twilightPale", 1],
          ],
          glow: [
            [0, "nightTop", 0.85],
            [0.3, "nightHigh", 1],
            [0.55, "starlit", 1],
            [0.8, "starlitPale", 1],
            [1, "twilightPale", 1],
          ],
          glowAt: (stage) => {
            const p = planOf(stage);
            return {
              at: [
                acrossOf(stage, p.milkyFoot - p.room * 0.25),
                downOf(stage, p.water - p.room * 0.16),
              ],
              half: [(p.room * 0.9) / (stage.w / 2), 0.3],
            };
          },
          glowTake: 0.8,
          shimmer: 0.6,
          fade: true,
          fill: 0.6,
          under: 0.82,
          patch: 0.12,
          flow: 0.5,
          beads: 0.6,
          breath: 1.5,
        },
        {
          name: "milky way",
          top: edge(
            (p, stage) => (x) =>
              Math.max(openingAt(x, stage.w, stage.words), p.milky(x) - p.milkyHalf(x))
          ),
          foot: edge(
            (p, stage) => (x) =>
              Math.max(openingAt(x, stage.w, stage.words), p.milky(x) + p.milkyHalf(x))
          ),
          paint: [
            [0, "milk", 0],
            [0.16, "milk", 0.2],
            [0.32, "milkPale", 0.46],
            [0.42, "milkWarm", 0.56],
            [0.49, "rift", 0.22],
            [0.55, "rift", 0.2],
            [0.63, "milkPale", 0.48],
            [0.76, "milk", 0.34],
            [0.88, "milk", 0.14],
            [1, "milk", 0],
          ],
          fade: true,
          fill: 0.5,
          under: 0.45,
          patch: 0.4,
          flow: 0.22,
          beads: 2.4,
          breath: 0.6,
        },
        // the far hills, rimmed with the sky's light, their lines running along their slopes
        {
          name: "far hills",
          opaque: true,
          top: edge((p) => p.far),
          foot: edge((p) => (x) => p.water + 2 + 0 * x),
          paint: [
            [0, "ridgeRim", 0],
            [0.025, "ridgeRim", 0.9],
            [0.09, "ridgeFar", 1],
            [0.45, "ridgeFarDeep", 1],
            [1, "ridgeFarDeep", 1],
          ],
          fill: 0.7,
          under: 0.72,
          patch: 0.16,
          flow: 0.32,
          beads: 0.5,
          breath: 0.6,
        },
        {
          name: "near ridge",
          opaque: true,
          top: edge((p) => p.near),
          foot: edge((p) => (x) => p.water + 2 + 0 * x),
          paint: [
            [0, "ridgeNearRim", 0],
            [0.04, "ridgeNearRim", 0.9],
            [0.14, "ridgeNear", 1],
            [0.6, "ridgeNearDeep", 1],
            [1, "ridgeNearDeep", 1],
          ],
          fill: 0.7,
          under: 0.74,
          patch: 0.14,
          flow: 0.3,
          beads: 0.35,
          breath: 0.5,
        },
        // the forest along the far shore, under its spruces
        {
          name: "far shore",
          opaque: true,
          top: edge(shoreLine),
          foot: edge((p) => (x) => p.water + 1.5 + 0 * x),
          paint: [
            [0, "forest", 0],
            [0.15, "forest", 0.95],
            [1, "forestDeep", 1],
          ],
          fill: 0.74,
          under: 0.85,
          flow: 0.2,
          beads: 0.15,
        },
        {
          name: "lake",
          opaque: true,
          top: edge((p) => (x) => p.water - 1 + 0 * x),
          foot: [
            [-1.6, 1.12],
            [1.6, 1.12],
          ],
          paint: [
            [0, "lakeShade", 1],
            [0.1, "lakeShade", 1],
            [0.24, "lakeTwilight", 1],
            [0.44, "lakeMid", 1],
            [0.72, "lakeDeep", 1],
            [1, "lakeFoot", 1],
          ],
          glow: [
            [0, "lakeShade", 1],
            [0.1, "lakeShade", 1],
            [0.22, "lakeGlowPale", 1],
            [0.42, "lakeGlow", 1],
            [0.72, "lakeMid", 1],
            [1, "lakeFoot", 1],
          ],
          glowAt: (stage) => {
            const p = planOf(stage);
            return {
              at: [
                acrossOf(stage, p.milkyFoot - p.room * 0.2),
                downOf(stage, p.water + p.room * 0.2),
              ],
              half: [(p.room * 0.55) / (stage.w / 2), 0.2],
            };
          },
          glowTake: 0.9,
          shimmer: 1,
          fill: 0.6,
          under: 0.8,
          patch: 0.2,
          flow: 0.24,
          beads: 1.8,
          breath: 0.4,
          wave: [1.1, 420, 0.5, 0],
        },
        // the Milky Way given back by the water, fainter
        {
          name: "milky water",
          top: edge((p) => (x) => Math.max(p.water + 3, 2 * p.water - p.milky(x) - p.milkyHalf(x))),
          foot: edge(
            (p) => (x) => Math.max(p.water + 4, 2 * p.water - p.milky(x) + p.milkyHalf(x))
          ),
          paint: [
            [0, "milkWater", 0],
            [0.2, "milkWater", 0.14],
            [0.4, "milkWater", 0.3],
            [0.5, "lakeMid", 0.1],
            [0.6, "milkWater", 0.28],
            [0.8, "milkWater", 0.12],
            [1, "milkWater", 0],
          ],
          fill: 0.5,
          under: 0.3,
          patch: 0.4,
          flow: 0.24,
          beads: 1.4,
          wave: [1.1, 420, 0.5, 0],
        },
        // the hills as the water gives them back, upside down and dissolving at their crests
        {
          name: "far hills water",
          opaque: true,
          top: edge((p) => (x) => p.water + 1 + 0 * x),
          foot: edge((p) => (x) => 2 * p.water - p.far(x)),
          paint: [
            [0, "waterRidgeFar", 1],
            [0.6, "waterRidgeFar", 1],
            [0.88, "waterRidgeFarRim", 0.85],
            [0.96, "waterRidgeFarRim", 0.45],
            [1, "waterRidgeFarRim", 0],
          ],
          fill: 0.62,
          under: 0.66,
          patch: 0.2,
          flow: 0.26,
          beads: 0.8,
          wave: [1.1, 420, 0.5, 0],
        },
        {
          name: "near ridge water",
          opaque: true,
          top: edge((p) => (x) => p.water + 1 + 0 * x),
          foot: edge((p) => (x) => 2 * p.water - p.near(x)),
          paint: [
            [0, "waterRidgeNear", 1],
            [0.7, "waterRidgeNear", 1],
            [0.92, "waterRidgeNear", 0.6],
            [1, "waterRidgeNear", 0],
          ],
          fill: 0.62,
          under: 0.7,
          patch: 0.18,
          flow: 0.26,
          beads: 0.5,
          wave: [1.1, 420, 0.5, 0],
        },
        {
          name: "far shore water",
          opaque: true,
          top: edge((p) => (x) => p.water + 0.5 + 0 * x),
          foot: edge((p) => (x) => 2 * p.water - shoreLine(p)(x)),
          paint: [
            [0, "waterForest", 1],
            [0.75, "waterForest", 0.9],
            [1, "waterForest", 0],
          ],
          fill: 0.66,
          under: 0.8,
          flow: 0.26,
          beads: 0.3,
          wave: [1.1, 420, 0.5, 0],
        },
        // the meadow on this side, dark, with a little of the sky on its rim
        {
          name: "bank",
          opaque: true,
          top: edge((p) => p.bank),
          foot: [
            [-1.6, 1.3],
            [1.6, 1.3],
          ],
          paint: [
            [0, "bankRim", 0],
            [0.03, "bankRim", 0.9],
            [0.12, "bank", 1],
            [0.5, "bankDeep", 1],
            [1, "bankDeep", 1],
          ],
          lean: 0.2,
          fill: 0.72,
          under: 0.78,
          patch: 0.28,
          flow: 0.55,
          beads: 0.6,
          breath: 1.2,
          sheen: 0.5,
        },
      ],
    },
    // no meadow of the engine's own: the grass, the lupins and the daisies are planted below
    grass: {
      ...GRASS,
      tufts: 0,
      lane: 0,
      singles: 0,
      inks: ["grassRoot", "grass", "grassLit", "grassPale", "grassTip"],
    },
    flowers: null,
    passer: null,
    clouds: [],
    flock: [],
    lens: { ...LENS, foot: "ease" },
    // the pointer parts the grass and ripples the lake's lines as it goes
    pointer: true,
    stillAt: 7,
    plant: (garden) =>
      plantNight(garden, { hashed, clamp, smooth, SK_TWINKLE, SK_GLIMMER, SK_HAZE, EVEN }),
  };
}

function plantNight(garden, { hashed, clamp, smooth, SK_TWINKLE, SK_GLIMMER, SK_HAZE, EVEN }) {
  const { w, h, rand, words } = garden;
  const p = plan(w, h, words.y + words.b);
  const { room, water } = p;
  const size = clamp(room / 300, 0.62, 1.15);
  const skyTop = words.y - words.b * 0.55;
  const fixed = (n, { x, y, order, ...o }) => {
    rand.reseed(71003 + n * 7919);
    const root = h + 40;
    garden.dab({
      blur: 0.5,
      load: 0.95,
      turn: 0,
      ...o,
      x,
      y: root,
      stem: root - y,
      lean: 0,
      stiff: 1,
      order: order ?? y,
    });
  };
  let n = 0;

  const starCount = Math.round(w * 0.11);
  const above = (x, y) =>
    y > openingAt(x, w, words) && y < p.far(x) - 4 * size && y < p.near(x) - 4 * size;
  for (let k = 0; k < starCount; k += 1) {
    const x = hashed(k * 5.13 + 0.4) * w;
    const y = skyTop + hashed(k * 3.71 + 0.9) ** 1.25 * (water - skyTop);
    if (!above(x, y)) continue;
    const thin = smooth(skyTop, skyTop + room * 0.32, y);
    const r = (0.45 + 0.75 * hashed(k * 7.31) ** 3) * size;
    fixed((n += 1), {
      x,
      y,
      long: r,
      wide: 1,
      blur: 0.35,
      paints: hashed(k * 2.9) < 0.12 ? ["starWarm", "star"] : ["star", "starBlue"],
      load: (0.45 + 0.5 * hashed(k * 9.1)) * (0.3 + 0.7 * thin),
      kind: SK_TWINKLE,
    });
  }
  // the Milky Way's own dust of stars, thick along its streams and thin over its dark lane
  const dust = Math.round(w * 0.2);
  for (let k = 0; k < dust; k += 1) {
    const x = (hashed(k * 1.97 + 0.31) * 1.15 - 0.05) * w;
    const u = (hashed(k * 4.23 + 0.7) + hashed(k * 8.11 + 0.2) + hashed(k * 2.71 + 0.5)) / 1.5 - 1;
    if (Math.abs(u) < 0.12 && hashed(k * 3.3) < 0.7) continue;
    const y = p.milky(x) + u * p.milkyHalf(x);
    if (y < skyTop || !above(x, y)) continue;
    const thin = smooth(skyTop, skyTop + room * 0.32, y);
    fixed((n += 1), {
      x,
      y,
      long: (0.35 + 0.4 * hashed(k * 6.1) ** 2) * size,
      wide: 1,
      blur: 0.3,
      paints: ["speck", "starBlue"],
      load: (0.35 + 0.45 * hashed(k * 5.3)) * (0.25 + 0.75 * thin) * (1 - 0.5 * Math.abs(u)),
      kind: SK_TWINKLE,
    });
  }
  // a dozen bright ones
  for (let k = 0; k < 14; k += 1) {
    const x = (0.04 + 0.92 * hashed(k * 13.7 + 1.3)) * w;
    const y = skyTop + room * 0.1 + hashed(k * 7.9 + 0.3) * (water - skyTop - room * 0.18);
    if (!above(x, y + 8)) continue;
    const r = (1.6 + 1.6 * hashed(k * 3.1)) * size;
    const thin = 0.4 + 0.6 * smooth(skyTop, skyTop + room * 0.32, y);
    const id = 9000 + k;
    fixed(id, {
      x,
      y,
      long: r * 1.7,
      wide: 0.1,
      blur: 0.4,
      paints: ["star", "starGlow"],
      load: 0.7 * thin,
      kind: SK_TWINKLE,
    });
    fixed(id, {
      x,
      y,
      long: r * 1.1,
      wide: 0.12,
      turn: Math.PI / 2,
      blur: 0.4,
      paints: ["star", "starGlow"],
      load: 0.7 * thin,
      kind: SK_TWINKLE,
      order: y + 0.001,
    });
    fixed(id, {
      x,
      y,
      long: r * 0.55,
      wide: 1,
      blur: r * 0.5,
      paints: ["starGlow", "star"],
      load: 0.55 * thin,
      kind: SK_GLIMMER,
      order: y + 0.002,
    });
  }
  // a soft glow along the Milky Way's streams, low where it rises out of the hills
  for (let k = 0; k < 18; k += 1) {
    const f = k / 17;
    const x = p.milkyFoot - f * room * 2.6;
    const y = p.milky(x) + (k % 2 ? -0.45 : 0.42) * p.milkyHalf(x);
    if (!above(x, y + p.milkyHalf(x) * 0.6) || y < skyTop + room * 0.08) continue;
    const long = p.milkyHalf(x) * (0.9 + 0.3 * hashed(k * 2.1));
    fixed((n += 1), {
      x,
      y,
      long,
      wide: 0.42,
      turn: -Math.atan(0.36),
      blur: long * 0.7,
      paints: ["starGlow", "speck"],
      load: (0.12 + 0.08 * hashed(k * 4.4)) * (1 - 0.6 * f),
      kind: SK_HAZE,
    });
  }

  const spruce = (x, foot, tall, seed) => {
    const tiers = clamp(Math.round(tall / (2.1 * size)), 3, 15);
    const lean = (hashed(seed * 3.3) - 0.5) * 0.05;
    for (let t = 0; t < tiers; t += 1) {
      const f = (t + 0.5) / tiers;
      const y = foot - tall * f * 0.93;
      const cx = x + lean * tall * f;
      const reach = tall * (0.17 * (1 - f) ** 0.9 + 0.035) * (0.7 + 0.6 * hashed(seed * 7.1 + t));
      const club = f > 0.72 && f < 0.88 ? 1.45 : 1;
      const thick = Math.max(0.8 * size, (tall / tiers) * 0.62);
      const order = foot - 0.5 + t * 0.001;
      fixed((n += 1), {
        x: cx + (hashed(seed + t * 1.7) - 0.5) * reach * 0.3,
        y,
        long: reach * club,
        wide: clamp(thick / (reach * club), 0.18, 0.9),
        turn: (t % 2 ? Math.PI : 0) + (hashed(seed * 1.3 + t) - 0.5) * 0.25,
        blur: 0.45,
        paints: ["spruce", hashed(seed + t) < 0.3 ? "spruceEdge" : "spruce"],
        load: 0.97,
        kind: 0,
        order,
      });
      // given back by the water: every other tier, softer, fainter, shifted by the ripples
      if (t % 2 === 0 && reach > 0.6) {
        const my = 2 * water - y;
        if (my < p.bank(cx) - 3) {
          fixed((n += 1), {
            x: cx + (hashed(seed * 2.2 + t) - 0.5) * 3 * size,
            y: my,
            long: reach * club * 1.1,
            wide: clamp((thick * 1.3) / (reach * club * 1.1), 0.2, 0.9),
            turn: hashed(seed + t * 3.1) < 0.5 ? 0 : Math.PI,
            blur: 1.1,
            paints: ["spruceWater", "spruceWater"],
            load: 0.6,
            kind: EVEN,
            order: my,
          });
        }
      }
    }
    // the spire
    fixed((n += 1), {
      x: x + lean * tall,
      y: foot - tall * 0.98,
      long: tall * 0.1,
      wide: clamp((0.5 * size) / (tall * 0.1), 0.05, 0.4),
      turn: Math.PI / 2,
      blur: 0.35,
      paints: ["spruce", "spruce"],
      load: 0.9,
      kind: EVEN,
      order: foot - 0.4,
    });
  };
  let x = -6;
  for (let k = 0; x < w + 8; k += 1) {
    const r = hashed(k * 1.37 + 0.11);
    const grove = noise1(hashed, x / (room * 0.35));
    const tall =
      room * (0.022 + 0.05 * r ** 1.6 + 0.03 * grove * hashed(k * 5.9)) * (0.85 + 0.3 * grove);
    const foot = water - room * (0.006 + 0.006 * hashed(k * 2.3));
    spruce(x, foot, tall, k + 1);
    x += (2.6 + 5.4 * hashed(k * 4.91)) * size * (1.25 - 0.6 * grove);
  }

  const grassCount = Math.round(w * 0.75);
  for (let k = 0; k < grassCount; k += 1) {
    const gx = hashed(k * 3.17 + 0.2) * w;
    const rim = p.bank(gx);
    const deep = hashed(k * 5.71 + 0.6) ** 1.8;
    const gy = rim + 1 + deep * (h - rim) * 0.85;
    const tall =
      (5 + 16 * hashed(k * 7.3) + 26 * deep) *
      size *
      (0.8 + 0.5 * smooth(room * 0.3, room * 0.05, Math.abs(gx - w / 2) - w * 0.25));
    garden.stalk({
      x: gx,
      y: gy,
      tall,
      wide: (0.55 + 0.6 * deep) * size,
      ink: clamp(1 + 2.4 * hashed(k * 2.2) * (1 - deep * 0.6), 0, 3.99),
      mix: hashed(k * 1.1),
      soft: 0,
      stiff: 0.2 + 0.3 * hashed(k * 6.6),
      lean: (hashed(k * 8.8) - 0.5) * 0.4,
    });
  }
  const lupin = (lx, ly, tall, seed) => {
    garden.stalk({
      x: lx,
      y: ly,
      tall: tall * 0.98,
      wide: 0.9 * size,
      ink: 1.2,
      mix: 0.4,
      soft: 0,
      stiff: 0.55,
      lean: 0,
    });
    const florets = clamp(Math.round(tall / (2.4 * size)), 5, 16);
    for (let f = 0; f < florets; f += 1) {
      const t = f / (florets - 1);
      const at = 0.42 + 0.58 * t;
      const r = (1.5 - 0.9 * t) * size * (0.9 + 0.2 * hashed(seed + f));
      for (const side of [-1, 1]) {
        garden.dab({
          x: lx,
          y: ly,
          stem: tall * at,
          long: r,
          wide: 0.8,
          turn: side * (0.35 + 0.3 * hashed(seed * 2 + f)) + (side < 0 ? Math.PI : 0),
          blur: 0.5,
          paints:
            t > 0.75
              ? ["lupinTip", "lupin"]
              : hashed(seed + f * 3) < 0.5
                ? ["lupin", "lupinDeep"]
                : ["lupin", "lupinTip"],
          load: 0.82,
          kind: 0,
          stiff: 0.55,
          lean: 0,
          order: ly + 0.01 * f,
        });
      }
    }
  };
  const clumps = [
    [0.06, 0.32, 5],
    [0.16, 0.5, 4],
    [0.83, 0.38, 5],
    [0.93, 0.25, 6],
    [0.3, 0.7, 3],
  ];
  clumps.forEach(([at, deep, many], c) => {
    for (let j = 0; j < many; j += 1) {
      const lx = (at + (hashed(c * 9.1 + j * 2.3) - 0.5) * 0.06) * w;
      const rim = p.bank(lx);
      const ly = rim + 4 + (deep + (hashed(c * 3.1 + j) - 0.5) * 0.2) * (h - rim) * 0.7;
      const tall = (16 + 20 * hashed(c * 4.7 + j * 1.9)) * size * (0.7 + 0.5 * deep);
      lupin(lx, ly, tall, c * 40 + j * 7 + 3);
    }
  });
  const daisies = Math.round(w * 0.03);
  for (let k = 0; k < daisies; k += 1) {
    const dx = hashed(k * 6.37 + 0.5) * w;
    const rim = p.bank(dx);
    const deep = hashed(k * 2.83 + 0.1);
    const dy = rim + 3 + deep * (h - rim) * 0.75;
    const r = (1 + 1.6 * deep) * size;
    const stem = (5 + 10 * deep) * size;
    garden.stalk({
      x: dx,
      y: dy,
      tall: stem,
      wide: 0.5 * size,
      ink: 1,
      mix: 0.5,
      soft: 0,
      stiff: 0.4,
    });
    garden.dab({
      x: dx,
      y: dy,
      stem,
      long: r,
      wide: 0.55,
      turn: 0,
      blur: 0.45,
      paints: ["daisy", "daisyShade"],
      load: 0.75,
      kind: EVEN,
      stiff: 0.4,
      order: dy,
    });
    garden.dab({
      x: dx,
      y: dy,
      stem: stem + 0.3 * r,
      long: r * 0.32,
      wide: 0.9,
      blur: 0.4,
      paints: ["daisyHeart", "daisyHeart"],
      load: 0.8,
      kind: EVEN,
      stiff: 0.4,
      order: dy + 0.001,
    });
  }
  // cattails where the meadow comes down to the water
  [0.24, 0.27, 0.71, 0.745, 0.765].forEach((at, j) => {
    const cx = at * w;
    const cy = p.bank(cx) + 2 + 4 * hashed(j * 3.3);
    const tall = (26 + 16 * hashed(j * 5.5)) * size;
    garden.stalk({
      x: cx,
      y: cy,
      tall,
      wide: 1.1 * size,
      ink: 0.3,
      mix: 0.5,
      soft: 0,
      stiff: 0.6,
      lean: (hashed(j) - 0.5) * 0.12,
    });
    garden.dab({
      x: cx,
      y: cy,
      stem: tall * 0.74,
      long: tall * 0.11,
      wide: 0.3,
      turn: Math.PI / 2,
      blur: 0.5,
      paints: ["cattailHead", "cattail"],
      load: 0.95,
      kind: EVEN,
      stiff: 0.6,
      order: cy,
    });
  });
}
