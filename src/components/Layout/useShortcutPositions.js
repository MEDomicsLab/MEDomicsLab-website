import { useLayoutEffect, useRef, useState } from "react";

export default function useShortcutPositions(isHome) {
  const root = useRef(null);
  const [docked, setDocked] = useState(!isHome);

  useLayoutEffect(() => {
    const host = root.current;
    const github = host.querySelector(".liquid-github-anchor");
    const ecosystem = host.querySelector(".liquid-ecosystem-anchor");
    const suffix = github.querySelector(".nav-action-slide__suffix");
    const nav = document.querySelector(".liquid-nav-anchor");
    const page = document.querySelector(".neue-home");
    const hero = page?.querySelector(".neue-hero");
    const origin = page?.querySelector(".neue-hero-film-origin");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame;
    let dockWidth;
    let measuredViewport;
    let disposed = false;
    const place = () => {
      frame = undefined;
      if (disposed) return;
      const mobile = window.innerWidth <= 767;
      const edge = mobile ? 16 : 24;
      const navTop = window.innerWidth < 1100 ? 96 : 46;
      const navHeight = nav.offsetHeight;
      const scroll = Math.max(0, window.scrollY);
      const progress =
        !isHome || !hero
          ? 1
          : reducedMotion.matches
            ? Number(scroll > 8)
            : Math.min(1, scroll / (hero.offsetHeight * 0.38));
      const eased = progress * progress * (3 - 2 * progress);
      if (dockWidth === undefined || measuredViewport !== window.innerWidth) {
        host.style.setProperty("--shortcut-growth", "0");
        dockWidth = ecosystem.offsetWidth;
        measuredViewport = window.innerWidth;
      }
      host.style.setProperty("--shortcut-growth", String(1 - eased));
      if (suffix) host.style.setProperty("--shortcut-suffix-width", `${suffix.scrollWidth + 1}px`);
      const sizes = [github, ecosystem].map((el) => ({
        width: el.offsetWidth,
        height: el.offsetHeight,
      }));
      const below =
        window.innerWidth / 2 + nav.offsetWidth / 2 + 12 > window.innerWidth - edge - dockWidth;
      const dockTop = below ? navTop + navHeight / 2 + 12 : navTop - navHeight / 2;
      const film = origin?.getBoundingClientRect();
      const gap = mobile ? 8 : 14;
      const groupWidth = sizes[0].width + gap + sizes[1].width;
      const stackHeight = sizes[0].height + 8 + sizes[1].height;
      ["github", "ecosystem"].forEach((name, index) => {
        const { width, height } = sizes[index];
        const endX = mobile ? window.innerWidth / 2 : window.innerWidth - edge - width / 2;
        const stackTop = mobile ? window.innerHeight - edge - stackHeight : dockTop;
        const endY = stackTop + (index ? sizes[0].height + 8 : 0) + height / 2;
        const startX = film
          ? film.left +
            (film.width - groupWidth) / 2 +
            (index ? sizes[0].width + gap : 0) +
            width / 2
          : endX;
        const startY = film
          ? mobile
            ? film.bottom + 16 + height / 2
            : film.top + film.height / 2
          : endY;
        host.style.setProperty(`--shortcut-${name}-x`, `${startX + (endX - startX) * eased}px`);
        host.style.setProperty(`--shortcut-${name}-y`, `${startY + (endY - startY) * eased}px`);
      });
      setDocked(progress === 1);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    place();
    document.fonts.ready.then(() => {
      dockWidth = undefined;
      schedule();
    });
    const sizes = new ResizeObserver(schedule);
    [github, ecosystem, nav, origin].filter(Boolean).forEach((el) => sizes.observe(el));
    const changes = new MutationObserver(schedule);
    if (hero) changes.observe(hero, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      sizes.disconnect();
      changes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, [isHome]);

  return { root, docked };
}
