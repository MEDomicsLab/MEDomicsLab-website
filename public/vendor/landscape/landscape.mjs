var PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)"), LINES = {
  pitch: 2.5,
  closest: 2.2,
  keep: 0.25,
  fill: 0.62,
  brick: [46, 130],
  gap: 0.9,
  flow: 0.018,
  beadCell: 8.2,
  beadChance: 0.8,
  beadSize: 0.68,
  beadFlow: 1.7,
  grain: 0.85,
  /* Round the words lies a soft oval of page, as the docs hero lays one under its own: as wide and as tall as the
     words' box and this much more to either side and above and below, clear out to `veilCore` of the way to its rim
     and thinning out from there, so wherever the land comes up beside the words it meets them along a curve. (A
     composition can have it thin the lines rather than clear them: see veilFragment.) */
  veil: [110, 85],
  veilCore: 0.5,
  sink: 60,
  /* the lines shoot across once, on the way in */
  introMs: 1700
}, LAND_INK = {
  pale: ["#c9e0f8", "#d8e8fb"],
  sky: ["#94c3f1", "#aacff6"],
  blue: ["#5f9fe9", "#78b1f0"],
  deep: ["#3a7fdb", "#5596ea"],
  slateHaze: ["#bcc5ea", "#c9d0ef"],
  slate: ["#8593cc", "#a3aee0"],
  lime: ["#a6d544", "#b6df5e"],
  green: ["#5aa82b", "#74bb44"],
  deepGreen: ["#337f22", "#4f9b3b"],
  olive: ["#b3c455", "#c3d26c"],
  sheen: ["#eef6c4", "#f4f9d8"],
  straw: ["#e2dfa0", "#eae8b6"],
  sun: ["#9cc256", "#aecd6c"],
  leaf: ["#5a8a3a", "#72a352"],
  shade: ["#3d6a2e", "#55854a"]
}, BLISS = [
  [-1.6, 0.52],
  [-1.3, 0.31],
  [-1, 0.13],
  [-0.9, 0.08],
  [-0.8, 0.038],
  [-0.7, 0.016],
  [-0.6, 5e-3],
  [-0.5, 0],
  [-0.4, 6e-3],
  [-0.3, 0.026],
  [-0.2, 0.056],
  [-0.1, 0.092],
  [0, 0.132],
  [0.2, 0.218],
  [0.4, 0.31],
  [0.6, 0.402],
  [0.8, 0.494],
  [1, 0.586],
  [1.3, 0.72],
  [1.6, 0.85]
], CREST = 0.04, RELIEF = [0.55, 1.15], SHRUB_PAINT = [
  [0, "sun", 0.9],
  [0.2, "leaf", 1],
  [0.55, "shade", 1],
  [1, "shade", 1]
], LAND = [
  {
    name: "sky",
    top: {
      crest: [
        [-1.6, -0.28],
        [-1, -0.22],
        [-0.8, -0.2],
        [-0.65, -0.16],
        [-0.55, -0.11],
        [-0.45, -0.05],
        [-0.35, 0],
        [-0.2, 0.04],
        [0, 0.08],
        [0.2, 0.13],
        [0.4, 0.15],
        [0.6, 0.14],
        [0.8, 0.12],
        [1, 0.11],
        [1.6, 0.08]
      ]
    },
    /* It runs on under the hill, so that no page shows through at its crest. */
    foot: {
      hill: [
        [-1.6, 0.07],
        [1.6, 0.07]
      ]
    },
    paint: [
      [0, "pale", 0],
      [0.06, "sky", 0.4],
      [0.2, "blue", 0.9],
      [0.42, "deep", 1],
      [0.62, "blue", 1],
      [0.8, "sky", 1],
      [1, "pale", 1]
    ],
    fill: 0.7,
    under: 0.38,
    flow: 1.2,
    breath: 2
  },
  {
    name: "far ridge",
    opaque: !0,
    top: {
      crest: [
        [0.3, 0.36],
        [0.6, 0.41],
        [0.75, 0.43],
        [0.85, 0.42],
        [0.92, 0.395],
        [0.97, 0.405],
        [1.05, 0.39],
        [1.3, 0.37],
        [1.6, 0.35]
      ]
    },
    foot: {
      hill: [
        [0.3, 0.1],
        [1.6, 0.1]
      ]
    },
    paint: [
      [0, "slateHaze", 0],
      [0.08, "slateHaze", 0.8],
      [0.4, "slate", 1],
      [1, "slate", 1]
    ],
    fill: 0.72,
    under: 0.5,
    patch: 0.2,
    flow: 0.5,
    breath: 1.2
  },
  {
    name: "hill",
    opaque: !0,
    top: { crest: BLISS },
    foot: [
      [-1.6, 1.3],
      [-0.5, 1.12],
      [0.5, 1.08],
      [1.6, 1.22]
    ],
    paint: [
      [0, "lime", 0],
      [0.025, "lime", 0.9],
      [0.1, "lime", 1],
      [0.22, "green", 1],
      [0.36, "deepGreen", 1],
      [0.55, "green", 1],
      [0.75, "olive", 1],
      [1, "olive", 1]
    ],
    lean: 0.3,
    fill: 0.74,
    under: 0.6,
    patch: 0.3,
    flow: 0.7,
    breath: 1.5,
    sheen: 1
  },
  {
    name: "far shrubs",
    opaque: !0,
    on: "hill",
    shrubs: [
      [0.64, 22, 13, !1],
      [0.7, 15, 9, !0],
      [0.84, 30, 17, !1],
      [0.915, 18, 11, !0]
    ],
    paint: SHRUB_PAINT,
    fill: 0.8,
    under: 0.7,
    patch: 0.25,
    flow: 0.3,
    breath: 0.8
  },
  {
    name: "meadow",
    opaque: !0,
    laid: !0,
    top: {
      hill: [
        [-1.6, 0.62],
        [-1, 0.52],
        [-0.5, 0.5],
        [0, 0.42],
        [0.5, 0.34],
        [1, 0.3],
        [1.6, 0.3]
      ]
    },
    foot: [
      [-1.6, 1.42],
      [-1, 1.3],
      [-0.5, 1.2],
      [0, 1.1],
      [0.5, 1.12],
      [1, 1.22],
      [1.6, 1.36]
    ],
    paint: [
      [0, "green", 0],
      [0.05, "green", 0.86],
      [0.22, "green", 1],
      [0.5, "olive", 1],
      [0.7, "olive", 0.9],
      [0.84, "straw", 0.5],
      [0.93, "straw", 0.2],
      [1, "straw", 0]
    ],
    fill: 0.68,
    under: 0.5,
    patch: 0.2,
    flow: 0.8,
    breath: 2,
    sheen: 1
  },
  {
    name: "near shrubs",
    opaque: !0,
    on: "meadow",
    shrubs: [
      [-0.9, 46, 30, !0],
      [-0.77, 30, 20, !1],
      [0.3, 40, 26, !1],
      [0.42, 26, 18, !0],
      [0.62, 50, 32, !0]
    ],
    paint: SHRUB_PAINT,
    fill: 0.8,
    under: 0.7,
    patch: 0.25,
    flow: 0.3,
    breath: 0.8
  }
], SHRUB_SINK = 0.022, LAND_ROOM = 256, LAND_FOOT = 19, LAND_HEAD = 12, GRASS = {
  tufts: 0.1,
  lane: 0.07,
  blades: [3, 7],
  singles: 0.35,
  tall: [8, 40],
  wide: [0.55, 1.05],
  rest: 0.12,
  fan: 0.32,
  inks: ["lime", "green", "deepGreen", "olive", "straw"]
}, STIR = { count: 48, reach: 62, life: 2.6, every: 9 }, PASSER = { first: 1.8, every: 13, across: 8.5, lane: 0.66, wander: 0.07, push: 0.6 }, FLOWERS = {
  stage: 640,
  front: 1.15,
  /* A flower's size by how near: `far` at the crest and `close` at the foot, growing as `curve` says, as things grow
     towards the eye; each is then its own size, within `own`. A stem's height likewise. */
  size: { far: 1.6, close: 22, curve: 2.6, own: [0.7, 1.3] },
  stem: { far: 1, close: 26, curve: 1.8, own: [0.6, 1.3] },
  /* A stroke's width for its length: a dab, not a streak. Past the focus, out of focus, they are rounder. */
  wide: [0.6, 0.9],
  /* Where the eye is focused, and how wide a soft edge a flower has for each pixel of size it is larger (in front of
     the focus) or smaller (behind it) than one in focus. The blur grows towards the eye, but never past `most` of a
     flower's size, so that a near one keeps an edge; away from the eye it stops at `deepest`, so the specks up the hill
     stay specks. Nothing is softer than `least`. */
  focus: 0.62,
  blur: { behind: 0.55, deepest: 1.8, front: 0.55, most: 0.4, least: 0.3 },
  /* How much of the ground the flowers cover where a drift is thickest, by how near: they overlap at the front and
     thin to a haze of specks up the hill, where each is smaller than its size by `far`, and fainter: a flower carries
     0.95 of a full load from 0.5 on and fades to 0.35 by 0.12. A composition can give `fade: [from, to, least]` for its
     own (the footer's far flowers stay strong, so that far off they read as a field of colour). */
  cover: [
    [0, 0.3],
    [0.2, 1.3],
    [0.35, 2.1],
    [0.5, 3],
    [0.65, 4.2],
    [0.8, 3],
    [1, 2.2]
  ],
  far: [0.5, 0.9],
  /* How many in the middle distance are painted with their petals, how many show a stem, how many have dark leaves
     brushed in round their feet, and how thickly leaves are brushed in under a drift on their own. */
  crisp: 0.012,
  stems: 0.2,
  leaves: 0.25,
  bed: 0.32,
  /* The drifts. Each runs along a line of places [across, near], reaches `wide` to either side of it, at its start and
     at its end, is as `full` as it is there, and is painted from one of the PALETTES; a `patchy` one breaks into
     clumps (past `patchyFrom` of the way along, if it has one), and one with `gaps` gives way to wide stretches of plain
     grass. A drift with `own` sizes its flowers within those bounds instead. */
  drifts: [
    /* the meadow itself, thinly scattered with every colour in clumps on either side, broken by wide stretches of
       plain grass, and left to a few clumps under the words */
    {
      line: [
        [-2.4, 0.42],
        [-1.6, 0.5],
        [-0.95, 0.6],
        [-0.5, 0.78]
      ],
      wide: [0.3, 0.28],
      full: [0.18, 0.42],
      paints: "meadow",
      patchy: !0,
      gaps: !0
    },
    {
      line: [
        [0.45, 0.74],
        [0.85, 0.68],
        [1.5, 0.5],
        [2.4, 0.42]
      ],
      wide: [0.28, 0.3],
      full: [0.42, 0.18],
      paints: "meadow",
      patchy: !0,
      gaps: !0
    },
    /* the great warm sweep: heaped at the front on the right, then up through the meadow and onto the slope, where it
       thins into a haze among the far shrubs */
    {
      line: [
        [1.1, 0.92],
        [0.92, 0.8],
        [0.76, 0.64],
        [0.66, 0.46],
        [0.6, 0.3],
        [0.57, 0.14]
      ],
      wide: [0.32, 0.14],
      full: [1, 1],
      paints: "poppies"
    },
    /* a pale one, heaped at the front on the left, bending back towards the shrubs and breaking into clumps as it
       goes, until it is only specks */
    {
      line: [
        [-1.1, 0.93],
        [-0.9, 0.84],
        [-0.84, 0.7],
        [-0.7, 0.6],
        [-0.58, 0.34]
      ],
      wide: [0.28, 0.1],
      full: [1, 0.45],
      paints: "daisies",
      patchy: !0,
      patchyFrom: 0.45,
      own: [0.55, 1.5]
    },
    /* clumps of cosmos and buttercups, each at its own depth: one near and soft on the left, one crossing the
       meadow's top edge under the words, and buttercups nearer on the right */
    {
      line: [
        [-0.5, 0.84],
        [-0.36, 0.8]
      ],
      wide: [0.04, 0.04],
      full: [1, 1],
      paints: "cosmos"
    },
    {
      line: [
        [-0.06, 0.44],
        [0.12, 0.62]
      ],
      wide: [0.05, 0.07],
      full: [0.8, 0.8],
      paints: "cosmos",
      patchy: !0
    },
    {
      line: [
        [0.16, 0.86],
        [0.24, 0.8]
      ],
      wide: [0.04, 0.04],
      full: [1, 1],
      paints: "buttercups"
    },
    /* a few soft ones at the front, between the great heaps, at different depths */
    {
      line: [
        [-0.66, 0.95],
        [-0.52, 0.98]
      ],
      wide: [0.05, 0.04],
      full: [0.75, 0.75],
      paints: "cosmos"
    },
    {
      line: [
        [0.06, 0.9],
        [0.2, 0.92]
      ],
      wide: [0.04, 0.04],
      full: [1, 1],
      paints: "daisies"
    },
    /* a thin arm of the meadow reaching up the hill, left of the middle, so the flowers do not all stop at one line */
    {
      line: [
        [-0.24, 0.62],
        [-0.32, 0.48],
        [-0.42, 0.36],
        [-0.5, 0.26]
      ],
      wide: [0.1, 0.07],
      full: [0.7, 0.7],
      paints: "cosmos",
      patchy: !0
    },
    /* poppies under the shrubs on the left */
    {
      line: [
        [-1.1, 0.44],
        [-0.95, 0.46],
        [-0.8, 0.5]
      ],
      wide: [0.05, 0.04],
      full: [0.75, 0.55],
      paints: "poppies",
      patchy: !0
    },
    /* and butter and white behind the warm sweep, on the right */
    {
      line: [
        [0.86, 0.5],
        [0.98, 0.46],
        [1.1, 0.44]
      ],
      wide: [0.05, 0.05],
      full: [0.75, 0.65],
      paints: "buttercups",
      patchy: !0
    },
    /* Past the stage, which only a wide screen shows: a warm drift climbing on the far left with a pale heap in front
       of it, and a pale one climbing on the far right with cosmos beyond it. */
    {
      line: [
        [-1.3, 0.58],
        [-1.5, 0.48],
        [-1.72, 0.36],
        [-1.85, 0.26]
      ],
      wide: [0.16, 0.06],
      full: [1, 0.7],
      paints: "poppies"
    },
    {
      line: [
        [-1.62, 0.6],
        [-1.98, 0.5]
      ],
      wide: [0.12, 0.08],
      full: [0.9, 0.8],
      paints: "daisies",
      patchy: !0
    },
    {
      line: [
        [1.3, 0.6],
        [1.55, 0.5],
        [1.8, 0.38],
        [1.95, 0.28]
      ],
      wide: [0.15, 0.05],
      full: [1, 0.5],
      paints: "daisies",
      patchy: !0,
      patchyFrom: 0.4
    },
    {
      line: [
        [1.95, 0.55],
        [2.3, 0.45]
      ],
      wide: [0.1, 0.08],
      full: [0.85, 0.8],
      paints: "cosmos",
      patchy: !0
    }
  ],
  /* a few on their own in the plain grass, so that no gap is quite empty */
  strays: 40,
  /* the gorse's flowers: how many to a CSS pixel of a crown's width, and their size */
  gorse: 0.42,
  bud: [1.1, 2]
}, PAINTS = {
  red: ["#ee7a5a", "#f2876a"],
  coral: ["#f4886a", "#f79479"],
  salmon: ["#f7a287", "#f9ae95"],
  peach: ["#f9c2a0", "#fbcbad"],
  pink: ["#f2a6b8", "#f5b4c4"],
  rose: ["#e6819c", "#ec92aa"],
  lilac: ["#a9b2e8", "#b8c0ef"],
  butter: ["#f7da78", "#f8e08c"],
  gold: ["#e9b438", "#efc04f"],
  cream: ["#f6edd2", "#f8f1dc"],
  white: ["#fffdf6", "#fffdf6"]
}, LEAVES = ["deepGreen", "shade", "leaf"], PALE = ["white", "cream", "butter", "peach"], PALETTES = {
  poppies: [
    ["red", 0.3],
    ["coral", 4],
    ["salmon", 3],
    ["peach", 1.6],
    ["pink", 0.6],
    ["lilac", 0.1],
    ["butter", 0.6],
    ["cream", 0.5],
    ["white", 1.6]
  ],
  daisies: [
    ["coral", 0.6],
    ["salmon", 0.4],
    ["peach", 1.6],
    ["pink", 1.1],
    ["lilac", 0.3],
    ["butter", 1.8],
    ["cream", 2.5],
    ["white", 2]
  ],
  cosmos: [
    ["coral", 1],
    ["salmon", 1],
    ["peach", 2],
    ["pink", 3],
    ["rose", 1],
    ["lilac", 0.4],
    ["butter", 0.5],
    ["white", 2]
  ],
  meadow: [
    ["coral", 0.7],
    ["salmon", 0.6],
    ["peach", 1],
    ["pink", 1.4],
    ["lilac", 0.3],
    ["butter", 1.4],
    ["cream", 1],
    ["white", 2.6]
  ],
  buttercups: [
    ["butter", 3],
    ["gold", 0.6],
    ["cream", 1.4],
    ["white", 2],
    ["peach", 0.6],
    ["coral", 0.4]
  ]
}, SECOND = {
  red: ["coral"],
  coral: ["salmon", "peach"],
  salmon: ["peach", "coral"],
  peach: ["salmon", "cream"],
  pink: ["rose", "peach"],
  rose: ["pink"],
  lilac: ["pink", "white"],
  butter: ["gold", "cream"],
  gold: ["butter"],
  cream: ["white", "butter"],
  white: ["cream"],
  // the footer's fields of colour (see FOOTER_PAINTS): no other composition paints with these
  marigold: ["tangerine", "saffron"],
  tangerine: ["marigold"],
  saffron: ["marigold", "apricot"],
  apricot: ["saffron", "butter"],
  cornflower: ["azure", "indigo"],
  azure: ["cornflower", "periwinkle"],
  indigo: ["cornflower", "violet"],
  periwinkle: ["azure", "white"],
  violet: ["indigo", "cornflower"]
}, PALER = {
  red: "salmon",
  coral: "peach",
  salmon: "peach",
  peach: "cream",
  pink: "white",
  rose: "pink",
  lilac: "white",
  butter: "cream",
  gold: "butter",
  cream: "white",
  white: "white",
  marigold: "saffron",
  tangerine: "marigold",
  saffron: "apricot",
  apricot: "butter",
  cornflower: "azure",
  azure: "periwinkle",
  indigo: "cornflower",
  periwinkle: "white",
  violet: "periwinkle"
}, DEEPER = {
  coral: "salmon",
  salmon: "coral",
  peach: "salmon",
  pink: "rose",
  lilac: "pink"
}, driftGrids = /* @__PURE__ */ new WeakMap(), CLOUDS = [
  {
    at: [0.84, 0.42],
    size: 54,
    puffs: [
      [-0.9, 0.18, 0.42],
      [-0.42, -0.08, 0.6],
      [0.15, -0.22, 0.72],
      [0.7, -0.02, 0.55],
      [1.12, 0.2, 0.36],
      [0.2, 0.22, 0.5],
      [-0.3, 0.26, 0.4]
    ]
  },
  {
    at: [0.56, 0.4],
    size: 30,
    puffs: [
      [-0.75, 0.16, 0.38],
      [-0.25, -0.12, 0.58],
      [0.35, -0.04, 0.5],
      [0.82, 0.18, 0.32],
      [0.05, 0.24, 0.42]
    ]
  }
], CLOUD_TUCK = 10, WINGS = {
  round: {
    fore: [
      0.027,
      0.013,
      0.723,
      0.426,
      0.834,
      0.584,
      0.844,
      0.696,
      0.813,
      0.786,
      0.758,
      0.857,
      0.682,
      0.905,
      0.592,
      0.929,
      0.502,
      0.944,
      0.421,
      0.969,
      0.347,
      1.006,
      0.269,
      1.042,
      0.187,
      1.059,
      0.102,
      1.057,
      0.018,
      1.047,
      -0.063,
      1.03,
      -0.139,
      0.992,
      -0.202,
      0.913,
      -0.239,
      0.781,
      -0.231,
      0.586,
      -0.013,
      0.027
    ],
    hind: [
      -8e-3,
      0.029,
      -0.168,
      0.446,
      -0.267,
      0.568,
      -0.352,
      0.615,
      -0.43,
      0.628,
      -0.508,
      0.627,
      -0.584,
      0.613,
      -0.65,
      0.581,
      -0.703,
      0.534,
      -0.751,
      0.48,
      -0.802,
      0.426,
      -0.854,
      0.369,
      -0.89,
      0.303,
      -0.899,
      0.228,
      -0.883,
      0.149,
      -0.854,
      0.075,
      -0.814,
      6e-3,
      -0.751,
      -0.055,
      -0.644,
      -0.1,
      -0.472,
      -0.112,
      -0.029,
      -9e-3
    ],
    scallop: [0, 0, 0, 0],
    cells: [7, 7]
  },
  broad: {
    fore: [
      0.027,
      0.013,
      0.749,
      0.445,
      0.842,
      0.598,
      0.844,
      0.711,
      0.808,
      0.803,
      0.744,
      0.872,
      0.662,
      0.918,
      0.575,
      0.954,
      0.495,
      0.997,
      0.419,
      1.052,
      0.337,
      1.104,
      0.247,
      1.133,
      0.152,
      1.138,
      0.057,
      1.131,
      -0.035,
      1.121,
      -0.125,
      1.1,
      -0.207,
      1.048,
      -0.272,
      0.956,
      -0.31,
      0.826,
      -0.304,
      0.643,
      -0.015,
      0.026
    ],
    hind: [
      -7e-3,
      0.029,
      -0.176,
      0.521,
      -0.283,
      0.654,
      -0.383,
      0.717,
      -0.478,
      0.742,
      -0.561,
      0.732,
      -0.626,
      0.69,
      -0.673,
      0.63,
      -0.718,
      0.569,
      -0.77,
      0.513,
      -0.826,
      0.458,
      -0.874,
      0.395,
      -0.909,
      0.324,
      -0.935,
      0.249,
      -0.959,
      0.172,
      -0.971,
      0.094,
      -0.951,
      0.013,
      -0.88,
      -0.06,
      -0.756,
      -0.114,
      -0.567,
      -0.134,
      -0.029,
      -9e-3
    ],
    scallop: [0, 0, 0, 0],
    cells: [8, 7]
  },
  slim: {
    fore: [
      0.026,
      0.014,
      0.756,
      0.472,
      0.872,
      0.633,
      0.88,
      0.738,
      0.851,
      0.822,
      0.811,
      0.9,
      0.756,
      0.968,
      0.685,
      1.015,
      0.605,
      1.047,
      0.526,
      1.078,
      0.449,
      1.112,
      0.37,
      1.14,
      0.285,
      1.142,
      0.196,
      1.112,
      0.112,
      1.065,
      0.036,
      1.017,
      -0.034,
      0.963,
      -0.093,
      0.886,
      -0.135,
      0.764,
      -0.143,
      0.575,
      -9e-3,
      0.029
    ],
    hind: [
      -0.01,
      0.028,
      -0.174,
      0.386,
      -0.271,
      0.497,
      -0.358,
      0.553,
      -0.436,
      0.575,
      -0.5,
      0.565,
      -0.549,
      0.534,
      -0.591,
      0.494,
      -0.638,
      0.456,
      -0.688,
      0.418,
      -0.733,
      0.373,
      -0.765,
      0.32,
      -0.785,
      0.261,
      -0.802,
      0.201,
      -0.811,
      0.14,
      -0.801,
      0.077,
      -0.757,
      0.016,
      -0.677,
      -0.037,
      -0.568,
      -0.074,
      -0.417,
      -0.086,
      -0.029,
      -8e-3
    ],
    scallop: [0, 0, 0, 0],
    cells: [6, 6]
  }
}, WING_NAMES = Object.keys(WINGS), SHAPE_WIDTH = 1024, CELLS = new Float32Array(WING_NAMES.flatMap((name) => [...WINGS[name].cells, 0, 0])), FORE_RANGE = [-62 * Math.PI / 180, 72 * Math.PI / 180], HIND_RANGE = [-115 * Math.PI / 180, -4 * Math.PI / 180], FORE_BOX = [-0.6, 1.2, 0, 1.26], HIND_BOX = [-1.02, 0.02, -0.3, 0.98], PASTELS = {
  yellow: {
    inks: ["#fbf1b8", "#fcf2b4", "#fcee98", "#fbe777", "#fcf4c4", "#b0a060", "#f2c46a"],
    wake: [
      [226, 196, 84],
      [250, 236, 150]
    ]
  },
  orange: {
    inks: ["#fdecd8", "#fbcf9f", "#fab880", "#f9a564", "#fbd3a9", "#c48a58", "#f6c25e"],
    wake: [
      [236, 150, 92],
      [250, 190, 140]
    ]
  },
  blue: {
    inks: ["#d9e6f9", "#b1cdf1", "#96bcec", "#7caee3", "#bcd3f3", "#6f8db8", "#e9bd85"],
    wake: [
      [112, 160, 226],
      [160, 196, 245]
    ]
  }
}, PASTEL_NAMES = ["yellow", "orange", "blue"], FLIGHT = {
  bursts: [1, 0.8],
  rise: 50,
  sink: 60,
  settle: 0.55,
  glide: 0.2,
  hop: 0.07,
  surge: 0.06,
  slant: 1.08,
  spread: 0.3,
  leans: [0.42, 0.24],
  away: -0.9,
  pose: [0.2, 0.45],
  open: 0.14,
  shut: 1.42,
  soar: 0.34,
  snap: 1.5,
  shallow: 0.3,
  sweep: [0.2, 0],
  room: 1.15,
  give: 1e3
}, WING = {
  fan: 6,
  pitch: 1.75,
  closest: 1.3,
  keep: 0.25,
  fill: 0.76,
  brick: [44, 130],
  gap: 0.34,
  flow: 0.012,
  beadCell: 7,
  beadChance: 0.12,
  beadSize: 0.45,
  blotch: 2.2,
  grain: 0.22,
  /* How much of the glass's own patterning shows, as a share of what it was first drawn with: the beams through the root,
     the striations, the blown panes, the bubbles and the glints. `veins` is the same for the veins alone, which read
     most. A wing should look like glass from across the room and only show how it was made when you look closely. */
  texture: 0.5,
  veins: 0.4,
  /* How far each wing's colours are drawn together towards the one colour of its glass, so that it reads as a single
     pastel, paler and deeper, and not as a run of colours. The warm middle runs out less far into it for the same reason. */
  mono: 0.45
}, ANTENNA = {
  root: 0.2,
  reach: 0.36,
  spread: 0.12,
  curl: 0.05,
  rise: 0.1,
  wide: [0.36, 0.3],
  ink: [
    [0.47, 0.46, 0.45],
    [0.7, 0.69, 0.68]
  ]
}, FLOCK = [
  { size: 20, speed: 40, lane: 0.3, seed: 0.13, pastel: 0, wing: "round" },
  { size: 26, speed: 47, lane: 0.62, seed: 0.46, pastel: 1, wing: "broad" },
  { size: 23, speed: 43, lane: 0.46, seed: 0.79, pastel: 2, wing: "slim" },
  { size: 18, speed: 38, lane: 0.18, seed: 0.31, pastel: 0, wing: "broad" }
], AIR = {
  top: [
    [-1.6, 0],
    [-1, -0.14],
    [-0.5, -0.2],
    [-0.2, -0.1],
    [0, 0],
    [0.5, 0.12],
    [1, 0.22],
    [1.6, 0.3]
  ],
  foot: [
    [-1.6, 0.8],
    [-0.5, 0.66],
    [0, 0.72],
    [0.5, 0.82],
    [1.6, 0.98]
  ]
}, LENS = {
  in: 0.72,
  bend: 3.2,
  split: 0.05,
  along: 0.05,
  soften: 3,
  band: [0.3, 0.3],
  bandMost: [170, 62],
  round: 6,
  halo: [2.6, 0.34]
}, GRAIN = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n' x='0' y='0' width='100%25' height='100%25' color-interpolation-filters='sRGB'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.25' numOctaves='2' seed='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 1.015 -0.0075 0 0 0 1.015 -0.0075 0 0 0 1.015 -0.0075 0 0 0 0 1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E", GRAIN_TILE = 160, HERO = {
  draw: "live",
  wake: null,
  near: null,
  // the home page's words, or the docs overview's where this meadow stands in for the docs composition's hero
  words: ".hl-copy, .dc-copy",
  behind: null,
  lines: LINES,
  inks: LAND_INK,
  sky: null,
  land: {
    profile: BLISS,
    crest: CREST,
    relief: RELIEF,
    sheets: LAND,
    sink: SHRUB_SINK,
    room: LAND_ROOM,
    foot: LAND_FOOT,
    head: LAND_HEAD,
    least: 120
  },
  grass: GRASS,
  stir: STIR,
  passer: PASSER,
  pointer: !0,
  flowers: FLOWERS,
  paints: PAINTS,
  palettes: PALETTES,
  clouds: CLOUDS,
  cloudTuck: CLOUD_TUCK,
  flock: FLOCK,
  air: AIR,
  lens: LENS,
  fit: (w, h) => clamp(Math.min(w / 1300, (h + 100) / 760), 0.56, 1.3),
  stillAt: 6,
  plant: null
}, FOOTER_ROOM = 416, FOOTER_CARD = 140 / FOOTER_ROOM, FOOTER_PAST = 24, FOOTER_RELIEF = [0.7, 1.1], footerLine = (points) => ({ crest: points.map(([across, px]) => [across, px / FOOTER_ROOM]) }), footerCurve = (points) => (x) => {
  let last = points.length - 1;
  if (x <= points[0][0])
    return points[0][1];
  if (x >= points[last][0])
    return points[last][1];
  let k = 0;
  for (; points[k + 1][0] < x; )
    k += 1;
  let slope = (a, b) => (points[b][1] - points[a][1]) / (points[b][0] - points[a][0]), m0 = k > 0 ? slope(k - 1, k + 1) : slope(k, k + 1), m1 = k + 1 < last ? slope(k, k + 2) : slope(k, k + 1), h = points[k + 1][0] - points[k][0], f = (x - points[k][0]) / h;
  return (2 * f ** 3 - 3 * f ** 2 + 1) * points[k][1] + (f ** 3 - 2 * f ** 2 + f) * h * m0 + (-2 * f ** 3 + 3 * f ** 2) * points[k + 1][1] + (f ** 3 - f ** 2) * h * m1;
}, footerHigher = (one, other) => {
  let [a, b] = [footerCurve(one), footerCurve(other)];
  return Array.from({ length: 65 }, (_, k) => {
    let across = -1.6 + k * 0.05;
    return [across, Math.min(a(across), b(across))];
  });
}, FOOTER_SKY = [
  [-1.6, -66],
  [-1.3, -78],
  [-1.1, -94],
  [-1, -104],
  [-0.9, -116],
  [-0.78, -125],
  [-0.6, -130],
  [-0.3, -124],
  [0, -118],
  [0.3, -120],
  [0.6, -128],
  [0.78, -124],
  [0.9, -114],
  [1, -102],
  [1.1, -92],
  [1.3, -78],
  [1.6, -66]
], FOOTER_SIDE = 40, UNDER_HILLS = {
  hill: [
    [-1.6, 0.06],
    [1.6, 0.06]
  ]
}, FOOTER_RIDGE = [
  [-1.6, 44],
  [-1.2, 44],
  [-0.9, 44],
  [-0.6, 44],
  [-0.35, 44],
  [-0.1, 44],
  [0.15, 44],
  [0.35, 44],
  [0.5, 34],
  [0.6, 0],
  [0.7, -50],
  [0.8, -65],
  [0.88, -76],
  [0.95, -73],
  [1.02, -79],
  [1.15, -74],
  [1.4, -62],
  [1.6, -56]
], FOOTER_HILL = [
  [-1.6, -53],
  [-1.3, -71],
  [-1.1, -81],
  [-0.98, -85],
  [-0.9, -79],
  [-0.8, -50],
  [-0.7, -18],
  [-0.58, -7],
  [-0.4, -5],
  [-0.2, -5],
  [0, -5],
  [0.15, -6],
  [0.28, -9],
  [0.4, -3],
  [0.55, 16],
  [0.7, 37],
  [0.9, 65],
  [1.1, 90],
  [1.6, 136]
], FOOTER_DOME = [
  [-0.1, 108],
  [0.05, 62],
  [0.2, 24],
  [0.3, 0],
  [0.38, -10],
  [0.5, -14],
  [0.6, -18],
  [0.7, -24],
  [0.78, -36],
  [0.86, -52],
  [0.92, -59],
  [1.05, -57],
  [1.25, -50],
  [1.6, -34]
], FOOTER_FAR_TOP = 8 - Math.min(
  ...[...FOOTER_HILL, ...FOOTER_RIDGE, ...FOOTER_DOME].filter(([across]) => Math.abs(across) <= 1.1).map(([, px]) => px)
), FOOTER_RIGHT_RISE = [
  [-0.1, 132],
  [0.1, 106],
  [0.3, 82],
  [0.5, 64],
  [0.7, 52],
  [0.9, 49],
  [1.1, 55],
  [1.4, 70],
  [1.6, 80]
], FOOTER_LEFT_RISE = [
  [-1.6, 6],
  [-1.3, 9],
  [-1, 16],
  [-0.75, 27],
  [-0.5, 40],
  [-0.25, 54],
  [0, 68],
  [0.25, 84],
  [0.5, 103],
  [0.75, 126],
  [1, 152],
  [1.2, 176]
], FOOTER_MEADOW = [
  [-1.4, 100],
  [-1.15, 108],
  [-1, 115],
  [-0.8, 127],
  [-0.5, 146],
  [-0.2, 162],
  [0, 168],
  [0.2, 165],
  [0.5, 150],
  [0.8, 128],
  [1, 114],
  [1.15, 107],
  [1.4, 100]
], FOOTER_INK = {
  ...LAND_INK,
  crest: ["#a8d355", "#b8de6c"],
  mist: ["#add07b", "#bcda8e"],
  sage: ["#68a161", "#84b778"],
  fern: ["#4e865b", "#6ba172"],
  glow: ["#c3d454", "#cddc69"],
  gilt: ["#e5c95c", "#ebd473"],
  // the land in front, in shade: deeper and cooler than the hero's, as the shade of a hillside at the end of the day
  green: ["#4a962c", "#4d9433"],
  deepGreen: ["#2c6a24", "#2f6629"],
  shade: ["#25502a", "#244b29"],
  night: ["#1c3f23", "#1b3a21"],
  // the paler side of grass pushed over in the shade: a lighter green, not the hero's near-white
  sheen: ["#8cc054", "#93c55c"]
}, FOOTER_FAR_PAINT = [
  [0, "crest", 0],
  [0.03, "crest", 0.9],
  [0.12, "crest", 1],
  [0.25, "mist", 1],
  [0.4, "fern", 1],
  [0.58, "sage", 1],
  [0.84, "sage", 1],
  [1, "fern", 1]
], FOOTER_NEAR_PAINT = [
  [0, "gilt", 0],
  [0.025, "gilt", 0.85],
  [0.07, "glow", 1],
  [0.16, "lime", 1],
  [0.3, "green", 1],
  [0.55, "deepGreen", 1],
  [0.85, "shade", 1],
  [1, "shade", 1]
], NEAR_HILL_PAINT = [
  [0, "gilt", 0],
  [0.03, "gilt", 0.9],
  [0.09, "glow", 1],
  [0.18, "lime", 1],
  [0.32, "green", 1],
  [0.6, "deepGreen", 1],
  [0.9, "shade", 1],
  [1, "shade", 1]
], FOOTER_SHADE_PAINT = [
  [0, "lime", 0],
  [0.03, "lime", 0.8],
  [0.08, "green", 1],
  [0.2, "deepGreen", 1],
  [0.45, "shade", 1],
  [1, "night", 1]
], NEAR_LEFT = [
  [-1.6, 0.55],
  [-1.25, 0.72],
  [-1, 0.86],
  [-0.8, 0.96],
  [-0.62, 1],
  [-0.45, 0.96],
  [-0.28, 0.84],
  [-0.1, 0.62],
  [0.05, 0.38],
  [0.18, 0.16],
  [0.32, -0.06],
  [0.5, -0.36],
  [0.8, -0.78],
  [1.2, -1.3]
], NEAR_RIGHT = [
  [-0.6, -0.5],
  [-0.3, -0.1],
  [-0.05, 0.14],
  [0.1, 0.22],
  [0.2, 0.28],
  [0.32, 0.42],
  [0.47, 0.6],
  [0.62, 0.68],
  [0.76, 0.66],
  [0.9, 0.56],
  [1.05, 0.45],
  [1.3, 0.32],
  [1.6, 0.24]
], nearLeft = footerCurve(NEAR_LEFT), nearRight = footerCurve(NEAR_RIGHT), nearCrest = (across) => Math.max(nearLeft(across), nearRight(across)), NEAR_CLEAR = 12, NEAR_CALM = 16, shortBand = (room) => room < 215, nearTall = (tall, room = 252) => clamp(tall * 0.14, 36, shortBand(room) ? 70 : 92), nearHeight = ({ w, h, hidden }) => {
  if (!hidden)
    return 0;
  let height = nearTall(hidden.bottom - hidden.top, h - hidden.bottom);
  for (let box of hidden.keep || []) {
    let most = 0;
    for (let x = Math.max(0, box.left); x <= Math.min(w, box.right); x += 2)
      most = Math.max(most, nearCrest(x / (w / 2) - 1));
    most > 0 && (height = Math.min(height, (hidden.bottom - box.bottom - NEAR_CLEAR) / most));
  }
  return Math.max(0, height);
}, nearGuide = (curve, from, to) => (stage) => {
  let { hidden, room, base } = stage, height = nearHeight(stage), count = Math.round((to - from) / 0.05);
  return Array.from({ length: count + 1 }, (_, k) => {
    let across = from + k * 0.05;
    return [across, hidden ? (hidden.bottom - height * curve(across) - base) / room : 0.9];
  });
}, NEAR_SHRUBS_RIGHT = [
  [0.19, 13, 8, !1],
  [0.66, 16, 10, !0]
], NEAR_SHRUBS_LEFT = [[-0.95, 14, 9, !1]], NEAR_BANDS = [[-1.7, 1.7, 0.55, 1.8, "gold field", 1, "apricots", "cool specks"]], NEAR_BAND_DAB = 3.8, GOLD_LIGHT = [
  ["saffron", "apricot"],
  ["apricot", "gold"],
  ["marigold", "saffron"],
  ["gold", "apricot"]
], RIM_LIGHT = [
  ["butter", "apricot"],
  ["apricot", "butter"],
  ["saffron", "butter"]
], CREST_GLOW = [
  ["near", -1.7, 1.7, 1.25, GOLD_LIGHT, 0.1, 1],
  ["left rise", -1.7, 0.2, 0.9, GOLD_LIGHT, 0, 1],
  ["near", -1.7, 1.7, 0.8, RIM_LIGHT, 0.1, 0.5]
], GLOW_HIDDEN_BY = { "left rise": ["meadow"], "right rise": ["left rise", "meadow"] }, NEAR_FOOT = footerLine(
  footerHigher(footerHigher(FOOTER_RIGHT_RISE, FOOTER_LEFT_RISE), FOOTER_MEADOW).map(([across, px]) => [
    across,
    px + 30
  ])
), FOOTER_PAINTS = {
  ...PAINTS,
  marigold: ["#f5a12c", "#f6a838"],
  tangerine: ["#ee8526", "#f08d30"],
  saffron: ["#f8bd45", "#f9c352"],
  apricot: ["#fcd07a", "#fcd585"],
  gold: ["#e9b438", "#ecba42"],
  butter: ["#f7da78", "#f8dd80"],
  cornflower: ["#4c70e2", "#6889ef"],
  azure: ["#6d93f1", "#86a6f5"],
  indigo: ["#3a54c9", "#5470da"],
  periwinkle: ["#9cb1f6", "#afc1f8"],
  violet: ["#7a6cd8", "#9185e4"]
}, FOOTER_BOKEH = [
  ["cornflower", "indigo"],
  ["indigo", "violet"],
  ["azure", "cornflower"],
  ["cornflower", "azure"],
  ["violet", "indigo"],
  ["indigo", "violet"]
], FOOTER_PALETTES = {
  marigolds: [
    ["marigold", 4],
    ["tangerine", 1.6],
    ["saffron", 2.6],
    ["gold", 1.2],
    ["apricot", 1.2],
    ["butter", 0.5]
  ],
  sunlit: [
    ["saffron", 3],
    ["apricot", 2.4],
    ["marigold", 1.6],
    ["butter", 0.8],
    ["gold", 0.5]
  ],
  // the cornflowers, in the meadow's shade and rising into the right rise's: blue and violet alone, and only a few of
  // the palest, which out of focus at the front read as white tufts
  cornflowers: [
    ["cornflower", 4],
    ["azure", 2.2],
    ["indigo", 2.2],
    ["periwinkle", 0.4],
    ["violet", 0.9]
  ],
  // far off, specks of gold where the light is, and cool ones where it is not
  "gold specks": [
    ["marigold", 2.4],
    ["saffron", 2.2],
    ["tangerine", 0.7],
    ["apricot", 1],
    ["butter", 0.5]
  ],
  // led by the blues: periwinkle, the palest, reads as frost on a dark page
  "cool specks": [
    ["azure", 2],
    ["cornflower", 1.6],
    ["periwinkle", 0.8],
    ["violet", 0.6]
  ],
  // the band of light along the near hills' crests, and the warmer flowers lower down it and under the left rise's band
  "gold field": [
    ["marigold", 2.2],
    ["saffron", 2],
    ["gold", 2.6],
    ["butter", 1],
    ["apricot", 1.4],
    ["coral", 0.2]
  ],
  apricots: [
    ["apricot", 2.4],
    ["tangerine", 0.8],
    ["peach", 1.2],
    ["salmon", 1.2],
    ["coral", 1]
  ]
}, footerProfile = footerCurve(footerHigher(FOOTER_HILL, FOOTER_DOME)), footerNear = (across, px) => {
  let crest = footerProfile(across) / FOOTER_ROOM;
  return (px / FOOTER_ROOM - crest - 0.03) / (0.95 - FOOTER_CARD - crest - 0.03);
}, alongCrest = (points, below, from, to, step = 0.15) => {
  let crest = footerCurve(points), count = Math.max(1, Math.round((to - from) / step));
  return Array.from({ length: count + 1 }, (_, k) => {
    let across = from + (to - from) * k / count;
    return [across, footerNear(across, crest(across) + (typeof below == "function" ? below(across) : below))];
  });
}, footerCover = (w, room) => {
  let front = shortBand(room) ? 0.7 : 1, far = shortBand(room) ? 0.8 : 1;
  return [
    [0, 2.4 * far],
    [0.08, 3 * far],
    [0.14, 3.4 * far],
    [0.36, 3.2 * far],
    [0.46, 1.8],
    [0.6, 1.5],
    [0.72, 1.5],
    [0.8, 2.4 * front],
    [1, 2 * front]
  ];
}, FOOTER = {
  ...HERO,
  // no opening: its first picture is the finished meadow
  intro: !1,
  // Built in idle time once within a little over three screens, and first painted when within three quarters of one.
  // The canvas reaches up only as far as its land does (see `cover`), so its top is about a tenth of a screen lower
  // than it was; woken that much sooner, the build still starts where it always has, where the page's own work is calm
  // when it asks for its context (a little later down the home page, that one step sometimes took 34 ms).
  wake: "310% 0px",
  near: "75% 0px",
  words: null,
  // the footer, which the far land keeps behind and the near hills come up in front of, clear of what is in it
  behind: ".docs-global-footer",
  keep: ".footer-content",
  // How far up over the footer the canvas reaches above the band's top, in CSS pixels, for the band's width and the
  // footer's height: where the band shows beside the footer wide enough for the sky (FOOTER_SIDE, on either side: on
  // some widths the footer keeps to the left of the band), far enough for the sky over the far hills, as `relief` and
  // the band's own room scale it (a phone's shorter band has a smaller room, see `room`), with the gap between the
  // footer and the band and room for the sky's lines to breathe; where only a sliver shows, far enough for the far hills
  // there and the shrubs on them; and far enough everywhere for the near hills at their highest and the shrubs that
  // peek over them. No further: the canvas never reaches up where nothing of the land would be.
  cover: ({ width, tall }) => {
    let card = document.querySelector(".docs-global-footer")?.getBoundingClientRect(), band = document.querySelector(".docs-footer-band")?.getBoundingClientRect(), gap = card && band ? Math.max(0, band.top - card.bottom) : 12, room = band ? band.height + gap : 252, scale = clamp(width / 1232, FOOTER_RELIEF[0], FOOTER_RELIEF[1]) * (room + FOOTER_PAST) / (1 - FOOTER_CARD) / FOOTER_ROOM, side = card && band ? Math.max(card.left - band.left, band.right - card.right) : 0, near = gap + nearTall(tall || 0, room) + 26;
    return side >= FOOTER_SIDE ? Math.round(Math.max(near, gap + 14 - Math.min(...FOOTER_SKY.map(([, px]) => px)) * scale)) : Math.round(side > 0.5 ? Math.max(near, gap + 12 + FOOTER_FAR_TOP * scale) : near);
  },
  // Solid down to the foot of the page, every line run the whole way across, past the screen's right edge, and fewer of
  // the beads of light along the lines, so that they glint here and there rather than sparkle over the flowers. On a
  // light page the land between the lines is lifted only a little towards white (0.08, not the hero's 0.3), so that
  // the land in shade reads as deep paint rather than as stripes.
  lines: { ...LINES, sink: 1e-3, whole: !0, beadChance: 0.15, lift: 0.08 },
  inks: FOOTER_INK,
  land: {
    ...HERO.land,
    profile: footerLine(footerHigher(FOOTER_HILL, FOOTER_DOME)).crest,
    crest: FOOTER_CARD,
    relief: FOOTER_RELIEF,
    sheets: [
      {
        name: "sky",
        // where the band beside the footer is too narrow for it (FOOTER_SIDE), it lies under the far hills, unseen
        top: ({ w, hidden }) => hidden && Math.max(hidden.left, w - hidden.right) < FOOTER_SIDE ? UNDER_HILLS : footerLine(FOOTER_SKY),
        // it runs on under the far hills, so that no page shows at their crests
        foot: {
          hill: [
            [-1.6, 0.07],
            [1.6, 0.07]
          ]
        },
        // light, and thinning into the page at its top: a haze of sky rather than a block of it
        paint: [
          [0, "pale", 0],
          [0.14, "pale", 0.32],
          [0.3, "sky", 0.7],
          [0.46, "blue", 0.88],
          [0.62, "sky", 1],
          [0.8, "pale", 1],
          [1, "pale", 1]
        ],
        fill: 0.7,
        under: 0.38,
        flow: 1.2,
        breath: 2
      },
      /* A strip of land under all the rest along the right edge. It was the backstop for the notches of page that the
         few lines which stopped a pixel or two short of the canvas's edge left there, before `lines.whole` carried
         every line through; it stays because each sheet's lines are seeded by its place in this list, and taking it
         out would draw all of them again differently. */
      {
        name: "right edge",
        opaque: !0,
        top: footerLine(
          FOOTER_RIDGE.filter(([across]) => across >= 0.8).map(([across, px]) => [Math.max(across, 0.84), px])
        ),
        foot: [
          [0.84, 1.1],
          [1.6, 1.1]
        ],
        paint: [
          [0, "slateHaze", 0],
          [0.01, "slate", 1],
          [0.06, "sage", 1],
          [0.5, "green", 1],
          [1, "olive", 1]
        ],
        fill: 0.72,
        under: 0.6,
        flow: 0.5,
        breath: 1.2
      },
      {
        name: "far ridge",
        opaque: !0,
        top: footerLine(FOOTER_RIDGE),
        foot: {
          hill: [
            [-1.6, 0.12],
            [1.6, 0.12]
          ]
        },
        paint: [
          [0, "slateHaze", 0],
          [0.08, "slateHaze", 0.8],
          [0.4, "slate", 1],
          [1, "slate", 1]
        ],
        fill: 0.72,
        under: 0.5,
        patch: 0.2,
        flow: 0.5,
        breath: 1.2
      },
      {
        name: "hill",
        opaque: !0,
        top: footerLine(FOOTER_HILL),
        foot: footerLine([
          [-1.6, 108],
          [-0.8, 102],
          [-0.3, 93],
          [0.2, 93],
          [0.6, 87],
          [1.6, 124]
        ]),
        paint: FOOTER_FAR_PAINT,
        lean: 0.3,
        fill: 0.74,
        under: 0.78,
        patch: 0.15,
        flow: 0.6,
        breath: 1.4
      },
      {
        name: "dome",
        opaque: !0,
        top: footerLine(FOOTER_DOME),
        foot: footerLine([
          [-0.1, 143],
          [0.3, 93],
          [0.8, 87],
          [1.6, 93]
        ]),
        paint: FOOTER_FAR_PAINT,
        lean: 0.3,
        fill: 0.74,
        under: 0.78,
        patch: 0.15,
        flow: 0.6,
        breath: 1.4
      },
      // gorse on the far hills' crests beside the footer, as small as the hills under them are low, and on the left further
      // in than the near hill's shrub, so that the two never stand one over the other
      {
        name: "far shrubs",
        opaque: !0,
        on: "hill",
        shrubs: [
          [-0.8, 14, 8, !0],
          [-1.03, 9, 6, !1],
          [0.97, 13, 8, !0]
        ],
        paint: SHRUB_PAINT,
        fill: 0.8,
        under: 0.7,
        patch: 0.25,
        flow: 0.3,
        breath: 0.8
      },
      {
        name: "right rise",
        opaque: !0,
        top: footerLine(FOOTER_RIGHT_RISE),
        foot: footerLine([
          [-0.1, 232],
          [0.5, 224],
          [1.6, 216]
        ]),
        paint: FOOTER_SHADE_PAINT,
        lean: 0.25,
        fill: 0.88,
        under: 0.88,
        patch: 0.3,
        flow: 0.7,
        breath: 1.6,
        sheen: 0.6
      },
      {
        name: "left rise",
        opaque: !0,
        top: footerLine(FOOTER_LEFT_RISE),
        foot: footerLine([
          [-1.6, 196],
          [-0.8, 214],
          [0, 226],
          [0.6, 222],
          [1.2, 262]
        ]),
        paint: FOOTER_NEAR_PAINT,
        lean: 0.25,
        fill: 0.88,
        under: 0.88,
        patch: 0.3,
        flow: 0.7,
        breath: 1.6,
        sheen: 0.6
      },
      {
        name: "meadow",
        opaque: !0,
        top: footerLine(FOOTER_MEADOW),
        // the land's own foot, past the canvas's
        foot: [
          [-1.6, 1],
          [1.6, 1]
        ],
        // lit along its crest, and in its own shade under the cornflowers, deepening towards the front
        paint: [
          [0, "lime", 0],
          [0.03, "lime", 0.85],
          [0.07, "lime", 1],
          [0.14, "green", 1],
          [0.3, "deepGreen", 1],
          [0.6, "shade", 1],
          [1, "night", 1]
        ],
        fill: 0.92,
        under: 0.9,
        patch: 0.2,
        flow: 0.8,
        breath: 2,
        // Where the unseen passer parts the grass it shows its paler side (FOOTER_INK's sheen), but only so far: over
        // the deep shade at the front a full sheen read as a smear of fog behind it, just as a reader arrives.
        sheen: 0.5
      },
      // a dark shrub in flower where the meadow rises into each corner, as low as the meadow is shallow and wider than tall
      {
        name: "near shrubs",
        opaque: !0,
        on: "meadow",
        shrubs: [
          [-0.94, 22, 11, !0],
          [0.93, 24, 11, !0]
        ],
        paint: SHRUB_PAINT,
        fill: 0.8,
        under: 0.7,
        patch: 0.25,
        flow: 0.3,
        breath: 0.8
      },
      /* The near hills in front of the footer, after all the rest so that every other sheet keeps its place in this list,
         and so its lines and its patches; they are drawn where `front` puts them, in front of the footer and behind the
         rises. Each is painted as the rises are, from their row. */
      {
        name: "near right",
        opaque: !0,
        top: nearGuide(nearRight, -0.6, 1.6),
        foot: NEAR_FOOT,
        paint: "right rise",
        lean: 0.25,
        fill: 0.88,
        under: 0.88,
        patch: 0.3,
        flow: 0.7,
        breath: 1.6,
        sheen: 0.6
      },
      {
        name: "near left",
        opaque: !0,
        top: nearGuide(nearLeft, -1.6, 1.2),
        foot: NEAR_FOOT,
        paint: NEAR_HILL_PAINT,
        lean: 0.25,
        fill: 0.88,
        under: 0.88,
        patch: 0.3,
        flow: 0.7,
        breath: 1.6,
        sheen: 0.6
      },
      // round shrubs peeking over their crests, clear of the footer's content (see NEAR_SHRUBS_RIGHT)
      {
        name: "near hill shrubs",
        opaque: !0,
        on: "near right",
        shrubs: NEAR_SHRUBS_RIGHT,
        paint: "near shrubs",
        fill: 0.8,
        under: 0.7,
        patch: 0.25,
        flow: 0.3,
        breath: 0.8
      },
      {
        name: "near left shrubs",
        opaque: !0,
        on: "near left",
        shrubs: NEAR_SHRUBS_LEFT,
        paint: "near shrubs",
        fill: 0.8,
        under: 0.7,
        patch: 0.25,
        flow: 0.3,
        breath: 0.8
      }
    ],
    // in front of the footer, in the order they are drawn: the near hills and what grows on them, then the rises and the
    // meadow; every other sheet is behind it
    front: [
      "near right",
      "near hill shrubs",
      "near left",
      "near left shrubs",
      "right rise",
      "left rise",
      "meadow",
      "near shrubs"
    ],
    // A room is as many pixels as puts the footer's foot FOOTER_CARD of the way down the land, with the land's foot
    // FOOTER_PAST pixels under the canvas's (so that nothing at the foot of the page is ever left thin); its top may
    // run up past the canvas, behind the footer, where nothing shows.
    room: ({ h, hidden }) => (h - (hidden ? hidden.bottom : 0) + FOOTER_PAST) / (1 - FOOTER_CARD),
    foot: -FOOTER_PAST,
    head: -1e4,
    least: 120
  },
  // the unseen passer keeps to the meadow at the front
  passer: { ...PASSER, lane: 0.84 },
  // grass as short as the meadow is shallow, and deep in its shade at the front
  grass: { ...GRASS, tall: [6, 28], inks: ["lime", "green", "deepGreen", "shade", "leaf"] },
  flowers: {
    ...FLOWERS,
    // a wide screen shows the meadow on past the drifts' stage, and its front corners are in flower too
    front: 1.65,
    // Smaller at the front than the hero's and larger further back, a dab rather than a dot: a field, not a heap; and as
    // small at the front as the meadow is shallow. The eye is on the gold band, so the cornflowers in front of it are
    // soft, and the specks behind it softer still, so that far off they run together into fields of colour.
    size: { far: 2, close: 10, curve: 1.8, own: [0.65, 1.35] },
    focus: 0.28,
    blur: { behind: 0.9, deepest: 2, front: 1.05, most: 0.45, least: 1.3 },
    cover: footerCover,
    // Far off each speck is larger than its depth's size, so that fewer of them cover the same ground: dabs of a field
    // rather than a dust of dots, and a lighter load to draw.
    far: [1.05, 1.6],
    // far off they stay strong, a field of colour, not a haze
    fade: [0, 0.3, 0.72],
    crisp: 3e-3,
    stems: 0.12,
    leaves: 0.15,
    bed: 0.3,
    drifts: [
      // The gold band, lying in the light along the left rise's upper slope from the left edge and down to the right as
      // the hill falls, broadest on the left and breaking into clumps as it goes; its lit core paler and fuller.
      {
        line: alongCrest(FOOTER_LEFT_RISE, (across) => 26 + 8 * Math.sin(across * 4.1 + 0.6), -1.75, 0.5, 0.1),
        wide: [0.2, 0.07],
        full: [1, 0.75],
        paints: "marigolds",
        patchy: !0,
        patchyFrom: 0.62,
        own: [0.75, 1.15]
      },
      {
        line: alongCrest(FOOTER_LEFT_RISE, (across) => 10 + 4 * Math.sin(across * 5.3 + 1.7), -1.6, 0, 0.1),
        wide: [0.1, 0.05],
        full: [1, 0.85],
        paints: "sunlit",
        patchy: !0,
        patchyFrom: 0.7,
        own: [0.9, 1.5]
      },
      // The right rise is turned from the light: a few patches of gold along its crest, where the last of it catches the
      // flowers, above the cornflowers rising into its shade, with plain green between them; each a thin, full strip, so
      // that it reads as a field's colour and not as a sprinkle of single petals.
      {
        line: alongCrest(FOOTER_RIGHT_RISE, 9, 0.3, 1.75),
        wide: [0.04, 0.05],
        full: [0.8, 0.85],
        paints: "marigolds",
        patchy: !0,
        gaps: !0
      },
      // cornflowers rising from the meadow up into the right rise's shade, under its patches of gold
      {
        line: alongCrest(FOOTER_RIGHT_RISE, (across) => 42 - 14 * across, 0.3, 1.75),
        wide: [0.08, 0.1],
        full: [0.55, 0.75],
        paints: "cornflowers",
        patchy: !0,
        gaps: !0
      },
      // The far land under the footer, on the near hills' lower slopes: specks of gold in the light on the left, fewer
      // and cool in the shade on the right.
      {
        line: [
          [-1.75, 0.1],
          [-1, 0.08],
          [-0.5, 0.06],
          [0, 0.05]
        ],
        wide: [0.11, 0.11],
        full: [0.9, 0.8],
        paints: "gold specks",
        patchy: !0
      },
      {
        line: [
          [0.1, 0.05],
          [0.5, 0.06],
          [1, 0.08],
          [1.75, 0.1]
        ],
        wide: [0.11, 0.11],
        full: [0.55, 0.65],
        paints: "cool specks",
        patchy: !0
      },
      // and on the far hills beside the footer, gold on the left and cool on the right
      {
        line: [
          [-1.3, 0.03],
          [-0.84, 0.05]
        ],
        wide: [0.05, 0.05],
        full: [0.9, 0.8],
        paints: "gold specks",
        patchy: !0
      },
      {
        line: [
          [0.84, 0.05],
          [1.3, 0.03]
        ],
        wide: [0.05, 0.05],
        full: [0.45, 0.45],
        paints: "cool specks",
        patchy: !0,
        gaps: !0
      },
      // The cornflowers in the meadow's shade, broken into patches with plain green between them, reaching further up the
      // slope on the left to meet the gold; and at the front, apart from it (see cover), the larger soft ones, one by
      // one, on the left of the chat bar's lane (the right's is at the end of the list).
      {
        line: alongCrest(FOOTER_MEADOW, (across) => 22 + 8 * across, -1.75, 1.75, 0.25),
        wide: [0.17, 0.15],
        full: [0.85, 0.7],
        paints: "cornflowers",
        patchy: !0
      },
      {
        line: [
          [-1.75, 0.92],
          [-0.36, 0.92]
        ],
        wide: [0.08, 0.08],
        full: [0.3, 0.3],
        paints: "cornflowers"
      },
      // where the two meet, gold scattered in the blue's upper edge, small: the meadow's only gold
      {
        line: alongCrest(FOOTER_MEADOW, -5, -1.75, 1.75, 0.25),
        wide: [0.035, 0.035],
        full: [0.4, 0.3],
        paints: "marigolds",
        patchy: !0,
        gaps: !0,
        own: [0.6, 0.95]
      },
      // The gold band's lower edge warming into apricot and coral, as the second picture's light does: one thin, patchy
      // drift just under it. The engine breaks each drift into clumps by its place in this list, so a drift added later
      // goes at the end, and every other keeps its clumps.
      {
        line: alongCrest(FOOTER_LEFT_RISE, (across) => 47 + 8 * Math.sin(across * 4.1 + 0.6), -1.75, 0.45, 0.1),
        wide: [0.085, 0.05],
        full: [0.7, 0.4],
        paints: "apricots",
        patchy: !0,
        own: [0.6, 0.95]
      },
      // the front's cornflowers on the right of the chat bar's lane
      {
        line: [
          [0.36, 0.92],
          [1.75, 0.92]
        ],
        wide: [0.08, 0.08],
        full: [0.3, 0.3],
        paints: "cornflowers"
      }
    ],
    // a very few strays in the plain grass, of the meadow's own colours
    strays: 12
  },
  paints: FOOTER_PAINTS,
  palettes: FOOTER_PALETTES,
  // the paint takes a film's grain, the soft strokes nearly as much as the sharp (see bloomFragment)
  film: [0.55, 0.45],
  clouds: [],
  flock: [],
  lens: null,
  fit: (w) => clamp(w / 1300, 0.6, 1.2),
  // the near hills' band of light (see NEAR_BANDS), the light along every lit crest (CREST_GLOW), and cornflowers right
  // in front of the lens
  plant: (garden) => {
    let { w, h, hidden, rand, blurAt, dab, ground } = garden;
    if (!hidden)
      return;
    let height = nearHeight({ w, h, hidden }), half = w / 2, size = Math.max(0.75, clamp(w / 1300, 0.6, 1.2)), columns = Math.ceil(w) + 1, crest = new Float32Array(columns), ceiling = new Float32Array(columns).fill(Number.NEGATIVE_INFINITY);
    for (let x = 0; x < columns; x += 1)
      crest[x] = hidden.bottom - height * nearCrest(x / half - 1);
    for (let box of hidden.keep || [])
      for (let x = Math.max(0, Math.floor(box.left)); x <= Math.min(columns - 1, Math.ceil(box.right)); x += 1)
        ceiling[x] = Math.max(ceiling[x], box.bottom + NEAR_CALM);
    let crestAt = (x) => crest[clamp(Math.round(x), 0, columns - 1)], clear = (x0, x1, top) => {
      for (let x = Math.max(0, Math.floor(x0)); x <= Math.min(columns - 1, Math.ceil(x1)); x += 1)
        if (top < ceiling[x])
          return !1;
      return !0;
    }, shrubSize = Math.max(0.7, w / 1300), shrubs = [...NEAR_SHRUBS_RIGHT, ...NEAR_SHRUBS_LEFT].map(([across, wide]) => [
      (across + 1) * half,
      wide * shrubSize * 1.3
    ]), offShrubs = (x, r) => shrubs.every(([at, reach]) => Math.abs(x - at) > reach + r), totalOf = (list) => list.reduce((sum, [, often]) => sum + often, 0), pick = (list, u) => {
      let left = u * totalOf(list);
      for (let [each, often] of list)
        if (left -= often, left < 0)
          return each;
      return list[list.length - 1][0];
    }, patch = (x, seed, every = 64) => {
      let u = x / every + seed * 7.3, i = Math.floor(u), f = u - i, a = hashed(i * 1.37 + seed * 91.1);
      return a + (hashed((i + 1) * 1.37 + seed * 91.1) - a) * f * f * (3 - 2 * f);
    };
    for (let [start2, end, deep, cover, palette, seed, lower, cool] of NEAR_BANDS) {
      let from = Math.max(start2, -1.02), to = Math.min(end, 1.02), mean = NEAR_BAND_DAB * Math.max(size, 0.95), count = Math.max(
        0,
        Math.round((to - from) * half * deep * height * cover / (Math.PI * 0.7 * mean * mean))
      );
      for (let k = 0; k < count; k += 1) {
        let across = from + (to - from) * rand(), down = rand() ** 2, r = mean * (0.7 + 0.6 * rand()) * (1.05 - 0.4 * down), thin = rand(), tone = rand(), which = rand(), any = rand(), lean = rand(), flip = rand(), breadth = rand(), loaded = rand(), stiff = rand(), tall = rand(), after = rand(), x = (across + 1) * half;
        if (thin > (1 - 0.75 * smooth(0.15, 0.9, across)) * (0.7 + 0.3 * patch(x, seed + 7, 120)))
          continue;
        let shaded = patch(x, seed + 3, 150) < 0.95 * smooth(0.35, 0.9, across), lit = lower && which < (down - 0.4) * 1.3 ? lower : palette, these = FOOTER_PALETTES[shaded ? cool : lit], name = pick(these, tone < 0.65 ? patch(x, seed) : any), y = crestAt(x) + 2 + deep * height * down, near = 0.24 + 0.14 * down, stem = (1 + 3 * down) * size * (0.4 + 0.6 * tall), blur = blurAt(near) * 1.25;
        if (x < -r || x > w + r || !offShrubs(x, r) || !clear(x - r * 1.2, x + r * 1.2, y - stem - r * 1.5 - blur * 0.6 - 1.5))
          continue;
        let slope = Math.atan2(crestAt(x + 4) - crestAt(x - 4), 8), second = SECOND[name];
        dab({
          x,
          y,
          stem,
          long: r,
          wide: 0.6 + 0.3 * breadth,
          turn: slope + (lean - 0.5) * 0.8 + (flip < 0.5 ? Math.PI : 0),
          blur,
          paints: [name, second[Math.floor(after * second.length)]],
          load: (0.72 + 0.23 * loaded) * (shaded ? 0.8 : 1),
          stiff: 0.3 + 0.3 * stiff
        });
      }
    }
    let step = 10 * size;
    for (let [name, from, to, strength, tints, fade, large] of CREST_GLOW) {
      let topAt = name === "near" ? crestAt : (x) => ground(name, x), before = GLOW_HIDDEN_BY[name] || [];
      for (let x = Math.max(0, (from + 1) * half); x <= Math.min(w, (to + 1) * half); x += step) {
        let at = x + (rand() - 0.5) * step, top = topAt(at), reach = (9 + 4.5 * rand()) * size * large, blur = reach * 0.85, tint = tints[Math.floor(rand() * tints.length)], load = (0.34 + 0.16 * rand()) * strength * (fade ? 1 - 0.9 * smooth(fade, 0.7, at / half - 1) : 1), y = top + reach * 0.95 + blur * 0.5 + 1;
        load < 0.04 || before.some((other) => ground(other, at) < top + reach) || !clear(at - reach * 2, at + reach * 2, y - reach * 1.12 - blur * 0.5 - 1.5) || dab({
          x: at,
          y,
          stem: 0,
          long: reach,
          wide: 0.95,
          blur,
          paints: tint,
          load,
          stiff: 1,
          lean: 0,
          order: top + 30 + large
        });
      }
    }
    let lens = clamp(w / 1232, 0.55, 1);
    for (let k = 0; k < 8; k += 1) {
      let side = k % 2 ? 1 : -1, x = half + side * half * (0.55 + 0.47 * rand()), long = (14 + 10 * rand()) * lens, paint = FOOTER_BOKEH[k % FOOTER_BOKEH.length];
      dab({
        x,
        y: h + long * (0.35 * rand() - 0.25),
        long,
        wide: 0.9,
        turn: rand() * Math.PI,
        blur: long * 0.75,
        paints: paint,
        load: 0.42 + 0.12 * rand(),
        stiff: 0.7
      });
    }
  }
}, ENTERPRISE_INKS = {
  ...LAND_INK,
  // The ranges as snow and ice, quiet behind the fields: snow on the peaks and upper slopes, the palest ice-blue
  // under it and the faintest blue-grey on the sides in shade, the nearer range a little deeper and still icy, so
  // they recede by value. On a dark page the snow keeps its light but is softened, so it never glares.
  snow: ["#f6f9fb", "#e4ebf1"],
  haze: ["#e5eef4", "#d5e0e9"],
  steel: ["#ccdae5", "#bccbd8"],
  mist: ["#d9e5ed", "#c9d6e1"],
  stone: ["#bccbd8", "#adbfcf"],
  stoneDeep: ["#a8bacb", "#9bafc2"],
  // The fields in late-afternoon sun: the nearer ridges a living meadow green, the light catching their crests in
  // lime; and the valley's slopes and floor gold and amber where they are lit, running into spring and meadow greens
  // through the grass and the shade.
  ridgeLit: ["#b5dc5c", "#c2e472"],
  ridge: ["#5fae46", "#72bd57"],
  ridgeDeep: ["#3f9145", "#52a356"],
  sunGold: ["#f7d566", "#f9dc7c"],
  gold: ["#f3be3c", "#f6c756"],
  amber: ["#e9a534", "#eeb14b"],
  spring: ["#a3d34c", "#b2de61"],
  meadow: ["#62b343", "#73c155"],
  meadowDeep: ["#419a43", "#53aa53"]
}, entPeaks = (base, peaks) => Array.from({ length: 129 }, (_, k) => {
  let across = -1.6 + k * 0.025, up = 0;
  for (let [at, high, wide] of peaks)
    up = Math.max(up, high * Math.max(0, 1 - Math.abs(across - at) / wide) ** 1.3);
  return up += 8e-3 * Math.sin(across * 41.3 + base * 7) + 5e-3 * Math.sin(across * 97.1 + 2.1), [Math.round(across * 1e3) / 1e3, Math.round((base - up) * 1e4) / 1e4];
}), ENT_PEAK = [
  [-0.9, 0.86, 0.32],
  [-1.2, 0.56, 0.3]
], ENT_FAR = entPeaks(0.34, [
  [-1.38, 0.38, 0.3],
  [-0.62, 0.32, 0.26],
  [-0.3, 0.36, 0.3],
  [0.12, 0.34, 0.3],
  [0.46, 0.38, 0.28],
  [0.84, 0.44, 0.32],
  [1.2, 0.4, 0.3],
  [1.52, 0.36, 0.3]
]), ENT_RANGE = entPeaks(0.48, [
  [-1.12, 0.3, 0.32],
  [-0.52, 0.24, 0.3],
  [0.28, 0.26, 0.3],
  [0.72, 0.3, 0.3],
  [1.32, 0.32, 0.34]
]), ENT_RIDGES = [
  [-1.6, 0.27],
  [-1.2, 0.25],
  [-0.85, 0.33],
  [-0.5, 0.43],
  [-0.2, 0.49],
  [0.1, 0.51],
  [0.4, 0.45],
  [0.7, 0.37],
  [1, 0.31],
  [1.6, 0.31]
], ENT_SLOPES = [
  [-1.6, 0.5],
  [-1.2, 0.52],
  [-0.8, 0.59],
  [-0.4, 0.68],
  [0, 0.745],
  [0.35, 0.73],
  [0.7, 0.67],
  [1.1, 0.63],
  [1.6, 0.61]
], ENT_FRONT = [
  [-1.6, 0.92],
  [-1, 0.95],
  [-0.5, 0.99],
  [0, 1.03],
  [0.4, 1.09],
  [0.8, 1.17],
  [1.6, 1.21]
], entCurve = (points) => (x) => {
  let last = points.length - 1;
  if (x <= points[0][0])
    return points[0][1];
  if (x >= points[last][0])
    return points[last][1];
  let k = 0;
  for (; points[k + 1][0] < x; )
    k += 1;
  let [x0, y0] = points[k], [x1, y1] = points[k + 1], slope = (a, b) => (points[b][1] - points[a][1]) / (points[b][0] - points[a][0]), m0 = k > 0 ? slope(k - 1, k + 1) : slope(k, k + 1), m1 = k + 1 < last ? slope(k, k + 2) : slope(k, k + 1), span = x1 - x0, f = (x - x0) / span;
  return (2 * f ** 3 - 3 * f ** 2 + 1) * y0 + (f ** 3 - 2 * f ** 2 + f) * span * m0 + (-2 * f ** 3 + 3 * f ** 2) * y1 + (f ** 3 - f ** 2) * span * m1;
}, entFront = entCurve(ENT_FRONT), ENT_KNOLL_PEAK = [0.9, 0.7], ENT_KNOLL_RISE = [-0.15, 0.62], entKnoll = (peak) => Array.from({ length: 49 }, (_, i) => {
  let across = -0.3 + i * 1.9 / 48, t = clamp((across - ENT_KNOLL_RISE[0]) / (ENT_KNOLL_RISE[1] - ENT_KNOLL_RISE[0]), 0, 1), rise = t * t * t * (t * (t * 6 - 15) + 10), ridge = peak + 0.1 * smooth(0.95, 1.6, across), under = entFront(across) + 0.015;
  return [Math.round(across * 1e4) / 1e4, Math.round((under + (ridge - under) * rise) * 1e4) / 1e4];
}), ENT_KNOLL = ({ w }) => entKnoll(ENT_KNOLL_PEAK[0] + (ENT_KNOLL_PEAK[1] - ENT_KNOLL_PEAK[0]) * smooth(760, 1160, w)), ENT_HIGH = entPeaks(0.4, ENT_PEAK), ENT_SKY = ENT_FAR.map(([across], k) => {
  let sum = 0, many = 0;
  for (let j = Math.max(0, k - 4); j <= Math.min(ENT_FAR.length - 1, k + 4); j += 1)
    sum += Math.min(ENT_FAR[j][1], ENT_HIGH[j][1]), many += 1;
  return [across, Math.round((sum / many - 0.17) * 1e4) / 1e4];
}), ENT_TREE = {
  trunk: [
    [-0.03, -0.45, -0.02],
    [0.21, 1.1, -0.12],
    [0.51, 2.1, -0.25],
    [0.86, 2.9, -0.39]
  ],
  foot: 0.74,
  waist: 0.5,
  flare: 0.75,
  limbs: [
    [205, 2.2, 3.2, 0.34, 0.35],
    [158, 2.44, 4.1, 0.33, 0.1],
    [112, 4.2, 4.9, 0.36, 0],
    [68, 5, 4.4, 0.34, 0.15],
    [22, 5.4, 3.6, 0.33, 0.05],
    [-28, 4.6, 3.2, 0.3, 0.3],
    [-78, 3.4, 3.7, 0.28, 0.2]
  ],
  roots: [
    [-108, 2.4, 0.33, -10],
    [-62, 2.5, 0.34, 12],
    [-12, 1.8, 0.3, -8],
    [56, 1.5, 0.27, 8],
    [110, 1.9, 0.29, 14],
    [158, 2.3, 0.31, -10]
  ],
  // A little over a metre up, a few paces off to the left of the tree and in front of it, looking up into it: low
  // enough that the tree towers and leans over us, with its trunk and limbs drawing together towards the sky, and high
  // enough that the ground round its foot is seen going away, the roots lying on it in depth, as the land round it is
  // seen. From a few centimetres up, as it was, the ground there was seen edge on, and every root ended in one line.
  eye: [-6.66, 1.2, -2.99],
  at: [3.38, 7.74, -3.66],
  roll: 0.04,
  // how much of the crown may run off the right, and how much of it is in the picture at least, as shares of it
  offRight: 0.55,
  inFrame: 0.8,
  shares: { wide: [0.78, 0.82, 0.86], phone: [0.74, 0.8, 0.86] },
  footShare: 0.32,
  // how far above the canvas's foot the roots end at least, as a share of its height
  footRoom: 0.12
}, ENT_FOOT_FLOWERS = [
  ["white", "cream", 11, 3],
  ["cream", "butter", 10, 1],
  ["coral", "salmon", 6, 2.4],
  ["peach", "salmon", 6, 2.6],
  ["salmon", "coral", 5, 1.2],
  ["butter", "gold", 5, 0.8],
  ["gold", "butter", 5, 0.3]
], ENTERPRISE = {
  ...HERO,
  // No opening: the first picture is the finished scene, every line in, the tree whole and the butterflies sitting
  // in it, and from there it only lives (the page fades the stage in on its first picture).
  intro: !1,
  // Built from the moment it is bound, by the builder, a few milliseconds at a time, and at once in tasks of its own as
  // it is on the screen when the page opens; drawn live while on the screen, as the hero is.
  wake: "idle",
  near: "100% 0px",
  words: ".ent-copy",
  lines: { ...LINES, veil: [96, 70] },
  inks: ENTERPRISE_INKS,
  // the crown stands against the page as well as the land
  onPage: !0,
  // the flowers at the tree's foot: daisies and buttercups, with a little lilac
  palettes: {
    ...PALETTES,
    roots: [
      ["white", 1.2],
      ["cream", 0.9],
      ["butter", 1.8],
      ["gold", 0.6],
      ["lilac", 0.9],
      ["peach", 0.4]
    ]
  },
  // The glass along the sides, its colours split less, and none along the top: the hero's top runs under the site's
  // header, so it is no edge of the screen, and glass there only smeared the crown, and the butterflies sitting on it,
  // into rainbows.
  lens: { ...LENS, split: 0.015, top: !1 },
  land: {
    ...HERO.land,
    profile: ENT_SLOPES,
    crest: 0,
    // how much of the ranges' rise there is for the stage's width: all of it from 1232 pixels, a third on a phone's
    relief: [0.18, 1],
    sheets: [
      // a thin band of the hero's sky behind the ranges and the high peak, its pale blues only
      {
        name: "sky",
        top: { crest: ENT_SKY },
        foot: [
          [-1.6, 0.36],
          [1.6, 0.36]
        ],
        paint: [
          [0, "pale", 0],
          [0.2, "pale", 0.3],
          [0.55, "sky", 0.5],
          [1, "pale", 0.55]
        ],
        fill: 0.5,
        under: 0.12,
        flow: 1,
        breath: 1
      },
      {
        name: "far peak",
        opaque: !0,
        top: { crest: ENT_HIGH },
        foot: [
          [-1.6, 0.42],
          [1.6, 0.42]
        ],
        paint: [
          [0, "snow", 0],
          [0.02, "snow", 0.85],
          [0.08, "haze", 1],
          [0.3, "steel", 1],
          [1, "mist", 1]
        ],
        lean: 0.35,
        fill: 0.7,
        under: 0.55,
        patch: 0.22,
        flow: 0.35,
        breath: 0.3
      },
      {
        name: "far range",
        opaque: !0,
        top: { crest: ENT_FAR },
        foot: [
          [-1.6, 0.56],
          [1.6, 0.56]
        ],
        paint: [
          [0, "snow", 0],
          [0.03, "haze", 0.85],
          [0.12, "steel", 1],
          [0.45, "mist", 1],
          [1, "mist", 1]
        ],
        lean: 0.35,
        fill: 0.7,
        under: 0.55,
        patch: 0.22,
        flow: 0.35,
        breath: 0.3
      },
      {
        name: "range",
        opaque: !0,
        top: { crest: ENT_RANGE },
        foot: [
          [-1.6, 0.66],
          [1.6, 0.66]
        ],
        paint: [
          [0, "haze", 0],
          [0.04, "mist", 0.9],
          [0.18, "stone", 1],
          [0.6, "stoneDeep", 1],
          [1, "stone", 1]
        ],
        lean: 0.4,
        fill: 0.72,
        under: 0.6,
        patch: 0.28,
        flow: 0.35,
        breath: 0.3
      },
      {
        name: "ridges",
        opaque: !0,
        top: ENT_RIDGES,
        foot: [
          [-1.6, 0.86],
          [1.6, 0.86]
        ],
        paint: [
          [0, "ridgeLit", 0],
          [0.05, "ridgeLit", 0.9],
          [0.16, "ridge", 1],
          [0.55, "ridgeDeep", 1],
          [1, "ridge", 1]
        ],
        lean: 0.45,
        fill: 0.74,
        under: 0.66,
        patch: 0.3,
        flow: 0.4,
        breath: 0.3
      },
      {
        name: "slopes",
        opaque: !0,
        top: ENT_SLOPES,
        foot: [
          [-1.6, 1.12],
          [1.6, 1.12]
        ],
        paint: [
          [0, "sunGold", 0],
          [0.04, "sunGold", 0.9],
          [0.12, "gold", 1],
          [0.3, "amber", 1],
          [0.5, "spring", 1],
          [0.75, "meadow", 1],
          [1, "meadowDeep", 1]
        ],
        lean: 0.5,
        fill: 0.72,
        under: 0.62,
        patch: 0.32,
        flow: 0.5,
        breath: 0.6,
        sheen: 0.6
      },
      {
        name: "knoll",
        opaque: !0,
        top: ENT_KNOLL,
        foot: [
          [-0.3, 1.3],
          [1.6, 1.3]
        ],
        paint: [
          [0, "sunGold", 0],
          [0.03, "sunGold", 0.9],
          [0.1, "gold", 1],
          [0.3, "amber", 1],
          [0.55, "spring", 1],
          [0.8, "meadow", 1],
          [1, "meadowDeep", 1]
        ],
        lean: 0.55,
        fill: 0.72,
        under: 0.62,
        patch: 0.3,
        flow: 0.5,
        breath: 0.5,
        sheen: 0.6
      },
      {
        name: "meadow",
        opaque: !0,
        laid: !0,
        top: ENT_FRONT,
        foot: [
          [-1.6, 1.26],
          [1.6, 1.26]
        ],
        paint: [
          [0, "gold", 0],
          [0.06, "gold", 0.85],
          [0.28, "amber", 1],
          [0.52, "spring", 0.95],
          [0.76, "meadow", 0.8],
          [0.9, "sunGold", 0.45],
          [1, "sunGold", 0]
        ],
        fill: 0.68,
        under: 0.5,
        patch: 0.25,
        flow: 0.7,
        breath: 1,
        sheen: 1
      }
    ],
    foot: LAND_FOOT,
    least: 110
  },
  // a little grass on the sunlit slopes, gold and olive, and nothing going through it but the pointer
  grass: {
    ...GRASS,
    tufts: 0.05,
    lane: 0,
    singles: 0.16,
    tall: [6, 30],
    inks: ["lime", "meadow", "spring", "gold", "sunGold"]
  },
  passer: null,
  // no flowers at all
  flowers: { ...FLOWERS, drifts: [], strays: 0 },
  // The tree's paints: a violet-brown bark, lit and in its own shade, and a crown of deep teal greens with lighter
  // flecks and the cool dark of its undersides, as [on a light page, on a dark page].
  paints: {
    ...PAINTS,
    bark: ["#54406d", "#62507b"],
    barkDeep: ["#362a4c", "#45385b"],
    barkLit: ["#8b77ae", "#9884b9"],
    barkWarm: ["#73546c", "#80627a"],
    crownUnder: ["#1d3c46", "#1a3241"],
    crownDeep: ["#21504b", "#204c49"],
    crown: ["#215853", "#2b6560"],
    crownMid: ["#2f6f63", "#3b7c70"],
    crownLit: ["#5c9a80", "#6aa88e"],
    fleck: ["#a5cd96", "#b2d6a4"],
    sunFleck: ["#d6db8a", "#dee39c"]
  },
  clouds: [],
  flock: Array.from({ length: 15 }, (_, k) => ({
    size: 10 + 3.5 * ((k * 0.7549 + 0.31) % 1),
    seed: Math.round((k * 0.618 + 0.13) % 1 * 100) / 100,
    pastel: k % 3,
    wing: WING_NAMES[k * 2 % 3],
    // two keep about the crown
    flit: k === 3 || k === 10
  })),
  perch: {
    // how long one sits before going over to another leaf, and how far it goes at most, at a fit of 1
    stay: [5, 14],
    reach: 110,
    // how long the two about the crown go round it before they land for a while
    flit: [3, 6],
    // their speeds, in CSS pixels a second: hopping, coming back, and away
    hop: 140,
    come: 190,
    flee: 340,
    // how long the pointer has to be off the tree before they come back, and how far apart they come
    back: 2.6,
    every: [0.45, 1.1],
    // with no opening, every one with a seat is sitting in the tree from the first picture
    appear: 0,
    arrive: 0,
    first: 0,
    // wingbeats a second in the air, and the wings at rest, from shut to open, over a slow breath of seconds
    beat: 8,
    wings: [1.38, 0.3],
    rest: [3.5, 6.5],
    // sitting: which way it faces, how far its head is turned from us, and how far it is rolled to show its wings
    sit: [0.12, -0.35, 1.05],
    // how far its body sits above the leaf, in sizes; how far a flight wanders across its way, in CSS pixels
    lift: 0.35,
    flutter: 7,
    // how far round the tree the pointer parts no grass
    clear: 26
  },
  fit: (w, h) => clamp(Math.min(w / 1300, (h + 100) / 760), 0.72, 1.2),
  plant: (garden) => {
    let { w, h, rand, words } = garden, jitter = (n) => hashed(n * 17.13 + 3.1) - 0.5, add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], times = (a, k2) => [a[0] * k2, a[1] * k2, a[2] * k2], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], unit = (a) => {
      let l = Math.hypot(a[0], a[1], a[2]) || 1;
      return [a[0] / l, a[1] / l, a[2] / l];
    }, along = (p, t) => {
      let v = 1 - t, k2 = [v * v * v, 3 * v * v * t, 3 * v * t * t, t * t * t];
      return [0, 1, 2].map((i) => p[0][i] * k2[0] + p[1][i] * k2[1] + p[2][i] * k2[2] + p[3][i] * k2[3]);
    }, wayOf = (p, t) => {
      let v = 1 - t, k2 = [-3 * v * v, 3 * v * v - 6 * v * t, 6 * v * t - 3 * t * t, 3 * t * t];
      return unit([0, 1, 2].map((i) => p[0][i] * k2[0] + p[1][i] * k2[1] + p[2][i] * k2[2] + p[3][i] * k2[3]));
    }, lengthOf = (p) => {
      let l = 0, q = along(p, 0);
      for (let i = 1; i <= 16; i += 1) {
        let r = along(p, i / 16);
        l += Math.hypot(...sub(r, q)), q = r;
      }
      return l;
    }, deg = Math.PI / 180, flat = (a) => [Math.cos(a * deg), 0, Math.sin(a * deg)], T = ENT_TREE, TRUNK = T.trunk, fork = TRUNK[3], trunkR = (t) => (T.foot - (T.foot - T.waist) * t) * (1 + T.flare * (1 - smooth(0, 0.22, t))), limbs = T.limbs.map(([a, reach, rise, r0, drop], k2) => {
      let h2 = flat(a), start2 = add(add(fork, times(h2, T.waist * 0.45)), [0, -drop, 0]), p = [
        start2,
        add(start2, add(times(h2, reach * 0.14), [0, rise * 0.42, 0])),
        add(start2, add(times(h2, reach * 0.62), [0, rise * 0.94, 0])),
        add(start2, add(times(h2, reach), [0, rise * 0.84, 0]))
      ];
      return { k: k2, a, p, r0, r1: r0 * 0.3 };
    }), limbR = (limb) => (t) => limb.r0 + (limb.r1 - limb.r0) * t, branches = [];
    limbs.forEach((limb) => {
      [
        [0.56, -1],
        [0.8, 1]
      ].forEach(([t, side], q) => {
        let n = limb.k * 10 + q, start2 = along(limb.p, t), a = limb.a + side * (34 + 10 * hashed(n * 1.7)), h2 = flat(a), reach = 1.5 + 0.9 * hashed(n * 2.3), rise = 1 + 0.8 * hashed(n * 3.1), p = [
          start2,
          add(start2, add(times(h2, reach * 0.2), [0, rise * 0.5, 0])),
          add(start2, add(times(h2, reach * 0.7), [0, rise * 0.95, 0])),
          add(start2, add(times(h2, reach), [0, rise * 0.8, 0]))
        ], r0 = limbR(limb)(t) * 0.58;
        branches.push({ k: n, a, p, r0, r1: Math.max(0.035, r0 * 0.3) });
      });
    });
    let flareR = trunkR(0.08), roots = T.roots.map(([a, out, r0, bend = 0], k2) => {
      let high = 1.2 + 0.4 * (hashed(k2 * 4.7 + 0.3) - 0.5), p = [
        add(times(flat(a), flareR * 0.25), [0, high, 0]),
        add(times(flat(a), flareR * 0.75), [0, 0.35, 0]),
        add(times(flat(a + bend * 0.5), flareR + (out - flareR) * 0.42), [0, 0.03, 0]),
        add(times(flat(a + bend), out), [0, -0.14, 0])
      ];
      return { k: k2, p, r0, r1: r0 * 0.3 };
    }), rootR = (root) => (t) => root.r0 + (root.r1 - root.r0) * t ** 0.7, axis = Array.from({ length: 49 }, (_, i) => [...along(TRUNK, i / 48), trunkR(i / 48)]), inTrunk = (q, margin2) => {
      let i = 0;
      for (; i < axis.length - 2 && axis[i + 1][1] < q[1]; )
        i += 1;
      let [x0, y0, z0, r0] = axis[i], [x1, y1, z1, r1] = axis[i + 1], f = clamp((q[1] - y0) / (y1 - y0 || 1), 0, 1);
      return Math.hypot(q[0] - (x0 + (x1 - x0) * f), q[2] - (z0 + (z1 - z0) * f)) < r0 + (r1 - r0) * f - margin2;
    }, clumps = [];
    for (let b of branches) {
      let e = b.p[3];
      clumps.push({
        c: add(e, [0, 0.45, 0]),
        rx: 1.25 + 0.35 * hashed(b.k * 1.9),
        ry: 0.85 + 0.2 * hashed(b.k * 2.7)
      });
    }
    for (let limb of limbs) {
      let e = limb.p[3];
      clumps.push({
        c: add(e, [0, 0.55, 0]),
        rx: 1.5 + 0.3 * hashed(limb.k * 3.3),
        ry: 1 + 0.2 * hashed(limb.k * 4.1)
      });
    }
    let byAngle = [...limbs].sort((p, q) => p.a - q.a);
    byAngle.forEach((limb, i) => {
      let next = byAngle[(i + 1) % byAngle.length];
      if (Math.abs((next.a - limb.a + 540) % 360 - 180) < 60)
        return;
      let m = times(add(limb.p[3], next.p[3]), 0.5);
      clumps.push({ c: add(m, [0, 1.1, 0]), rx: 1.8, ry: 1.15 });
    }), clumps.push({ c: add(fork, [0.3, 6.2, 0.4]), rx: 2.3, ry: 1.3 });
    let eye3 = T.eye, look = unit(sub(T.at, eye3)), right = unit(cross([0, 1, 0], look)), upward = cross(look, right), roll = T.roll;
    [right, upward] = [
      add(times(right, Math.cos(roll)), times(upward, Math.sin(roll))),
      add(times(right, -Math.sin(roll)), times(upward, Math.cos(roll)))
    ];
    let seen = (q) => {
      let d = sub(q, eye3), z = dot(d, look);
      return z < 0.4 ? null : { u: dot(d, right) / z, v: -dot(d, upward) / z, z };
    }, foot = seen([0, 0, 0]), margin = 30, wordsLeft = words.x - words.a - margin, wordsRight = words.x + words.a + margin, wordsFoot = words.y + words.b + margin, outline = [];
    for (let c of clumps) {
      let q = seen(c.c);
      q && outline.push([q.u, q.v, Math.max(c.rx, c.ry) / q.z, !0]);
    }
    for (let b of [...limbs, ...branches])
      for (let t = 0; t <= 1; t += 0.25) {
        let q = seen(along(b.p, t));
        q && outline.push([q.u, q.v, (b.r0 + (b.r1 - b.r0) * t) / q.z, !1]);
      }
    let rootEnds = roots.map((root) => {
      let t = 1;
      for (; t > 0 && along(root.p, t)[1] + rootR(root)(t) < 0.012; )
        t -= 0.02;
      return seen(along(root.p, t));
    }).filter(Boolean), trunkFoot = trunkR(0) / foot.z, S = 1, bx = 0, by = 0, toCanvas = (q) => [bx + S * (q.u - foot.u), by + S * (q.v - foot.v)], fits = () => {
      let left = Number.POSITIVE_INFINITY, right2 = Number.NEGATIVE_INFINITY, crown = 0, shown = 0;
      for (let [u, v, r, clump] of outline) {
        let x = bx + S * (u - foot.u), y = by + S * (v - foot.v), R = r * S;
        if (x + R > wordsLeft && x - R < wordsRight && y - R < wordsFoot)
          return !1;
        left = Math.min(left, x - R), right2 = Math.max(right2, x + R), clump && (crown += 4 * R * R, shown += Math.max(0, Math.min(w, x + R) - Math.max(0, x - R)) * Math.max(0, Math.min(h, y + R) - Math.max(0, y - R)));
      }
      for (let q of rootEnds)
        if (by + S * (q.v - foot.v) > h * (1 - T.footRoom))
          return !1;
      return right2 - w < (right2 - left) * T.offRight && shown > crown * T.inFrame && trunkFoot * S * 2 < w * T.footShare;
    }, behind = Math.max(0, ...rootEnds.map((q) => foot.v - q.v)), best = null;
    for (let share of w < 700 ? T.shares.phone : T.shares.wide) {
      bx = w * share;
      let crest = garden.ground("knoll", bx) + 6;
      for (S = 2400 * Math.max(0.5, w / 1232); S >= 100; S -= 10)
        if (by = crest + behind * S, fits()) {
          (!best || S > best.S + 5) && (best = { S, bx, by });
          break;
        }
    }
    ({ S, bx, by } = best || { S: 100, bx: w * 0.86, by: garden.ground("knoll", w * 0.86) + 6 });
    let project = (q3) => {
      let q = seen(q3);
      if (!q)
        return null;
      let [x, y] = toCanvas(q);
      return { x, y, z: q.z, px: S / q.z };
    }, k = clamp(w / 1232, 0.6, 1.2), marks = [], L = unit([-0.55, 0.78, -0.3]), BARK = ["barkDeep", "bark", "barkWarm", "barkLit"], shade = (ramp, t, n) => {
      let at = clamp(t, 0, 0.999) * (ramp.length - 1), i = Math.floor(at), j = Math.min(ramp.length - 1, i + 1);
      return at - i > 0.5 + jitter(n + 13) * 0.5 ? [ramp[j], ramp[i]] : [ramp[i], ramp[j]];
    }, ground = 0.012, onGround = (a3, b3) => {
      if (a3[1] < ground && b3[1] < ground)
        return null;
      let p3 = a3, q3 = b3;
      if (a3[1] < ground || b3[1] < ground) {
        let cut = add(a3, times(sub(b3, a3), (ground - a3[1]) / (b3[1] - a3[1])));
        a3[1] < ground ? p3 = cut : q3 = cut;
      }
      let a = project(p3), b = project(q3), m = project(times(add(p3, q3), 0.5));
      return !a || !b || !m ? null : { a, b, m, long: Math.hypot(b.x - a.x, b.y - a.y) / 2 };
    }, bough = (id, p, rAt, { twist = 0, spiral = 0.16, rowPx = 15, colPx = 6.5, fromTrunk = !1, coatRows = 1 } = {}) => {
      let len = lengthOf(p), lenPx = 0, prev = project(along(p, 0));
      for (let i = 1; i <= 12; i += 1) {
        let q = project(along(p, i / 12));
        q && prev && (lenPx += Math.hypot(q.x - prev.x, q.y - prev.y)), prev = q;
      }
      let rows = Math.max(2, Math.round(lenPx / rowPx)), onCanvas = (m, pad) => m.x > -pad && m.x < w + pad && m.y > -pad && m.y < h + pad, coat = (n, c0, tan, r, reach) => {
        let lying = 1 - Math.abs(tan[1]), bottom = Math.max(ground, c0[1] - r), above = c0[1] + r - bottom;
        if (above < 0.04)
          return;
        let c = [c0[0], c0[1] + lying * (bottom + above / 2 - c0[1]), c0[2]], half = r + lying * (above / 2 - r);
        if (c[1] < 0.03)
          return;
        let cut = onGround(sub(c, times(tan, reach)), add(c, times(tan, reach)));
        if (!cut || !onCanvas(cut.m, half * cut.m.px + 30))
          return;
        let { a, b, m, long } = cut;
        long < 0.4 || marks.push({
          z: m.z + r * 1.05,
          n,
          leaf: !1,
          x: m.x,
          y: m.y,
          long,
          wide: clamp(half * m.px * 1.05 / long, 0.1, 4),
          turn: Math.atan2(b.y - a.y, b.x - a.x),
          paints: ["barkDeep", "bark"],
          kind: 0.25,
          blur: 1
        });
      }, coats = rows * coatRows;
      for (let i = 0; i < coats; i += 1) {
        let t = (i + 0.5) / coats, r = Math.min(rAt(t), rAt(Math.max(0, t - 0.7 / coats)), rAt(Math.min(1, t + 0.7 / coats)));
        coat(id * 1e5 + 9e4 + i, along(p, t), wayOf(p, t), r, len / coats * 0.7);
      }
      if (fromTrunk)
        for (let t of [0.2, 0.3])
          coat(id * 1e5 + 99e3 + t * 100, along(p, t), wayOf(p, t), rAt(t) * 1.15, len * 0.08);
      for (let i = 0; i < rows; i += 1) {
        let t = (i + 0.5 + jitter(id * 977 + i) * 0.3) / rows, c = along(p, t), tan = wayOf(p, t), ref = Math.abs(tan[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0], nA = unit(cross(tan, ref)), nB = cross(tan, nA), r = rAt(t), mid = project(c);
        if (!mid || !onCanvas(mid, r * mid.px + 30))
          continue;
        let thin = clamp(r * mid.px / 10, 0.2, 1), cols = Math.max(5, Math.round(2 * Math.PI * r * mid.px / colPx));
        for (let j = 0; j < cols; j += 1) {
          let n = id * 1e5 + i * 211 + j, phi = 2 * Math.PI * (j + 0.5 + jitter(n) * 0.4) / cols + twist * t, normal = add(times(nA, Math.cos(phi)), times(nB, Math.sin(phi))), at = add(c, times(normal, r)), facing = dot(normal, unit(sub(eye3, at)));
          if (facing < 0.03 + 0.45 * (1 - thin) || at[1] < 0.02 || fromTrunk && inTrunk(at, 0.03))
            continue;
          let dir = unit(add(tan, times(cross(normal, tan), spiral * thin * thin))), reach = len / rows * 0.7 * (0.45 + 0.55 * thin), cut = onGround(sub(at, times(dir, reach)), add(at, times(dir, reach)));
          if (!cut)
            continue;
          let { a, b, m, long } = cut, breadth = Math.PI * r / cols * 1.15 * m.px * (0.4 + 0.6 * Math.sqrt(facing));
          if (long < 0.4)
            continue;
          let lit = dot(normal, L), edge = 1 - smooth(0.05, 0.45, facing), tone = 0.42 + 0.42 * lit - 0.3 * edge + jitter(n + 3) * 0.12;
          marks.push({
            z: m.z,
            n,
            leaf: !1,
            x: m.x,
            y: m.y,
            long,
            wide: clamp(breadth * (0.6 + 0.4 * thin) / long, 0.1, 1.1),
            turn: Math.atan2(b.y - a.y, b.x - a.x) + (j % 2 ? Math.PI : 0),
            paints: shade(BARK, tone, n)
          });
        }
      }
    };
    bough(1, TRUNK, trunkR, { twist: 1.1, spiral: 0.2, rowPx: 26, colPx: 5.6, coatRows: 2 }), roots.forEach((root) => bough(20 + root.k, root.p, rootR(root), { rowPx: 20, colPx: 5.6, fromTrunk: !0 })), limbs.forEach((limb) => bough(40 + limb.k, limb.p, limbR(limb), { twist: 0.5, rowPx: 20, colPx: 5.4 })), branches.forEach((b) => bough(100 + b.k, b.p, (t) => b.r0 + (b.r1 - b.r0) * t, { rowPx: 12, colPx: 5.5 }));
    let placed = clumps.map((c, j) => {
      let m = project(c.c);
      if (!m)
        return null;
      let x0 = Number.POSITIVE_INFINITY, x1 = Number.NEGATIVE_INFINITY, y0 = Number.POSITIVE_INFINITY, y1 = Number.NEGATIVE_INFINITY;
      for (let d of [
        [c.rx, 0, 0],
        [-c.rx, 0, 0],
        [0, c.ry, 0],
        [0, -c.ry, 0],
        [0, 0, c.rx],
        [0, 0, -c.rx]
      ]) {
        let q = project(add(c.c, d));
        q && (x0 = Math.min(x0, q.x), x1 = Math.max(x1, q.x), y0 = Math.min(y0, q.y), y1 = Math.max(y1, q.y));
      }
      return { j, x: m.x, y: m.y, a: (x1 - x0) / 2, b: (y1 - y0) / 2, z: m.z, px: m.px };
    }).filter(Boolean), nearer = (x, y, me, within = 0.62) => placed.some((o) => o.z < me.z && ((x - o.x) / o.a) ** 2 + ((y - o.y) / o.b) ** 2 < within), top = Math.min(...placed.map((o) => o.y - o.b)), low = Math.max(...placed.map((o) => o.y + o.b)), passes = [
      { step: 0.2, long: 0.22, wide: 0.58, edge: 1.04 },
      { step: 0.24, long: 0.15, wide: 0.5, edge: 0.98 },
      { step: 0.26, long: 0.11, wide: 0.52, edge: 1.02 }
    ], spots = [];
    for (let o of placed) {
      let high = 1 - (o.y - top) / Math.max(1, low - top);
      passes.forEach((pass, which) => {
        let step = clamp(pass.step * o.px, 3.2, [9, 10.5, 11.5][which] * k), cols = Math.ceil(o.a * 2.2 / step), rows = Math.ceil(o.b * 2.2 / step);
        for (let r = 0; r <= rows; r += 1)
          for (let c = 0; c <= cols; c += 1) {
            let n = 2e5 + o.j * 3e4 + which * 9e3 + r * 90 + c, x = o.x - o.a * 1.1 + (c + 0.5 + jitter(n) * 0.9) * step, y = o.y - o.b * 1.1 + (r + 0.5 + jitter(n + 1) * 0.9) * step, ex = (x - o.x) / o.a, ey = (y - o.y) / o.b, d = Math.hypot(ex, ey);
            if (d > pass.edge + jitter(n + 2) * 0.24 || x < -16 || x > w + 16 || y < -16 || nearer(x, y, o))
              continue;
            let light = clamp((-ey * 0.8 - ex * 0.4) * 0.75 + (high - 0.5) * 0.4, -1, 1), under = smooth(-0.35, 0.55, ey), paints = light > 0.25 ? ["crown", "crownMid"] : ["crownDeep", "crown"];
            if (which === 0)
              under > 0.6 ? (paints = jitter(n + 9) > 0 ? ["crownUnder", "crownDeep"] : ["crownDeep", "crown"], d > 0.8 && jitter(n + 10) > 0.3 && (paints = ["crown", "crownMid"])) : under > 0.3 ? paints = ["crownUnder", "crownDeep"] : light < -0.2 && (paints = ["crownDeep", "crownDeep"]);
            else if (which === 1) {
              if (light < 0.05 + jitter(n + 3) * 0.4 || under > 0.45)
                continue;
              paints = light > 0.5 ? ["crownMid", "crownLit"] : ["crown", "crownMid"];
            } else {
              let rim = smooth(0.55, 0.95, d) * (1 - under);
              if (light + rim * 0.6 < 0.3 + jitter(n + 3) * 0.6 || under > 0.32)
                continue;
              paints = jitter(n + 4) > 0 ? ["crownLit", "fleck"] : ["crownMid", "crownLit"], light > 0.6 && jitter(n + 4) > 0.25 && (paints = ["fleck", "sunFleck"]), d > 0.82 && d < 1 && hashed(n * 5.3) < 0.5 && spots.push({ x, y, z: o.z, o, dice: hashed(n * 7.7) });
            }
            let round = Math.atan2(y - o.y, x - o.x) + (o.j % 2 ? 1 : -1) * Math.PI * 0.5, towards = ((-0.55 + 0.5 * Math.sin(x * 0.045 + y * 0.03) - round) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
            marks.push({
              z: o.z - which * 1e-3,
              n,
              leaf: !0,
              x,
              y,
              long: Math.min(pass.long * o.px, [11, 8, 6][which] * k) * (0.8 + 0.45 * (jitter(n + 5) + 0.5)),
              wide: pass.wide + 0.1 * jitter(n + 6),
              turn: round + towards * 0.6 + jitter(n + 7) * 1.5,
              paints,
              load: 0.9 + 0.06 * jitter(n + 8)
            });
          }
      });
    }
    let swayAt = project(fork) || { x: bx, y: by - 200 };
    marks.sort((p, q) => q.z - p.z), marks.forEach((mk, i) => {
      rand.reseed(61813 + mk.n * 7919);
      let order = by + i * 1e-5;
      if (!mk.leaf) {
        garden.dab({
          x: mk.x,
          y: mk.y,
          long: mk.long,
          wide: mk.wide,
          turn: mk.turn,
          paints: mk.paints,
          blur: mk.blur ?? 0.42,
          kind: mk.kind ?? 0,
          load: 0.93,
          stiff: 1,
          lean: 0,
          order
        });
        return;
      }
      let dx = mk.x - swayAt.x, dy = Math.max(4, swayAt.y - mk.y), tilt = Math.atan2(dx, dy);
      garden.dab({
        x: swayAt.x,
        y: swayAt.y,
        stem: Math.hypot(dx, dy),
        long: mk.long,
        wide: mk.wide,
        turn: mk.turn - tilt * 0.7,
        blur: 0.45,
        paints: mk.paints,
        load: mk.load,
        stiff: 0.94,
        lean: tilt,
        phase: 1.3,
        order
      });
    });
    let away = unit([-L[0], 0, -L[2]]);
    for (let i = 0; i < 64; i += 1) {
      let n = 95e4 + i, a = hashed(n * 1.3) * Math.PI * 2, r = Math.sqrt(hashed(n * 2.1)) * 2.4, m = project(add([Math.cos(a) * r * 1.15, 5e-3, Math.sin(a) * r * 0.9], times(away, 0.8)));
      m && (rand.reseed(61813 + n * 7919), garden.dab({
        x: m.x,
        y: m.y,
        long: 0.75 * m.px,
        wide: 0.5,
        turn: 0,
        paints: ["shade", "deepGreen"],
        load: 0.26 * (1 - smooth(1.2, 2.5, r)),
        kind: 0.25,
        blur: 4,
        stiff: 1,
        lean: 0,
        order: by - 1
      }));
    }
    for (let i = 0; i < 36; i += 1) {
      let n = 951e3 + i, a = hashed(n * 1.3) * Math.PI * 2, r = 0.6 + Math.sqrt(hashed(n * 2.1)) * 0.9, m = project([Math.cos(a) * r * 1.1, 5e-3, Math.sin(a) * r]);
      m && (rand.reseed(61813 + n * 7919), garden.dab({
        x: m.x,
        y: m.y,
        long: 0.45 * m.px,
        wide: 0.5,
        turn: 0,
        paints: ["shade", "deepGreen"],
        load: 0.3,
        kind: 0.25,
        blur: 2.5,
        stiff: 1,
        lean: 0,
        order: by - 0.9
      }));
    }
    let toEye = unit([eye3[0], 0, eye3[2]]), facingUs = Math.atan2(toEye[2], toEye[0]), feet = [], footR = trunkR(0.12);
    for (let i = 0; i < 22; i += 1) {
      let a = facingUs + ((i + 0.5) / 22 - 0.5) * Math.PI * 1.25;
      feet.push({ at: [Math.cos(a) * footR * 1.04, 0, Math.sin(a) * footR * 1.04] });
    }
    for (let root of roots)
      for (let t = 0.2; t < 1; t += 0.07) {
        let c = along(root.p, t), r = rootR(root)(t);
        c[1] - r > 0.25 || c[1] + r < 0 || feet.push({ at: add([c[0], 0, c[2]], times(toEye, r * 0.9)) });
      }
    let nearAt = (m, n) => clamp(0.5 + (m.y - by) / 260 + jitter(n) * 0.08, 0.45, 0.7), tuft = (n, m, near, many2, reach) => {
      for (let g = 0; g < many2; g += 1) {
        let nn = n * 5 + g;
        rand.reseed(61813 + nn * 7919), garden.stalk({
          x: m.x + jitter(nn) * reach * k,
          y: m.y + jitter(nn + 1) * 3,
          tall: (12 + 20 * hashed(nn * 1.7)) * k * (0.75 + 0.5 * (near - 0.5)),
          wide: 1,
          // the meadow's greens, lime to spring, not the gold of the slopes
          ink: 0.3 + 1.4 * hashed(nn * 2.9),
          mix: 0.5,
          soft: 0,
          stiff: 0.6,
          lean: jitter(nn + 2) * 0.5
        });
      }
    };
    feet.forEach((f, j) => {
      for (let q = 0; q < 2; q += 1) {
        let n = 97e4 + j * 13 + q, a = hashed(n * 1.9) * Math.PI * 2, r = 0.22 * Math.sqrt(hashed(n * 2.7)), m = project([f.at[0] + Math.cos(a) * r, 0, f.at[2] + Math.sin(a) * r]);
        !m || m.x < -10 || m.x > w + 10 || m.y > h + 10 || tuft(n, m, nearAt(m, n + 5), 3, 12);
      }
    });
    let onRoot = [];
    for (let root of roots)
      for (let t = 0.12; t <= 1; t += 0.04) {
        let c = along(root.p, t), r = rootR(root)(t);
        c[1] - r < 0.3 && c[1] + r > 0 && onRoot.push([c[0], c[2], r]);
      }
    let fromRoots = (x, z) => Math.min(...onRoot.map(([rx, rz, r]) => Math.hypot(x - rx, z - rz) - r)), ways = T.roots.map(([a, , , bend = 0]) => a + bend * 0.25).sort((p, q) => p - q), crotches = ways.map((a, i) => (a + (i + 1 < ways.length ? ways[i + 1] : ways[0] + 360)) / 2 * deg), angleFrom = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI), weights = ENT_FOOT_FLOWERS.reduce((sum, f) => sum + f[3], 0), inkOf = (dice) => {
      let left = dice * weights;
      return ENT_FOOT_FLOWERS.find((f) => (left -= f[3]) < 0) || ENT_FOOT_FLOWERS[0];
    }, scale = clamp(S / 320, 0.72, 1.15), many = clamp(S / 320, 0.45, 1), footAt = trunkR(0.1);
    for (let ring = 0; ring < 16; ring += 1) {
      let rho = footAt + 0.04 + ring * 0.085, steps = Math.ceil(rho * Math.PI * 1.3 / 0.085);
      for (let s2 = 0; s2 < steps; s2 += 1) {
        let n = 1e6 + ring * 997 + s2, a = facingUs + ((s2 + 0.5 + jitter(n) * 0.8) / steps - 0.5) * Math.PI * 1.3, r = rho + jitter(n + 1) * 0.06, x = Math.cos(a) * r, z = Math.sin(a) * r, edge = fromRoots(x, z);
        if (edge < 0.05)
          continue;
        let out = r - footAt, against = Math.exp(-out / 0.32), along2 = Math.exp(-edge / 0.16) * (1 - smooth(1, 1.6, out)), crotch = Math.max(...crotches.map((c) => Math.exp(-((angleFrom(a, c) / 0.32) ** 2)))) * Math.exp(-(((out - 0.3) / 0.45) ** 2)), thick = smooth(-0.15, 0.45, Math.cos(a - facingUs)) * (Math.max(against, along2 * 0.9, crotch) + 0.04) * many;
        if (hashed(n * 2.3) > thick * (0.55 + 0.75 * hashed(Math.floor(x * 3) * 13.1 + Math.floor(z * 3) * 7.7)))
          continue;
        let m = project([x, 0, z]);
        if (!m || m.x < -10 || m.x > w + 10 || m.y > h * (1 - T.footRoom * 0.8))
          continue;
        let patch = hashed(Math.floor(x / 0.3) * 31.7 + Math.floor(z / 0.3) * 17.3), [ink, second, petals] = inkOf(hashed(n * 3.1) < 0.55 ? patch : hashed(n * 4.7)), low2 = along2 * (1 - against), reach = 6.2 * scale * (0.75 + 0.5 * hashed(n * 5.3)) * (1 - 0.2 * low2), lean = jitter(n + 7) * 0.4;
        hashed(n * 6.1) < 0.45 && (rand.reseed(61813 + n * 3 * 7919), garden.dab({
          x: m.x + jitter(n + 8) * reach * 0.8,
          y: m.y,
          stem: reach * 0.35,
          long: reach * (1 + 0.5 * hashed(n * 8.1)),
          wide: 0.28,
          turn: -Math.PI / 2 + jitter(n + 10) * 1.2,
          paints: ["leaf", hashed(n * 4.1) < 0.6 ? "leaf" : "deepGreen"],
          kind: 0.25,
          blur: 0.5,
          load: 0.8,
          stiff: 0.7,
          lean,
          order: m.y - 0.01
        })), rand.reseed(61813 + n * 7919), garden.bloom({
          x: m.x,
          y: m.y,
          // taller against the bark, reaching for the light beside it, and low beside a root
          stem: reach * ((0.5 + 0.6 * hashed(n * 8.9)) * (1 - 0.5 * low2) + 1.6 * against),
          reach,
          petals,
          blur: 0.5,
          paints: [ink, second],
          turn: jitter(n + 9) * 0.8,
          stiff: 0.7,
          lean
        }), hashed(n * 11.3) < 0.35 && tuft(n, m, nearAt(m, n + 5), 2, 6);
      }
    }
    for (let b of [{ p: TRUNK, r0: trunkR(0), r1: T.waist }, ...limbs, ...branches])
      for (let t = 0; t <= 1; t += 0.12) {
        let m = project(along(b.p, t));
        m && garden.tree(m.x, m.y, (b.r0 + (b.r1 - b.r0) * t) * m.px + 3);
      }
    for (let o of placed)
      garden.tree(o.x, o.y, Math.max(o.a, o.b) * 0.96);
    spots.sort((p, q) => p.dice - q.dice);
    let taken = [];
    for (let spot of spots)
      spot.y < 72 || taken.length >= 46 || taken.some((t) => Math.hypot(t.x - spot.x, t.y - spot.y) < 13 * k) || (taken.push(spot), garden.perch(spot.x, spot.y, spot.dice > 0.5 ? 1 : -1));
    limbs.forEach((limb) => {
      for (let t of [0.3, 0.45]) {
        let m = project(add(along(limb.p, t), [0, limbR(limb)(t), 0]));
        m && !placed.some((o) => ((m.x - o.x) / o.a) ** 2 + ((m.y - o.y) / o.b) ** 2 < 1) && garden.perch(m.x, m.y - 2, limb.a > 90 && limb.a < 270 ? -1 : 1);
      }
    }), window.__entDebug && (window.__entDebug.tree = { S, bx, by, marks: marks.length, clumps: placed.length, foot, top }, window.__entDebug.stage = {
      w,
      h,
      words,
      knoll: Array.from({ length: 129 }, (_, i) => garden.ground("knoll", i * w / 128))
    });
  }
}, CO_EVEN = 5e-3, CO_HAZE = 0.4 + CO_EVEN, CO_TWINKLE = 3.25 + CO_EVEN, CO_GLIMMER = 3.4 + CO_EVEN, CO_HORIZON = 0.2, CO_INKS = {
  ...LAND_INK,
  coLilac: ["#e3dcf6", "#2c2a52"],
  coDawn: ["#f8d9e2", "#4a3d6e"],
  coPeach: ["#fde3d4", "#5e4775"],
  coShore: ["#a8c9cf", "#22405a"],
  coShoreDeep: ["#86b4be", "#1b3550"],
  coWaterHi: ["#b0d5e2", "#335f86"],
  coWater: ["#7cb1cc", "#28527a"],
  coWaterDeep: ["#6198bb", "#1d446c"],
  coWaterNear: ["#4f88ad", "#173860"]
}, CO_SCALE = (w) => clamp(w / 1232, 0.5, 1.15), CO_FISH_SIZE = 2, CO_SCALES = [
  { body: "coFishPink", belly: "coFishWhite", back: "coFishRose", fin: "coFishPink", spots: [] },
  {
    body: "coFishWhite",
    belly: "coFishWhite",
    back: "coFishCream",
    fin: "coFishWhite",
    spots: ["coFishRed", "coFishRed", "coFishRed", "coFishOrange"]
  },
  { body: "coFishCoral", belly: "coFishPeachy", back: "coFishRed", fin: "coFishCoral", spots: ["coFishRed"] },
  {
    body: "coFishBlue",
    belly: "coFishPale",
    back: "coFishNavy",
    fin: "coFishBlue",
    spots: ["coFishNavy", "coFishNavy", "coFishNavy", "coFishWhite"]
  },
  {
    body: "coFishCream",
    belly: "coFishWhite",
    back: "coFishGreen",
    fin: "coFishCream",
    spots: ["coFishGreen", "coFishGreen", "coFishGreen", "coFishGreen", "coFishYellow"]
  },
  {
    body: "coFishYellow",
    belly: "coFishCream",
    back: "coFishOrange",
    fin: "coFishYellow",
    spots: ["coFishOrange", "coFishOrange", "coFishRed"]
  },
  {
    body: "coFishMint",
    belly: "coFishPale",
    back: "coFishBlue",
    fin: "coFishMint",
    spots: ["coFishWhite", "coFishWhite"]
  },
  {
    body: "coFishLilac",
    belly: "coFishWhite",
    back: "coFishBlue",
    fin: "coFishLilac",
    spots: ["coFishPink", "coFishPink"]
  }
], coHash = (value) => {
  let x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}, CO_GROUPS = [8, 7, 7], CO_FISH = CO_GROUPS.flatMap(
  (count, g) => Array.from({ length: count }, (_, j) => {
    let i = CO_GROUPS.slice(0, g).reduce((a, b) => a + b, 0) + j, h = (k) => coHash(i * 13.7 + k * 3.1 + 0.5), lane = Math.min(1, Math.max(0, (j + 0.5) / count + (h(3) - 0.5) * 0.08));
    return {
      size: 42 + 20 * h(1),
      speed: 37,
      lane,
      // further on in the round the lower in the band, so each group leans down to the front, as a school going down
      phase: g / CO_GROUPS.length + 0.05 + (lane - 0.5) * 0.12 + (h(4) - 0.5) * 0.02,
      drift: 3 + 4 * h(5),
      period: 3.5 + 2.5 * h(6),
      surge: 6 + 6 * h(11),
      surgePeriod: 2.5 + 2 * h(12),
      beat: 1.4 + 1 * h(7),
      wag: 0.05 + 0.03 * h(8),
      scales: Math.floor(h(9) * CO_SCALES.length),
      from: j % 3 === 2 ? 600 : 0,
      seed: h(10)
    };
  })
), COMPANY = {
  ...HERO,
  intro: !1,
  /* Its still picture is painted where a group is crossing the middle of the sea on any canvas, a phone's too: at the
     meadow's clock one group is coming in on a phone and the next going out, both in the glass at the sides, which a
     still picture leaves out (see `school`), and the sea would be empty. */
  stillAt: 9.5,
  words: ".co-copy",
  // a few beads, the oval of page kept round the words shallow, and every line carried to the canvas's edges
  lines: { ...LINES, lift: 0.08, veil: [80, 18], beadChance: 0.12, whole: !0 },
  film: FOOTER.film,
  /* The sea's haze and light are large soft strokes that breathe and twinkle every frame, so they cost by the canvas's
     pixels: on a canvas wider than any laptop's (1800 CSS pixels, a window 2080 wide) it draws at a little less than
     the screen's density, the less the wider it is, so that it never costs much more than it does there (on a
     screen 2560 wide at 2x, about 5 milliseconds a frame instead of 6.3). */
  dprCap: (w) => Math.min(2, 2 * Math.sqrt(1800 / w)),
  inks: CO_INKS,
  // the stars on the water twinkle, the strokes are even (neither bowing nor tapering) and soft-edged
  twinkle: !0,
  marks: !0,
  glyphs: !0,
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    relief: [1, 1],
    sheets: [
      // the sky's glow, a band from the buttons' foot down to the horizon, so that nothing of the picture rises behind
      // the words (not named 'sky', which the land is laid out from before its room is known, and this one's top is
      // worked out from it)
      {
        name: "air",
        top: (stage) => {
          let under = Math.min((stage.words.y + stage.words.b + 3 - stage.base) / stage.room, CO_HORIZON - 0.06);
          return [
            [-1.6, under],
            [1.6, under]
          ];
        },
        foot: [
          [-1.6, CO_HORIZON],
          [1.6, CO_HORIZON]
        ],
        paint: [
          [0, "coLilac", 0],
          [0.3, "coDawn", 0.44],
          [0.75, "coPeach", 1],
          [1, "coPeach", 1]
        ],
        fill: 0.6,
        under: 0.4,
        flow: 1.1,
        breath: 2
      },
      // the far shore, low hills along the horizon
      {
        name: "shore",
        opaque: !0,
        top: {
          crest: [
            [-1.6, CO_HORIZON - 0.07],
            [-1.15, CO_HORIZON - 0.11],
            [-0.8, CO_HORIZON - 0.06],
            [-0.45, CO_HORIZON - 0.03],
            [0.5, CO_HORIZON - 0.025],
            [0.85, CO_HORIZON - 0.075],
            [1.2, CO_HORIZON - 0.1],
            [1.6, CO_HORIZON - 0.06]
          ]
        },
        foot: [
          [-1.6, CO_HORIZON + 0.02],
          [1.6, CO_HORIZON + 0.02]
        ],
        paint: [
          [0, "coShore", 0],
          [0.2, "coShore", 0.9],
          [1, "coShoreDeep", 1]
        ],
        fill: 0.7,
        under: 0.6,
        flow: 0.6,
        breath: 1.4
      },
      // the sea, from the horizon to the canvas's foot, palest at the horizon
      {
        name: "meadow",
        opaque: !0,
        laid: !0,
        top: [
          [-1.6, CO_HORIZON],
          [1.6, CO_HORIZON]
        ],
        foot: [
          [-1.6, 1.3],
          [1.6, 1.3]
        ],
        paint: [
          [0, "coWaterHi", 1],
          [0.18, "coWater", 1],
          [0.55, "coWaterDeep", 1],
          [1, "coWaterNear", 1]
        ],
        fill: 0.74,
        under: 0.7,
        patch: 0.12,
        flow: 0.9,
        breath: 1.6
      }
    ],
    least: 110
  },
  grass: null,
  flowers: null,
  passer: null,
  pointer: !1,
  clouds: [],
  // no butterflies: the fish are this sea's flock, but the lens all the same, for the fade at the canvas's foot
  flock: [],
  // and the fish's glass gives off only a little light onto the water round it
  lens: { ...LENS, foot: "ease", always: !0, halo: [2.6, 0.2] },
  school: {
    fish: CO_FISH,
    size: (w) => CO_SCALE(w) * CO_FISH_SIZE,
    // from well under the horizon (on a desktop it lies about 25px under the buttons' foot), far enough that a fish
    // the fall lifts on the left keeps clear of it, to above the canvas's foot, where it fades into the page, falling
    // across the canvas towards the right, less on a narrow one, where a steep fall would tip the fish over
    band: ({ w, h, words }) => [
      Math.max(words.y + words.b + 88, h * 0.4),
      h * 0.87,
      h * 0.15 * Math.min(1, w / 1232)
    ],
    // the blur of its speed trails nearly two lengths behind its middle, its light a little ahead of its snout, and the
    // last of its glow, which the glass blurs out further still, about half a length beyond either
    reach: [1.9, 0.7],
    glow: [2.35, 1.3],
    scatter: { radius: 120, push: 340, back: 1.4 }
  },
  paints: {
    ...PAINTS,
    // the path of light on the water, the waves' glints, the stars
    coRefPink: ["#f4a9c2", "#e396b8"],
    coRefPeach: ["#ffd5c0", "#ecb498"],
    coRefLight: ["#fff1e8", "#efd2c8"],
    coWave: ["#e2f4f7", "#8fc2d4"],
    coWaveDeep: ["#a7d0e1", "#4f88aa"],
    coStar: ["#ffffff", "#ffffff"],
    coStarGold: ["#ffe46e", "#ffdc55"],
    coStarGlow: ["#fff5c8", "#fff1b4"],
    // the fish
    coFishPink: ["#f6a9c6", "#f19ac0"],
    coFishRose: ["#e77ea6", "#e070a0"],
    coFishWhite: ["#fdf7f2", "#f6f0f6"],
    coFishCream: ["#fff0d4", "#f8e6c6"],
    coFishRed: ["#e8452f", "#e2422e"],
    coFishOrange: ["#ff9b3d", "#fb9134"],
    coFishCoral: ["#ff6e4f", "#fb6448"],
    coFishPeachy: ["#ffc9b0", "#fbbda2"],
    coFishBlue: ["#5d8fe2", "#5a8be0"],
    coFishNavy: ["#2c4a8c", "#2a4686"],
    coFishPale: ["#dcecf8", "#d2e6f6"],
    coFishGreen: ["#2f6b42", "#2f6a42"],
    coFishYellow: ["#ffd650", "#fcce42"],
    coFishMint: ["#93dcb0", "#86d4a6"],
    coFishLilac: ["#c3b4ef", "#b8a8ec"],
    coFishEye: ["#ff4b3a", "#ff5545"],
    coFishInk: ["#1f2b3c", "#1a2433"],
    // the light round a fish: lost in the sea by day, a glow at night
    coFishGlow: ["#a8d2e8", "#fff3e4"],
    // the water's own colours, washed across it, and the light dappled on its ripples
    coPoolLime: ["#cfe383", "#4f7a3e"],
    coPoolGreen: ["#94cc72", "#3a6a4a"],
    coPoolSky: ["#acd8f4", "#36689a"],
    coPoolTeal: ["#86cbc4", "#2c6670"],
    coDapple: ["#fffbea", "#bcd2dc"],
    coDappleLime: ["#eef7b8", "#93b57e"]
  },
  plant: (garden) => {
    let { w, h, rand, ground } = garden, half = w / 2, sc = CO_SCALE(w), put = (n2, { x, y, ...o }) => {
      rand.reseed(77001 + n2 * 7919);
      let root = h + 40;
      garden.dab({
        kind: CO_HAZE,
        blur: 0.6,
        load: 0.9,
        turn: 0,
        ...o,
        x,
        y: root,
        stem: root - y,
        lean: 0,
        stiff: 1
      });
    }, horizon = ground("meadow", half), deep = h - 6, n = 0, pools = { count: 26, load: 1.6, green: 0.7, size: 1.3 }, ripples = { centers: 6, rings: 6, density: 1.3, load: 1.2 };
    for (let k = 0; k < pools.count; k += 1) {
      let f = hashed(k * 4.3 + 2.1) ** 0.9, y = horizon + 8 + f * (deep - horizon - 14), x = hashed(k * 6.7 + 0.8) * w, long = (0.05 + 0.15 * f) * w * pools.size * (0.7 + 0.6 * hashed(k * 2.9)), pick = hashed(k * 8.1 + 0.3), paint = "coPoolTeal";
      pick < pools.green * 0.55 ? paint = "coPoolLime" : pick < pools.green ? paint = "coPoolGreen" : pick < pools.green + (1 - pools.green) * 0.6 && (paint = "coPoolSky"), put(n += 1, {
        x,
        y,
        long,
        wide: 0.18 + 0.16 * f,
        blur: long * 0.6,
        paints: [paint, paint],
        load: Math.min(0.9, (0.2 + 0.2 * hashed(k * 5.5)) * pools.load),
        order: 590 + f
      });
    }
    let CENTERS = [
      [0.2, 0.42],
      [0.46, 0.72],
      [0.7, 0.5],
      [0.88, 0.86],
      [0.08, 0.8],
      [0.6, 0.25]
    ];
    for (let c = 0; c < Math.min(ripples.centers, CENTERS.length); c += 1) {
      let [across, depth] = CENTERS[c], cx = across * w, cy = horizon + 8 + depth * (deep - horizon - 14), flat = 0.2 + 0.18 * depth, r0 = (18 + 30 * depth) * sc;
      for (let ring = 0; ring < ripples.rings; ring += 1) {
        let rx = r0 * (1 + 0.6 * ring), ry = rx * flat, from = hashed(c * 31 + ring * 7.3) * Math.PI * 2, span = (0.45 + 0.4 * hashed(c * 17 + ring * 5.1)) * Math.PI * 2, wobble = 0.06 + 0.06 * hashed(c * 13 + ring * 2.9), around = Math.PI * 2 * Math.sqrt((rx * rx + ry * ry) / 2), count = Math.floor(around / (14 * sc) * ripples.density);
        for (let j = 0; j < count; j += 1) {
          let q = c * 1e3 + ring * 100 + j, a = (j + hashed(q * 2.3) * 0.6) / count * Math.PI * 2;
          if ((a - from + Math.PI * 4) % (Math.PI * 2) > span)
            continue;
          let swell = 1 + wobble * Math.sin(a * 3 + c * 1.7 + ring), px = cx + Math.cos(a) * rx * swell, py = cy + Math.sin(a) * ry * swell;
          if (hashed(q * 1.7) < 0.35 || py < horizon + 4 || py > deep)
            continue;
          let fade = 1 - ring / ripples.rings * 0.6, long = (3 + 5 * hashed(q * 3.1)) * sc * (0.7 + 0.6 * depth), ink = "coWave";
          hashed(q * 4.7) < 0.55 ? ink = "coDapple" : hashed(q * 5.9) < 0.6 && (ink = "coDappleLime"), put(n += 1, {
            x: px,
            y: py,
            long,
            wide: 0.32,
            turn: Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx),
            blur: 0.9 + 0.6 * depth,
            paints: [ink, ink],
            load: Math.min(0.95, (0.45 + 0.35 * hashed(q * 6.1)) * fade * ripples.load),
            order: 640 + depth
          });
        }
      }
    }
    let ROWS = 26;
    for (let k = 0; k < ROWS; k += 1) {
      let f = ((k + 0.5) / ROWS) ** 1.45, y = horizon + 5 + f * (deep - horizon - 5), spread = (0.02875 + 0.184 * f) * w, pieces = 1 + Math.floor(hashed(k * 5.3 + 0.2) * 3);
      for (let j = 0; j < pieces; j += 1) {
        let q = k * 17 + j, x = half + (hashed(q * 2.7 + 0.4) - 0.5) * 2 * spread, long = (0.018 + 0.105 * f) * w * (0.55 + 0.9 * hashed(q * 4.1 + 0.6)), thick = (2.398 + 7.848 * f) * sc;
        put(n += 1, {
          x,
          y: y + (hashed(q * 6.3) - 0.5) * 4 * sc,
          long,
          wide: clamp(thick / long, 0.02, 0.7),
          turn: (hashed(q * 8.9) - 0.5) * 0.17,
          blur: 0.8 + 2.2 * f,
          paints: [hashed(q * 9.7) < 0.7 ? "coRefPink" : "coRefPeach", "coRefLight"],
          load: Math.min(0.97, 0.65 + 0.455 * hashed(q * 3.3 + 0.9)),
          order: 600 + f
        });
      }
    }
    for (let k = 0; k < 120; k += 1) {
      let f = hashed(k * 3.7 + 1.1) ** 1.3, y = horizon + 4 + f * (deep - horizon - 4), x = hashed(k * 5.9 + 0.3) * w, long = (8e-3 + 0.03 * f) * w * (0.6 + 0.8 * hashed(k * 2.3)) * 1.6;
      put(n += 1, {
        x,
        y,
        long,
        wide: clamp((0.9 + 2.1 * f) * sc / long, 0.01, 0.5),
        turn: (hashed(k * 7.1) - 0.5) * 0.1,
        blur: 0.6 + 0.8 * f,
        paints: ["coWave", hashed(k * 1.9) < 0.5 ? "coWave" : "coWaveDeep"],
        load: Math.min(0.97, 0.455 + 0.455 * hashed(k * 4.4)),
        order: 620 + f
      });
    }
    for (let k = 0; k < 130; k += 1) {
      let f = hashed(k * 2.9 + 0.7) ** 1.2, y = horizon + 6 + f * (deep - horizon - 12), x = hashed(k * 6.1 + 0.2) < 0.5 ? half + (hashed(k * 3.3) - 0.5) * (0.1 + 0.4 * f) * w : hashed(k * 4.7 + 0.9) * w, r = (4.95 + 10.35 * hashed(k * 8.3)) * sc * (0.6 + 0.6 * f), ink = hashed(k * 9.1) < 0.45 ? "coStarGold" : "coStar", id = 5e4 + k;
      put(id, {
        x,
        y,
        long: r,
        wide: 0.1,
        turn: 0,
        blur: 0.5,
        paints: [ink, "coStarGlow"],
        load: 0.95,
        kind: CO_TWINKLE,
        order: 700 + f
      }), put(id, {
        x,
        y,
        long: r * 0.75,
        wide: 0.12,
        turn: Math.PI / 2,
        blur: 0.5,
        paints: [ink, "coStarGlow"],
        load: 0.95,
        kind: CO_TWINKLE,
        order: 700.001 + f
      }), put(id, {
        x,
        y,
        long: r * 0.38,
        wide: 1,
        blur: r * 0.35,
        paints: ["coStarGlow", ink],
        load: 0.9,
        kind: CO_GLIMMER,
        order: 700.002 + f
      });
    }
    let hx = half, hy = h / 2, fishScale = sc * CO_FISH_SIZE;
    CO_FISH.forEach((f, i) => {
      let len = f.size * fishScale, scales = CO_SCALES[f.scales], phase = 400 + i, base = 2e3 + i * 0.1, at = (lx, ly) => ({ x: hx + lx * len, y: hy + ly * len }), id = 9e4 + i * 40;
      put(id + 3, {
        ...at(-0.05, 0),
        long: len * 0.7,
        wide: 0.55,
        blur: len * 0.45,
        paints: ["coFishGlow", "coFishGlow"],
        load: 0.1,
        order: base - 1e-3,
        phase
      }), [
        [-0.81, -0.04, 0.567, 0.51],
        [-1.107, 0.03, 0.486, 0.33],
        [-1.377, -0.01, 0.405, 0.18]
      ].forEach(([lx, ly, long, load], j) => {
        put(id + j, {
          ...at(lx, ly),
          long: long * len,
          wide: 0.2,
          blur: len * 0.2,
          paints: [scales.body, scales.body],
          load,
          order: base,
          phase
        });
      }), put(id + 4, {
        ...at(0, 0),
        long: len * 0.37,
        wide: 0.36,
        blur: len * 0.05,
        paints: [scales.body, scales.body],
        load: 0.95,
        order: base + 2e-3,
        phase
      }), put(id + 5, {
        ...at(0.02, 0.06),
        long: len * 0.27,
        wide: 0.2,
        blur: len * 0.05,
        paints: [scales.belly, scales.belly],
        load: 0.6,
        order: base + 3e-3,
        phase
      }), put(id + 6, {
        ...at(-0.02, -0.07),
        long: len * 0.28,
        wide: 0.16,
        blur: len * 0.05,
        paints: [scales.back, scales.back],
        load: 0.45,
        order: base + 4e-3,
        phase
      }), scales.spots.forEach((paint, j) => {
        let q = i * 11 + j, lx = -0.25 + 0.4 * coHash(q * 2.3 + 0.1), ly = (coHash(q * 3.9 + 0.7) - 0.6) * 0.14, r = (0.035 + 0.05 * coHash(q * 5.1)) * len;
        put(id + 8 + j, {
          ...at(lx, ly),
          long: r,
          wide: 0.85,
          blur: r * 0.4,
          paints: [paint, paint],
          load: 0.85,
          order: base + 5e-3,
          phase
        });
      }), [-1, 1].forEach((side, j) => {
        put(id + 20 + j, {
          ...at(-0.43, side * 0.035),
          long: len * 0.168,
          wide: 0.42,
          turn: side * 0.5,
          blur: len * 0.03,
          paints: [scales.fin, scales.belly],
          load: 0.8,
          order: base + 6e-3,
          phase
        });
      }), put(id + 24, {
        ...at(0.27, 0),
        long: len * 0.09,
        wide: 0.75,
        blur: len * 0.04,
        paints: [scales.belly, scales.body],
        load: 0.45,
        order: base + 7e-3,
        phase
      }), put(id + 25, {
        ...at(0.27, -0.035),
        long: len * 0.034,
        wide: 1,
        blur: len * 0.012,
        paints: ["coFishEye", "coFishEye"],
        load: 0.95,
        order: base + 8e-3,
        phase
      }), put(id + 26, {
        ...at(0.28, -0.035),
        long: len * 0.015,
        wide: 1,
        blur: len * 6e-3,
        paints: ["coFishInk", "coFishInk"],
        load: 0.9,
        order: base + 9e-3,
        phase
      });
    });
  }
}, PR_INKS = {
  // the land's inks the engine asks for, unused here
  ...LAND_INK,
  // the sky, from its top down: cream, butter at the sides, the pale light the words stand in, peach, and apricot
  // over the horizon; at dusk the top is night coming on and the words stand in its deep plum
  cream: ["#f7e2c6", "#2b2340"],
  butter: ["#f6cc80", "#4a3858"],
  light: ["#f8dcab", "#3a2c4b"],
  peach: ["#f7b386", "#7a4a66"],
  apricot: ["#f5a56c", "#b25e5e"],
  // the glow, from its pale heart to its deep foot over the horizon
  pale: ["#fbd6c6", "#40304f"],
  blush: ["#f9c4b6", "#6a4262"],
  // the column's head, over the words, dimmer at dusk
  rose: ["#f5a49a", "#6e4466"],
  pink: ["#f5a49a", "#a85674"],
  salmon: ["#f3988a", "#d0687a"],
  coral: ["#f08a6c", "#e27b5c"],
  // the horizon, its soft top and its hot middle and foot
  tangerine: ["#f39a58", "#eb7a45"],
  gold: ["#f7c070", "#ffb054"],
  flame: ["#ee7a3c", "#f2662e"],
  ember: ["#e2602e", "#df4f27"],
  // the sea, slate-lavender under the horizon and warmer towards us
  slate: ["#8c859c", "#544c6e"],
  seaHigh: ["#988ea4", "#4d4767"],
  lavender: ["#a69aae", "#443e5d"],
  lavenderLow: ["#b4a5b2", "#302b45"],
  sand: ["#c5b1a4", "#1f1c2a"],
  sheen: ["#f6dfc2", "#3e3354"],
  // the sun: its middle, nearly white on a light page and at dusk the deepest of the warm darks, so the words read on
  // it either way; its face's edge; its rim, pale gold, at dusk glowing; the glow just past it; and its halo, the pink
  // it fades into
  sunCore: ["#fffcf6", "#1c0f17"],
  sunFace: ["#ffecce", "#4a1d2b"],
  sunRim: ["#ffc98a", "#ff9a5c"],
  sunGlow: ["#ffa98a", "#f06a62"],
  sunHalo: ["#f598a0", "#a8406c"],
  // its reflection in the sea, in streaks
  sunWater: ["#f8d0a4", "#e08868"],
  sunWaterLow: ["#efb9a6", "#8f4766"]
}, PR_ACROSS = Array.from({ length: 129 }, (_, k) => -1.6 + 3.2 * k / 128), prWords = ({ w, words, room, base }) => {
  let half = w / 2;
  return {
    at: (words.x - half) / half,
    wide: (words.a + 24) / half,
    top: (words.y - words.b - base) / room,
    mid: (words.y - base) / room,
    foot: (words.y + words.b - base) / room
  };
}, prTop = ({ base, room }) => -base / room, prWave = (stage, x, high, long, phase = 0) => high / stage.room * Math.sin(x * stage.w / 2 / long * Math.PI * 2 + phase), PR_SUN_FACE = 0.9, prSun = (stage) => {
  let { w, words, base } = stage, top = words.y - words.b, foot = words.y + words.b, y = foot + (base - foot) * 0.3, r = (Math.max(
    Math.hypot(Math.min(words.a, 168), y - top),
    Math.hypot(words.a, y - (top + words.b * 0.7)),
    Math.hypot(Math.min(words.a, 194), y - foot)
  ) + 10) / PR_SUN_FACE;
  if (2 * r < 0.94 * w)
    return { x: words.x, y, r };
  let small = Math.min(w * 0.46, (base - top) * 0.6);
  return { x: words.x, y: foot - 100 + small, r: small };
}, PR_GLOW = {
  place: (stage) => {
    let { at, wide, mid } = prWords(stage);
    return { at: [at, mid + 0.25], half: [Math.max(0.3, wide * 1.1), 1.6] };
  },
  breathe: [0.08, 14]
}, prReflection = (stage) => {
  let { w } = stage, sun = prSun(stage);
  return { at: [(sun.x - w / 2) / (w / 2), 0.32], half: [Math.max(0.2, sun.r * 0.55 / (w / 2)), 0.6] };
}, prSunset = (stage) => {
  let { w } = stage, sun = prSun(stage);
  return { at: [(sun.x - w / 2) / (w / 2), 0], half: [sun.r * 0.85 / (w / 2), 0.3] };
}, prZone = (stage) => {
  let { w, room, base } = stage, half = w / 2, { at, half: size } = prReflection(stage);
  return {
    x: half + at[0] * half,
    y: base + 0.3 * room,
    a: Math.max(size[0] * half * 0.95, 110),
    b: Math.max(room * 0.24, 50)
  };
}, prHorizon = (stage, x, lift = 0) => lift + prWave(stage, x, 2, 1900, 0.9), prHorizonTop = (stage, x) => prHorizon(stage, x, -0.16) + prWave(stage, x, 10, 1500, 2.1) + prWave(stage, x, 3, 610, 0.3), prDip = (stage, x) => 0.02 * stage.w * (1 - x) / stage.room + prWave(stage, x, 6, 1700, 0.6), PRICING = {
  ...HERO,
  words: ".pr-copy",
  // The hero's lines, lifted a little less between them on a light page, so the colour fields read as full as the
  // painting's; round the words a soft veil that thins the lines a little rather than clearing them (the sun does the
  // rest); and every line reaching past the canvas's right edge once it is in (`whole`), so none stops short of it in
  // a dash of page.
  lines: {
    ...LINES,
    lift: 0.15,
    veil: [150, 100],
    veilCore: 0,
    veilDepth: [0.25, 0.35],
    sink: 70,
    introMs: 2600,
    whole: !0
  },
  inks: PR_INKS,
  glow: PR_GLOW,
  waves: !0,
  // The sun, behind the words: white at its middle (at dusk the deepest warm dark), a pale gold limb, glowing at its
  // rim, a halo of apricot and pink round it fading into the column and the peach. Its light comes in from a little
  // under the header, higher than the lines do, so its top is a soft glow on the page; on a light page it lays none
  // on its face, where the page is its white, and at dusk it lays its deep glow there.
  sun: {
    place: prSun,
    face: PR_SUN_FACE,
    halo: 0.45,
    rim: 0.09,
    rise: (stage) => [stage.h * 0.04, stage.words.y - stage.words.b * 0.6],
    inks: ["sunCore", "sunFace", "sunRim", "sunGlow", "sunHalo"],
    light: [
      [0, 0.7],
      [0.4, 0.6],
      [0.35, 0.45]
    ],
    lines: [
      [0.8, 0.85],
      [1, 0.08]
    ],
    breathe: [0.06, 13]
  },
  // The sky's lines come in from nothing: none at all under the header, then thin, few and pale, with hardly a bead,
  // and at their full only a little under the words; a long ramp eased in, so the top third of the canvas is the page.
  fade: {
    at: (stage) => {
      let foot = stage.words.y + stage.words.b;
      return [stage.h * 0.05, foot + (stage.base - foot) * 0.15];
    },
    ease: 1.6,
    pale: 0.6,
    sparse: 0.8,
    specks: 2.5
  },
  land: {
    ...HERO.land,
    // No hill: the land's line is the horizon, level across the stage, and its room the sea under it, the sky above
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    relief: [1, 1],
    room: 220,
    foot: 8,
    head: 0,
    least: 150,
    sheets: [
      // The sky, one band of lines from just under the header to the horizon, which hides its foot: cream at its very
      // top, butter at the sides, peach and apricot lower down; and in its middle the column of pink light, rose over
      // the words, paling to its heart where the sun stands and deepening under it to salmon and coral over the
      // horizon. Its lines rise a little to the right, and its colours with them; they come in from nothing (fade),
      // and take the sun's light as they run into it.
      {
        name: "air",
        top: (stage) => PR_ACROSS.map((x) => [x, prTop(stage) + 2 / stage.room + Math.max(0, prDip(stage, x))]),
        foot: (stage) => PR_ACROSS.map((x) => [x, prHorizon(stage, x, -0.05)]),
        paint: [
          [0, "cream", 0.08],
          [0.06, "cream", 0.6],
          [0.12, "cream", 0.95],
          [0.4, "butter", 1],
          [0.62, "butter", 1],
          [0.8, "peach", 1],
          [0.93, "apricot", 1],
          [1, "tangerine", 0.9]
        ],
        glow: [
          [0, "blush", 0.08],
          [0.06, "blush", 0.6],
          [0.16, "rose", 0.95],
          [0.3, "rose", 1],
          [0.4, "pale", 1],
          [0.72, "pale", 1],
          [0.8, "pink", 1],
          [0.9, "salmon", 1],
          [1, "coral", 0.95]
        ],
        glowTake: 1.5,
        sun: [1, 1],
        fade: !0,
        fill: 0.6,
        under: 0.76,
        patch: 0.18,
        lean: 0.08,
        beads: [1, 0.5],
        flow: 0.6,
        breath: 4
      },
      // The sea, slate under the horizon, lavender further down and warming to sand towards us, in stripes that run
      // through each other line by line, with the sun's reflection in it in streaks, and thinning into specks at its
      // foot. It runs on up under the horizon, which hides its top. Its lines roll gently on a wave of their own.
      {
        name: "sea",
        top: (stage) => PR_ACROSS.map((x) => [x, prHorizon(stage, x, -0.02)]),
        // level at the horizon and rolling more and more towards us, as swells seen across still water do
        foot: (stage) => PR_ACROSS.map((x) => [x, 0.98 + prWave(stage, x, 9, 900, 2.2) + prWave(stage, x, 4, 430, 0.7)]),
        paint: [
          [0, "slate", 0.95],
          [0.08, "slate", 1],
          [0.22, "seaHigh", 1],
          [0.36, "lavender", 1],
          [0.46, "seaHigh", 1],
          [0.6, "lavender", 1],
          [0.72, "lavenderLow", 1],
          [0.82, "sand", 0.8],
          [0.92, "sand", 0.35],
          [1, "sand", 0]
        ],
        glow: [
          [0, "sunWater", 0.9],
          [0.3, "sunWater", 1],
          [0.62, "sunWaterLow", 1],
          [0.82, "sunWaterLow", 0.8],
          [0.92, "sunWaterLow", 0.35],
          [1, "sunWaterLow", 0]
        ],
        glowAt: prReflection,
        glowTake: 0.85,
        shimmer: 1,
        fill: 0.62,
        under: 0.8,
        patch: 0.3,
        beads: [0.5, 0.25],
        flow: 0.3,
        breath: 2.5,
        wave: [2.5, 760, 0.28, 1.3]
      },
      // The horizon: hot orange, soft above and crisp at its foot, a long wave running along its top, and the band
      // rising and falling slowly on a longer one.
      {
        name: "horizon",
        // it hides the sky's foot and the sea's top behind it, and its soft top comes in over the sky with its haze
        opaque: !0,
        laid: !0,
        top: (stage) => PR_ACROSS.map((x) => [x, prHorizonTop(stage, x)]),
        foot: (stage) => PR_ACROSS.map((x) => [x, prHorizon(stage, x, 0.012)]),
        paint: [
          [0, "tangerine", 0],
          [0.12, "tangerine", 0.7],
          [0.3, "flame", 1],
          [0.4, "gold", 1],
          [0.47, "flame", 1],
          [0.8, "ember", 1],
          [1, "ember", 1]
        ],
        // where the sun goes down behind it, it glows gold
        glow: [
          [0, "sunGlow", 0],
          [0.12, "sunGlow", 0.75],
          [0.28, "gold", 1],
          [0.4, "sunRim", 1],
          [0.5, "gold", 1],
          [0.75, "flame", 1],
          [1, "ember", 1]
        ],
        glowAt: prSunset,
        glowTake: 0.7,
        fill: 0.72,
        under: 0.9,
        patch: 0.15,
        flow: 0.45,
        breath: 3,
        wave: [3, 1800, 0.18, 0]
      }
    ]
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  clouds: [],
  // Five of the family, at the hero's sizes, none of them in the picture until the pointer rests on the sun's
  // reflection in the sea: then each comes in through the glass at the sides and goes round the pointer on a ring of
  // its own, so far out, so fast and that way round (one goes the other way), tipped back so far and leaning so far,
  // and trailing the pointer by so much; and they go when it does.
  flock: [
    { size: 21, seed: 0.13, pastel: 0, wing: "round", ring: 42, spin: 1.45, tilt: 1.05, lean: 0.14, trail: 0.2 },
    { size: 25, seed: 0.46, pastel: 1, wing: "broad", ring: 88, spin: 0.86, tilt: 1.18, lean: -0.12, trail: 0.36 },
    { size: 19, seed: 0.79, pastel: 2, wing: "slim", ring: 66, spin: -1.05, tilt: 1, lean: 0.24, trail: 0.28 },
    { size: 23, seed: 0.31, pastel: 0, wing: "broad", ring: 112, spin: 0.68, tilt: 1.24, lean: -0.06, trail: 0.44 },
    { size: 18, seed: 0.62, pastel: 2, wing: "round", ring: 132, spin: 0.6, tilt: 1.3, lean: -0.18, trail: 0.5 }
  ],
  // the glass along the top is left out: the hero's top is the site's header
  lens: { ...LENS, top: !1 },
  // The place that calls them is the sun's reflection on the sea, under the buttons and clear of them: the warmest
  // light in the lower half of the picture, where the eye goes down from the sun, with the sea's room round it for
  // their rings.
  orbit: { zone: prZone },
  stillAt: 6
}, FLIGHT_BAND = {
  ...HERO,
  intro: !1,
  // built in idle time once within two screens, and painted when within one
  wake: "200% 0px",
  near: "100% 0px",
  words: null,
  // No land: the land's line lies along the canvas's top and its room is the canvas's height, so the air below is in
  // shares of the band.
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    sheets: [],
    room: ({ h }) => h,
    foot: 0,
    head: 0,
    least: 20
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  clouds: [],
  // The hero's four, at the Deploy page's scale: its three depths' sizes (44, 64 and 90 CSS pixels to a wing unit at
  // a window of 1440 by 800), and one between.
  flock: [
    { ...FLOCK[0], size: 64 },
    { ...FLOCK[1], size: 90 },
    { ...FLOCK[2], size: 44 },
    { ...FLOCK[3], size: 56 }
  ],
  // the middle of the band, over the middle of the cards, each in the lane the hero gives it (the band has 120px of
  // room above and below the cards, for wings this size)
  air: {
    top: [
      [-1.6, 0.38],
      [1.6, 0.38]
    ],
    foot: [
      [-1.6, 0.62],
      [1.6, 0.62]
    ]
  },
  // The heroes' glass, but nothing of the picture behind the wings, since the band's canvas lies over the cards; and only
  // along its sides, where they come in and go out, as the top of the band is the middle of the page and no edge of it.
  // Its colours are hardly split at all: the split grows with the distance from the canvas's middle, which on a band
  // this wide is far, and wings this large come through it whole, so even a little more smeared them into rainbows.
  lens: { ...LENS, foot: !1, top: !1, clear: !0, split: 3e-3 },
  // As large as the Deploy page's at the same width, however short the band, up to the size they are there at 1300
  // pixels: any larger and the room over the cards is too little for their wings.
  fit: (w) => clamp(w / 1300, 0.56, 1),
  /* When they cross: every `every` seconds, taking `across` to go from beyond one edge to beyond the other, each this
     many seconds behind the first. At rest (reduced motion), how far across each one is, how far down from the
     canvas's top, in its own sizes, and how large, as a share of its size in flight: just above the cards, which start
     120px down (the page's inset), with the whole of their wings in the band and clear of the numbers. And how far
     from the band's top and foot their bodies keep in flight, in their own sizes, so that a wing beating is never cut
     off by the canvas's edge. */
  crossing: {
    every: 11,
    across: 4.4,
    after: [0, 0.5, 0.22, 0.85],
    rest: [0.3, 0.46, 0.6, 0.72],
    restY: [1.88, 1.25, 2.94, 2.05],
    restSize: 0.8,
    room: 1.35
  }
}, DOCS_EVEN = 5e-3, DOCS_FAR = [
  [-1.6, 0.16],
  [-0.9, 0.1],
  [-0.35, 0.05],
  [0.1, 0.035],
  [0.55, 0.07],
  [1.1, 0.12],
  [1.6, 0.17]
], DOCS_LEFT = [
  [-1.6, -0.02],
  [-1.25, 0.03],
  [-0.9, 0.13],
  [-0.6, 0.28],
  [-0.36, 0.46],
  [-0.16, 0.62],
  [0.05, 0.74],
  [0.4, 0.86],
  [1.6, 1.05]
], DOCS_RIGHT = [
  [-1.6, 1.08],
  [-0.4, 0.9],
  [-0.08, 0.79],
  [0.14, 0.66],
  [0.34, 0.5],
  [0.62, 0.32],
  [0.95, 0.17],
  [1.3, 0.07],
  [1.6, 0.02]
], DOCS_FIELD = [
  [-1.6, 0.78],
  [-1, 0.9],
  [-0.5, 0.98],
  [0, 1],
  [0.5, 0.98],
  [1, 0.9],
  [1.6, 0.78]
], DOCS_SILHOUETTE = {
  outer: [
    [-0.0566, 0.2035],
    [-0.0509, 0.2285],
    [-0.0521, 0.2392],
    [-0.0625, 0.2611],
    [-0.0832, 0.281],
    [-0.1371, 0.3126],
    [-0.1484, 0.322],
    [-0.1592, 0.3379],
    [-0.171, 0.3785],
    [-0.1689, 0.4373],
    [-0.1702, 0.4849],
    [-0.1913, 0.5751],
    [-0.1978, 0.5903],
    [-0.2004, 0.6196],
    [-0.2102, 0.6726],
    [-0.2106, 0.6844],
    [-0.2066, 0.7067],
    [-0.2131, 0.7385],
    [-0.2096, 0.7606],
    [-0.1997, 0.7814],
    [-0.1977, 0.7928],
    [-0.1923, 0.8011],
    [-0.1881, 0.8032],
    [-0.1843, 0.8029],
    [-0.1811, 0.7975],
    [-0.1822, 0.7609],
    [-0.1807, 0.7537],
    [-0.173, 0.751],
    [-0.1691, 0.7522],
    [-0.1633, 0.7587],
    [-0.1615, 0.7756],
    [-0.1613, 0.8515],
    [-0.154, 0.8792],
    [-0.1456, 0.8955],
    [-0.1455, 0.9145],
    [-0.1372, 0.9452],
    [-0.1321, 0.9565],
    [-0.131, 0.9622],
    [-0.1326, 0.9766],
    [-0.1272, 0.9998],
    [-0.0194, 1],
    [-0.0143, 0.999],
    [-0.0145, 0.9921],
    [-49e-4, 0.9724],
    [29e-4, 0.9681],
    [89e-4, 0.9722],
    [0.0196, 0.9984],
    [0.0248, 1],
    [0.1328, 0.9999],
    [0.1448, 0.9989],
    [0.1472, 0.9959],
    [0.1441, 0.9921],
    [0.1499, 0.9643],
    [0.1429, 0.9384],
    [0.1418, 0.899],
    [0.1479, 0.8677],
    [0.1441, 0.8513],
    [0.1447, 0.849],
    [0.1483, 0.8482],
    [0.1492, 0.8431],
    [0.1502, 0.8042],
    [0.1583, 0.7744],
    [0.1751, 0.734],
    [0.1763, 0.7179],
    [0.1829, 0.6895],
    [0.1945, 0.6573],
    [0.197, 0.6379],
    [0.2085, 0.627],
    [0.2107, 0.6225],
    [0.2123, 0.611],
    [0.2118, 0.5871],
    [0.2053, 0.5547],
    [0.2133, 0.525],
    [0.2116, 0.5139],
    [0.2045, 0.4923],
    [0.2063, 0.4568],
    [0.2052, 0.4393],
    [0.2001, 0.4229],
    [0.194, 0.3896],
    [0.1709, 0.3197],
    [0.1613, 0.3075],
    [0.1554, 0.2916],
    [0.144, 0.2851],
    [0.1322, 0.2739],
    [0.1064, 0.266],
    [0.0814, 0.2508],
    [0.054, 0.2292],
    [0.047, 0.2204],
    [0.0433, 0.2095],
    [0.0416, 0.1991],
    [0.0405, 0.192],
    [0.0411, 0.1872],
    [0.0444, 0.1842],
    [0.0492, 0.181],
    [0.0543, 0.178],
    [0.0593, 0.1747],
    [0.0631, 0.1701],
    [0.0652, 0.1645],
    [0.066, 0.1586],
    [0.0661, 0.1526],
    [0.0662, 0.1466],
    [0.0664, 0.1406],
    [0.0665, 0.1346],
    [0.0667, 0.1286],
    [0.0671, 0.1227],
    [0.0681, 0.1167],
    [0.069, 0.1108],
    [0.07, 0.1049],
    [0.071, 0.099],
    [0.0718, 0.093],
    [0.0722, 0.0871],
    [0.0727, 0.0811],
    [0.0723, 0.0751],
    [0.0719, 0.0691],
    [0.0704, 0.0633],
    [0.0678, 0.0579],
    [0.0653, 0.0525],
    [0.0625, 0.0472],
    [0.0592, 0.0422],
    [0.0551, 0.0378],
    [0.051, 0.0334],
    [0.0463, 0.0297],
    [0.0416, 0.0259],
    [0.0369, 0.0222],
    [0.0322, 0.0185],
    [0.0269, 0.0158],
    [0.0214, 0.0135],
    [0.0159, 0.0111],
    [0.0106, 81e-4],
    [54e-4, 52e-4],
    [-0, 27e-4],
    [-57e-4, 8e-4],
    [-0.0117, 0],
    [-0.0176, 6e-4],
    [-0.0236, 11e-4],
    [-0.0296, 16e-4],
    [-0.0356, 2e-3],
    [-0.0415, 25e-4],
    [-0.0474, 37e-4],
    [-0.0532, 53e-4],
    [-0.0587, 77e-4],
    [-0.0636, 0.0111],
    [-0.0685, 0.0146],
    [-0.0733, 0.0181],
    [-0.0774, 0.0225],
    [-0.0809, 0.0273],
    [-0.0839, 0.0325],
    [-0.0862, 0.038],
    [-0.0889, 0.0433],
    [-0.0923, 0.0483],
    [-0.0957, 0.0532],
    [-0.0976, 0.0588],
    [-0.0991, 0.0646],
    [-0.1006, 0.0704],
    [-0.1021, 0.0763],
    [-0.1033, 0.0821],
    [-0.1035, 0.0881],
    [-0.1023, 0.0939],
    [-0.1003, 0.0996],
    [-0.0988, 0.1053],
    [-0.0985, 0.1113],
    [-0.0983, 0.1173],
    [-0.0981, 0.1233],
    [-0.0978, 0.1293],
    [-0.0973, 0.1352],
    [-0.0957, 0.141],
    [-0.0934, 0.1465],
    [-0.0903, 0.1517],
    [-0.0873, 0.1568],
    [-0.085, 0.1624],
    [-0.0827, 0.1679],
    [-0.0804, 0.1735],
    [-0.0775, 0.1786],
    [-0.0738, 0.1829],
    [-0.0689, 0.186],
    [-0.0634, 0.1883],
    [-0.0608, 0.1901]
  ],
  holes: [
    [
      [0.1286, 0.543],
      [0.1421, 0.569],
      [0.1442, 0.6101],
      [0.1363, 0.6439],
      [0.1364, 0.6728],
      [0.1313, 0.7094],
      [0.1286, 0.714],
      [0.1212, 0.7179],
      [0.1158, 0.7136],
      [0.1115, 0.7042],
      [0.1006, 0.6857],
      [0.0975, 0.6745],
      [0.0974, 0.6515],
      [0.1053, 0.638],
      [0.0973, 0.6339],
      [0.0959, 0.6308],
      [0.0953, 0.5957],
      [0.102, 0.5734],
      [0.1068, 0.5636],
      [0.1223, 0.5422]
    ]
  ]
}, DOCS_COVER = [
  [0, 2.2],
  [0.2, 2.8],
  [0.45, 3],
  [0.7, 2.4],
  [0.85, 2.6],
  [1, 2.2]
], DOCS_DRIFTS = [
  {
    line: [
      [-1.75, 0.02],
      [-1.25, 0.06],
      [-0.85, 0.16],
      [-0.55, 0.28]
    ],
    wide: [0.08, 0.06],
    full: [1, 0.8],
    paints: "marigolds",
    patchy: !0,
    patchyFrom: 0.62,
    own: [0.75, 1.15]
  },
  {
    line: [
      [-1.6, 0.12],
      [-1.1, 0.2],
      [-0.7, 0.34],
      [-0.42, 0.46]
    ],
    wide: [0.06, 0.05],
    full: [0.9, 0.8],
    paints: "sunlit",
    patchy: !0,
    patchyFrom: 0.66
  },
  {
    line: [
      [1.75, 0.02],
      [1.2, 0.08],
      [0.85, 0.18],
      [0.55, 0.3]
    ],
    wide: [0.08, 0.07],
    full: [0.9, 0.75],
    paints: "cornflowers",
    patchy: !0,
    patchyFrom: 0.6
  },
  // round the figure's feet in the valley: a field of gold and marigold in the light
  {
    line: [
      [-0.55, 0.72],
      [-0.2, 0.78],
      [0.2, 0.78],
      [0.55, 0.72]
    ],
    wide: [0.06, 0.06],
    full: [1, 1],
    paints: "marigolds",
    patchy: !0,
    patchyFrom: 0.7
  },
  {
    line: [
      [-0.4, 0.62],
      [0, 0.66],
      [0.4, 0.62]
    ],
    wide: [0.04, 0.04],
    full: [0.8, 0.8],
    paints: "sunlit",
    patchy: !0
  },
  // the front corners in cornflowers
  {
    line: [
      [-1.75, 0.8],
      [-1.2, 0.9],
      [-0.6, 0.96]
    ],
    wide: [0.12, 0.06],
    full: [0.9, 0.6],
    paints: "cornflowers",
    patchy: !0,
    patchyFrom: 0.6
  },
  {
    line: [
      [1.75, 0.8],
      [1.2, 0.9],
      [0.6, 0.96]
    ],
    wide: [0.12, 0.06],
    full: [1, 0.6],
    paints: "cornflowers",
    patchy: !0,
    patchyFrom: 0.6
  },
  // far off, on the far hill: specks of gold where the light reaches
  {
    line: [
      [-0.6, 0.02],
      [0, 0.01],
      [0.6, 0.03]
    ],
    wide: [0.03, 0.03],
    full: [0.7, 0.7],
    paints: "gold specks",
    patchy: !0
  }
], DOCS = {
  ...HERO,
  intro: !1,
  // the docs overview's words, or the home page's where this figure stands in for the meadow
  words: ".dc-copy, .hl-copy",
  // the oval of page kept round the words is shallow under them, so the figure's light just under them stays whole;
  // and the lines' beads glint only here and there, as the footer's do, so the motes are the only sparkle near it
  lines: { ...LINES, lift: 0.08, veil: [80, 18], beadChance: 0.15 },
  // the picture's foot eased in rather than faded evenly, so that the white figure going into a dark page shows no
  // line where the fade begins
  lens: { ...LENS, foot: "ease" },
  film: FOOTER.film,
  inks: FOOTER_INK,
  // the motes twinkle (see the glow in the strokes' shader), and the figure is drawn in plain round strokes that
  // neither bow nor taper (the even mark)
  twinkle: !0,
  marks: !0,
  // its light in the haze kind, which fades smoothly at its edge rather than breaking into the grain's specks as paint
  // does (`glyphs` brings it)
  glyphs: !0,
  // and that light goes into the canvas's foot whole, as the photograph's frame cuts the figure off: white into a light
  // page, fading smoothly into a dark one, never breaking into specks there (see LIGHT_FOOT in the strokes' shader)
  lightFoot: !0,
  land: {
    ...HERO.land,
    clearCopy: true,
    profile: DOCS_FAR,
    crest: 0,
    relief: [1, 1],
    sheets: [
      // a haze of sky over the far hill, thinning into the page at its top
      {
        name: "sky",
        top: {
          crest: [
            [-1.6, -0.12],
            [0, -0.16],
            [1.6, -0.12]
          ]
        },
        foot: {
          hill: [
            [-1.6, 0.06],
            [1.6, 0.06]
          ]
        },
        paint: [
          [0, "pale", 0],
          [0.2, "pale", 0.32],
          [0.45, "sky", 0.7],
          [0.7, "slateHaze", 0.9],
          [1, "slateHaze", 1]
        ],
        fill: 0.7,
        under: 0.38,
        flow: 1.2,
        breath: 2
      },
      // the far hill closing the valley, which the flowers grow on: lit only along its crest, under the words, and
      // deepening soon under it, so the figure's head and shoulders stand against saturated green, as the photograph's
      // white bloom stands against its hills
      {
        name: "meadow",
        opaque: !0,
        laid: !0,
        top: {
          hill: [
            [-1.6, 0],
            [1.6, 0]
          ]
        },
        foot: [
          [-1.6, 1.3],
          [1.6, 1.3]
        ],
        paint: [
          [0, "crest", 0],
          [0.03, "crest", 0.9],
          [0.06, "mist", 1],
          [0.14, "sage", 1],
          [0.3, "fern", 1],
          [0.6, "sage", 1],
          [1, "fern", 1]
        ],
        lean: 0.3,
        fill: 0.74,
        under: 0.78,
        patch: 0.15,
        flow: 0.6,
        breath: 1.4
      },
      // the left hill, lit, gilded along its crest
      {
        name: "left hill",
        opaque: !0,
        top: { crest: DOCS_LEFT },
        foot: [
          [-1.6, 1.32],
          [1.6, 1.32]
        ],
        paint: [
          [0, "gilt", 0],
          [0.025, "gilt", 0.85],
          [0.07, "glow", 1],
          [0.16, "lime", 1],
          [0.3, "green", 1],
          [0.55, "deepGreen", 1],
          [0.85, "shade", 1],
          [1, "shade", 1]
        ],
        lean: 0.3,
        fill: 0.74,
        under: 0.7,
        patch: 0.2,
        flow: 0.7,
        breath: 1.5,
        sheen: 0.6
      },
      // the right hill, turned from the light, in shade from just under its crest
      {
        name: "right hill",
        opaque: !0,
        top: { crest: DOCS_RIGHT },
        foot: [
          [-1.6, 1.32],
          [1.6, 1.32]
        ],
        paint: [
          [0, "lime", 0],
          [0.03, "lime", 0.8],
          [0.08, "green", 1],
          [0.22, "deepGreen", 1],
          [0.5, "shade", 1],
          [1, "night", 1]
        ],
        lean: 0.3,
        fill: 0.74,
        under: 0.7,
        patch: 0.2,
        flow: 0.7,
        breath: 1.5,
        sheen: 0.5
      },
      // the field in front, where the figure stands, in the valley's light
      {
        name: "field",
        opaque: !0,
        top: { crest: DOCS_FIELD },
        foot: [
          [-1.6, 1.34],
          [1.6, 1.34]
        ],
        paint: [
          [0, "gilt", 0],
          [0.06, "glow", 0.9],
          [0.25, "lime", 1],
          [0.55, "green", 1],
          [1, "deepGreen", 1]
        ],
        lean: 0.3,
        fill: 0.72,
        under: 0.6,
        patch: 0.2,
        flow: 0.8,
        breath: 1.5,
        sheen: 0.8
      }
    ],
    least: 110
  },
  grass: FOOTER.grass,
  passer: null,
  flowers: {
    ...FOOTER.flowers,
    focus: 0.7,
    front: 1.65,
    cover: DOCS_COVER,
    drifts: DOCS_DRIFTS,
    strays: 0
  },
  palettes: FOOTER_PALETTES,
  // the footer's paints, and the light's own: white at its heart, a breath of warmth in its glow
  paints: {
    ...FOOTER_PAINTS,
    light: ["#ffffff", "#ffffff"],
    lightWarm: ["#fffaf0", "#fff6e6"],
    lightGlow: ["#fff0cf", "#ffe6b0"]
  },
  clouds: [],
  plant: (garden) => {
    let { w, h, rand, words } = garden, s = clamp(w / 1232, 0.42, 1.12), fx = words.x, top = words.y + words.b + Math.max(24, 28 * s), tall = (h - top) * 1.07, at = ([x, y]) => [fx + x * tall, top + y * tall], rings = [DOCS_SILHOUETTE.outer.map(at), ...DOCS_SILHOUETTE.holes.map((r) => r.map(at))], left = Number.POSITIVE_INFINITY, right = Number.NEGATIVE_INFINITY;
    for (let [x] of rings[0])
      left = Math.min(left, x), right = Math.max(right, x);
    window.__dcDebug && (window.__dcDebug.figure = {
      fx: Math.round(fx),
      top: Math.round(top),
      tall: Math.round(tall),
      wide: Math.round(right - left)
    });
    let laid = 0, bright = (seed) => {
      for (let k = 0; k < 24; k += 1) {
        rand.reseed(seed + k * 104729), rand(), rand(), rand();
        let dice = rand();
        if (dice * 91.7 % 1 >= 0.55 && dice * 37.3 % 1 >= 0.55)
          return seed + k * 104729;
      }
      return seed;
    }, put = (n, o) => {
      rand.reseed(o.light ? bright(51749 + n * 7919) : 51749 + n * 7919), laid += 1, garden.dab({
        stiff: 1,
        lean: 0,
        blur: 0.6,
        load: 0.97,
        kind: 0.25 + DOCS_EVEN,
        ...o,
        order: o.order + laid * 1e-7
      });
    }, runsAt = (x) => {
      let ys = [];
      for (let r of rings)
        for (let i = 0; i < r.length; i += 1) {
          let [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length];
          x1 <= x != x2 <= x && ys.push(y1 + (x - x1) * (y2 - y1) / (x2 - x1));
        }
      ys.sort((a, b) => a - b);
      let runs = [];
      for (let i = 0; i + 1 < ys.length; i += 2)
        runs.push([ys[i], ys[i + 1]]);
      return runs;
    }, inFigure = (x, y) => runsAt(x).some(([a, b]) => y > a && y < b), HAZE = 0.4 + DOCS_EVEN, fill = (n, { col, blur, load, paints, order }) => {
      let k = n;
      for (let x = left + col / 2; x < right; x += col)
        for (let [a, b0] of runsAt(x)) {
          let b = Math.min(b0, h + 24);
          if (b - a < 0.6)
            continue;
          let segs = Math.max(1, Math.round((b - a) / (col * 4))), seg = (b - a) / segs;
          for (let q = 0; q < segs; q += 1) {
            let long = seg / 2 + col * 0.55;
            put(k, {
              x,
              y: a + (q + 0.5) * seg,
              long,
              wide: clamp(col * 0.78 / long, 0.02, 1.4),
              turn: Math.PI / 2,
              paints,
              load,
              blur,
              kind: HAZE,
              order,
              light: !0
            }), k += 1;
          }
        }
      return k;
    }, ord = h + 60;
    put(1, {
      x: fx,
      y: top + tall * 0.45,
      long: tall * 0.95,
      wide: 0.72,
      turn: Math.PI / 2,
      paints: ["lightGlow", "lightWarm"],
      load: 0.12,
      blur: tall * 0.42,
      kind: HAZE,
      order: ord - 0.1,
      light: !0
    }), put(2, {
      x: fx,
      y: top + tall * 0.42,
      long: tall * 0.55,
      wide: 0.5,
      turn: Math.PI / 2,
      paints: ["lightWarm", "lightGlow"],
      load: 0.36,
      blur: tall * 0.15,
      kind: HAZE,
      order: ord - 0.09,
      light: !0
    }), fill(5e4, {
      col: Math.max(5, tall * 0.026),
      blur: tall * 0.13,
      load: 0.38,
      paints: ["lightGlow", "lightWarm"],
      order: ord - 0.085
    }), fill(1e5, {
      col: Math.max(3.5, tall * 0.018),
      blur: tall * 0.065,
      load: 0.72,
      paints: ["lightWarm", "light"],
      order: ord - 0.08
    }), fill(2e5, {
      col: Math.max(2.4, tall * 0.01),
      blur: tall * 0.022,
      load: 0.9,
      paints: ["light", "lightWarm"],
      order: ord - 0.07
    }), fill(3e5, {
      col: Math.max(1.6, tall * 65e-4),
      blur: Math.max(1.6, tall * 7e-3),
      load: 1,
      paints: ["light", "light"],
      order: ord - 0.06
    });
    for (let i = 0; i < 20; i += 1) {
      let n = 5e3 + i * 3, a = hashed(n * 1.3) * Math.PI * 2, d = 0.4 + 0.75 * hashed(n * 2.1), x = fx + Math.cos(a) * d * tall * 0.75, y = top + tall * 0.45 + Math.sin(a) * d * tall * 0.42;
      if (y < top + 6 && Math.abs(x - words.x) < words.a + 30 || inFigure(x, y))
        continue;
      let big = hashed(n * 4.1) < 0.25, core = Math.max(1.2, (big ? 3.4 + 2 * hashed(n * 3.7) : 1.4 + 1.6 * hashed(n * 3.7)) * s);
      put(n, {
        x,
        y,
        long: core * (big ? 2.6 : 4),
        wide: 1,
        turn: 0,
        paints: ["lightGlow", "lightWarm"],
        load: big ? 0.55 : 0.42,
        kind: 3.25,
        blur: core * (big ? 1.6 : 3.2),
        order: ord + 0.2
      }), put(n + 1, {
        x,
        y,
        long: core,
        wide: 0.95,
        turn: 0,
        paints: ["light", "lightWarm"],
        load: big ? 0.75 : 0.95,
        kind: 3.4,
        blur: big ? core * 0.5 : 0.4,
        order: ord + 0.21
      });
    }
  }
}, HANDS_PHOTO = {
  grid: [100, 116],
  palette: [
    "#eb8964",
    "#ee8b65",
    "#f08b60",
    "#f48d5b",
    "#f88f55",
    "#fd924d",
    "#fd9252",
    "#fd9849",
    "#fd9d54",
    "#fda446",
    "#fda35c",
    "#fda86a",
    "#fdaf55",
    "#fdb347",
    "#fdb565",
    "#fdb57a",
    "#fdbe52",
    "#fdc65d",
    "#fdc290",
    "#fdc96b",
    "#fdcf78",
    "#fdd687",
    "#fddb95",
    "#fddda4",
    "#fce4b3",
    "#fdeac3",
    "#fdefd1",
    "#fef3dc",
    "#fdf5e5",
    "#fef7ec",
    "#fef8f2",
    "#fffaf5"
  ],
  cells: "01000000000000000000011111122222222222222222233333444666655655576788888888888888666666664444333322220000000000000000011011111112222222222222222233333444666655565777788888888aa8aaa88666666644444333322200000000000000000111111111122222222222222223333444466566555657788888aaaaaaaaaaaa888666664444443333220000000000000000011111111111222222222222223334444466555566688888aaaaaaaaaaaaaaaaa8886666664444333322000000000000000011111111111122222222222233333444446655566888888aaaabbbbbbbbbabbaaa88866666664443332200000000000000001111111121111222222222233333444455555556888888aabbbbbfffbbbbbbbbaaaa8666666644443332000000000000001001011111212122222222233333344466655556678888aaabbbfffffffffbbbbbbaaa886666664444333300000000000000111111111101012222222222333334446555555678888aaabbbfiopiffffffffbbbbaaa886666664444333000000000000000111111111110222222222233333444465555567788aaaabbffiqssoiiiifffffbbbbaa888666664444333000000000000000001111111112222222222233344446665555557788aabbbffinstspnqqniiffffbbbaa88866666644443300000000000100001111111111222222222233334444666555555888aaabbfffiptttqrttpiiiffffbbba8886666664444330110000000010000011111111122222222233333444666655777788aabbbfffinrtutqrttqniiifffbbbaa886666666444331111000000000011111111111112222222333334444666577777888aabbfffiiottutqqtspniiiifffbbbaa8666666664433011100000000000011110111112222222233334444666557777888aabbbffiinpuuutqqsrpoiiiifffbbbaa866666666443301100000000000001111021222222222333334444655657777888aaabbfffiinquuutqrtrqpniiifffbbbba88655665644330011000000000000111012222222222233333444665557777788aaabbfffiinosuuutqstttqnniiffffbbbba866556566444001100000000000001111222222222223333444455577777778aaabbbffiiinotvvutrstutroniiffffbbbbaa8665555644401110000000000000112222222222222333444665557777888aaabeefffiinnpuuvutrttttrpnmiiffffbbbba8666555644400110000000000000112222222222233334446665577778888aaeeefffiimnoquuvutrttttsqomliffffbbbbaa86655566440011100000000000222222222222233333446665577777888aaeeefffiiinnoruuuutsttttsronlkkfffbbbbba8865555544000000000000000022222222222233333444555557777888aaeeeeffiiimnopsvuuutstuuttrqomlkffffbbbbaa86555556400000000000000002222222222333334444655555777788aaeeefffimnmmnopsvuuutstvuuttsqnlkjffebbbbaaa8655556400000100000000002222222222233344444555557777888aaeeeffiipronoopsvuuutttvuutsrqnlkkjjeebbbbaa866556640000000000000002222222223323334444655557777888aaeeeffiinstrooopsvuuuttuvvutsrpmlkkjjeeebbbaaa86556560001101111110222222222223333344444655557777888aaeeffiimotutpopqtvvvtttuvvuttspmmlkjjeeeebbaaa8665566000000111111022222222223333344444465555777788aaaeefkimnpuutqopquvvvuttvvvuttspnmmmljjeeebbbaa8666666000000111012222222222233333444444455555777788aceeffimnosuutrppruvvvuttvvuuttrpooonnkjeeeebbaa8866566000000110102222222223333333444444655557777788aeeefkinoqtuutrpqsuvvutttvvutttsrrqponljjeeeebaaa886656000001110122222222333333334444446555557777888aeeefkmortuvttrqqsuuuuutuvuuttuuttsronlkjjeeebbaa886665011111111222222223333334444444666555557777888ceeefimpuvvuttrqrtuuuuuuuuuuutuutttrpnmkjjeeeebaaa8665500111111112223333333344444444466555555777788aceeefinqvvvutsrrrtuuvvuuuvvvvuttttsqomomjjjeeebaaa8666600111021122223333334444444444466555577777778aceejklnqvvvuttrrstuvuuuuuvvvuutttsrqonpnkjjeeebaaa8666601111222222233334444444444444655555777777798ceeejklnpuvvvutsssuuuuuuuuvvvuutttsrpnoqpmjhheeeaaaa866611121222223333444444444444444555557777777798ceeejklnpsvvvuutssuvuuuuuuuvvvuuttsrpprrqmjjheeebaaa866611121222333444444444446666555555557777777798ceeejklnoruvvvutttuuuuuuuuuvvvvuutsrqrsrpnkjhheebaaa86662112222233344444666666555555555555777777999ccceejklmoqtvvvuttttuuuuuvvvvvvvuuuttttsspnkjhheeeaaaa8662222233344444466666665555555555577777777999ccceejklmnpsvvvutttttttuuvvvvvvvvuuutttsrpnkjhheeeaaaa8662222333344466656655566555577777777777779999ccceejkkmnorvvvvuuuuttttuuvvvvvvvvvuuttsrqokhhgceeaaaa8662233334446666666777778887777777777777799999ccceejjklnoqvvvvuuuuuttttuuvvvvvvvvvvuttsqokjhgcceaaaa8662333444466666667888888887777777777777999999ccceejjklmnpuvvvuvvuuttttttuvvvvvvvuuuutsqokjhgcccaaaa8862334444666888888888888888887777779977999999cccehhjklmnotvvvvvvvuuutttttuuvvvvuuuvuusqokjhgcceaaaa8863344466688888aaaaaaaaaaa888999999999999999ccccghhjjklmoquvvvvvvvuuutttttuvvuuuuuuuuspokjhgcceaaaa88634444666aaaaaabbbbffbbbaaa8899999999999999ccccghhjjklmnoruvvvvvvuuuttttttuvvuuuvuuurpnkjhgcceaaaa86634466688abbbbbbffnroffbbbaa899999999999999ccccghhjjkllmnpsvvvvvvvvuuttttttuvvuuvvutrpnkjhhcceaaaa866446688aabbfffffffputoifbbbaa88999999999999ccccghhhjkklmnopsvuvvvvvvuutttttuuvuuuuutqpnkjhhcccaaaa88544688abbfiiiiiiiiouutniffbbaa8899999999999ccccgghhhjkklmopquuvvvvvvvuuttttuvvvvvutsqpmkjhhcccaaaaa866688aabfiptsoiiiiouvuqiifffbaaac999999999cccccggghhjjklmnopruvvvvvvvvuttttuvvvvvutrqpmkjhhgcccaaa88668aaabffiruutoiiintvusoiiffbbbaaccc9999cccccccggghhhjjklmnoqsvvvvvvvvuttttvvvvvvusrqpmkjhhgcccaaa88868abbffiipuvvrnnnotvvuqniiffbbbaccccccccccccccgggghhjjklmnopqtuvvvvuuutttuvvvvvvusrqomkjhhgcccaaa8888aabbfiinotvvupnnosuvusoiiiffbbeeecccccccccccccgggghhjkklmnopqtvuuuuuutttuvvvvvvtsrpomkjhhgcccaaaa888aabffinootvvvsoooquvvtqniiiffbeeeeeeeeccccccccgggghhhjkllmoopruuuuuuuttttvvvvvutsqpnlkjhhgcccaaaa888aabfinstqruvvuqoopuvvvtoniiffbeeeeeeeeeeecccccggggghhjjklmnopqsuvvvvuuuttuvvvuutsqpnlkjhhgcccaaaa888aabfiqvvurruvvspopsvvvvqniiiffffeefffffeeeecccgdggghhhjkklmnoprtvvvvuuuttuvvvuutsqpnlkjhhgccccaaa888abbfiovvvuqtvvvrpprvvvvsoniiifffffffmnmffeeeecgggggghhhjklmnopqsvvvvuuuttuvvvvuusqpnlkjhhgccccaaa888abbfinsvvvrruvvtqpquvvvupnniiifffffiqssokfjeegggggggghhjjklmnopqtvvvuuuttuuuuuuusqpnlkjhhgccccaaaa8aabbfiipvvvurtvvvrqqtvvvusonmiiifffiosttsnlkjeeegggggghhhjklmmopqsvvvuuuttuuuuutttrpnmkjhhgccccaaaa8aabbfiiouvvvtsvvvuqqtvvvuuqnnmiiikiiottttrmlkjeeggggggghhjjklmnoprtvvuuuutttttttttrpomkjhhgcccccaaa8abbffiiosvvvusuvvvrqsvvvvutpnmmiiiilosttttpmkkjehggggggghhjkllnopqsvvuuuutttttttttrqomljhhgcccccaaaaabbffinoquvvvttvvvtqrtvvvvvtpnmmlllmnsttttsolkkjjhgggggghhjkklmnopruvuuuutttttttttrqpnlkjhggccccaaa8abbffinoptvvvusuvvvsqsuvvvvvspnmmllmnqtttttrnlkkjjhgggggghjjkklnopqtvuuuuttttttttsrqpnlkjhggccccaa88abffiinopsvvvvtuvvvurrsuvvvvvsonnmmmmostttttqmlkjjhhggggghhjjklmnopsvuuuuttttttttsrqpomkjhggcccccaa8abffiinoprvvvvutvvvvtrrtvvvvvuronnnnnnqtttttsnllkjjhgggggghhjkklnopquuuuuttttttttsrrpomljhhggcccca88abffinstrrtvvvvttvvvvussuuuuuttrponnnnprsttttpmlkkjhhggggghhjjklmnopsuututttttttsssrqomljhhggcccca88abffintuvtrtvvvutuvvvvussttuutttspoonooqsttttrnmlkjjhgggggghhjklmnopqttttuutttttssssqpnlkhhggccccaa8abffinruvvrsvvvvttuvvvvtssuuuttttsqooooprtttttpmllkjhgggggghhjjklmnoprttttttttttssssrpomkjhgggcccca8abefimpuvvssuvvvutuvvvvvttuuuttttttrppppqsttttromlkjjhgggggghhjklmnopqttttttttttttssrqomljhhggccccaaabefiiotvvustvvvvvuuuvvvuuuuutttttttrpppqrtttttqnmlkjjhggggghhjjklmnoprtttttttttttsssrpnljhhgggcccaaabefiinsvvvssuuvvvvuuuuuuuuuuuuttttttsqqqrtttttspnlkkjhgggggghhjkklmnpqttttttttttttssrpomkhhgggcccc8aaeffinquvvtstuuvvvvuuuuuuuuuuuuuttttttsrstttttsromlkjhhhggggghhjklmnoprtttttttttttssrqpnljhgggdccc8aaeffimptuvutstuvvvvvvuuvvuuuuuuuuttttttttttttttrpnmlkjhhggggghhjkklmnoqsttttttttttsssrpomjhgggddcccaaeefiinquvuutsuuvvvvvuuuuuuuuuuuutttttttuttttttsqnmlkkjhgggggghhjklmnoprtttttttttttssrqomkhhgggdcccaaeeffinotuuutsstuvvvvuuuuuuuuuvuuuttttttuuuuuttsronmlkjhgggggghhjjklmnpqstttttttttttssqpnljhhggddccaaeeffimnqtuuutsttuuvvuuuuuuuuuvuuuttttttuuuuuuttsqnmlkjjhgggggghhjklmnopsttttuttttttssrqomkhhggdddc8aaeeffinostuuuutttuvvuuuuuuuuuuuuuttttuuuuuuuuttsronmlkjhgggggghhjkklnoprsttttutttttssrqpnljhgggddc8aaeeffimnqttuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuvuuuuttrpomlkjhhgggggghjjklmnoqstttttttttttsrrpomkhgggddc8aaaeefiimoqstuuuvuuuuuuuuuuuuuuuuuuuuuuvvvvvvvuttsqonmkjjhggggggghjkkmnoprstttttuttttssrqomkhhggddc88aaeeffiinopstttuuuuuuuuuuuuuuuuuuuuuuvvvvvvvvuttsrpnmljjhggdgggghhjklmnoqsttttttttttssrqpnljhggddd88aaeeeffiimnortttttuuuvuuuuuuuuuuuvvvvvvvvvvvvvuttrpnmlkjhggdddggghjjlmnoprsttttttutttsrqpomkhhggdd88aaaeeeffilmnopssttttuuuuuuuuuvvuuuvvvvvvvvvvvvuutsqomlkjhggddddggghjklmnoqstttttuutttsrqponljhgggd888aaeeeefkklmmnorsstttuuuuuuuuvvuuvvvvvvvvvvvvvvutsqomlkjhggdddddgghjklmnopssttttuutttssrqpnmkhgggd888aaaaeeefkkllmnoprstttuuuuuuuuuuvvvvvvvvvvvvvvvutsqomlkjhggddddddghhjklmnprstttttttttssrqponljhggd8888aaaaeeejkkklmnnoqrsttuuuuuuuuvvvvvvvvvvvvvvvvutsromlkjhgcddddddgghjklmnoqsstttttttttsrqqpnmkhggd6888aaaaeeeeejjklmmnopqsttuuuuuvvvvvvvvvvvvvvvvvvutsqomlkjhgdddddddgghhjklmoprstttttttttssrqpomkhggd68888aaccceeeejjkllmmnoqsttuuuuvvvvvvvvvvvvvvvvvuutsqnmlkjhgddddddddgghjklmnoqssttttttttssrqponljhgg5688888aacccceejjkklmmnoprttuuuuuvvvvvvvvvvvvvvvuttrpnmkkjecdddddddddghjjllnoprstttttttttsrqqpomkhhg55688888acccccehjjjkllmnoprtttuuuuvvvvvvvvvvvvvvvttronmkjhecdddddddddgghjklmnprstttttttttssrqppnljhg55558888aaaccccehhjkkklmnoprtttttuuuvvvvvvvvvvvvuttqomlkjhecdddddddddgghjklmnoqssttttttttssrqppomkhg5555688888acccccghhjjkllmnoprtttttuuvvvvvvvvvuuuutsqomlkjeccddddddddddghhjklmoprsttttttttssrqqponljh6555568888aacccccghhjjkllmnopsttttttuuvvvvvvvuutttsqnmlkjecccdddddddddgghjklmnprssttttttttssrqppnmkh6655558888a889cccgghhjjkklmnoprstttttuuuvvvvvuutttspnmkjjecccdddddddddgghjklmnoqrsttttttttssrqqponlj66555568888889ccccgghhhjkllmnopqssstttttuvvvuuttttspnlkjeecccd99ddddddggghjklmoqrsttttttttssrqqppnmk4655555688888899ddcgghhjjkllmnopqssssttttuuuuuttttrpnlkjeeccd9999ddddddgghjklmnprstttttttttsrrqppomk44655555668888999dccgghhhjklmmnopqsssssttttttttttsrpnlkjeccc99999ddddddgghhjkmnoqrsstttttttssrqqponl34465555558888999ddddgghhjkklmnooprsssssttttuttttsronlkjeccc999999ddddddghhjklmoqrsstttttttssrqqppom344465555577888999ddddggghjjklmnopqssssstttuuuttsrqomlkjeccc999999ddddddghhjklmnprsstttttttssrrqppon334466555557777799dddddgghhjkllmnoprsssstttuutttsrqomlkjeccc9999999dddddgghhklmnorrssttttttssrrqqpon3344466555555577999dddddgghhjklmmnorsrssttuuutttsrpnmlkeeccc9999999dddddggghjklmoqrssttttttsssrqqppo33344465555575777999dddddgghjjklmnorsrssttuuutttsrpnmljeecc99999999ddddddgghjklmnprssttttttsssrqqppo333344465555577779999ddddgghhjklmnorrrsstuuuutttsrpnmkjeecc99999999ddddddgghhklmmprssstttttsssrrqppo3333344665555557779999dddggghjkklnorrrsstuuuutttsrpnlkjeecc999999999dddddggghjklmoqrsstttttsssrrqqpo2333344465555555779999ddddgghjkklnorrrsttuuuutttsronlkjeecc9999999999ddddggghjklmnprrsstttttsssrqqpo22333344665555577799999ddddgghjklnorrrsttuuuutttsronlkjeecc9999999999dddddgghjjklmpqrssssssssssrqqpp22333344666555557779999ddddgghjklnpsrrstuuvuutttsqonlkjeccc9999999999dddddgghhjklmoqrssssssssssrqqpp222233346665555577799999dddgghjklnpsssstuuuuutttrqonlkjeccc9999999999dddddggghjkkmnqrrsssssssssrqqpp222233344465555577779999dddcghjklnpsssttuvvvutttrqnmlkeecc999999999999dddddgghhjklmprrsssssssssrqqpp222233344446555557779999dddcghjklnpssstuuuvvutttrpnmlfeeccc99999999999dddddggghjklmoqrsssssssssrrqpp2222333344465555577779999dddghjkmnpssstuvvvvuttsrpnmlfeecc999999999999ddddddgghhjklnqrrssssssssrrqqp2222333334465555557779999ddggjklmnqssstuvvvvuttsrpnmlfeecc999999999999ddddddggghjklmprrssssssssrrqqp2222233334465555577779999ddcgjklmnqssstuvvvvuttsqonlkjeecc9999999999999ddddddgghjklmoqrrssssssssssrr2222223334466555557779999ddchjklmoqssstuuvvvuttsqonlkjeecc9999999999999ddddddgghhjklnqrrssssssstssss2222223334466555557779999ddcejklmoqssttuuvvuuttsqomlkjeecc99999999999999ddddddgghjklmpqrrrsssstttsss2222223334445555557779999dccejklmorssttuuvvuuttsqomlkjeecc99999999999999ddddddgghhkkloqqrrrssttttsss2222222334446555577779999dccejklmorssttuuvvuuttsqomlkfeecc999999999999999dddddggghjklnqqrrrrrtttssss2222222333444555577779999dccejklnorrsttuuuuuuttspnmlkfeecc999999999999999dddddggghjklmpqqrrrrtttssss222222233344455557777999ddcgejklnpsssttuuuuuuttrpnmlkeeccc9999999999999999dddddgghjjkloqqqqrrtttssss222222233344455557777999ddcghjkmnpsssttuuuuutttrpnmkkeecc99999999999999999dddddgghhjkloqqqqrrttssssr"
}, handsDim = (hex) => {
  let v = Number.parseInt(hex.slice(1), 16);
  return `#${[v >> 16 & 255, v >> 8 & 255, v & 255].map((n) => Math.round(n * 0.92)).map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}, HANDS_TONES = Object.fromEntries(HANDS_PHOTO.palette.map((hex, i) => [`tone${i}`, [hex, handsDim(hex)]])), HANDS_GIVE = 0.85, HANDS_HOLD = 9, HANDS_REACH = 30, HANDS_EVEN = 5e-3, HANDS = {
  ...HERO,
  intro: !1,
  wake: "300% 0px",
  near: "100% 0px",
  // no words in the frame: the box the paint keeps clear of is off it
  words: { at: [0.5, -4], half: [1e-3, 1e-3] },
  lines: { ...LINES, veil: [0, 0], veilCore: 0.5, sink: 1e-3 },
  inks: {
    ...LAND_INK,
    coral: [HANDS_PHOTO.palette[0], handsDim(HANDS_PHOTO.palette[0])],
    ember: [HANDS_PHOTO.palette[7], handsDim(HANDS_PHOTO.palette[7])],
    amber: [HANDS_PHOTO.palette[13], handsDim(HANDS_PHOTO.palette[13])]
  },
  sky: {
    stops: [
      [0, "coral"],
      [0.5, "ember"],
      [1, "amber"]
    ],
    grain: 0.42,
    brush: 0.06,
    wash: "ember"
  },
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    sheets: [],
    room: 100,
    foot: ({ h }) => h - 100,
    head: 0,
    least: 20
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  glyphs: !0,
  twinkle: !0,
  marks: !0,
  paints: {
    ...PAINTS,
    ...HANDS_TONES,
    light: ["#ffffff", "#ffffff"],
    lightWarm: ["#fffaf0", "#fff6e8"],
    lightGlow: ["#fff3cc", "#ffedbc"],
    halo: ["#ffd25e", "#ffc650"]
  },
  clouds: [],
  flock: [],
  lens: null,
  fit: (w) => clamp(w / 300, 0.5, 1),
  plant: (garden) => {
    let { w, h, rand } = garden, [gw, gh] = HANDS_PHOTO.grid, cells = HANDS_PHOTO.cells, cw = Math.max(w / gw, h / gh), ox = (w - gw * cw) / 2, oy = (h - gh * cw) / 2, lum = HANDS_PHOTO.palette.map((hex) => {
      let v = Number.parseInt(hex.slice(1), 16);
      return (0.2126 * (v >> 16 & 255) + 0.7152 * (v >> 8 & 255) + 0.0722 * (v & 255)) / 255;
    }), toneAt = (gx, gy) => Number.parseInt(cells[clamp(gy, 0, gh - 1) * gw + clamp(gx, 0, gw - 1)], 36), L = (gx, gy) => lum[toneAt(gx, gy)], BRIGHT = 24, splitAt = (gy) => gw * (0.44 + 0.14 * gy / gh), far = gw + gh, dists = [0, 1].map((hand) => {
      let d = new Float32Array(gw * gh).fill(far);
      for (let gy = 0; gy < gh; gy += 1)
        for (let gx = 0; gx < gw; gx += 1)
          (hand === 0 ? gx < splitAt(gy) : gx >= splitAt(gy)) && toneAt(gx, gy) >= BRIGHT && (d[gy * gw + gx] = 0);
      let pass = (dir) => {
        let ys = dir > 0 ? [...Array(gh).keys()] : [...Array(gh).keys()].reverse(), xs = dir > 0 ? [...Array(gw).keys()] : [...Array(gw).keys()].reverse();
        for (let gy of ys)
          for (let gx of xs) {
            let v = d[gy * gw + gx], near = [
              [-dir, 0, 1],
              [0, -dir, 1],
              [-dir, -dir, 1.414],
              [dir, -dir, 1.414]
            ];
            for (let [dx, dy, c] of near) {
              let x = gx + dx, y = gy + dy;
              x >= 0 && x < gw && y >= 0 && y < gh && (v = Math.min(v, d[y * gw + x] + c));
            }
            d[gy * gw + gx] = v;
          }
      };
      return pass(1), pass(-1), d;
    }), toCanvas = (gx, gy) => [ox + gx * cw, oy + gy * cw], hands = [
      { pivot: toCanvas(gw * 0.42, gh * 1.25), phase: 1.3 },
      { pivot: toCanvas(gw * 0.74, gh * 1.32), phase: 4.4 }
    ], HAZE = 0.4 + HANDS_EVEN, calm = (seed) => {
      for (let k = 0; k < 60; k += 1) {
        rand.reseed(seed + k * 104729), rand(), rand(), rand();
        let dice = rand();
        if (Math.abs(dice * 91.7 % 1 - 0.5) < 0.08 && Math.abs(dice * 37.3 % 1 - 0.5) < 0.15)
          return seed + k * 104729;
      }
      return seed;
    }, put = (n, { x, y, hand, weight, turn, ...o }) => {
      if (rand.reseed(calm(71011 + n * 7919)), hand && weight > 0.02) {
        let dx = x - hand.pivot[0], up = hand.pivot[1] - y, stem = Math.hypot(dx, up), lean = Math.atan2(dx, up);
        garden.dab({
          kind: HAZE,
          ...o,
          x: hand.pivot[0],
          y: hand.pivot[1],
          stem,
          lean,
          phase: hand.phase,
          stiff: 1 - HANDS_GIVE * weight,
          turn: turn - lean * 0.7
        });
        return;
      }
      let root = h + 40;
      garden.dab({ kind: HAZE, ...o, x, y: root, stem: root - y, lean: 0, stiff: 1, turn });
    };
    for (let gy = 0; gy < gh; gy += 1)
      for (let gx = 0; gx < gw; gx += 1) {
        let n = gy * gw + gx, [cx, cy] = toCanvas(
          gx + 0.5 + (hashed(n * 1.31) - 0.5) * 0.5,
          gy + 0.5 + (hashed(n * 2.17) - 0.5) * 0.5
        );
        if (cx < -cw * 2 || cx > w + cw * 2 || cy < -cw * 2 || cy > h + cw * 2)
          continue;
        let tone = toneAt(gx, gy), ddx = L(gx + 1, gy) - L(gx - 1, gy), ddy = L(gx, gy + 1) - L(gx, gy - 1), turn = (Math.hypot(ddx, ddy) < 0.012 ? 0.9 + 0.6 * Math.sin(gx * 0.11 + gy * 0.07) : Math.atan2(ddy, ddx) + Math.PI / 2) + (hashed(n * 3.7) - 0.5) * 0.5, which = gx < splitAt(gy) ? 0 : 1, d = dists[which][n], weight = (1 - smooth(HANDS_HOLD, HANDS_REACH, d)) * smooth(1, 9, Math.abs(gx + 0.5 - splitAt(gy))), lit = tone >= BRIGHT;
        put(n, {
          x: cx,
          y: cy,
          hand: hands[which],
          weight,
          turn,
          long: cw * (lit ? 1.35 : 1.5),
          wide: lit ? 0.85 : 0.9,
          blur: cw * (lit ? 0.9 : 1.25),
          paints: [`tone${tone}`, `tone${tone}`],
          load: lit ? 1 : 0.95,
          // the light in solid strokes, so where they overlap they keep one tone, the rest in the haze kind
          kind: lit ? 0.25 + HANDS_EVEN : HAZE,
          order: (weight > 0.02 ? 1e3 + which * 1e3 : 0) + gy * 0.01 + (lit ? 500 : 0)
        });
      }
    let tips = [];
    for (let gy = 0; gy < gh * 0.55; gy += 1)
      for (let gx = 0; gx < gw; gx += 1) {
        let n = gy * gw + gx, which = gx < splitAt(gy) ? 0 : 1, d = dists[which][n];
        d >= 2 && d <= 5 && hashed(n * 9.1) > 0.965 && tips.push([gx, gy, which, n]);
      }
    tips.slice(0, 16).forEach(([gx, gy, which, n], j) => {
      let [x, y] = toCanvas(gx + 0.5, gy + 0.5), core = Math.max(0.9, cw * (0.35 + 0.5 * hashed(n * 4.7)));
      put(9e5 + j * 2, {
        x,
        y,
        hand: hands[which],
        weight: 1,
        turn: 0,
        long: core * 4,
        wide: 1,
        paints: ["lightGlow", "halo"],
        load: 0.5,
        kind: 3.25,
        blur: core * 3,
        order: 5e3
      }), put(900001 + j * 2, {
        x,
        y,
        hand: hands[which],
        weight: 1,
        turn: 0,
        long: core,
        wide: 0.95,
        paints: ["light", "lightWarm"],
        load: 0.95,
        kind: 3.4,
        blur: 0.4,
        order: 5001
      });
    });
  }
}, DAISIES_INKS = {
  ...LAND_INK,
  // the meadow's light behind them, from the top of the frame down: a deep sage, a softer green, and a pale lime
  sage: ["#6f8f62", "#5f7d54"],
  moss: ["#8fae6f", "#7c9b5f"],
  lime: ["#c4dc94", "#adc683"]
}, DAISIES_HEADS = [
  { at: [0.6, 0.12], reach: 0.25, foot: [0.5, 1.9], phase: 0.6, turn: 0.35 },
  { at: [0.03, 0.58], reach: 0.23, foot: [0.1, 2.1], phase: 2.9, turn: 1.1 },
  { at: [0.95, 0.84], reach: 0.18, foot: [0.86, 2.3], phase: 4.7, turn: 0.2 }
], DAISIES_PERCHES = [
  [0.47, 0.25, 1],
  [0.7, 0.27, -1],
  [0.16, 0.53, -1],
  [0.84, 0.7, 1]
], DAISIES_GIVE = 0.25, DAISIES_EVEN = 5e-3, DAISIES = {
  ...HERO,
  intro: !1,
  wake: "300% 0px",
  near: "100% 0px",
  words: { at: [0.5, -4], half: [1e-3, 1e-3] },
  lines: { ...LINES, veil: [0, 0], veilCore: 0.5, sink: 1e-3 },
  inks: DAISIES_INKS,
  sky: {
    stops: [
      [0, "sage"],
      [0.5, "moss"],
      [1, "lime"]
    ],
    grain: 0.42,
    brush: 0.06,
    wash: "moss"
  },
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    sheets: [],
    room: 100,
    foot: ({ h }) => h - 100,
    head: 0,
    least: 20
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  glyphs: !0,
  twinkle: !0,
  marks: !0,
  paints: {
    ...PAINTS,
    // the petals: white in the light, lilac where they turn away, and the soft white glow round them
    petal: ["#fbfafa", "#f6f4f5"],
    petalLight: ["#ffffff", "#fdfcfd"],
    petalShade: ["#e8dcec", "#ded1e4"],
    petalGlow: ["#f1f3e6", "#e6eadb"],
    // the hearts: a warm yellow, deeper towards the edge
    heart: ["#f4c14a", "#efb941"],
    heartDeep: ["#eaa83c", "#e29f36"],
    heartLight: ["#f8d26e", "#f4ca62"],
    // the stem: a deeper, fuller green than the meadow's light behind it
    stem: ["#5a9445", "#50873d"],
    stemLight: ["#7fb25e", "#72a454"],
    light: ["#ffffff", "#ffffff"],
    lightWarm: ["#fdfff4", "#f8fbea"],
    lightGlow: ["#f4fbd6", "#ecf5c7"],
    halo: ["#e6f3a8", "#d8e897"]
  },
  clouds: [],
  // the glass at the frame's sides, which the butterflies come in through, and none at its foot: this one is framed
  lens: { ...LENS, foot: !1, top: !1 },
  flock: Array.from({ length: 4 }, (_, k) => ({
    size: 9 + 2 * ((k * 0.7549 + 0.31) % 1),
    seed: Math.round((k * 0.618 + 0.27) % 1 * 100) / 100,
    pastel: k % 3,
    wing: WING_NAMES[(k * 2 + 1) % 3],
    flit: !1
  })),
  perch: {
    stay: [6, 15],
    reach: 50,
    flit: [3, 6],
    hop: 70,
    come: 120,
    flee: 220,
    back: 2.4,
    every: [0.6, 1.4],
    appear: 0,
    arrive: 0,
    first: 0,
    beat: 8,
    wings: [1.38, 0.3],
    rest: [3.5, 6.5],
    sit: [0.12, -0.35, 1.05],
    lift: 0.35,
    flutter: 5,
    clear: 10,
    climb: 0.3,
    swerve: 30,
    rise: 40
  },
  fit: (w) => clamp(w / 300, 0.55, 1),
  plant: (garden) => {
    let { w, h, rand } = garden, size = Math.min(w, h * 1.25), HAZE = 0.4 + DAISIES_EVEN, calm = (seed) => {
      for (let k = 0; k < 60; k += 1) {
        rand.reseed(seed + k * 104729), rand(), rand(), rand();
        let dice = rand();
        if (Math.abs(dice * 91.7 % 1 - 0.5) < 0.08 && Math.abs(dice * 37.3 % 1 - 0.5) < 0.15)
          return seed + k * 104729;
      }
      return seed;
    }, put = (n2, { x, y, turn = 0, head = null, ...o }) => {
      if (rand.reseed(calm(67021 + n2 * 7919)), head) {
        let [fx, fy] = head.foot, dx = x - fx, up = fy - y, lean = Math.atan2(dx, up);
        garden.dab({
          kind: HAZE,
          ...o,
          x: fx,
          y: fy,
          stem: Math.hypot(dx, up),
          lean,
          phase: head.phase,
          stiff: 1 - DAISIES_GIVE,
          turn: turn - lean * 0.7
        });
        return;
      }
      let root = h + 40;
      garden.dab({ kind: HAZE, ...o, x, y: root, stem: root - y, lean: 0, stiff: 1, turn });
    }, heads = DAISIES_HEADS.map((f) => ({
      x: f.at[0] * w,
      y: f.at[1] * h,
      r: f.reach * w,
      turn: f.turn,
      foot: [f.foot[0] * w, f.foot[1] * h],
      phase: f.phase
    })), n = 0, top = heads[0], stemTop = [top.x - top.r * 0.3, top.y + top.r * 1.05], stemFoot = [w * 0.46, h * 1.04], rows = 22;
    for (let k = 0; k < rows; k += 1) {
      let t = k / (rows - 1), y = stemFoot[1] + (stemTop[1] - stemFoot[1]) * t, x = stemFoot[0] + (stemTop[0] - stemFoot[0]) * t, half = (0.15 * (1 - t) ** 1.2 + 0.012) * w, step = (stemFoot[1] - stemTop[1]) / (rows - 1);
      for (let side of [-1, 1])
        n += 1, put(n, {
          x: x + side * half * 0.45,
          y,
          turn: Math.PI / 2 + Math.atan2(stemTop[0] - stemFoot[0], stemFoot[1] - stemTop[1]),
          long: step * 2.4,
          wide: clamp(half * 1.15 / (step * 2.4), 0.15, 1.6),
          blur: Math.max(2, half * 0.55),
          paints: side > 0 ? ["stemLight", "stem"] : ["stem", "stem"],
          load: 0.5,
          order: 10 + t,
          head: top
        });
    }
    [1, 2, 0].forEach((index, depth) => {
      let f = heads[index], base = 100 + depth * 100;
      for (let k = 0; k < 8; k += 1) {
        n += 1;
        let a = k / 8 * Math.PI * 2 + f.turn;
        put(n, {
          x: f.x + Math.cos(a) * f.r * 0.6,
          y: f.y + Math.sin(a) * f.r * 0.6,
          turn: a + Math.PI / 2,
          long: f.r * 0.9,
          wide: 0.7,
          blur: f.r * 0.38,
          paints: ["petalGlow", "petalGlow"],
          load: 0.16,
          order: base,
          head: f
        });
      }
      for (let pass = 0; pass < 2; pass += 1)
        for (let k = 0; k < 10; k += 1) {
          n += 1;
          let a = (k + pass * 0.5) / 10 * Math.PI * 2 + f.turn + (hashed(n * 1.7) - 0.5) * 0.2, reach = f.r * (0.85 + 0.25 * hashed(n * 2.3)), away = Math.sin(a + 0.9) > 0.35;
          put(n, {
            x: f.x + Math.cos(a) * reach * 0.56,
            y: f.y + Math.sin(a) * reach * 0.56,
            turn: a,
            long: reach * 0.84,
            wide: 0.5,
            blur: f.r * (0.17 + 0.06 * pass),
            paints: away ? ["petal", "petalShade"] : ["petalLight", "petal"],
            load: pass ? 0.45 : 0.78,
            order: base + 10 + pass,
            head: f
          });
        }
      let heart = f.r * 0.3;
      put(++n, {
        x: f.x,
        y: f.y,
        long: heart * 1.45,
        wide: 1,
        blur: heart * 0.5,
        paints: ["heartDeep", "heartDeep"],
        load: 0.9,
        order: base + 40,
        head: f
      }), put(++n, {
        x: f.x,
        y: f.y,
        long: heart * 1.15,
        wide: 1,
        blur: heart * 0.42,
        paints: ["heart", "heart"],
        load: 0.95,
        order: base + 41,
        head: f
      }), put(++n, {
        x: f.x - heart * 0.15,
        y: f.y - heart * 0.16,
        long: heart * 0.7,
        wide: 1,
        blur: heart * 0.35,
        paints: ["heartLight", "heart"],
        load: 0.8,
        order: base + 42,
        head: f
      });
    });
    for (let i = 0; i < 7; i += 1) {
      let m = 5e3 + i * 3, x = w * (0.12 + 0.76 * hashed(m * 1.3)), y = h * (0.3 + 0.62 * hashed(m * 2.1)), core = Math.max(0.9, size * (4e-3 + 5e-3 * hashed(m * 4.7)));
      put(m, {
        x,
        y,
        long: core * 4,
        wide: 1,
        paints: ["lightGlow", "halo"],
        load: 0.5,
        kind: 3.25,
        blur: core * 3,
        order: 900
      }), put(m + 1, {
        x,
        y,
        long: core,
        wide: 0.95,
        paints: ["light", "lightWarm"],
        load: 0.95,
        kind: 3.4,
        blur: 0.4,
        order: 901
      });
    }
    for (let [px, py, facing] of DAISIES_PERCHES)
      garden.perch(px * w, py * h, facing);
    garden.tree(w * 0.5, h * 0.45, size * 0.48);
  }
}, MIRROR_INKS = {
  ...LAND_INK,
  // from the top of the frame down: the sky, paler towards the horizon, a bright rim along it, and the sea
  zenith: ["#5a90ea", "#4a7ed6"],
  air: ["#6c9dee", "#5b8ade"],
  haze: ["#a6c0ea", "#8ba7da"],
  rim: ["#d6deeb", "#b5c3db"],
  sea: ["#3b71d3", "#2f5fbf"],
  deep: ["#2756bb", "#1e48a3"]
}, MIRROR_WATER = 0.6, MIRROR = {
  ...HERO,
  intro: !1,
  wake: "300% 0px",
  near: "100% 0px",
  words: { at: [0.5, -4], half: [1e-3, 1e-3] },
  lines: { ...LINES, veil: [0, 0], veilCore: 0.5, sink: 1e-3 },
  inks: MIRROR_INKS,
  sky: {
    stops: [
      [0, "zenith"],
      [0.3, "air"],
      [MIRROR_WATER - 0.07, "haze"],
      [MIRROR_WATER - 6e-3, "rim"],
      [MIRROR_WATER, "sea"],
      [1, "deep"]
    ],
    grain: 0.62,
    brush: 0.04,
    wash: "air"
  },
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    sheets: [],
    room: 100,
    foot: ({ h }) => h - 100,
    head: 0,
    least: 20
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  glyphs: !0,
  marks: !0,
  // the small lights about her twinkle (see the glow in the strokes' shader)
  twinkle: !0,
  paints: {
    ...PAINTS,
    shimmer: ["#8db1f0", "#789cdf"],
    glint: ["#d2e1fb", "#b6cbef"],
    light: ["#fffdf6", "#fffaf0"],
    lightWarm: ["#fff4da", "#ffeed0"],
    lightGlow: ["#fff8e8", "#fff2dc"],
    halo: ["#e4ecff", "#d4e0fa"]
  },
  clouds: [],
  lens: {
    ...LENS,
    foot: !1,
    top: !1,
    glow: {
      core: [1, 0.992, 0.965],
      cream: [1, 0.962, 0.865],
      halo: [1, 0.955, 0.86],
      body: [0.02, 0.42],
      soft: 75e-4,
      near: 0.055,
      far: 0.15,
      strength: [1.05, 0.62]
    },
    mirror: { at: MIRROR_WATER, strength: 0.75, depth: 0.42, tint: [0.9, 0.93, 1], blur: 0.35 }
  },
  // one butterfly, large in the frame as in the photographs; the glow, not her pastel, is what shows of her
  flock: [{ size: 38, seed: 0.41, pastel: 0, wing: "slim", flit: !1 }],
  perch: {
    stay: [1e6, 1e6],
    reach: 40,
    flit: [4, 7],
    hop: 60,
    come: 90,
    flee: 180,
    back: 3,
    every: [0.6, 1.2],
    appear: 0,
    arrive: 0,
    first: 0,
    beat: 3.4,
    wings: [0.45, 0.2],
    rest: [3.5, 6.5],
    sit: [0.12, -0.35, 1.05],
    lift: 0,
    flutter: 4,
    clear: 8,
    climb: 0.3,
    swerve: 24,
    rise: 30,
    hover: { pose: [1.25, -0.6, 0.25], bob: 3, sway: 2.5 }
  },
  fit: (w) => clamp(w / 176, 0.6, 1.3),
  plant: (garden) => {
    let { w, h, rand } = garden, water = MIRROR_WATER * h;
    for (let i = 0; i < 14; i += 1) {
      let n = 300 + i;
      rand.reseed(48611 + n * 7919);
      let x = w * (0.05 + 0.9 * hashed(n * 1.9)), y = water + h * (0.012 + 0.16 * hashed(n * 2.7) ** 1.6), long = w * (0.06 + 0.16 * hashed(n * 3.3)), root = h + 40;
      garden.dab({
        x,
        y: root,
        stem: root - y,
        long,
        wide: 0.05,
        turn: 0,
        blur: long * 0.25,
        paints: ["shimmer", "glint"],
        load: 0.2 + 0.14 * hashed(n * 4.1),
        kind: 0.4,
        stiff: 1,
        lean: 0
      });
    }
    [
      [-0.31, -0.15],
      [0.29, -0.21],
      [0.35, 0.07],
      [-0.25, 0.14],
      [0.06, -0.29],
      [-0.39, -0.03],
      [0.17, 0.19]
    ].forEach(([dx, dy], j) => {
      let n = 700 + j;
      rand.reseed(51217 + n * 7919);
      let x = w * (0.5 + dx), y = h * (0.42 + dy * 0.6), core = Math.max(0.9, w * (6e-3 + 6e-3 * hashed(n * 4.7)));
      garden.dab({
        x,
        y,
        stem: 0,
        long: core * 4,
        wide: 1,
        turn: 0,
        blur: core * 3,
        paints: ["lightGlow", "halo"],
        load: 0.5,
        kind: 3.25,
        stiff: 1,
        lean: 0
      }), garden.dab({
        x,
        y,
        stem: 0,
        long: core,
        wide: 0.95,
        turn: 0,
        blur: 0.4,
        paints: ["light", "lightWarm"],
        load: 0.95,
        kind: 3.4,
        stiff: 1,
        lean: 0
      });
    }), garden.perch(w * 0.5, h * 0.42, 1);
  }
}, GLOBE_PHOTO = {
  grid: [88, 161],
  palette: [
    "#79679e",
    "#726ca2",
    "#776ca2",
    "#756da3",
    "#786da3",
    "#7e6ca2",
    "#7a71a5",
    "#8471a5",
    "#7f76a8",
    "#8d78aa",
    "#867eb0",
    "#9482af",
    "#938ac8",
    "#9e8ab4",
    "#9d8dca",
    "#a891cd",
    "#a993b9",
    "#b493cc",
    "#bf94cd",
    "#b49fc2",
    "#b0a0d3",
    "#c8a1ce",
    "#c9b5d1",
    "#e0b1d7",
    "#dcc6d9",
    "#fbc4e0",
    "#e5d6e0",
    "#fbd2e5",
    "#fad7d4",
    "#f9e2e5",
    "#fcece0",
    "#fdf3d6"
  ],
  cells: "50000000000000022020222222222422244422242444444444443442244333333333333311111111111118ou000000000000000000022222222222223442422222422422422233442222333333133331111111111111111m00000000000000000002222022222222222224232222222222222332222231133111131111111111111111110000000000000000002222222222222222224223224222222222222222222311211111113111111111111111000000000000000000002222222222222222422222222222222242222222233331111111311111111111111100000000000000000000222022222222222222222422222222222222334322313311111111111111111111110000000000000000000222202222222222242224422222222222222233332223113331111111113111111111000000000000020220522222222222222222244422422222422222223433222311113311111111311311111100000000000000052225222222222222442442222422444422222422324333333333331313331133131133310000000000000055255222224222222242244424444444444222222222333223333333331133111333113113000000005000005025524524442244224244442444444442222222222233322333333333333333333331333300000000555555555552255552244422244444244444444422442222322322233333333333333333333333330000000000055555555522552444444444444444342424444444224222222223233133333333333333333333000050555555555555555555244444444444242444244444444444424242322223133333333333333333633300005055555555555555555544444444444444444424444444442444422233422433434433333333466333665000555555555555555555545555544444444444444444444444422444422433433343344444336443636366555555555555555555555556555552444444444444422424444444444442243343444344446466666666666655555555555575555555555455555464444442444444242444444244442444424444444464666666666666665555555555557575557555555555554444444444444444444442244444444444444444466466666666666666555555555577577577777757557555546444444444444424444244424444444444464664666666668668866655555577777777777777777777755555646444444444244444224444444444246446666666666666668888885577777777777777777777777777755665644424444444444424444444444446666666666666668886888888557777777777777777777777777777666564444444244242444444444444666666666666888888888888888877777777777777777777777777777777666664444444424442444244444446666666666888888888888888887777777777777999979977977777777776666444444444444244444646666666666688888888888888888888777777777999999999999997777777777786666644424444244444444666666666888888888888888888888877777779999999999999999999997777776666666444444644446664666666868888888888888888aa88aaa8777779999999999999999999999999977777766666646666444666466666668888888888888a8aaaaaaaaaaa777999999999999999999999999999999777788666666666666666666668888888888a88aaaaaaaaaaaaaaaa7799999999999999999bbbbb9bb99999997777888866666686576666888888888888aaaaaaaaaaaaaaaaaaaa7999999999999bbbbbbbbbbbbbbbb9999999777787788777777778888888888aaaaaaaaaaaaaaaaaaaaaaaaa999999999b9bbbbbbbbbbbbbbbbbbbbb99999999777777777777888888888aaaaaaaaaaaaaaaaaaaaaaaaaaa9999999bbbbbbbbbbbbbbbbdddbbbbbbbbbb9999999999999999999a99999aaaaaaaaaaabbabbbbbbbbbbaaa999999bbbbbbbbbddddddddddddddddbbbbbbbbbbb9999999999999999a9aaaabbbbbbbbbbbbbbbbbbbbbbbb9999bbbbbbbbddddddddddddddddddddddddbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb9999bbbbbbbddddddddddddddgggdddddddddddddddddbdbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb9bbbbbbbddddddddddgggggggggggggggggggdddddddddddddddddbddddddddddddddddddddddddddddddddb9bbbbbbdddddddddgggggggggggggggggggggggggggggggdddddddddddddddddddddddddddddddddddddddddbbbbbddddddddggggggggggggggjjjjjjjjjjjggggggggggggggggggggdddgddddddddddddddddddddddddddbbbbbdddddddgggggigggggjjjjjjjjjjiijiiijjjjjjjjjjjggggggggggggggggggggggggggddddddddddddbbbbbdddddgggggginljjjjjjjjjiillllllllllllliijjjjjjjjjjjjgggggggggggggggggggggggggddddddbbbdddddddgggggghnnjjjjjjllllllllllllllllllllllljjjjjjjjjjjjjjjjgggggggggggggggggggggdddbbddddddggggggggelnijjjlllllllllllllllllllllllllllllljjjjjjjjjjjjjjjjjjggjgggggggggggggdbdddddggggggggjfelplllllllllllllnnnnnnnnnnnnnnmlllllllllljjjjjjjjjjjjjjjjjjjjjggggggggggbdddddgggggggjjcelpnllllllllnnnnnnnnnnnnnnnnnnnnnmmmmlmllllllljjjjjjjjjjjjjjjjjjjjggggggddddddggggggjjfcclpnlllllmnnnnnnnnnnnnnnnnnnnnnnnnnnmmmmmmmmlllljjjjjjjjjjjjjjjjjjjjggggdddddggggggjjjecclpnlllnnnnnnnnnnnnnppppppppppnnnnnnnnmmmmmmmmmmmmllljjjjjjjjjjjjjjjjjjgddddggggggjjjfefenpnlllnnnnnnnnnnpppppppppppppppoooooonnnmmmmmmmmmmmmmljjjjjjjjjjjjjjjjjddddggggggjjjehnlnnllhlpnnnnnnnppppppppppppppppppppooooooonnmmmmmmmmmmmmmmjjjjjjjjjjjjjjddddgggggjjjhehnpnnlfhnpnnnnopppppppppppppppprppppppoooooooooommmmmmmmmmmmmmjjjjjjjjjjjjdddgggggjjjjecinpnlffinpnnoopppppppprprpprrrrrrrrrrrppqooooooooommmmmmmmmmmmmmjjjjjjjjjjddggggggjjjjeeinpnfeilpnnoppppppprrrrrrrrrrrrrrrrrrrrrqqqqooooooooommmmmmmmmmmmmmjjjjjjjddgggggjjjjfcfinnhehinpnoppppprrrrrrrrrrrrrrrrrrrrrrrrrqqqqqoooooooommmmmmmmmmmmmmmjjjjjddgggggjjjjecfinnehilnnoopppprrrrrrrrrrrrrrrrrrrrrrrrrrrrqqqqqoooooooooommmmmmmmmmmmmjjjdgggggjjjjfcchlplfiinnnoopprrrrrrrrrrrrrrrrrrrrrrrrrtrrrrrrqqqqqoooooooommmmmmmmmmmmmmmjdgggggjjjjecehlnffilnnoopprrrrrrrrrrrrrrrrrrrrrrttttttttttrrqqqqqqooooooooommmmmmmmmmmmjdgggggjjjjcceinnehlnnoooprrrrrrrrrrrrrrrrrttrtttttttttttttttrqqqqqqqoooooooommmmmmmmmmmmgggggjjjjiheeinlfinnnooprrrrrrrrrrrrrttttttttttttttttttttttttttqqqqqqqoooooooommmmmmmmmmdggggjjjjillilphhnpnooqqrrrrrrrrtttttttttttttttttttttttttttttttqqqqqqqqoooooooommmmmmmmmdggggjjjhhinnnnflpnoooqqrrrrrtttttttttttttttttttttttttttttttttttqqqqqqqqqoooooommmmmmmmmgggggjjjfhilppnhnpnoooqqrrrtttttttttttttttttttttutttttttttttttttttqqqqqqqqooooooommmmmmmgggggjjffiilpplippoooqqrrrttttttttttttuuuuuuuuuuuuuuuutttttttttttttqqqqqqqqooooooommmmmmdggggjjefiilppllpnoooqqrrtttttttttttuuuuuuuuuuuuuuuuuuuuuutttttttttttqqqqqqqooooooommmmmdggggjfchiilppllpnooqqqrrttttttttuuuuuuuuuuuuuuuuuuuuuuuuuuuuuttttttttqqqqqqqqoooooommmmgggggjechiinpplnpnooqqrrtttttttuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutttttttqqqqqqqooooooommmgggggfcehiinpplnpoooqqqttrtttttuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutttttttqqqqqqqooooooommdggggeceiiinpplnpoooqqqqmnrttuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuutttttttqqqqqqqooooooomdggggeceiiinpplnpooqqqqmknptuuuuuuuuuuuuvvvvvvvvuuuvuutuutqtuuuuuuuttttttqqqqqqqqoooooomdggggcceiiinppnnpooqqqojlpptuuuuuuuuuvvvvvvvvvvvvvvuurlkooikmqtuuuuuutttttqqqqqqqooooooodggggecehiinppnppooqqqmjmpptuuuuuuuuvvvvvvvvvvvvvvvvurniefiheekotuuuuttttttqqqqqqqoooooodggggfcchiinpppppnoqqqklnppsuuuuuvvvvvvvvvvvvvvvvvvvvspnhecefeeefmqtuutttttqqqqqqqoooooodggggjcchiinpppppnoqqoklnpptuuuvvvvvvvvvvvvvvvvvvvvvvuppnhecceeeecfkotutttttqqqqqqqoooooddgggjecfiilpppppnoqqmkmppstuuuvvvvvvvvvvvvvvvvvvvvvvvspplhfecceeeccekqtttttqqqqqqqqooooddgggjfcfiilpppppnoqqmknpsstuuvvvvvvvvvvvvvvvvvvvvttuvvppplhfecceffecckqtttttqqqqqqqooooddggggjeeiilppppppoqqmknpsstuvvvvvvvvvvvvvvvvvvvvvofkmqtppnlhfecceffecckqttttqqqqqqqqoooddggggjfeiilpppppppqqmlnpssuuvvvvvvvvvvvvvvvvvvvvvqiecekmnpnihfecceffeecfottttqqqqqqqooodddgggjjeiilpppppppoqmmnpssuvvvvvvvvvvvvvvvvvvvvvvunleccceinniiheccefhfecfotttqqqqqqqqoodddgggjjfhilppppppppqmmnpssuvvvvvvvvvvvvvvvvvvvvvvvspnfccccflliiheccefhfecfoqtqqqqqqqqoodddggggjjhilppppppppqmmopssuvvvvvvvvvvvvvvvvvvvvvvvvppnhecccehhhihecccehhecemqqqqqqqqqoodddggggjjiiinpppppppqomosssuvvvvvvvvvvvvvvvvvvvvvvvvvppnifecccefhihfcccehhecemqqqqqqqqooddddgggjjiiinpppppppromosssuuvvvvvvvvvvvvvvvvvvvvvvvvvppnlheccccehiifeccefhecemqqqqqqqoobdddgggjjiiilnpppppppomossssvvvvvvvvvvvvvvvvvvvvvvsmouvsppnifecccefhhhecceffcckqqqqqqqoobdddgggjjiiiiinpppppponossssvvvvvvvvvvvvvvvvvvvvvvplfkqutppniheecccehhhfccceeceoqqqqqqqobdddgggjjiiiihhlnppppppossssvvvvvvvvvvvvvvvvvvvvvvpnhfemtuppnihfecccefhheccefeemqqqqqqqobbdddgggjiiiihffkmppppppsssssvvvvvvvvvvvvvvvvvvvvvpniheefourpniihfecccehfecceeemqqqqqqqobbdddgggjiiiiihhfklnppsssssssvvvvvvvvvvvvvvvvvvvvvsplihecemtppniiiheccceheccefekqqqqqqqobbdddgggjjiiiiihffklopsssssssuvvvvvvvvvvvvvvvvvvvvupniihecemtrpniiiheccehfccehffqqqqqqoobbbddgggjjiiiiiihkkkmopssssssuvvvvvvvvvvvvvvvvvvvvvspniihfecktrpniiihecehhecehhfoqqqqqoobbbdddgggjjiiiiiikkkkmosssssssvvvvvvvvvvvvvvvvvvvvvvspniihfecktrpliiihechhfcehhfmqqqqqqobbbdddgggjjiiiiillkkkkmossssssvvvvvvvvvvvvvvvvvvvvvvvspniihfccktrniiiifcfihecfihmqqqqqooabbbddgggjjjiiiilllkkkmmqssssssvvvvvvvvvvvvvvvvvvvvvvvspniihfccktniiiifcfhhfcfihloppppnmabbbddgggjjjjiiilllllkkmmossssssvvvvvvvvvvvvvvvvvvvvvvvrpniihecemniiiiheehiheehilppnnlffabbbdddgggjkkiiillllllmmmmosssssvvvvvvvvvvvvvvvvvvvvvvvvppliiheceliiiiifehiheehiinlheeekaabbdddgggjkkkiiilllllmmmmoosssssvvvvvvvvvvvvvvvvvvvvvvvupniihfccfhiiiihehiifehiiifecekoaabbdddgggjjkkiiilllllmmmmmoosssssvvvvvvvvvvvvvvvvvvvvvvuspniihecchiiiihffiihehiihfcckooaaabbddgggjkkkkiiilllllmmmmmoosssssvvvvvvvvvvvvvvvvvvvvvvupniiifccfiiiiiffiiiffiiifcemooaaabbddegffkkkkliilllllmmmmmmoqsssssvvvvvvvvvvvvvvvvvvvvvvspliihecehiiiihfiiihhiiihekoooaaabbddeeffkkkkkiiilllllmmmmmmooqsssuvvvvvvvvvvvvvvvvvvvuuupliiifccfiiiihfhiiihiiihfmoooaaabbcceeefkkkkkkiiillllmmmmmmmooqssuuvvvvvvvvvvvvvvvvvuuuupniiihecfiiiihhhiiiiiiihkooooaaabbcceeefkkkkkkiiilllllmmmmmmooqqstuuuvvvvvvvvvvvuuuuuuuupniiiifcehiiiihhiiiiiiiimooooaaaabccceeffkkkkkiiiilllllmmmmmmmooqsuuuuvvvvvvvvvuuuuuuuuupniiiiheehiiiiiiiiiiiiiimooooaaaabccceeffkkkkkkhiiilllllmmmmmmoooqtuuuuuuuuvuvuuuuuuuuuupniiiiifefiiiiiiiiiiiiiimooooaaaacccceeffkkkkkkhhhiilllllmmmmmmmootuuuuuuuuuuuuuuuuuuuuurniiiiiheehiiiiiiiiiiiiimooooaaaacccceeffkkkkkkhhhhiilllllmmmmmmnoquuuuuuuuuuuuuuuuuuuuurniiiiiifefiiiiiiiiiiiiimooooaaaacccceeffkkkkkkhhhhiiillllllmmmmmnotuuuuuuuuuuuuuuuuuuutrniiiiiihefiiiiiiiiiiiiimooooaaaacccceeefkkkkkkkhhhhiillllllllllmmotuuuuuuuuuuuuuuuuutttrniiiiiiifehiiiiiiiiiiiloooooaaaccccceeffkkkkkkkhhhhhiiillllllkklmottttttuuuuuuuttttttttrniiiiiiihfhiiiiiiiiiiiloooooaaaccccceeefkkkkkkkffhhhiiillllllkkllotttttttttttttttttttttpniiiiiiihfhiiiiiiiiiiiooooooaaaccccceeffkkkkkkkfffhhhiiilllllkkklotttttttttttttttttttttpliiiiiiihfhiiiiiiiiiimooooooaaaccccceeffkkkkkkkffffhhiiiiiiliffhlotttttttttttttttttttttpiiiiiiiiihhiiiiiiiiiloooooomaacccccceeffkkkkkkkffffhhhiiiiiihffhlqttttttttttttttttttttrniiiiiiiiihhiiiiiiiiiooooooomaaccccceeeffkkkkkkkffffhhhiiiiiihffilqttttttttttttttttttttpliiiiiiiiiiiiiiiiiiimooooooomaaccccceeeffkkkkkkkffffhhhiiiiiihfhilrrrrrrrtrrrtrrrrrrrtrnhiiiiiiiiiiiiiiiiiilooooooommacccccceeeffkkkkkkkffffhhhiiiiiihhhinrrrrrrrrrrrrrrrrrrrrqhhiiiiiiiiiiiiiiiiiimooooooommacccccceefffkkkkkkkffffhhhiiiiiihhilprrrrrrrrrrrrrrrrrrrrmfhiiiiiiiiiiiiiiiiiloooooooommcccccceeefffkkkkkkkffffhhhiiiiiiiilorrrrrrrrrrrrrrrrrrrroffhiiiiiiiiiiiiiiiiinooooooommmaccccceeefffkkkkkkfffffhhhiiiiiiiinrrrrrrrrrrrrrrrrrrrrqkehiiiiiiiiiiiiiiiiiloooooooonmmcccccceeeffkkkkkkkfffffhhiiiiiiiilprrrrrrrrrrrrrrrrrrrrlefhiiiiiiiiiiiiiiiiinooooooonmmmccccceeefffkkkkkkhfffffhhiiiiiiiinrrrrrrrrrrrrrrrrrrrrneefiiiiiiiiiiiiiiiiiloooooooonmmmccccceeefffkkkkkkfffffhhhiiiiiiiinrrrrrrrrrrrrrrrrrrrofcehiiiiiiiiiiiiiiiiinooooooonnmmmccccceeffffkkkkkffffffhhiiiiiiiilprrrrrrrrrrrrrrrrrrpkecfhiiiiiiiiiiiiiiiilooooooonnnmmmcccceeefffkkkkkkffffffhhiiiiiiiinprrrrrrrprrrrrprrrrnecehiiiiiiiiiiiiiiiiinpoooooonnmmmmcccceeefffkkkkkffffffhhhiiiiiiiinrrrrrrpppppppprrrrpfccehiiiiiiiiiiiiiiiilooooooonnmmmmmcccceefffkkkkkkffffffhhiiiiiiiilprrrrrrrrppppppppppneccfiiiiiiiiiiiiiiiiinpoooonnnnmmmmmccceeefffkkkkkfffffffhhhiiiiiiilprrrrprprppppppppppkccehiiiiiiiiiiiiiiiiinooooonnnnmmmmmcceeeffffkkkkfffffffhhhiiiiiiiinpprrrprppppppppppppfccehiiiiiiiiiiiiiiiiinoooonnnnnmmmmmcceeeffffkkkkfffffffhhhiiiiiiiinppppppppppppppppppneccfiiiiiiiiiiiiiiiiiinnnnnnnnnnmmmmlceeeeffffkkkffffffffhhiiiiiiiilppppppppppppppppppplccefiiiiiiiiiiiiiiiiiinnnnnnnnnnmmmmlceeeffffkkkffffeeffhhhiiiiiiiilppprpppppppppppppppkccehiiiiiiiiiiiiiiiiiilnnnnnnnnmmmmmleeeeffffkkkffeeeeffhhhiiiiiiiinppprpppppppppppppppkccehiiiiiiiiiiiiiiiiiilnnnnnnnnmmmmlleeefffffkffffeeefffhhiiiiiiiiinppppppppppppppppppphccehiiiiiiiiiiiiiiiiiillnnnnnnnmmmllleeffffffffffeeeeffhhhiiiiiiiiinpppppppppppppppppppfccehiiiiiiiiiiiiiiiiiilllnnnnnnmmmllleefffffffffeeeeeffhhhiiiiiiiilpppppppppppppppppppphccehiiiiiiiiiiiiiiiiiillllmnnmmmmlllleeffffffffeeeeeeffhhhiiiiiiiilppppppppppppppppppppkccehiiiiiiiiiiiiiiiiiillllllnmmmlllllefffffffffeeeeeffhhhiiiiiiiiinpppppppppppppppppppplccehiiiiiiiiiiiiiiiiiilllllllllllllllffffffffffeeeeeffhhiiiiiiiiiinppppppppppppppppppppnecehiiiiiiiiiiiiiiiiiilllllllllllllllfffffffffeeeeefffhiiiiiiiiiiippppppppppppppppppppppfcehiiiiiiiiiiiiiiiiiilllllllllllllllffffffffeeeeeeffhhiiiiiiiiiilppppppppppppppppppppppkcehiiiiiiiiiiiiiiiiiiillllllllllllllfffffffeeeeeeeffhhiiiiiiiiiilppppppppppppppppppppppmeehiiiiiiiiiiiiiiiiiiillllllllllllllfffffffeeeeeeeffhhiiiiiiiiiinppppppppppppppppppppppnfehiiiiiiiiiiiiiiiiiiillllllllllllllfffffffeeeeeeffhhiiiiiiiiiiinppppppppppppppppppppppphehiiiiiiiiiiiiiiiiiiillllllllllllllffffffeeeeeeefhhhiiiiiiiiiiinppppppppppppppppppppppplfhiiiiiiiiiiiiiiiiiiillllllllllllllfffffeeecceeffhhhiiiiiiiiiiippppppppppppppppppppppppnfhiiiiiiiiiiiiiiiiiiillllllllllllllfffffeeceeeeffhhhiiiiiiiiiilppppppppppppppppppppppppnhhiiiiiiiiiiiiiiiiiiiilllllllllllllffffeecceeefffhiiiiiiiiiiiilppppppppppppppppppppppppnhhiiiiiiiiiiiiiiiiiiiilllllllllllllfffeeeccceeffhhhiiiiiiiiiiinppppppppppppppppppppppppphhiiiiiiiiiiiiiiiiiiiilllllllllllllffeeeccceeeffhhiiiiiiiiiiiinpppppppppppppppppppppppppiiiiiiiiiiiiiiiiiiiiiilllllllllllllffeeeccceeffhhhiiiiiiiiiiiinpppppppppppppppppppppppppiiiiiiiiiiiiiiiiiiiiiiillllllllllllfeeccccceeffhhiiiiiiiiiiiiinpppppppppppppppppppppppppliiiiiiiiiiiiiiiiiiiiiiilllllllllllfeecccceeefhhhhiiiiiiiiiiilppppppppppppppppppppppppppliiiiiiiiiiiiiiiiiiiiiilllllllllllleeecccceeffhhhiiiiiiiiiiiilppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiillllllllllleeccccceeffhhhiiiiiiiiiiiilppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiiilllllllllleeccccceefhhhiiiiiiiiiiiiilppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiillllllllllleccccceeffhhiiiiiiiiiiiiiilpppppppppppppppppppppppppppiiiiiiiiiiiiiiiiiiiiiiiiillllllllicccccceefhhhiiiiiiiiiiiiiinpppppppppppppppppppppppppppiiiiiiiiiiiiiiiiiiiiiiiiilllllllliccccceeffhhhiiiiiiiiiiiiiinpppppppppppppppppppppppppppliiiiiiiiiiiiiiiiiiiiiiiillllllliiccccceeffhhiiiiiiiiiiiiiiinpppppppppppppppppppppppppppliiiiiiiiiiiiiiiiiiiiiiiillllllllicccceeefhhhiiiiiiiiiiiiiiinpppppppppppppppppppppppppppliiiiiiiiiiiiiiiiiiiiiiiiiilllliiicccceeffhhhiiiiiiiiiiiiiiippppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiiillllllllicccceeffhhhiiiiiiiiiiiiiilppppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiccceeefhhhiiiiiiiiiiiiiiilppppppppppppppppppppppppppppniiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
}, GLOBE_TONES = Object.fromEntries(GLOBE_PHOTO.palette.map((hex, i) => [`tone${i}`, [hex, handsDim(hex)]])), GLOBE_AT = { x: 0.485, y: 0.43, r: 0.155 }, GLOBE_DROP = 0.56, GLOBE_EVEN = 5e-3, GLOBE_HANDS = [
  {
    outline: [
      [95, 235],
      [150, 275],
      [150, 330],
      [128, 392],
      [150, 394],
      [170, 420],
      [178, 500],
      [215, 560],
      [240, 640],
      [292, 760],
      [300, 968],
      [100, 968],
      [62, 700],
      [35, 500],
      [28, 400],
      [58, 330],
      [80, 290]
    ],
    pivot: [215, 1150],
    phase: 1.3
  },
  {
    outline: [
      [320, 404],
      [372, 410],
      [442, 440],
      [492, 500],
      [526, 545],
      [500, 572],
      [472, 640],
      [470, 760],
      [482, 968],
      [305, 968],
      [318, 760],
      [330, 660],
      [300, 560],
      [294, 470],
      [300, 438]
    ],
    pivot: [392, 1180],
    phase: 4.4
  }
], GLOBE_GIVE = 0.3, GLOBE_REACH = 5, GLOBE = {
  ...HERO,
  intro: !1,
  wake: "300% 0px",
  near: "100% 0px",
  words: { at: [0.5, -4], half: [1e-3, 1e-3] },
  lines: { ...LINES, veil: [0, 0], veilCore: 0.5, sink: 1e-3 },
  inks: {
    ...LAND_INK,
    dusk: [GLOBE_PHOTO.palette[0], handsDim(GLOBE_PHOTO.palette[0])],
    lilac: [GLOBE_PHOTO.palette[12], handsDim(GLOBE_PHOTO.palette[12])],
    blush: [GLOBE_PHOTO.palette[22], handsDim(GLOBE_PHOTO.palette[22])]
  },
  sky: {
    stops: [
      [0, "dusk"],
      [0.5, "lilac"],
      [1, "blush"]
    ],
    grain: 0.4,
    brush: 0.06,
    wash: "lilac"
  },
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    sheets: [],
    room: 100,
    foot: ({ h }) => h - 100,
    head: 0,
    least: 20
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  glyphs: !0,
  twinkle: !0,
  marks: !0,
  paints: {
    ...PAINTS,
    ...GLOBE_TONES,
    // the globe: a pale pink body, warm white round its middle, and a bright rim
    orbCore: ["#fff7ee", "#fff3e8"],
    orbBody: ["#f9ddf1", "#f5d6ed"],
    orbDeep: ["#e3c1ee", "#dcb9e9"],
    orbEdge: ["#dcbcec", "#d4b3e6"],
    orbRim: ["#fff8fc", "#fff6fb"],
    // its halo, warm near it and pink further out
    glowWarm: ["#fff1d6", "#ffecca"],
    glowPink: ["#ffd9ef", "#fcd2ea"],
    light: ["#ffffff", "#ffffff"],
    lightWarm: ["#fffaf0", "#fff6e8"],
    lightGlow: ["#fff3e0", "#ffeed4"],
    halo: ["#ffd6f0", "#fbcdea"]
  },
  clouds: [],
  flock: [],
  lens: null,
  // when the page lights the globe (a packet landing), the hands lean out from it a little, and back as it settles
  push: { amount: 0.09, at: GLOBE_AT.x },
  fit: (w) => clamp(w / 300, 0.5, 1),
  plant: (garden) => {
    let { w, h, rand } = garden, [gw, gh] = GLOBE_PHOTO.grid, cells = GLOBE_PHOTO.cells, cw = Math.max(w / gw, h / gh), ox = (w - gw * cw) / 2, oy = (h - gh * cw) * GLOBE_DROP, lum = GLOBE_PHOTO.palette.map((hex) => {
      let v = Number.parseInt(hex.slice(1), 16);
      return (0.2126 * (v >> 16 & 255) + 0.7152 * (v >> 8 & 255) + 0.0722 * (v & 255)) / 255;
    }), toneAt = (gx, gy) => Number.parseInt(cells[clamp(gy, 0, gh - 1) * gw + clamp(gx, 0, gw - 1)], 36), L = (gx, gy) => lum[toneAt(gx, gy)], toCanvas = (gx, gy) => [ox + gx * cw, oy + gy * cw], HAZE = 0.4 + GLOBE_EVEN, PX = 528 / gw, inside = (outline, x, y) => {
      let hit = !1;
      for (let i = 0, j = outline.length - 1; i < outline.length; j = i, i += 1) {
        let [xi, yi] = outline[i], [xj, yj] = outline[j];
        yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi && (hit = !hit);
      }
      return hit;
    }, far = gw + gh, handWeights = GLOBE_HANDS.map((hand) => {
      let d = new Float32Array(gw * gh).fill(far);
      for (let gy = 0; gy < gh; gy += 1)
        for (let gx = 0; gx < gw; gx += 1)
          inside(hand.outline, (gx + 0.5) * PX, (gy + 0.5) * PX) && (d[gy * gw + gx] = 0);
      let pass = (dir) => {
        let ys = dir > 0 ? [...Array(gh).keys()] : [...Array(gh).keys()].reverse(), xs = dir > 0 ? [...Array(gw).keys()] : [...Array(gw).keys()].reverse();
        for (let gy of ys)
          for (let gx of xs) {
            let v = d[gy * gw + gx];
            for (let [dx, dy, c] of [
              [-dir, 0, 1],
              [0, -dir, 1],
              [-dir, -dir, 1.414],
              [dir, -dir, 1.414]
            ]) {
              let x = gx + dx, y = gy + dy;
              x >= 0 && x < gw && y >= 0 && y < gh && (v = Math.min(v, d[y * gw + x] + c));
            }
            d[gy * gw + gx] = v;
          }
      };
      return pass(1), pass(-1), d.map((v) => 1 - smooth(0, GLOBE_REACH, v));
    }), hands = GLOBE_HANDS.map((hand) => ({
      pivot: toCanvas(hand.pivot[0] / PX, hand.pivot[1] / PX),
      phase: hand.phase
    })), handOf = (cell) => {
      let [a, b] = handWeights.map((wts) => wts[cell]);
      return a >= b ? [hands[0], a] : [hands[1], b];
    }, calm = (seed) => {
      for (let k = 0; k < 60; k += 1) {
        rand.reseed(seed + k * 104729), rand(), rand(), rand();
        let dice = rand();
        if (Math.abs(dice * 91.7 % 1 - 0.5) < 0.08 && Math.abs(dice * 37.3 % 1 - 0.5) < 0.15)
          return seed + k * 104729;
      }
      return seed;
    }, put = (n2, { x, y, turn, hand = null, weight = 0, ...o }) => {
      if (rand.reseed(calm(73019 + n2 * 7919)), hand && weight > 0.02) {
        let dx = x - hand.pivot[0], up = hand.pivot[1] - y, lean = Math.atan2(dx, up);
        garden.dab({
          kind: HAZE,
          ...o,
          x: hand.pivot[0],
          y: hand.pivot[1],
          stem: Math.hypot(dx, up),
          lean,
          phase: hand.phase,
          stiff: 1 - GLOBE_GIVE * weight,
          turn: turn - lean * 0.7
        });
        return;
      }
      let root = h + 40;
      garden.dab({ kind: HAZE, ...o, x, y: root, stem: root - y, lean: 0, stiff: 1, turn });
    };
    for (let gy = 0; gy < gh; gy += 1)
      for (let gx = 0; gx < gw; gx += 1) {
        let n2 = gy * gw + gx, [cx, cy] = toCanvas(
          gx + 0.5 + (hashed(n2 * 1.31) - 0.5) * 0.5,
          gy + 0.5 + (hashed(n2 * 2.17) - 0.5) * 0.5
        );
        if (cx < -cw * 2 || cx > w + cw * 2 || cy < -cw * 2 || cy > h + cw * 2)
          continue;
        let tone = toneAt(gx, gy), ddx = L(gx + 1, gy) - L(gx - 1, gy), ddy = L(gx, gy + 1) - L(gx, gy - 1), turn = (Math.hypot(ddx, ddy) < 0.012 ? 0.9 + 0.6 * Math.sin(gx * 0.11 + gy * 0.07) : Math.atan2(ddy, ddx) + Math.PI / 2) + (hashed(n2 * 3.7) - 0.5) * 0.5, [hand, weight] = handOf(n2);
        put(n2, {
          x: cx,
          y: cy,
          turn,
          hand,
          weight,
          long: cw * 1.5,
          wide: 0.9,
          blur: cw * 1.2,
          paints: [`tone${tone}`, `tone${tone}`],
          load: 0.95,
          order: gy * 0.01
        });
      }
    let gx0 = w * GLOBE_AT.x, gy0 = h * GLOBE_AT.y, r = w * GLOBE_AT.r, step = Math.max(1.6, r / 9), n = 4e5;
    for (let ring = 0; ring < 3; ring += 1) {
      let reach = [1.6, 1.38, 1.18][ring];
      for (let y = gy0 - r * reach; y <= gy0 + r * reach; y += step * 1.4)
        for (let x = gx0 - r * reach; x <= gx0 + r * reach; x += step * 1.4) {
          n += 1;
          let px = x + (hashed(n * 1.7) - 0.5) * step, py = y + (hashed(n * 2.3) - 0.5) * step, d = Math.hypot(px - gx0, py - gy0) / r;
          if (d < 0.9 || d > reach)
            continue;
          let fade = 1 - smooth(1, reach, d);
          put(n, {
            x: px,
            y: py,
            turn: Math.atan2(py - gy0, px - gx0) + Math.PI / 2,
            long: step * 3.2,
            wide: 1,
            blur: step * 2.6,
            paints: d < 1.3 ? ["glowWarm", "glowWarm"] : ["glowPink", "glowPink"],
            load: 0.05 + 0.2 * fade,
            order: 3e3 + ring
          });
        }
    }
    for (let pass = 0; pass < 3; pass += 1)
      for (let y = gy0 - r; y <= gy0 + r; y += step * 0.75)
        for (let x = gx0 - r; x <= gx0 + r; x += step * 0.9) {
          n += 1;
          let px = x + (hashed(n * 1.7) - 0.5) * step * 0.7, py = y + (hashed(n * 2.3) - 0.5) * step * 0.7, dx = (px - gx0) / r, dy = (py - gy0) / r, d = Math.hypot(dx, dy);
          if (d > 0.97)
            continue;
          let shade = smooth(0.1, 1, dx * 0.45 + dy * 0.75), core = 1 - smooth(0.2, 0.78, d + (dx + dy) * 0.12), edge = smooth(0.55, 1, d) * (0.55 + 0.45 * shade), dice = hashed(n * 5.1), paint = "orbBody";
          dice < core ? paint = "orbCore" : dice > 1 - edge && (paint = hashed(n * 6.3) < shade ? "orbDeep" : "orbEdge"), put(n, {
            x: px,
            y: py,
            turn: Math.atan2(py - gy0, px - gx0) + Math.PI / 2 + (hashed(n * 3.1) - 0.5) * 0.4,
            long: step * 1.9,
            wide: 0.9,
            blur: step * 1.1,
            paints: [paint, paint],
            load: 0.55 + 0.25 * (1 - d),
            order: 4e3 + pass
          });
        }
    let around = Math.ceil(Math.PI * 2 * r / (step * 0.8));
    for (let k = 0; k < around; k += 1) {
      n += 1;
      let a = k / around * Math.PI * 2, near = Math.max(0, Math.cos(a + 2.3)) ** 1.5;
      near < 0.05 || put(n, {
        x: gx0 + Math.cos(a) * r * 0.95,
        y: gy0 + Math.sin(a) * r * 0.95,
        turn: a + Math.PI / 2,
        long: step * 1.7,
        wide: 0.55,
        blur: step * 0.6,
        paints: ["orbRim", "orbRim"],
        load: 0.55 * near,
        order: 4100
      });
    }
    [
      (t) => [Math.sin(t) * 0.42, -Math.cos(t)],
      (t) => [Math.sin(t) * 0.8, -Math.cos(t)],
      (t) => [Math.cos(t) * 0.87, -0.42 + Math.sin(t) * 0.12],
      (t) => [Math.cos(t) * 0.87, 0.42 + Math.sin(t) * 0.12]
    ].forEach((at, j) => {
      for (let k = 0; k < 34; k += 1) {
        let t0 = k / 34 * Math.PI * 2, t1 = (k + 1) / 34 * Math.PI * 2, [ux, uy] = at(t0), [vx, vy] = at(t1);
        if (j < 2 && Math.sin(t0) < 0 || j >= 2 && Math.sin(t0) < 0)
          continue;
        n += 1;
        let mx = (ux + vx) / 2, my = (uy + vy) / 2, out = Math.hypot(mx, my);
        put(n, {
          x: gx0 + mx * r * 0.97,
          y: gy0 + my * r * 0.97,
          turn: Math.atan2(vy - uy, vx - ux),
          long: Math.max(step, Math.hypot(vx - ux, vy - uy) * r * 1.3),
          wide: 0.18,
          blur: step * 0.35,
          paints: ["orbRim", "orbRim"],
          load: 0.45 * (1 - smooth(0.7, 1, out)),
          order: 4150
        });
      }
    });
    for (let k = 0; k < 14; k += 1) {
      n += 1;
      let a = hashed(n * 4.1) * Math.PI * 2, rr = r * 0.32 * Math.sqrt(hashed(n * 3.3));
      put(n, {
        x: gx0 + Math.cos(a) * rr,
        y: gy0 + Math.sin(a) * rr,
        turn: a,
        long: r * 0.9,
        wide: 1,
        blur: r * 0.55,
        paints: ["glowWarm", "lightGlow"],
        load: 0.3,
        order: 4180
      });
    }
    for (let k = 0; k < 10; k += 1) {
      n += 1;
      let a = -2.3 + (hashed(n * 4.3) - 0.5) * 0.9, rr = r * (0.5 + 0.18 * hashed(n * 2.9));
      put(n, {
        x: gx0 + Math.cos(a) * rr,
        y: gy0 + Math.sin(a) * rr,
        turn: a + Math.PI / 2,
        long: step * 2.4,
        wide: 0.8,
        blur: step * 1.6,
        paints: ["light", "lightWarm"],
        load: 0.4,
        order: 4200
      });
    }
    let rgbOf2 = GLOBE_PHOTO.palette.map((hex) => {
      let v = Number.parseInt(hex.slice(1), 16);
      return [v >> 16 & 255, v >> 8 & 255, v & 255];
    });
    for (let gy = 0; gy < gh; gy += 1)
      for (let gx = 0; gx < gw; gx += 1) {
        let cell = gy * gw + gx, [cx, cy] = toCanvas(
          gx + 0.5 + (hashed(cell * 1.31) - 0.5) * 0.5,
          gy + 0.5 + (hashed(cell * 2.17) - 0.5) * 0.5
        );
        if (Math.hypot(cx - gx0, cy - gy0) / r > 1.75)
          continue;
        let tone = toneAt(gx, gy), [cr, cg, cb] = rgbOf2[tone];
        if (cb < cg + 14 || cr + cg + cb > 690)
          continue;
        let ddx = L(gx + 1, gy) - L(gx - 1, gy), ddy = L(gx, gy + 1) - L(gx, gy - 1), [hand, weight] = handOf(cell);
        put(6e5 + cell, {
          x: cx,
          y: cy,
          hand,
          weight,
          turn: Math.atan2(ddy, ddx) + Math.PI / 2 + (hashed(cell * 3.7) - 0.5) * 0.5,
          long: cw * 1.4,
          wide: 0.9,
          blur: cw * 1.05,
          paints: [`tone${tone}`, `tone${tone}`],
          load: 0.95,
          order: 4600 + gy * 0.01
        });
      }
    for (let k = 0; k < 16; k += 1) {
      n += 1;
      let a = hashed(n * 7.7) * Math.PI * 2, rr = r * (1.25 + 1.1 * hashed(n * 8.9)), x = gx0 + Math.cos(a) * rr, y = gy0 + Math.sin(a) * rr * 1.15;
      if (x < w * 0.06 || x > w * 0.94 || y < h * 0.08 || y > h * 0.92)
        continue;
      let core = Math.max(0.9, w * (6e-3 + 6e-3 * hashed(n * 4.7)));
      rand.reseed(51217 + n * 7919), garden.dab({
        x,
        y,
        stem: 0,
        long: core * 4,
        wide: 1,
        turn: 0,
        blur: core * 3,
        paints: ["lightGlow", "halo"],
        load: 0.5,
        kind: 3.25,
        stiff: 1,
        lean: 0,
        order: 5e3
      }), rand.reseed(51219 + n * 7919), garden.dab({
        x,
        y,
        stem: 0,
        long: core,
        wide: 0.95,
        turn: 0,
        blur: 0.4,
        paints: ["light", "lightWarm"],
        load: 0.95,
        kind: 3.4,
        stiff: 1,
        lean: 0,
        order: 5001
      });
    }
  }
}, CP_FACE = {
  grid: [133, 85],
  box: [600, 130, 1400, 640],
  cell: 6,
  shade: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001222222110000000000000000000000011223333322100000000000000000112222221111100000000000000000111222222111100000000000000000000000000002456666554332100000000000000001234567777654210000000000000000001233333333332222111000000011223334444332110000000000000000000000000000257899988876542000000000000002356889aaa975310000000000000000000001233444444444332211000011233444555443210000000000000000000000000000025799aaaaa987531000000000000246789aaaba974200000000000000000000000012344555444443322100012233445555443210000000000000000000000000000014789abbbbba86310000000000024689aaabba9752000000000000000000000000002334455555444332110012233444555432100000000000000000000000000000003689bbcddcb9631000000000002579abbbbba8630000000000000000000000000000223344555444332110012233444444432110000000000000000000000000000002479bcdddcb9630000000000002579accccb97410000000000000000000000000000122344555544332110012233444444433210000000000000000000000000000002479bddedcb9741000000000002579bcddcb96410000000000000000000000000000122334444444332110012233334444443332000000000000000000000000000013579bcddcba8741000000000001479bcccba86310000000000000000000000000001223333444443332110011222333344444443321000000000000000000000123445689abccca98641000000000000369abbbb9864320000000000000000000000001223333333333333221100112222233344455555555444444443322122344567777778889aaa988642000000000000014689a9987655433221110000001122334444455554444333333322211001112222233345566777778889aaa99999999aabbccccbbba99999887653100000000000001356888777777777777777666678888888887777665443333333222211001112222222344567788999acdeeeeeeffffffgggggggfedcbaa998754320000000000000002356777789aabbbbbccdddcccddeeddddcba9887665433333322222110011121112233445667899abdeghhhhhiiiihhijjjiiiihgfedba98764321000000000000000123455678abccdddeefggggggghggggffedba98765544333222222211001111111112233445689abcefhijjjjkkkjjjjkkjjjiihgfedba98754210000000000000000012334679acdeefffghhiiiiijjiihihhfedb98765433222222222211001112221112223344678acdeghjjjjjjjiihhiiihhggfedcbb98765421000000000000000000001234678aabcddeefgggghiiiihhihgfecb987643322112222221110001112211111112234679abcefghhgghhggfffffeeddcbaa99876532100000000000000000000012235677899abccdddddefggffffedcca9865421100011111111110001111111111111123467899bccdccccccbbaaaaa9998776665443210000000000000000000000001223445566778889999abbbbbaa988765432100000011111111100011111111110000012234566777778888777776666665544332210000000000000000000000000000012233344445555555665665554432110000000000111111110011111111110000000000011222223333333333333344322111100000000000000000000000000000000001222112222222211111110000000000000000001111111001111111000000000000000000000001111111111111211000000000000000000000000000000000000000000000000000000000000000000000000000000011111100011111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111110011111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111001111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111100111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011121110011121111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011122211001112221110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011222221100112222221000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011222222110011222222110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001233333221001122333221000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000123333322100112233333221000000000000000000000000000000000000000000000024566665545555320000000000000000000000000000000000000000000001123343332210011223444443221000000000000000000000000000000000000000000358abcddcbaaabbb9853100000000000000000000000000000000000000000112334433322100112234455444322110000000000000000000000000000000000000248beghiihgffffghgfdb863100000000000000000000000000000000000000122334444332210011233444554433221000000000000000000000000000000000000148cgjkllllkjjjkllkjhfda741000000000000000000000000000000000000011233444433221001123344455544332210000000000000000000000000000000000148dhlnopppooonnoooonljheb8520000000000000000000000000000000000001223444443322100112334455555443322100000000000000000000000000000000037bgknpqrrqqqqqpqqqponljheb741000000000000000000000000000000000001123344443322100112334455555544433221000000000000000000000000000000259eimoqrssrrrrrqqqqqpnmkigc85200000000000000000000000000000000011122333444332210011233445555554443332221100000000000000000000000000026aeilnpqqrrqqqpppppponlkigc952000000000000000000000000000111100111122333333322100112334444554444443322222100000000000000000000000000259dgjlnnoooooooooonmmlkjheb840000000000000000000000000000011000001111223333322100112334445555444343333332100000000000000000000000000037adgijkkkkllllllkjiihgfda741000000000000000000000000000000000000001122333332110011233445555554444444433321000000000000000000000000000479cdeeffggggggffedcbb9853000000000000000000000000000000000000000011223333221100112334455555544455544443321000000000000000000000000000245677899aaaa9987665432000000000000000000000000000011100000000001122333332211001123345555555555555555443221000000000000000000000000000000000112233211000000000000000000000000000000000011111000000001112233332211100112234455545555555666554432100000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111223332221100001123344445555666666655443221000000000000000000000000000000000000000000000000000000000000000000000000000122222222222111122332222110001122344455556666666555555432100000000000000000000000000000000000000000000000000000000000000000000000000122322222332221222333332211000112234445556667766544444432110000000000000000000000000000000000000000000000000000000000000000000000000012233333333322223344433322100011223445556667777665555543221000000000000000000000000000000000000000000000000000000000000000000000000011223333333332233444444332210001122334455566677766655554321000000000000000000000000000000000000000000000000000000000000000000000000001223333333333333445554433221100012233444555556666666666543221000000000000000000000000000002344321111232200000000000000000000000000011223322222233333445555544322110011223344455565666565555554322100000000000000000000000002579bcdeddcbbbbcba8764100000000000000000000001122322111123334444455544332211001122334444555565555555555432211000000000000000000000369cfgijklmmlkjjjjjihgfdca74200000000000000000001122221100112333334455554432211001122334455666676655434444321100000000000000000000037behjmnopqrrrqpppppoonmlkigec9631000000000000000001211101000112233334555544322110011223344556677777654444432110000000000000000000136aehknoqrrsstttsssssssrrqponlkifc9754320000000000000000000000000112334455554432211000122334456677777766544333211000000000000000013469cgjmoprssstttttttttttttssrqponmkhfca87543211000000000000000000001223455665554322110001223344556666666554433321100000000000000002468adhkmopqrrrrrrrrrrrrrssssrrqqqponmkigeca86532210000000000000000000123455665554332211000112334455555554444332222100000000000000012357acgjlnooooonnnnnnnnnnooooooonnnnnnmljigeca8754210000000000000000001233456665544332211000112234445554443333221111000000000000000012358adfhjkjjiihhgggfffffggghhhggghhijjiihgedba87532000000000000000000002344555555443322100001123344555555544443322110000000000000000023569bcdeeecba987655555555567766789abccccbba9875421000000000000000000123455666665544322100001123344555565555555432211000000000000000002345677776421000000000000000000000123455555443210000000000000000000134456667776654432210000112334455666666666654321100000000000000000001111110000000000000000000000000000000000000000000000000000000000234556677777665443221000001123344555556666665432100000000000000000000000000000000000000000000000000000000000000000000000000000000000134566677777766543322100000112234444555556665432210000000000000000000000000000000000000000000000000000000000000000000000000000000000123455667777766543322110000011123344455666655544321000000000000000000000000000000000000000000000000000000000000000000000000000000001223455667777766654322211000001112334555666666655554211110000000000000000000000000000000000000000000000000000000000000000000000000001234456677887766654432211100000011123445556667777666543332210000000000000000000012333332100000000000000011111000000000000000000000001345667788888776665433221100000000112233445566778888776555443210000000000000000023567899999877777667777777665432000000000000000000001246678888998877665543221100000000001122333456778999888776665432200000000000000013578acdefggfffffffffeedccbba975310000000000000000001245678888888887665543221100000000000011222345678889998888887655432211000000000001358acdfhijkjjjkkkkkjihgfedcba86420000000000000000112456788877788877654432210000000000000000112234567888888888876543322221000000000001358abdfgijkkkkkllkkjjihgedca97642000000000000000122345678877767776544332210000000000000000001123456778888899998876544333210000000000024689acdfghhhiiiihhggffecb9875420000000000000012345567898887766665433221100000000000000000000012344566778888887665432221100000000000001245678aabbbcccbbaaa998765432000000000000000012344556776665544443221110000000000000000000000000123345566777888765544333221100000000000001123344444444433333221100000000000000000123455667787665543333211000000000000000000000000000000122334455666665443333222100000000000000000000000000000000000000000000000000001223445566776654432211110000000000000000000000000000000001112334455666554443333322100000000000000000000000000000000000000000000000001233445566666654332100000000000000000000000000000000000000000112334445554443333332211000000000000000000000000000000000000000000000001223444455555543221000000000000000000000100000000000000000000000112223344443333333221100000000000000000000000000000000000000000000001122333333333332100000000000000000000000110000000000000000000000000011112222222232222110000000000000000000000000000000000000000000000111222222222111000000000000000000000000011001221000000000000000000000000000111122221111100000000000000000000000000000000000000000000111111111111000000000000000000000000000001100123310000000000000000000000000000001111111111100000000000000000000000000000000000000000111111110000000000000000000000000000000000110011221000000000000000000000000000000000000111111000000000000000000000000000000000000000000000000000000000000000000133100000000000001000111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000134431000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  light: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111222222222222111111000000000111222233333333333332221111100000000000001111111111000000000000011111111111110000111111000000000000111223345566666665543221100000000000001223345555555443321000000000000000012233333333221000000000000000000011111000000000000000000000001235679abcddddccba87543100000000000000012345677766543200000000000000001246788998877653200000000000000000000000000000000000000000000123568aceghjjkkjjihfdb97530000000000000000024567776542100000000000000001368bcdeeeeedcb9854200000000000000000000000000000000000000000123579cegikmnooooomljhfca7410000000000000000245566554310000000000000000146aceghijkkjihgeca75310000000000000000000000000000000000000002457acehjlnpqrrrrqpomkifc962000000000000000013455554320000000000000000147adgiklmnonnmkjhfdb8531000000000000000000000000000000000000012468bdfikmnpqrrsrrqonljhea7300000000000000001345665542000000000000000036adgjlnopqqqpomljhfc9742100000000000000000000000000000000000012468acegiklnoopqqqpnmkigdb8510000000000000002356777653000000000000000258behjlnoqqqponlkigdb97431000000000000000000000000000000000000013578abdeghijkllllkjhgeca863100000000000000024577876530000000000000002479cegijlmnmmljigfdb9764310000000000000000000000000000000000000012445789abcddeeffedba9754210000000000000000257899876420000000000000013578abdegghggfecba8764321000000000000000000000000000000000000000000012233455567776543100000000000000000000025799a9875300000000000000001234568999887665432110000000000000000000000000000000000000000000000000000000000000000000000000000000000001478abcba8641000000000000000000000011100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000258abdddba752000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000369bdeeedb85300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147aceffedb96310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001358bdeffedb97520000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000012479bdefgfeca863210000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002358acdefgfedb875320000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000123568aceffggfdb975432100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001234578acefgggfeca86433221000000000000000000000000000000000011221100000000000000000000000001112111000000000000000000000000000000000012345679bdfggggfedb9754433321100000000000000000000000000112233322111100000000000000000000112233333333332211000000000000000000000012233445679acefghhhgfeca876544433221000000000000001112222233444444443322110000000000000000000122344555566666554433222221100111111122233445556789bdfghhhhhgeca98665544444332222222222223344555556667666555433211000000000000000000012345556677888887766554444333222333334445566677789aceghiiiiihfeca976555555555443333333445566777777788887776554321100000000000000000001233456789aabbccccbba9988776555555455666666777789abdeghjjjjjigfdb98766667777766555556678899aaabbbbbbbaa998865432110000000000000000000123356789abccddeefeeddcbbaa9877777777888777777889acdfhijkkkjigfdca876667788887777788899abbccdddedddcccbaa987643210000000000000000000012234689abcddefghhgggggfeedcbbaaaa99999988877788abcefgijkkkjigfedb9877778899999aaabbbccddefffgggggfeedcba9876432100000000000000000000012345789abcdeeghhhhhhhggffedddcccbbbbbaa9887889abcdefghiiihgeedcba988778899aabbcccddeeefggghhhhhgfeedcb986543210000000000000000000000023456799abcdefghhhihhhggggffeedddcccbbaa98889aaaaabbcdeeedccbbbba98888889aabbcdddeeffffggggghhgffedcba865532100000000000000000000000013455678abcdefgghhhhhgggggfffeeeddcccba99888998876677888887778888888778899abbcddeeeffffgggggggffedcba97544310000000000000000000000000134556789abcddefgggggggggfffeeedddccba987667765321001112221123455677767789aabcdddeeeeeeeffeeeeddcbba97654431000000000000000000000000000233456789abbddeeeeefffeeeeeeedddccb98765444200000000000000000013455556789abccddddddddddddcccbbaa987654321000000000000000000000000000000112356789abbcccccdddddddddccccbba87543310000000000000000000000133345689abbcccccccccbbbbbaaa988765432210000000000000000000000000000000000134567899aaaabbbccccccccbbbba9865321000000000000000000000000012345789abbbbbbaaaaa999998877654432100000000000000000000000000000000000012345678888999aaabbbbbbbbbaaa97642100000000000000000000000000002356899aaaaa9999888777776554432221000000000000000000000000000000000000012345566667788999aaaaaaaaaa987531000000000000000000000000000000246789999998887776555554333222111000000000000000000000000000000000000001233344445667788999999aaaa9875200000000000000000000000000000002467888888887766555444332211111100000000000000000000000000000000000000000112223334556778888899aaa986410000000000000000000000000000000146789998877766655443332210000000000000000000000000000000000000000000000000012233345567778899aaaa98641000000000000000000000000000000025789999887766655443332210000000000000000000000000000000000000000000000000001233444456677789aaaaa98752000000000000000000000000000000035799aaa98877766543332211100000000000000000000000000000000000000000000000000023344445667789aabbbba98640000000000000000000000000000002579aaaaa988777654332211110000000000000000000000000000000000000000000000000000112343445667889aabbbbba86300000000000000000000000000003589abbbaa99877765433210000000010000000000000000000000000000000000000000000000000123334567889aaabbcccba86410000000000000000000000002478abbccbba99887655433210000000000000000000000000000000000000000000000000000000000012234567889aabbccdddcb97542211000000000000112334578abccddccbba998765433221000000000000000000000000000000000000000000000000000000000001223456789aabcccddeeeedbba998888888755578899999aabcdeeeeddccbaa987654332210000000000000000000000000000000000000000000000000000000000001123456789abbcdeffggggfffffeffggggfdddeffggfffffffggggfeedcba9876543322100000000000000000000000000000000000000000000000000000000000000123456789aabcdefgghhiiiijjjjkkllllkjjjjkkkkjjiiiiiihhgfedcba98765432221000000000000000000000000000000000000000000000000000000000000012234567889abcdegghiijkkkkkkkkkllmllkkkkkjjjkjjjjjjiihgffdcba98765432221000000000000000000000000000000000000000000000000000000000000012245666789abcdefghijjkkjihggfffgghhhhggfeefghhiijiihhhgfdcba9765543221100000000000000000000000000000000000000000000000000000000000001234566679aabcdeghhiijihgecb98777889999877789bcdfghhhggfedca9876554321100000000000000000000000000000000000000000000000000000000000000012344457899abceffgggfdb9642000000000000000013479bcdddddcba987654321100000000000000000000000000000000000000000000000000000000000000000123333467899abcdddcb963000000000000000000000000146899aa9987765443211000000000000000000000000000000000000000000000000000000000000000000112223567789999986410000000000000000000000000000013455666665443211000000000000000000000000000000000000000000000000000000000000000000122223455666766542000000000000000000000000000000000000122333333221110000000000000000000000000000000000000000000000000000000000000000122333445665543200000000000000000000000000000000000000000001122222211110000111000000000000000000000000000000000000000000000000000000122233344544321000000000000000000000000000000000000000000000000000111111100111100000000000000000000000000000000000000000000000000000012233334443210000000000000000000000000000000000000000000000000000011112222222211111000000000000000000000000000000000000000000000000112222333333210000000000000000000000000000000000000000000000000000001111223222221111100000000000000000000000000000000000000000000000112333444444321000000000000000000000000000000000000000000000000000001222233344333222210000000000000000000000000000000000000000000000001223344444432100000000000000000000000000000000000000000000000000000123334444443322100000000000000000000000000000000000000000000000000012234455555321000000000000001234566777777655543100000000000000001123334444333322100000000000000000000000000000000000000000000000000000122334556653210000000001358abcefghiiiiiiihgfdba865321100000012233334444443332210000000000000000000000000000000000000000000000000000011122345566543333333334579bdfhijlmopqppqqqpnljhfdba876544444444444444444332211100000000000000000000000000000000000000000000000000000111112345566655555666556689cegijkmopqqqrrrrqomkigeca9776655655555554444443322110000000000000000000000000000000000000000000000000000001111233455555566677665555678acdeghjkllmmmmmljhfecba87665666666666665555543321000000000000000000000000000000000000000000000000000000000000124555566667777765432222345679abcddddddcba8765443334556777776666666543321000000000000000000000000000000000000000000000000000000000000012344445566676643200000000000122333333211000000001235567777766655443221000000000000000000000000000000000000000000000000000000000000000012233455556653200000000000000000000000000000000002456667766655432210000000000000000000000000000000000000000000000000000000000000000000011233444554210000000000000000000000000000000000134556666555432110000000000000000000000000000000000000000000000000000000000000000000000012233444321000000000000000000000000000000000002344555554432000000000000000000000000000000000000000000000000000000000000000000000000000123344432100000000000000000000000000000000000233455544432100000000000000000000000000000011100001111110000000000000000000000000000000001223444310000000000000000000000000000000000123344443321000000000000000000000000000000111111000111221110000000000000000000000000000000122344432100000000000000000000000000000001233444443322100000000000000000000000000001111221100111222222110000000000000000000000000000000123333222110000000000000000000000000012344444433210000000000000000000000000000011122222110011223333322210000000000000000000000000000011233333333333332222233334444443333334444444333210000000000000000000000000001111222222210001123333333222100000000000000000000000000000122233344456677777888899999988777665555544332110000000000000000000000000111112222222221000122334443333221100000000000000000000000000001122334556788999aaabbbbccbbba99887665544332100000000000000000000001112222222233333222000011234444433332222111000000000000000000000000111223455678999aabbbccccccbbaa998776554332110000000000000000000012222333333333333322100000001344444333322222211000000000000000000000000112234556778899aaaaaaaaaaa99887765443221100000000000000000001223333444444333333222100000000124443333333333322211110000000000000000000001123344566677788888888887766554433211000000000000000000112233344445544433333222200000000001333333333333333322221111000000000000000000001122333444555555555555544433222110000000000000000001111223334443223333332222210000000000022222222233333332222221111100000000000000000001111122222233333332222221111100000000000000000011111222233331000012222221111000000000001111111111112222221111111110000000000000000000000000011111111111111100000000000000000000000011111111112220000000011111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}, CP_CROWD = {
  grid: [666, 134],
  top: 360,
  cell: 3,
  size: [2e3, 763],
  mask: "000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111110000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111100000000000000000000000000000000001111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111000000000000000000000000000000011111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111110000000000000000000000000000011111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000011111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111110000000000000000000000000011111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111000000000000000000000000111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111100000000000000000000001111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111100000000000000000000001111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111110000000000000000000000111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111000000000000000000000111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111000000000000000000000111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111100000000000000000001111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111100000000000000000001111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111000000000000001111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111110000000000000111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111000000000000011111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111100000000000111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111110000000000111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111110000000000111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111110000000000111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111110000000000011111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000011111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111110000000000000111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111111000000000000111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000011111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111100000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111100000000000111111111111111111111111111111111111111111111111100000000000000000000000000000000000000001111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111110000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111100000000000111111111111111111111111111111111111111111111111000000000000000000000000000000000000000111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111111110000000000011111111111111111111111111111111111111111111111000000000000000000000000000000000000001111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111100000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111111110000000000000111111111111111111111111111111111111111111111000000000000000000000000000000000000011111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111111110000000000000111111111111111111111111111111111111111111110000000000000000000000000000000000000011111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111100000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111110000000000000011111111111111111111111111111111111111111110000000000000000000000000000000000000111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111110000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111110000000000000001111111111111111111111111111111111111111110000000000000000000000000000000000000111111111111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111110000000000000000111111111111111111111111111111111111111110000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111111111100000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111111110000000000000000001111111111111111111111111111111111111100000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111100000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111111100000000000000000111111111111111111111111111111111111111100000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111100000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111111111100000000000000001111111111111111111111111111111111111111000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111100000000000000011111111111111111111111111111111111111110000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111100000000000000011111111111111111111111111111111111000000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111000000000000000111111111111111111111111111111111111000000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111100000000000000011111111111111111111111111111111111111100000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111000000000000001111111111111111111111111111111111111111110000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111100000000000011111111111111111111111111111111111111111111000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111000000000000111111111111111111111111111111111111111111111100000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111111000000000011111111111111111111111111111111111111111111111110000000000000000000000000000000000000000111111111111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111110000000001111111111111111111111111111111111111111111111111111100000000000000000011100000000000000000011111111111111111111111111111000000000000000000000000000000000000111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111100000000000000000000000000000000000000000111111111111111111111111111111111111111111111111111100000000011111111111111111111111111111111111111111111111111111110000000000000011111111000000000000000011111111111111111111111111111000000000000000000000000000000000001111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111110000000000111111111111111111111111111111111111111111111111111111110000000000000111111111110000000000000001111111111111111111111111111000000000000000000000000000000001111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111100000000000111111111111111111111111111111111111111111111111111111111100000000001111111111111000000000000000111111111111111111111111110000000000000000000000000000000011111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111110000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111000000000000111111111111111111111111111111111111111111111111111111111111100000011111111111111100000000000000011111111111111111111111110000000000000000000000000000000111111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111110000000000000000000000000000000000000000000011111111111111111111111111111111111111111111000000000000000111111111111111111111111111111111111111111111111111111111111111000011111111111111100000000000000011111111111111111111111110000000000000000000000000000000111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111111111111100000000000000000000000000000000000000000000011111111111111111111111111111111111111100000000000000000000111111111111111111111111111111111111111111111111111111111111111110001111111111111100000000000000011111111111111111111111100000000000000000000000000000000111111111111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111110000000000000000000000000000000000000000000000000000000000111111111111111111111111111000000000000000000000000000000000000000000000001111111111111111111111111111111111111110000000000000000000111111111111111111111111111111111111111111111111111111111111111111100001111111111100000000000000011111111111111111111111100000000000000000000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111110000000000000000000000000000000000000000000000000000000111111111111111111111111110000000000000000000000000000000000000000000000000001111111111111111111111111111111111111110000000000000011111111111111111111111111111111111111111111111111111111111111111111111100011111111110000000000000011111111111111111111111100000000000000000000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111000000000000000000000000000000000000000000000000000000111111111111111111111111110000000000000000001111111000000000000000000000000000000000111111111111111111111111111111111000000000000011111111111111111111111111111111111111111111111111111111111111111111111111000011111110000000000000011111111111111111111111000000000000000000000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111100000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000000111111111110000000000000000000000000000000111111111111111111111111111111111100000000000111111111111111111111111111111111111111111111111111111111111111111111111111110000111110000000000011111111111111111111111110000000000000000000000000000000000111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111110000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000001111111111111000000000000000000000000000000111111111111111111111111111111111110000000000111111111111111111111111111111111111111111111111111111111111111111111111111111111001110000000000111111111111111111111111100000000000000000000000000000000000111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111111111110000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000011111111111111100000000000000000000000000001111111111111111111111111111111111111000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000111111111111111111111110000000000000000000000000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111110000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000011111111111111100000000000000000000000000011111111111111111111111111111111111111100000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000011111111111111111111111111000000000000000000000000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111000000000000000000000000000000000000000000000000000011111111111111111111111100000000000000011111111111111100000000000000000000000000111111111111111111111111111111111111111110000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000111111111111111111111111111110000000000001111110000000000000001111111111111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111000000000000000000000000000000000000000000000000000001111111111111111111111100000000000000111111111111111100000000000111110000000001111111111111111111111111111111111111111111000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111100000111111111111111111111111111111111000000000011111111100000000000000111111111111111111111100000000000000000000000000111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111110000000000000000000000000000000000000000000000000000000000111111111111111111111000000000000111111111111111100000000011111111000000111111111111111111111111111111111111111111111100000111111111111111111111111111111111111111111111111111111111111111111111111111111111111100001111111111111111111111111111111111100000000111111111110000000000000111111111111111111111100000000000000000000000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111110000000000000000000000000000000000000000000000000000000000111111111111111111111100000000000111111111111111100000000111111111100001111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111111111111111111111111111111111111111111111111110011111111111111111111111111111111111110000000111111111110000000000000011111111111111111111000000000000000000000001111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111110000000000000000000000000000000011100000000000000000000000111111111111111111111110000000000111111111111111100000000111111111100011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110011111111111111111111111111111111111111000001111111111110000000000000001111111111111111111000000000000000000000011111111111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111000000000000000000000000000011111111100000000000000000001111111111111111111111111000000000111111111111111100000000111111111100011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111110000111111111110000000000000000111111111111111111000000000000000000000011111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111000000000000000000000000000111111111110000000000000000011111111111111111111111111100000000111111111111111100000000111111110011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111100011111111111000000000000000111111111111111111000000000000000000000011111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111111111111000000000000000000000000001111111111110000000000000000111111111111111111111111111111100000111111111111111100000000111111000111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111000111111111000000000000000111111111111111110000000000000000000000011111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011110000000000000000000000000011111111111111111111111000000000000000000000000001111111111111000000000000001111111111111111111111111111111110000111111111111111000000000011000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111000111111000000000000000111111111111111110000000000000000000000111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111100000000000000000000000011111111111111111111110000000000000000000000000011111111111111000000000000011111111111111111111111111111111111000011111111111110000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111001111000000000000011111111111111111100000000000000000000000111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111110000000000000000000000001111111111111111111100000000000000000000000000011111111111111000000000001111111111111111111111111111111111111110001111111111110000000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111110011000000000000111111111111111110000000000001110000000000111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111111000000000000000000000001111111111111111111100000000000011100000000000011111111111111000000000111111111111111111111111111111111111111111111111111111111000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000001111111111111111110000000000111111100000000111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111111100000000000000000000001111111111111111111100000000001111111000000000011111111111111000000011111111111111111111111111111111111111111111111111111111111000000111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000011111111111111111111000000001111111110000001111111111111111110000000000000000000111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111100000000000000000000001111111111111111111100000000011111111100000000011111111111111000011111111111111111111111111111111111111111111111111111111111111000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000111111111111111111111110000001111111110000001111111111111111110000000000000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111100000000000000000000000111111111111111111100000000111111111100000000011111111111110001111111111111111111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000011111111111111111111111111111000001111111110000001111111111111111110000000000000000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111100000000000000000000000011111111111111111000000000111111111100000000011111111111000111111111111111111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100111111111111111111111111111111000001111111110000001111111111111111110000000000000000111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111100000000000000000000000001111111111111111000000000111111111100000000011111111100111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111110000111111111000001111111111111111100000000000000000111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111111111111110000000011111100000000000111111111111111110000000111111111100000000011111110111111111111111111111111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100011111111000000111111111111111100000011000000000111111111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111100000000000000011111111111111110000000111111110000000001111111111111111111000001111111111110000000011111100111111111111111111111111111111111111111111111111111111111111111111100111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111101111110000000011111111111111000000111110000000111111111111000000000000011110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011111110000000000000111111111111111110000000111111110000000011111111111111111111111001111111111110000000001111101111111111111111111111111111111111111111111111111111111111111111111100111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111001110000000011111111111110000001111111000001111111111111100000000000111111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111111000000000000111111111111111110000000111111111000001111111111111111111111111101111111111100000000000111001111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100001100111111111111111000011111111000001111111111111100000000001111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111000000000000111111111111111110000000111111111000011111111111111111111111111110111111111000000000000111011111111111111111111111111111111111111111111111111111111111111111111001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111100011111111000001111111111111100000000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111000000011000111111111111111111000001111111110000111111111111111111111111111111111111111000001110001111011111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110011111111100000111111111111111110000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111111000000111100111111111111111111000001111111100011111111111111111111111111111111111111111100011111111110111111111111111111111111111111111111111111111111111111111111111111110011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111100000111111111111111111000011111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011110000000001111111111100001111110111111111111111110000000111110001111111111111111111111111111111111111111111110011111111110111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000100111111111111111111000011111111110000000011111000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111000000001111111111100001111111001111111111111100000001111000111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110010001111111111111111111111000011111111110000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111000000001111111111100001111110001111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110011111111111111111111111000011111111110000000111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111000000001111111111100011111110011111111111111111111110011111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101111111111111110001111111100000011000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001111111000011111111111111100011111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110001111111100000111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000011110000011111111100111111111111111110011111111111111111111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110001111111110111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111000011111111100111111111111111111111001111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110001111111111111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111111000111111111100111111111111111111111111111111111111111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110111111111111001111110000111000000000000000000000000000000000000000000000000000000000000000000000000000000111000111111001111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111001111100000000000000000000000000000000000000000000000000000000000000000000000000001111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101111111111111111111000000000000000000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100000000000000000000000000000000000000000000000000000000000000000010001111111111111110111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111100100000000000000000000000000000000000000000000000000000000000000111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111101110000000000000000000000000000000000000000000000000000000001111111111111101111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111000000000000000000000000000000000000000000000000000000011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111011111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110000000000000000000000000000000000000000000000000000000001111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111110",
  tone: "00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gmlhdjg30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007jlniggdetyyyxwtuqomla00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006msvyvzzzzzzzzzzzyuncfpj00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000affkuzzzzzzzzzzzzzzzrojitpkkj0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ehjrtwzzzzzzzzzzzzzzzzzzzwvzzzxtl00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000kxuzzzzzzzzzzzzzzzzzzzzzzzzzzzzzum92000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000rzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzsiggb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzytqrg70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000hyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvujf0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006cozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzspj0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ehpzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzul0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006mszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvqg000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000juzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzsrb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005uzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzta000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000kyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzr800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005pzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwi0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001gvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvj000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cuzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzpjc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004bhmorokggjkid50000000000000000000000000000000000004rzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzn5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003cinsuwxzzzzzzxywrlb0000000000000000000000000000000000kzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwk000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bkpsvxyzzzzzzzzzzzzzyupd0000000000000000000000000000000cvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvi3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cmuzzzzzzzzzzzzzzzzzzzzzyvo600000000000000000000000000000jzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzse400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007hotxzzzzzzzzzzzzzzzzzzzzzzzzuh0000000000000000000000000000jzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzztod5000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005afkpvzzzzzzzzzzzzzzzzzzzzzzzzzzyr400000000000000000000000000czzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxfh50000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000036aiqxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzu60000000000000000000000001lzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzr000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003diowzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzw400000000000000000000002dzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzp00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007flsvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzt00000000000000000000002mzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywmf000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003fpyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzl0000000000000000000000ozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzofi00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003iqvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzy8000000000000000000000lzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwc200000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001hpxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzs000000000000000000000pszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzs000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000blwwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzb0000000000000000000bpvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzm000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008drwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzo0000000000000000000fvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxm00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000elryzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyeed9300000000000000dmzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwq30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000epruzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzypjca500000000000007rzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzub0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dntxxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzuma60000000000000lzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvh00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009ntyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyuea000000000001rzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwl0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007entyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxm50000000000btzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwm0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009lpvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyh0000000000brzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvl0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000099puvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzm00000000004lyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvg00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gdjuyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzl000000000005lxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzytb000000000000000000000000000000000000000000007efkmnlg9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001lljrxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzze0000000000000gzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwzzzwp00000000000000000000000000000000000000000000sxzzzzzzyvpg4000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001mpntwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzp5000000000000nzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyui0000000000000000000000000000000000000000004pzzzzzzzzzzwtnf70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bipsuuuuncf6000000000000000000000000000000000000000000000000gpqqzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzu600000000000lwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxs800000000000000000000000000000000000000009ksxzzzzzzzzzzzzxvsl80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008hnrvzzzzzzzyxn000000000000000000000000000000000000000000000003mrrvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzq00000000000cnzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxtn000000000000000000000000000000000000000brwzzzzzzzzzzzzzzzzzzwqa000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dmuyzzzzzzzzzzzzui00000000000000000000000000000000000000000000000ksrvzzvtzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzw5000000000005fozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxsh00000000000000000000000000000000000000hxzzzzzzzzzzzzzzzzzzzzztc70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cnwzzzzzzzzzzzzzzztd0000000000000000000000000000000000000000000000mvvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzv700000000000001zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxr70000000000000000000000000000000000000byzzzzzzzzzzzzzzzzzzzzzzzj100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000aktzzzzzzzzzzzzzzzzzzwnf00000000000000000000000000000000000000000000pyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzy900000000000004yzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxo00000000000000000000000000000000000000wzzzzzzzzzzzzzzzzzzzzzzzztb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cmwzzzzzzzzzzzzzzzzzzzzzxt000000000000000000000000000000000000000000buzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzza00000000000000pzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwi0000000000000000000000000000000000000bzzzzzzzzzzzzzzzzzzzzzzzzzykd00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002gpwzzzzzzzzzzzzzzzzzzzzzzzzv00000000000000000000000000000000000000000ivzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzy8000000000000000jrzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzua0000000000000000000000000000000000000pzzzzzzzzzzzzzzzzzzzzzzzzzzpl00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005hvzzzzzzzzzzzzzzzzzzzzzzzzzzo0000000000000000000000000000000000000000mwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzl700000000000000005fuxzzzzzzzzzzzzzzzzzzzzzzzzzzzzxwzzzzyr20000000000000000000000000000000000000szzzzzzzzzzzzzzzzzzzzzzzzzzto40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000pzyzzzzzzzzzzzzzzzzzzzzzzzzzz4000000000000000000000000000000000000003pxzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzf10000000000000000004hzzzzzzzzzzzzzzzzzzzzzzzzzzzzuryzzxvo00000000000000000000000000000000000000tzzzzzzzzzzzzzzzzzzzzzzzzzzun7000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bwzxzzzzzzzzzzzzzzzzzzzzzzzzzzl000000000000000000000000000000000000005pyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzza000000000000000007qzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzrkxxvurh00000000000000000000000000000000000000rzzzzzzzzzzzzzzzzzzzzzzzzzzuk8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000mzzzzzzzzzzzzzzzzzzzzzzzzzzzzzp000000000000000000000000000000000000003pxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzx90000000000000000awzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmexvspi000000000000000000000000000000000000000pzzzzzzzzzzzzzzzzzzzzzzzzzzuj8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005uzzzzzzzzzzzzzzzzzzzzzzzzzzzzzo000000000000000000000000000000000000000mvyzzzzzszzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxua0000000000000001szzzzzzzzzzzzzzzzzzzzzzzzzzzzzxwxfbtnf30000000000000000000000000000000000000000lzzzzzzzzzzzzzzzzzzzzzzzzzzvmf00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzh000000000000000000000000000000000000000jsxyzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwg5000000000000000oyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzsg5000000000000000000000000000000000000000000000fzzzzzzzzzzzzzzzzzzzzzzzzzzyvi00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzh000000000000000000000000000000000000000erwwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxj2000000000000000nyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzr70000000000000000000000000000000000000000000008zzzzzzzzzzzzzzzzzzzzzzzzzzvyf00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000guyzzzzzzzzzzzzzzzzzzzzzzzzzzzyd0000000000000000000000000000000000000006pvwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzztc0000000000000000nzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzug00000000000000000000000000000000000000000000izzzzzzzzzzzzzzzzzzzzzzzzzzsxb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fuzzzzzzzzzzzzzzzzzzzzzzzzzzzzx00000000000000000000000000000000000000000ktvwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyna00000000000000bpvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxtl0000000000000000000000000000000000000000000txzzzzzzzzzzzzzzzzzzzzzzzzzxye00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000cwzzzzzzzzzzzzzzzzzzzzzzzzzzzzt00000000000000000000000000000000000000000cquwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxlca2000000000000nyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxupld000000000000000000000000000000000000000000vyzzzzzzzzzzzzzzzzzzzzzzzzwxwk000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007xuzzzzzzzzzzzzzzzzzzzzzzzzzzzn000000000000000000000000000000000000000001msvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzlkb0000000000008txzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwqf500000000000000000000000000000000000000000ryzzzzzzzzzzzzzzzzzzzzzzzzuvtl000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000tpzzzzzzzzzzzzzzzzzzzzzzzzzzzq000000000000000000000000000000000000000000hpvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzrh500000000002eqwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzuh0000000000000000000000000000000000000000fzzzzzzzzzzzzzzzzzzzzzzzzzywtm000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003uwzzzzzzzzzzzzzzzzzzzzzzzzzzzz500000000000000000000000000000000000000000bpvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzp63000000000alswzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxh000000000000000000662000000000000000000txzzzzzzzzzzzzzzzzzzzzzzzyvtk000000000000000000000000000000000000dlqstttvrf0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000dxvzzzzzzzzzzzzzzzzzzzzzzzzzzzz6000000000000000000000000000000000000000004owzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxh1000000000ptwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwqkg9000000000000001eikhfc500000000000000006sxzzzzzzzzzzzzzzzzzzzzzzzrre00000000000000000000000000000000000ouyzzzzzzzwo800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gwvzzzzzzzzzzzzzzzzzzzzzzzzzzzy0000000000000000000000000000000000000000000nvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwd0000000000uxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwrj70000000000000eiklljihfa30000000000000002szzzzzzzzzzzzzzzzzzzzzzzsp3000000000000000000000000000000003fmuxzzzzzzzzzzth0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000euxzzzzzzzzzzzzzzzzzzzzzzzzzzzo0000000000000000000000000000000000000000000juxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzvmnyzs900000000000yzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvqlb0000000000eikkllllkjig90000000000000003yzzzzzzzzzzzzzzzzzzzzzxtk00000000000000000000000000000000eqvxzzzzzzzzzzzzyqd0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009rtwzzzzzzzzzzzzzzzzzzzzzzzzzy00000000000000000000000000000000000000000000drvyzzzzzyyzzzzzzzzzzzzzzzzzzzzzzzzzzzfda57nrl8000000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxurla0000001fhkkllllllljic000000000000000wzzzzzzzzzzzzzzzzzzzzzwqe00000000000000000000000000000001rwzzzzzzzzzzzzzzzvm0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000pnxzzzzzzzzzzzzzzzzzzzzzzzzzi000000000000000000000000000000000000000000009otvxzzzzxwzzzzzzzzzzzzzzzzzzzzzzzzzzz4169a4000000000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzytn900004egjklmmmlmllje000000000000000szzzzzzzzzzzzzzzzzzyzzvq70000000000000000000000000000000jvzzzzzzzzzzzzzzzzztd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000moxzzzzzzzzzzzzzzzzzzzzzzzzr0000000000000000000000000000000000000000000000krtwxyyzwqwzzzzzzzzzzzzzzzzzzzzzzzzzz500000000000000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxuoh30001djkmmmmllllid000000000000000nzzzzzzzzzzzzzzzzzzvxxuq00000000000000000000000000000000rxzzzzzzzzzzzzzzzzzyo0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009glpssn20000000000000000000000000000000000000000000000000000000000irxzzzzzzzzzzzzzzzzzzzzzzzg000000000000000000000000000000000000000000000006jqttuvxvkrxzzzzzzzzzzzzzzzzzzzzzzzzzpa0000000000000000000zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxuog70000fmmmlkklkgd000000000000000lyzzzzzzzzzzzzzzzzyswxup00000000000000000000000000000005uzzzzzzzzzzzzzzzzzzzvd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gqwyzzzzzthd10000000000000000000000000000000000000000000000000000000crxzzzzzzzzzzzzzzzzzzzzzzl000000000000000000000000000000000000000000000000000269bdhaluyzyzzzzzzzzzzzzzzzzzzzzzzzzxo7000000000000007fzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywtqj80008hiiijigg100000000000000nyzzzzzzzzzzzzzzzzxpwyui00000000000000000000000000000005vzzzzzzzzzzzzzzzzzzzxk0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000epxzzzzzzzzxsqj80000000000000000000000000000000000000000000000000000005ovzzzzzzzzzzzzzzzzzzzzzz40000000000000000002ejlljb000000000000000000000000000000000fssotzzzzzzzzzzzzzzzzzzzzzzzzzzzk0000000000000aizzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwsla00009gijji900000000000000syzzzzzzzzzzzzzzzzwmwvr000000000000000000000000000000000uzzzzzzzzzzzzzzzzzzzxk000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000iqwzzzzzzzzzzyyxuj000000000000000000000000000000000000000000000000000000luyzxzzzzzzzzzzzzzzzzzzx000000000000000005ejmoponnke00000000000000000000000000000007cjwzzzzzzzzzzzzzzzzzzzzzzzzzzzzzk000000000002fkzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxskb00005gkjb000000000007ntyzzzzzzzzzzzzzzzzzwitr0000000000000000000000000000000000tzzzzzzzzzzzzzzzzzzzwh000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003ityzzzzzzzzzzzzzzxd00000000000000000000000000000000000000000000000000000ktxxuzzzzzzzzzzzzzzzzzzs0000000000000000agjlnppqpponi0000000000000000000000000000003nzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz900000000009ilzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwtpjd5001ga00000000009vyzzzzzzzzzzzzzzzzzxsqa800000000000000000000000000000000000rzzzzzzzzzzzzzzzzzzzte00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000iswzzzzzzzzzzzzzzzzt00000000000000000000000000000000000000000000000000000jswwszzzzzzzzzzzzzzzzzyn0000000000000009fjmnpqqqqqpol800000000000000000000000000007ozzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzu100000000cfklzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxspf0000000000000rxzzzzzzzzzzzzzzzzzzzxn000000000000000000000000000000000000auzzzzzzzzzzzzzzzzzzzp70000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000drvzzzzzzzzzzzzzzzzzx00000000000000000000000000000000000000000000000000000hrtvnvzzzzzzzzzzzzzzzzyn000000000000000bilooqrrrrqqole000000000000000000000000000eqxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzys40000000efklzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxo500000000005qvzzzzzzzzzzzzzzzzzzzzzwm00000000000000000000000000000000000guyzzzzzzzzzzzzzzzzzyt80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000muyzzzzzzzzzzzzzzzzzy600000000000000000000000000000000000000000000000000008qsthryzzzzzzzzzzzzzzzzq000000000000000eknpprssssrqpmi00000000000000000000000000ipuxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxl000000cfjkzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzytj000000000lvxzzzzzzzzzzzzzzzzzzzzzyvrk10000000000004ceff90000000000000009txzzzzzzzzzzzzzzzzzvrc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000rwzzzzzzzzzzzzzzzzzzy500000000000000000000000000000000000000000000000000000coqalvzzzzzzzzzzzzzzzzt000000000000001floprrssssrrpol0000000000028cc7000000000iptxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzs000006cilzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwq80000025gvyzzzzzzzzzzzzzzzzzzzzzzzxvrk30000000000dghiiiig800000000000000swzzzzzzzzzzzzzzzzztpb00000000000000000000000000hlkkja00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005swzzzzzzzzzzzzzzzzzzx0000000000000000000000000000000000000000000000000000000000fqruzzzzzzzzzzzzzzzui0000000000004glopqrsssssrrpl0000000003aehiihe0000004luzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxf00000eklzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyuk00003cnrvxzzzzzzzzzzzzzzzzzzzzzzzzzzytg00000000dhhiiiiiig70000000000000juxzzzzzzzzzzzzzzzzto50000000000000000000000002otvvvvtna000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002puxzzzzzzzzzzzzzzzzzv00000000000000000000000000000000000000000000000000000000001evzzzzzzzzzzzzzzzzzwu000000000009imoppqrrssssrqf0000000019eghhhhgc0000fqtvzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxoa000hklzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxr9005jqtwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzvnc0000000hhhhiijiihc00000000000000nuyzzzzzzzzzzzzzzzum000000000000000000000009nuxxyyyyxvpe00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000jsyzzzzzzzzzzzzzzzzys000000000000000000000000000000007c900000000000000000000000mzzzzzzzzzzzzzzzzzzzzxs0000000000cllmoppqrrrrsrqm000000003bfhhhhgge00057dlquxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxuogchkkzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzuk00gruwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxsi2000005ghhiijjjihf000000000000000dvxzzzzzzzzzzzzzzvm0000000000000000000000bpvyzzzzzzzyvrj0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gxyzzzzzzzzzzzzzzzzxtb00000000000000000000000000006dilmmke20000000000000000000oyzzzzzzzzzzzzzzzzzzzzyvh000000000clllmnpqqrrrsrpn000000004cfhhhggfb000ajpsvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywvtpllzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvq707swyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyun90000eghijjkkkjf0000000000000000svyzzzzzzzzzzzyxvh0000000000000000000000orxzzzzzzzzzxvqb00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000blwzzzzzzzzzzzzzzzzzxum000000000000000000000000000fkmnoponli600000000000000000hsyzzzzzzzzzzzzzzzzzzzzzxti00000000bjkkmnpqqqqqqonk000000009eghhgf4005fmruwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxvqzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwtj00rvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwqd000agijkllljf4000000000000000quyzzzzzzzzzzyuut70000000000000000000000prvzzzzzzzzzzwtk00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fovzzzzzzzzzzzzzzzzzwvj000000000000000000000000009jmoqqqqqomh0000000000000000gryzzzzzzzzzzzzzzzzzzzzzzzxul5100000ahhjmnppppppnmlc000000009effd1000diotxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvp70mvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyund0004hkjjihfa000000000000000puxzzzzzzzzzzumrp00000000000000000000000quwxzzzzzzzzzwso00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bhi600000000000000000000000000bouyzzzzzzzzzzzzzzzxwv300000000000000000000000000eknpqrrrqqok300000000000000houzzzzzzzzzzzzzzzzzzzzzzzzywutl900007egjlnoppponlk80000000000a40000bjosvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxti09wyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywtoh60009fggga000000000000000ptxzzzzzzzzzyqgoi00000000000000000000003svxzzzzzzzzzzwtr000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000fnrtusl80000000000000000000000002mtyyzzzzzzzzzzzzzzxxm000000000000000000000000006hlnpqrrqqqqn80000000000000bkrvyzzzzzzzzzzzzzzzzzzzzzzzzzyxvqg00008filnnopoonkh000000000000004dlqtwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywp50wyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywsmf1001egb00000000000009nuwzzzzzzzzzwumaa000000000000000000000005uwyzzzzzzzzzzyuq00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ipruvwwusn000000000000000000000000krvwyzzzzzzzzzzzzzzv000000000000000000000000000aiknpqqrqqqqo6000000000005jquwyzzzzzzzzzzzzzzzzzzzzzzzzzzzyxwun90007gjlnoooomkf000000000000aiosuwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxsg0syzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyxtod0039000000000000mtvyyzzzzzzzzzvlb0000000000006710000000000huxyzzzzzzzzzzzwo0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000jrttuwxxwwup00000000000000000000000epstwzzzzzzzzzzzzzzm000000000000131000000000000cilnpqqqqqqqob0000000005fntxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxvtog34eilmnnnnmkj8000000005fnruwxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyum4kzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxrf000000000000bsvxyzzzzzzzzzzxuj0000000000fjiigc300000000quxyzzzzzzzzzzzwq000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000hruvvxxyxxxwta00000000000000000000009nqrvyzzzzzzzzzzzyzl00000000008bdffe90000000000ekloppqqqqppmg0000000ainquxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxwuspmjjkkmnnnnnle000000akqtvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvqdazzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvn80000000000irwyzzzzzzzzzzzzyung00000000gjjjjigd40000003ruwyzzzzzzzzzzyup0000000000000000000aknome00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006pwxxxyyyyxxwtj00000000000000000000005lootwzzzzzzzzzzyxxk0000000009fhiijiib000000000emnoopqqqpnljd00003fmqsuwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxwvusnjloooonng0000amsuxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvpj6zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxqg000000000equxzzzzzzzzzzzzzzzxsl0000000hjjjjihfa000000cruwyzzzzzzzzzyvrm000000000000000000fmprrrql000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000etxzzyzzzyyxwtm00000000000000000000000koktwzzzzzzzzzzxwud000000006eikkkkkjg000000000dmnnooppnmlib0005iprtvxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyxwurqpnon9008fmrvxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyri6vzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzytk0000238hnqtwxyzzzzzzzzzzzzzzzyvre00000eghhiihfd000000isuwyzzzzzzzzwtrph00000000000000000floqssttsl00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000huyzzzzzzzzywto000000000000000000000000nhquxzzzzzzzzywuo000000000afijkkkkif000000000bklmnoonkh60008hprtvwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxvusoj00douwwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvg9izzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvn9002ajoqtuwyyzzzzzzzzzzzzzzzzyxrh00000aeghiiihg000000lsvwxyzzzzzzxvsoob00000000000000009moqsuuuttqe0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ktxyzzzzzzzzwur00000000000000000000000008ossvyzzzzzzywui000000000afgijkjigd000000000bjjkmnni0004ipsuvxxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxvtr108ksxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzyzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwlb8zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxsh04hnqsuwxxzzzzzzzzzzzzzzzzzzzzxtma0000dgiiiiih200000gqtvxxyzzzzzxvrnm00000000000000000jprrtuuuttqk0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ltwyzzzzzzzzxvs40000000029cdd800000000000fnuxyzzzzzzzxwuq60000000afghjjjhfc000000000ehhiklh03gpuwxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxwul00cluxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzyxzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwnf4uzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvo64ortuwxyyzzzzzzzzzzzzzzzzzzzzzxuqj8000dhiiihe4000000kqtwxyzzzyyxvrnl00000033000000000mrrtuvvutsqm000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003eif6000000000000000msvwyyzzzzzzyvte00000008effgfe9000000000bsxzzzzzzzzzzzwvut6000006bfgijjjhfd600000000egghii00dowzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyywt006iswzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyzzzzzyyzzzyzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvpi8hxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzysg0oruwxxyzzzzzzzzzzzzzzzzzzzzzzzxvuqnh401chgf900000000ltvxxyzyxwwvqk000000bccb80000000nrsuuvvvutqm000000000000019b300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000jopqqok00000000000002otuwyyzzzzzzxvtk0000000dgggggfd00000000ervyzzzzzzzzzzzzzxvtf42006cfghiiihhf00000000009fggb06lsxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxxwvl00cpuyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywyzzzzyyyzyyzzzzzyzzyzzzzzzyzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywrmf7wyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyum1jtvxxyzzyzzzzzzzzzzzzzzzzzzzzzzzxwvtqk9005c500000000iuwxxyyyxwvsj0000009deffea00000elpstuvuvusqm700000000000fjkjgc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000jprrrsqog000000000000bpstvxyzzzzzywuto0000000dghhhgfd8000002lsvyzzzzzzzzzzzzzzzyvtg3103aefhhiiih900000000000aee00fpuxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxvv306kswyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzxyxzyyyxzzxyzyzzyzyyzzzzzyyyzyyyzzyyzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyqnk6sxyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvq9ctwxxyzzzzzzzzzzzzzzzzzzzzzzzzzzzyyxwuspi8200001100lsvxyyyxxxwwuqc00004cfghhge00000dinqsuuvvusqoc0000000000giklkgfc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000coqqqrrqnj000000000000gqstvxyzzzzzyvtuq0000000cfghhgfc600003jruvwzzzzzzzzzzzzzzzyxvpjc202ceghiiie0000000000008ed08mswzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxvr00cpvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyxyywvzxwxxvxwyzxxyxxxwwzyxyxyyxxyxyyyyzyyyyyzzyzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwsno8hwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzvtg6twxyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywwvts9014559iqtvwxyyxxxxwvrob0009fghhhgf000009hmprstuutrqqc0000000003gjklkihf6000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000goqqrsrqnk000000036000iqttvxyzzzzyxvuvt3000005cffghgec00004houvvxzzzzzzzzzzzzzzzzxvtspld7beghijjd000001110009fh80iqvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzywve01krvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyywwwuuxwxxwwwvyyyxyvvvtwyyyxwvvxvwwxyxyyyyxwxzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxuqre4vxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwul3qvxyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyxtk2999dloruwxxyzzzzyyxvuob007eggggfe800000jmprsttttrqrg9bb8000005hklmmlljc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gnpqssrqol000000ceee00jrttwxxyzzzywusvt5000004cdeeffa0000emqtvxxyzzzzzzzzzzzzzzzzywwwusrolfeijjhe7000245533aefh05mtwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzywwv00bptwyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzzyyyzzyzyvxutvvuuvvuwuvxxwxwuuvtvvxwuwvvwvvwyxxxxxxxwzzyzzzzzzzzyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzyvstl7qxyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwuo6ivvxyzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxum95aeimpruwwxyzyyxxxvutpj8019efffed600000knprstttsqppeccb940000cjlmnnnnld000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009dec000000000hopqssrrqpd00009cdeec07prswxxxyyywwtrtj0000000cccb50004fmprtvwyyzzzzzzzzzzzzzzzzzyyxwwwvvuslgedca860035656dffge0dptvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyyyywwq02jpsvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzxzzzzzyyyyxxxzyzyuutttuvuuustvtuuvyvuuvvwuwwuvvwvuuwuwwvwxvwxzyxyzzzzzzzxxwyzzzzzzzzzzzzzzzzzzzzzzzzzzywupnjmxyyzzzzzzzzzzzzzzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwvqdcuuvxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyxuod7lnopqsuwwxyyyyxxxwvusrpja207dee9000200blprrssrqqmd9abb940000ilnnnnnmkh00000000beec9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000eghhgd00000000ioqrsstssqi00008cdddc100kqvxxyyyyywusk00000006da2000ainqsuuvwxzzzzzzzzzzzzzzzzzzzzzzzyyyxxwuqngc97640247bfhhgg70gptvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyyzzxyyxyyyyyxwxyxwh0bmqtwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzyzxxyyywxyxwwxwwxxyxxtustuttttusrtqttttstutttsvvtuvvttvwuvuqtwvxxxxxxyyzyzyyxxxxzzzzzzzzzzzyzzzzzzzzzzzzyzyvuopmiuwxxxyzzzzzzzzzzyzyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzwth7suwwyyyyyzzyzzzzzzzzzzzzzzzzzzzzzzzzzzzyuqi7jnpqrtuwwxxxyyyxxxwvwvutsof300600054339koppqqqone38aaa860000jmnnnnmmjg0000000ehiihe40000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000hiijigf00000000joqrssrrsqa0000acddcb000ervxxyyyyxwuuo401111012218glpstvvwwxxxyzzzzzzzzzzzzzzzzzzzzzzzzzyxxxvsqph87637cghhiiih11jqtvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzyzyzywxxwxxyyyyxxxwv60fnruwxzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzyyzzzzxyyzzzzzzzzyyxvxxwvwvxuwwwwwvuxvuttusrustsrrrprrrsrrtsstuuwwvttstuttvttsvwvvwxwxxyyzyvxxywxyyyzzzzxyzywyzzzzzzzzzzzzzywupoohpuxwvwxyyyxyzyyyxyyzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzyuk7nuvvxxyyyyzyyzyyyzyzzzzzzzzzzzzzzzzzzzzywtmchoprtuuwwwwxwxxxxxxxxwwwvuqmf81004876blnoppppqpnh47aaba900009klmnnmkhe0000000hiiihg80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000jijjjhe00000000koqqrrrqpj00001ceedcb006kqvxxxyzyyxvurj94334300jpqrsuvwvvxxxyyxzzzzzzzzzzzzzzzzzzzzzzzzzzzxxwutrmdbcdfghhiijjh08lqtuyzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzzzzzzzyzzyyyxxxyxwwwwxxwwwwwvvus09kpsuwxyzzzzzzzzzzzzzzzzzzzzyyzzzzzzzzzzzzyzyyyxxxxyxxyyxyzzzzzywxvwwwvuvvwutvtttusuuussusrtqqrqqprppopqqtqssuuvvutusuvttustttuuttuvvuyxwuwwwxwwxxyyzzyxxwxwwyzzzzzzzzzzzyxxvropjksvuutvwwwxxxxwwwxwyyzzzzyzzzzzzzzzzzzzzzzzzzzzzzzxtkektuvxxxxxxwwwyyxyzzzzzzzzzzzzzzzzzzzzzzyvtoiepqstuuvvwwwwwxxyxxyyyxxwvtrpnmk869acjnnpoppopponhbabbb810353gjkmnmlea7770007hiiihga0000008700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000gijjjig00003885bjpqqqqpl630003deefd91blotwxxxwxyxxwvtqlb76760botuuvvwxxxxxyyyzzzzzzzzzzzzzzzzzzzzzzzzzzyyyxxwvspjhhghhhhhiije0dmqtvyzzzzzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzyyyxzyyxxwwxvvuuuvvvvvvutsrm0dkqtuwxyyyzzzzzzzzzzzzzzzzyyzzzzzzzzyyzzwxxxwxxvwvuxwwvwwxxyxxywtwwuuuttusttrtsssssstqppqnppkoopqqqqpnoolpqrsutwtsstrsrrqrrrsrstssssstwyyxwuvwwvvvvvxyxvzxwuwwxxxxyyyxyzzyxxvspqlgpttsuuuuuvvwxvwwxvxyyyyyzzzzzzzzzzzzzzzzzzzzzzzzyvskfhrtvwwwvvwvvvvwxwxxyzyzzzyzzzzzzzzzzzzzywtqmepqstuuvvvvwwwwxxxxxyyxxxwvvtturk7cgikmopppppqqpnlgb9aa621567fjkmnnmca998000dgiiihge00000eeeb0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007abb000004gijkkkjb001aa9918loqpooj532006cdc748hmpqtvwxxxxxxxvutrolgc810jruvvvwxxxxyyyzzzzzyzzzzzzzzzzzzzzzzyzyzyyyyxxxxvtqnjiihhhhhhjj71gnquwxzzzzzzzzzzzzzzzzzzzzzzzzyzzzzzywwxxyxxyxwwwvvvvuttuutuuuttssrf3gmqtuvxvzzyzyzzyzzzzzzzzyyyyzyzxyyyxxvywxwyxvwwvuutuuuwvuvwvwvvvtuututrtttutqtrqrqqqqnlnnllnmnnnoononlnnmopqrrrsrrprpqqoppoqqppprrrsttvvzywtrsusuuuuwwuvwvvwwwwwwwvvvwwwxxwuurppmgmrsstutstutvuuvvvvvtwxxyyyyyyxzxzzyyzzyyzyzyzzyxwusnigptuuuuuuuuuuvvvwwwxyyxxxyyzzzyyyyzzyyyywuroelqqsttttuvvvvwxxxxxxxxxxxwwwvvtncfhikmnopppppqqponkf9545468dhjmnnnnib9870008fhiiihg1010adedb800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006abcba00006gjkkkkkc003789729knppppmf641241007gmoqrsuvwwwwwwwvuutsqomjf09mrtvvvxxxyyxxxxxyyzyyyxyxyyzyzyyzzzzyzyyxyxxxxwwutrpljiihhhhhhg09kpsuwxzyyzzzzzzzzzzzzyzzzzzyxxwywxxyxwwwwxwwwuuuutuutttsssrssssrqro67glpruvxwwxxxyzyyxyyyzzyzyxyyzyxwwxvwvuvttwxsvuwutuusstvrstutssssptssoorqqrrrprroqpopqkjjmllkjllkmoonlllmknmpqrpnopnooomnnmlnoponopoqqrsrwxusrstqrstttvuuuuuuuuvvvvuuutvvvvtssrommgjpqrrsssssrtttvvuvutuvtvuuwwwyyxwyxxxwxwwxxwyyvwvtsomllsssssssttttttuwwvvwvwwxxxxxxyxxxxyxxxxvuspggqqstttttuuuvvxwwwwwwwxxxwwwwvuqheiklmnoooppqqqqqponkgb669ehjmnnnnmlf7530004egiiihf4011aeddb800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006cdcca00006gjlkkki60026676aimnpppqole84135bhkmprrrtuvwwwwwwvvuttsrqpmi0gostuuvxxxxxxxxxwyyyxxyyyxyyyyxxyzyzyyxxwvwwvvvvvutrpmjjiihhgfeb2gmqsuvwyyxyyxyzzzzzzyxyyxxxxyxwwxwwwwvvuuuuuuuuuutttrtrqrrrqqqqqpppl1ahlppqtvwwxxxxxxyxxwxyxwwwwwwwxwvvwwttuttssusssttsqtsrqrqrrsrqpopopopppqnmpppmoponnnknhighghjijhjlmnkkkkkkmmlkljkjllkmolmlllllnommlmoprrssrpqrsrprsttsttutstsprstttttstvvussqppnllgfoqqpqqqqqqrqrrssttuuvuuuuuvvwwwwyxwwwwvwuutuvvwustromhpqqrqrqqrsstuvvvuuvuvvwvvvwwwwxwxxxwxwvutpicpqstttttttuuvwwvvwvvwxxxxxxxvurlekllmooooqqqqqqqqpoonllcfhjjlmmmmljh9300147ehiiifa75009cddc900005770000000000000000000000000000000000000000000000000000000000000000000000000000008aa000adddda00233bikkjj92103533bgjnoppqqomjg57lnnpqqqrsstuuvwwwvvvuttssrqqog6lqsttuwvvwwxxwxxvxxxxxxxxxwwwxyxxyyyxxwwvuvwuuuuutsrqmjiihhgffe78hnrttvwxwwwwwwyzzzzyyxwxxwwwwvvwvttuvtuutttssssrrrrrrrqqpqpoppoopnmi0bglnprtuvtuwvvwxywwwvuuuuuvuuuuvututtsssrrqormprqrrrpppooppooonnnnonpqqnmnpnmlnmlmmklmhgfdghihiggjjjjihgghhjhhiiilmjklmlnllmkkkmmmmklopppoqpooppnlstsrsrsrsrspqrsstrqqstssrqqrnmkhfcknpppqqqpoppmpqqrstrrruuttutvvuvwwvwwvvtutstttsurttonhmopqpppqqrsssuvuttttutuuuuvwwwwwwwwwwvvvtqlanqssssssssttuvuuuvvwvwwxxwwvutrphkmmmnooppppqrrrrrppppoieiijklmlmlkjhd7226dghhhhf965007bccb9200179aa000000000000000000000000000000000000000000000000000000000000000000000000000058ab506eeeedc202316gijiic431116diklnoppqonlig5iorrrrrrsttuuuvwvtuuutstsrrqppceoqsttuuuuuvvvwxxxxxwwwxxwxwwxxwwxxyxwvuvvutvuuuuutrpomjihhhgffe28inqrruuvuuwwvwxywyxxwxxxwwvvvuuvvtttsstsssssrqrqprqrqqqqoponmnnmnmmd09hlorssssrqutuuuwvvvutsstsrqrrrssssrrqpppnmoppqpqoqqqomnmlkjkkjkkjkinmmklnnmkkmhjjliljeedceedffffghiihihghgigghffijijkkjlkkkhjjkljkjijlmomonnmmllnprpoqoonpnqmpqqprqqoqrqrponomljhebflmnoonmooonmnopqsrsrqrrqrrustvvuuuuutsrrpqpsrstqtspmhinnnooppppqsssssstsrsttssuuvvuvvwvvuvvvutrmfjqrrsrrrrrrrsttuutvwvwwwvuvutsrpjjnmmnnoopoppprrrqpppqolfiijjlllllkkjhfec9eggghhgb54006abb85120699ba64687000000000000000000000000000000000000000000000000000000000000000000000005899416ceeeeb11323cghiihg9139hklmmmnnnnonnlje9nprssstsstutuvuutssssssrrpqqon8kprsstuutttuvvxxxwwvuvvvvxvvvvxwwxxwvuusttttuutttsrrpomjhihgggfc4ejnprqrrtttuuuvwwuxxvuvvvuwutwtsutrrstrssrrqppoopppppooonmlmmmlkjkkh52dhkopqqpqpnpqrtquttsrqqrrrqrrpppqrrpoolnmkknnnomnmnmnlkjjiihkjjkkjiiijkijjkhgjjhhjkhjkcdcaeeedcbabcegfeebcccdeeeadeegjighiiihhihlihgiikhjkmlmjkjimmmllmjklnlnmlmnnonnnooonnnnomjjifabhkkljmlmllllmnnmoppqqqqppppqrtustsrrrrqrrqqprqrqrsolifkllmnoooopqqqqrrrrqqqrsrsstuttuvuuuuuutsqpmipqqqrpqqpqrsssssstuuwwvutttssrplhmmlnnnopnoppppqqppppnlggjjjkkjlllkkkjihddfgggggda5228abba534369aaa658864000000000000000000000000000000000000000000000000000000000000000000300068886359eeedb51029fhhiige5ejlmmmmnnnonnnnnlkbfnqrsrrsrrsrsutsssssrrrqpqooonh9lqrrssststuuvvvwvuutuuuutvvuuvvuvwvvuusssttstsstsrppomkhfhgggggbeikmnqrrqrssttstvutuvuuvuuvuuttsrqrqprsqqpqrpnnnmoonnnmmonnllkkljihgb43dhknnopoppopppsssqqprqqpqnooqomnkmmllkkmkhjmjlmllmkjkihhhhiiihhgifhihikgiihgghhgfihgfhbbbcbbaaa9abdeedbbbcccccccdefgeggfeffgfedeedfgehhhgikiiihiijjjhhikkikjlkmmnnmolnlmkkkkkmkkhffbaghijjjjijjkjllmnmnoponnoopnpqoqqrqppmpnrrrqopooooomjhdikklmnnonlonoonooqqpqrrqqsrsrruutsssttssrqniopnmpppppqqqrrssssststtsrrrqrqpmflmmmnmmnoooooopppoonlkgfiijkkllllkjjjjifcffggffedca87bbbba63258aa8425653002000000000000000000000000000000000000000000000000000000000000003330278883246cddd735adffhhhhg9clmmmmnmnooonnnnnlkbkopqsrrrrrrrrrrqqqqrqqrqponnml9cloprqrrssssuutvwusssssssttttttststttttrsrrrrqspqrppomjjhfffeffedfjkmnopoorrrqrrsvqssssuutssutrrqqnpnoopnnmnmnnlmmnmmkkkjmmlkkkkiggfe456bgkmlnnopqpppqrpppmllklllllnmlkkkjljhjjjihjlgkiijkjjjgggfgefihggghjhgeegheefffecdefggf9aa9b8877899bc947baa9a988bb6cceddebbccdcdcccddddedgehffgghgffggffhgghiihjjjjkmkkjjjihiiijiifgd9cfhhghghggiiiillllmmmlmmmnnooqonopnomnlpnonnlmmklllkidhiikllmmmmmlmmkmnnnnnoonpqqqqrsssrsssssrrpokkmnnnnnnnpoppqqqrsrssssrqqqqqpnlgilmkkllmnmnnoooomlmlkkhehhijjjkkjjjjjjigddfeffffeeee9bbbbca6458997312442002200000000000000000000000000000000000000000000000000000000054023320268872049cdda7deffgghhhig8gkmlmmmmnoonnnnnnmhelpppqrrqqqqqqqpqqopqqopponmmli5cjmorqrrsssrrrrtusrqqprrpqsssrrrrrtqsrrrrrqqqqqppqoomkkiheeeeefcdehjkmnmmnpppoprsrrrqsropoppqpoponnomnnlkklkkkmkmmlkjiijijjiiiihfdeca355aehhijlmmlmnnlllkjkjkjkkkjjkkihjhhihgiggggefhgghghhgddcdcdddfgfgfffeebefedbbccdcbddbbd6688956575546574677779778999a9b99a88897a9aa9cdabdddcdecdeehgeddddffffeeefhghihgghgfgfgeeeefeedcbdffgfeeeegjihiihijhiijkkllmmmmmmmnmlllllmlkkkkkkkkihddhhjkkkjkkklkjjllmlonnmnnnoonpqqppprrrrspnmjhllmmmmmooonnnooopqqqqqrqqpopnmjfelkllllmmmnmmmmmllkkjiheehhhhijjjiiiiihhdcfffffffeedb9bcccbba87988623333012200000000000000000000000000000000000000000000000000000000344234431367622489bbb5bfggggggggge9gjkllllmnnnnnnnmmleglnooppppqqqooooopnnooonnmmllme6djmopqpoqssrrqrqrqqoqppoopqqpppppoprrsppppppooonnpnmlkihfedddeeafdgiklmmmnmmnnoppqpoppmnpoooqnlnmlkmlkjiigiihgkggjihgghghhiggggfecdd55489eighkkjijjljijjehhghhhghhhhffeecdfgggdfddddcdcbbcabb9abadcaadcbeddcbceccccab9788a8879546551543124332344456755787673452646545466899a8aaaab999ba9bebccaabccdccdbcddefeddcdecbcbcbccbca9cc9cbbccbfghhhfgggeffghhfhihjjkikkkkjiihijhkkjkjjkihfbfggggihhhhhhijjiiljlmmmmmmmmnnnmonoooopnnljgjklllllkllllmlmmnnmnoopqoonmmkifcjkkkkjklllllllkkjjjiigecffffghhhhhhiihgebddeeeeeeedc9bbbbbbb9678764433321110000000000000000000000000000000000000000000000000000000013323443467746789aaa95dfggggffffebchiklkkklmmmnmmllliaglnmmononooonnmnnnnmmnmllkllkjbbfhlmnoonopsqrpppponmoomonlmnnmmonooonnnnnnmlmjmlllkjjjjihfdddcb9ebegikklllmlnkllmnmmnnmmmmmkjjhjijijjhhgefeeddefhihgfegeeedbbbcabaa93526acfhbeegfddfgfeebeceffgfgeedcbbc7cbaaa9999cb9a8686669a7789aaabc79aa76528276595445444311010002000000000100343322422311110011035466777666776558777aa88887787896a7a97babca699867b78989978adb969699bcefffedccccdeeffdffgddgfgffeffgeeggghhfhffc9cbe9fecdfegfhhgfhhijjhijjklljkkkklllkkmlkjjegiiiijjjjjkkjkkkkkkkllmmmmlkkjhfcejiiihhiijkkkkjiihigggdbdeecefggfghhgggeabcdcccdddddaabbbbba9567765442232110000000000000000000000000000000000000000000000000000000000134435677648999aaa89effffeeeeecaehijlkkkkkkllkkjjieagjllllllmllllmmlllkkkkkkjiiiih8eijjklllmmmonnnnnmmlllkllllijllmmllnmllkkkjhikhiiijhhijhgebbbba77cacfhhikjkjiiikjkklkkjjiiiighgfeefffegffbcabaadcdededba9b7a9a99988741138abeecedbccca8bcd9ccaccdaabb77665468577656555564433213453566748b8544410042354503444110000000000000000000000000000000000000000011313443244532334335555442444432545757756433433676757356168666637799b99ab9896abbcdcaddecbcddebbeddebffefdefdbb7aabbccbdbbeefeeefhhhgfggihhiiijiiiiiighhhgheefgghgegghijjiihiiijjjlkjkjjhhfeddggggggggfhhhihghfgfefecccbbeefeeefggffda9baaabbbccda9aaaaa974466653421322100000000000000000000000000000000000000000000000000000000002444666775589998996beeeeeecccca9dhiikjjjkjjijjhgge87dhikkjgjjikjjjkjkjjjjjiifgfffb7fhijkjkjjjjlkjjjkjjiihhhggigijhijljjjjjhgffgfffghfgfggeccdba99967aaadfgegghgghhifiihgcegfhfgfdbbcbbccabbb8a888797896aa878977768554420113678baaab9786887a9558978897644435343536545433424212000022034544344301000000011100121000000000000000000000000000000000000000000000000111112100000032012211110320210222234200010233303110001242213034678799565665767699998a9bbcaccccaccbdcbcb994798788799bbcbabaacdddbcdeefffffeffdffgeffeebdcbcecbdddefggffggfggghgggghffefeceeefddddddcffffgecddfecaabbcbccccdbddec98988999aabb9688899864255432320111100000000000000000000000000000000000000000000000000000000012322555564788898874accccccaaaa89dfhijhhghfhehgdedc7bdfgihffhhghihiiiigghhhgfea9ac66dghhjkhhhgikigfghfhgeedceeggfhffggghffeefbaaadbbcbddedc9aa97656456979cbbdddeedegbhffddccdgcddb97998676587576465556578655562524433012000146577766557555057436545452232200000300000200000000000000000000110100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000121000000010000001114452124100133214454767798889b8998986873623544667767999a898989889989aaccbbba9bbdbabaaa768a9abbbabbccccdddeeeedddcecedccaaccdbabaaababddcccdccdc99aaaaba9abcaabb9777777789999566666552034332320000000000000000000000000000000000000000000000000000000000000001100333444687777766aabaa9978987bdefffdeffeedddbcc98beefededefeceefffffeebedbbaa98369dfcfhfcdfdgfcgdccbdbba9aabdcdcddcbdacda98999aaaa9a998977664533132557b9aabbabaacadbccbb98aa975645542315242324233112233022211001100000001122343230143121121131201100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001211113344666554665214110011212122456577656666555666665567657898797774445677878789aaa9a9baaa8aa9aabbaa77889888777778aabaabaa9856777777777688888656555556676234123123133322210000000000000000000000000000000000000000000000000000000000000000000122212666566556778877653565accdcecbcbaa878879679bdccbbabbbb9bbbcbccbacab77774036acdccbb9abbbbbab9998776787567789996777655454767989775632310100001335777876784567877765548656211110000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000021200000200000000000000000233332333320111222133222355432333132102111334444656676777666787757534564334454457888788986545433334344567753343222221330000000100100111000000000000000000000000000000000000000000000000000000000000000000000000023332342244555443333207689997777654354543679aaa9888888688766566674644441023588776766757665654223320002101231122211311223442323331000000000000001232212123223344331222100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000001122222544332322210000000000011244433444432010000000101344210000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000112110000000043445423210000101003545566443344224112221111212120001244310112213110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000101120000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000"
}, CP_SINK = 12, CP_HEADS = 696, CP_JAW = 12, CP_LIFT = 0.55, CP_BLEND = {
  sides: 26,
  top: 3,
  foot: 12,
  vignette: { start: 0.62, end: 1.12, rx: 74, ry: 80, cy: 20 },
  poster: { shade: [0.25, 0.08], light: [0.16, 0.12], mix: 0.85 },
  shade: 1,
  light: 1,
  blur: 1.6,
  boost: { eyes: 0.85, nose: 1.15, lip: 1.15, lowerLip: 1.4 },
  band: { load: 0.55, rows: [0, 14], cols: [12, 121], soft: 2, keep: 22 },
  brow: 0.25,
  browBlur: 2.25,
  mouth: 0.95,
  mouthBlur: 1.3,
  fill: 0.87,
  bloom: { load: 0.5, radius: 30, row: 40 },
  scan: 0.5,
  scanPitch: 1.5,
  film: [0.55, 0.45]
}, CP_SHOWN = [2, 69], CP_INKS = {
  ...LAND_INK,
  // the air, from the page at the top to the deep periwinkle round the screen
  mist: ["#eef0fe", "#121225"],
  haze: ["#cdd1f7", "#23264e"],
  peri: ["#a7acee", "#3f4490"],
  periMid: ["#a3a9ee", "#363b80"],
  periDeep: ["#8a90df", "#2c3070"],
  // the screen: its lines, lit white in the glow
  screen: ["#a0a6ec", "#7b81d8"],
  screenLow: ["#8f95e3", "#6168c4"],
  screenHi: ["#d2d5fa", "#c9ccfb"],
  screenMid: ["#bfc3f6", "#b3b8f5"],
  flare: ["#ffffff", "#f1f2ff"],
  sheen: ["#e6e8fd", "#3b3f78"]
}, cpScreen = (stage) => {
  let { w, h, words } = stage, scale = Math.max(w / CP_CROWD.size[0], 0.36), sink = CP_SINK * scale, top = words.y + words.b + 16, foot = h - (CP_CROWD.size[1] - 690) * scale + sink, heads = Math.min(h - (CP_CROWD.size[1] - CP_HEADS) * scale + sink, h - 46), narrow = w < 700, widest = clamp(w * 0.32, 170, 720), faceW = CP_FACE.grid[0] * CP_FACE.cell, room = heads - 4 - (top + 6), { fill } = CP_BLEND, k = Math.max(
    0.05,
    Math.min(
      room / ((CP_SHOWN[1] - CP_SHOWN[0]) * CP_FACE.cell),
      narrow ? 0.85 * w / faceW : 2 * widest * fill / faceW
    )
  ), half = narrow ? widest : clamp(faceW * k / fill / 2, 170, widest), splay = Math.tan(7 * Math.PI / 180) * (foot - top);
  return { x: w / 2, top, foot, half, bow: Math.max(8, (foot - top) * 0.07), scale, splay, sink, heads, room, k };
}, cpAcross = (stage, px) => (px - stage.w / 2) / (stage.w / 2), cpRooms = (stage, py) => (py - stage.base) / stage.room, cpScreenEdge = (stage, which) => {
  let s = cpScreen(stage), n = Math.min(2400, Math.ceil(stage.w));
  return Array.from({ length: n + 1 }, (_, k) => {
    let px = k / n * stage.w, off = Math.abs(px - s.x) - s.half, u = clamp((px - s.x) / s.half, -1, 1), footY = s.foot - s.bow * 0.8 * u * u;
    if (off > s.splay)
      return [cpAcross(stage, px), cpRooms(stage, footY)];
    let topY = off <= 0 ? s.top + s.bow * u * u : s.top + s.bow + off / s.splay * (footY - s.top - s.bow);
    return [cpAcross(stage, px), cpRooms(stage, which === "top" ? topY : footY)];
  });
}, CP_GLOW = {
  place: (stage) => {
    let s = cpScreen(stage);
    return {
      at: [0, cpRooms(stage, s.top + (s.foot - s.top) * 0.42)],
      half: [s.half / (stage.w / 2) * 0.95, (s.foot - s.top) / stage.room * 0.62]
    };
  },
  breathe: [0.05, 12]
}, COMPARE = {
  ...HERO,
  intro: !1,
  words: ".cp-copy",
  lines: { ...LINES, lift: 0.1, veil: [110, 40], veilCore: 0.2, beadChance: 0.12 },
  // no butterflies here, but the lens all the same, for the fade into the page at the canvas's foot
  lens: { ...LENS, foot: "ease", always: !0 },
  flock: [],
  inks: CP_INKS,
  glow: CP_GLOW,
  // the face gives a speech (see `talk`), nodding into it
  talk: { phrases: 7, seed: 0, lift: CP_LIFT, nod: 2.5 },
  film: CP_BLEND.film,
  marks: !0,
  glyphs: !0,
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    relief: [1, 1],
    room: 250,
    foot: 0,
    head: 0,
    least: 150,
    sheets: [
      {
        name: "air",
        top: (stage) => [
          [-1.6, -stage.base / stage.room],
          [1.6, -stage.base / stage.room]
        ],
        foot: [
          [-1.6, 1.02],
          [1.6, 1.02]
        ],
        // the page itself above the words, the air coming in under them and deepening to the sides of the screen and
        // behind the audience, so the screen is the light in the room
        paint: [
          [0, "mist", 0],
          [0.26, "mist", 0.08],
          [0.44, "haze", 0.75],
          [0.56, "periMid", 1],
          [0.78, "periDeep", 1],
          [1, "periDeep", 1]
        ],
        glow: [
          [0, "mist", 0],
          [0.26, "mist", 0.08],
          [0.44, "haze", 0.8],
          [0.56, "peri", 1],
          [0.78, "periMid", 1],
          [1, "periDeep", 1]
        ],
        glowTake: 0.5,
        fill: 0.5,
        under: 0.7,
        patch: 0.16,
        flow: 0.5,
        breath: 2.5
      },
      {
        name: "screen",
        opaque: !0,
        laid: !0,
        top: (stage) => cpScreenEdge(stage, "top"),
        foot: (stage) => cpScreenEdge(stage, "foot"),
        paint: [
          [0, "screenHi", 1],
          [0.03, "screen", 1],
          [0.55, "screen", 1],
          [1, "screenLow", 1]
        ],
        glow: [
          [0, "flare", 1],
          [0.03, "screenHi", 1],
          [0.4, "screenMid", 1],
          [0.8, "screen", 1],
          [1, "screenLow", 1]
        ],
        glowTake: 0.75,
        fill: 0.86,
        under: 0.95,
        patch: 0.08,
        flow: 0.2,
        breath: 1.2
      }
    ]
  },
  grass: null,
  passer: null,
  pointer: !1,
  flowers: null,
  clouds: [],
  stillAt: 6,
  paints: {
    ...PAINTS,
    flare: ["#ffffff", "#f4f5ff"],
    screenHi: ["#e9eaff", "#d3d6fd"],
    /* The face's paints, each only a little deeper or lighter than the screen behind it and in its own periwinkle,
       so that the face is a soft image in the screen and not paint laid on it: its faint brows, its flat shadows and
       the inside of its mouth, and its light. Each stands as far from the screen in dark mode as in light. */
    faceShade: ["#9a9fe5", "#757bd0"],
    faceDeep: ["#8e93db", "#626abb"],
    faceLight: ["#cccfff", "#a1a6e9"],
    halo: ["#dcdffb", "#b9bdf3"],
    // the audience: dark periwinkle, deeper the nearer, the outlines lit by the screen
    crowdFar: ["#6a6fae", "#272a52"],
    crowd: ["#4d5185", "#1b1d3c"],
    crowdNear: ["#3b3e62", "#121327"],
    crowdRim: ["#e4e6fd", "#b8bcf6"]
  },
  plant: (garden) => {
    let { w, h, rand, words } = garden, s = cpScreen({ w, h, words }), H = s.foot - s.top, HAZE = 0.4 + 5e-3, calm = (seed) => {
      for (let k = 0; k < 60; k += 1) {
        rand.reseed(seed + k * 104729), rand(), rand(), rand();
        let dice = rand();
        if (Math.abs(dice * 91.7 % 1 - 0.5) < 0.08 && Math.abs(dice * 37.3 % 1 - 0.5) < 0.15)
          return seed + k * 104729;
      }
      return seed;
    }, put = (n2, { x, y, ...o }) => {
      if (o.load !== void 0 && o.load < 2e-3)
        return;
      rand.reseed(calm(88001 + n2 * 7919));
      let root = h + 40;
      garden.dab({ kind: HAZE, blur: 0.6, load: 0.95, turn: 0, ...o, x, y: root, stem: root - y, lean: 0, stiff: 1 });
    }, line = (n2, [ax, ay], [bx, by], { thick = 1.6, glow = 4, load = 0.92, haloLoad = 0.18, order = 600 } = {}) => {
      let mx = (ax + bx) / 2, my = (ay + by) / 2, long = Math.hypot(bx - ax, by - ay) / 2 + thick / 2, turn = Math.atan2(by - ay, bx - ax);
      glow > 0 && put(n2, {
        x: mx,
        y: my,
        long: long + glow / 2,
        wide: clamp(glow / (long + glow / 2), 0.02, 1.6),
        turn,
        blur: glow,
        paints: ["halo", "screenHi"],
        load: haloLoad,
        order
      }), put(n2 + 1, {
        x: mx,
        y: my,
        long,
        wide: clamp(thick / 2 / long, 0.01, 1.6),
        turn,
        blur: Math.max(0.5, thick * 0.35),
        paints: ["flare", "flare"],
        load,
        order: order + 1
      });
    }, n = 0;
    for (let k = 0; k < 48; k += 1) {
      let u0 = -1 + 2 * k / 48, u1 = -1 + 2 * (k + 1) / 48;
      line(n += 2, [s.x + u0 * s.half, s.top + s.bow * u0 * u0], [s.x + u1 * s.half, s.top + s.bow * u1 * u1], {
        thick: 3.4,
        glow: 15,
        haloLoad: 0.42,
        load: 1
      });
    }
    for (let side of [-1, 1])
      for (let k = 0; k < 16; k += 1) {
        let f0 = k / 16, f1 = (k + 1) / 16, y0 = s.top + s.bow + f0 * (s.foot - s.top - s.bow), y1 = s.top + s.bow + f1 * (s.foot - s.top - s.bow);
        line(n += 2, [s.x + side * (s.half + f0 * s.splay), y0], [s.x + side * (s.half + f1 * s.splay), y1], {
          thick: 3,
          glow: 13,
          haloLoad: 0.36,
          load: 1
        });
      }
    let face = CP_FACE, [fw, fh] = face.grid, cell = face.cell * s.k, left = s.x - fw * cell / 2, top = s.top + 6 + Math.max(0, s.room - (CP_SHOWN[1] - CP_SHOWN[0]) * cell) * 0.4 - CP_SHOWN[0] * cell, digit = (str, i) => Number.parseInt(str[i], 36), weight = (gx, gy) => {
      let { sides, top: under, foot, vignette: v } = CP_BLEND, r = Math.hypot((gx + 0.5 - fw / 2) / Math.max(1e-3, v.rx), (gy + 0.5 - v.cy) / Math.max(1e-3, v.ry));
      return smooth(0, sides, gx + 0.5) * smooth(0, sides, fw - gx - 0.5) * smooth(0, under, gy + 0.5) * smooth(0, foot, fh - gy - 0.5) * (1 - smooth(v.start, v.end, r));
    }, { poster, boost, band } = CP_BLEND, lookAt = (gx, gy, dark, lit) => {
      let m = poster.mix, sh = 0, li = 0;
      dark > 2 ? sh = Math.min(0.58, 0.6 * ((dark - 2) / 33) ** 0.8) * (1 - m) + 0.58 * smooth(poster.shade[0] - poster.shade[1], poster.shade[0] + poster.shade[1], dark / 35) * m : lit > 2 && (li = Math.min(0.5, 0.52 * ((lit - 2) / 33) ** 0.8) * (1 - m) + 0.5 * smooth(poster.light[0] - poster.light[1], poster.light[0] + poster.light[1], lit / 35) * m);
      let feature = 1;
      gy <= 20 ? feature = boost.eyes : gy >= 28 && gy <= 46 ? feature = boost.nose : gy >= 48 && gy <= 60 && (feature = boost.lip), sh *= CP_BLEND.shade * feature, li *= CP_BLEND.light * (gy >= 61 && gy <= 67 ? boost.lowerLip : 1);
      let [r0, r1] = band.rows, [c0, c1] = band.cols;
      if (gy >= r0 && gy <= r1 && gx >= c0 && gx <= c1 && lit < band.keep) {
        let edge = Math.min(
          smooth(r0 - 0.5, r0 + band.soft, gy),
          smooth(r1 + 0.5, r1 - band.soft, gy),
          smooth(c0 - 0.5, c0 + band.soft * 2, gx),
          smooth(c1 + 0.5, c1 - band.soft * 2, gx)
        );
        sh = Math.max(sh, band.load * edge), li = 0;
      }
      return { shade: Math.min(0.95, sh), light: Math.min(0.95, li) };
    }, SEAM = 61, MOUTH = [46, 89], OPEN = 16, JAW = CP_JAW, mid = (MOUTH[0] + MOUTH[1] + 1) / 2, lens = (gx) => {
      let r = Math.abs(gx + 0.5 - mid) / OPEN;
      return r < 1 ? Math.sqrt(1 - r * r) : 0;
    }, jaw = (gx) => 1 - smooth(0.45, 1, Math.abs(gx + 0.5 - mid) / 34), drop = (gx, gy) => {
      if (gy < SEAM)
        return 0;
      let t = smooth(SEAM, SEAM + 9, gy);
      return Math.min(95, JAW * cell * (lens(gx) * (1 - t) + jaw(gx) * t));
    }, rise = (gx, gy) => gy < SEAM ? Math.min(30, CP_LIFT * JAW * cell * lens(gx) * smooth(SEAM - 9, SEAM - 1, gy)) : 0, topAt = (x) => s.top + s.bow * clamp((x - s.x) / s.half, -1, 1) ** 2;
    for (let gy = 0; gy < fh; gy += 1)
      for (let gx = 0; gx < fw; gx += 1) {
        let i = gy * fw + gx, dark = digit(face.shade, i), lit = digit(face.light, i), x = left + (gx + 0.5) * cell, y = top + (gy + 0.5) * cell;
        if (y < topAt(x) + cell)
          continue;
        let down = drop(gx, gy), up = rise(gx, gy), phase = up > 0.05 ? 300 + up : 100 + down, lip = gy >= SEAM && gy <= SEAM + 6 && lens(gx) > 0 ? 0.8 : 1, wt = weight(gx, gy), look = lookAt(gx, gy, dark, lit);
        look.shade > 2e-3 ? put(1e5 + i, {
          x,
          y,
          long: cell * 1.35,
          wide: 0.95,
          blur: cell * 1.4 * CP_BLEND.blur,
          paints: ["faceDeep", "faceDeep"],
          load: look.shade * wt,
          order: 500,
          phase
        }) : look.light > 2e-3 && put(2e5 + i, {
          x,
          y,
          long: cell * 1.35,
          wide: 0.95,
          blur: cell * 1.4 * CP_BLEND.blur,
          paints: ["faceLight", "faceLight"],
          load: look.light * lip * wt,
          order: 501,
          phase
        });
      }
    for (let gx = Math.floor(mid - OPEN); gx <= Math.ceil(mid + OPEN); gx += 1) {
      let gap = drop(gx, SEAM) + rise(gx, SEAM - 1);
      if (gap < 0.5)
        continue;
      let half = clamp(gap * 0.35, cell, cell * 3);
      put(26e4 + gx, {
        x: left + (gx + 0.5) * cell,
        y: top + SEAM * cell,
        long: gap / 2,
        wide: half / (gap / 2),
        turn: Math.PI / 2,
        blur: cell * 2 * CP_BLEND.mouthBlur,
        paints: ["faceDeep", "faceDeep"],
        load: 0.6 * CP_BLEND.mouth,
        order: 502,
        phase: 200 + Math.min(95, gap)
      });
    }
    let { bloom } = CP_BLEND;
    put(265e3, {
      x: s.x,
      y: top + bloom.row * cell,
      long: bloom.radius * cell,
      wide: 1,
      blur: bloom.radius * cell,
      paints: ["faceLight", "faceLight"],
      load: bloom.load,
      order: 498,
      phase: 100
    }), [
      [21, 2, 57, 8.5],
      [112, 2, 76, 8.5]
    ].forEach(([ax, ay, bx, by], side) => {
      let steps = Math.ceil(Math.hypot(bx - ax, by - ay));
      for (let j = 0; j <= steps; j += 1) {
        let f = j / steps, gx = ax + (bx - ax) * f, gy = ay + (by - ay) * f, x = left + gx * cell, y = top + gy * cell;
        if (y < topAt(x) + cell * 1.5)
          continue;
        let thick = 1 + 0.7 * f;
        put(27e4 + side * 1e3 + j, {
          x,
          y,
          long: cell * 1.5 * thick,
          wide: 0.75,
          blur: cell * 1.5 * CP_BLEND.blur * CP_BLEND.browBlur,
          turn: Math.atan2(by - ay, bx - ax),
          paints: ["faceShade", "faceShade"],
          load: (0.16 + 0.22 * f) * CP_BLEND.brow * weight(gx - 0.5, gy - 0.5),
          order: 503,
          phase: 100
        });
      }
    });
    let pitch = Math.max(3, H * 0.011) * CP_BLEND.scanPitch;
    for (let y = s.top + s.bow + pitch; y < s.foot - pitch; y += pitch) {
      let f = (y - s.top - s.bow) / (s.foot - s.top - s.bow), from = -(s.half + f * s.splay - 3);
      for (; from < 0 && s.top + s.bow * (from / s.half) ** 2 > y - 2; )
        from += 2;
      from >= 0 || (n += 1, put(25e4 + n, {
        x: s.x,
        y,
        long: -from,
        wide: clamp(0.45 / -from, 5e-4, 0.02),
        turn: 0,
        blur: 0.5,
        paints: ["flare", "screenHi"],
        load: CP_BLEND.scan,
        order: 650
      }));
    }
    let crowd = CP_CROWD, [cw, ch] = crowd.grid, cs = crowd.cell * s.scale, yTop = h - (crowd.size[1] - crowd.top) * s.scale + s.sink, narrow = w < 700, xLeft = (w - crowd.size[0] * s.scale) / 2, xOf = (gx) => narrow ? gx * crowd.cell < crowd.size[0] / 2 ? gx * cs : w - (crowd.size[0] - gx * crowd.cell) * s.scale : xLeft + gx * cs, filled = (gx, gy) => gx >= 0 && gx < cw && gy >= 0 && gy < ch && crowd.mask[gy * cw + gx] === "1";
    for (let gy = 0; gy < ch; gy += 1) {
      let y = yTop + (gy + 0.5) * cs, gx = 0;
      for (; gx < cw; ) {
        if (!filled(gx, gy)) {
          gx += 1;
          continue;
        }
        let end = gx, toneSum = 0;
        for (; end < cw && filled(end, gy) && end - gx < 28; )
          toneSum += Number.parseInt(crowd.tone[gy * cw + end], 36), end += 1;
        let tone = toneSum / (end - gx), paint = tone < 11 ? "crowdFar" : tone < 22 ? "crowd" : "crowdNear", x0 = xOf(gx), x1 = xOf(end - 1) + cs, half = (x1 - x0) / 2 + cs * 0.25;
        put(5e5 + gy * cw + gx, {
          x: (x0 + x1) / 2,
          y,
          long: half,
          wide: clamp(cs * 0.62 / half, 0.01, 1.6),
          turn: 0,
          blur: Math.max(0.4, cs * 0.15),
          paints: [paint, paint],
          load: 0.99,
          order: 900 + gy * 1e-3
        }), gx = end;
      }
    }
    for (let gy = 1; gy < ch; gy += 1) {
      let y = yTop + gy * cs, gx = 0;
      for (; gx < cw; ) {
        if (!(filled(gx, gy) && !filled(gx, gy - 1))) {
          gx += 1;
          continue;
        }
        let end = gx;
        for (; end < cw && filled(end, gy) && !filled(end, gy - 1); )
          end += 1;
        let x0 = xOf(gx), x1 = xOf(end - 1) + cs, half = (x1 - x0) / 2 + cs * 0.4;
        put(7e5 + gy * cw + gx, {
          x: (x0 + x1) / 2,
          y: y - cs * 0.15,
          long: half,
          wide: clamp(0.75 / half, 2e-3, 1.6),
          turn: 0,
          blur: 0.5,
          paints: ["crowdRim", "crowdRim"],
          load: 0.85,
          order: 950
        }), gx = end;
      }
    }
  }
}, SK_EVEN = 5e-3, SK_HAZE = 0.4 + SK_EVEN, SK_TWINKLE = 3.25 + SK_EVEN, SK_GLIMMER = 3.4 + SK_EVEN, skHash = (value) => {
  let x = Math.sin(value * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}, SK_INKS = {
  ...LAND_INK,
  skTop: ["#78a5e6", "#1c3c86"],
  skHigh: ["#1450bf", "#0a1b56"],
  skMid: ["#246bce", "#0f276c"],
  skLow: ["#5f95e2", "#1b3482"],
  skHorizon: ["#c0c2ee", "#383f8e"]
}, SK_SCALE = (w) => Math.min(1.15, Math.max(0.5, w / 1232)), SK_GROUPS = [8, 8, 7], SK_UPPER = 0.8, SK_NEAR_FROM = 700, skBird = (h, lane, phase) => ({
  size: 30 + 16 * h(1),
  speed: 46,
  lane,
  phase,
  drift: 3 + 2.5 * h(5),
  period: 4 + 3 * h(6),
  surge: 3 + 4 * h(11),
  surgePeriod: 3 + 2 * h(12),
  beat: 2.2 + 0.8 * h(7),
  wag: 0,
  flap: 0.36 * (0.85 + 0.3 * h(8)),
  glide: 3.5 + 3 * h(9),
  seed: h(10)
}), SK_BIRDS = [
  ...SK_GROUPS.flatMap(
    (count, g) => Array.from({ length: count }, (_, j) => {
      let i = SK_GROUPS.slice(0, g).reduce((a, b) => a + b, 0) + j, h = (k) => skHash(i * 11.3 + k * 2.7 + 0.3), lane = Math.min(1, Math.max(0, (j + 0.5) / count * SK_UPPER + (h(3) - 0.5) * 0.08)), along = ((j * 0.618034 + g * 0.31) % 1 - 0.5) * 0.2 + (h(4) - 0.5) * 0.03;
      return skBird(h, lane, g / SK_GROUPS.length + 0.04 + (lane - 0.5) * 0.05 + along);
    })
  ),
  ...[0, 1].map((j) => {
    let h = (k) => skHash(j * 23.9 + k * 4.3 + 7.7), bird = skBird(h, 0.92 + 0.12 * h(3), (j + 0.3 + 0.4 * h(4)) / 2);
    return { ...bird, size: bird.size * 1.5, speed: bird.speed * 1.6, from: SK_NEAR_FROM };
  })
], SK_TOWERS = [
  [0, 0.36, 200],
  [0.15, 0.15, 120],
  [0.36, 0.08, 140],
  [0.6, 0.1, 120],
  [0.82, 0.3, 170],
  [1.02, 0.24, 150]
], SKY = {
  ...HERO,
  intro: !1,
  words: ".dc-copy, .hl-copy",
  // a few beads, the oval of page kept round the words shallow, and every line carried to the canvas's edges
  lines: { ...LINES, lift: 0.08, veil: [80, 18], beadChance: 0.08, whole: !0 },
  film: FOOTER.film,
  // drawn at a little less than the screen's density on a canvas wider than any laptop's, as the company's sea is
  dprCap: (w) => Math.min(2, 2 * Math.sqrt(1800 / w)),
  inks: SK_INKS,
  // the stars twinkle, and the strokes are even (neither bowing nor tapering) and soft-edged
  twinkle: !0,
  marks: !0,
  glyphs: !0,
  land: {
    ...HERO.land,
    profile: [
      [-1.6, 0],
      [1.6, 0]
    ],
    crest: 0,
    relief: [1, 1],
    sheets: [
      // the sky, from just under the buttons' foot down (not named 'sky', which the land is laid out from before its
      // room is known, and this one's top is worked out from it)
      {
        name: "air",
        top: (stage) => {
          let under = Math.min((stage.words.y + stage.words.b + 3 - stage.base) / stage.room, 0.12);
          return [
            [-1.6, under],
            [1.6, under]
          ];
        },
        foot: [
          [-1.6, 1.3],
          [1.6, 1.3]
        ],
        paint: [
          [0, "skTop", 0],
          [0.12, "skTop", 0.78],
          [0.32, "skHigh", 1],
          [0.58, "skMid", 1],
          [0.82, "skLow", 1],
          [1, "skHorizon", 1]
        ],
        fill: 0.9,
        under: 0.85,
        patch: 0.1,
        flow: 1.1,
        breath: 2
      },
      // the land's foot, as the other heroes' meadows are, under the clouds: it lays the land out and draws nothing
      {
        name: "meadow",
        top: [
          [-1.6, 1.24],
          [1.6, 1.24]
        ],
        foot: [
          [-1.6, 1.3],
          [1.6, 1.3]
        ],
        paint: [
          [0, "skHorizon", 0],
          [1, "skHorizon", 0]
        ],
        fill: 0,
        under: 0
      }
    ],
    least: 110
  },
  grass: null,
  flowers: null,
  passer: null,
  pointer: !1,
  clouds: [],
  // No butterflies: the birds are this sky's flock, drawn through the lens's glass, which here is gentle and even (see
  // `lens`): it bends less than the butterflies', only across, never shows a part of the flock twice, neither splits
  // its colours nor draws them out along the way, blurs them only a little towards the edge and glows only a little
  // round them, so that a bird comes in drawn out and level and goes out the same, with no comet's tail.
  flock: [],
  lens: {
    ...LENS,
    foot: "ease",
    always: !0,
    even: !0,
    bend: 1,
    bandMost: [110, 62],
    split: 0,
    along: 0,
    soften: 1,
    halo: [2.6, 0.2]
  },
  school: {
    fish: SK_BIRDS,
    // never smaller than this, or on a phone they would be ticks
    size: (w) => Math.max(0.7, SK_SCALE(w)),
    // a bird banks and climbs only a little, never tipping as a fish does
    turn: 0.35,
    /* From a little under the buttons, so that none flies close under them, down over the clouds' heads, rising a
       little across the canvas to the right. Its top is that much lower again as the lanes rise to the right, and a
       little more than a bird rises and falls, so that none flies up into the top of the sky, where it fades into the
       page. Where the near birds are left out, its foot is lowered so that the groups' part of it reaches the foot,
       and they have the whole of it. */
    band: ({ w, h, words }) => {
      let rise = h * 0.08 * Math.min(1, w / 1232), top = Math.max(words.y + words.b + 48 + rise / 2 + 8 * Math.max(0.7, SK_SCALE(w)), h * 0.36), foot = Math.max(top + 90, h * 0.78);
      return [top, w < SK_NEAR_FROM ? top + (foot - top) / SK_UPPER : foot, -rise];
    },
    scatter: { radius: 120, push: 340, back: 1.3 }
  },
  paints: {
    ...PAINTS,
    // the birds, white, with a little light round them
    skBird: ["#ffffff", "#ffffff"],
    skBirdSoft: ["#eef4ff", "#e6eeff"],
    skBirdGlow: ["#ffffff", "#eaf2ff"],
    // the veil, and its threads, which are hardly to be told from it by day and are the aurora's faint strands at night
    skVeil: ["#8cc4f4", "#48acd8"],
    skThread: ["#a8d2f6", "#74c4dc"],
    // the clouds, from their lit tops to their shade, the far bank, and the haze at the horizon
    skCloudLit: ["#fffdf8", "#a2b3e2"],
    skCloud: ["#f2f6fd", "#8396cf"],
    skCloudMid: ["#dce5f8", "#687bb8"],
    skCloudShade: ["#c3d2f1", "#5063a0"],
    skCloudDeep: ["#a9bdea", "#3d4f8a"],
    skCloudFar: ["#dbe4fa", "#5a6db0"],
    skCloudFarShade: ["#c4d2f2", "#43569a"],
    skDusk: ["#e8def7", "#4a4c9a"],
    // the stars, faint against the day's blue and bright at night
    skStar: ["#dce9fb", "#ffffff"],
    skStarGlow: ["#e8f1fd", "#fff6d6"]
  },
  plant: (garden) => {
    let { w, h, rand, ground } = garden, half = w / 2, sc = SK_SCALE(w), put = (n2, { x, y, ...o }) => {
      rand.reseed(66001 + n2 * 7919);
      let root = h + 40;
      garden.dab({
        kind: SK_HAZE,
        blur: 0.6,
        load: 0.9,
        turn: 0,
        ...o,
        x,
        y: root,
        stem: root - y,
        lean: 0,
        stiff: 1
      });
    }, noise = (x, y) => {
      let xi = Math.floor(x), yi = Math.floor(y), u = (x - xi) * (x - xi) * (3 - 2 * (x - xi)), v = (y - yi) * (y - yi) * (3 - 2 * (y - yi)), r = (i, j) => hashed(i * 157.31 + j * 311.73 + 0.17), a = r(xi, yi) + (r(xi + 1, yi) - r(xi, yi)) * u, b = r(xi, yi + 1) + (r(xi + 1, yi + 1) - r(xi, yi + 1)) * u;
      return a + (b - a) * v;
    }, fbm = (x, y) => (noise(x, y) * 0.5 + noise(x * 2.03 + 5.2, y * 2.03 + 1.3) * 0.25 + noise(x * 4.07 + 9.7, y * 4.07 + 7.1) * 0.125 + noise(x * 8.11 + 3.3, y * 8.11 + 4.9) * 0.0625) / 0.9375, top = ground("air", half), pic = h - top, n = 0, vw = Math.max(w, 2.5 * pic), thin = (w / vw) ** 0.75, veilAt = (f) => [(-0.08 + 1.16 * f) * w, top + (0.1 + 0.36 * f + 0.06 * Math.sin(f * Math.PI * 1.7)) * pic], veilTurn = (f) => {
      let [x0, y0] = veilAt(f - 0.01), [x1, y1] = veilAt(f + 0.01);
      return Math.atan2(y1 - y0, x1 - x0);
    };
    for (let k = 0; k < 26; k += 1) {
      let f = k / 25, [x, y] = veilAt(f);
      put(n += 1, {
        x,
        y,
        long: 0.065 * vw,
        wide: 0.45,
        turn: veilTurn(f),
        blur: 0.045 * vw,
        paints: ["skVeil", "skVeil"],
        load: (0.27 + 0.15 * hashed(k * 3.1)) * thin,
        order: 560
      });
    }
    for (let k = 0; k < 8; k += 1) {
      let f = hashed(k * 2.3 + 0.7), [x, y] = veilAt(f), turn = veilTurn(f), off = (hashed(k * 5.9 + 0.2) - 0.5) * 0.11 * pic, long = (0.03 + 0.06 * hashed(k * 4.1)) * vw;
      put(n += 1, {
        x: x - Math.sin(turn) * off,
        y: y + Math.cos(turn) * off,
        long,
        wide: Math.max(6e-3, 0.55 * sc / long),
        turn,
        blur: 0.7,
        paints: ["skThread", "skThread"],
        load: 0.24 + 0.24 * hashed(k * 7.7),
        order: 561
      });
    }
    for (let k = 0; k < 30; k += 1) {
      let x = hashed(k * 5.1 + 0.4) * w, y = top + 8 + hashed(k * 3.7 + 0.9) ** 1.5 * pic * 0.55, r = (1.1 + 2.2 * hashed(k * 7.3) ** 2) * sc, id = 4e4 + k;
      put(id, {
        x,
        y,
        long: r,
        wide: 0.12,
        blur: 0.4,
        paints: ["skStar", "skStarGlow"],
        load: 0.6,
        kind: SK_TWINKLE,
        order: 565
      }), put(id, {
        x,
        y,
        long: r * 0.7,
        wide: 0.14,
        turn: Math.PI / 2,
        blur: 0.4,
        paints: ["skStar", "skStarGlow"],
        load: 0.6,
        kind: SK_TWINKLE,
        order: 565.001
      }), put(id, {
        x,
        y,
        long: r * 0.32,
        wide: 1,
        blur: r * 0.3,
        paints: ["skStarGlow", "skStar"],
        load: 0.6,
        kind: SK_GLIMMER,
        order: 565.002
      });
    }
    let low = 0.085 * pic, skyline = (x) => {
      let most = low;
      for (let [at, tall, wide] of SK_TOWERS) {
        let d = (x - at * w) / (wide * sc);
        Math.abs(d) < 1 && (most = Math.max(most, Math.min(tall * pic, wide * Math.max(sc, 0.75) * 1.15) * (1 - d * d) ** 0.55));
      }
      return most * (0.88 + 0.24 * fbm(x / (70 * sc), 3.7));
    }, edge = (x, y) => 20 * sc * (fbm(x / (26 * sc), y / (26 * sc)) - 0.5) + 9 * sc * (noise(x / (9 * sc) + 40, y / (9 * sc)) - 0.5), highest = 0;
    for (let x = 0; x <= w; x += 4)
      highest = Math.max(highest, skyline(x));
    for (let k = 0; k < 14; k += 1) {
      let x = (k + 0.5) / 14 * w;
      put(n += 1, {
        x,
        y: h - low - 0.12 * pic,
        long: 0.11 * w,
        wide: 0.42,
        blur: 0.06 * w,
        paints: ["skDusk", "skDusk"],
        load: 0.24 + 0.08 * hashed(k * 2.7),
        order: 562
      });
    }
    let farStep = 9 * sc, farLine = (x) => low * 1.4 + 0.16 * pic * fbm(x / (110 * sc) + 20, 1.3), deepest = 110 * Math.max(sc, 0.8);
    for (let gy = h - 0.45 * pic; gy < h + farStep; gy += farStep)
      for (let gx = -farStep; gx < w + farStep; gx += farStep) {
        let q = Math.round(gx / farStep) * 6113 + Math.round(gy / farStep) * 92821 + 17, x = gx + (hashed(q * 0.013 + 0.3) - 0.5) * farStep * 0.8, y = gy + (hashed(q * 0.017 + 0.2) - 0.5) * farStep * 0.8, depth = farLine(x) + 0.7 * edge(x + 300, y) - (h - y);
        if (depth < 0)
          continue;
        let f = clamp(depth / deepest, 0, 0.999), r = farStep * (0.9 + 0.3 * hashed(q * 0.023));
        put(n += 1, {
          x,
          y,
          long: r,
          wide: 0.95,
          turn: 1.2,
          blur: r * 0.45,
          paints: f < 0.3 ? ["skCloudFar", "skCloudFarShade"] : ["skCloudFarShade", "skCloudFarShade"],
          load: 0.92,
          order: 566 - f
        });
      }
    let PAIRS = [
      ["skCloudLit", "skCloud"],
      ["skCloudLit", "skCloudMid"],
      ["skCloud", "skCloudShade"],
      ["skCloudMid", "skCloudShade"],
      ["skCloudMid", "skCloudDeep"]
    ], step = 6 * sc;
    for (let gy = h - highest - 30 * sc; gy < h + step; gy += step)
      for (let gx = -step; gx < w + step; gx += step) {
        let q = Math.round(gx / step) * 7919 + Math.round(gy / step) * 104729, x = gx + (hashed(q * 0.013 + 0.1) - 0.5) * step * 0.7, y = gy + (hashed(q * 0.017 + 0.6) - 0.5) * step * 0.7, depth = skyline(x) + edge(x, y) - (h - y);
        if (depth < 0)
          continue;
        let footward = 0.7 * smooth(h - 0.24 * pic, h - 0.02 * pic, y), f = clamp(Math.max(depth / deepest, footward) + (hashed(q * 0.031) - 0.5) * 0.1, 0, 0.999), [lit, shaded] = PAIRS[Math.floor(f * PAIRS.length)], r = step * (1 + 0.6 * hashed(q * 0.023 + 0.4));
        put(n += 1, {
          x,
          y,
          long: r,
          wide: 0.95,
          turn: 1.2,
          blur: r * 0.35,
          paints: [lit, shaded],
          load: 0.95,
          order: 571 - f
        });
      }
    let hx = half, hy = h / 2, birdScale = Math.max(0.7, sc);
    SK_BIRDS.forEach((b, i) => {
      let len = b.size * birdScale, phase = 400 + i, base = 2e3 + i * 0.1, at = (lx, ly) => ({ x: hx + lx * len, y: hy + ly * len }), span = (a, z) => ({
        ...at((a[0] + z[0]) / 2, (a[1] + z[1]) / 2),
        long: Math.hypot(z[0] - a[0], z[1] - a[1]) / 2 * len,
        turn: Math.atan2(z[1] - a[1], z[0] - a[0])
      }), id = 8e4 + i * 20;
      put(id, {
        ...at(0, -0.04),
        long: len * 0.4,
        wide: 0.5,
        blur: len * 0.28,
        paints: ["skBirdGlow", "skBirdGlow"],
        load: 0.18,
        order: base,
        phase
      }), put(id + 1, {
        ...span([0, -0.01], [-0.19, -0.13]),
        wide: 0.26,
        blur: len * 0.012,
        paints: ["skBird", "skBird"],
        load: 0.96,
        order: base + 1e-3,
        phase: phase + 0.2
      }), put(id + 2, {
        ...span([-0.18, -0.125], [-0.43, -0.075]),
        wide: 0.17,
        blur: len * 0.01,
        paints: ["skBird", "skBirdSoft"],
        load: 0.94,
        kind: 0,
        order: base + 2e-3,
        phase: phase + 0.2
      }), put(id + 3, {
        ...span([0, -0.01], [0.21, -0.15]),
        wide: 0.26,
        blur: len * 0.012,
        paints: ["skBird", "skBird"],
        load: 0.96,
        order: base + 1e-3,
        phase: phase + 0.4
      }), put(id + 4, {
        ...span([0.2, -0.145], [0.49, -0.09]),
        wide: 0.17,
        blur: len * 0.01,
        paints: ["skBird", "skBirdSoft"],
        load: 0.94,
        kind: 0,
        order: base + 2e-3,
        phase: phase + 0.4
      }), put(id + 5, {
        ...at(5e-3, 0),
        long: len * 0.075,
        wide: 0.48,
        turn: 0.08,
        blur: len * 0.01,
        paints: ["skBird", "skBird"],
        load: 0.97,
        order: base + 3e-3,
        phase
      }), put(id + 6, {
        ...at(0.075, -0.012),
        long: len * 0.03,
        wide: 0.95,
        blur: len * 8e-3,
        paints: ["skBird", "skBird"],
        load: 0.97,
        order: base + 4e-3,
        phase
      }), put(id + 7, {
        ...span([-0.06, 6e-3], [-0.14, 0.024]),
        wide: 0.42,
        blur: len * 0.01,
        paints: ["skBird", "skBirdSoft"],
        load: 0.95,
        order: base + 5e-3,
        phase
      });
    });
  }
}, prepare = (mode) => (mode.flowers = mode.flowers || { ...FLOWERS, drifts: [], strays: 0, gorse: 0 }, mode.grass = mode.grass || { ...GRASS, tufts: 0, lane: 0, singles: 0 }, mode.paintNames = [...Object.keys(mode.paints), ...LEAVES], mode.slant = mode.flowers.slant === void 0 ? "0.62" : Number(mode.flowers.slant).toFixed(3), mode.lens = mode.lens || LENS, mode.school && !mode.school.fish?.length && (mode.school = null), mode.lensed = mode.flock.length > 0 || !!mode.lens.always || !!mode.school, mode), MODES = { docs: prepare(DOCS), enterprise: prepare(ENTERPRISE), flight: prepare(FLIGHT_BAND) }, modeOf = (root) => MODES[root.dataset.hlMode], DICE = `
  vec4 dice4(float p) {
    vec4 q = fract(vec4(p) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
    q += dot(q, q.wzxy + 33.33);
    return fract((q.xxyz + q.yzzw) * q.zywx);
  }
  vec2 dice2(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.xx + q.yz) * q.zy);
  }`, MOVES = `
  #define STIRS ${STIR.count}
  uniform vec4 uStirs[STIRS];
  uniform vec2 uStirWay[STIRS];
  uniform float uReach;
  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  /* How hard the wind blows at a place: a gentle sway that never stops, and gusts that run through from the left. */
  float windAt(vec2 at, float t) {
    float sway = sin(at.x * 0.0105 - t * 1.5) * 0.55 + sin(at.x * 0.024 - t * 2.2 + at.y * 0.03) * 0.25;
    float gust = smoothstep(0.42, 0.92, noise(vec2(at.x * 0.0017 - t * 0.21, at.y * 0.004 + 3.7)));
    return sway * (0.3 + 0.7 * gust) + gust * 0.75;
  }
  /* How far the stirs lean a blade rooted here. A blade answers mostly to the stir that came closest to it, which is
     when whatever it was went by: it is pushed away from its path and along its way at once, then springs back past
     upright and settles. A stir comes on over a tenth of a second rather than at once, and the stirs near a blade are
     blended, weighted heavily towards the nearest, so that as new ones are laid along the way the blade moves smoothly
     rather than in steps. A stir reaches further across than up and down, as a body going through a meadow does. */
  float stirLean(vec2 at) {
    float sum = 0.0;
    float total = 0.0;
    for (int i = 0; i < STIRS; i++) {
      vec4 s = uStirs[i];
      if (s.w <= 0.0) {
        continue;
      }
      vec2 d = at - s.xy;
      vec2 e = d / vec2(uReach, uReach * 0.62);
      float near = exp(-dot(e, e)) * s.w * smoothstep(0.0, 0.1, s.z);
      float age = max(s.z - 0.05, 0.0);
      float spring = exp(-age * 2.2) * cos(age * 6.5);
      float aside = d.x / (abs(d.x) + 9.0);
      float weight = near * near * near * near + 1e-8;
      sum += weight * near * spring * (aside * 1.1 + uStirWay[i].x * 0.7);
      total += weight;
    }
    return clamp(sum / max(total, 1e-8), -1.2, 1.2);
  }
  /* How much the grass here shows its paler side: where something has just been through it, fading as it rises again,
     and where a gust is going over. */
  float sheenOf(vec2 at, float t) {
    float trail = 0.0;
    for (int i = 0; i < STIRS; i++) {
      vec4 s = uStirs[i];
      if (s.w <= 0.0) {
        continue;
      }
      vec2 e = (at - s.xy) / vec2(uReach * 0.9, uReach * 0.38);
      trail = max(trail, exp(-dot(e, e)) * s.w * exp(-s.z * 1.1) * smoothstep(0.0, 0.1, s.z));
    }
    float gust = smoothstep(0.75, 1.35, windAt(at, t));
    return clamp(trail * 3.0 + gust * 0.24, 0.0, 1.0);
  }
  /* The same push on the land's lines, which give where the grass is parted, so that the unseen passer leaves a trodden
     way through the meadow behind it, in CSS pixels. */
  vec2 stirPush(vec2 at) {
    vec2 push = vec2(0.0);
    for (int i = 0; i < STIRS; i++) {
      vec4 s = uStirs[i];
      if (s.w <= 0.0) {
        continue;
      }
      vec2 d = at - s.xy;
      vec2 e = d / vec2(uReach * 1.2, uReach * 0.5);
      float near = exp(-dot(e, e)) * smoothstep(0.0, 0.1, s.z);
      float spring = exp(-s.z * 2.0) * cos(s.z * 6.0);
      push += vec2(d.x / (abs(d.x) + 14.0) * 4.6, 3.2) * near * s.w * spring;
    }
    return push;
  }
  /* How far a blade or a stem leans, all told: its own lean, the wind, and whatever went by. A stiffer one gives less. */
  float leanOf(vec2 root, vec4 blade, float t) {
    float give = 1.0 - blade.z;
    return blade.x + windAt(root, t + blade.y * 0.4) * 0.17 * give + stirLean(root) * mix(0.55, 1.0, give);
  }`, LAND_VERTEX = `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aPlace;
  layout(location = 1) in vec4 aLine;
  uniform vec2 uCanvas;
  uniform float uClock;
  uniform float uBreath;
  ${MOVES}
  out vec3 vSheet;
  out float vAcross;
  out float vSheen;
  void main() {
    vSheet = aLine.xyz;
    vAcross = aLine.w;
    vSheen = sheenOf(aPlace, uClock);
    vec2 pixel = aPlace;
    pixel.y += uBreath * (sin(aPlace.x * 0.0041 + uClock * 0.27) + 0.5 * sin(aPlace.x * 0.0097 - uClock * 0.19 + aPlace.y * 0.01));
    pixel += stirPush(aPlace);
    gl_Position = vec4(pixel.x / uCanvas.x * 2.0 - 1.0, 1.0 - pixel.y / uCanvas.y * 2.0, 0.0, 1.0);
  }`, LAND_PUSH = `    pixel += stirPush(aPlace);
`, landVertex = (mode) => !mode.glow && !mode.waves ? LAND_VERTEX : LAND_VERTEX.replace(
  `  out float vSheen;
`,
  `  out float vSheen;
  out float vGlow;
  uniform vec4 uGlow;
  uniform vec4 uWave;
`
).replace(
  LAND_PUSH,
  `${LAND_PUSH}    vec2 fromGlow = aPlace - uGlow.xy;
    vec2 inGlow = fromGlow / max(uGlow.zw, vec2(1.0));
    vGlow = exp(-dot(inGlow, inGlow));
    pixel.y += uWave.x * sin(aPlace.x * 6.2832 / max(uWave.y, 1.0) - uClock * uWave.z + uWave.w);
`
), LINE_FRAGMENT = `#version 300 es
  precision highp float;
  in vec3 vSheet;
  in float vAcross;
  in float vSheen;
  uniform float uSheen;
  uniform vec3 uSheenInk;
  uniform sampler2D uGrain;
  uniform sampler2D uPaint;
  uniform float uRow;
  uniform float uPatch;
  uniform float uLean;
  uniform float uOpaque;
  uniform float uLaid;
  uniform vec3 uPage;
  uniform float uSpecks;
  uniform float uUnder;
  uniform vec2 uCanvas;
  uniform float uPixels;
  uniform float uTile;
  uniform float uPitch;
  uniform float uClosest;
  uniform float uKeep;
  uniform float uFill;
  uniform float uClock;
  uniform float uFlow;
  uniform vec2 uBrick;
  uniform float uGap;
  uniform float uBeadCell;
  uniform float uBeadChance;
  uniform float uBeadSize;
  uniform float uBeadFlow;
  uniform float uGrainStrength;
  uniform vec4 uWords;
  uniform float uWordsCore;
  uniform float uSink;
  uniform float uHead;
  uniform float uDark;
  out vec4 outColor;
  const float FINEST = 8.0;
  ${DICE}
  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    vec4 dye = vec4(0.0);
    vec2 css = vec2(gl_FragCoord.x, uCanvas.y * uPixels - gl_FragCoord.y) / uPixels;
    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;

    float spread = max(vSheet.z, 0.001);
    float detail = max(min((1.0 - uKeep) * log2(spread / uPitch), log2(spread / uClosest)), -6.0);
    float level = floor(detail);
    float grow = smoothstep(0.0, 1.0, detail - level);
    float place = vSheet.x * exp2(level);
    float pitch = spread * exp2(-level);
    float even = floor(place + 0.5);
    float odd = floor(place) + 0.5;
    float fromEven = abs(place - even) * pitch;
    float fromOdd = abs(place - odd) * pitch;
    float shareEven = mix(pitch, pitch * 0.5, grow);
    float shareOdd = pitch * 0.5 * grow;
    bool isOdd = fromOdd - shareOdd * 0.4 < fromEven - shareEven * 0.4;
    float side = isOdd ? fromOdd : fromEven;
    float share = isOdd ? shareOdd : shareEven;
    float line = (isOdd ? floor(place) * 2.0 + 1.0 : even * 2.0) * exp2(FINEST - level - 1.0);
    vec4 dice = dice4(line);

    /* Its colour is a place across the sheet, the bands' edges interleaved a little from line to line and
       wandering slowly along it, and on the land broken into patches, as a wash of paint is. */
    float m = vAcross;
    float dabs = uPatch > 0.0 ? noise(css * vec2(0.018, 0.044) + uRow * 17.0) * 0.6 + noise(css * vec2(0.05, 0.11) - uRow * 9.0) * 0.4 - 0.5 : 0.0;
    float t = m + (dice.x - 0.5) * 0.022 + 0.018 * sin(vSheet.y * 0.0023 + m * 5.0) + dabs * uPatch * smoothstep(0.0, 0.12, m) + uLean * (css.x / uCanvas.x - 0.35) * smoothstep(0.0, 0.08, m);
    /* the patches never thin a sheet away below its top edge, so no page shows through the hill */
    t = max(t, min(m, 0.03));
    vec4 band = uRow >= 0.0 ? texture(uPaint, vec2(clamp(t, 0.0, 1.0), uRow)) : vec4(0.0);

    /* The air is only seen where a butterfly has been: a few of its lines hold the colour for a while. */
    float dyed = clamp(dye.a * 1.5, 0.0, 1.0) * step(dice.w, 0.42);
    vec3 paint = mix(band.rgb, dye.rgb / max(dye.a, 0.004), dyed);
    float body = max(band.a, dyed);
    /* Where the grass has been pushed over it shows its paler side, and the lines there catch the light. */
    paint = mix(paint, uSheenInk, vSheen * uSheen * 0.7);

    float fill = uFill * pow(body, 0.7) * (0.82 + 0.36 * dice.y);
    float halfWidth = share * min(fill, 0.94) * 0.5;
    float cover = (1.0 - smoothstep(halfWidth - 0.6, halfWidth + 0.6, side)) * min(1.0, halfWidth * 1.7);

    float travelled = vSheet.y;
    float run = mix(uBrick.x, uBrick.y, dice.w);
    float runAt = (travelled - uClock * uFlow * 1000.0 * (0.7 + 0.6 * dice.z)) / run + dice.x * 40.0;
    float runFrom = min(fract(runAt), 1.0 - fract(runAt)) * run;
    cover *= smoothstep(uGap - 0.5, uGap + 0.5, runFrom);
    /* the fainter it is, the more often a run goes missing altogether */
    cover *= step(dice2(vec2(line, floor(runAt))).x, 0.6 + body);

    /* Under the lines lies a body of the same colour. It is dithered by the grain rather than faded, so a
       band thins away into specks. */
    float haze = smoothstep(grain - 0.2, grain + 0.2, smoothstep(0.32, 0.96, body));
    vec3 color = mix(paint + (vec3(1.0) - paint) * mix(0.3, 0.0, uDark), paint * (0.92 + 0.16 * dice.y), cover);
    float alpha = max(cover, haze * uUnder);

    /* overlay, so white stays white and the colours take the grain */
    vec3 overlaid = mix(2.0 * color * grain, 1.0 - 2.0 * (1.0 - color) * (1.0 - grain), step(0.5, color));
    color = mix(color, overlaid, uGrainStrength);

    /* The beads slide along a little faster than the line does. Out where the line itself has faded they
       carry on, and that is the stipple the reference's paper is made of. */
    float spot = (travelled - uClock * uFlow * 1000.0 * uBeadFlow * (0.6 + 0.8 * dice.y)) / uBeadCell + dice.z * 57.0;
    vec2 roll = dice2(vec2(line, floor(spot)));
    float beadAt = (fract(spot) - 0.2 - 0.6 * roll.y) * uBeadCell;
    float size = fract(roll.y * 7.0);
    float radius = uBeadSize * (0.5 + 0.8 * size * size) * (isOdd ? grow : 1.0);
    float bead = 1.0 - smoothstep(radius - 0.5, radius + 0.5, length(vec2(beadAt, side)));
    bead *= step(roll.x, uBeadChance * mix(uSpecks, 1.0, smoothstep(0.0, 0.5, body))) * min(1.0, radius * 1.4);
    /* pale on the colour, and a speck of the colour off it */
    vec3 beadInk = mix(paint, vec3(1.0, 0.98, 0.94), alpha);
    color = mix(color, beadInk, bead * 0.92);
    alpha = max(alpha, bead * mix(0.62, 1.0, alpha));

    /* It shoots across on the way in, each line a little ahead of or behind the next. */
    float along = css.x / uCanvas.x;
    float front = uHead * 1.3 - dice.x * 0.3;
    float shown = 1.0 - smoothstep(front - 0.012, front, along);

    /* it thins into specks at the foot of the hero and round the words, so nothing is simply cut off */
    float sink = (uCanvas.y - css.y) / uSink;
    /* round the words a soft oval of page: clear in its middle, thinning out to its rim */
    float clear = smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw));
    float stay = clamp(min(sink, clear), 0.0, 1.0);
    float keepHere = shown * smoothstep(grain - 0.25, grain + 0.25, stay);
    alpha *= keepHere;

    /* Land hides what is behind it, under a wash of its own colour, so no page shows through between its lines.
       Its edge is thinned by the grain like everything else. */
    vec4 own = texture(uPaint, vec2(clamp(t, 0.0, 1.0), max(uRow, 0.0)));
    float covered = smoothstep(grain - 0.25, grain + 0.25, own.a * 1.8);
    /* A sheet laid on other land has no page to hide at its top edge, and a wash that came in there ahead of its haze
       would show along the seam as a strip of its own, a dark crease on a dark page and a pale line on a light one. So
       there it comes in with the haze. */
    covered = mix(covered, haze, uLaid * step(m, 0.5));
    float solid = uOpaque * keepHere * covered;
    vec3 wash = mix(uPage, own.rgb, mix(0.42, 0.34, uDark));
    outColor = vec4(min(color, vec3(1.0)) * alpha + wash * solid * (1.0 - alpha), alpha + solid * (1.0 - alpha));
  }`, BLADE_VERTEX = `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aCorner;
  layout(location = 1) in vec4 aRoot;
  layout(location = 2) in vec4 aInk;
  layout(location = 3) in vec4 aBlade;
  uniform vec2 uCanvas;
  uniform float uClock;
  uniform float uIntro;
  ${MOVES}
  out vec2 vLocal;
  flat out vec4 vCurve;
  flat out vec4 vInk;
  flat out vec2 vWide;
  void main() {
    vec2 root = aRoot.xy;
    /* It grows up out of the land once the lines are in. */
    float grown = smoothstep(0.0, 1.0, clamp((uIntro - aBlade.w) / 0.9, 0.0, 1.0));
    float h = aRoot.z * grown;
    float lean = leanOf(root, aBlade, uClock);
    vec2 tip = vec2(sin(lean), cos(lean)) * h;
    /* it bends more towards its tip than at its root */
    vec2 ctrl = vec2(sin(lean * 0.4), cos(lean * 0.4)) * h * 0.55;
    float pad = aRoot.w + 1.5 + aInk.w * 0.5;
    vec2 lo = min(vec2(0.0), min(ctrl, tip)) - pad;
    vec2 hi = max(vec2(0.0), max(ctrl, tip)) + pad;
    vec2 local = mix(lo, hi, aCorner);
    vLocal = local;
    vCurve = vec4(ctrl, tip);
    vInk = aInk;
    vWide = vec2(aRoot.w, h);
    vec2 pixel = root + vec2(local.x, -local.y);
    gl_Position = vec4(pixel.x / uCanvas.x * 2.0 - 1.0, 1.0 - pixel.y / uCanvas.y * 2.0, 0.0, 1.0);
  }`, bladeFragment = (mode) => `#version 300 es
  precision highp float;
  in vec2 vLocal;
  flat in vec4 vCurve;
  flat in vec4 vInk;
  flat in vec2 vWide;
  uniform sampler2D uGrain;
  uniform vec3 uInks[${mode.grass.inks.length}];
  uniform vec2 uCanvas;
  uniform float uPixels;
  uniform float uTile;
  uniform float uGrainStrength;
  uniform vec4 uWords;
  uniform float uWordsCore;
  uniform float uSink;
  uniform float uHead;
  out vec4 outColor;
  float dot2(vec2 v) {
    return dot(v, v);
  }
  /* The distance to a quadratic Bezier curve, after Inigo Quilez. */
  float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {
    vec2 a = B - A;
    vec2 b = A - 2.0 * B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    float kk = 1.0 / max(dot(b, b), 1e-6);
    float kx = kk * dot(a, b);
    float ky = kk * (2.0 * dot(a, a) + dot(d, b)) / 3.0;
    float kz = kk * dot(d, a);
    float res = 0.0;
    float p = ky - kx * kx;
    float p3 = p * p * p;
    float q = kx * (2.0 * kx * kx - 3.0 * ky) + kz;
    float h = q * q + 4.0 * p3;
    if (h >= 0.0) {
      h = sqrt(h);
      vec2 x = (vec2(h, -h) - q) / 2.0;
      vec2 uv = sign(x) * pow(abs(x), vec2(1.0 / 3.0));
      float t = clamp(uv.x + uv.y - kx, 0.0, 1.0);
      res = dot2(d + (c + b * t) * t);
    } else {
      float z = sqrt(-p);
      float v = acos(q / (p * z * 2.0)) / 3.0;
      float m = cos(v);
      float n = sin(v) * 1.732050808;
      vec3 t = clamp(vec3(m + m, -n - m, n - m) * z - kx, 0.0, 1.0);
      res = min(dot2(d + (c + b * t.x) * t.x), dot2(d + (c + b * t.y) * t.y));
    }
    return sqrt(res);
  }
  void main() {
    if (vWide.y < 0.3) {
      discard;
    }
    float d = sdBezier(vLocal, vec2(0.0), vCurve.xy, vCurve.zw);
    float t = clamp(vLocal.y / max(vCurve.w, 0.001), 0.0, 1.0);
    float halfW = vWide.x * 0.5 * (1.0 - 0.78 * t);
    /* Thinner than a pixel, a line would fall between the pixels' middles and break into dashes, so how much a pixel
       shows is how much of it the line covers: a fine blade is paler, and never broken. */
    float truePx = halfW * 2.0 * uPixels;
    float cover = clamp((halfW - d) * uPixels + 0.5, 0.0, 1.0) * min(1.0, truePx);
    /* A flower's stem out of focus spreads over its soft edge, and is as much fainter as it is wider, so that it never
       grows heavier; a blade of grass is always sharp. */
    float soft = vInk.w;
    if (soft > 0.0) {
      cover = smoothstep(-0.5, 0.5, (halfW - d) / (soft + 1.0 / uPixels)) * min(1.0, halfW * 2.0 / (halfW * 2.0 + soft * 0.8));
    }
    if (cover <= 0.0) {
      discard;
    }
    int i = int(vInk.x);
    vec3 color = mix(uInks[i], uInks[min(i + 1, ${mode.grass.inks.length - 1})], vInk.y);
    color *= mix(0.92, 1.06, t);
    vec2 css = vec2(gl_FragCoord.x, uCanvas.y * uPixels - gl_FragCoord.y) / uPixels;
    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;
    vec3 overlaid = mix(2.0 * color * grain, 1.0 - 2.0 * (1.0 - color) * (1.0 - grain), step(0.5, color));
    color = mix(color, overlaid, uGrainStrength);
    /* It thins into specks at the foot of the hero and round the words, as the land's lines do. */
    float sink = (uCanvas.y - css.y) / uSink;
    float stay = clamp(min(sink, smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw))), 0.0, 1.0);
    float keep = smoothstep(grain - 0.25, grain + 0.25, stay);
    float front = uHead * 1.3 - 0.15;
    keep *= 1.0 - smoothstep(front - 0.02, front, css.x / uCanvas.x);
    float alpha = cover * vInk.z * keep;
    outColor = vec4(color * alpha, alpha);
  }`, TWINKLE = `float kind = aPaint.z;
    float twinkle = 1.0;
    if (kind > 2.5) {
      float depth = kind > 3.3 ? 0.35 : 0.8;
      kind -= 3.0;
      float rate = 0.8 + 1.5 * fract(aDab.w * 13.7);
      float wave = 0.5 + 0.5 * sin(uClock * rate + aDab.w * 61.0);
      float flick = 0.5 + 0.5 * sin(uClock * rate * 2.7 + aDab.w * 17.0);
      twinkle = 1.0 - depth * (1.0 - pow(wave, 1.5) * (0.75 + 0.25 * flick));
    }`, PUSH_LEAN = "float lean = aBlade.x + windAt(root, uClock + aBlade.y * 0.4) * 0.17 * give + stirred * mix(0.55, 1.0, give);", bloomVertexOf = (mode) => {
  let vertex = bloomVertex(mode);
  return !mode.push || !vertex.includes(PUSH_LEAN) || !vertex.includes("uniform float uPixels;") ? vertex : vertex.replace("uniform float uPixels;", `uniform float uPixels;
  uniform vec2 uPush;`).replace(PUSH_LEAN, PUSH_LEAN.replace("give);", "give) + uPush.x * sign(root.x - uPush.y) * give;"));
}, TALK_BREADTH = "float breadth = aDab.x * scale;", TALK_PLACE = "vec2 pixel = root + vec2(tip.x, -tip.y) + along * local.x + across * local.y;", talkVertex = (mode, vertex) => {
  if (!mode.talk || !vertex.includes(TALK_BREADTH) || !vertex.includes(TALK_PLACE) || !vertex.includes("uniform float uPixels;"))
    return vertex;
  let load = vertex.match(/vLoad = aPaint\.w[^;]*;/);
  if (!load)
    return vertex;
  let lift = mode.talk.lift || 0, centre = ((1 - lift) / (2 * (1 + lift))).toFixed(5);
  return vertex.replace("uniform float uPixels;", `uniform float uPixels;
  uniform vec2 uTalk;`).replace(
    TALK_BREADTH,
    `${TALK_BREADTH}
    float talkCode = aBlade.z >= 0.999 ? aBlade.y : 0.0;
    bool inside = talkCode >= 199.0 && talkCode < 299.0;
    if (inside) {
      reach *= max(uTalk.x, 0.04);
    }`
  ).replace(load[0], `${load[0]}
    if (inside) {
      vLoad *= smoothstep(0.05, 0.3, uTalk.x);
    }`).replace(
    TALK_PLACE,
    `${TALK_PLACE}
    if (talkCode >= 299.0) {
      pixel.y -= uTalk.x * (talkCode - 300.0);
    } else if (inside) {
      pixel.y += uTalk.x * (talkCode - 200.0) * ${centre};
    } else if (talkCode >= 99.0) {
      pixel.y += uTalk.x * (talkCode - 100.0);
    }
    if (talkCode >= 99.0) {
      pixel.y += uTalk.y;
    }`
  );
}, schoolVertex = (mode, vertex) => {
  if (!mode.school || !vertex.includes(TALK_PLACE) || !vertex.includes("uniform float uPixels;"))
    return vertex;
  let n = mode.school.fish.length;
  return vertex.replace(
    "uniform float uPixels;",
    `uniform float uPixels;
  uniform vec4 uFish[${n * 2}];
  uniform vec2 uSchool;`
  ).replace(
    TALK_PLACE,
    `${TALK_PLACE}
    if (aBlade.z >= 0.999 && aBlade.y >= 399.5 && aBlade.y < ${400 + n}.0) {
      int fish = int(aBlade.y - 400.0 + 0.5) * 2;
      float part = aBlade.y - 400.0 - float(fish / 2);
      vec4 now = uFish[fish];
      vec4 body = uFish[fish + 1];
      vec2 rel = pixel - uSchool;
      if (part > 0.1) {
        float swing = body.z * sin(now.w) * (part > 0.3 ? -1.0 : 1.0);
        vec2 shoulder = vec2(0.0, -0.01) * body.x;
        vec2 arm = rel - shoulder;
        rel = shoulder + vec2(cos(swing) * arm.x - sin(swing) * arm.y, sin(swing) * arm.x + cos(swing) * arm.y);
      }
      float behind = 1.0 - smoothstep(-0.5 * body.x, 0.0, rel.x);
      rel.y += body.y * behind * sin(now.w + rel.x / max(body.x, 1.0) * 5.0);
      float c = cos(now.z);
      float s = sin(now.z);
      pixel = now.xy + vec2(c * rel.x - s * rel.y, s * rel.x + c * rel.y);
    }`
  );
}, bloomVertex = (mode) => `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aCorner;
  layout(location = 1) in vec4 aRoot;
  layout(location = 2) in vec4 aDab;
  layout(location = 3) in vec4 aBlade;
  layout(location = 4) in vec4 aPaint;
  uniform vec2 uCanvas;
  uniform float uClock;
  uniform float uIntro;
  uniform float uPixels;
  uniform vec3 uPaints[${mode.paintNames.length}];
  ${MOVES}
  out vec2 vLocal;
  flat out vec4 vDab;
  flat out vec4 vLook;
  flat out vec3 vInk;
  flat out vec3 vSecond;
  flat out float vLoad;
  void main() {
    vec2 root = aRoot.xy;
    /* It comes up out of the land once the lines are in, and the paint goes on as it does. */
    float grown = smoothstep(0.0, 1.0, clamp((uIntro - aBlade.w) / 0.9, 0.0, 1.0));
    float open = smoothstep(0.0, 1.0, clamp((uIntro - aBlade.w - 0.4) / 0.8, 0.0, 1.0));
    /* the lean of leanOf, with the stirs' part kept to hand */
    float give = 1.0 - aBlade.z;
    float stirred = stirLean(root);
    float lean = aBlade.x + windAt(root, uClock + aBlade.y * 0.4) * 0.17 * give + stirred * mix(0.55, 1.0, give);
    vec2 tip = vec2(sin(lean), cos(lean)) * aRoot.z * grown;
    tip.x += stirred * aRoot.w * 0.6;
    tip.y *= 1.0 - 0.25 * abs(stirred);
    float scale = 0.3 + 0.7 * open;
    float reach = aRoot.w * scale;
    float breadth = aDab.x * scale;
    float blur = aDab.z;
    float dice = aDab.w;
    /* A flower painted with its petals faces us; a stroke lies along its own length. Both turn as they lean. */
    ${mode.twinkle ? `${TWINKLE}
    bool flower = kind > 0.5;` : "bool flower = aPaint.z > 0.5;"}
    float turn = aDab.y + lean * (flower ? 0.8 : 0.7);
    vec2 along = vec2(cos(turn), sin(turn));
    vec2 across = vec2(-along.y, along.x);
    /* the box reaches past the soft edge, and a stroke bows by up to half its width and wanders a little at its edge; a
       composition that lays many large round strokes (\`tight\`) fits the box to how far each can bow, as a round one
       hardly does, so that it shades fewer pixels for nothing */
    float pad = blur * 0.5 + 1.0 / uPixels + 0.5;
    vec2 box = flower ? vec2(reach * 1.1 + pad) : vec2(reach * 1.12 + pad, breadth * ${mode.tight ? "(1.12 + 0.48 * (1.0 - smoothstep(0.72, 0.9, breadth / max(reach, 1e-3))))" : "1.6"} + pad);
    vec2 local = (aCorner * 2.0 - 1.0) * box;
    vLocal = local;
    vDab = vec4(reach, breadth, blur, dice);
    /* which way is up in the stroke's own terms, for the light on it; how far it has come out; and what it is */
    vLook = vec4(-along.y, -along.x, open, ${mode.twinkle ? "kind" : "aPaint.z"});
    /* each a little lighter or darker, warmer or cooler than the next */
    float light = 1.0 + (fract(dice * 91.7) - 0.5) * 0.08;
    vec3 warm = vec3(1.0, 0.0, -1.0) * (fract(dice * 37.3) - 0.5) * 0.04;
    vInk = clamp(uPaints[int(aPaint.x + 0.5)] * light + warm, 0.0, 1.0);
    vSecond = clamp(uPaints[int(aPaint.y + 0.5)] * light + warm, 0.0, 1.0);
    /* how much paint it carries, or how many petals it has */
    vLoad = aPaint.w${mode.twinkle ? " * twinkle" : ""};
    vec2 pixel = root + vec2(tip.x, -tip.y) + along * local.x + across * local.y;
    gl_Position = vec4(pixel.x / uCanvas.x * 2.0 - 1.0, 1.0 - pixel.y / uCanvas.y * 2.0, 0.0, 1.0);
  }`, NOUGHT = `if (vLook.w > 1.5) {
      vec2 p = vec2(vLocal.y, vLocal.x);
      vec2 ab = vec2(breadth, reach);
      float k = length(p / ab);
      float g = length(p / (ab * ab)) / max(k, 1e-4);
      float ring = abs((k - 1.0) / max(g, 1e-4)) - max(0.3, 0.55 / uPixels);
      cover = 1.0 - smoothstep(-0.5 * spread, 0.5 * spread, ring);
      if (cover < 0.004) {
        discard;
      }
      c = ink;
      body = vLoad;
    } else `, MARK = "fract(vLook.w * 100.0 + 0.001)", MIST_STAY = `
    if (abs(${MARK} - 0.251) < 0.05 || abs(${MARK} - 0.751) < 0.05) {
      stay = min(stay, smoothstep(uMist.x, uMist.y, css.y));
    }`, EVEN_ROUND = `
      if (abs(${MARK} - 0.501) < 0.05 || abs(${MARK} - 0.751) < 0.05) {
        roundness = 1.0;
      }`, LIGHT_FOOT = (fade) => `float thin = smoothstep(grain - 0.25, grain + 0.25, stay);
    float fade = smoothstep(0.08, 0.32, land);
    if (vLook.w > 0.3 && vLook.w < 0.5 && abs(${MARK} - 0.501) < 0.05) {
      float lightPage = step(0.5, dot(uPage, vec3(0.3, 0.59, 0.11)));
      float white = smoothstep(0.96, 0.995, min(c.r, min(c.g, c.b)));
      float words = clamp(smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw)), 0.0, 1.0);
      float foot = smoothstep(0.0, 1.0, clamp(sink, 0.0, 1.0));
      thin = smoothstep(grain - 0.25, grain + 0.25, words) * mix(foot, 1.0, lightPage * white);
      fade = mix(fade, 1.0, 1.0 - step(1.0, sink));
    }
    alpha *= thin * smoothstep(0.0, 0.3, vLook.z)${fade ? " * fade" : ""};`, bloomFragment = (mode) => `#version 300 es
  precision highp float;
  in vec2 vLocal;
  flat in vec4 vDab;
  flat in vec4 vLook;
  flat in vec3 vInk;
  flat in vec3 vSecond;
  flat in float vLoad;
  uniform sampler2D uGrain;
  uniform sampler2D uLand;
  uniform vec3 uPaints[${mode.paintNames.length}];
  uniform vec2 uCanvas;
  uniform float uPixels;
  uniform float uTile;
  uniform vec4 uWords;
  uniform float uWordsCore;
  uniform float uSink;
  uniform vec3 uPage;${mode.marks ? `
  uniform vec2 uMist;` : ""}
  out vec4 outColor;
  float rnd(float n) {
    return fract(sin(n) * 43758.5453);
  }
  void main() {
    float reach = vDab.x;
    float breadth = vDab.y;
    float blur = vDab.z;
    float dice = vDab.w;
    float spread = blur + 1.0 / uPixels;
    vec3 ink = vInk;
    vec3 second = vSecond;
    float pale = smoothstep(0.72, 0.95, dot(ink, vec3(0.3, 0.59, 0.11)));
    vec3 c;
    float cover;
    float body;
    if (vLook.w < 0.5) {
      /* Along the stroke, from where the brush came down (-1) to where it lifted (1). It narrows as the brush lifts, and
         bows a little, one way or the other; a round dab, out of focus, hardly does either, or it would be a heart or a
         crescent. */
      float s = vLocal.x / reach;
      float roundness = smoothstep(0.72, 0.9, breadth / max(reach, 1e-3));${mode.marks ? EVEN_ROUND : ""}
      float halfW = breadth * (1.0 - 0.3 * (1.0 - 0.7 * roundness) * smoothstep(-0.5, 1.0, s));
      float y = vLocal.y + (dice - 0.5) * breadth * 0.9 * (1.0 - roundness) * (s * s - 1.0);
      float t = y / halfW;
      float a = atan(t, s);
      float wander = (0.07 * sin(a * 2.0 + dice * 40.0) + 0.05 * sin(a * 3.0 - dice * 23.0)) * halfW;
      float d = (length(vec2(s, t)) - 1.0) * halfW - wander;
      cover = 1.0 - smoothstep(-0.5 * spread, 0.5 * spread, d);
      if (cover < 0.004) {
        discard;
      }
      c = mix(ink, second, clamp(0.5 + 0.45 * s, 0.0, 1.0));
      /* The bristles. A stroke too small or too blurred to show them is smooth, and on a pale paint they show less, so
         that it never looks striped. They keep their spacing where the stroke narrows, so some simply end there rather
         than bunching up into a shell's ribs. */
      float fine = smoothstep(1.2, 3.5, breadth * uPixels) * (1.0 - smoothstep(0.7, 2.2, blur)) * (1.0 - 0.55 * pale);
      /* a leaf's are left out: on its dark green they would read as jagged steps where it narrows */
      fine *= 1.0 - step(0.2, vLook.w);
      if (fine > 0.0) {
        float lane = (clamp(y, -breadth, breadth) + breadth) / 1.5;
        /* and never evenly: the lanes wander from one to the next and a little along the stroke */
        lane += 0.3 * sin(lane * 2.3 + dice * 40.0) + 0.15 * sin(s * 3.0 + dice * 9.0);
        float id = floor(lane);
        float off = abs(fract(lane) - 0.5) * 2.0;
        float r1 = rnd(id * 7.13 + dice * 91.7);
        float r2 = rnd(id * 3.71 + dice * 17.3 + 4.1);
        float dryAt = 0.62 + 0.5 * r2;
        float dry = smoothstep(dryAt - 0.3, dryAt + 0.05, s * 0.5 + 0.5);
        float gap = smoothstep(0.4, 0.95, off);
        cover *= 1.0 - fine * clamp(dry * 0.95 + gap * (0.06 + 0.7 * dry), 0.0, 1.0);
        /* the brush's two colours run into each other a little differently on every bristle */
        c = mix(c, mix(ink, second, clamp(0.5 + 0.45 * s + (r1 - 0.5) * 0.8, 0.0, 1.0)), fine);
        c *= 1.0 + fine * ((r1 - 0.5) * 0.12 - gap * 0.035);
      }
      /* the light from above: paler on its upper side, deeper on its lower */
      float lit = dot(vec2(s * 0.4, clamp(t, -1.0, 1.0)), vLook.xy);
      c = mix(c, c * 0.9, smoothstep(0.1, 1.0, -lit) * 0.55);
      c = mix(c, c + (1.0 - c) * 0.35, smoothstep(0.2, 1.0, lit) * 0.6);
      /* Spread over its soft edge, its colour thins as much as the stroke grows, a little less for a pale paint, so that
         a blurred white does not go to milk, and a large soft one keeps much of its heart. */
      float grow = (reach * breadth) / ((reach + 0.5 * blur) * (breadth + 0.5 * blur));
      body = vLoad * mix(pow(grow, mix(0.85, 0.5, pale)), 1.0, 0.5 * smoothstep(3.0, 7.0, blur));
    } else ${mode.glyphs ? NOUGHT : ""}{
      /* A cosmos, seen across the meadow at a slant: broad petals with little teeth at their tips, no two quite alike and
         now and then one missing, each a stroke of its own from the heart out, and a soft heart of gold. */
      vec2 q = vec2(vLocal.x, -vLocal.y / ${mode.slant});
      float R = reach;
      float n = max(vLoad, 5.0);
      float rr = length(q);
      float sector = atan(q.x, q.y) / 6.2831853 * n;
      float which = floor(sector + 0.5);
      float psi = sector - which;
      float pd = rnd(which * 12.9898 + dice * 78.233);
      float edge = R * (0.78 + 0.45 * pd) * (0.5 + 0.5 * pow(max(1.0 - pow(abs(2.0 * psi), 2.6), 0.0), 0.5));
      edge -= R * 0.07 * (0.5 + 0.5 * cos(psi * 18.85));
      cover = 1.0 - smoothstep(-0.5 * spread, 0.5 * spread, rr - edge);
      cover *= max(step(0.15, rnd(which * 3.1 + dice * 9.0)), 1.0 - smoothstep(R * 0.2, R * 0.35, rr));
      if (cover < 0.004) {
        discard;
      }
      float outward = rr / max(edge, 1e-3);
      float streak = abs(fract(psi * 4.0 + pd * 3.0) - 0.5) * 2.0;
      c = mix(mix(ink, second, 0.5), ink, smoothstep(0.12, 0.8, outward));
      c *= 1.0 + (streak - 0.5) * 0.1 * smoothstep(0.2, 0.6, outward);
      /* where two petals meet, a fine line of light */
      float seam = 1.0 - smoothstep(0.0, 0.08, 0.5 - abs(psi));
      c = mix(c, c + (1.0 - c) * 0.5, seam * smoothstep(0.2, 0.5, outward) * 0.4);
      float lit = dot(q / R, vec2(vLook.x, -vLook.y));
      c = mix(c, c + (1.0 - c) * 0.3, smoothstep(0.2, 0.9, lit) * 0.5);
      float heartR = R * 0.22;
      float inHeart = 1.0 - smoothstep(-0.5 * spread, 0.5 * spread, rr - heartR);
      vec3 gold = mix(uPaints[${mode.paintNames.indexOf("gold")}], uPaints[${mode.paintNames.indexOf("butter")}], smoothstep(0.75, 0.0, length(q / heartR + vec2(0.3, -0.35))));
      c = mix(c, gold, inHeart * 0.85);
      body = 0.95;
    }
    vec2 css = vec2(gl_FragCoord.x, uCanvas.y * uPixels - gl_FragCoord.y) / uPixels;
    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;
    /* overlay, so the paint takes the grain the land has; a large soft one less, so its body is smooth */
    vec3 overlaid = mix(2.0 * c * grain, 1.0 - 2.0 * (1.0 - c) * (1.0 - grain), step(0.5, c));
    c = mix(c, overlaid, ${mode.film ? `mix(${mode.film[0].toFixed(3)}, ${mode.film[1].toFixed(3)}, smoothstep(2.0, 6.0, blur))` : "mix(0.35, 0.15, smoothstep(2.0, 6.0, blur))"});
    /* An edge breaks up into specks rather than fading, as the land's edges do, and a soft one as dry paint does. */
    float alpha = cover * body;
    alpha = mix(alpha, smoothstep(grain - 0.3, grain + 0.3, alpha), mix(0.45, 0.32, smoothstep(0.5, 3.0, blur))${mode.glyphs ? " * step(vLook.w, 1.5) * (1.0 - step(0.3, vLook.w) * step(vLook.w, 0.5))" : ""});
    /* It thins into specks at the foot of the hero and round the words, as the land's lines do, and fades where the
       land fades into the page. The land's picture is opaque, page and all, so that is where its colour, read three
       pixels blurred so that its lines do not show through as stripes but its edge stays close, comes close to the
       page's. */
    float sink = (uCanvas.y - css.y) / uSink;
    float stay = clamp(min(sink, smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw))), 0.0, 1.0);${mode.marks ? MIST_STAY : ""}
    float land = distance(textureLod(uLand, gl_FragCoord.xy / (uCanvas * uPixels), log2(3.0 * uPixels)).rgb, uPage);
    ${mode.lightFoot ? LIGHT_FOOT(!(mode.sky || mode.onPage)) : `alpha *= smoothstep(grain - 0.25, grain + 0.25, stay) * smoothstep(0.0, 0.3, vLook.z)${mode.sky || mode.onPage ? "" : " * smoothstep(0.08, 0.32, land)"};`}
    outColor = vec4(min(c, vec3(1.0)) * alpha, alpha);
  }`, CLOUD_VERTEX = `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aCorner;
  uniform vec2 uCanvas;
  uniform vec4 uBox;
  out vec2 vLocal;
  void main() {
    vLocal = mix(uBox.xy, uBox.zw, aCorner);
    vec2 pixel = vLocal;
    gl_Position = vec4(pixel.x / uCanvas.x * 2.0 - 1.0, 1.0 - pixel.y / uCanvas.y * 2.0, 0.0, 1.0);
  }`, CLOUD_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 vLocal;
  uniform sampler2D uGrain;
  uniform sampler2D uLand;
  uniform vec2 uCanvas;
  uniform float uPixels;
  uniform float uTile;
  uniform vec4 uPuffs[8];
  uniform int uCount;
  uniform float uSize;
  uniform float uBlur;
  uniform float uDark;
  uniform vec3 uFrost;
  uniform vec3 uShade;
  uniform vec4 uWords;
  uniform float uWordsCore;
  out vec4 outColor;
  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }
  void main() {
    vec2 p = vLocal;
    float d = 1e9;
    for (int i = 0; i < 8; i++) {
      if (i >= uCount) {
        break;
      }
      vec4 puff = uPuffs[i];
      d = smin(d, length(p - puff.xy) - puff.z, uSize * 0.22);
    }
    /* a flat base */
    float base = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uCount) {
        break;
      }
      base = max(base, uPuffs[i].y + uPuffs[i].z * 0.35);
    }
    d = max(d, p.y - base);
    float cover = clamp(0.5 - d * uPixels, 0.0, 1.0);
    if (cover <= 0.0) {
      discard;
    }
    float thick = smoothstep(0.0, uSize * 0.55, -d);
    vec2 slope = vec2(dFdx(thick), dFdy(thick)) * uPixels;
    vec2 at = gl_FragCoord.xy;
    vec2 size = uCanvas * uPixels;
    /* The land through frosted glass: blurred, a little bent, and pale. */
    vec2 bend = slope * uSize * 3.0 * uPixels;
    vec3 seen = vec3(
      textureLod(uLand, (at - bend * 1.3) / size, uBlur).r,
      textureLod(uLand, (at - bend) / size, uBlur).g,
      textureLod(uLand, (at - bend * 0.75) / size, uBlur).b
    );
    float up = clamp((base - p.y) / (uSize * 1.4), 0.0, 1.0);
    vec3 c = mix(seen, uFrost, mix(0.55, 0.45, uDark));
    /* its underside in its own shade, its top catching the light */
    c = mix(c, uShade, (1.0 - up) * 0.4 + 0.06);
    vec3 nrm = normalize(vec3(-slope * uSize * 0.8, 1.0));
    float glint = pow(max(dot(nrm, normalize(vec3(-0.3, 0.7, 0.65))), 0.0), 16.0);
    c += vec3(0.18) * glint * up;
    /* the edge comes apart into colours, as all the glass here does */
    float edgePx = -d * uPixels;
    vec3 fringe = (vec3(edgePx) + vec3(-0.4, 0.0, 0.4)) / 1.3;
    vec3 lip = vec3(1.0) - smoothstep(vec3(0.4), vec3(1.6), fringe);
    c = mix(c, mix(uShade * 0.92, vec3(1.0), 0.3 + 0.7 * up), lip * 0.8);
    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;
    vec3 overlaid = mix(2.0 * c * grain, 1.0 - 2.0 * (1.0 - c) * (1.0 - grain), step(0.5, c));
    c = mix(c, overlaid, 0.3);
    float show = cover * mix(mix(0.5, 0.14, uDark), mix(0.85, 0.36, uDark), thick);
    /* It clears away round the words as the land does, but evenly: glass has no lines to thin. */
    vec2 css = vec2(at.x, size.y - at.y) / uPixels;
    show *= smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw));
    outColor = vec4(min(c, vec3(1.0)) * show, show);
  }`, FULL_VERTEX = `#version 300 es
  void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
  }`, COPY_FRAGMENT = `#version 300 es
  precision highp float;
  uniform sampler2D uLand;
  out vec4 outColor;
  void main() {
    outColor = texelFetch(uLand, ivec2(gl_FragCoord.xy), 0);
  }`, CUT_FRAGMENT = `#version 300 es
  precision highp float;
  uniform vec4 uBox;
  uniform vec4 uRadii;
  uniform float uHeight;
  out vec4 outColor;
  void main() {
    vec2 p = vec2(gl_FragCoord.x, uHeight - gl_FragCoord.y);
    vec2 centre = (uBox.xy + uBox.zw) * 0.5;
    vec2 size = (uBox.zw - uBox.xy) * 0.5;
    vec2 side = step(centre, p);
    float r = mix(mix(uRadii.x, uRadii.y, side.x), mix(uRadii.w, uRadii.z, side.x), side.y);
    vec2 q = abs(p - centre) - size + r;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    outColor = vec4(0.0, 0.0, 0.0, clamp(0.5 - d, 0.0, 1.0));
  }`, SKY_FRAGMENT = `#version 300 es
  precision highp float;
  uniform sampler2D uGrain;
  uniform vec2 uCanvas;
  uniform float uPixels;
  uniform float uTile;
  uniform vec3 uSky[8];
  uniform float uSkyAt[8];
  uniform int uSkyCount;
  uniform float uBrush;
  uniform float uGrainStrength;
  out vec4 outColor;
  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  void main() {
    vec2 css = vec2(gl_FragCoord.x, uCanvas.y * uPixels - gl_FragCoord.y) / uPixels;
    /* how far down, wandering a little from side to side, so the bands between the inks are laid on with a brush */
    float down = css.y / uCanvas.y + (noise(css * vec2(0.011, 0.06)) - 0.5) * uBrush;
    vec3 c = uSky[0];
    for (int i = 1; i < 8; i++) {
      if (i >= uSkyCount) {
        break;
      }
      c = mix(c, uSky[i], smoothstep(uSkyAt[i - 1], uSkyAt[i], down));
    }
    c *= 1.0 + (noise(css * vec2(0.02, 0.15) + 7.0) - 0.5) * uBrush * 0.5;
    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;
    vec3 overlaid = mix(2.0 * c * grain, 1.0 - 2.0 * (1.0 - c) * (1.0 - grain), step(0.5, c));
    outColor = vec4(clamp(mix(c, overlaid, uGrainStrength), 0.0, 1.0), 1.0);
  }`, LENS_VERTEX = `#version 300 es
  void main() {
    // One triangle that covers the screen.
    vec2 p = vec2(gl_VertexID == 1 ? 3.0 : -1.0, gl_VertexID == 2 ? 3.0 : -1.0);
    gl_Position = vec4(p, 0.0, 1.0);
  }`, LENS_FRAGMENT = `#version 300 es
  precision highp float;
  uniform sampler2D uFlock;
  uniform sampler2D uLand;
  uniform vec2 uRes;
  uniform vec2 uCentre;
  uniform vec2 uHalf;
  uniform vec2 uBand;
  uniform float uIn;
  uniform float uBend;
  uniform float uSplit;
  uniform float uAlong;
  uniform float uSoften;
  uniform float uRound;
  uniform vec2 uHalo;
  out vec4 o;

  const int TAPS = 7;

  vec2 uvOf(vec2 px) {
    return vec2(px.x / uRes.x, 1.0 - px.y / uRes.y);
  }

  void main() {
    /* The foot of the hero is not an edge of the screen, and the page carries on under it, so the picture fades out
       there. Here and not as a mask in the page's styles, which would have the browser composite the whole canvas a
       second time every frame. */
    float foot = clamp(gl_FragCoord.y / (uRes.y * 0.1), 0.0, 1.0);
    /* the land is the same size as the screen, and no glass touches it */
    vec3 behind = texelFetch(uLand, ivec2(gl_FragCoord.xy), 0).rgb;
    vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
    /* Glass gives off a little light onto the land around it. A lower mip of the flock is a blurred copy of it already. */
    vec4 soft = textureLod(uFlock, uvOf(px), uHalo.x);
    vec2 d = px - uCentre;
    /* How far into the band along each edge this pixel is, as the height v of the lens on /products/agent,
       and the two together as a rounded box, so the lens has no seam across its corners. */
    vec2 each = uIn + (abs(d) - (uHalf - uBand)) / uBand * (1.0 - uIn);
    each = max(each, vec2(0.0));
    /* down the page from the middle there is no glass: the foot of the hero is not an edge of the screen */
    each.y *= step(d.y, 0.0);
    float v = pow(pow(each.x, uRound) + pow(each.y, uRound), 1.0 / uRound);
    float t = clamp((v - uIn) / (1.0 - uIn), 0.0, 1.0);
    /* The level is always explicit: a derivative-chosen one breaks down where neighbouring pixels sit
       either side of the lens's edge, and draws a line across the picture there. */
    if (t <= 0.0) {
      vec4 here = textureLod(uFlock, uvOf(px), 0.0);
      behind += (vec3(1.0) - behind) * (soft.a + soft.rgb * 0.5) * uHalo.y;
      o = vec4((here.rgb + (1.0 - here.a) * behind) * foot, foot);
      return;
    }

    /* Where the lens takes its picture from: magnified more and more towards the edge, and joined to the
       untouched middle without a seam. */
    behind += (vec3(1.0) - behind) * (soft.a + soft.rgb * 0.5) * uHalo.y * (1.0 - smoothstep(0.0, 0.3, t));
    float vs = uIn + (1.0 - uIn) * (1.0 - exp(-uBend * t)) / uBend;
    vec2 src = d * (vs / max(v, 1e-4));
    vec2 dir = normalize(d);

    /* Lateral chromatic aberration: the channels are magnified by slightly different amounts, so a dark
       stroke on a light page comes apart into red and yellow on its outer side and blue and cyan on its
       inner one. */
    float split = uSplit * sqrt(t);
    /* The softening runs along the comet, not across it: taps spread down the radius, and only a light
       blur sideways, so a comet stays a long flame instead of a cloud. */
    float along = uAlong * t;
    float lod = uSoften * t * t;

    vec3 acc = vec3(0.0);
    for (int i = 0; i < TAPS; i++) {
      float f = (float(i) + 0.5) / float(TAPS) - 0.5;
      vec2 off = dir * (f * along);
      /* Each colour has its own place in the flock, so each is laid over the land on its own. A single alpha
         would stop the colours coming apart anywhere a wing is over the land. */
      vec4 red = textureLod(uFlock, uvOf(uCentre + src * (1.0 + split) + off), lod);
      vec4 green = textureLod(uFlock, uvOf(uCentre + src + off), lod);
      vec4 blue = textureLod(uFlock, uvOf(uCentre + src * (1.0 - split) + off), lod);
      acc.r += red.r + (1.0 - red.a) * behind.r;
      acc.g += green.g + (1.0 - green.a) * behind.g;
      acc.b += blue.b + (1.0 - blue.a) * behind.b;
    }
    o = vec4(acc / float(TAPS) * foot, foot);
  }`, FLY_VERTEX = `#version 300 es
  precision highp float;
  layout(location = 0) in vec2 aAB;
  layout(location = 1) in vec2 aPart;
  layout(location = 2) in vec4 iPlace;
  layout(location = 3) in vec3 iForward;
  layout(location = 4) in vec3 iLeft;
  layout(location = 5) in vec4 iFlap;
  layout(location = 6) in vec4 iWho;
  layout(location = 7) in float iShow;
  layout(location = 8) in vec4 iHold;
  layout(location = 9) in vec3 iTurn;
  uniform vec2 uCanvas;
  uniform vec4 uLight;
  uniform float uDark;
  uniform float uPixels;
  out vec2 vW;
  out vec3 vLit;
  flat out vec4 vKind;
  flat out vec4 vWho;
  flat out vec3 vMark;
  void main() {
    /* one that is hidden is put outside the picture, so none of its pixels are worked out */
    if (iShow <= 0.0) {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      return;
    }
    vec3 F = iForward;
    vec3 S = iLeft;
    vec3 U = cross(F, S);
    float kind = aPart.x;
    float side = aPart.y * iWho.w;
    vec3 P;
    vec3 N = U;
    vec3 span = S;
    vec2 flat2 = vec2(F.y, -F.x) / max(length(F.xy), 0.001);
    vW = aAB;
    if (kind < 1.5) {
      float phi = kind < 0.5 ? iFlap.x : iFlap.y;
      float lag = kind < 0.5 ? iFlap.z : iFlap.w;
      float a = aAB.x;
      float b = aAB.y;
      /* In flight the forewing is held out to the side and the hindwing comes up to meet it, which is what makes two wide
         lobes when the wings are open. This turns only where the wing is, and not how it is painted. */
      float sweep = kind < 0.5 ? ${FLIGHT.sweep[0].toFixed(2)} : ${FLIGHT.sweep[1].toFixed(2)};
      float cs = cos(sweep);
      float sn = sin(sweep);
      float a0 = a;
      a = a0 * cs - b * sn;
      b = a0 * sn + b * cs;
      /* The wing is not a board. Its tip and its trailing edge come along after the root, by as much as
         the wing is moving, which is what makes the beat look like cloth instead of a hinge. */
      float bent = phi + lag * (0.5 * b + 0.55 * max(-a, 0.0));
      span = side * S * cos(bent) + U * sin(bent);
      P = a * F + b * span;
      /* the root is a little forward of the middle for a forewing, and behind it for a hindwing */
      P += F * (kind < 0.5 ? 0.03 : -0.02);
      /* the light goes by the bent wing, so that it moves across it during a beat */
      N = U * cos(bent) - side * S * sin(bent);
      vMark = vec3(0.0);
    } else if (kind < 2.5) {
      P = aAB.x * F + vec3(flat2, 0.0) * aAB.y;
      vMark = vec3(0.0);
    } else if (kind > 5.5) {
      /* An antenna, out from the head and up off the back, bowing outwards a little. It is drawn as the thread is, a strip
         across the page as wide as it needs to be to touch every pixel the line does. */
      float t = aAB.x;
      vec3 at = F * (${ANTENNA.root.toFixed(3)} + ${ANTENNA.reach.toFixed(3)} * t) +
        S * aPart.y * (0.015 + ${ANTENNA.spread.toFixed(3)} * t + ${ANTENNA.curl.toFixed(3)} * t * t) +
        U * ${ANTENNA.rise.toFixed(3)} * t;
      float t2 = min(t + 0.05, 1.0);
      float t1 = max(t - 0.05, 0.0);
      vec3 ahead = F * ${ANTENNA.reach.toFixed(3)} * t2 + S * aPart.y * (${ANTENNA.spread.toFixed(3)} * t2 + ${ANTENNA.curl.toFixed(3)} * t2 * t2) + U * ${ANTENNA.rise.toFixed(3)} * t2;
      vec3 behind = F * ${ANTENNA.reach.toFixed(3)} * t1 + S * aPart.y * (${ANTENNA.spread.toFixed(3)} * t1 + ${ANTENNA.curl.toFixed(3)} * t1 * t1) + U * ${ANTENNA.rise.toFixed(3)} * t1;
      vec2 along = (ahead - behind).xy;
      float wide = (1.0 + 0.08 * uDark) * mix(${ANTENNA.wide[0].toFixed(2)} * clamp(iPlace.w / 80.0, 0.6, 1.0), ${ANTENNA.wide[1].toFixed(2)}, t);
      float truePx = wide * uPixels;
      float stripPx = max(truePx, 0.5) + 0.75;
      P = at + vec3(vec2(-along.y, along.x) / max(length(along), 1e-5) * aAB.y * stripPx / uPixels / iPlace.w, 0.0);
      /* the tip fades out rather than stopping square */
      vLit = vec3(truePx, stripPx, 1.0 - smoothstep(0.86, 1.0, t));
      vMark = vec3(0.0);
    } else {
      P = vec3(0.0);
      vMark = vec3(0.0);
    }
    if (kind < 4.5) {
      float lit = dot(N, uLight.xyz);
      float h = pow(abs(dot(N, normalize(uLight.xyz + vec3(0.0, 0.0, 1.0)))), 24.0);
      vLit = vec3(lit, h, abs(N.z));
    }
    /* The last place is the bead's radius in CSS pixels. */
    vKind = vec4(kind, iWho.y, aPart.y, iHold.z * iPlace.w);
    vWho = vec4(iPlace.w, iWho.z, iShow * (kind > 3.5 && kind < 5.5 ? iTurn.z : 1.0), iWho.x);

    /* In homogeneous form, so the GPU interpolates the wing's own place with perspective. */
    float w = (iPlace.z - P.z) / iPlace.z;
    vec2 pixel = iPlace.xy * w + vec2(P.x, -P.y) * iPlace.w;
    gl_Position = vec4(pixel.x / uCanvas.x * 2.0 - w, w - pixel.y / uCanvas.y * 2.0, 0.0, w);
  }`, FLY_FRAGMENT = `#version 300 es
  precision highp float;
  in vec2 vW;
  in vec3 vLit;
  flat in vec4 vKind;
  flat in vec4 vWho;
  flat in vec3 vMark;
  uniform sampler2D uGrain;
  uniform sampler2D uShapes;
  uniform sampler2D uInks;
  uniform sampler2D uLand;
  uniform vec3 uLandLook;
  uniform float uPixels;
  uniform vec4 uCells[${WING_NAMES.length}];
  uniform vec2 uForeRange;
  uniform vec2 uHindRange;
  uniform float uShapeRows;
  uniform float uTile;
  uniform float uClock;
  uniform float uFan;
  uniform float uPitch;
  uniform float uClosest;
  uniform float uKeep;
  uniform float uFill;
  uniform vec2 uBrick;
  uniform float uGap;
  uniform float uFlow;
  uniform float uBeadCell;
  uniform float uBeadChance;
  uniform float uBeadSize;
  uniform float uBlotch;
  uniform float uGrainStrength;
  uniform float uDark;
  out vec4 outColor;
  const float FINEST = 8.0;
  ${DICE}
  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  int inkRow = 0;
  vec3 ink(int which) {
    return texelFetch(uInks, ivec2(which, inkRow), 0).rgb;
  }
  vec3 overlay(vec3 c, float g, float strength) {
    vec3 o = mix(2.0 * c * g, 1.0 - 2.0 * (1.0 - c) * (1.0 - g), step(0.5, c));
    return mix(c, o, strength);
  }
  /* The colour of the glass for how much of it the light has come through: its pale glow, then its own colours one after
     another, and past the deepest of them on towards one further colour, so that the far end of a long wing is still
     changing. The last number is how much it darkens on the way, because a red that only darkens stops being glass and
     goes to lacquer. */
  vec3 stain(float t, vec3 glow, vec3 light, vec3 body, vec3 deep, vec3 beyond, float falls) {
    vec3 c = mix(glow, light, smoothstep(0.0, 0.32, t));
    c = mix(c, body, smoothstep(0.24, 0.62, t));
    c = mix(c, deep, smoothstep(0.52, 1.25, t));
    c = mix(c, beyond, smoothstep(1.1, 2.4, t));
    return pow(c, vec3(1.0 + falls * (1.0 - exp(-max(t - 0.6, 0.0) * 1.2)) * smoothstep(0.2, 0.8, max(c.r, max(c.g, c.b)))));
  }
  /* The same colour with its weaker channels pushed further down, which is cleaner and no darker. */
  vec3 vivid(vec3 c, float k) {
    float most = max(max(c.r, c.g), max(c.b, 1e-3));
    return pow(c / most, vec3(k)) * most;
  }
  void main() {
    float kind = vKind.x;
    /* the butterfly's pastel */
    inkRow = int(vWho.w);

    if (kind > 5.5) {
      /* An antenna: the thread's edge, in a plain grey that is neither the wing's colour nor the planet's. */
      float a = min(clamp(vLit.x + 0.5 - abs(vW.y) * vLit.y, 0.0, 1.0), 2.0 * vLit.x) * vLit.z * vWho.z;
      vec3 grey = mix(vec3(${ANTENNA.ink[0].map((v) => v.toFixed(2)).join(", ")}), vec3(${ANTENNA.ink[1].map((v) => v.toFixed(2)).join(", ")}), uDark);
      outColor = vec4(grey * a, a);
      return;
    }
    if (kind > 1.5) {
      /* The body is only where the wings' strokes gather: a soft dab with no edge of its own, broken along its length, deepest
         at its middle and going over to the colour that runs out into the wings. */
      float along = (vW.x + 0.08) / 0.32;
      float across = vW.y / mix(0.075, 0.03, smoothstep(0.0, 1.0, -along));
      float d = along * along + across * across;
      float streaks = noise(vec2(vW.x * 8.0 + vWho.y * 13.0, vW.y * 90.0));
      float show = (1.0 - smoothstep(0.05, 1.0, d)) * mix(0.45, 0.9, streaks) * vWho.z;
      vec3 c = mix(mix(ink(6), ink(5), 0.45), ink(6), smoothstep(0.0, 0.7, d));
      c = overlay(c, texture(uGrain, gl_FragCoord.xy / uTile).r, uGrainStrength);
      outColor = vec4(c * show, show);
      return;
    }

    vec2 p = vW;
    float r = length(p);
    float ang = atan(p.x, p.y);
    vec2 range = kind < 0.5 ? uForeRange : uHindRange;
    float across = (ang - range.x) / (range.y - range.x);
    float shapeRow = (vKind.y * 2.0 + (kind < 0.5 ? 0.5 : 1.5)) / uShapeRows;
    float rim = texture(uShapes, vec2(across, shapeRow)).r;
    float edge = rim - r;
    /* The outline's slope, taken over a little distance, because the table comes in small stairs where the outline runs
       nearly along a ray. */
    float rimStep = 7.0 / ${SHAPE_WIDTH}.0;
    float rimAhead = texture(uShapes, vec2(across + 2.0 * rimStep, shapeRow)).r;
    float rimBehind = texture(uShapes, vec2(across - 2.0 * rimStep, shapeRow)).r;
    float rimSlope = (rimAhead - rimBehind) / (4.0 * rimStep * (range.y - range.x));
    /* The edge against the picture's own pixels, for a clean silhouette. Its gradient goes by the angle and the radius,
       which are smooth, because the edge's own would carry those stairs and break a steep edge into dashes. */
    vec2 edgeSlope = rimSlope * vec2(dFdx(ang), dFdy(ang)) - vec2(dFdx(r), dFdy(r));
    float inside = clamp(edge / max(length(edgeSlope), 1e-5) + 0.5, 0.0, 1.0);
    float pxPer = vWho.x;
    float aaAng = fwidth(ang) * r * pxPer;
    if (inside <= 0.0 || across < 0.0 || across > 1.0) {
      discard;
    }
    /* How far this is from the wing's edge in CSS pixels, straight across it, which a radius is not: along the leading
       edge a ray from the root nearly runs with the edge. It goes by the outline's slope, so a steep edge has as even a
       line along it as any other. */
    /* The bright line is a fine one and would show those stairs as dashes, so where the outline runs steeply it is measured
       from an average of the outline nearby. The wing's shape stays as it is: this moves the line and not the edge. */
    float rimSteep = smoothstep(1.5, 4.0, abs(rimSlope) / max(rim, 1e-3));
    float rimEven = rim;
    if (rimSteep > 0.0) {
      float nearby = textureLod(uShapes, vec2(across + rimStep, shapeRow), 0.0).r + textureLod(uShapes, vec2(across - rimStep, shapeRow), 0.0).r;
      rimEven = mix(rim, (rim + rimAhead + rimBehind + nearby) / 5.0, rimSteep);
    }
    float edgePx = (rimEven - r) / sqrt(1.0 + rimSlope * rimSlope / max(r * r, 1e-4)) * pxPer;
    /* Both wings are in plain view from behind, so the far one is only a little lighter than the near one. */
    float near = mix(0.7, 1.0, step(vKind.z, 0.0));
    float isFore = 1.0 - step(0.5, kind);

    float grain = texture(uGrain, gl_FragCoord.xy / uTile).r;
    vec3 deep = ink(0);
    vec3 body = ink(1);
    vec3 light = ink(2);
    vec3 glow = ink(3);
    vec3 sheen = ink(4);
    vec3 rimInk = ink(5);
    /* One colour of glass, paler and deeper, rather than a run of colours. The inks are all of one family, so drawing them
       together keeps the wing clean and only takes out the spread. */
    glow = mix(glow, body, ${WING.mono.toFixed(2)});
    light = mix(light, body, ${WING.mono.toFixed(2)});
    deep = mix(deep, body, ${WING.mono.toFixed(2)});
    sheen = mix(sheen, body, ${WING.mono.toFixed(2)});
    float along = r / max(rimEven, 1e-3);

    /* The strokes fan out from the root, and more of them start as the fan widens. */
    float spread = max(r * pxPer / uFan, 0.001);
    float detail = max(min((1.0 - uKeep) * log2(spread / uPitch), log2(spread / uClosest)), -3.0);
    float level = floor(detail);
    float grow = smoothstep(0.0, 1.0, detail - level);
    float place = (ang * uFan + vWho.y * 97.0) * exp2(level);
    float pitch = spread * exp2(-level);
    float even = floor(place + 0.5);
    float odd = floor(place) + 0.5;
    float fromEven = abs(place - even) * pitch;
    float fromOdd = abs(place - odd) * pitch;
    float shareEven = mix(pitch, pitch * 0.5, grow);
    float shareOdd = pitch * 0.5 * grow;
    bool isOdd = fromOdd - shareOdd * 0.4 < fromEven - shareEven * 0.4;
    float side = isOdd ? fromOdd : fromEven;
    float share = isOdd ? shareOdd : shareEven;
    float line = (isOdd ? floor(place) * 2.0 + 1.0 : even * 2.0) * exp2(FINEST - level - 1.0);
    vec4 dice = dice4(line);

    float halfWidth = share * uFill * (0.88 + 0.2 * dice.y) * 0.5;
    float aa = max(aaAng * 0.6, 0.16);
    float cover = (1.0 - smoothstep(halfWidth - aa, halfWidth + aa, side)) * min(1.0, halfWidth * 2.4);
    /* Each runs slowly out along the wing, in long lengths with short breaks. */
    float travelled = r * pxPer;
    float run = mix(uBrick.x, uBrick.y, dice.w) * (0.5 + 0.5 * min(pxPer / 60.0, 1.4));
    float runAt = (travelled - uClock * uFlow * 1000.0 * (0.6 + 0.8 * dice.z)) / run + dice.x * 40.0;
    float runFrom = min(fract(runAt), 1.0 - fract(runAt)) * run;
    cover *= smoothstep(uGap - 0.5, uGap + 0.5, runFrom);

    /* The veins fan out from the root as the strokes do, and bend a little on the way. */
    float cells = kind < 0.5 ? uCells[int(vKind.y)].x : uCells[int(vKind.y)].y;
    float cellAt = (across + (kind < 0.5 ? 0.05 : -0.05) * r * r) * cells + vWho.y * 3.0;
    float cell = abs(fract(cellAt) - 0.5) * 2.0;
    float cellDice = hash(vec2(floor(cellAt), kind + vWho.y * 31.0));

    /* Where the lighter hearts of the panes end: one long sweep along a forewing's leading side, and a round end to each pane on
       the rest of it and on a hindwing. */
    float petals = isFore * (1.0 - smoothstep(0.34, 0.5, across)) + (1.0 - isFore);
    float archAt = mix(mix(0.8, 0.84, smoothstep(0.5, 0.85, across)), 0.77 - cell * cell * 0.12 + (cellDice - 0.5) * 0.04, petals);

    /* How much glass the light has come through to get here: next to none at the root, and more and more towards the
       tip. Whatever changes the wing's colour changes this, and the colour is read off it at the end, so a ray, a heart
       or a striation is always the glass itself, thinner or thicker, and never paler paint laid on top of it. */
    float reach = r / (kind < 0.5 ? 1.25 : 1.0);
    float pane = (fract(cellAt) - 0.5) * 2.0;
    float pillow = 1.0 - cell * cell;
    /* Warm glass holds its light further out: a blue can go very deep and stay clean, where a red that deep is only dark. */
    float warm = smoothstep(0.0, 0.4, body.r - body.b);
    float thick = max(reach - 0.08, 0.0) * mix(0.94, 1.36, isFore) * mix(1.0, 0.74, warm);
    /* The trailing side of a forewing is thinner, so it stays paler. */
    thick *= 1.0 - isFore * (1.0 - smoothstep(0.26, 0.6, across)) * smoothstep(0.15, 0.6, along) * 0.26;
    /* Long, slow changes in the thickness, like any glass that was made by hand, and each pane was poured on its own. */
    vec2 seedAt = vec2(vWho.y * 37.0, vWho.y * 91.0 + kind * 11.0);
    vec2 streak = vec2(ang * 2.6, r * 0.55) * uBlotch;
    float blot = noise(streak + seedAt) * 0.62 + noise(streak * 2.7 - seedAt) * 0.38;
    thick *= 1.0 + ((blot - 0.5) * 0.12 + (cellDice - 0.5) * 0.1) * ${WING.texture.toFixed(2)} * smoothstep(0.2, 0.6, along);
    /* Each pane is blown a little, thinnest at its heart and thick along its veins, and the petals show it most. */
    thick *= 1.0 + cell * cell * cell * ${(0.18 * WING.texture).toFixed(3)} * smoothstep(0.1, 0.45, along);
    thick *= 1.0 - petals * pillow * pillow * smoothstep(0.1, 0.34, along) * (1.0 - smoothstep(archAt - 0.2, archAt - 0.02, along)) * ${(0.3 * WING.texture).toFixed(3)};
    /* Light pours through the root in long beams, along the veins and between them. */
    if (reach < 0.62) {
      float rays = noise(vec2(ang * 17.0 + seedAt.x, kind * 5.0)) * 0.7 + noise(vec2(ang * 43.0 + seedAt.y, kind * 9.0)) * 0.3;
      float beam = cell * cell;
      thick *= 1.0 - (smoothstep(0.38, 0.72, rays) * mix(0.46, 0.26, warm) + beam * beam * mix(0.42, 0.3, warm)) * ${WING.texture.toFixed(2)} * (1.0 - smoothstep(0.08, 0.62, reach));
    }
    /* The strokes stay in the glass, as fine striations you find when you look closely. */
    thick *= 1.0 + ((cover - 0.7) * 0.2 + (dice.y - 0.5) * 0.24) * ${WING.texture.toFixed(2)} * smoothstep(0.12, 0.5, along);
    /* A wing turned away from us has a longer way through it, so its colour deepens as it beats, though only by a little, or
       the whole wing would pump where it should glint. */
    thick *= mix(1.0, min(1.0 / max(vLit.z, 0.2), 1.6), mix(0.35, 0.5, near)) * mix(1.0, 1.12, near);
    /* The far forewing is the same glass with more light through it. Its hindwing is not: that anchors the butterfly, so it
       stays deeper. */
    thick *= mix(mix(0.82, 0.5, isFore), 1.0, near);

    /* The land behind the glass. It is read blurred, because its lines are closer together than the strokes and the two would
       weave into a cloth, and what is left is the big shapes: sky, hills and sand. It is not seen through a near wing, only
       felt: what matters is how much of it gets through this colour of glass, and less of it is the same as more glass, which
       keeps it clean. So a wing goes deeper over the land and paler over the white page, where multiplying the two would
       have been mud. */
    vec3 seen = textureLod(uLand, gl_FragCoord.xy * uLandLook.xy, uLandLook.z).rgb;
    float gets = dot(seen, body) / max(body.r + body.g + body.b, 0.05);
    /* a dark page gives no light to speak of, and there it is the wing's own that we see */
    float landDeep = 1.0 + (1.0 - max(gets, uDark * 0.55)) * smoothstep(0.12, 0.45, along);

    vec3 far = vivid(mix(deep, sheen, 0.2), ${(1 + 0.4 * (1 - WING.mono)).toFixed(3)});
    /* A far wing takes little of its depth from the land, or red glass over green hills would go brown. */
    vec3 c = stain(thick * mix(1.0, landDeep, mix(mix(0.6, 0.25, isFore), 1.0, near)), glow, light, body, far, vivid(mix(deep, sheen, 0.5), ${(1 + 0.5 * (1 - WING.mono)).toFixed(3)}), mix(1.0, 0.4, warm));
    /* the core of the light, where the glass has almost no colour */
    c = mix(c, mix(glow, vec3(1.0), 0.5), (1.0 - smoothstep(0.0, 0.2, thick)) * 0.7);

    /* The body does not stop at its edge. Its colour runs out along the strokes, each a length of its own, which is what joins
       the wings through the middle. */
    float runsOut = 0.1 + ${(0.46 * (1 - WING.mono)).toFixed(3)} * dice.x * dice.x;
    c = mix(c, ink(6), (1.0 - smoothstep(0.03, runsOut, r)) * mix(0.55, 1.0, cover) * ${(0.85 * (1 - WING.mono * 0.5)).toFixed(3)});

    c = overlay(c, grain, uGrainStrength * ${(0.5 * (0.5 + 0.5 * WING.texture)).toFixed(3)});

    /* Bright flecks running out along the strokes: the little bubbles in hand-made glass. */
    float spot = (travelled - uClock * uFlow * 1800.0 * (0.6 + 0.8 * dice.y)) / uBeadCell + dice.z * 57.0;
    vec2 roll = dice2(vec2(line, floor(spot)));
    float beadAt = (fract(spot) - 0.2 - 0.6 * roll.y) * uBeadCell;
    float size = fract(roll.y * 7.0);
    float radius = uBeadSize * (0.5 + 0.8 * size * size) * (isOdd ? grow : 1.0);
    float bead = 1.0 - smoothstep(radius - 0.4, radius + 0.4, length(vec2(beadAt, side)));
    bead *= step(roll.x, uBeadChance) * min(1.0, radius * 1.6);
    c = mix(c, mix(c, vec3(1.0), 0.55), bead * ${(0.6 * WING.texture).toFixed(3)});

    /* Glass reflects the sky with a hard edge: a sheet of light on one side of the edge that fades away from it, sliding
       across the wing as it beats. Each pane is blown a little, so it bows the edge and shows it at a place of its own,
       and it steps at every vein. */
    vec2 lieAlong = mix(vec2(-0.7, 0.72), vec2(0.7, 0.71), isFore);
    float lieAt = dot(p, lieAlong);
    float crossing = dot(p, vec2(-lieAlong.y, lieAlong.x)) * mix(-1.0, 1.0, isFore) + lieAt * lieAt * 0.22;
    float crossingAa = max(fwidth(crossing) * 0.75, 1e-4);
    float beat = mix(1.0 - vLit.z, vLit.x + 1.0, near);
    float edgeAt = mix(mix(-0.24, 0.1, beat), mix(0.04, 0.5, beat), isFore);
    float edgeOf = (crossing - edgeAt) + pane * pane * 0.012 + (cellDice - 0.5) * 0.024;
    float sheet = (1.0 - smoothstep(-crossingAa, crossingAa, edgeOf)) * smoothstep(-0.34, 0.0, edgeOf) * smoothstep(0.3, 0.6, along);
    /* Added light goes grey on very dark glass, and on warm glass it only goes salmon. */
    float lifts = smoothstep(0.03, 0.3, dot(c, vec3(0.3, 0.55, 0.15)));
    c += mix(light, vec3(1.0), 0.35) * sheet * 0.22 * lifts * mix(1.0, 0.5, warm);

    /* And no two panes lie quite the same way, so each catches the sky at a moment of its own, all of it at once, with its
       veins for edges, and brightest against the vein on the side of the light. */
    float facet = smoothstep(0.6, 0.98, sin(beat * 2.6 + cellDice * 23.0 + kind));
    c += mix(light, vec3(1.0), 0.45) * facet * (0.3 + 0.7 * smoothstep(-1.0, 1.0, pane * mix(-1.0, 1.0, isFore))) * smoothstep(0.22, 0.55, along) * mix(0.1, 0.2, lifts) * ${WING.texture.toFixed(2)};

    /* The veins, in light: the glass's own colour, almost clear. They are brightest near the root, where the
       light comes from, nearly gone at the rim, and brighter as the reflection goes by. */
    vec3 veinInk = mix(mix(glow, light, smoothstep(0.0, 0.32, thick * 0.3)), vec3(1.0), mix(0.9, 0.3, smoothstep(0.1, 0.5, along)));
    float veinWidth = 0.34;
    float paneHalf = 0.5 / cells * (range.y - range.x) * r * pxPer;
    float veinPx = min(fract(cellAt), 1.0 - fract(cellAt)) * 2.0 * paneHalf;
    float passing = exp(-edgeOf * edgeOf * 90.0);
    /* Far off, on a dark glass, lines of light this bright would read as a wire frame, so they ease off. */
    float wire = mix(1.0, smoothstep(20.0, 44.0, pxPer), mix(0.3, 0.75, 1.0 - smoothstep(0.04, 0.2, dot(body, vec3(0.3, 0.55, 0.15)))));
    float vein = (1.0 - smoothstep(veinWidth - aa, veinWidth + aa, veinPx)) * smoothstep(0.03, 0.12, along) * wire;
    /* The glass is a little deeper beside a vein, and in its own colour: a plain grey on a pastel turns it khaki. */
    vec3 deeper = vec3(1.0) - light;
    deeper = mix(vec3(1.0), deeper / max((deeper.r + deeper.g + deeper.b) / 3.0, 0.01), 0.75);
    c *= vec3(1.0) - (cell * cell * ${(0.1 * WING.texture).toFixed(3)} + (1.0 - smoothstep(0.4, 1.7, veinPx)) * ${(0.1 * WING.veins).toFixed(3)}) * smoothstep(0.2, 0.45, along) * deeper * 0.6;
    /* They fade on the way out, so that a wing is not ruled like a fan. */
    c = mix(c, veinInk, vein * ${WING.veins.toFixed(2)} * min(mix(0.5, 0.0, smoothstep(0.16, 0.72, along)) + passing * 0.2, 1.0));
    float shrunk = min(pxPer / 80.0, 1.0);
    c += vec3(0.13) * vLit.y;

    /* Glass turned edge on to us reflects more than it lets through. */
    float fresnel = 1.0 - min(vLit.z, 1.0);
    c = mix(c, mix(glow, vec3(1.0), 0.3), fresnel * fresnel * fresnel * 0.5);

    /* The light that came in gathers along the edge it cannot get out of, which is the side away from it, and on the side
       towards it the glass has a bright lip. */
    float rimLit = smoothstep(-0.4, 0.7, dot(normalize(edgeSlope + 1e-6), vec2(0.45, -0.89)));
    /* None of the lines round the edge comes all the way in to the root, or each wing would be a petal outlined on its own. */
    float awayFromRoot = smoothstep(0.22, 0.62, r);
    float lipFade = exp(-max(edgePx, 0.0) / (3.5 * shrunk)) * awayFromRoot;
    c += light * lipFade * (1.0 - rimLit) * 0.34 * smoothstep(0.25, 0.5, along);
    c = mix(c, mix(mix(light, vec3(1.0), 0.35), vec3(1.0), 1.0 - near), lipFade * rimLit * mix(0.3, 0.55, 1.0 - near));
    c = mix(c, deep, (1.0 - smoothstep(0.35, 0.95, abs(edgePx - 1.75))) * 0.2 * near * awayFromRoot);
    /* The line round the edge is bright on the side that faces the light, and away from it takes on the colour of the
       glass, and is finer, which is also what holds the wing's shape against the white of the page. The colours come
       apart a little on the way. */
    vec3 rimGlass = mix(mix(sheen, deep, 0.25), rimInk, max(mix(0.3, 1.0, rimLit), 1.0 - smoothstep(0.12, 0.42, reach)));
    vec3 fringe = (vec3(edgePx) + vec3(-0.25, 0.0, 0.25)) / mix(0.72, 1.0, rimLit);
    vec3 rimRgb = vec3(1.0) - smoothstep(vec3(0.5), vec3(1.1), fringe);
    rimRgb *= awayFromRoot;
    c = mix(c, rimGlass, rimRgb * 0.62);
    float rimLine = rimRgb.g;

    /* Red and green add up to brown, so a warm far wing lets a little less of the land through. */
    float clearness = mix(mix(0.86, mix(0.72, 0.84, warm), smoothstep(0.2, 0.7, along)), mix(0.98, 0.95, smoothstep(0.3, 0.95, along)), near);
    /* Green hills through a pastel turn it khaki too, so it lets less of them through. */
    clearness = mix(clearness, 1.0, 0.6);
    /* The strokes thin out at the edge, each at a place of its own, so that the wing's edge is drawn and not cut. */
    float strokeEnds = 0.82 + 0.16 * dice.x;
    clearness *= 1.0 - smoothstep(strokeEnds - 0.05, strokeEnds + 0.05, along) * mix(0.42, 0.26, isFore);
    float show = inside * vWho.z * max(clearness, rimLine * 0.62);
    outColor = vec4(min(c, vec3(1.0)) * show, show);
  }`, LENS_FOOT = "float foot = clamp(gl_FragCoord.y / (uRes.y * 0.1), 0.0, 1.0);", LENS_EVEN = [
  "vec2 src = d * (vs / max(v, 1e-4));",
  "vec2 src = d * vec2(vs / max(v, 1e-4), mix(1.0, vs / max(v, 1e-4), smoothstep(0.0, uIn, each.y)));"
], LENS_CLEAR = [
  ["o = vec4((here.rgb + (1.0 - here.a) * behind) * foot, foot);", "o = vec4(here.rgb * foot, here.a * foot);"],
  ["vec3 acc = vec3(0.0);", `vec3 acc = vec3(0.0);
    float cover = 0.0;`],
  ["acc.r += red.r + (1.0 - red.a) * behind.r;", "acc.r += red.r;"],
  ["acc.g += green.g + (1.0 - green.a) * behind.g;", "acc.g += green.g;"],
  [
    "acc.b += blue.b + (1.0 - blue.a) * behind.b;",
    `acc.b += blue.b;
      cover += max(red.a, max(green.a, blue.a));`
  ],
  ["o = vec4(acc / float(TAPS) * foot, foot);", "o = vec4(acc / float(TAPS) * foot, cover / float(TAPS) * foot);"]
], LENS_NONE = `#version 300 es
  precision highp float;
  out vec4 o;
  void main() {
    o = vec4(0.0);
  }`, LENS_TOP = "each.y *= step(d.y, 0.0);", lensMirror = ({ at, strength = 0.5, depth = 0.4, tint = [0.75, 0.85, 1.05], blur = 0.8 }, glow = !1) => {
  let f = (v) => Number(v).toFixed(4), k = `        float k = ${f(strength)} * (1.0 - smoothstep(0.0, uRes.y * ${f(depth)}, below)) * (0.82 + 0.18 * sin(px.y * 0.9 / u));
`;
  return glow ? `    {
      float water = uRes.y * ${f(at)};
      float below = px.y - water;
      if (below > 0.0) {
        float u = uRes.y / 600.0;
        float wave = sin(px.y * 0.45 / u + px.x * 0.015 / u) * 1.4 * u + sin(px.y * 0.13 / u) * 2.2 * u;
        vec2 mp = vec2(px.x + wave * (0.5 + below / (uRes.y * 0.2)), water - below);
${k}        behind += (glowOver(behind, mp, ${f(blur)}) - behind) * vec3(${tint.map(f).join(", ")}) * k;
      }
    }
` : `    {
      float water = uRes.y * ${f(at)};
      float below = px.y - water;
      if (below > 0.0) {
        float u = uRes.y / 600.0;
        float wave = sin(px.y * 0.45 / u + px.x * 0.015 / u) * 1.4 * u + sin(px.y * 0.13 / u) * 2.2 * u;
        vec2 mp = vec2(px.x + wave * (0.5 + below / (uRes.y * 0.2)), water - below);
        vec4 m = textureLod(uFlock, uvOf(mp), ${f(blur)});
${k}        vec3 seen = mix(m.rgb / max(m.a, 1e-3) * vec3(${tint.map(f).join(", ")}), vec3(0.86, 0.92, 1.0), 0.45);
        behind = mix(behind, seen, m.a * k);
      }
    }
`;
}, lensGlow = ({
  core,
  cream,
  halo,
  body = [0.04, 0.4],
  soft = 45e-4,
  near = 0.045,
  far = 0.11,
  strength = [0.75, 0.45]
}) => {
  let f = (v) => Number(v).toFixed(4), v3 = (c) => `vec3(${c.map(f).join(", ")})`;
  return `  vec3 glowOver(vec3 land, vec2 p, float lod) {
    float w = uRes.x;
    float a = textureLod(uFlock, uvOf(p), log2(max(w * ${f(soft)}, 1.0)) + lod).a;
    float near = 0.0;
    float far = 0.0;
    for (int i = 0; i < 12; i++) {
      float turn = float(i) * 0.5235988 + 0.2618;
      vec2 o = vec2(cos(turn), sin(turn));
      near += textureLod(uFlock, uvOf(p + o * w * ${f(near)}), log2(w * ${f(near)}) + lod).a;
      far += textureLod(uFlock, uvOf(p + o * w * ${f(far)}), log2(w * ${f(far)}) + lod).a;
    }
    float light = 1.0 - (1.0 - min(near / 12.0 * ${f(strength[0])} * 2.0, 1.0)) * (1.0 - min(far / 12.0 * ${f(strength[1])} * 2.0, 1.0));
    vec3 c = vec3(1.0) - (vec3(1.0) - land) * (vec3(1.0) - ${v3(halo)} * light);
    return mix(c, mix(${v3(cream)}, ${v3(core)}, smoothstep(0.35, 1.0, a)), smoothstep(${f(body[0])}, ${f(body[1])}, a));
  }
`;
}, lensFragment = (mode) => {
  let fragment = mode.lens.foot === !1 ? LENS_FRAGMENT.replace(LENS_FOOT, "float foot = 1.0;") : LENS_FRAGMENT;
  if (mode.lens.foot === "ease" && (fragment = fragment.replace(LENS_FOOT, "float foot = smoothstep(0.0, 1.0, gl_FragCoord.y / (uRes.y * 0.1));")), mode.lens.even && fragment.includes(LENS_EVEN[0]) && (fragment = fragment.replace(...LENS_EVEN)), mode.lens.top === !1) {
    if (!fragment.includes(LENS_TOP))
      return LENS_NONE;
    fragment = fragment.replace(LENS_TOP, "each.y = 0.0;");
  }
  if (mode.lens.glow) {
    let swaps = [
      ["  void main() {", `${lensGlow(mode.lens.glow)}  void main() {`],
      ["vec4 soft = textureLod(uFlock, uvOf(px), uHalo.x);", "vec4 soft = vec4(0.0);"],
      ["float t = clamp((v - uIn) / (1.0 - uIn), 0.0, 1.0);", "float t = 0.0;"],
      ["vec4 here = textureLod(uFlock, uvOf(px), 0.0);", "vec4 here = vec4(0.0);"]
    ];
    if (swaps.some(([from]) => !fragment.includes(from)))
      return fragment;
    for (let [from, to] of swaps)
      fragment = fragment.replace(from, to);
  }
  if (mode.lens.mirror || mode.lens.glow) {
    let anchor = `    vec2 px = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
`;
    if (!fragment.includes(anchor))
      return fragment;
    let mirror = mode.lens.mirror ? lensMirror(mode.lens.mirror, !!mode.lens.glow) : "", glow = mode.lens.glow ? `    behind = glowOver(behind, px, 0.0);
` : "";
    fragment = fragment.replace(anchor, anchor + mirror + glow);
  }
  if (mode.lens.clear)
    for (let [from, to] of LENS_CLEAR) {
      if (!fragment.includes(from))
        return LENS_NONE;
      fragment = fragment.replace(from, to);
    }
  return fragment;
}, LINE_FRONT = "float front = uHead * 1.3 - dice.x * 0.3;", LINE_LIFT = "mix(0.3, 0.0, uDark)", LINE_BAND = `    vec4 band = uRow >= 0.0 ? texture(uPaint, vec2(clamp(t, 0.0, 1.0), uRow)) : vec4(0.0);
`, LINE_OWN = `    vec4 own = texture(uPaint, vec2(clamp(t, 0.0, 1.0), max(uRow, 0.0)));
`, glowFragment = (whole) => whole.replace(
  `  in float vSheen;
`,
  `  in float vSheen;
  in float vGlow;
  uniform float uGlowRow;
  uniform float uGlowTake;
  uniform float uShimmer;
`
).replace(
  LINE_BAND,
  `${LINE_BAND}    float lit = 0.0;
    if (uGlowRow >= 0.0) {
      float streak = noise(vec2(line * 0.043 + uRow * 31.0, css.x * 0.0105 - uClock * 0.035));
      lit = clamp(vGlow * uGlowTake * mix(1.0, 0.25 + 1.5 * streak, uShimmer), 0.0, 1.0);
      band = mix(band, texture(uPaint, vec2(clamp(t, 0.0, 1.0), uGlowRow)), lit);
    }
`
).replace(
  LINE_OWN,
  `${LINE_OWN}    if (uGlowRow >= 0.0) {
      own = mix(own, texture(uPaint, vec2(clamp(t, 0.0, 1.0), uGlowRow)), lit);
    }
`
), LINE_BODY = `    float body = max(band.a, dyed);
`, LINE_BEADS = "smoothstep(0.0, 0.5, body)))", LINE_CLEAR = `    float clear = smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw));
`, veilFragment = (whole, [light, dark]) => whole.replace(
  LINE_BODY,
  `${LINE_BODY}    float veil = (1.0 - smoothstep(uWordsCore, 1.0, length((css - uWords.xy) / uWords.zw))) * mix(${light.toFixed(3)}, ${dark.toFixed(3)}, uDark);
    body *= 1.0 - veil;
`
).replace(LINE_BEADS, "smoothstep(0.0, 0.5, body)) * (1.0 - veil))").replace(LINE_CLEAR, `    float clear = 1.0;
`), LINE_DARK = `  uniform float uDark;
`, LINE_SHEEN = `    paint = mix(paint, uSheenInk, vSheen * uSheen * 0.7);
`, LINE_FILL = `    float fill = uFill * pow(body, 0.7) * (0.82 + 0.36 * dice.y);
`, LINE_RUNS = `    cover *= step(dice2(vec2(line, floor(runAt))).x, 0.6 + body);
`, LINE_CHANCE = "    bead *= step(roll.x, uBeadChance * ", LINE_COVERED = `    float covered = smoothstep(grain - 0.25, grain + 0.25, own.a * 1.8);
`, LINE_SHADE = "paint * (0.92 + 0.16 * dice.y)", LINE_HAZE = "float alpha = max(cover, haze * uUnder);", LINE_OUT = `    outColor = vec4(min(color, vec3(1.0)) * alpha + wash * solid * (1.0 - alpha), alpha + solid * (1.0 - alpha));
`, sunFragment = (whole) => whole.replace(
  LINE_DARK,
  `${LINE_DARK}  uniform vec4 uSun;
  uniform vec4 uSunShape;
  uniform vec2 uSunRise;
  uniform vec3 uSunInks[5];
  uniform vec3 uSunLight;
  uniform vec2 uSunTake;
`
).replace(
  LINE_SHEEN,
  `${LINE_SHEEN}    float sunAt = length(css - uSun.xy) / uSun.z;
    float sunFace = 1.0 - smoothstep(uSun.w, 1.0, sunAt);
    float sunOut = smoothstep(1.0, 1.0 + uSunShape.x, sunAt);
    vec3 sunInk = mix(uSunInks[0], uSunInks[1], smoothstep(0.0, uSun.w, sunAt));
    sunInk = mix(sunInk, uSunInks[2], smoothstep(uSun.w, 1.0, sunAt));
    sunInk = mix(sunInk, uSunInks[3], smoothstep(1.0, 1.0 + 0.35 * uSunShape.x, sunAt));
    sunInk = mix(sunInk, uSunInks[4], smoothstep(1.0 + 0.2 * uSunShape.x, 1.0 + uSunShape.x, sunAt));
    float sunTake = uSunTake.x * (1.0 - sunOut) * (1.0 - sunOut);
    paint = mix(paint, sunInk, sunTake);
    body *= mix(1.0, uSunShape.z, sunFace * uSunTake.x);
`
).replace(LINE_CHANCE, `${LINE_CHANCE}mix(1.0, uSunShape.w, sunFace * uSunTake.x) * `).replace(LINE_SHADE, "paint * mix(0.92 + 0.16 * dice.y, 1.0, sunFace * uSunTake.x)").replace(LINE_COVERED, `    own.rgb = mix(own.rgb, sunInk, sunTake);
${LINE_COVERED}`).replace(
  LINE_OUT,
  `${LINE_OUT}    float sunEdge = (sunAt - 1.0 + uSunShape.y) / uSunShape.y;
    float sunRim = exp(-sunEdge * sunEdge);
    float sunHalo = (1.0 - sunOut) * (1.0 - sunOut) * smoothstep(uSun.w, 1.0, sunAt);
    float sunFront = uHead * 1.6 - 0.3;
    float sunLight = (uSunLight.x * sunFace + uSunLight.y * sunRim + uSunLight.z * sunHalo) * smoothstep(uSunRise.x, uSunRise.y, css.y);
    sunLight = clamp(sunLight * uSunTake.y * (1.0 - smoothstep(sunFront - 0.3, sunFront, along)), 0.0, 1.0);
    vec3 sunGrain = mix(2.0 * sunInk * grain, 1.0 - 2.0 * (1.0 - sunInk) * (1.0 - grain), step(0.5, sunInk));
    outColor += vec4(min(mix(sunInk, sunGrain, 0.3), vec3(1.0)) * sunLight, sunLight) * (1.0 - outColor.a);
`
), fadeFragment = (whole) => whole.replace(LINE_DARK, `${LINE_DARK}  uniform vec4 uFade;
  uniform vec3 uFadeLook;
`).replace(
  LINE_FILL,
  `    float fade = mix(1.0, pow(smoothstep(uFade.x, uFade.y, css.y), uFade.z), uFade.w);
    body *= fade;
    paint = mix(paint, uPage, (1.0 - fade) * uFadeLook.x * uFade.w);
${LINE_FILL}`
).replace(
  LINE_RUNS,
  `${LINE_RUNS}    cover *= step(fract(dice.z * 61.7 + dice.w * 17.3), mix(1.0, pow(fade, uFadeLook.y), uFade.w));
`
).replace(LINE_HAZE, "float alpha = max(cover, haze * uUnder * mix(1.0, fade * fade, uFade.w));").replace(LINE_CHANCE, `${LINE_CHANCE}mix(1.0, pow(fade, uFadeLook.z), uFade.w) * `), lineFragment = (mode) => {
  let whole = mode.lines.whole ? LINE_FRAGMENT.replace(
    LINE_FRONT,
    "float front = uHead * 1.3 - dice.x * 0.3 + 0.03 * smoothstep(0.85, 1.0, uHead);"
  ) : LINE_FRAGMENT, lifted = mode.lines.lift === void 0 ? whole : whole.replace(LINE_LIFT, `mix(${mode.lines.lift.toFixed(3)}, 0.0, uDark)`), glowing = mode.glow ? glowFragment(lifted) : lifted, veiled = mode.lines.veilDepth ? veilFragment(glowing, mode.lines.veilDepth) : glowing, sunlit = mode.sun ? sunFragment(veiled) : veiled;
  return mode.fade ? fadeFragment(sunlit) : sunlit;
}, startProgram = (gl, vert, frag) => {
  let program = gl.createProgram();
  for (let [type, source] of [
    [gl.VERTEX_SHADER, vert],
    [gl.FRAGMENT_SHADER, frag]
  ]) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source), gl.compileShader(shader), gl.attachShader(program, shader);
  }
  return gl.linkProgram(program), { program, uniforms: {} };
}, finishProgram = async (gl, built) => {
  let parallel = gl.getExtension("KHR_parallel_shader_compile");
  for (; parallel && !gl.getProgramParameter(built.program, parallel.COMPLETION_STATUS_KHR); )
    await new Promise((resolve) => setTimeout(resolve, 16));
  if (!gl.getProgramParameter(built.program, gl.LINK_STATUS)) {
    let logs = gl.getAttachedShaders(built.program).map((shader) => gl.getShaderInfoLog(shader)).filter(Boolean);
    throw new Error(gl.getProgramInfoLog(built.program) || logs.join(`
`) || "link failed");
  }
  let count = gl.getProgramParameter(built.program, gl.ACTIVE_UNIFORMS);
  for (let index = 0; index < count; index += 1) {
    let name = gl.getActiveUniform(built.program, index).name.replace("[0]", "");
    built.uniforms[name] = gl.getUniformLocation(built.program, name);
  }
}, random = (seed) => {
  let state = seed >>> 0, next = () => {
    state = state + 1831565813 >>> 0;
    let t = state;
    return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  return next.reseed = (value) => {
    state = value >>> 0;
  }, next;
}, fract = (value) => value - Math.floor(value), hashed = (value) => fract(Math.sin(value * 127.1 + 311.7) * 43758.5453), clamp = (value, low, high) => Math.max(low, Math.min(high, value)), smooth = (from, to, value) => {
  let t = clamp((value - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}, rgbOf = /* @__PURE__ */ new Map(), rgb = (hex) => {
  let found = rgbOf.get(hex);
  if (!found) {
    let n = Number.parseInt(hex.slice(1), 16);
    found = [(n >> 16) / 255, (n >> 8 & 255) / 255, (n & 255) / 255], rgbOf.set(hex, found);
  }
  return found;
}, hexToRgb = (hex) => rgb(hex).map((c) => Math.round(c * 255)), loadImage = (src) => new Promise((resolve) => {
  let image = new Image();
  image.onload = () => resolve(image), image.onerror = () => resolve(null), image.src = src;
}), smoothOutline = (flat) => {
  let points = [];
  for (let index = 0; index < flat.length; index += 2)
    points.push([flat[index], flat[index + 1]]);
  let n = points.length, at = (index) => points[(index + n) % n], knot = (a, b) => Math.max(1e-3, Math.hypot(b[0] - a[0], b[1] - a[1]) ** 0.5), between = (a, b, ta, tb, t) => {
    let f = (t - ta) / (tb - ta);
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }, line = [];
  for (let index = 0; index < n; index += 1) {
    let [p0, p1, p2, p3] = [at(index - 1), at(index), at(index + 1), at(index + 2)], t1 = knot(p0, p1), t2 = t1 + knot(p1, p2), t3 = t2 + knot(p2, p3);
    for (let step = 0; step < 24; step += 1) {
      let t = t1 + (t2 - t1) * step / 24, a1 = between(p0, p1, 0, t1, t), a2 = between(p1, p2, t1, t2, t), a3 = between(p2, p3, t2, t3, t), b1 = between(a1, a2, 0, t2, t), b2 = between(a2, a3, t1, t3, t);
      line.push(between(b1, b2, t1, t2, t));
    }
  }
  return line;
}, toRadii = (flat, range, count, [waves, depth]) => {
  let line = smoothOutline(flat), radii = new Float32Array(count);
  for (let index = 0; index < line.length; index += 1) {
    let [a0, b0] = line[index], [a1, b1] = line[(index + 1) % line.length], ang0 = Math.atan2(a0, b0), ang1 = Math.atan2(a1, b1), from = Math.min(ang0, ang1), to = Math.max(ang0, ang1);
    if (to - from > 1)
      continue;
    let first = Math.floor((from - range[0]) / (range[1] - range[0]) * (count - 1)), last = Math.ceil((to - range[0]) / (range[1] - range[0]) * (count - 1));
    for (let slot = Math.max(0, first); slot <= Math.min(count - 1, last); slot += 1) {
      let angle = range[0] + slot / (count - 1) * (range[1] - range[0]), f = to > from ? Math.max(0, Math.min(1, (angle - ang0) / (ang1 - ang0))) : 0, radius = Math.hypot(a0 + (a1 - a0) * f, b0 + (b1 - b0) * f);
      radii[slot] = Math.max(radii[slot], radius);
    }
  }
  for (let pass = 0; pass < 4; pass += 1) {
    let before = radii[0];
    for (let slot = 1; slot < count - 1; slot += 1) {
      let here = radii[slot];
      radii[slot] = (before + here * 2 + radii[slot + 1]) / 4, before = here;
    }
  }
  if (waves)
    for (let slot = 0; slot < count; slot += 1) {
      let u = slot / (count - 1);
      radii[slot] *= 1 - depth * (1 - Math.abs(Math.sin(Math.PI * waves * u)) ** 0.7) * 2;
    }
  return radii;
}, buildMesh = () => {
  let out = [], wing = (box, kind, side) => {
    let [a0, a1, b0, b1] = box, n = 10, vertex = (i, j) => {
      out.push(a0 + (a1 - a0) * i / n, b0 + (b1 - b0) * j / n, kind, side);
    };
    for (let i = 0; i < n; i += 1)
      for (let j = 0; j < n; j += 1)
        vertex(i, j), vertex(i + 1, j), vertex(i, j + 1), vertex(i, j + 1), vertex(i + 1, j), vertex(i + 1, j + 1);
  }, strip = (x0, x1, w, kind, side, segments) => {
    for (let index = 0; index < segments; index += 1) {
      let a = x0 + (x1 - x0) * index / segments, b = x0 + (x1 - x0) * (index + 1) / segments;
      out.push(
        a,
        -w,
        kind,
        side,
        b,
        -w,
        kind,
        side,
        a,
        w,
        kind,
        side,
        a,
        w,
        kind,
        side,
        b,
        -w,
        kind,
        side,
        b,
        w,
        kind,
        side
      );
    }
  };
  return wing(HIND_BOX, 1, 1), wing(FORE_BOX, 0, 1), wing(HIND_BOX, 1, -1), wing(FORE_BOX, 0, -1), strip(-0.4, 0.24, 0.1, 2, 1, 1), strip(0, 1, 1, 6, 1, 12), strip(0, 1, 1, 6, -1, 12), new Float32Array(out);
}, init = (root) => {
  if (root.dataset.hlHeroBound === "true")
    return;
  let canvas = root.querySelector("[data-hl-canvas]");
  if (!canvas)
    return;
  root.dataset.hlHeroBound = "true";
  let mode = modeOf(root);
  if (!mode.wake) {
    start(root, canvas, mode);
    return;
  }
  let binding = {};
  root.hlBinding = binding;
  let job = { urgent: !1, next: null, steps: null }, soon = new IntersectionObserver(
    (entries) => {
      entries.some((entry) => entry.isIntersecting) && (job.urgent = !0, soon.disconnect(), builder.hurry());
    },
    { rootMargin: mode.near || "0px" }
  ), wake = null, release = () => {
    canvas.isConnected || (wake?.disconnect(), soon.disconnect(), heroes.delete(release), delete root.dataset.hlHeroBound);
  };
  if (job.steps = function* () {
    if (!canvas.isConnected || root.hlBinding !== binding) {
      release(), heroes.delete(release), soon.disconnect();
      return;
    }
    yield* gpuCalm();
    let rest = yield* startSteps(root, canvas, mode);
    rest && (yield* rest), soon.disconnect(), release(), heroes.delete(release);
  }(), heroes.add(release), soon.observe(canvas), mode.wake === "idle") {
    builder.add(job);
    return;
  }
  wake = new IntersectionObserver(
    (entries) => {
      entries.some((entry) => entry.isIntersecting) && (wake.disconnect(), builder.add(job));
    },
    { rootMargin: mode.wake }
  ), wake.observe(canvas);
}, start = (root, canvas, mode) => {
  let steps = startSteps(root, canvas, mode), step = steps.next();
  for (; !step.done; )
    step = steps.next();
  return step.value;
}, startSteps = function* (root, canvas, mode) {
  if (yield COST.context, !canvas.isConnected)
    return null;
  if (mode.near) {
    let box = canvas.getBoundingClientRect(), ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(2, Math.round(Math.max(1, box.width) * ratio)), canvas.height = Math.max(2, Math.round(Math.max(1, box.height) * ratio));
  }
  let gl = canvas.getContext("webgl2", {
    alpha: !0,
    antialias: !1,
    premultipliedAlpha: !0,
    depth: !1,
    stencil: !1
  });
  if (!gl)
    return root.dataset.hlShown !== "true" && (root.dataset.hlFallback = "true"), resumes.delete(root), null;
  contexts.add(gl);
  let gone = () => canvas.isConnected ? !1 : (contexts.delete(gl), gl.getExtension("WEBGL_lose_context")?.loseContext(), !0);
  gl.getExtension("KHR_parallel_shader_compile");
  let { sheets } = mode.land, programs = [], send = (vert, frag) => {
    let built = startProgram(gl, vert, frag);
    return programs.push(built), built;
  }, wanted = [
    ["land", sheets.length > 0, () => send(landVertex(mode), lineFragment(mode))],
    ["blades", !0, () => send(BLADE_VERTEX, bladeFragment(mode))],
    ["blooms", !0, () => send(schoolVertex(mode, talkVertex(mode, bloomVertexOf(mode))), bloomFragment(mode))],
    ["clouds", mode.clouds.length > 0, () => send(CLOUD_VERTEX, CLOUD_FRAGMENT)],
    ["copy", !0, () => send(FULL_VERTEX, COPY_FRAGMENT)],
    ["fly", mode.lensed && mode.flock.length > 0, () => send(FLY_VERTEX, FLY_FRAGMENT)],
    ["lens", mode.lensed, () => send(LENS_VERTEX, lensFragment(mode))],
    ["sky", !!mode.sky, () => send(FULL_VERTEX, SKY_FRAGMENT)],
    ["cut", !!(mode.behind && mode.land.front), () => send(FULL_VERTEX, CUT_FRAGMENT)]
  ], sent = {};
  for (let [name, needed, make] of wanted) {
    if (!needed) {
      sent[name] = null;
      continue;
    }
    if (yield COST.program, gone())
      return null;
    sent[name] = make();
  }
  let { land, blades, blooms, clouds, copy, fly, lens, sky, cut } = sent;
  if (yield COST.texture, gone())
    return null;
  let isStill = () => PREFERS_REDUCED.matches || mode.draw === "once", eager = !mode.near, texture = (unit) => {
    let t = gl.createTexture();
    return gl.activeTexture(gl.TEXTURE0 + unit), gl.bindTexture(gl.TEXTURE_2D, t), t;
  }, clampLinear = () => {
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }, shapeRows = WING_NAMES.length * 2, shapes = new Float32Array(SHAPE_WIDTH * shapeRows);
  WING_NAMES.forEach((name, row) => {
    let w2 = WINGS[name];
    shapes.set(toRadii(w2.fore, FORE_RANGE, SHAPE_WIDTH, [w2.scallop[0], w2.scallop[1]]), row * 2 * SHAPE_WIDTH), shapes.set(toRadii(w2.hind, HIND_RANGE, SHAPE_WIDTH, [w2.scallop[2], w2.scallop[3]]), (row * 2 + 1) * SHAPE_WIDTH);
  });
  let shapesTex = texture(0);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1), gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, SHAPE_WIDTH, shapeRows, 0, gl.RED, gl.FLOAT, shapes), clampLinear();
  let inkData = new Uint8Array(7 * PASTEL_NAMES.length * 4);
  PASTEL_NAMES.forEach((name, row) => {
    PASTELS[name].inks.forEach((hex, col) => {
      inkData.set([...hexToRgb(hex), 255], (row * 7 + col) * 4);
    });
  });
  let inksTex = texture(0);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 7, PASTEL_NAMES.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, inkData), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  let paintRow = sheets.map(
    (sheet, row) => typeof sheet.paint == "string" ? sheets.findIndex((other) => other.name === sheet.paint) : row
  ), glowRow = [];
  if (mode.glow) {
    let next = Math.max(1, ...paintRow.map((row) => row + 1));
    sheets.forEach((sheet, row) => {
      glowRow[row] = sheet.glow ? next++ : -1;
    });
  }
  let paintRows = Math.max(1, ...paintRow.map((row) => row + 1), ...glowRow.map((row) => row + 1)), frontRows = (mode.land.front || []).map((name) => sheets.findIndex((sheet) => sheet.name === name)).filter((row) => row >= 0), landOrder = [...sheets.keys()].filter((row) => !frontRows.includes(row)).concat(frontRows), paintTex = gl.createTexture(), paintLand = (dark2) => {
    let rows = paintRows, ramp = new Uint8Array(256 * rows * 4), ramps = sheets.map((sheet, row) => [sheet.paint, row]);
    sheets.forEach((sheet, row) => {
      glowRow[row] >= 0 && ramps.push([sheet.glow, glowRow[row]]);
    }), ramps.forEach(([stops, row]) => {
      if (typeof stops != "string")
        for (let slot = 0; slot < 256; slot += 1) {
          let u = slot / 255, k = 0;
          for (; k < stops.length - 2 && stops[k + 1][0] < u; )
            k += 1;
          let [u0, ink0, a0] = stops[k], [u1, ink1, a1] = stops[k + 1], f = clamp((u - u0) / (u1 - u0 || 1), 0, 1), c0 = hexToRgb(mode.inks[ink0][dark2 ? 1 : 0]), c1 = hexToRgb(mode.inks[ink1][dark2 ? 1 : 0]);
          ramp.set(
            [
              c0[0] + (c1[0] - c0[0]) * f,
              c0[1] + (c1[1] - c0[1]) * f,
              c0[2] + (c1[2] - c0[2]) * f,
              (a0 + (a1 - a0) * f) * 255
            ],
            (row * 256 + slot) * 4
          );
        }
    }), gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, paintTex), gl.pixelStorei(gl.UNPACK_ALIGNMENT, 4), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, ramp), clampLinear();
  }, grainTex = null, buildGrain = async () => {
    let image = await loadImage(GRAIN), tile = document.createElement("canvas");
    tile.width = GRAIN_TILE, tile.height = GRAIN_TILE;
    let pen = tile.getContext("2d", { willReadFrequently: !0 });
    image && pen.drawImage(image, 0, 0);
    let rgba = pen.getImageData(0, 0, GRAIN_TILE, GRAIN_TILE).data, grey = new Uint8Array(GRAIN_TILE * GRAIN_TILE), sum = 0;
    for (let i = 0; i < grey.length; i += 1)
      grey[i] = rgba[i * 4], sum += grey[i];
    let mean = sum / grey.length;
    if (mean < 96 || mean > 160)
      for (let i = 0; i < grey.length; i += 1)
        grey[i] = 128 + 96 * (hashed(i * 0.137) - 0.5);
    grainTex = texture(0), gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1), gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, GRAIN_TILE, GRAIN_TILE, 0, gl.RED, gl.UNSIGNED_BYTE, grey), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  }, landTex = gl.createTexture(), landFbo = gl.createFramebuffer(), sceneTex = gl.createTexture(), sceneFbo = gl.createFramebuffer(), flockTex = gl.createTexture(), flockFbo = gl.createFramebuffer();
  if (yield COST.upload, gone())
    return null;
  let corners = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, corners), gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  let emptyVao = gl.createVertexArray(), instanced = (layout) => {
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao), gl.bindBuffer(gl.ARRAY_BUFFER, corners), gl.enableVertexAttribArray(0), gl.vertexAttribPointer(0, 2, gl.FLOAT, !1, 8, 0);
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    let stride = layout.reduce((sum, size) => sum + size, 0), offset = 0;
    return layout.forEach((size, index) => {
      gl.enableVertexAttribArray(index + 1), gl.vertexAttribPointer(index + 1, size, gl.FLOAT, !1, stride * 4, offset * 4), gl.vertexAttribDivisor(index + 1, 1), offset += size;
    }), gl.bindVertexArray(null), { vao, buffer, stride, layout, count: 0 };
  }, drawRun = (instances, first, count) => {
    if (count <= 0)
      return;
    gl.bindVertexArray(instances.vao), gl.bindBuffer(gl.ARRAY_BUFFER, instances.buffer);
    let offset = first * instances.stride;
    instances.layout.forEach((size, index) => {
      gl.vertexAttribPointer(index + 1, size, gl.FLOAT, !1, instances.stride * 4, offset * 4), offset += size;
    }), gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
  }, bladeVao = instanced([4, 4, 4]), schoolFrom = Number.POSITIVE_INFINITY, bloomVao = instanced([4, 4, 4, 4]), paintsFor = (dark2) => new Float32Array(mode.paintNames.flatMap((name) => rgb((mode.paints[name] || mode.inks[name])[dark2 ? 1 : 0]))), paints = [paintsFor(!1), paintsFor(!0)], cloudVao = gl.createVertexArray();
  gl.bindVertexArray(cloudVao), gl.bindBuffer(gl.ARRAY_BUFFER, corners), gl.enableVertexAttribArray(0), gl.vertexAttribPointer(0, 2, gl.FLOAT, !1, 8, 0), gl.bindVertexArray(null);
  let landVao = gl.createVertexArray();
  gl.bindVertexArray(landVao);
  let landVertices = gl.createBuffer(), landIndices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, landVertices), gl.enableVertexAttribArray(0), gl.vertexAttribPointer(0, 2, gl.FLOAT, !1, 24, 0), gl.enableVertexAttribArray(1), gl.vertexAttribPointer(1, 4, gl.FLOAT, !1, 24, 8), gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, landIndices), gl.bindVertexArray(null);
  let landRanges = [];
  if (yield COST.upload, gone())
    return null;
  let FLOATS = 28, mesh = buildMesh(), meshCount = mesh.length / 4, flyVao = gl.createVertexArray();
  gl.bindVertexArray(flyVao), gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()), gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW), gl.enableVertexAttribArray(0), gl.vertexAttribPointer(0, 2, gl.FLOAT, !1, 16, 0), gl.enableVertexAttribArray(1), gl.vertexAttribPointer(1, 2, gl.FLOAT, !1, 16, 8);
  let flyData = new Float32Array(Math.max(1, mode.flock.length) * FLOATS), flyBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, flyBuffer), gl.bufferData(gl.ARRAY_BUFFER, flyData.byteLength, gl.DYNAMIC_DRAW);
  for (let [loc, size, offset] of [
    [2, 4, 0],
    [3, 3, 16],
    [4, 3, 28],
    [5, 4, 40],
    [6, 4, 56],
    [7, 1, 72],
    [8, 4, 80],
    [9, 3, 96]
  ])
    gl.enableVertexAttribArray(loc), gl.vertexAttribPointer(loc, size, gl.FLOAT, !1, FLOATS * 4, offset), gl.vertexAttribDivisor(loc, 1);
  if (gl.bindVertexArray(null), yield, gone())
    return null;
  let optics = mode.lens, copyBox = typeof mode.words == "string" ? root.querySelector(mode.words) : null, cssW = 0, cssH = 0, w = 0, h = 0, dpr = 1, dprCap = mode.dprCap || 2, dirty = !0, fit = 1, words = mode.words ? { x: 0, y: 0, a: 0, b: 0 } : { x: -1e5, y: -1e5, a: 1, b: 1 }, hidden = null, landBase = 0, landRoom = 1, glass = { bandX: 0, bandY: 0, reachX: 0, inner: 0, unseen: 0 }, RING = 4, keepOf = (front, rect) => {
    let boxes = [], add = (box, pad) => {
      box.width > 0 && box.height > 0 && boxes.push({
        left: box.left - rect.left - pad,
        top: box.top - rect.top - pad,
        right: box.right - rect.left + pad,
        bottom: box.bottom - rect.top + pad
      });
    };
    for (let holder of mode.keep ? front.querySelectorAll(mode.keep) : []) {
      let texts = document.createTreeWalker(holder, NodeFilter.SHOW_TEXT), range = document.createRange();
      for (let text = texts.nextNode(); text; text = texts.nextNode())
        if (text.textContent.trim()) {
          range.selectNodeContents(text);
          for (let line of range.getClientRects())
            add(line, 0);
        }
      for (let element of holder.querySelectorAll(
        "a, button, input, select, textarea, img, svg, video, canvas, [tabindex]"
      ))
        add(
          element.getBoundingClientRect(),
          element.matches("a, button, input, select, textarea, [tabindex]") ? RING : 0
        );
    }
    return boxes;
  }, measureSteps = function* () {
    let rect = canvas.getBoundingClientRect();
    if ((perching || orbiting) && (pageLeft = rect.left + window.scrollX, pageTop = rect.top + window.scrollY), dpr = Math.min(window.devicePixelRatio || 1, typeof dprCap == "function" ? dprCap(rect.width) : dprCap), cssW = Math.max(1, rect.width), cssH = Math.max(1, rect.height), copyBox) {
      let box = copyBox.getBoundingClientRect();
      words.x = box.left + box.width / 2 - rect.left, words.y = box.top + box.height / 2 - rect.top, words.a = box.width / 2, words.b = box.height / 2;
    } else Array.isArray(mode.words?.at) && (words.x = cssW * mode.words.at[0], words.y = cssH * mode.words.at[1], words.a = cssW * mode.words.half[0], words.b = cssH * mode.words.half[1]);
    let front = mode.behind ? document.querySelector(mode.behind) : null;
    if (front) {
      let box = front.getBoundingClientRect();
      if (hidden = {
        left: box.left - rect.left,
        top: box.top - rect.top,
        right: box.right - rect.left,
        bottom: box.bottom - rect.top
      }, frontRows.length) {
        let style = getComputedStyle(front);
        hidden.radii = ["top-left", "top-right", "bottom-right", "bottom-left"].map(
          (corner) => Number.parseFloat(style.getPropertyValue(`border-${corner}-radius`)) || 0
        ), hidden.keep = keepOf(front, rect), hidden.front = [
          hidden.top,
          ...hidden.radii,
          ...hidden.keep.map((k) => [k.left, k.top, k.right, k.bottom].map(Math.round))
        ].join(" ");
      }
    }
    fit = mode.fit(cssW, cssH);
    let bandX = Math.min(optics.band[0] * cssW * 0.5, optics.bandMost[0]), bandY = Math.min(optics.band[1] * cssH * 0.5, optics.bandMost[1]), inner = optics.even ? Math.max(optics.in, 1 - bandX / Math.max(1, cssW / 2)) : optics.in, vs = inner + (1 - inner) * (1 - Math.exp(-optics.bend)) / optics.bend, reachX = cssW / 2 * vs, unseen = optics.even && !optics.split ? Math.max(0, cssW / 2 - reachX) : 0;
    glass = { bandX, bandY, reachX, inner, unseen };
    let nw = Math.max(2, Math.round(cssW * dpr)), nh = Math.max(2, Math.round(cssH * dpr));
    return dirty = !0, nw === w && nh === h ? !1 : (w = nw, h = nh, (canvas.width !== w || canvas.height !== h) && (yield COST.canvas, canvas.width = w, canvas.height = h), yield COST.texture, gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, landTex), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, 4), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), yield COST.mipmap, gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, landTex), gl.generateMipmap(gl.TEXTURE_2D), gl.bindFramebuffer(gl.FRAMEBUFFER, landFbo), gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, landTex, 0), mode.lensed ? (gl.bindTexture(gl.TEXTURE_2D, sceneTex), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST), gl.bindFramebuffer(gl.FRAMEBUFFER, sceneFbo), gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0), gl.bindTexture(gl.TEXTURE_2D, flockTex), gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAX_LEVEL, Math.ceil(LENS.soften + 1)), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE), gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE), gl.generateMipmap(gl.TEXTURE_2D), gl.bindFramebuffer(gl.FRAMEBUFFER, flockFbo), gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, flockTex, 0), gl.bindFramebuffer(gl.FRAMEBUFFER, null), !0) : (gl.bindFramebuffer(gl.FRAMEBUFFER, null), !0));
  }, all = (steps) => {
    let step = steps.next();
    for (; !step.done; )
      step = steps.next();
    return step.value;
  }, measure = () => all(measureSteps()), CHUNK = 1 << 18, upload = function* (target, buffer, data, parts, vao = null) {
    let bind = () => {
      vao && gl.bindVertexArray(vao), gl.bindBuffer(target, buffer);
    };
    if (bind(), !parts || data.byteLength <= CHUNK)
      gl.bufferData(target, data, gl.STATIC_DRAW);
    else {
      gl.bufferData(target, data.byteLength, gl.STATIC_DRAW);
      let each = CHUNK / data.BYTES_PER_ELEMENT;
      for (let from = 0; from < data.length; from += each)
        from > 0 && (yield COST.upload, bind()), gl.bufferSubData(target, from * data.BYTES_PER_ELEMENT, data.subarray(from, from + each));
    }
    vao && gl.bindVertexArray(null);
  }, page = [1, 1, 1], dark = !1, wash = page, readPage = () => {
    let probe = document.createElement("canvas");
    probe.width = 1, probe.height = 1;
    let ctx = probe.getContext("2d", { willReadFrequently: !0 }), sentinel = "#010203";
    ctx.fillStyle = sentinel, ctx.fillStyle = getComputedStyle(root).getPropertyValue("--scalar-background-1").trim() || sentinel, ctx.fillStyle === sentinel && (ctx.fillStyle = getComputedStyle(document.body).backgroundColor), ctx.fillRect(0, 0, 1, 1);
    let [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    page = a === 0 ? [1, 1, 1] : [r / 255, g / 255, b / 255], dark = 0.2126 * page[0] + 0.7152 * page[1] + 0.0722 * page[2] < 0.5, wash = mode.sky ? rgb(mode.inks[mode.sky.wash || mode.sky.stops[mode.sky.stops.length - 1][1]][dark ? 1 : 0]) : page;
  };
  if (yield COST.style, gone())
    return null;
  readPage();
  let painted = null, curveThrough = (points) => (x) => {
    let last2 = points.length - 1;
    if (x <= points[0][0])
      return points[0][1];
    if (x >= points[last2][0])
      return points[last2][1];
    let k = 0;
    for (; points[k + 1][0] < x; )
      k += 1;
    let [x0, y0] = points[k], [x1, y1] = points[k + 1], slope = (a, b) => (points[b][1] - points[a][1]) / (points[b][0] - points[a][0]), m0 = k > 0 ? slope(k - 1, k + 1) : slope(k, k + 1), m1 = k + 1 < last2 ? slope(k, k + 2) : slope(k, k + 1), h2 = x1 - x0, f = (x - x0) / h2;
    return (2 * f ** 3 - 3 * f ** 2 + 1) * y0 + (f ** 3 - 2 * f ** 2 + f) * h2 * m0 + (-2 * f ** 3 + 3 * f ** 2) * y1 + (f ** 3 - f ** 2) * h2 * m1;
  }, landKey = "", glowPlaces = [], sunPlace = { x: 0, y: 0, r: 1 }, sunRise = [0, 1], fadeAt = [0, 1], gorse = [], bushes = [], hillTop = () => mode.land.crest, skyTop = () => 0, meadowTop = () => 0.5, meadowFoot = () => 1, frontTops = null, sheetHigh = [], inFront = (x, y) => !!frontTops && y >= frontTops[clamp(Math.round(x), 0, frontTops.length - 1)] - 1, sheetTops = /* @__PURE__ */ new Map(), pointsOf = (g) => Array.isArray(g) ? g : g.crest || g.hill, landSteps = function* (parts) {
    let key = [
      cssW,
      cssH,
      words.x,
      words.y,
      words.a,
      words.b,
      hidden && [hidden.left, hidden.right, hidden.bottom, hidden.front || ""]
    ].join();
    if (key === landKey || cssW < 2)
      return;
    landKey = key;
    let shape = mode.land, stage = { w: cssW, h: cssH, hidden, words }, resolve = (g) => typeof g == "function" ? g(stage) : g, value = (v) => typeof v == "function" ? v(stage) : v, half = cssW / 2, relief = clamp(cssW / 1232, shape.relief[0], shape.relief[1]), crest = curveThrough(shape.profile);
    hillTop = (across) => shape.crest + crest(across) * relief;
    // Vision's headline sits inside the landscape. Bend the sky and meadow mesh around the
    // measured copy box, tapering the lift toward the foreground to keep its foot grounded.
    let guide = (g) => {
      let curve;
      if (Array.isArray(g)) {
        curve = curveThrough(g);
      } else {
        const by = curveThrough(pointsOf(g));
        curve = g.crest ? (across) => shape.crest + by(across) * relief : (across) => hillTop(across) + by(across);
      }
      if (!shape.clearCopy || !copyBox) return curve;
      return (across) => {
        const depth = curve(across);
        if (!stage.room) return depth;
        const horizontalRadius = words.a + Math.max(100, cssW * 0.12);
        const distance = Math.abs(half + across * half - words.x) / horizontalRadius;
        const weight = (1 + Math.cos(Math.PI * Math.min(distance, 1) ** 2)) / 2;
        const clearance = clamp(words.y + words.b + 32 - (stage.base - stage.room * 0.14), 0, stage.room * 0.82);
        return depth + weight * clearance * (1 - smooth(0.06, 0.95, depth)) / stage.room;
      };
    }, sky2 = sheets.find((sheet) => sheet.name === "sky"), landTop = sky2 ? guide(resolve(sky2.top)) : hillTop, meadow = sheets.find((sheet) => sheet.name === "meadow");
    meadowTop = meadow ? guide(resolve(meadow.top)) : hillTop, meadowFoot = meadow ? guide(resolve(meadow.foot)) : (across) => hillTop(across) + 1;
    let highest = 0, deepest = 1;
    for (let i = 0; i <= 32; i += 1)
      highest = Math.min(highest, landTop(i / 16 - 1)), deepest = Math.max(deepest, meadowFoot(i / 16 - 1));
    let foot = value(shape.foot), room = Math.max(
      shape.least,
      Math.min(value(shape.room), (cssH - foot - value(shape.head)) / (deepest - highest))
    ), base = cssH - foot - deepest * room, down = (v) => base + v * room;
    landBase = base, landRoom = room, stage.room = room, stage.base = base, mode.glow && sheets.forEach((sheet, row) => {
      let place = resolve(sheet.glowAt || mode.glow.place);
      glowPlaces[row] = [half + place.at[0] * half, down(place.at[1]), place.half[0] * half, place.half[1] * room];
    }), mode.sun && (sunPlace = resolve(mode.sun.place), sunRise = resolve(mode.sun.rise)), mode.fade && (fadeAt = resolve(mode.fade.at)), skyTop = sky2 ? landTop : () => -base / room;
    let loft = (top, foot2, span, seed, paintFrom) => {
      let fromPx = span[0] * half, toPx = span[1] * half, cols = Math.min(320, Math.max(12, Math.round((toPx - fromPx) / 7))), rows = 18, topAt = (x) => down(top(x / half)), footAt = (x) => down(foot2(x / half)), thickest = 1;
      for (let c = 0; c <= cols; c += 1) {
        let x = fromPx + (toPx - fromPx) * c / cols;
        thickest = Math.max(thickest, footAt(x) - topAt(x));
      }
      let count = Math.max(4, Math.ceil(thickest / 10)), places = new Float32Array((cols + 1) * (rows + 1) * 6), links = new Uint32Array(cols * rows * 6), step = (toPx - fromPx) / cols;
      for (let c = 0; c <= cols; c += 1) {
        let x = fromPx + step * c, t0 = topAt(x), f0 = Math.max(t0 + 0.2, footAt(x)), t1 = topAt(x + step), f1 = Math.max(t1 + 0.2, footAt(x + step));
        for (let r = 0; r <= rows; r += 1) {
          let a = r / rows, y = t0 + (f0 - t0) * a, slope = (t1 + (f1 - t1) * a - y) / step, o = (c * (rows + 1) + r) * 6;
          places[o] = half + x, places[o + 1] = y, places[o + 2] = a * count, places[o + 3] = x + seed, places[o + 4] = (f0 - t0) / count / Math.sqrt(1 + slope * slope), places[o + 5] = paintFrom + (1 - paintFrom) * a;
        }
      }
      for (let c = 0; c < cols; c += 1)
        for (let r = 0; r < rows; r += 1) {
          let i0 = c * (rows + 1) + r;
          links.set([i0, i0 + rows + 1, i0 + 1, i0 + 1, i0 + rows + 1, i0 + rows + 2], (c * rows + r) * 6);
        }
      return { places, links };
    }, join = (grids) => {
      let places = new Float32Array(grids.reduce((sum, g) => sum + g.places.length, 0)), links = new Uint32Array(grids.reduce((sum, g) => sum + g.links.length, 0)), placed = 0, linked = 0, ranges = grids.map((g) => {
        places.set(g.places, placed);
        let first = placed / 6;
        for (let i = 0; i < g.links.length; i += 1)
          links[linked + i] = g.links[i] + first;
        let range = { offset: linked * 4, count: g.links.length };
        return placed += g.places.length, linked += g.links.length, range;
      });
      return { places, links, ranges };
    }, shrub = (sheet, [across, wide, tall, flowering], seed) => {
      let named = sheet.on === "hill" || sheet.on === "meadow" ? null : sheets.find((other) => other.name === sheet.on && other.top), hillOrMeadow = sheet.on === "hill" ? hillTop : meadowTop, ground = named ? guide(resolve(named.top)) : hillOrMeadow, size = Math.max(0.7, cssW / 1300), w2 = wide * size / half, h2 = tall * size / room, many = 4 + Math.floor(hashed(seed * 3.1) * 3), lumps = [];
      for (let k = 0; k < many; k += 1) {
        let f = k / (many - 1) - 0.5, c = across + (f * 1.3 + (hashed(seed * 5.7 + k * 1.3) - 0.5) * 0.18) * w2, lw = w2 * (0.34 + 0.16 * hashed(seed * 2.3 + k)), dome = Math.sqrt(Math.max(0, 1 - (f * 1.3) ** 2));
        lumps.push([c, lw, h2 * (0.5 + 0.5 * dome) * (0.8 + 0.3 * hashed(seed * 9.1 + k * 2.7))]);
      }
      let reach = Math.max(...lumps.map(([c, lw]) => Math.abs(c - across) + lw)), heap = (x) => Math.max(0, ...lumps.map(([c, lw, lh]) => lh * Math.max(0, 1 - ((x - c) / lw) ** 2) ** 0.5)), top = (x) => ground(x) - heap(x);
      return flowering && gorse.push({
        from: (across - reach * 0.9) * half + half,
        to: (across + reach * 0.9) * half + half,
        top: (x) => down(top(x / half - 1)),
        seed
      }), bushes.push({
        from: (across - reach) * half + half,
        to: (across + reach) * half + half,
        top: (x) => down(top(x / half - 1)),
        base: (x) => down(ground(x / half - 1) + shape.sink),
        front: sheet.front
      }), loft(top, (x) => ground(x) + shape.sink, [across - reach, across + reach], seed * 53, 0);
    };
    gorse.length = 0, bushes.length = 0;
    let made = [];
    frontTops = frontRows.length ? new Float32Array(Math.ceil(cssW) + 1).fill(Number.POSITIVE_INFINITY) : null;
    for (let row = 0; row < sheets.length; row += 1) {
      let sheet = sheets[row], front = frontRows.includes(row);
      if (sheet.shrubs)
        made.push(join(sheet.shrubs.map((bush, index) => shrub({ ...sheet, front }, bush, row * 11 + index))));
      else {
        let top = resolve(sheet.top), points = pointsOf(top), topAt = guide(top);
        if (sheetTops.set(sheet.name, topAt), made.push(loft(topAt, guide(resolve(sheet.foot)), [points[0][0], points[points.length - 1][0]], row * 137, 0)), front) {
          sheetHigh[row] = Number.POSITIVE_INFINITY;
          let [from, to] = [points[0][0], points[points.length - 1][0]];
          for (let x = 0; x < frontTops.length; x += 1) {
            let across = x / half - 1;
            if (across >= from && across <= to) {
              let y = down(topAt(across));
              frontTops[x] = Math.min(frontTops[x], y), sheetHigh[row] = Math.min(sheetHigh[row], y);
            }
          }
        }
      }
      if (front && sheet.shrubs) {
        sheetHigh[row] = Number.POSITIVE_INFINITY;
        for (let bush of bushes.filter((each) => each.front))
          for (let x = Math.max(0, Math.ceil(bush.from)); x <= Math.min(frontTops.length - 1, Math.floor(bush.to)); x += 1) {
            let y = bush.top(x);
            frontTops[x] = Math.min(frontTops[x], y), sheetHigh[row] = Math.min(sheetHigh[row], y);
          }
      }
      yield;
    }
    let mesh2 = join(made);
    landRanges = mesh2.ranges, yield COST.upload, yield* upload(gl.ARRAY_BUFFER, landVertices, mesh2.places, parts), yield COST.upload, yield* upload(gl.ELEMENT_ARRAY_BUFFER, landIndices, mesh2.links, parts, landVao);
  }, buildLand = () => all(landSteps(!1)), airTop = curveThrough(mode.air.top), airFoot = curveThrough(mode.air.foot), toScreen = (across, down) => [cssW / 2 + across * (cssW / 2), landBase + down * landRoom], BANDS = 32, BEHIND = 4, bands = new Int32Array(BANDS * 4), cutBand = -1, growSteps = function* (parts = !1) {
    let rand = random(7919), blades2 = [], grass = mode.grass, wordsLeft = words.x - words.a - 10, wordsRight = words.x + words.a + 10, wordsFoot = words.y + words.b + 6, placeAt = (across, near2) => {
      let top = hillTop(across) + 0.03, foot = meadowFoot(across) - 0.05;
      return toScreen(across, top + (foot - top) * near2);
    }, inkFor = (near2, r) => {
      let at = clamp(1.2 + near2 * 2 + (r - 0.5) * 1.1, 0, grass.inks.length - 1.001);
      return [Math.floor(at), fract(at)];
    }, blade = (x, y, near2, tall, lean, r) => {
      if (y - tall < wordsFoot && x > wordsLeft && x < wordsRight || hidden && y < hidden.bottom - 2 && x > hidden.left + 4 && x < hidden.right - 4 && !inFront(x, y))
        return;
      let wide = grass.wide[0] + (grass.wide[1] - grass.wide[0]) * near2, [ink2, mix] = inkFor(near2, r), grow = 0.7 + 1.1 * (x / cssW) + 0.2 * rand();
      blades2.push([x, y, tall, wide, ink2, mix, 0.7 + 0.28 * rand(), 0, lean, rand() * 6, 0.1 * rand(), grow]);
    }, tufts = Math.round(cssW * grass.tufts);
    for (let index = 0; index < tufts; index += 1) {
      let across = -1.04 + rand() * 2.08, near2 = 0.25 + 0.75 * rand() ** 0.6, [x, y] = placeAt(across, near2), tall = (grass.tall[0] + (grass.tall[1] - grass.tall[0]) * near2 ** 1.4) * Math.max(0.75, fit), many = grass.blades[0] + Math.floor(rand() * (grass.blades[1] - grass.blades[0] + 1)), r = rand();
      for (let k = 0; k < many; k += 1) {
        let f = many > 1 ? k / (many - 1) - 0.5 : 0;
        blade(
          x + f * 6 * near2 + (rand() - 0.5) * 2,
          y + rand() * 1.5,
          near2,
          tall * (0.6 + 0.5 * rand()) * (1 - Math.abs(f) * 0.35),
          f * grass.fan + (rand() - 0.5) * grass.rest,
          r
        );
      }
    }
    let lane = Math.round(cssW * grass.lane);
    for (let index = 0; index < lane; index += 1) {
      let across = -1.04 + rand() * 2.08, near2 = clamp((mode.passer || PASSER).lane + (rand() + rand() - 1) * 0.16, 0.2, 1), [x, y] = placeAt(across, near2), tall = (grass.tall[0] + (grass.tall[1] - grass.tall[0]) * near2 ** 1.2) * (0.8 + 0.4 * rand()) * Math.max(0.75, fit), many = 2 + Math.floor(rand() * 4), r = rand();
      for (let k = 0; k < many; k += 1) {
        let f = many > 1 ? k / (many - 1) - 0.5 : 0;
        blade(
          x + f * 5 + (rand() - 0.5) * 2,
          y + rand() * 1.5,
          near2,
          tall * (0.7 + 0.4 * rand()),
          f * grass.fan + (rand() - 0.5) * grass.rest,
          r
        );
      }
    }
    let singles = Math.round(cssW * grass.singles);
    for (let index = 0; index < singles; index += 1) {
      let across = -1.04 + rand() * 2.08, near2 = rand() ** 0.7, [x, y] = placeAt(across, near2), tall = (grass.tall[0] + (grass.tall[1] - grass.tall[0]) * near2 ** 1.4) * (0.4 + 0.5 * rand()) * Math.max(0.75, fit);
      blade(x, y, near2, tall, (rand() - 0.5) * grass.rest * 2, rand());
    }
    yield COST.grid;
    let { flowers, palettes, paintNames } = mode, size = Math.max(0.75, fit), ink = (name) => paintNames.indexOf(name), any = (list) => list[Math.floor(rand() * list.length)], field = (x, y) => {
      let ix = Math.floor(x), iy = Math.floor(y), fx = x - ix, fy = y - iy, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), at = (i, j) => hashed(i * 57.31 + j * 131.7), a = at(ix, iy), b = at(ix + 1, iy), c = at(ix, iy + 1), d = at(ix + 1, iy + 1);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }, totals = Object.fromEntries(
      Object.entries(palettes).map(([name, list]) => [name, list.reduce((sum, [, often]) => sum + often, 0)])
    ), pickPaint = (palette, across, near2) => {
      let list = palettes[palette], total = totals[palette], patch = clamp((field(across * 3.2 + 40, near2 * 6 + 9) - 0.5) * 2.4 + 0.5, 0, 0.999), u = (rand() < 0.6 ? patch : rand()) * total;
      for (let [name, often] of list)
        if (u -= often, u < 0)
          return name;
      return list[list.length - 1][0];
    }, half = cssW / 2, reach = Math.min(half, flowers.stage), onLand = reach / half, columns = 480, tops = new Float32Array(columns + 1), feet = new Float32Array(columns + 1);
    for (let i = 0; i <= columns; i += 1) {
      let across = -1.2 + 2.4 * i / columns;
      tops[i] = hillTop(across) + 0.03, feet[i] = meadowFoot(across) - 0.05;
    }
    let span = (land2) => {
      let f = clamp((land2 + 1.2) / 2.4, 0, 1) * columns, i = Math.min(columns - 1, Math.floor(f)), u = f - i;
      return [tops[i] + (tops[i + 1] - tops[i]) * u, feet[i] + (feet[i + 1] - feet[i]) * u];
    }, placeQuick = (across, near2) => {
      let land2 = across * onLand, [top, foot] = span(land2);
      return toScreen(land2, top + (foot - top) * near2);
    }, { size: SIZE, stem: STEM, blur: BLUR } = flowers, sizeAt = (near2) => (SIZE.far + (SIZE.close - SIZE.far) * clamp(near2, 0, 1) ** SIZE.curve) * size, stemAt = (near2) => (STEM.far + (STEM.close - STEM.far) * clamp(near2, 0, 1) ** STEM.curve) * size, focused = sizeAt(flowers.focus), blurAt = (near2) => {
      let r = sizeAt(near2), soft = r > focused ? Math.min((r - focused) * BLUR.front, r * BLUR.most) : Math.min(BLUR.deepest * size, (focused - r) * BLUR.behind);
      return Math.max(BLUR.least, soft);
    }, fadeAt2 = (near2) => 0.95 - (0.95 - flowers.fade[2]) * (1 - smooth(flowers.fade[0], flowers.fade[1], near2)), ownAt = (near2, own) => {
      let far = 1 - smooth(0.3, 0.45, near2);
      return [own[0] + (flowers.far[0] - own[0]) * far, own[1] + (flowers.far[1] - own[1]) * far];
    }, coverStops = typeof flowers.cover == "function" ? flowers.cover(cssW, hidden ? cssH - hidden.bottom : cssH) : flowers.cover, coverAt = (near2) => {
      let k = 0;
      for (; k < coverStops.length - 2 && coverStops[k + 1][0] < near2; )
        k += 1;
      let [n0, c0] = coverStops[k], [n1, c1] = coverStops[k + 1];
      return c0 + (c1 - c0) * clamp((near2 - n0) / (n1 - n0), 0, 1);
    }, DEPTHS = 256, thickTable = new Float32Array(DEPTHS + 1);
    for (let k = 0; k <= DEPTHS; k += 1) {
      let near2 = k / DEPTHS, [lo, hi] = ownAt(near2, SIZE.own), r = sizeAt(near2) * (lo + hi) * 0.5;
      thickTable[k] = coverAt(near2) / (Math.PI * 0.65 * r * r);
    }
    let thickAt = (near2) => thickTable[Math.round(clamp(near2, 0, 1) * DEPTHS)], slopeAt = (across, near2) => {
      let [x0, y0] = placeQuick(across - 0.02, near2), [x1, y1] = placeQuick(across + 0.02, near2);
      return Math.atan2(y1 - y0, x1 - x0);
    }, GRID = [192, 40], RANGE = 2.4;
    if (!driftGrids.has(flowers)) {
      let thickness2 = new Float32Array(GRID[0] * GRID[1]), owner2 = new Int8Array(GRID[0] * GRID[1]).fill(-1), way2 = new Float32Array(GRID[0] * GRID[1]), along2 = (points, t) => {
        let f = t * (points.length - 1), i = Math.min(points.length - 2, Math.floor(f)), u = f - i, p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
        return [0, 1].map(
          (k) => p1[k] + 0.5 * u * (p2[k] - p0[k] + u * (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k] + u * (3 * (p1[k] - p2[k]) + p3[k] - p0[k])))
        );
      };
      for (let index = 0; index < flowers.drifts.length; index += 1) {
        let drift = flowers.drifts[index], length = drift.line.slice(1).reduce((sum, p, k) => sum + Math.hypot(p[0] - drift.line[k][0], p[1] - drift.line[k][1]), 0), steps = Math.ceil(length / 0.02);
        for (let step = 0; step <= steps; step += 1) {
          let t = step / steps, [a, n] = along2(drift.line, t), wide = drift.wide[0] + (drift.wide[1] - drift.wide[0]) * t, full = drift.full[0] + (drift.full[1] - drift.full[0]) * t, ci = (a + RANGE) / (2 * RANGE) * GRID[0] - 0.5, cj = n * GRID[1] - 0.5, ri = wide * 1.3 * GRID[0] / (2 * RANGE) + 1, rj = wide * GRID[1] + 1;
          for (let i = Math.max(0, Math.floor(ci - ri)); i <= Math.min(GRID[0] - 1, Math.ceil(ci + ri)); i += 1)
            for (let j = Math.max(0, Math.floor(cj - rj)); j <= Math.min(GRID[1] - 1, Math.ceil(cj + rj)); j += 1) {
              let cell = j * GRID[0] + i;
              if (thickness2[cell] >= full)
                continue;
              let da = ((i + 0.5) / GRID[0] * 2 * RANGE - RANGE - a) / (wide * 1.3), dn = ((j + 0.5) / GRID[1] - n) / wide, far = da * da + dn * dn;
              if (far >= 1)
                continue;
              let at = full * (1 - smooth(0.55, 1, Math.sqrt(far)));
              at > thickness2[cell] && (thickness2[cell] = at, owner2[cell] = index, way2[cell] = t);
            }
        }
        mode.wake && (yield);
      }
      driftGrids.set(flowers, { thickness: thickness2, owner: owner2, way: way2 }), yield;
    }
    let { thickness, owner, way } = driftGrids.get(flowers), cellOf = (across, near2) => [(across + RANGE) / (2 * RANGE) * GRID[0] - 0.5, near2 * GRID[1] - 0.5], thickOf = (across, near2) => {
      let [fi, fj] = cellOf(across, near2), i = clamp(Math.floor(fi), 0, GRID[0] - 2), j = clamp(Math.floor(fj), 0, GRID[1] - 2), u = clamp(fi - i, 0, 1), v = clamp(fj - j, 0, 1), at = (di, dj) => thickness[(j + dj) * GRID[0] + i + di];
      return (at(0, 0) * (1 - u) + at(1, 0) * u) * (1 - v) + (at(0, 1) * (1 - u) + at(1, 1) * u) * v;
    }, nearestOf = (across, near2) => {
      let [fi, fj] = cellOf(across, near2);
      return clamp(Math.round(fj), 0, GRID[1] - 1) * GRID[0] + clamp(Math.round(fi), 0, GRID[0] - 1);
    }, dabs = [], stroke = (order, x, y, stem, long, breadth, turn, blur, [first, second], kind, extra, sway) => {
      dabs.push([
        order,
        x,
        y,
        stem,
        long,
        breadth,
        turn,
        blur,
        rand(),
        sway.lean,
        sway.phase,
        sway.stiff,
        sway.grow,
        ink(first),
        ink(second),
        kind,
        extra
      ]);
    }, swayAt = (x, stiff) => ({
      lean: (rand() - 0.5) * 0.3,
      phase: rand() * 6,
      stiff,
      grow: 1.1 + 1.1 * (x / cssW) + 0.3 * rand()
    }), onStage = (x, y, stem, out) => y - stem - out * 1.6 < wordsFoot + 4 && x + out * 2 > wordsLeft && x - out * 2 < wordsRight || x < -out * 2 || x > cssW + out * 2 || hidden && x - out > hidden.left && x + out < hidden.right && y < hidden.bottom - 2 && !inFront(x, y) ? !1 : !bushes.some((bush) => x > bush.from && x < bush.to && y > bush.top(x) - 2 && y < bush.base(x)), leaf = (across, near2, order, x, y, stem, long, blur, sway) => {
      stroke(
        order,
        x,
        y,
        stem,
        long,
        long * (0.22 + 0.13 * rand()),
        slopeAt(across, near2) + (rand() - 0.5) * 1.4 + (rand() < 0.5 ? Math.PI : 0),
        blur,
        [any(["shade", "deepGreen"]), "leaf"],
        0.25,
        0.6,
        sway
      );
    }, crisp = [], nearHeads = [], flower = (across, near2, drift, thick, stray = !1, at = null) => {
      let placed = at || placeQuick(across, near2), x = placed[0], y = placed[1], [lo, hi] = ownAt(near2, drift.own || SIZE.own), reachOf = sizeAt(near2) * (lo + (hi - lo) * rand()) * (stray ? 0.7 : 1), blur = blurAt(near2), stem = stemAt(near2) * (STEM.own[0] + (STEM.own[1] - STEM.own[0]) * rand()), front = smooth(0.62, 0.85, near2);
      if (front >= 0.5) {
        let under = nearHeads.find((h2) => Math.hypot(h2.x - x, h2.y - (y - stem)) < Math.max(h2.reach, reachOf) * 0.45);
        if (under) {
          if (rand() < 0.5)
            return;
          x += (rand() < 0.5 ? -1 : 1) * Math.max(under.reach, reachOf) * 0.8;
        }
      }
      if (!onStage(x, y, stem, reachOf + blur * 0.5))
        return;
      front >= 0.5 && nearHeads.push({ x, y: y - stem, reach: reachOf });
      let name = pickPaint(drift.paints, across, near2);
      if (near2 > 0.85 && PALE.includes(name) && (rand() < 0.6 || thick < 0.35)) {
        for (let k = 0; k < 4 && PALE.includes(name); k += 1)
          name = pickPaint(drift.paints, across + 0.37 * (k + 1), near2);
        PALE.includes(name) && (name = any(["coral", "salmon", "pink"]));
      }
      near2 > 0.85 && name === "white" && (name = "cream"), front >= 0.5 && name === "lilac" && (name = any(["pink", "cream"])), near2 > 0.85 && reachOf > 12 && (name === "pink" && rand() < 0.5 ? name = any(["salmon", "peach"]) : name === "rose" && (name = "coral"));
      let flat = slopeAt(across, near2), sway = swayAt(x, 0.25 + 0.3 * rand()), pale = name === "white" || name === "cream" || name === "butter", load = (flowers.fade ? fadeAt2(near2) : 0.95 - 0.6 * (1 - smooth(0.12, 0.5, near2))) * (pale && near2 < 0.5 ? 0.6 : 1);
      if (!stray && rand() < flowers.leaves * thick * smooth(0.3, 0.7, near2) * (1 - smooth(0.7, 0.8, near2)) && leaf(
        across,
        near2,
        y - 0.5,
        x + (rand() - 0.5) * reachOf * 2.2,
        y + rand() * 2,
        stem * (0.1 + 0.3 * rand()),
        reachOf * (1.1 + 0.7 * rand()),
        blur,
        sway
      ), !stray && front > 0.5 && thick > 0.3) {
        let leaves = rand() < 0.6 ? 2 : 1, leaning = (rand() < 0.5 ? -1 : 1) * (0.15 + 0.35 * rand());
        for (let k = 0; k < leaves; k += 1) {
          let long = reachOf * (1.2 + 0.6 * rand()), late = rand() < 0.3, aside = (rand() * 2 - 1) * reachOf * 1.1, lift = Math.max(stem * (0.4 + 0.25 * rand()), long * 0.6);
          stroke(
            late && Math.abs(aside) > reachOf * 0.6 ? y + 0.1 : y - 0.5,
            x + aside,
            y,
            lift,
            long,
            long * 0.3,
            -Math.PI / 2 + leaning * 1.3 + (rand() - 0.5) * 0.35,
            blur * 0.7,
            [any(["leaf", "deepGreen"]), "leaf"],
            0.25,
            0.6 + 0.15 * rand(),
            sway
          );
        }
      }
      let stemmed = front > 0.5 ? 0.6 : flowers.stems * smooth(0.36, 0.5, near2);
      if (!stray && near2 > 0.36 && rand() < stemmed && blades2.push([
        x,
        y,
        stem,
        Math.max(0.6, reachOf * 0.12),
        2,
        0.4 + 0.5 * rand(),
        0.85,
        blur > 1.2 ? blur : 0,
        sway.lean,
        sway.phase,
        sway.stiff,
        sway.grow
      ]), !stray && near2 > 0.45 && near2 < 0.75 && DEEPER[name] && drift.paints !== "buttercups" && rand() < flowers.crisp) {
        let R = reachOf * 1.1;
        if (!crisp.some((f) => Math.hypot(f.x - x, f.y - y) < (R + f.R) * 3)) {
          crisp.push({ x, y, R }), stroke(
            y + 0.02,
            x,
            y,
            stem,
            R,
            R,
            (rand() - 0.5) * 0.6,
            Math.max(1.2, blur),
            [name, DEEPER[name]],
            1,
            8,
            sway
          );
          return;
        }
      }
      let round = front >= 0.5, fanned = round || stray || (name === "white" || name === "cream") && reachOf > 2.5 && rand() < 0.9, many = 1;
      round ? many = 5 + Math.floor(rand() * 2) : fanned ? many = 2 + (rand() < 0.4 ? 1 : 0) : reachOf >= 1.6 && (many = (rand() < 0.25 ? 2 : 1) + (rand() < 0.04 ? 1 : 0));
      let lie = round ? rand() * Math.PI * 2 : flat + (rand() - 0.5) * 0.8 + (rand() < 0.5 ? Math.PI : 0), missing = round && many > 5 && rand() < 0.4 ? Math.floor(rand() * many) : -1, smaller = round ? Math.floor(rand() * many) : -1;
      for (let k = 0; k < many; k += 1) {
        if (k === missing)
          continue;
        let wide = flowers.wide[0] + (flowers.wide[1] - flowers.wide[0]) * rand(), long = reachOf * (k === 0 ? 1 : 0.5 + 0.3 * rand()), turn = lie + (k === 0 ? 0 : (rand() - 0.5) * 0.6), dx = k === 0 ? 0 : (rand() - 0.5) * reachOf * 0.7, dy = k === 0 ? 0 : (rand() - 0.3) * reachOf * 0.35;
        if (round) {
          let angle = lie + k / many * Math.PI * 2 + (rand() - 0.5) * 0.5;
          long = reachOf * (0.5 + 0.12 * rand()) * (k === smaller ? 0.75 + 0.15 * rand() : 1), turn = angle + Math.PI, dx = Math.cos(angle) * reachOf * 0.46, dy = -Math.sin(angle) * reachOf * 0.46;
        } else fanned && (long = reachOf * (0.6 + 0.2 * rand()), turn = lie + (k - (many - 1) / 2) * 0.55 + (rand() - 0.5) * 0.2, dx = 0, dy = 0);
        let paler = !fanned && k > 0 && k === many - 1 && rand() < 0.5;
        stroke(
          y + k * 0.01,
          x + dx,
          y,
          stem + dy,
          long,
          long * (round ? 0.6 + 0.2 * rand() : wide),
          turn,
          blur,
          [paler ? PALER[name] : name, any(SECOND[name])],
          0,
          load,
          sway
        );
      }
      if ((name === "white" || name === "cream") && round) {
        let long = reachOf * 0.22;
        stroke(
          y + 0.05,
          x - reachOf * 0.12,
          y,
          stem + reachOf * 0.15,
          long,
          long * 0.9,
          rand() * 6.28,
          blur,
          ["butter", "cream"],
          0,
          0.45,
          sway
        );
      } else if ((name === "white" || name === "cream") && reachOf > 3 && rand() < 0.35) {
        let long = reachOf * (0.16 + 0.14 * rand()), back = fanned ? 0 : -reachOf * 0.3;
        stroke(
          y + 0.05,
          x + Math.cos(lie) * back,
          y,
          stem - Math.sin(lie) * back,
          long,
          long * 0.85,
          rand() * 6.28,
          blur,
          [any(["butter", "butter", "cream"]), "gold"],
          0,
          load,
          sway
        );
      }
    }, landRoomOf = (land2) => {
      let [top, foot] = span(land2);
      return (foot - top) * landRoom;
    }, cellAcross = 2 * RANGE / GRID[0], cellNear = 1 / GRID[1], shown = 1.05 / onLand;
    for (let i = 0; i < GRID[0] - 1; i += 1) {
      let a0 = (i + 0.5) / GRID[0] * 2 * RANGE - RANGE;
      if (a0 + cellAcross < -shown || a0 > shown)
        continue;
      let height = landRoomOf((a0 + cellAcross * 0.5) * onLand), width = cellAcross * reach;
      for (let j = 0; j < GRID[1] - 1; j += 1) {
        let cell = j * GRID[0] + i, most = Math.max(
          thickness[cell],
          thickness[cell + 1],
          thickness[cell + GRID[0]],
          thickness[cell + GRID[0] + 1]
        );
        if (most <= 0.01)
          continue;
        let n0 = (j + 0.5) / GRID[1], densest = Math.max(thickAt(n0), thickAt(n0 + cellNear * 0.5), thickAt(n0 + cellNear)), expected = most * densest * width * height * cellNear;
        rand.reseed(7919 + cell * 2654435769);
        let count = Math.floor(expected + rand());
        for (let k = 0; k < count; k += 1) {
          let across = a0 + cellAcross * rand(), near2 = n0 + cellNear * rand();
          if (Math.abs(across) > shown || near2 > 0.74 && Math.abs(across) > flowers.front)
            continue;
          let thick = thickOf(across, near2);
          if (rand() * most * densest > thick * thickAt(near2))
            continue;
          let at = nearestOf(across, near2), which = owner[at];
          if (which < 0)
            continue;
          let drift = flowers.drifts[which], patchy = drift.patchy ? smooth((drift.patchyFrom || 0) - 0.1, (drift.patchyFrom || 0) + 0.1, way[at]) : 0, clump = smooth(
            0.25 + 0.17 * patchy,
            0.6 + 0.12 * patchy,
            field(across * 5 + which * 17.3, near2 * 9 + which * 5.1)
          ), floor = 0.4 - 0.2 * patchy, open = drift.gaps ? smooth(0.42, 0.56, field(across * 1.7 + 61.3, near2 * 2.2 + 4.7)) : 1;
          if (rand() < flowers.bed * thick * open * (0.5 + 0.5 * clump) * smooth(0.35, 0.6, near2) * (1 - smooth(0.72, 0.8, near2))) {
            let [x, y] = placeQuick(across, near2), stem = stemAt(near2) * (0.1 + 0.25 * rand()), long = sizeAt(near2) * (0.8 + 0.5 * rand());
            if (onStage(x, y, stem, long)) {
              let sway = swayAt(x, 0.5);
              leaf(across, near2, y - 0.5, x - long * 0.35, y, stem, long, blurAt(near2), sway), leaf(across, near2, y - 0.5, x + long * 0.35, y + 1, stem * 0.8, long * 0.85, blurAt(near2), sway);
            }
          }
          rand() > open * (floor + (1 - floor) * clump) || flower(across, near2, drift, thick);
        }
      }
      yield;
    }
    let strays = Math.round(flowers.strays * clamp(cssW / 1232, 0.45, 1.3)), kinds = Object.keys(palettes);
    for (let index = 0; index < strays; index += 1)
      rand.reseed(104729 + index * 2654435769), flower((-1.05 + rand() * 2.1) / onLand, 0.4 + 0.32 * rand(), { paints: any(kinds) }, 0, !0);
    if (gorse.forEach((crown) => {
      rand.reseed(crown.seed * 7919 + 17);
      let many = Math.round((crown.to - crown.from) * flowers.gorse);
      for (let index = 0; index < many; index += 1) {
        let x = crown.from + (crown.to - crown.from) * rand(), y = crown.top(x) + 1 + 6 * rand() ** 1.6 * size, bud = (flowers.bud[0] + (flowers.bud[1] - flowers.bud[0]) * rand()) * size;
        stroke(
          y,
          x,
          y,
          1,
          bud,
          bud * (0.5 + 0.2 * rand()),
          (rand() - 0.5) * 0.9 + (rand() < 0.5 ? Math.PI : 0),
          0.3,
          [rand() < 0.6 ? "gold" : "butter", "butter"],
          0,
          0.95,
          swayAt(x, 0.85)
        );
      }
    }), yield mode.plant ? COST.plant : void 0, mode.plant) {
      let planted = (x, stiff, lean, phase) => {
        let sway = swayAt(x, stiff);
        return lean !== void 0 && (sway.lean = lean), phase !== void 0 && (sway.phase = phase), sway;
      };
      perches.length = 0, shelter.length = 0, mistBand = [-1e5, -99999], mode.plant({
        w: cssW,
        h: cssH,
        hidden,
        rand,
        place: placeQuick,
        sizeAt,
        stemAt,
        blurAt,
        // where the words stand, and the top line of a sheet of the land at a place across, in CSS pixels
        words: { x: words.x, y: words.y, a: words.a, b: words.b },
        ground: (name, x) => landBase + (sheetTops.get(name) || hillTop)(x / (cssW / 2) - 1) * landRoom,
        // A stroke can be given the depth it is painted at (`order`), so that a tree painted from its trunk out to its
        // leaves goes into the meadow at the depth of its foot, and the grass in front of that is painted over it.
        flower: (across, near2, paints2 = "meadow", thick = 1) => flower(across, near2, { paints: paints2 }, thick),
        // a meadow flower as the drifts paint one at that depth, rooted at a place of the composition's own choosing
        flowerAt: (x, y, near2, paints2 = "meadow", thick = 1) => flower(x / (cssW / 2) - 1, near2, { paints: paints2 }, thick, !1, [x, y]),
        inFront,
        bloom: ({
          x,
          y,
          stem = 0,
          reach: r,
          petals = 8,
          blur = 1.2,
          paints: paints2 = ["white", "cream"],
          turn = 0,
          stiff = 0.6,
          lean,
          order,
          phase
        }) => stroke(order ?? y + 0.02, x, y, stem, r, r, turn, blur, paints2, 1, petals, planted(x, stiff, lean, phase)),
        dab: ({
          x,
          y,
          stem = 0,
          long,
          wide = 0.7,
          turn = 0,
          blur = 0.6,
          paints: paints2,
          load = 0.95,
          kind = 0,
          stiff = 0.5,
          lean,
          order,
          phase
        }) => stroke(
          order ?? y,
          x,
          y,
          stem,
          long,
          long * wide,
          turn,
          blur,
          paints2,
          kind,
          load,
          planted(x, stiff, lean, phase)
        ),
        stalk: ({ x, y, tall, wide = 1, ink: at = 2, mix = 0.5, soft = 0, stiff = 0.6, lean }) => {
          let sway = planted(x, stiff, lean);
          blades2.push([x, y, tall, wide, at, mix, 0.85, soft, sway.lean, sway.phase, sway.stiff, sway.grow]);
        },
        // a place a butterfly can land, facing left (-1) or right (1), and a disc of the tree's shape (see `perch`)
        perch: (x, y, facing = 1) => {
          perches.push([x, y, facing]);
        },
        tree: (x, y, r) => {
          shelter.push([x, y, r]);
        },
        // the band, in CSS pixels down the canvas, across which strokes marked as mist thin away upward (see `mist`)
        mist: (from, to) => {
          mistBand = [from, to];
        }
      }), perching && shelterAt();
    }
    yield COST.sort, blades2.sort((a, b) => a[1] - b[1]);
    let bladesBehind = blades2.length;
    if (frontTops) {
      let ahead = blades2.filter((b) => inFront(b[0], b[1])), behind = blades2.filter((b) => !inFront(b[0], b[1]));
      bladesBehind = behind.length, behind.forEach((b, i) => {
        blades2[i] = b;
      }), ahead.forEach((b, i) => {
        blades2[bladesBehind + i] = b;
      });
    }
    let bladeData = new Float32Array(blades2.length * 12);
    blades2.forEach((b, i) => bladeData.set(b, i * 12)), yield COST.upload, yield* upload(gl.ARRAY_BUFFER, bladeVao.buffer, bladeData, parts), bladeVao.laid = bladeData, bladeVao.count = blades2.length, yield COST.sort;
    let fishOf = (d) => d[11] >= 0.999 && d[10] >= 399.5 && d[10] < 400 + mode.school.fish.length ? 1 : 0;
    dabs.sort(mode.school ? (a, b) => fishOf(a) - fishOf(b) || a[0] - b[0] : (a, b) => a[0] - b[0]);
    let firstFish = mode.school ? dabs.findIndex((d) => fishOf(d) === 1) : -1, sceneEnd = firstFish < 0 ? dabs.length : firstFish, dabsBehind = dabs.length;
    if (frontTops) {
      let scene2 = dabs.slice(0, sceneEnd), ahead = scene2.filter((d) => inFront(d[1], d[2])), behind = scene2.filter((d) => !inFront(d[1], d[2]));
      dabsBehind = behind.length, behind.forEach((d, i) => {
        dabs[i] = d;
      }), ahead.forEach((d, i) => {
        dabs[dabsBehind + i] = d;
      });
    }
    yield COST.sort;
    let bloomData = new Float32Array(dabs.length * 16);
    dabs.forEach((d, i) => {
      for (let k = 0; k < 16; k += 1)
        bloomData[i * 16 + k] = d[k + 1];
    }), yield COST.upload, yield* upload(gl.ARRAY_BUFFER, bloomVao.buffer, bloomData, parts), bloomVao.laid = bloomData, bloomVao.count = dabs.length, schoolFrom = sceneEnd, yield;
    let layBands = (bladeEnd, dabEnd, first, count) => {
      let bladeFrom = first === 0 ? 0 : bladesBehind, dabFrom = first === 0 ? 0 : dabsBehind, ends = [
        bladeEnd > bladeFrom ? blades2[bladeFrom][1] : null,
        dabEnd > dabFrom ? dabs[dabFrom][0] : null
      ].filter((v) => v !== null), lasts = [
        bladeEnd > bladeFrom ? blades2[bladeEnd - 1][1] : null,
        dabEnd > dabFrom ? dabs[dabEnd - 1][0] : null
      ].filter((v) => v !== null), deepest = Math.min(...ends, ...ends.length ? [] : [0]), nearest = Math.max(...lasts, ...lasts.length ? [] : [0]), bladeAt = bladeFrom, dabAt = dabFrom;
      for (let band = 0; band < count; band += 1) {
        let edge = band === count - 1 ? Number.POSITIVE_INFINITY : deepest + (nearest - deepest) * (band + 1) / count, fromBlade = bladeAt, fromDab = dabAt;
        for (; bladeAt < bladeEnd && blades2[bladeAt][1] < edge; )
          bladeAt += 1;
        for (; dabAt < dabEnd && dabs[dabAt][0] < edge; )
          dabAt += 1;
        bands.set([fromBlade, bladeAt - fromBlade, fromDab, dabAt - fromDab], (first + band) * 4);
      }
    };
    frontTops ? (layBands(bladesBehind, dabsBehind, 0, BEHIND), layBands(blades2.length, sceneEnd, BEHIND, BANDS - BEHIND), cutBand = BEHIND) : (layBands(blades2.length, sceneEnd, 0, BANDS), cutBand = -1);
  }, growMeadow = () => {
    let steps = growSteps(), step = steps.next();
    for (; !step.done; )
      step = steps.next();
  }, grownFor = { key: "", w: 1, h: 1, base: 0, room: 1 }, meadowTimer = 0, grown = () => {
    grownFor.key = landKey, grownFor.w = cssW, grownFor.h = cssH, grownFor.base = landBase, grownFor.room = landRoom, hush(), dirty = !0, settled = !1;
  }, meadowNow = () => {
    clearTimeout(meadowTimer), meadowTimer = 0, !(!landKey || cssW < 2) && (growMeadow(), grown());
  }, building = null, meadowAfter = (ms) => {
    clearTimeout(meadowTimer), meadowTimer = setTimeout(() => {
      meadowNow(), sync();
    }, ms);
  }, moveMeadow = () => {
    let sx = cssW / grownFor.w, sy = landRoom / grownFor.room;
    for (let run of [bladeVao, bloomVao]) {
      let laid = run.laid;
      if (!laid)
        continue;
      run.moved?.length !== laid.length && (run.moved = new Float32Array(laid.length));
      let moved = run.moved;
      moved.set(laid);
      let end = run === bloomVao ? Math.min(laid.length, schoolFrom * run.stride) : laid.length;
      for (let i = 0; i < end; i += run.stride)
        moved[i] = laid[i] * sx, moved[i + 1] = landBase + (laid[i + 1] - grownFor.base) * sy;
      gl.bindBuffer(gl.ARRAY_BUFFER, run.buffer), gl.bufferSubData(gl.ARRAY_BUFFER, 0, moved);
    }
  }, stirs = [], stirData = new Float32Array(STIR.count * 4), stirWay = new Float32Array(STIR.count * 2), lay = (x, y, push, wayX, wayY) => {
    stirs.push({ x, y, age: 0, push, wayX, wayY }), stirs.length > STIR.count && stirs.shift();
  }, passer = { on: !1, x: 0, y: 0, laidX: -1e9, laidY: -1e9 }, clock = 0, intro = resumes.has(root) || mode.intro === !1 || mode.draw === "once" ? 99 : 0;
  resumes.delete(root), mode.draw === "once" && (clock = mode.stillAt);
  let placePasser = () => {
    let walk = mode.passer;
    if (!walk) {
      passer.on = !1;
      return;
    }
    let t = clock - walk.first, cycle = t < 0 ? -1 : t % walk.every;
    if (cycle < 0 || cycle > walk.across) {
      passer.on = !1;
      return;
    }
    let f = cycle / walk.across, across = -1.15 + 2.3 * f, near2 = walk.lane + walk.wander * Math.sin(f * 7.1 + Math.floor(t / walk.every) * 2.3), top = hillTop(across) + 0.03, foot = meadowFoot(across) - 0.05, [x, y] = toScreen(across, top + (foot - top) * near2);
    passer.on = !0, passer.x = x, passer.y = y;
  }, pointer = { x: 0, y: 0, laidX: -1e9, laidY: -1e9, lastT: 0 }, onPointer = (event) => {
    if (PREFERS_REDUCED.matches || !inView)
      return;
    let rect = perching ? {
      left: pageLeft - (event.pageX - event.clientX),
      top: pageTop - (event.pageY - event.clientY),
      width: cssW,
      height: cssH
    } : canvas.getBoundingClientRect(), x = event.clientX - rect.left, y = event.clientY - rect.top;
    if (perching) {
      let at = treeAt(x, y);
      if (event.pointerType !== "touch" && at === 1 !== overTree && (overTree = at === 1, overTree ? scatter(x, y) : leftTree = clock), at > 0)
        return;
    }
    let overWords = y < words.y + words.b + 14 && Math.abs(x - words.x) < words.a + 10;
    if (x < 0 || x > rect.width || y < landBase - 10 || y > rect.height || overWords)
      return;
    let now = performance.now(), moved = Math.hypot(x - pointer.laidX, y - pointer.laidY);
    if (moved > mode.stir.every) {
      let dt = Math.max(16, now - pointer.lastT) / 1e3, speed = moved / dt, way = moved || 1;
      lay(x, y, clamp(speed / 900, 0.12, 0.55), (x - pointer.laidX) / way, (y - pointer.laidY) / way), pointer.laidX = x, pointer.laidY = y, pointer.lastT = now;
    }
    settled = !1, sync();
  };
  mode.pointer && window.addEventListener("pointermove", onPointer, { passive: !0 });
  let crossingStart = 0, pointerInBand = !1, onSchoolPointer = (event) => {
    if (PREFERS_REDUCED.matches || !inView)
      return;
    let rect = canvas.getBoundingClientRect();
    if (schoolPointer.x = event.clientX - rect.left, schoolPointer.y = event.clientY - rect.top, schoolPointer.at = clock, mode.crossing) {
      let inside = schoolPointer.x >= 0 && schoolPointer.x <= rect.width && schoolPointer.y >= 0 && schoolPointer.y <= rect.height;
      inside && !pointerInBand && !flock.some((b) => b.show > 0) && (crossingStart = clock), pointerInBand = inside;
    }
  };
  (mode.school || mode.crossing) && (window.addEventListener("pointermove", onSchoolPointer, { passive: !0 }), mode.crossing && window.addEventListener("pointerdown", onSchoolPointer, { passive: !0 }));
  let flock = mode.flock.map((b, index) => ({
    ...b,
    index,
    family: WING_NAMES.indexOf(b.wing),
    u: fract(index / mode.flock.length + b.seed * 0.37),
    phase: b.seed * 7,
    glide: 0,
    hindLag: null,
    lastFlap: 0,
    lift: 0,
    pose: FLIGHT.pose[0] + (FLIGHT.pose[1] - FLIGHT.pose[0]) * hashed(index * 3.3 + 0.2),
    flap: 0.4,
    hind: 0.34,
    lag: 0,
    swerveX: 0,
    swerveY: 0,
    show: 0,
    screenX: 0,
    screenY: 0,
    size: b.size,
    heading: 0,
    pitch: 0,
    roll: 0
  })), laneY = (m, x) => {
    let n = x / (cssW / 2), top = airTop(n);
    return landBase + (top + (airFoot(n) - top) * m) * landRoom;
  }, perching = !!mode.perch, perchWay = mode.perch || {}, perches = [], mistBand = [-1e5, -99999], shelter = [], SHELTER_CELL = 6, shelterGrid = null, shelterCols = 0, shelterRows = 0, crownBox = { x: 0, y: 0, a: 1, b: 1 }, pageLeft = 0, pageTop = 0, overTree = !1, leftTree = -1e9, nextBack = 0, owners = [], flockPlaced = !1, shelterAt = () => {
    shelterCols = Math.ceil(cssW / SHELTER_CELL) + 1, shelterRows = Math.ceil(cssH / SHELTER_CELL) + 1, shelterGrid = new Uint8Array(shelterCols * shelterRows);
    let round = perchWay.clear || 0;
    for (let [x, y, r] of shelter) {
      let reach = r + round, rows = [
        Math.max(0, Math.floor((y - reach) / SHELTER_CELL)),
        Math.min(shelterRows - 1, Math.floor((y + reach) / SHELTER_CELL))
      ], cols = [
        Math.max(0, Math.floor((x - reach) / SHELTER_CELL)),
        Math.min(shelterCols - 1, Math.floor((x + reach) / SHELTER_CELL))
      ];
      for (let row = rows[0]; row <= rows[1]; row += 1)
        for (let col = cols[0]; col <= cols[1]; col += 1) {
          let at = row * shelterCols + col, d = Math.hypot((col + 0.5) * SHELTER_CELL - x, (row + 0.5) * SHELTER_CELL - y) - SHELTER_CELL * 0.5;
          d < r ? shelterGrid[at] = 1 : d < reach && shelterGrid[at] === 0 && (shelterGrid[at] = 2);
        }
    }
    if (perches.length) {
      let clear = perchWay.own ? perches.filter(([x, y]) => clearOfGlass(x, y)) : perches, box = clear.length ? clear : perches, xs = box.map((p) => p[0]), ys = box.map((p) => p[1]), [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      Object.assign(crownBox, {
        x: (x0 + x1) / 2,
        y: (y0 + y1) / 2,
        a: Math.max(8, (x1 - x0) / 2),
        b: Math.max(8, (y1 - y0) / 2)
      });
    }
  }, nowX = (x) => x * cssW / grownFor.w, nowY = (y) => landBase + (y - grownFor.base) * landRoom / grownFor.room, treeAt = (x, y) => {
    if (!shelterGrid)
      return 0;
    let col = Math.floor(x * grownFor.w / cssW / SHELTER_CELL), row = Math.floor((grownFor.base + (y - landBase) * grownFor.room / landRoom) / SHELTER_CELL);
    return col >= 0 && row >= 0 && col < shelterCols && row < shelterRows ? shelterGrid[row * shelterCols + col] : 0;
  }, onTree = (x, y) => treeAt(x, y) === 1, perchNow = (k) => [nowX(perches[k][0]), nowY(perches[k][1])], clearOfGlass = (x, y) => x > glass.bandX + 8 && x < cssW - glass.bandX - 8 && y > glass.bandY + 8, usable = (k) => clearOfGlass(nowX(perches[k][0]), nowY(perches[k][1])), freePerch = (b, near2 = null, within = 0) => {
    let free = [];
    return perches.forEach((p, k) => {
      owners[k] >= 0 || k === b.at || !usable(k) || near2 && Math.hypot(nowX(p[0]) - near2[0], nowY(p[1]) - near2[1]) > within || free.push(k);
    }), free.length ? free[Math.floor(hashed(b.seed * 53.1 + clock * 1.7) * free.length)] : -1;
  }, flyTo = (b, state, x1, y1, dx2, dy2, to, end, dur, ease, delay = 0) => {
    b.state = state, b.path = [b.x, b.y, x1, y1, dx2, dy2, end ? end[0] : 0, end ? end[1] : 0], b.to = to, b.from = clock + delay, b.dur = Math.max(0.2, dur), b.ease = ease;
  }, alight = (b, k) => {
    b.state = "perched", b.at = k, b.landed = clock, b.wait = clock + perchWay.stay[0] + (perchWay.stay[1] - perchWay.stay[0]) * hashed(b.seed * 7.1 + clock);
  }, placeFlock = (still) => {
    owners = new Array(perches.length).fill(-1);
    let order = perches.map((_, k) => k).filter(usable).sort((p, q) => hashed(p * 3.7 + 1.3) - hashed(q * 3.7 + 1.3));
    flock.forEach((b, i) => {
      if (b.air = 0, b.hindLag = null, b.flitUntil = 0, !still && i >= flock.length - perchWay.arrive || i >= order.length) {
        b.state = "away", b.at = -1, b.x = -1e4, b.y = -1e4;
        return;
      }
      alight(b, order[i]), owners[order[i]] = i, b.landed = -1e9;
      let [x, y] = perchNow(order[i]);
      b.x = x, b.y = y;
    }), nextBack = Math.max(nextBack, perchWay.first), flockPlaced = !0;
  }, wordsOver = () => words.y + words.b < nowY(crownBox.y) - crownBox.b, scatter = (px, py) => {
    let over = wordsOver();
    for (let b of flock) {
      if (b.state === "away" || b.state === "flee")
        continue;
      let d = Math.hypot(b.x - px, b.y - py) || 1, r1 = hashed(b.seed * 31.7 + clock * 3.1), r2 = hashed(b.seed * 13.3 + clock * 7.9), ax = (b.x - px) / d + (r1 - 0.5) * 0.9, ay = Math.min((b.y - py) / d, 0) * 0.5 - 0.75 - r2 * 0.5, away = b.x > words.x ? 1 : -1;
      over ? (ax = away * Math.max(Math.abs(ax), 0.9), ay = Math.max(ay, -(perchWay.climb ?? 0.5))) : ax = away * Math.max(away * ax, 0.15);
      let n = Math.hypot(ax, ay) || 1;
      ax /= n, ay /= n;
      let tx = 1e9;
      ax > 0 ? tx = (cssW + 40 - b.x) / ax : ax < 0 && (tx = (-40 - b.x) / ax);
      let ty = (-40 - b.y) / ay, t = Math.max(40, Math.min(tx, ty)), end = [b.x + ax * t, b.y + ay * t], speed = perchWay.flee * (0.85 + 0.3 * r1), swerve = (r2 - 0.5) * (perchWay.swerve ?? 120);
      flyTo(
        b,
        "flee",
        b.x + ax * 50 - ay * swerve * 0.3,
        b.y + ay * 50 + ax * swerve * 0.3,
        -ax * 140 - ay * swerve,
        -ay * 140 + ax * swerve,
        -1,
        end,
        t / speed,
        "in",
        d / 700 + r2 * 0.12
      ), b.at = -1;
    }
    owners.fill(-1);
  }, easeOf = (ease, t) => ease === "in" ? t ** 1.7 : ease === "out" ? 1 - (1 - t) ** 2.4 : t * t * (3 - 2 * t), along = (b, u) => {
    let p = b.path, end = b.to >= 0 ? perchNow(b.to) : [p[6], p[7]], v = 1 - u, [k0, k1, k2, k3] = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u];
    return [
      k0 * p[0] + k1 * p[2] + k2 * (end[0] + p[4]) + k3 * end[0],
      k0 * p[1] + k1 * p[3] + k2 * (end[1] + p[5]) + k3 * end[1]
    ];
  }, turnTo = (from, to, f) => from + (((to - from) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI) * f, perchFlock = (dt, still) => {
    if (!perches.length) {
      for (let b of flock)
        b.show = 0;
      return;
    }
    let seats = still ? perches.filter((_, k) => usable(k)).length : 0;
    (!flockPlaced || owners.length !== perches.length || still && flock.some((b, i) => b.state !== "perched" && i < seats)) && placeFlock(still);
    let way = perchWay;
    for (let b of flock) {
      let { seed } = b, size = mode.flock[b.index].size * fit;
      b.size = size;
      let vx = 0, vy = 0, aloft = 0;
      if (still) {
        if (b.state !== "perched") {
          b.show = 0;
          continue;
        }
      } else if (b.state === "perched") {
        if (clock >= b.wait && !overTree || !usable(b.at))
          if (mode.flock[b.index].flit)
            b.flitUntil = clock + way.flit[0] + (way.flit[1] - way.flit[0]) * hashed(seed * 9.3 + clock), owners[b.at] = -1, b.at = -1, b.state = "flit", b.path = null;
          else {
            let k = freePerch(b, usable(b.at) ? [b.x, b.y] : null, way.reach * fit);
            if (k >= 0) {
              let [x3, y3] = perchNow(k), lift = 14 + Math.hypot(x3 - b.x, y3 - b.y) * 0.4;
              owners[b.at] = -1, owners[k] = b.index, flyTo(
                b,
                "hop",
                b.x,
                b.y - lift,
                0,
                -lift,
                k,
                null,
                0.5 + Math.hypot(x3 - b.x, y3 - b.y) / way.hop,
                "both"
              );
            }
            b.wait = clock + way.stay[0] + (way.stay[1] - way.stay[0]) * hashed(seed * 5.3 + clock);
          }
      } else if (b.state === "away" && !overTree && clock - leftTree > way.back && clock >= nextBack) {
        let k = freePerch(b);
        if (k >= 0) {
          let r1 = hashed(seed * 41.9 + clock * 2.3), r2 = hashed(seed * 17.7 + clock * 5.1), right = perchWay.own ? perchNow(k)[0] > cssW / 2 : crownBox.x > cssW / 2, side = r1 < 0.6 || wordsOver(), edge = right ? cssW + 30 : -30, rise = way.rise ?? 160;
          b.x = side ? edge : nowX(crownBox.x) + (r2 - 0.3) * crownBox.a * 2.4, b.y = side ? nowY(crownBox.y) - crownBox.b - r2 * rise : -30;
          let [x3, y3] = perchNow(k), inward = side ? Math.sign(cssW / 2 - edge) : 0;
          owners[k] = b.index, flyTo(
            b,
            "come",
            b.x + inward * 140,
            b.y + (side ? 30 : 140),
            (r2 - 0.5) * 80,
            (-70 - r1 * 50) * (rise / 160),
            k,
            null,
            Math.hypot(x3 - b.x, y3 - b.y) / way.come,
            "out"
          ), b.at = -1, nextBack = clock + way.every[0] + (way.every[1] - way.every[0]) * r2;
        }
      }
      if (b.state === "flit" && (!b.path || clock >= b.from + b.dur)) {
        let k = clock >= b.flitUntil ? freePerch(b) : -1, hx = b.path ? b.x - b.px : 1, hy = b.path ? b.y - b.py : 0, hn = Math.hypot(hx, hy) || 1;
        if (k >= 0) {
          let [x3, y3] = perchNow(k);
          owners[k] = b.index, flyTo(
            b,
            "hop",
            b.x + hx / hn * 40,
            b.y + hy / hn * 40,
            0,
            -40,
            k,
            null,
            0.6 + Math.hypot(x3 - b.x, y3 - b.y) / way.hop,
            "out"
          );
        } else {
          let a = -Math.PI * (0.05 + 0.9 * hashed(seed * 3.9 + clock * 1.3)), ring = 1.15 + 0.25 * hashed(seed * 8.1 + clock), end = [
            clamp(nowX(crownBox.x) + Math.cos(a) * crownBox.a * ring, glass.bandX + 20, cssW - glass.bandX - 20),
            Math.max(glass.bandY + 20, nowY(crownBox.y) + Math.sin(a) * crownBox.b * ring * 1.3)
          ], turn2 = (hashed(seed * 2.2 + clock * 4.4) - 0.5) * 100;
          flyTo(
            b,
            "flit",
            b.x + hx / hn * 50,
            b.y + hy / hn * 50,
            turn2,
            (hashed(seed + clock) - 0.5) * 80,
            -1,
            end,
            0.9 + 0.6 * hashed(seed * 6.6 + clock),
            "both"
          );
        }
      }
      if (b.state === "perched")
        [b.x, b.y] = perchNow(b.at), way.hover && (aloft = 1, b.x += way.hover.sway * fit * Math.sin(clock * 0.83 + seed * 7.1), b.y += way.hover.bob * fit * Math.sin(clock * 1.9 + seed * 3.3));
      else if (b.state !== "away") {
        let t = clamp((clock - b.from) / b.dur, 0, 1), u = easeOf(b.ease, t), [x, y] = along(b, u), [x2, y2] = along(b, Math.min(1, u + 0.02)), [x0, y0] = along(b, Math.max(0, u - 0.02));
        vx = x2 - x0, vy = y2 - y0;
        let n = Math.hypot(vx, vy) || 1, wob = Math.sin(Math.PI * t) * way.flutter * fit * Math.sin(clock * 9.5 + seed * 20);
        b.px = b.x, b.py = b.y, b.x = x - vy / n * wob, b.y = y + vx / n * wob, aloft = clock >= b.from - 0.08 ? 1 : 0, t >= 1 && (b.state === "flee" ? b.state = "away" : (b.state === "hop" || b.state === "come") && alight(b, b.to));
      }
      let rate = (dt > 0 ? 1 : 0) * aloft;
      b.air = still ? 0 : clamp(b.air + (aloft - b.air) * Math.min(1, dt * (aloft > b.air ? 9 : 2.5)), 0, 1), b.phase += dt * way.beat * (0.85 + seed * 0.3) * Math.max(rate, b.air);
      let turn = b.phase * Math.PI * 2, shut = (0.5 + 0.5 * Math.sin(turn + 0.35 * Math.sin(turn))) ** FLIGHT.snap * (1 - FLIGHT.shallow * (0.5 + 0.5 * Math.sin(b.phase * 1.37 + seed * 23))), beating = FLIGHT.open + (FLIGHT.shut - FLIGHT.open) * shut, cycle = way.rest[0] + (way.rest[1] - way.rest[0]) * hashed(b.index * 7.7 + 1.3), slow = 0.5 - 0.5 * Math.cos((clock + seed * 13) / cycle * Math.PI * 2), opens = 0.3 + 0.7 * hashed(b.index * 5.1 + 0.7), resting = way.wings[0] + (way.wings[1] - way.wings[0]) * smooth(0.3, 0.9, slow) * opens, open = resting + (beating - resting) * b.air;
      b.hindLag = b.hindLag === null || dt === 0 ? open : b.hindLag + (open - b.hindLag) * (1 - Math.exp(-dt / 0.035));
      let velocity = dt > 0 ? (open - b.lastFlap) / dt : 0;
      b.lastFlap = open, b.flap = open, b.hind = b.hindLag - 0.06, b.lag = clamp(-velocity * 0.04, -0.26, 0.26);
      let facing = vx < 0 ? -1 : 1;
      b.at >= 0 && b.state === "perched" && (facing = perches[b.at][2]);
      let tilt = (hashed(b.index * 2.9 + 0.4) - 0.5) * 0.5, sitRoll = way.sit[2] * (0.8 + 0.4 * hashed(b.index * 4.3 + 0.1)) * facing, sat = facing > 0 ? way.sit[0] + tilt : Math.PI - way.sit[0] - tilt, heading = Math.hypot(vx, vy) > 1e-3 ? Math.atan2(-vy, vx) : sat, leftward = Math.cos(heading) < 0 ? -1 : 1;
      b.heading = turnTo(sat, heading, b.air), b.pitch = way.sit[1] + (FLIGHT.away + 0.1 * (seed - 0.5) - way.sit[1]) * b.air, b.roll = sitRoll + ((b.pose + 0.05 * Math.sin(clock * 1.3 + seed * 61)) * leftward - sitRoll) * b.air, way.hover && b.state === "perched" && (b.heading = way.hover.pose[0] + 0.06 * Math.sin(clock * 0.61 + seed * 5.3), b.pitch = way.hover.pose[1] + 0.05 * Math.sin(clock * 0.47 + seed * 2.9), b.roll = way.hover.pose[2] + 0.08 * Math.sin(clock * 1.07 + seed * 9.7)), b.screenX = b.x, b.screenY = b.y - size * way.lift * (1 - b.air);
      let opening = still ? 1 : smooth(way.appear, way.appear + 0.6, intro);
      b.show = b.landed === -1e9 ? opening : 1, b.state === "away" && (b.show = 0);
    }
  }, onPress = (event) => {
    if (PREFERS_REDUCED.matches || !inView)
      return;
    let x = event.pageX - pageLeft, y = event.pageY - pageTop;
    onTree(x, y) && (scatter(x, y), overTree = event.pointerType === "mouse", leftTree = clock);
  }, onLeave = () => {
    overTree && (overTree = !1, leftTree = clock);
  };
  perching && (window.addEventListener("pointerdown", onPress, { passive: !0 }), document.documentElement.addEventListener("pointerleave", onLeave, { passive: !0 }));
  let orbiting = !!mode.orbit && !perching, orbitWay = mode.orbit || {}, rings = orbiting ? mode.flock.map((own) => ({
    ring: own.ring ?? 50 + 46 * hashed(own.seed * 3.1 + 0.4),
    spin: own.spin ?? (0.9 + 0.7 * hashed(own.seed * 5.7 + 0.2)) * (hashed(own.seed * 9.1 + 0.3) < 0.25 ? -1 : 1),
    tilt: own.tilt ?? 0.95 + 0.35 * hashed(own.seed * 2.3 + 0.9),
    lean: own.lean ?? (hashed(own.seed * 7.3 + 0.1) - 0.5) * 0.5,
    trail: own.trail ?? 0.2 + 0.3 * hashed(own.seed * 4.9 + 0.6)
  })) : [];
  if (orbiting)
    for (let b of flock)
      Object.assign(b, {
        state: "away",
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        cx: 0,
        cy: 0,
        cvx: 0,
        cvy: 0,
        theta: 0,
        depth: 0,
        depthFrom: 0,
        handle: 0,
        bank: 0,
        path: null
      });
  let call = { hover: !1, since: 0, left: -1e9, until: -1e9, x: 0, y: 0, on: !1, down: null }, zoneNow = () => {
    let zone = orbitWay.zone || { at: [0.5, 0.8], half: [0.2, 0.12] };
    return typeof zone == "function" ? zone({
      w: cssW,
      h: cssH,
      words: { x: words.x, y: words.y, a: words.a, b: words.b },
      base: landBase,
      room: landRoom
    }) : { x: cssW * zone.at[0], y: cssH * zone.at[1], a: cssW * zone.half[0], b: cssH * zone.half[1] };
  }, inZone = (zone, x, y, grow = 1) => ((x - zone.x) / zone.a) ** 2 + ((y - zone.y) / zone.b) ** 2 <= grow * grow, aim = { x: 0, y: 0, scale: 1 }, aimAt = (zone) => {
    let dx = call.x - zone.x, dy = call.y - zone.y, out = Math.hypot(dx / zone.a, dy / zone.b);
    out > 1 && (dx /= out, dy /= out);
    let x = zone.x + dx, y = zone.y + dy, rx = 1, ry = 1, wing = 0;
    rings.forEach((r, i) => {
      let reach = r.ring * fit, [c, s, k] = [Math.cos(r.lean), Math.sin(r.lean), Math.cos(r.tilt)];
      rx = Math.max(rx, Math.hypot(reach * c, reach * k * s)), ry = Math.max(ry, Math.hypot(reach * s, reach * k * c)), wing = Math.max(wing, mode.flock[i].size * fit * 1.3);
    });
    let foot = cssH - (optics.foot === !1 ? 0 : cssH * 0.1) - wing * 0.6, under = Math.abs(x - words.x) < words.a + rx + wing ? words.y + words.b + 14 : -1e5, top = Math.max(optics.top === !1 ? 0 : glass.bandY, under) + wing, scale = clamp((foot - top) / (2 * ry), 0.35, 1), [low, high] = [top + ry * scale, foot - ry * scale];
    y = low > high ? (low + high) / 2 : clamp(y, low, high);
    let side = glass.bandX + rx * scale + wing;
    x = side > cssW - side ? cssW / 2 : clamp(x, side, cssW - side), aim.x = x, aim.y = y, aim.scale = scale;
  }, onRing = (b) => {
    let r = rings[b.index], reach = r.ring * fit * aim.scale * (1 + 0.1 * Math.sin(clock * (0.5 + b.seed * 0.4) + b.seed * 13)), [c, s] = [Math.cos(b.theta), Math.sin(b.theta)], [cl, sl, k] = [Math.cos(r.lean), Math.sin(r.lean), Math.cos(r.tilt)], way = Math.sign(r.spin) || 1, [px, py] = [reach * c, -reach * s * k], [tx, ty] = [-s * way, -c * k * way], drift = Math.sin(clock * (0.47 + b.seed * 0.3) + b.seed * 17) * 6 * (0.5 + b.seed) * fit;
    return [
      b.cx + px * cl - py * sl,
      b.cy + px * sl + py * cl + drift,
      s * Math.sin(r.tilt),
      tx * cl - ty * sl,
      tx * sl + ty * cl
    ];
  }, orbitTo = (b, state, x1, y1, dur, ease, delay = 0, end = [0, 0, 0, 0]) => {
    b.state = state, b.path = [b.x, b.y, x1, y1, ...end], b.from = clock + delay, b.dur = Math.max(0.2, dur), b.ease = ease;
  }, orbitAlong = (b, u, end, handle) => {
    let p = b.path, v = 1 - u, [k0, k1, k2, k3] = [v * v * v, 3 * v * v * u, 3 * v * u * u, u * u * u];
    return [
      k0 * p[0] + k1 * p[2] + k2 * (end[0] + handle[0]) + k3 * end[0],
      k0 * p[1] + k1 * p[3] + k2 * (end[1] + handle[1]) + k3 * end[1]
    ];
  }, underWords = (size) => words.x > -1e4 ? words.y + words.b + 14 + size * 1.4 : glass.bandY + size, lowest = (size) => cssH * (optics.foot === !1 ? 0.94 : 0.86) - size, sendIn = (dt) => {
    let first = aim.x < cssW / 2 ? -1 : 1, k = 0;
    for (let b of flock) {
      if (b.state === "come" || b.state === "ring")
        continue;
      let r = rings[b.index], size = mode.flock[b.index].size * fit, r1 = hashed(b.seed * 23.1 + clock * 1.9), r2 = hashed(b.seed * 11.7 + clock * 3.7), turning = b.state === "leave" && clock >= b.from, side = (turning ? b.x - aim.x : first * (k % 2 === 0 ? 1 : -1)) < 0 ? -1 : 1, delay = turning ? -dt : k * (orbitWay.every ?? 0.24) + r1 * 0.12, [high, low] = [Math.max(underWords(size), aim.y - 170 * fit), Math.min(lowest(size), aim.y + 110 * fit)];
      turning || (k += 1, b.x = cssW / 2 + side * (glass.reachX + size * 1.6 + 8), b.y = clamp(aim.y + (r2 - 0.5) * 260 * fit, high, Math.max(high, low)), b.vx = 0, b.vy = 0, b.glide = 1), turning || (b.cx = aim.x, b.cy = aim.y, b.cvx = 0, b.cvy = 0);
      let dist = Math.max(40, Math.hypot(aim.x - b.x, aim.y - b.y)), dur = dist / ((orbitWay.come ?? 360) * Math.max(0.7, fit)) + 0.35, way = Math.sign(r.spin) || 1;
      if (b.theta = side * way * (Math.PI / 2) + (r2 - 0.5) * 0.6 - r.spin * (delay + dur), b.handle = dist * 0.3, turning) {
        let v = Math.hypot(b.vx, b.vy) || 1, h2 = clamp(v * dur / 4.5, 10, dist * 0.4);
        orbitTo(b, "come", b.x + b.vx / v * h2, b.y + b.vy / v * h2, dur, "both", delay);
      } else {
        let swoop = clamp(b.y + (r1 - 0.5) * dist * 0.5, high, Math.max(high, low));
        b.heading = Math.atan2(b.y - swoop, -side * dist * 0.35), orbitTo(b, "come", b.x - side * dist * 0.35, swoop, dur, "both", delay);
      }
    }
  }, sendOff = (dt) => {
    for (let b of flock) {
      if (b.state === "away" || b.state === "leave")
        continue;
      if (b.state === "come" && clock < b.from) {
        b.state = "away";
        continue;
      }
      let size = mode.flock[b.index].size * fit, r1 = hashed(b.seed * 31.3 + clock * 2.9), across = b.state === "ring" ? onRing(b)[3] : b.vx / (Math.hypot(b.vx, b.vy) || 1), dir = (Math.abs(across) > 0.35 ? across : b.x - cssW / 2) < 0 ? -1 : 1, ex = cssW / 2 + dir * (glass.reachX + size * 1.6 + 12), ey = clamp(b.y + (0.3 - r1) * 160 * fit, underWords(size), Math.max(underWords(size), lowest(size))), dist = Math.hypot(ex - b.x, ey - b.y), dur = dist / ((orbitWay.leave ?? 400) * Math.max(0.7, fit)) + 0.25, v = Math.hypot(b.vx, b.vy) || 1, h2 = clamp(v * dur / 3, 6, Math.max(6, dist * 0.3));
      b.depthFrom = b.depth, orbitTo(b, "leave", b.x + b.vx / v * h2, b.y + b.vy / v * h2, dur, clamp(v * dur / (3 * h2), 0.05, 1), -dt, [
        ex,
        ey,
        -dir * dist * 0.3,
        6
      ]);
    }
  }, orbitFlock = (dt, still) => {
    if (still) {
      for (let b of flock)
        b.state = "away", b.show = 0;
      call.on = !1;
      return;
    }
    aimAt(zoneNow());
    let wanted2 = clock < call.until || (call.hover ? call.on || clock - call.since >= (orbitWay.call ?? 0.25) : call.on && clock - call.left < (orbitWay.linger ?? 0.8));
    wanted2 !== call.on && (call.on = wanted2, wanted2 ? sendIn(dt) : sendOff(dt));
    for (let b of flock) {
      let { seed } = b, r = rings[b.index], base = mode.flock[b.index].size * fit;
      if (b.state === "away") {
        b.show = 0, b.size = base;
        continue;
      }
      let pull = 2.15 / r.trail;
      b.cvx += (pull * pull * (aim.x - b.cx) - 2 * pull * b.cvx) * dt, b.cvy += (pull * pull * (aim.y - b.cy) - 2 * pull * b.cvy) * dt, b.cx += b.cvx * dt, b.cy += b.cvy * dt, b.theta += dt * r.spin * (1 + 0.12 * Math.sin(clock * 0.37 + seed * 29));
      let ring = onRing(b), [x, y, depth] = ring;
      if (b.state !== "ring") {
        let t = clamp((clock - b.from) / b.dur, 0, 1);
        if (b.state === "come") {
          let u = easeOf(b.ease, t), round = Math.hypot(ring[3], ring[4]) || 1;
          [x, y] = orbitAlong(b, u, ring, [-ring[3] / round * b.handle, -ring[4] / round * b.handle]), depth *= u, t >= 1 && (b.state = "ring");
        } else {
          let u = b.ease * t + (1 - b.ease) * t * t, p = b.path;
          [x, y] = orbitAlong(b, u, [p[4], p[5]], [p[6], p[7]]), depth = b.depthFrom * (1 - u), t >= 1 && (b.state = "away");
        }
      }
      dt > 0 && (b.vx = (x - b.x) / dt, b.vy = (y - b.y) / dt), b.x = x, b.y = y, b.depth = depth;
      let wob = 0;
      if (b.state === "come" || b.state === "leave") {
        let t = clamp((clock - b.from) / b.dur, 0, 1);
        wob = Math.sin(Math.PI * t) * (orbitWay.flutter ?? 6) * fit * Math.sin(clock * 9.5 + seed * 20);
      }
      let pace = Math.hypot(b.vx, b.vy) || 1, beat = b.state === "ring" && 0.5 + 0.5 * Math.sin(clock * (FLIGHT.bursts[0] + seed * FLIGHT.bursts[1]) + seed * 91) < 0.2 ? 0 : 1;
      b.glide += (beat - b.glide) * Math.min(1, dt * 3.2), b.phase += dt * 3.4 * (0.85 + seed * 0.3) * (0.3 + 0.7 * b.glide) * (b.state === "ring" ? 1 : 1.2);
      let turn = b.phase * Math.PI * 2, shut = (0.5 + 0.5 * Math.sin(turn + 0.35 * Math.sin(turn))) ** FLIGHT.snap * (1 - FLIGHT.shallow * (0.5 + 0.5 * Math.sin(b.phase * 1.37 + seed * 23))), open = FLIGHT.soar + (FLIGHT.open + (FLIGHT.shut - FLIGHT.open) * shut - FLIGHT.soar) * b.glide;
      b.hindLag = b.hindLag === null || dt === 0 ? open : b.hindLag + (open - b.hindLag) * (1 - Math.exp(-dt / 0.035));
      let flapping = dt > 0 ? (open - b.lastFlap) / dt : 0;
      if (b.lastFlap = open, b.flap = open, b.hind = b.hindLag - 0.06, b.lag = clamp(-flapping * 0.04, -0.26, 0.26), dt > 0 && Math.hypot(b.vx, b.vy) > 1) {
        let before = b.heading;
        b.heading = turnTo(b.heading, Math.atan2(-b.vy, b.vx), 1 - Math.exp(-dt / 0.07));
        let rate = turnTo(0, b.heading - before, 1) / dt;
        b.bank += (clamp(rate * 0.1, -0.4, 0.4) - b.bank) * Math.min(1, dt * 6);
      }
      b.pitch = FLIGHT.away + 0.1 * (seed - 0.5) + 0.05 * Math.sin(clock * (0.27 + seed * 0.2) + seed * 47), b.roll = (b.pose + 0.05 * Math.sin(clock * (0.33 + seed * 0.2) + seed * 61)) * clamp(Math.cos(b.heading) * 2.5, -1, 1) + b.bank;
      let size = base * (1 - 0.14 * depth);
      b.size = size;
      let bob = Math.cos(turn) * FLIGHT.hop * b.glide * size, ripple = Math.cos(turn) * FLIGHT.surge * size * b.glide, sx = x - b.vy / pace * wob + Math.cos(b.heading) * ripple, sy = y + b.vx / pace * wob + bob - Math.sin(b.heading) * ripple, q = clamp((Math.abs(sx - words.x) - words.a - size * 0.9) / 140, 0, 1);
      sy += Math.max(0, words.y + words.b + 14 + size * 1.4 - sy) * (1 - q * q * (3 - 2 * q)), b.screenX = sx, b.screenY = sy, b.show = b.state === "come" && clock < b.from ? 0 : 1;
    }
  }, orbitPlace = (event) => [event.pageX - pageLeft, event.pageY - pageTop], onOrbitMove = (event) => {
    if (PREFERS_REDUCED.matches || !inView || event.pointerType === "touch")
      return;
    let [x, y] = orbitPlace(event);
    inZone(zoneNow(), x, y, call.hover ? 1.25 : 1) ? (call.hover || (call.hover = !0, call.since = clock, call.until = -1e9), call.x = x, call.y = y) : call.hover && (call.hover = !1, call.left = clock);
  }, onOrbitLeave = () => {
    call.hover && (call.hover = !1, call.left = clock);
  }, onOrbitDown = (event) => {
    call.down = event.pointerType === "mouse" ? null : { id: event.pointerId, x: event.clientX, y: event.clientY, at: performance.now() };
  }, onOrbitUp = (event) => {
    let { down } = call;
    if (call.down = null, !down || down.id !== event.pointerId || PREFERS_REDUCED.matches || !inView || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 12 || performance.now() - down.at > 600)
      return;
    let [x, y] = orbitPlace(event);
    inZone(zoneNow(), x, y) ? (call.x = x, call.y = y, call.until = clock + (orbitWay.stay ?? 7)) : call.on && x >= 0 && y >= 0 && x <= cssW && y <= cssH && (call.until = -1e9, call.left = -1e9);
  }, onOrbitCancel = () => {
    call.down = null;
  };
  orbiting && (window.addEventListener("pointermove", onOrbitMove, { passive: !0 }), window.addEventListener("pointerdown", onOrbitDown, { passive: !0 }), window.addEventListener("pointerup", onOrbitUp, { passive: !0 }), window.addEventListener("pointercancel", onOrbitCancel, { passive: !0 }), document.documentElement.addEventListener("pointerleave", onOrbitLeave, { passive: !0 }));
  let glassAt = (across) => {
    let half = cssW / 2, times = (seen2) => {
      let inner = glass.inner, v = inner + (seen2 - (half - glass.bandX)) / glass.bandX * (1 - inner), t = clamp((v - inner) / (1 - inner), 0, 1);
      return t > 0 ? v / (inner + (1 - inner) * (1 - Math.exp(-optics.bend * t)) / optics.bend) : 1;
    }, near2 = across, far = Math.max(across, half);
    for (let i = 0; i < 20; i += 1) {
      let mid = (near2 + far) / 2;
      mid / times(mid) < across ? near2 = mid : far = mid;
    }
    return times(far);
  }, advance = (dt) => {
    let still = isStill();
    clock += dt, intro += dt;
    for (let stir of stirs)
      stir.age += dt;
    for (; stirs.length && stirs[0].age > mode.stir.life; )
      stirs.shift();
    if (placePasser(), passer.on && !still) {
      let moved = Math.hypot(passer.x - passer.laidX, passer.y - passer.laidY);
      if (moved > mode.stir.every / 2) {
        let way = moved || 1, fresh = moved > 60;
        lay(
          passer.x,
          passer.y,
          mode.passer.push,
          fresh ? 1 : (passer.x - passer.laidX) / way,
          fresh ? 0 : (passer.y - passer.laidY) / way
        ), passer.laidX = passer.x, passer.laidY = passer.y;
      }
    }
    if (stirData.fill(0), stirWay.fill(0), stirs.forEach((stir, i) => {
      stirData.set([stir.x, stir.y, stir.age, stir.push], i * 4), stirWay.set([stir.wayX, stir.wayY], i * 2);
    }), perching) {
      perchFlock(dt, still);
      return;
    }
    if (orbiting) {
      orbitFlock(dt, still);
      return;
    }
    for (let b of flock) {
      let { seed } = b, { crossing } = mode, size = mode.flock[b.index].size * fit * (crossing && still ? crossing.restSize : 1);
      b.size = size;
      let exit = glass.reachX + size * 1.6, way = exit * 2, speed = crossing ? way / crossing.across : b.speed * Math.max(0.7, fit) * (1 + FLIGHT.glide * (1 - b.glide));
      if (crossing) {
        let into = still ? crossing.rest[b.index] * crossing.across : ((clock - crossingStart - crossing.after[b.index]) % crossing.every + crossing.every) % crossing.every;
        b.u = Math.min(1, into / crossing.across);
      } else
        still || (b.u += dt * speed / way), b.u >= 1 && (b.u -= 1);
      let eased = 1 - (1 - (still ? 1 : Math.min(1, intro / (3.2 + seed * 0.9)))) ** 3, x = -exit + b.u * way * eased;
      x += Math.sin(clock * (0.31 + seed * 0.2) + seed * 40) * 14 * (0.5 + seed);
      let wantsGlide = 0.5 + 0.5 * Math.sin(clock * (FLIGHT.bursts[0] + seed * FLIGHT.bursts[1]) + seed * 91) < 0.2 ? 0 : 1;
      b.glide += (wantsGlide - b.glide) * Math.min(1, dt * 3.2);
      let rate = 3.4 * (0.85 + seed * 0.3) * (0.3 + 0.7 * b.glide);
      b.phase += dt * rate;
      let turn = b.phase * Math.PI * 2, shut = (0.5 + 0.5 * Math.sin(turn + 0.35 * Math.sin(turn))) ** FLIGHT.snap * (1 - FLIGHT.shallow * (0.5 + 0.5 * Math.sin(b.phase * 1.37 + seed * 23))), open = still ? 0.42 + seed * 0.6 : FLIGHT.soar + (FLIGHT.open + (FLIGHT.shut - FLIGHT.open) * shut - FLIGHT.soar) * b.glide;
      b.hindLag = b.hindLag === null ? open : b.hindLag + (open - b.hindLag) * (1 - Math.exp(-dt / 0.035));
      let velocity = dt > 0 ? (open - b.lastFlap) / dt : 0;
      b.lastFlap = open, b.flap = open, b.hind = b.hindLag - 0.06, b.lag = clamp(-velocity * 0.04, -0.26, 0.26);
      let bob = (still ? 0 : Math.cos(turn) * FLIGHT.hop * b.glide) * size, climbing = (FLIGHT.sink * (1 - b.glide) - FLIGHT.rise * b.glide) * (size / 64) - b.lift * FLIGHT.settle;
      b.lift += climbing * dt;
      let y = laneY(b.lane, x) + b.lift + bob + Math.sin(clock * (0.47 + seed * 0.3) + seed * 17) * 7 * (0.5 + seed);
      crossing && still && (y = crossing.restY[b.index] * size);
      let ripple = still ? 0 : Math.cos(turn) * FLIGHT.surge * size * b.glide;
      b.screenX = cssW / 2 + x + ripple;
      let q = clamp((Math.abs(x + cssW / 2 - words.x) - words.a - size * 0.9) / 140, 0, 1);
      if (b.screenY = y + Math.max(0, words.y + words.b + 14 + size * 1.4 - y) * (1 - q * q * (3 - 2 * q)), crossing && !still) {
        let dx = b.screenX + b.swerveX - schoolPointer.x, dy = b.screenY + b.swerveY - schoolPointer.y, distance = Math.hypot(dx, dy), strength = clock - schoolPointer.at < 1.2 && distance > 1e-3 && distance < 120 ? (1 - distance / 120) ** 2 * 340 * dt / distance : 0, keep = Math.exp(-1.4 * dt);
        b.swerveX = b.swerveX * keep + dx * strength, b.swerveY = b.swerveY * keep + dy * strength, b.screenX += b.swerveX, b.screenY += b.swerveY;
      } else crossing && (b.swerveX = b.swerveY = 0);
      if (crossing && !still) {
        let outer = Math.abs(b.screenX - cssW / 2) + size * crossing.room, edge = cssH / 2 - cssH / 2 / glassAt(outer) + size * crossing.room, ease = size * 0.3;
        b.screenY < edge + ease ? b.screenY = edge + ease * Math.exp((b.screenY - edge - ease) / ease) : b.screenY > cssH - edge - ease && (b.screenY = cssH - edge - ease * Math.exp((cssH - edge - ease - b.screenY) / ease));
      }
      let swing = Math.sin(clock * (0.41 + seed * 0.27) + seed * 29), slope = (laneY(b.lane, x + 16) - laneY(b.lane, x - 16)) / 32 + climbing / speed;
      b.heading = clamp(
        FLIGHT.slant - Math.atan(slope) * 0.3 + FLIGHT.spread * (seed - 0.5) * 2 + swing * 0.07,
        FLIGHT.slant - FLIGHT.leans[0],
        FLIGHT.slant + FLIGHT.leans[1]
      ) + (still ? 0 : 0.05 * b.glide * (1 - 2 * shut)), b.pitch = FLIGHT.away + 0.1 * (seed - 0.5) + 0.05 * Math.sin(clock * (0.27 + seed * 0.2) + seed * 47), b.roll = b.pose + 0.05 * Math.sin(clock * (0.33 + seed * 0.2) + seed * 61) - 0.02 * swing, b.show = Math.abs(x) > exit - 2 || crossing && b.u >= 1 ? 0 : 1;
    }
  }, ready = !1, skyInks = new Float32Array(24), skyAt = new Float32Array(8), paintSky = () => {
    let stops = mode.sky.stops.slice(0, 8);
    stops.forEach(([at, name], i) => {
      skyInks.set(rgb(mode.inks[name][dark ? 1 : 0]), i * 3), skyAt[i] = at;
    }), gl.disable(gl.BLEND), gl.useProgram(sky.program);
    let u = sky.uniforms;
    gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, grainTex), gl.uniform1i(u.uGrain, 0), gl.uniform2f(u.uCanvas, cssW, cssH), gl.uniform1f(u.uPixels, w / cssW), gl.uniform1f(u.uTile, GRAIN_TILE * (w / cssW)), gl.uniform3fv(u.uSky, skyInks), gl.uniform1fv(u.uSkyAt, skyAt), gl.uniform1i(u.uSkyCount, stops.length), gl.uniform1f(u.uBrush, mode.sky.brush ?? 0), gl.uniform1f(u.uGrainStrength, mode.sky.grain ?? 0.4), gl.bindVertexArray(emptyVao), gl.drawArrays(gl.TRIANGLES, 0, 3);
  }, { lines } = mode, lineUniforms = (u) => {
    gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, grainTex), gl.uniform1i(u.uGrain, 0), gl.activeTexture(gl.TEXTURE2), gl.bindTexture(gl.TEXTURE_2D, paintTex), gl.uniform1i(u.uPaint, 2), gl.uniform2f(u.uCanvas, cssW, cssH), gl.uniform1f(u.uPixels, w / cssW), gl.uniform1f(u.uTile, GRAIN_TILE * (w / cssW)), gl.uniform1f(u.uPitch, lines.pitch), gl.uniform1f(u.uClosest, lines.closest), gl.uniform1f(u.uKeep, lines.keep), gl.uniform1f(u.uClock, clock), gl.uniform2f(u.uBrick, lines.brick[0], lines.brick[1]), gl.uniform1f(u.uGap, lines.gap), gl.uniform1f(u.uBeadCell, lines.beadCell), gl.uniform1f(u.uBeadChance, lines.beadChance), gl.uniform1f(u.uBeadSize, lines.beadSize), gl.uniform1f(u.uBeadFlow, lines.beadFlow), gl.uniform1f(u.uGrainStrength, lines.grain), gl.uniform4f(u.uWords, words.x, words.y, words.a + lines.veil[0], words.b + lines.veil[1]), gl.uniform1f(u.uWordsCore, lines.veilCore), gl.uniform1f(u.uSink, lines.sink), gl.uniform1f(u.uHead, isStill() ? 1 : Math.min(1, intro * 1e3 / lines.introMs)), gl.uniform1f(u.uDark, dark ? 1 : 0), gl.uniform3f(u.uPage, wash[0], wash[1], wash[2]), gl.uniform3fv(u.uSheenInk, rgb(mode.inks.sheen[dark ? 1 : 0])), gl.uniform4fv(u.uStirs, stirData), gl.uniform2fv(u.uStirWay, stirWay), gl.uniform1f(u.uReach, mode.stir.reach * Math.max(0.8, fit)), gl.uniform1f(u.uIntro, isStill() ? 99 : intro), mode.push && u.uPush && gl.uniform2f(u.uPush, pushNow(), cssW * mode.push.at), mode.talk && u.uTalk && gl.uniform2f(u.uTalk, ...talkNow()), mode.school && u.uFish && (gl.uniform4fv(u.uFish, schoolNow()), gl.uniform2f(u.uSchool, grownFor.w / 2, grownFor.h / 2));
  }, SCHOOL_TURN = 0.7, SCHOOL_TURNING = 4, schoolData = mode.school ? new Float32Array(mode.school.fish.length * 8) : null, schoolState = mode.school ? {
    clock: -1,
    w: 0,
    h: 0,
    words: 0,
    away: mode.school.fish.map(() => [0, 0, 0, 0]),
    round: mode.school.fish.map(() => 0),
    shown: mode.school.fish.map(() => !0)
  } : null, schoolPointer = { x: -1e5, y: -1e5, at: -1e9 }, schoolLargest = mode.school ? Math.max(...mode.school.fish.map((f) => f.size)) : 0, schoolNow = () => {
    let wordsFoot = words.y + words.b, still = isStill();
    if (schoolState.clock === clock && schoolState.w === cssW && schoolState.h === cssH && schoolState.words === wordsFoot && schoolState.still === still)
      return schoolData;
    let fresh = still || schoolState.clock < 0 || clock < schoolState.clock, step = fresh ? 0 : clock - schoolState.clock, dt = Math.min(step, 0.1), placed = fresh || step > 0.1;
    schoolState.clock = clock, schoolState.w = cssW, schoolState.h = cssH, schoolState.words = wordsFoot, schoolState.still = still;
    let { fish, band, size, turn: most = SCHOOL_TURN, reach = [0.7, 0.7], glow = reach, scatter: scatter2 = {} } = mode.school, [rear, fore] = reach, [rearGlow, foreGlow] = glow, { radius = 120, push = 320, back = 1.4 } = scatter2, [top, foot, fall] = band({ w: cssW, h: cssH, words }), scale = size ? size(cssW) : 1, margin = schoolLargest * scale * 2.5, span = cssW + margin * 2, half = cssW / 2, { unseen } = glass, near2 = !still && clock - schoolPointer.at < 1.2;
    return fish.forEach((f, i) => {
      let o = i * 8, len = f.size * scale, away = schoolState.away[i];
      still && away.fill(0);
      let speed = f.speed * scale, round = fresh ? f.phase + clock * speed / span : schoolState.round[i] + step * speed / span;
      schoolState.round[i] = round - Math.floor(round);
      let surge = (f.surge || 0) * scale, sweep = f.surgePeriod ? Math.PI * 2 / f.surgePeriod : 0, surged = surge * Math.sin(sweep * clock + f.seed * 3.7), x0 = ((schoolState.round[i] * span + surged) % span + span) % span - margin, wanted2 = !(f.from && cssW < f.from), x = x0 + away[0];
      if ((fresh || x + foreGlow * len < unseen || x - rearGlow * len > cssW - unseen) && (schoolState.shown[i] = wanted2), still && (x0 + fore * len > cssW - glass.bandX || x0 - rear * len < glass.bandX) && (schoolState.shown[i] = !1), !schoolState.shown[i]) {
        schoolData.fill(0, o, o + 8), schoolData[o] = -1e5, schoolData[o + 1] = -1e5, away.fill(0);
        return;
      }
      let lane = top + f.lane * (foot - top) + fall * (x0 - half) / Math.max(1, cssW), turn = Math.PI * 2 / f.period, rise = f.drift * scale, y0 = lane + rise * Math.sin(turn * clock + f.seed * 6.283), climb = rise * turn * Math.cos(turn * clock + f.seed * 6.283) + fall * speed / Math.max(1, cssW);
      if (dt > 0) {
        let dx = x0 + away[0] - schoolPointer.x, dy = y0 + away[1] - schoolPointer.y, d = Math.hypot(dx, dy), vx = 0, vy = 0;
        if (near2 && d < radius && d > 1e-3) {
          let k = (1 - d / radius) ** 2 * push;
          vx = dx / d * k, vy = dy / d * k;
        }
        let keep = Math.exp(-dt * back), ax = clamp(away[0] * keep + vx * dt, rear * len - margin - unseen, margin + unseen - fore * len), ceiling = top - 0.2 * schoolLargest * scale + f.lane * 0.5 * (foot - top), ay = Math.max(away[1] * keep + vy * dt, Math.min(0, ceiling - y0));
        away[2] = (ax - away[0]) / dt, away[3] = (ay - away[1]) / dt, away[0] = ax, away[1] = ay;
      }
      schoolData[o] = x0 + away[0], schoolData[o + 1] = y0 + away[1];
      let ahead = Math.max(speed * 0.3, speed + surge * sweep * Math.cos(sweep * clock + f.seed * 3.7)), heading = clamp(
        Math.atan2(climb + away[3] * 0.35, Math.max(ahead * 0.4, ahead + away[2] * 0.35)),
        -most,
        most
      ), was = schoolData[o + 2];
      schoolData[o + 2] = placed ? heading : was + clamp(heading - was, -SCHOOL_TURNING * dt, SCHOOL_TURNING * dt), schoolData[o + 3] = clock * Math.PI * 2 * f.beat + f.seed * 4.1, schoolData[o + 4] = len, schoolData[o + 5] = len * (f.wag ?? 0.06);
      let beating = f.glide ? 0.5 + 0.5 * Math.tanh(3 * Math.sin(clock * Math.PI * 2 / f.glide + f.seed * 5.3)) : 1;
      schoolData[o + 6] = (f.flap || 0) * beating, schoolData[o + 7] = 0;
    }), schoolData;
  }, talkScript = (() => {
    if (!mode.talk)
      return null;
    let { phrases = 7, seed = 0 } = mode.talk, syllables = [], at = 0.5, n = 0;
    for (let phrase = 0; phrase < phrases; phrase += 1) {
      let count = 4 + Math.floor(hashed(seed + phrase * 7.13 + 0.5) * 7), said = [];
      for (let k = 0; k < count; k += 1, n += 1) {
        let held = hashed(seed + n * 3.71 + 0.2) < 0.2, long = held ? 0.42 + 0.22 * hashed(seed + n * 5.3 + 0.1) : 0.17 + 0.2 * hashed(seed + n * 9.1 + 0.7), wide = held ? 0.8 + 0.2 * hashed(seed + n * 2.9 + 0.4) : 0.35 + 0.55 * hashed(seed + n * 4.7 + 0.9);
        said.push([at, long, wide, n]), at += long;
      }
      let ends = said.map(([, , wide, m], k) => {
        let next = said[k + 1];
        return next ? hashed(seed + m * 6.1 + 0.8) < 0.25 ? 0 : (0.2 + 0.35 * hashed(seed + m * 8.3 + 0.6)) * Math.min(wide, next[2]) : 0;
      });
      said.forEach(([from, long, wide], k) => syllables.push([from, long, wide, k ? ends[k - 1] : 0, ends[k]])), at += 0.5 + 0.7 * hashed(seed + phrase * 11.7 + 0.3);
    }
    return { syllables, cycle: at };
  })(), talkAt = (time) => {
    let c = (time % talkScript.cycle + talkScript.cycle) % talkScript.cycle;
    for (let [at, long, wide, from, to] of talkScript.syllables) {
      if (c < at)
        return 0;
      if (c >= at + long)
        continue;
      let p = (c - at) / long;
      return p < 0.3 ? from + (wide - from) * smooth(0, 0.3, p) : p < 0.65 ? wide : wide + (to - wide) * smooth(0.65, 1, p);
    }
    return 0;
  }, talkNow = () => !talkScript || isStill() ? [0, 0] : [talkAt(clock), (mode.talk.nod || 0) * talkAt(clock - 0.07) ** 1.5], pushNow = () => {
    let lit = root.hlPushAt;
    if (!mode.push || !lit || isStill())
      return 0;
    let t = (performance.now() - lit) / 1e3;
    return mode.push.amount * smooth(0, 0.22, t) * (1 - smooth(0.45, 2.4, t));
  }, sheetGlow = (u, sheet, row) => {
    let [amount, period] = mode.glow?.breathe || [0, 1], swell = 1 + amount * Math.sin(clock * Math.PI * 2 / period), [cx, cy, hx, hy] = glowPlaces[row] || [0, 0, 1, 1];
    gl.uniform4f(u.uGlow, cx, cy, hx * swell, hy * swell), gl.uniform1f(u.uGlowRow, glowRow[row] >= 0 ? (glowRow[row] + 0.5) / paintRows : -1), gl.uniform1f(u.uGlowTake, sheet.glowTake ?? 1), gl.uniform1f(u.uShimmer, sheet.shimmer ?? 0);
    let wave = sheet.wave || [0, 1, 0, 0];
    gl.uniform4f(u.uWave, wave[0], wave[1], wave[2], wave[3]);
    let beads = Array.isArray(sheet.beads) ? sheet.beads[dark ? 1 : 0] : sheet.beads ?? 1;
    gl.uniform1f(u.uBeadChance, lines.beadChance * beads);
  }, theme = (pair) => Array.isArray(pair) ? pair[dark ? 1 : 0] : pair, sunUniforms = (u) => {
    let { sun, fade } = mode;
    if (sun) {
      let [amount, period] = sun.breathe || [0, 1], swell = 1 + amount * Math.sin(clock * Math.PI * 2 / period);
      gl.uniform4f(u.uSun, sunPlace.x, sunPlace.y, Math.max(1, sunPlace.r), sun.face), gl.uniform4f(u.uSunShape, sun.halo, sun.rim, theme(sun.lines[0]), theme(sun.lines[1])), gl.uniform2f(u.uSunRise, sunRise[0], sunRise[1]), gl.uniform3fv(
        u.uSunInks,
        sun.inks.flatMap((name) => rgb(mode.inks[name][dark ? 1 : 0]))
      ), gl.uniform3f(u.uSunLight, theme(sun.light[0]), theme(sun.light[1]) * swell, theme(sun.light[2]) * swell);
    }
    fade && gl.uniform3f(u.uFadeLook, fade.pale ?? 0, fade.sparse ?? 0, fade.specks ?? 0);
  }, sheetSun = (u, sheet) => {
    let take = sheet.sun || [0, 0];
    gl.uniform2f(u.uSunTake, take[0], take[1]), gl.uniform4f(u.uFade, fadeAt[0], Math.max(fadeAt[1], fadeAt[0] + 1), mode.fade?.ease ?? 1, sheet.fade ? 1 : 0);
  }, drawSheets = (rows) => {
    let u = land.uniforms;
    (mode.sun || mode.fade) && sunUniforms(u), rows.forEach((row) => {
      let sheet = sheets[row], range = landRanges[row];
      range && (gl.uniform1f(u.uRow, (paintRow[row] + 0.5) / paintRows), gl.uniform1f(u.uPatch, sheet.patch ?? 0), gl.uniform1f(u.uOpaque, sheet.opaque ? 1 : 0), gl.uniform1f(u.uLaid, sheet.laid ? 1 : 0), gl.uniform1f(u.uUnder, sheet.under), gl.uniform1f(u.uFill, sheet.fill), gl.uniform1f(u.uSpecks, 0.2), gl.uniform1f(u.uFlow, lines.flow * (sheet.flow ?? 1)), gl.uniform1f(u.uBreath, sheet.breath ?? 0), gl.uniform1f(u.uSheen, sheet.sheen ?? 0), gl.uniform1f(u.uLean, sheet.lean ?? 0), (mode.glow || mode.waves) && sheetGlow(u, sheet, row), (mode.sun || mode.fade) && sheetSun(u, sheet), gl.drawElements(gl.TRIANGLES, range.count, gl.UNSIGNED_INT, range.offset));
    });
  }, cutFront = () => {
    if (!cut || !hidden)
      return;
    let sx = w / cssW, sy = h / cssH, box = [hidden.left * sx, hidden.top * sy, hidden.right * sx, hidden.bottom * sy], x0 = clamp(Math.floor(box[0]) - 1, 0, w), x1 = clamp(Math.ceil(box[2]) + 1, 0, w), y0 = clamp(Math.floor(box[1]) - 1, 0, h), y1 = clamp(Math.ceil(box[3]) + 1, 0, h);
    if (x1 <= x0 || y1 <= y0)
      return;
    gl.enable(gl.SCISSOR_TEST), gl.scissor(x0, h - y1, x1 - x0, y1 - y0), gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_ALPHA), gl.useProgram(cut.program);
    let most = Math.min(box[2] - box[0], box[3] - box[1]) / 2, [tl, tr, br, bl] = (hidden.radii || [0, 0, 0, 0]).map((r) => Math.min(r * sx, most));
    gl.uniform4f(cut.uniforms.uBox, box[0], box[1], box[2], box[3]), gl.uniform4f(cut.uniforms.uRadii, tl, tr, br, bl), gl.uniform1f(cut.uniforms.uHeight, h), gl.bindVertexArray(emptyVao), gl.drawArrays(gl.TRIANGLES, 0, 3), gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA), land && (gl.useProgram(land.program), gl.bindVertexArray(landVao), drawSheets(frontRows.filter((row) => (sheetHigh[row] ?? Number.POSITIVE_INFINITY) < hidden.bottom + 8))), gl.disable(gl.SCISSOR_TEST);
  }, draw = () => {
    if (!ready || !w)
      return;
    dirty = !1, dark !== painted && (painted = dark, paintLand(dark)), gl.bindFramebuffer(gl.FRAMEBUFFER, landFbo), gl.viewport(0, 0, w, h), sky ? paintSky() : (gl.clearColor(page[0], page[1], page[2], 1), gl.clear(gl.COLOR_BUFFER_BIT)), gl.enable(gl.BLEND), gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    let u = null;
    if (land && (gl.useProgram(land.program), gl.bindVertexArray(landVao), u = land.uniforms, lineUniforms(u), drawSheets(landOrder)), gl.activeTexture(gl.TEXTURE4), gl.bindTexture(gl.TEXTURE_2D, landTex), gl.generateMipmap(gl.TEXTURE_2D), gl.bindFramebuffer(gl.FRAMEBUFFER, mode.lensed ? sceneFbo : null), gl.viewport(0, 0, w, h), gl.disable(gl.BLEND), gl.useProgram(copy.program), gl.uniform1i(copy.uniforms.uLand, 4), gl.bindVertexArray(emptyVao), gl.drawArrays(gl.TRIANGLES, 0, 3), gl.enable(gl.BLEND), clouds) {
      gl.useProgram(clouds.program), u = clouds.uniforms, gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, grainTex), gl.uniform1i(u.uGrain, 0), gl.uniform1i(u.uLand, 4), gl.uniform2f(u.uCanvas, cssW, cssH), gl.uniform1f(u.uPixels, w / cssW), gl.uniform1f(u.uTile, GRAIN_TILE * (w / cssW)), gl.uniform1f(u.uBlur, Math.log2(4 * (w / cssW))), gl.uniform1f(u.uDark, dark ? 1 : 0), gl.uniform3fv(u.uFrost, dark ? [0.86, 0.9, 0.98] : [1, 1, 1]), gl.uniform3fv(u.uShade, dark ? [0.62, 0.7, 0.86] : [0.7, 0.78, 0.92]), gl.uniform4f(u.uWords, words.x, words.y, words.a + lines.veil[0], words.b + lines.veil[1]), gl.uniform1f(u.uWordsCore, lines.veilCore), gl.bindVertexArray(cloudVao);
      let reveal = isStill() ? 1 : smooth(1.4, 2.6, intro);
      reveal > 0 && mode.clouds.forEach((cloud, index) => {
        let [across, along2] = cloud.at, sky2 = skyTop(across), hill = hillTop(across), size = Math.min(cloud.size * fit, (hill - sky2) * landRoom / 1.7) * (0.85 + 0.15 * reveal), drift = isStill() ? 0 : Math.sin(clock * 0.05 + index * 2.1) * 24, [cx, placed] = toScreen(across, sky2 + (hill - sky2) * along2), rise = Math.max(...cloud.puffs.map(([, py, pr]) => pr - py)) * size, foot = Math.max(...cloud.puffs.map(([, py, pr]) => py + pr * 0.35)) * size, highest = landBase + sky2 * landRoom + mode.cloudTuck + rise, lowest2 = landBase + hill * landRoom - foot, cy = Math.min(Math.max(placed, highest), lowest2), puffs = new Float32Array(32), [x0, y0, x1, y1] = [
          Number.POSITIVE_INFINITY,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
          Number.NEGATIVE_INFINITY
        ];
        cloud.puffs.forEach(([px2, py, pr], i) => {
          let x = cx + drift + px2 * size, y = cy + py * size, r = pr * size;
          puffs.set([x, y, r, 0], i * 4), x0 = Math.min(x0, x - r), x1 = Math.max(x1, x + r), y0 = Math.min(y0, y - r), y1 = Math.max(y1, y + r);
        }), gl.uniform4f(u.uBox, x0 - 3, y0 - 3, x1 + 3, y1 + 3), gl.uniform4fv(u.uPuffs, puffs), gl.uniform1i(u.uCount, cloud.puffs.length), gl.uniform1f(u.uSize, size), gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    }
    gl.useProgram(blades.program), lineUniforms(blades.uniforms), gl.uniform3fv(
      blades.uniforms.uInks,
      mode.grass.inks.flatMap((name) => rgb(mode.inks[name][dark ? 1 : 0]))
    ), gl.uniform1f(blades.uniforms.uGrainStrength, 0.6), gl.useProgram(blooms.program), lineUniforms(blooms.uniforms), gl.uniform3fv(blooms.uniforms.uPaints, paints[dark ? 1 : 0]), gl.uniform1i(blooms.uniforms.uLand, 4), mode.marks && gl.uniform2f(blooms.uniforms.uMist, mistBand[0], mistBand[1]);
    for (let band = 0; band < BANDS; band += 1) {
      band === cutBand && cutFront(), gl.useProgram(blades.program), drawRun(bladeVao, bands[band * 4], bands[band * 4 + 1]), gl.useProgram(blooms.program);
      let first = bands[band * 4 + 2];
      drawRun(bloomVao, first, Math.min(bands[band * 4 + 3], schoolFrom - first));
    }
    if (!eager && !announced && (announced = !0, root.dataset.hlReady = "true", root.dataset.hlShown = "true"), !mode.lensed)
      return;
    (orbiting ? [...flock].sort((p, q) => q.depth - p.depth) : flock).forEach((b, i) => {
      let ch = Math.cos(b.heading), sh = Math.sin(b.heading), cp = Math.cos(b.pitch), sp = Math.sin(b.pitch), fx = ch * cp, fy = sh * cp, fz = sp, len = Math.hypot(fx, fy) || 1, s0x = -fy / len, s0y = fx / len, u0x = -fz * s0y, u0y = fz * s0x, u0z = fx * s0y - fy * s0x, cr = Math.cos(b.roll), sr = Math.sin(b.roll), o = i * FLOATS;
      flyData.fill(0, o, o + FLOATS), flyData.set(
        [
          b.screenX,
          b.screenY,
          3.4,
          b.size,
          fx,
          fy,
          fz,
          s0x * cr - u0x * sr,
          s0y * cr - u0y * sr,
          -u0z * sr,
          b.flap,
          b.hind,
          b.lag,
          b.lag * 1.2,
          b.pastel,
          b.family,
          b.seed,
          1,
          b.show
        ],
        o
      );
    });
    let fishing = schoolFrom < bloomVao.count;
    (flock.length > 0 || fishing) && (gl.bindFramebuffer(gl.FRAMEBUFFER, flockFbo), gl.clearColor(0, 0, 0, 0), gl.clear(gl.COLOR_BUFFER_BIT)), flock.length > 0 && (gl.useProgram(fly.program), gl.bindVertexArray(flyVao), gl.bindBuffer(gl.ARRAY_BUFFER, flyBuffer), gl.bufferSubData(gl.ARRAY_BUFFER, 0, flyData), u = fly.uniforms, gl.activeTexture(gl.TEXTURE0), gl.bindTexture(gl.TEXTURE_2D, grainTex), gl.uniform1i(u.uGrain, 0), gl.activeTexture(gl.TEXTURE1), gl.bindTexture(gl.TEXTURE_2D, shapesTex), gl.uniform1i(u.uShapes, 1), gl.activeTexture(gl.TEXTURE3), gl.bindTexture(gl.TEXTURE_2D, inksTex), gl.uniform1i(u.uInks, 3), gl.uniform1i(u.uLand, 4), gl.uniform3f(u.uLandLook, 1 / w, 1 / h, Math.log2(5 * (w / cssW))), gl.uniform1f(u.uPixels, w / cssW), gl.uniform1f(u.uDark, dark ? 1 : 0), gl.uniform2f(u.uCanvas, cssW, cssH), gl.uniform4f(u.uLight, -0.32, 0.5, 0.8, 0), gl.uniform2f(u.uForeRange, FORE_RANGE[0], FORE_RANGE[1]), gl.uniform2f(u.uHindRange, HIND_RANGE[0], HIND_RANGE[1]), gl.uniform1f(u.uShapeRows, shapeRows), gl.uniform1f(u.uTile, GRAIN_TILE * (w / cssW)), gl.uniform1f(u.uClock, clock), gl.uniform1f(u.uFan, WING.fan), gl.uniform1f(u.uPitch, WING.pitch), gl.uniform1f(u.uClosest, WING.closest), gl.uniform1f(u.uKeep, WING.keep), gl.uniform1f(u.uFill, WING.fill), gl.uniform2f(u.uBrick, WING.brick[0], WING.brick[1]), gl.uniform1f(u.uGap, WING.gap), gl.uniform1f(u.uFlow, WING.flow), gl.uniform1f(u.uBeadCell, WING.beadCell), gl.uniform1f(u.uBeadChance, WING.beadChance), gl.uniform1f(u.uBeadSize, WING.beadSize), gl.uniform1f(u.uBlotch, WING.blotch), gl.uniform1f(u.uGrainStrength, WING.grain), gl.uniform4fv(u.uCells, CELLS), gl.drawArraysInstanced(gl.TRIANGLES, 0, meshCount, flock.length)), fishing && (gl.enable(gl.BLEND), gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA), gl.useProgram(blooms.program), drawRun(bloomVao, schoolFrom, bloomVao.count - schoolFrom)), gl.bindFramebuffer(gl.FRAMEBUFFER, null), gl.activeTexture(gl.TEXTURE5), gl.bindTexture(gl.TEXTURE_2D, flockTex), (flock.length > 0 || fishing) && gl.generateMipmap(gl.TEXTURE_2D), gl.activeTexture(gl.TEXTURE6), gl.bindTexture(gl.TEXTURE_2D, sceneTex), gl.viewport(0, 0, w, h), gl.disable(gl.BLEND), gl.useProgram(lens.program), gl.bindVertexArray(emptyVao);
    let ul = lens.uniforms, px = w / cssW;
    gl.uniform1i(ul.uFlock, 5), gl.uniform1i(ul.uLand, 6), gl.uniform2f(ul.uRes, w, h), gl.uniform2f(ul.uCentre, w / 2, h / 2), gl.uniform2f(ul.uHalf, w / 2, h / 2), gl.uniform2f(ul.uBand, glass.bandX * px, glass.bandY * px), gl.uniform1f(ul.uIn, glass.inner), gl.uniform1f(ul.uBend, optics.bend), gl.uniform1f(ul.uSplit, optics.split), gl.uniform1f(ul.uAlong, optics.along * h), gl.uniform1f(ul.uSoften, optics.soften + Math.log2(px)), gl.uniform1f(ul.uRound, optics.round), gl.uniform2f(ul.uHalo, optics.halo[0] + Math.log2(px), optics.halo[1]), gl.drawArrays(gl.TRIANGLES, 0, 3), gl.bindVertexArray(null);
  }, last = null, running = !1, pending = !1, inView = eager, near = eager, area = 0, settled = !1, alive = !0, slowFrames = 0, announced = !1, rested = !1, quietUntil = 0, hush = () => {
    quietUntil = performance.now() + 500, slowFrames = 0;
  }, blank = !1, scene = {
    frame: (now) => {
      if (!ready || root.hlHold)
        return;
      let still = isStill(), gap = last === null ? 16 : now - last, dt = Math.min(gap / 1e3, 0.05);
      last = now, still ? (intro = 99, clock = Math.max(clock, mode.stillAt), advance(0)) : (advance(dt), gap < 100 && now > quietUntil && !rested && (slowFrames = gap > 28 ? slowFrames + 1 : Math.max(0, slowFrames - 0.25), slowFrames > 40 && (typeof dprCap == "function" || dprCap > 1) && (slowFrames = 0, dprCap = 1, measure())));
      let empty = !!mode.crossing && !still && !flock.some((b) => b.show > 0);
      (!empty || !blank || dirty) && draw(), blank = empty, pending = !1, rested = !1, still ? (settled = !0, stop()) : inView || stop();
    },
    skip: () => {
      rested = !0;
    },
    area: () => area,
    pending: () => pending,
    held: () => !ready || !!root.hlHold
  }, ask = () => {
    running || (last = null, running = !0, conductor.want(scene));
  }, paintSoon = () => {
    pending = !0, ask();
  }, stop = () => {
    running = !1, pending = !1, conductor.drop(scene);
  }, sync = () => {
    if (alive) {
      if (inView && !document.hidden && ready && !settled && (eager || grownFor.key)) {
        isStill() || !eager && dirty ? paintSoon() : ask();
        return;
      }
      running && !pending && stop(), dirty && near && (eager ? draw() : ready && grownFor.key && !document.hidden && paintSoon());
    }
  };
  if (yield, gone())
    return null;
  let seen = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        inView = entry.isIntersecting, area = entry.intersectionRect.width * entry.intersectionRect.height;
      }), inView || onLeave(), sync();
    },
    { threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  seen.observe(canvas);
  let nearby = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        near = entry.isIntersecting;
      }), sync();
    },
    { rootMargin: mode.near || "100% 0px" }
  );
  nearby.observe(canvas), document.addEventListener("visibilitychange", sync);
  let lastResize = 0, resized = new ResizeObserver(() => {
    let before = landKey, wasDirty = dirty, cleared = measure();
    if (buildLand(), !eager && !cleared && landKey === before) {
      dirty = wasDirty;
      return;
    }
    hush();
    let now = performance.now(), jumped = now - lastResize > 120;
    if (lastResize = now, !grownFor.key)
      landKey && !meadowTimer && meadowAfter(0);
    else if (grownFor.key !== landKey) {
      let wider = cssW / grownFor.w, taller = landRoom / grownFor.room, most = cssW < 677 && grownFor.w < 677 || cssW > 1417 && grownFor.w > 1417 ? 1.2 : 1.15;
      jumped && (most = 1.1), Math.max(wider, 1 / wider, taller, 1 / taller) > most ? meadowNow() : (moveMeadow(), meadowAfter(150));
    }
    near && (eager || cleared) ? (advance(0), draw()) : dirty = !0, settled = !eager && !dirty && isStill(), sync();
  }), watchSize = () => {
    try {
      resized.observe(canvas, { box: "device-pixel-content-box" });
    } catch {
      resized.observe(canvas);
    }
    copyBox && resized.observe(copyBox);
    let front = frontRows.length && mode.behind ? document.querySelector(mode.behind) : null;
    front && resized.observe(front);
  };
  eager && (watchSize(), measure(), buildLand(), meadowAfter(0));
  let scheme = window.matchMedia("(prefers-color-scheme: dark)"), retheme = () => {
    if (!canvas.isConnected) {
      teardown();
      return;
    }
    let before = page.join();
    readPage(), page.join() !== before && (dirty = !0, settled = !1, sync());
  }, themed = new MutationObserver(retheme);
  for (let target of [document.documentElement, document.body])
    themed.observe(target, { attributes: !0, attributeFilter: ["class"] });
  scheme.addEventListener("change", retheme);
  let motion = () => {
    dirty = !0, settled = !1, sync();
  };
  PREFERS_REDUCED.addEventListener("change", motion);
  let lost = (event) => {
    if (!alive)
      return;
    event.preventDefault();
    let shown = root.dataset.hlShown === "true";
    teardown();
    let now = performance.now(), lostAt = losses.get(root) || [];
    for (losses.set(root, lostAt), lostAt.push(now); lostAt.length && now - lostAt[0] > 6e4; )
      lostAt.shift();
    lostAt.length < 3 ? (resumes.add(root), requestAnimationFrame(() => {
      root.isConnected && init(root);
    })) : (root.dataset.hlHeroBound = "true", shown || (root.dataset.hlFallback = "true"));
  };
  canvas.addEventListener("webglcontextlost", lost);
  let teardown = () => {
    alive && (alive = !1, stop(), clearTimeout(meadowTimer), seen.disconnect(), nearby.disconnect(), resized.disconnect(), themed.disconnect(), scheme.removeEventListener("change", retheme), PREFERS_REDUCED.removeEventListener("change", motion), document.removeEventListener("visibilitychange", sync), window.removeEventListener("pointermove", onPointer), window.removeEventListener("pointermove", onSchoolPointer), window.removeEventListener("pointerdown", onSchoolPointer), window.removeEventListener("pointerdown", onPress), document.documentElement.removeEventListener("pointerleave", onLeave), window.removeEventListener("pointermove", onOrbitMove), window.removeEventListener("pointerdown", onOrbitDown), window.removeEventListener("pointerup", onOrbitUp), window.removeEventListener("pointercancel", onOrbitCancel), document.documentElement.removeEventListener("pointerleave", onOrbitLeave), canvas.removeEventListener("webglcontextlost", lost), ready = !1, contexts.delete(gl), gl.getExtension("WEBGL_lose_context")?.loseContext(), heroes.delete(release), canvas.replaceWith(canvas.cloneNode(!1)), delete root.dataset.hlHeroBound, delete root.dataset.hlReady);
  }, release = () => {
    canvas.isConnected || teardown();
  };
  return heroes.add(release), root.hlLead = () => {
    let lead = Number.NEGATIVE_INFINITY;
    for (let b of flock)
      b.show > 0 && (lead = Math.max(lead, b.screenX));
    return lead;
  }, root.hlSeek = (seconds, passAt) => {
    if (meadowTimer && meadowNow(), building && ready) {
      let step = building.next();
      for (; !step.done; )
        step = building.next();
    }
    if (intro = 99, clock = seconds, passAt !== void 0) {
      let walk = mode.passer || PASSER;
      clock = walk.first + (passAt + 1.15) / 2.3 * walk.across;
    }
    return advance(0), dirty = !0, settled = !1, draw(), blank = !1, sync(), { passer: { ...passer }, stirs: stirs.length, ready };
  }, perching && (root.hlRun = (seconds, restart = !1) => {
    if (meadowTimer && meadowNow(), building && ready) {
      let step = building.next();
      for (; !step.done; )
        step = building.next();
    }
    restart && (clock = 0, intro = mode.intro === !1 ? 99 : 0, flockPlaced = !1, overTree = !1, leftTree = -1e9, nextBack = 0);
    for (let left = seconds; left > 1e-6; left -= 1 / 60)
      advance(Math.min(1 / 60, left));
    return dirty = !0, settled = !1, draw(), {
      ready,
      clock,
      flock: flock.map((b) => b.state),
      perches: perches.length,
      crown: [nowX(crownBox.x), nowY(crownBox.y), crownBox.a, crownBox.b],
      page: [pageLeft, pageTop]
    };
  }), orbiting && (root.hlOrbit = () => ({
    zone: zoneNow(),
    aim: { ...aim },
    on: call.on,
    hover: call.hover,
    page: [pageLeft, pageTop],
    words: { ...words },
    flock: flock.map((b) => ({
      state: b.state,
      x: b.screenX,
      y: b.screenY,
      px: b.x,
      py: b.y,
      size: b.size,
      show: b.show,
      depth: b.depth
    }))
  }), root.hlRun = (seconds, restart = !1) => {
    if (meadowTimer && meadowNow(), building && ready) {
      let step = building.next();
      for (; !step.done; )
        step = building.next();
    }
    if (restart) {
      clock = 0, intro = mode.intro === !1 ? 99 : 0, Object.assign(call, { hover: !1, since: 0, left: -1e9, until: -1e9, on: !1, down: null });
      for (let b of flock)
        b.state = "away", b.show = 0;
    }
    for (let left = seconds; left > 1e-6; left -= 1 / 60)
      advance(Math.min(1 / 60, left));
    return dirty = !0, settled = !1, draw(), { ready, clock, flock: flock.map((b) => b.state), orbit: root.hlOrbit() };
  }), Promise.all(programs.map((built) => finishProgram(gl, built)).concat(buildGrain())).then(() => {
    alive && (ready = !0, meadowTimer && meadowNow(), hush(), advance(0), dirty = !0, eager && (draw(), root.dataset.hlReady = "true", root.dataset.hlShown = "true"), sync());
  }).catch((error) => {
    alive && !gl.isContextLost() && (console.warn("[headless-hero]", error), root.dataset.hlFallback = "true");
  }), eager ? null : (building = function* () {
    let parallel = gl.getExtension("KHR_parallel_shader_compile");
    for (; alive && parallel && !programs.every((built) => gl.getProgramParameter(built.program, parallel.COMPLETION_STATUS_KHR)); )
      yield LATER;
    if (alive) {
      for (let part of [measureSteps(), landSteps(!0), growSteps(!0)])
        for (let step = part.next(); !step.done; step = part.next())
          if (yield step.value, !alive)
            return;
      grown(), building = null, watchSize(), sync();
    }
  }(), building);
}, heroes = /* @__PURE__ */ new Set(), losses = /* @__PURE__ */ new WeakMap(), resumes = /* @__PURE__ */ new WeakSet(), contexts = /* @__PURE__ */ new Set(), gpuCalm = function* () {
  let gl = [...contexts].find((held) => !held.isContextLost());
  if (!gl)
    return;
  let from = performance.now(), waited = () => gl.isContextLost() || performance.now() - from > 500, frames = 0;
  for (requestAnimationFrame(
    () => requestAnimationFrame(() => {
      frames = 2;
    })
  ); frames < 2 && !waited(); )
    yield LATER;
  let fence = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
  if (fence) {
    for (gl.flush(); !waited() && gl.getSyncParameter(fence, gl.SYNC_STATUS) !== gl.SIGNALED; )
      yield LATER;
    gl.deleteSync(fence);
  }
}, conductor = /* @__PURE__ */ (() => {
  let scenes = /* @__PURE__ */ new Set(), raf = 0, served = null, tick = (now) => {
    raf = requestAnimationFrame(tick);
    let lead = null, next = null, first = null, passed = !scenes.has(served);
    for (let scene of scenes) {
      if (!scene.held()) {
        if (scene.pending()) {
          lead = scene;
          break;
        }
        passed && !next && (next = scene), first = first || scene;
      }
      scene === served && (passed = !0);
    }
    lead = lead || next || first, served = lead;
    for (let scene of scenes)
      scene !== lead && scene.skip();
    lead?.frame(now);
  };
  return {
    want: (scene) => {
      scenes.add(scene), raf || (raf = requestAnimationFrame(tick));
    },
    drop: (scene) => {
      scenes.delete(scene), !scenes.size && raf && (cancelAnimationFrame(raf), raf = 0);
    }
  };
})(), LATER = "later", COST = {
  context: { least: 6, ms: 6 },
  program: { least: 1, ms: 1 },
  texture: { least: 1.5, ms: 1.5 },
  upload: { least: 1.5, ms: 1.5 },
  sort: { least: 2.5, ms: 2.5 },
  plant: { least: 3, ms: 3 },
  grid: { least: 3, ms: 3 },
  canvas: { least: 1.5, ms: 1.5 },
  mipmap: { least: 1.5, ms: 1.5 },
  style: { least: 1.5, ms: 1.5 }
}, builder = (() => {
  let jobs = [], cancel = null, idle = window.requestIdleCallback ? (fn) => {
    let id = window.requestIdleCallback(fn);
    return () => window.cancelIdleCallback(id);
  } : (
    // Where there is no idle callback, the time after a frame is drawn, up to where the next would start at 120 Hz.
    (fn) => {
      let id = 0, frame = requestAnimationFrame((at) => {
        id = setTimeout(
          () => fn({ didTimeout: !1, timeRemaining: () => Math.max(0, at + 8 - performance.now()) }),
          0
        );
      });
      return () => {
        cancelAnimationFrame(frame), clearTimeout(id);
      };
    }
  ), soon = (fn, ms = 0) => {
    let id = setTimeout(fn, ms);
    return () => clearTimeout(id);
  }, waiting = !1, slice = (deadline) => {
    if (cancel = null, !jobs.length)
      return;
    let at = jobs.findIndex((job2) => job2.urgent);
    at > 0 && jobs.unshift(jobs.splice(at, 1)[0]);
    let job = jobs[0], from = performance.now(), idleLeft = deadline && !deadline.didTimeout ? deadline.timeRemaining() : 0, left = job.urgent ? 4 : idleLeft;
    for (let first = !0; ; first = !1) {
      let now = performance.now(), room = first ? left : Math.min(4, left) - (now - from), cost = job.next;
      if (!(first && job.urgent) && (cost && cost.ms > room || room <= 0))
        break;
      let step = job.steps.next();
      if (cost) {
        let took = performance.now() - now;
        cost.ms = Math.max(cost.least, (cost.ms + took) / 2);
      }
      if (step.done) {
        jobs.shift();
        break;
      }
      if (job.next = step.value?.least ? step.value : null, step.value === LATER) {
        waiting = !0;
        break;
      }
    }
    schedule();
  }, schedule = () => {
    !cancel && jobs.length && (cancel = jobs.some((job) => job.urgent) ? soon(slice, waiting ? 8 : 0) : idle(slice), waiting = !1);
  };
  return {
    add: (job) => {
      jobs.push(job), schedule();
    },
    // a job has turned urgent: it goes on in tasks of its own from now, not in the next idle time
    hurry: () => {
      cancel?.(), cancel = null, schedule();
    }
  };
})();
function mountScene(root) {
  return init(root), () => queueMicrotask(() => {
    for (let release of heroes) release();
  });
}
function registerMode(name, mode) {
  const entry = prepare(mode);
  MODES[name] = entry;
  return () => { if (MODES[name] === entry) delete MODES[name]; };
}
const internals = {
  FOOTER,
  GRASS,
  HERO,
  LAND_INK,
  LENS,
  LINES,
  PAINTS,
  PRICING,
  SK_GLIMMER,
  SK_HAZE,
  SK_TWINKLE,
  STIR,
  clamp,
  hashed,
  smooth
};
export {
  mountScene,
  registerMode,
  internals
};
