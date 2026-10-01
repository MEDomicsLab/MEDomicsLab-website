import { useLayoutEffect } from "react";

export default function useHeroLayout(root, paused) {
  useLayoutEffect(() => {
    const hero = root.current.querySelector(".neue-hero");
    const bottom = hero.querySelector(".neue-hero-bottom");
    const word = hero.querySelector(".neue-hero-medomics");
    const navigation = [
      ...root.current
        .closest(".neue-home-layout")
        .querySelectorAll(".liquid-nav-anchor, .liquid-github-anchor"),
    ];
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let disposed = false;
    const fit = () => {
      if (disposed) return;
      if (window.innerWidth <= 767) {
        hero.style.removeProperty("--hero-centre-y");
        hero.style.removeProperty("--hero-available-height");
        hero.style.removeProperty("--hero-word-width");
        return;
      }
      // The pills are centred on their CSS top. Layout measurements exclude
      // entrance/hover transforms, so the composition does not follow their animation.
      const navBottom = Math.max(...navigation.map((el) => el.offsetTop + el.offsetHeight / 2));
      const available = bottom.offsetTop - navBottom;
      hero.style.setProperty("--hero-centre-y", `${(navBottom + bottom.offsetTop) / 2}px`);
      hero.style.setProperty("--hero-available-height", `${available}px`);
      hero.style.setProperty("--hero-word-width", `${word.offsetWidth}px`);
    };
    const update = () => {
      frame = undefined;
      const progress =
        paused || query.matches
          ? 0
          : Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.32)));
      hero.style.setProperty("--hero-expand", String(progress));
      hero.style.setProperty("--hero-copy-opacity", String(Math.max(0, 1 - progress * 3)));
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = () => {
      fit();
      update();
    };
    fit();
    update();
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(fit);
    [hero, bottom, word, ...navigation].forEach((el) => observer.observe(el));
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scroll, { passive: true });
    query.addEventListener("change", update);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scroll);
      query.removeEventListener("change", update);
      hero.style.removeProperty("--hero-expand");
      hero.style.removeProperty("--hero-copy-opacity");
      hero.style.removeProperty("--hero-available-height");
      hero.style.removeProperty("--hero-centre-y");
      hero.style.removeProperty("--hero-word-width");
    };
  }, [root, paused]);
}
