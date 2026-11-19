// Start the canvas after its local plate has decoded. This also gives a reduced-motion
// canvas its first (and only) painted frame when a visitor has a cold cache.
export function withPlate(url, start) {
  const image = new Image();
  let active = true,
    release;
  image.onload = () => {
    if (active) release = start(image);
  };
  image.src = url;
  return () => {
    active = false;
    image.onload = null;
    release?.();
  };
}
