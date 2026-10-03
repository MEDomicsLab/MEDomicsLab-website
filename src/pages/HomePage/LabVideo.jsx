import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import homeData from "../../data/home.json";

const playbackId = new URL(homeData.hero.videoUrl).pathname.slice(1);
const FilmContext = createContext(null);

export function LabVideoProvider({ paused, children }) {
  const player = useRef(null);
  const [video, setVideo] = useState(null);
  const film = useMemo(() => ({ surfaces: new Set(), draw: () => {} }), []);

  const connectVideo = () => {
    const nativeVideo = player.current?.media?.nativeEl;
    if (nativeVideo instanceof HTMLVideoElement) setVideo(nativeVideo);
  };

  useEffect(() => {
    if (paused) player.current?.pause();
    else player.current?.play()?.catch(() => {});
  }, [paused]);

  useEffect(() => {
    if (!video) return;
    let frame;
    let disposed = false;
    const draw = () => {
      if (video.readyState < 2 || !video.videoWidth) return;
      for (const surface of film.surfaces) {
        if (!surface.visible) continue;
        const { canvas, width, height } = surface;
        if (!width || !height) continue;
        const scale = Math.max(width / video.videoWidth, height / video.videoHeight);
        const sourceWidth = width / scale;
        const sourceHeight = height / scale;
        const context = canvas.getContext("2d", { alpha: false });
        if (!context) continue;
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
  }, [film, video]);

  return (
    <FilmContext.Provider value={film}>
      <div className="neue-video-source" aria-hidden="true">
        {!import.meta.env.SSR && (
          <MuxPlayer
            ref={player}
            playbackId={playbackId}
            streamType="on-demand"
            onLoadedData={connectVideo}
            onPlaying={connectVideo}
            muted
            loop
            autoPlay={!paused ? "muted" : false}
            playsInline
            preload="auto"
            tabIndex={-1}
            nohotkeys
            disableTracking
            className="neue-mux-player"
          />
        )}
      </div>
      {children}
    </FilmContext.Provider>
  );
}

export default function LabVideo() {
  const canvas = useRef(null);
  const film = useContext(FilmContext);
  useEffect(() => {
    const element = canvas.current;
    const surface = { canvas: element, width: 0, height: 0, visible: false };
    film.surfaces.add(surface);
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      surface.width = width;
      surface.height = height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.max(1, Math.round(width * ratio));
      element.height = Math.max(1, Math.round(height * ratio));
      film.draw();
    });
    const visibility = new IntersectionObserver(
      ([entry]) => {
        surface.visible = entry.isIntersecting;
        if (surface.visible) film.draw();
      },
      { rootMargin: "100px" }
    );
    resize.observe(element);
    visibility.observe(element);
    return () => {
      resize.disconnect();
      visibility.disconnect();
      film.surfaces.delete(surface);
    };
  }, [film]);
  return (
    <div className="neue-video" aria-hidden="true">
      <img className="neue-video-poster" src="/images/homepage.jpg" alt="" />
      <canvas className="neue-video-frame" ref={canvas} />
    </div>
  );
}
