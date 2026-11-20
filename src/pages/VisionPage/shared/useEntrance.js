import { useEffect, useState } from "react";

// The first banner's lines take 800 ms to shoot across once its first picture is up (lucioles `introMs`); the
// headline starts rising out of it as the sweep finishes, at this point of the draw-in.
const HEADLINE_AT_MS = 520;
// If the landscape has not painted by then (no WebGL, a slow import), the page opens without it.
const BANNER_GIVE_UP_MS = 2500;
// Once it has painted, a renderer too slow to finish the sweep (software WebGL, a few frames a second) holds the
// headline back no longer than this.
const SWEEP_GIVE_UP_MS = 1200;
// The rest of the page follows this long after the headline starts to rise.
const PAGE_AFTER_MS = 300;

/*
 * Opening order on a fresh visit: the first banner draws in, then the headline rises out of it, then
 * the rest of the page arrives. Visitors who prefer reduced motion, land on a section link, or come back mid-page
 * get the whole page at once.
 */
export default function useEntrance() {
  const [stage, setStage] = useState("banner");

  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash ||
      window.scrollY > 0
    ) {
      setStage("done");
      return undefined;
    }
    const banner = document.getElementById("banner-horizon");
    const timers = [];
    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      watcher.disconnect();
      cancelAnimationFrame(frame);
      setStage("copy");
      timers.push(setTimeout(() => setStage("done"), PAGE_AFTER_MS));
    };
    // Count the draw-in the way the landscape does, frame by frame with each step capped at 50 ms, so a slow or
    // throttled device still sees the banner drawn before the headline.
    let frame;
    const drawn = () => {
      let drawnMs = 0;
      let last;
      const tick = (now) => {
        drawnMs += last === undefined ? 0 : Math.min(now - last, 50);
        last = now;
        if (drawnMs >= HEADLINE_AT_MS) open();
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      timers.push(setTimeout(open, SWEEP_GIVE_UP_MS));
    };
    const watcher = new MutationObserver(() => {
      if (banner?.dataset.hlReady) {
        watcher.disconnect();
        drawn();
      }
    });
    if (banner?.dataset.hlReady) drawn();
    else if (banner)
      watcher.observe(banner, { attributes: true, attributeFilter: ["data-hl-ready"] });
    timers.push(
      setTimeout(() => {
        if (!banner?.dataset.hlReady) open();
      }, BANNER_GIVE_UP_MS)
    );
    // A scroll or a section jump during the opening skips the rest of it.
    const skip = () => {
      open();
      setStage("done");
    };
    window.addEventListener("wheel", skip, { once: true, passive: true });
    window.addEventListener("touchmove", skip, { once: true, passive: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("hashchange", skip, { once: true });
    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
      timers.forEach(clearTimeout);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("hashchange", skip);
    };
  }, []);

  return stage;
}
