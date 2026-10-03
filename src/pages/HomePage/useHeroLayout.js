import { useLayoutEffect } from "react";

export default function useHeroLayout(root, paused) {
  useLayoutEffect(() => {
    const page = root.current;
    const layout = page.closest(".neue-home-layout");
    const hero = page.querySelector(".neue-hero");
    const bottom = hero.querySelector(".neue-hero-bottom");
    const title = hero.querySelector("h1");
    const firstWord = title.querySelector(".neue-hero-medomics");
    const lastWord = title.querySelector(".neue-hero-lab");
    const brand = layout.querySelector(".site-brand-wordmark");
    const navigation = layout.querySelector(".liquid-nav-anchor");
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const context = document.createElement("canvas").getContext("2d");
    let frame;
    let fitFrame;
    let disposed = false;
    let destination = { x: 0, y: 0, scale: 1 };

    const update = () => {
      frame = undefined;
      const animated = !paused && !query.matches;
      const scroll = Math.max(0, window.scrollY);
      const progress = animated ? Math.min(1, scroll / (hero.offsetHeight * 0.32)) : 0;
      hero.style.setProperty("--hero-expand", String(progress));
      hero.style.setProperty("--hero-copy-opacity", String(Math.max(0, 1 - progress * 3)));

      const travel = animated ? Math.min(1, scroll / (hero.offsetHeight * 0.38)) : 0;
      const eased = travel * travel * (3 - 2 * travel);
      const handover = Math.max(0, (travel - 0.88) / 0.12);
      hero.style.setProperty("--hero-brand-x", `${destination.x * eased}px`);
      hero.style.setProperty("--hero-brand-y", `${destination.y * eased}px`);
      hero.style.setProperty("--hero-brand-scale", String(1 + (destination.scale - 1) * eased));
      hero.style.setProperty("--hero-word-opacity", String(1 - handover));
      if (animated) {
        layout.dataset.brandMotion = "true";
        layout.style.setProperty("--home-brand-opacity", String(handover));
        layout.style.setProperty("--home-brand-visibility", handover > 0 ? "visible" : "hidden");
        layout.style.setProperty("--home-brand-pointer-events", handover > 0 ? "auto" : "none");
      } else {
        delete layout.dataset.brandMotion;
      }
    };

    const fit = () => {
      if (disposed) return;
      if (window.innerWidth <= 767) {
        hero.style.removeProperty("--hero-centre-y");
        hero.style.removeProperty("--hero-available-height");
      } else {
        const navBottom = navigation.offsetTop + navigation.offsetHeight / 2;
        hero.style.setProperty("--hero-available-height", `${bottom.offsetTop - navBottom}px`);
        hero.style.setProperty("--hero-centre-y", `${(navBottom + bottom.offsetTop) / 2}px`);
      }

      // Letter side bearings are outside the visible M/b edges. Measure the ink,
      // rather than the text box, so the film aligns with the actual letters.
      const font = getComputedStyle(firstWord);
      context.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
      context.letterSpacing = font.letterSpacing;
      const leftInset = -context.measureText(firstWord.textContent).actualBoundingBoxLeft;
      const right =
        parseFloat(font.width) + context.measureText(lastWord.textContent).actualBoundingBoxRight;
      const titleWidth = parseFloat(getComputedStyle(title).width);
      hero.style.setProperty("--hero-film-width", `${right - leftInset}px`);
      hero.style.setProperty(
        "--hero-film-centre-x",
        `calc(50% + ${(leftInset + right - titleWidth) / 2}px)`
      );

      const target = brand.getBoundingClientRect();
      const source = getComputedStyle(title);
      destination = {
        x: target.left - (parseFloat(source.left) - titleWidth / 2),
        y: target.top - (parseFloat(source.top) - parseFloat(source.height)),
        scale: target.width / titleWidth,
      };
      update();
    };
    const scheduleFit = () => {
      cancelAnimationFrame(fitFrame);
      fitFrame = requestAnimationFrame(fit);
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    fit();
    document.fonts.ready.then(fit);
    const observer = new ResizeObserver(scheduleFit);
    [hero, bottom, title, brand, navigation].forEach((el) => observer.observe(el));
    const positions = new MutationObserver(scheduleFit);
    positions.observe(navigation, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("resize", scheduleFit);
    window.addEventListener("scroll", scroll, { passive: true });
    query.addEventListener("change", update);
    return () => {
      disposed = true;
      observer.disconnect();
      positions.disconnect();
      cancelAnimationFrame(frame);
      cancelAnimationFrame(fitFrame);
      window.removeEventListener("resize", scheduleFit);
      window.removeEventListener("scroll", scroll);
      query.removeEventListener("change", update);
      for (const property of [
        "expand",
        "copy-opacity",
        "word-opacity",
        "available-height",
        "centre-y",
        "film-width",
        "film-centre-x",
        "brand-x",
        "brand-y",
        "brand-scale",
      ]) {
        hero.style.removeProperty(`--hero-${property}`);
      }
      delete layout.dataset.brandMotion;
      for (const property of ["opacity", "visibility", "pointer-events"])
        layout.style.removeProperty(`--home-brand-${property}`);
    };
  }, [root, paused]);
}
