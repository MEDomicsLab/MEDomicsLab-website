const DEEP_LENS = {
  depth: 3.5,
  blur: 0.1,
  dispersion: 1.3,
  specular: 0.9,
  radius: 100,
  outset: 0,
  pressable: false,
  ripple: false,
};

export const VASO_GLASS = {
  navbar: { ...DEEP_LENS, light: 290, pressable: true },
  hover: { ...DEEP_LENS, light: "pointer" },
  community: { ...DEEP_LENS, radius: 24, light: 230 },
  buttons: { ...DEEP_LENS, light: 170, pressable: true, ripple: true },
};
