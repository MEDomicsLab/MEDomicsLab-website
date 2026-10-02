import { useEffect, useLayoutEffect, useRef } from "react";

const DURATION = 900;
const FADE_DURATION = 700;
const EASE_OUT = "cubic-bezier(0.165, 0.84, 0.44, 1)";
const FADE_EASE = "cubic-bezier(0.215, 0.61, 0.355, 1)";

/**
 * Reveal the wordmark above the stationary film. The browser composites the
 * transform and opacity animations itself, so hydration, video start-up or
 * other main-thread work cannot pause them partway.
 */
export default function useHeroEntrance(root, paused) {
  const finish = useRef(null);

  useLayoutEffect(() => {
    const page = root.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;
    if (window.location.hash) {
      page.dataset.heroIntro = "skipped";
      return () => delete page.dataset.heroIntro;
    }
    const hero = page.querySelector(".neue-hero");
    const layout = page.closest(".neue-home-layout");
    const title = page.querySelector("#home-heading");
    const words = [...title.children];
    const description = page.querySelector(".neue-hero-description");
    const credit = page.querySelector(".neue-hero-credit");
    const logo = page.querySelector(".neue-hero-logo");
    const bottom = page.querySelector(".neue-hero-bottom");
    const navigation = layout.querySelector(".liquid-nav-anchor");
    const navigationLayers = [...navigation.parentElement.children];
    const shortcutLayers = [...layout.querySelectorAll(".liquid-action-anchor > *")];

    hero.style.overflow = "clip";
    title.style.zIndex = "1";
    page.dataset.heroIntro = "revealing";
    const rise = title.offsetHeight + 42;
    const above = navigation.offsetTop + navigation.offsetHeight / 2 + 12;
    const slide = (element, from, to = "none") =>
      element.animate([{ transform: from }, { transform: to || "none" }], {
        duration: DURATION,
        easing: EASE_OUT,
        fill: "backwards",
      });
    const animations = [
      ...words.map((word) => slide(word, `translateY(${rise}px)`)),
      slide(description, `translateX(${-description.getBoundingClientRect().right}px)`),
      slide(credit, `translateX(${window.innerWidth - credit.getBoundingClientRect().left}px)`),
      slide(logo, "translateY(60px)"),
      ...navigationLayers.map((layer) =>
        slide(layer, `${layer.style.transform} translateY(${-above}px)`, layer.style.transform)
      ),
      bottom.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: FADE_DURATION,
        easing: FADE_EASE,
        fill: "backwards",
      }),
      ...shortcutLayers.map((layer) =>
        layer.animate([{ "--glass-opacity": 0 }, { "--glass-opacity": 1 }], {
          duration: FADE_DURATION,
          easing: FADE_EASE,
          fill: "backwards",
        })
      ),
    ];

    let complete = false;
    const settle = () => {
      if (complete) return;
      complete = true;
      animations.forEach((animation) => animation.cancel());
      hero.style.removeProperty("overflow");
      title.style.removeProperty("z-index");
      page.dataset.heroIntro = "complete";
    };
    finish.current = settle;
    Promise.all(animations.map((animation) => animation.finished)).then(settle, () => {});

    const onKey = (event) => {
      if (["Escape", "Tab", "ArrowDown", "PageDown", "End", " "].includes(event.key)) settle();
    };
    const onScroll = () => {
      if (window.scrollY > 8) settle();
    };
    window.addEventListener("wheel", settle, { passive: true });
    window.addEventListener("touchstart", settle, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", settle);
    window.addEventListener("keydown", onKey);
    return () => {
      settle();
      finish.current = null;
      delete page.dataset.heroIntro;
      window.removeEventListener("wheel", settle);
      window.removeEventListener("touchstart", settle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", settle);
      window.removeEventListener("keydown", onKey);
    };
  }, [root]);

  useEffect(() => {
    if (paused) finish.current?.();
  }, [paused]);
}
