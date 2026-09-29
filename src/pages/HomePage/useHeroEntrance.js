import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function useHeroEntrance(root, paused) {
  const posterReady = useRef(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const start = useRef(null);
  const finish = useRef(null);
  const onPosterReady = useCallback(() => {
    posterReady.current = true;
    start.current?.();
  }, []);

  useLayoutEffect(() => {
    const page = root.current;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (window.location.hash) {
        page.dataset.heroIntro = "skipped";
        setVideoStarted(true);
        return;
      }
      const film = page.querySelector(".neue-hero-film");
      const hero = page.querySelector(".neue-hero");
      const layout = page.closest(".neue-home-layout");
      const medomics = page.querySelector(".neue-hero-medomics");
      const lab = page.querySelector(".neue-hero-lab");
      const bottomContent = [
        ...page.querySelectorAll(".neue-hero-description, .neue-hero-credit, .neue-hero-logo"),
      ];
      const navigation = [...layout.querySelectorAll(".liquid-nav-anchor, .liquid-github-anchor")];
      const moving = [medomics, lab, ...bottomContent, ...navigation];
      const reveal = [
        ...page.querySelectorAll(".neue-hero h1 span, .neue-hero-bottom"),
        ...navigation,
      ];
      const target = film.getBoundingClientRect();
      let timeline;
      let timer;
      let started = false;
      let complete = false;
      const context = gsap.context(() => {
        gsap.set(hero, { overflow: "clip" });
        gsap.set(film, { width: "100vw", height: "100svh", zIndex: 3 });
        gsap.set(reveal, { autoAlpha: 0 });
        const distance = Math.min(180, Math.max(70, window.innerWidth * 0.1));
        gsap.set(medomics, { translate: `${-distance}px 0px` });
        gsap.set(lab, { translate: `${distance}px 0px` });
        gsap.set(bottomContent, { translate: "0px 60px" });
        gsap.set(navigation, { translate: "0px -100px" });
      });
      page.dataset.heroIntro = "waiting";

      const settle = () => {
        if (complete) return;
        complete = true;
        clearTimeout(timer);
        timeline?.kill();
        context.revert();
        gsap.set(film, { clearProps: "width,height,zIndex" });
        gsap.set(reveal, { clearProps: "opacity,visibility" });
        gsap.set(moving, { clearProps: "translate" });
        page.dataset.heroIntro = "complete";
        setVideoStarted(true);
      };
      finish.current = settle;
      start.current = () => {
        if (started || complete) return;
        started = true;
        clearTimeout(timer);
        page.dataset.heroIntro = "holding";
        context.add(() => {
          timeline = gsap.timeline({ delay: 0.35, onComplete: settle });
          timeline.call(() => {
            page.dataset.heroIntro = "shrinking";
          });
          timeline.call(() => setVideoStarted(true), [], 0.1);
          timeline.to(
            film,
            {
              width: target.width,
              height: target.height,
              duration: 1.35,
              ease: "power3.inOut",
            },
            0
          );
          timeline.to(reveal, { autoAlpha: 1, duration: 0.65, ease: "power2.out" }, 0.5);
          timeline.to(moving, { translate: "0px 0px", duration: 0.85, ease: "power3.out" }, 0.5);
        });
      };
      timer = window.setTimeout(() => start.current?.(), 2200);
      if (posterReady.current) start.current();
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
        clearTimeout(timer);
        timeline?.kill();
        context.revert();
        start.current = null;
        finish.current = null;
        delete page.dataset.heroIntro;
        window.removeEventListener("wheel", settle);
        window.removeEventListener("touchstart", settle);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", settle);
        window.removeEventListener("keydown", onKey);
      };
    });
    return () => media.revert();
  }, [root]);

  useEffect(() => {
    if (paused) finish.current?.();
  }, [paused]);
  return { onPosterReady, videoStarted };
}
