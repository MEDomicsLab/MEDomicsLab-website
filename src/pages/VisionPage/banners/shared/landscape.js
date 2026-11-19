const LANDSCAPE = "/vendor/landscape/landscape.mjs";

const absolute = (path) => new URL(path, window.location.origin).href;

export function mountLandscape(host, name, make) {
  let live = true;
  let release, unregister;
  const canvas = document.createElement("canvas");
  canvas.dataset.hlCanvas = "";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);
  host.dataset.hlMode = name;
  import(/* @vite-ignore */ absolute(LANDSCAPE))
    .then(({ mountScene, registerMode, internals }) => {
      if (!live) return;
      if (make) unregister = registerMode(name, make(internals));
      release = mountScene(host);
    })
    .catch((error) => console.error(`Landscape ${name} failed`, error));
  return () => {
    live = false;
    canvas.remove();
    delete host.dataset.hlMode;
    delete host.dataset.hlHeroBound;
    delete host.dataset.hlReady;
    release?.();
    unregister?.();
  };
}
