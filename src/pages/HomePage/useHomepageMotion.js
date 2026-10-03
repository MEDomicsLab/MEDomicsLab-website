import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function useHomepageMotion(root) {
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const context = gsap.context(() => {
        gsap.from("[data-neue-reveal]", {
          y: 45,
          opacity: 0,
          duration: 0.9,
          stagger: 0.08,
          scrollTrigger: { trigger: ".neue-next-intro", start: "top 85%" },
        });
        gsap.from(".ecosystem-line-last", {
          yPercent: 112,
          ease: "none",
          scrollTrigger: {
            trigger: ".neue-ecosystem-centre",
            start: "top 80%",
            end: "center 48%",
            scrub: 0.65,
          },
        });
        const reel = gsap.timeline({
          scrollTrigger: {
            trigger: ".neue-reel",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
          },
        });
        for (let i = 0; i < 2; i += 1) {
          const start = i * 1.5 + 1;
          reel.to(
            `.neue-reel-word-${i}`,
            { yPercent: -112, rotateX: 90, opacity: 0, duration: 0.45 },
            start
          );
          reel.fromTo(
            `.neue-reel-word-${i + 1}`,
            { yPercent: 112, rotateX: -90, opacity: 0 },
            { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.45 },
            start + 0.12
          );
        }
        reel.to({}, { duration: 1 });
        gsap.fromTo(
          ".neue-events-dot",
          { borderRadius: "0%", rotate: -90 },
          {
            borderRadius: "50%",
            rotate: 90,
            ease: "none",
            scrollTrigger: {
              trigger: ".neue-events",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, root);
      return () => context.revert();
    });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => media.revert();
  }, [root]);
}
