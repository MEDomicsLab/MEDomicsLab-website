// Shared geometry for the lake, shore and flight layers.

// The far shore's waterline, as a share of the room under the words.
const WATER = 0.42;

// The laurentian hills behind the lake: rounded, worn summits, each [middle, half width, height] in
// room units from the middle of the box, standing on a low ridge of `foot`.
const FAR = {
  foot: 0.075,
  humps: [
    [-2.45, 0.8, 0.09],
    [-1.6, 0.95, 0.14],
    [-0.8, 0.7, 0.07],
    [0.02, 0.9, 0.065],
    [0.98, 1.15, 0.16],
    [2.0, 0.8, 0.095],
    [2.7, 0.7, 0.12],
  ],
};
const NEAR = {
  foot: 0.032,
  humps: [
    [-2.1, 0.62, 0.065],
    [-1.12, 0.8, 0.085],
    [-0.38, 0.55, 0.04],
    [0.42, 0.62, 0.06],
    [1.5, 0.85, 0.09],
    [2.4, 0.6, 0.06],
  ],
};

// Foreground meadow points in normalized width and room height.
const BANK = [
  [-1.6, 0.44],
  [-1.0, 0.52],
  [-0.8, 0.6],
  [-0.6, 0.705],
  [-0.4, 0.795],
  [-0.2, 0.85],
  [0, 0.87],
  [0.2, 0.845],
  [0.4, 0.775],
  [0.6, 0.69],
  [0.8, 0.6],
  [1.0, 0.545],
  [1.6, 0.48],
];

const MILKY = { foot: 1.02, climb: 0.36, wide: [0.42, 0.26] };

const hump = (u) => (Math.abs(u) >= 1 ? 0 : (1 - u * u) ** 1.7);
const ridge = ({ foot, humps }, X) =>
  foot + humps.reduce((sum, [at, wide, tall]) => sum + tall * hump((X - at) / wide), 0);

// Cubic interpolation with level endpoints.
function curve(points) {
  const last = points.length - 1;
  return (x) => {
    if (x <= points[0][0]) return points[0][1];
    if (x >= points[last][0]) return points[last][1];
    let k = 0;
    while (points[k + 1][0] < x) k += 1;
    const slope = (a, b) => (points[b][1] - points[a][1]) / (points[b][0] - points[a][0]);
    const m0 = k > 0 ? slope(k - 1, k + 1) : slope(k, k + 1);
    const m1 = k + 1 < last ? slope(k, k + 2) : slope(k, k + 1);
    const [x0, y0] = points[k];
    const [x1, y1] = points[k + 1];
    const span = x1 - x0;
    const f = (x - x0) / span;
    return (
      (2 * f ** 3 - 3 * f ** 2 + 1) * y0 +
      (f ** 3 - 2 * f ** 2 + f) * span * m0 +
      (-2 * f ** 3 + 3 * f ** 2) * y1 +
      (f ** 3 - f ** 2) * span * m1
    );
  };
}

const bankDown = curve(BANK);

// The plan for a box `w` by `h` whose words end `foot` pixels down it. Every place is in CSS pixels.
export function plan(w, h, foot) {
  const base = foot;
  const room = Math.max(40, h - foot);
  const middle = w / 2;
  const water = base + WATER * room;
  const X = (x) => (x - middle) / room;
  const milkyFoot = middle + MILKY.foot * room;
  return {
    w,
    h,
    base,
    room,
    middle,
    water,
    // the crest of the far hills and of the nearer ridge in front of them
    far: (x) => water - ridge(FAR, X(x)) * room,
    near: (x) => water - ridge(NEAR, X(x)) * room,
    // the meadow's edge on this side of the lake
    bank: (x) => base + bankDown((x - middle) / middle) * room,
    // the middle of the Milky Way at a place across, and its half width there
    milky: (x) => water - (milkyFoot - x) * MILKY.climb,
    milkyHalf: (x) => {
      const t = Math.min(1, Math.max(0, (milkyFoot - x) / (room * 3)));
      return (room * (MILKY.wide[0] + (MILKY.wide[1] - MILKY.wide[0]) * t)) / 2;
    },
    milkyFoot,
  };
}
