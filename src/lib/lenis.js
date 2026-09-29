import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};

export const scrollToTopNow = () => {
  instance?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  // A native restoration can differ from Lenis's target (including target=0,
  // where scrollTo returns early). Cancel any remaining glide and resync it.
  instance?.reset();
  // Clearing restoration memory alone leaves GSAP's cached scroll value stale.
  // Update both axes before a footer/font refresh can restore the old position.
  ScrollTrigger.getScrollFunc(window)(0);
  ScrollTrigger.getScrollFunc(window, true)(0);
  ScrollTrigger.clearScrollMemory("manual");
};
