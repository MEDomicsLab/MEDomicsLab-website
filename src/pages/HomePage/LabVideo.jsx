import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import homeData from "../../data/home.json";
import useMediaQuery from "../../lib/useMediaQuery.js";
import { imageSrcSet } from "../../lib/images.js";

const MuxPlayer = lazy(() => import("@mux/mux-player-react"));
const playbackId = new URL(homeData.hero.videoUrl).pathname.slice(1);
const FilmContext = createContext(null);

export function LabVideoProvider({ paused, children }) {
  const player = useRef(null);
  const source = useRef(null);
  const [host, setHost] = useState(null);
  const [video, setVideo] = useState(null);
  const native = useMediaQuery("(max-width: 767px), (pointer: coarse)") === true;
  const film = useMemo(() => ({ surfaces: new Set(), draw: () => {}, sync: () => {} }), []);
  const value = useMemo(() => ({ film, native }), [film, native]);

  useEffect(() => {
    // A stable portal container lets mobile surfaces share the actual player,
    // without copying frames to canvas or restarting the stream on every section.
    const element = document.createElement("div");
    element.className = "neue-film-player";
    source.current.appendChild(element);
    setHost(element);
    return () => element.remove();
  }, []);

  useEffect(() => {
    if (!host) return;
    let frame;
    const sync = () => {
      const visible = [...film.surfaces].filter(
        (surface) => surface.visible && (!surface.hero || window.scrollY < surface.heroHeight)
      );
      const active = visible.at(-1);
      const container = native && active ? active.element : source.current;
      if (host.parentElement !== container) container.appendChild(host);
      if (paused || document.hidden || !active) {
        if (player.current && !player.current.paused) player.current.pause();
      } else if (player.current?.paused) player.current.play()?.catch(() => {});
    };
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        sync();
      });
    };
    film.sync = sync;
    sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      film.sync = () => {};
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", schedule);
    };
  }, [film, host, native, paused, video]);

  useEffect(() => {
    if (!video || native) return;
    let frame;
    let disposed = false;
    const draw = () => {
      if (document.hidden || video.readyState < 2 || !video.videoWidth) return;
      for (const surface of film.surfaces) {
        if (!surface.visible || (surface.hero && window.scrollY >= surface.heroHeight)) continue;
        const { canvas, width, height, context } = surface;
        if (!width || !height || !context) continue;
        const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        context.drawImage(
          video,
          (video.videoWidth - sourceWidth) / 2,
          (video.videoHeight - sourceHeight) / 2,
          sourceWidth,
          sourceHeight,
          0,
          0,
          canvas.width,
          canvas.height
        );
        canvas.dataset.ready = "true";
      }
    };
    film.draw = draw;
    const hasVideoFrames = typeof video.requestVideoFrameCallback === "function";
    const render = () => {
      if (disposed) return;
      draw();
      frame = hasVideoFrames
        ? video.requestVideoFrameCallback(render)
        : requestAnimationFrame(render);
    };
    render();
    video.addEventListener("seeked", draw);
    video.addEventListener("loadeddata", draw);
    return () => {
      disposed = true;
      if (hasVideoFrames) video.cancelVideoFrameCallback(frame);
      else cancelAnimationFrame(frame);
      video.removeEventListener("seeked", draw);
      video.removeEventListener("loadeddata", draw);
      film.draw = () => {};
    };
  }, [film, video, native]);

  const connectVideo = () => {
    const nativeVideo = player.current?.media?.nativeEl;
    if (nativeVideo instanceof HTMLVideoElement) setVideo(nativeVideo);
    film.sync();
  };
  const connectPlayer = useCallback(
    (instance) => {
      player.current = instance;
      if (instance) film.sync();
    },
    [film]
  );

  return (
    <FilmContext.Provider value={value}>
      <div ref={source} className="neue-video-source" aria-hidden="true" />
      {host &&
        createPortal(
          <Suspense fallback={null}>
            <MuxPlayer
              ref={connectPlayer}
              playbackId={playbackId}
              poster="/images/homepage-1280.webp"
              streamType="on-demand"
              onLoadedData={connectVideo}
              onPlaying={connectVideo}
              muted
              loop
              autoPlay={false}
              playsInline
              preload={paused ? "none" : "metadata"}
              maxResolution={native ? "540p" : "1080p"}
              tabIndex={-1}
              nohotkeys
              disableTracking
              disableCookies
              noVolumePref
              noMutedPref
              onCanPlay={connectVideo}
              className="neue-mux-player"
            />
          </Suspense>,
          host
        )}
      {children}
    </FilmContext.Provider>
  );
}

export default function LabVideo({ priority = false }) {
  const element = useRef(null);
  const canvas = useRef(null);
  const { film, native } = useContext(FilmContext);
  useEffect(() => {
    const host = element.current;
    const hero = host.closest(".neue-hero");
    const surface = {
      element: host,
      canvas: canvas.current,
      context: canvas.current?.getContext("2d", { alpha: false }),
      width: 0,
      height: 0,
      visible: false,
      hero: Boolean(hero),
      heroHeight: hero?.offsetHeight,
    };
    film.surfaces.add(surface);
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      surface.width = width;
      surface.height = height;
      surface.heroHeight = hero?.offsetHeight;
      if (surface.canvas) {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        surface.canvas.width = Math.max(1, Math.round(width * ratio));
        surface.canvas.height = Math.max(1, Math.round(height * ratio));
        film.draw();
      }
    });
    const visibility = new IntersectionObserver(([entry]) => {
      surface.visible = entry.isIntersecting;
      film.sync();
      if (surface.visible) film.draw();
    });
    resize.observe(host);
    visibility.observe(host);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      film.surfaces.delete(surface);
      film.sync();
    };
  }, [film, native]);
  return (
    <div ref={element} className="neue-video" aria-hidden="true">
      <picture>
        <source
          type="image/webp"
          srcSet={imageSrcSet("/images/homepage.jpg", [640, 1280], "webp")}
          sizes="100vw"
        />
        <img
          className="neue-video-poster"
          src="/images/homepage.jpg"
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </picture>
      {!native && <canvas className="neue-video-frame" ref={canvas} />}
    </div>
  );
}
