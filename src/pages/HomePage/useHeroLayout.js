import { useLayoutEffect } from "react";

export default function useHeroLayout(root, paused) {
  useLayoutEffect(() => {
    const hero = root.current.querySelector(".neue-hero");
    const word = hero.querySelector(".neue-hero-medomics");
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let disposed = false;
    const fit = () => {
      if (disposed || window.innerWidth <= 767) return;
      const styles = getComputedStyle(hero);
      const left = parseFloat(styles.paddingLeft);
      const gap = parseFloat(styles.getPropertyValue("--hero-word-gap"));
      const filmWidth = window.innerWidth * 0.29;
      const available = (window.innerWidth - filmWidth) / 2 - left - gap;
      const context = document.createElement("canvas").getContext("2d");
      const font = getComputedStyle(word);
      context.font = `600 100px ${font.fontFamily}`;
      context.letterSpacing = "-4px";
      const measure = context.measureText("MEDomics");
      const size =
        (available / (measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight)) * 100;
      context.font = `600 ${size}px ${font.fontFamily}`;
      context.letterSpacing = `${size * -0.04}px`;
      hero.style.setProperty("--hero-word-size", `${size}px`);
      hero.style.setProperty(
        "--hero-ink-left",
        `${context.measureText("MEDomics").actualBoundingBoxLeft}px`
      );
      hero.style.setProperty(
        "--hero-lab-descent",
        `${context.measureText("Lab").actualBoundingBoxDescent}px`
      );
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
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", scroll, { passive: true });
    query.addEventListener("change", update);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", scroll);
      query.removeEventListener("change", update);
      hero.style.removeProperty("--hero-expand");
      hero.style.removeProperty("--hero-copy-opacity");
      hero.style.removeProperty("--hero-word-size");
      hero.style.removeProperty("--hero-ink-left");
      hero.style.removeProperty("--hero-lab-descent");
    };
  }, [root, paused]);
}
