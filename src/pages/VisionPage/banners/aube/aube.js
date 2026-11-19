import { mountHorizonButterflies } from "../shared/horizonButterflies.js";
import { mountLandscape } from "../shared/landscape.js";
import { aubeMode } from "./scene.js";

export function mount(host, context) {
  const sun = document.createElement("button");
  sun.type = "button";
  sun.className = "aube-sun";
  sun.setAttribute("aria-label", "Send a ripple of sunlight across the river");
  const glints = document.createElement("span");
  glints.className = "aube-reflection";
  for (let i = 0; i < 13; i++) {
    const ray = document.createElement("i");
    ray.style.setProperty("--i", i);
    ray.style.setProperty("--reach", 15 + Math.sin(i * 1.74) * 8 + i * 2.6 + "%");
    glints.append(ray);
  }
  host.append(sun, glints);
  const onSun = (x, y, r) => {
    sun.style.left = x + "px";
    sun.style.top = y + "px";
    sun.style.width = sun.style.height = 2 * r + "px";
    glints.style.left = x + "px";
    glints.style.top = y + r * 0.35 + "px";
  };
  const land = mountLandscape(host, "aube", (k) =>
    aubeMode(k, { host, still: context.reducedMotion, onSun })
  );
  const flight = mountHorizonButterflies(host, context, 0.55);
  let timer;
  sun.onclick = () => {
    clearTimeout(timer);
    host.removeAttribute("data-sunlit");
    void sun.offsetWidth;
    host.setAttribute("data-sunlit", "");
    timer = setTimeout(() => host.removeAttribute("data-sunlit"), 1550);
  };
  return () => {
    flight();
    clearTimeout(timer);
    host.removeAttribute("data-sunlit");
    sun.remove();
    glints.remove();
    land();
  };
}
