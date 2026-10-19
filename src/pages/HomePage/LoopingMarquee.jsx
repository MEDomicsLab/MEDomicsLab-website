import { useEffect, useRef, useState } from "react";

export default function LoopingMarquee({
  className,
  trackClassName,
  setClassName,
  label,
  children,
  pauseOffscreenOnMobile = false,
}) {
  const host = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!pauseOffscreenOnMobile) return undefined;
    const mobile = window.matchMedia("(max-width: 767px)");
    let visible = false;
    const update = () => setRunning(!mobile.matches || (visible && !document.hidden));
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(host.current);
    update();
    mobile.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      mobile.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [pauseOffscreenOnMobile]);

  return (
    <div
      ref={host}
      className={className}
      aria-label={label}
      data-in-view={pauseOffscreenOnMobile ? running : undefined}
    >
      <div className={trackClassName}>
        {[false, true].map((duplicate) => (
          <div
            className={setClassName}
            key={String(duplicate)}
            aria-hidden={duplicate || undefined}
          >
            {children(duplicate)}
          </div>
        ))}
      </div>
    </div>
  );
}
