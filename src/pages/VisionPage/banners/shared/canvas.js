// Paint once per layout in still mode and animate only while visible otherwise.
export function stage(
  host,
  { layout, draw, still = false, stillTime = 6, maxPixels = 2, context = "2d" }
) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  const below = [...host.children].filter((node) => node.tagName === "CANVAS").pop();
  if (below) below.after(canvas);
  else host.prepend(canvas);
  const ctx =
    context === "2d"
      ? canvas.getContext("2d")
      : canvas.getContext(context, { premultipliedAlpha: true });
  let width = 0;
  let height = 0;
  let pixels = 1;
  let frame = 0;
  let last = 0;
  let time = still ? stillTime : 0;
  let visible = false;
  let alive = true;
  const pointer = { x: 0, y: 0, inside: false };

  const paint = (delta) => draw({ ctx, canvas, width, height, pixels, time, delta, pointer });
  const resize = () => {
    width = host.clientWidth;
    height = host.clientHeight;
    pixels = Math.min(maxPixels, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(width * pixels));
    canvas.height = Math.max(1, Math.round(height * pixels));
    layout?.({ ctx, canvas, width, height, pixels });
    paint(0);
  };
  const step = (now) => {
    frame = 0;
    const delta = last ? Math.min(0.064, (now - last) / 1000) : 1 / 60;
    last = now;
    time += delta;
    paint(delta);
    if (visible && !document.hidden && alive) frame = requestAnimationFrame(step);
    else last = 0;
  };
  const wake = () => {
    if (!still && alive && visible && !document.hidden && !frame)
      frame = requestAnimationFrame(step);
    if (still && alive) paint(0);
  };
  const seen = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    wake();
  });
  const sized = new ResizeObserver(() => resize());
  // Tracked on the window, so the pointer is followed even where the page's words lie over the host.
  const move = (event) => {
    const box = host.getBoundingClientRect();
    pointer.x = event.clientX - box.left;
    pointer.y = event.clientY - box.top;
    pointer.inside =
      pointer.x >= 0 && pointer.y >= 0 && pointer.x <= box.width && pointer.y <= box.height;
  };
  const leave = () => {
    pointer.inside = false;
  };
  addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", leave);
  document.addEventListener("visibilitychange", wake);
  resize();
  seen.observe(host);
  sized.observe(host);

  return () => {
    alive = false;
    cancelAnimationFrame(frame);
    seen.disconnect();
    sized.disconnect();
    removeEventListener("pointermove", move);
    document.documentElement.removeEventListener("pointerleave", leave);
    document.removeEventListener("visibilitychange", wake);
    canvas.remove();
  };
}

// A small seeded random generator, so a scene lays out the same way on every visit.
export function seeded(seed = 1) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}
