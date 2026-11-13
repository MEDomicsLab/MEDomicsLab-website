import { useEffect, useRef, useState } from "react";
import homeData from "../../data/home.json";
import WavyFrame from "../../components/WavyFrame/WavyFrame.jsx";

const WIDTH = 1500;
const HEIGHT = 1000;
const FONT = '"PPnMTL"';
const PHOTO = "/images/homepage-neue/postcard-team.webp";
const TILT_DEGREES = 1;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

function cover(ctx, image) {
  const ratio = Math.max(WIDTH / image.width, HEIGHT / image.height) * 1.18;
  const w = image.width * ratio;
  const h = image.height * ratio;
  const x = Math.min(0, Math.max(WIDTH - w, WIDTH / 2 - 0.48 * w));
  const y = Math.min(0, Math.max(HEIGHT - h, 560 - 0.52 * h));
  ctx.drawImage(image, x, y, w, h);
}

function grain(ctx, strength) {
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 120000; i += 1) {
    ctx.fillStyle =
      random() > 0.5 ? `rgba(255,255,255,${0.11 * strength})` : `rgba(30,25,15,${0.08 * strength})`;
    const size = random() * 2.5 + 0.5;
    ctx.fillRect(random() * WIDTH, random() * HEIGHT, size, size);
  }
}

function drawLines(ctx, text, x, y, maxWidth, lineHeight) {
  let line = "";
  for (const word of text.split(" ")) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else line = next;
  }
  ctx.fillText(line, x, y);
}

function paint(canvas, draw, grainStrength = 1) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, WIDTH, HEIGHT, 24);
  ctx.clip();
  draw(ctx);
  grain(ctx, grainStrength);
  ctx.restore();
  return ctx;
}

function drawFront(ctx, photo, whiteLogo) {
  ctx.fillStyle = "#596e64";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  cover(ctx, photo);
  const gradient = ctx.createLinearGradient(0, 0, 0, 470);
  gradient.addColorStop(0, "rgba(0,0,0,.62)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#f0e7d4";
  ctx.font = `400 76px ${FONT}`;
  ctx.fillText("Welcome", 55, 105);
  ctx.fillText("to", 55, 180);
  ctx.font = `400 92px ${FONT}`;
  ctx.fillText(homeData.brand.name, 440, 125);
  ctx.fillRect(440 + ctx.measureText(homeData.brand.name).width + 34, 47, 2, 142);
  ctx.drawImage(whiteLogo, 1235, 44, 155, 150);
  ctx.fillStyle = "rgba(0,0,0,.38)";
  ctx.fillRect(0, 908, WIDTH, 92);
  ctx.fillStyle = "#f0e7d4";
  ctx.font = `400 27px ${FONT}`;
  ctx.fillText("A shared vision for precision medicine.", 55, 962);
  ctx.textAlign = "right";
  ctx.fillText("Montréal, Canada", WIDTH - 55, 962);
}

function drawBack(ctx, mission, whiteLogo, bluePaper, paperGrain) {
  ctx.fillStyle = "#f0e7d4";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "#25251f";
  ctx.font = `400 28px ${FONT}`;
  ctx.fillText("Cedars Cancer Centre · Montréal, QC", 58, 80);
  ctx.save();
  ctx.beginPath();
  ctx.rect(1190, 55, 235, 260);
  ctx.clip();
  const ratio = Math.max(235 / bluePaper.width, 260 / bluePaper.height);
  ctx.drawImage(
    bluePaper,
    1190 + (235 - bluePaper.width * ratio) / 2,
    55,
    bluePaper.width * ratio,
    bluePaper.height * ratio
  );
  ctx.fillStyle = "rgba(0,61,165,0.48)";
  ctx.fillRect(1190, 55, 235, 260);
  ctx.globalCompositeOperation = "soft-light";
  ctx.drawImage(paperGrain, 1190, 55, 235, 260);
  ctx.restore();
  ctx.strokeStyle = "#1a1a1a";
  ctx.setLineDash([3, 8]);
  ctx.lineWidth = 2;
  ctx.strokeRect(1177, 42, 261, 286);
  ctx.setLineDash([]);
  ctx.drawImage(whiteLogo, 1220, 104, 175, 170);
  ctx.fillStyle = "#ffffff";
  ctx.font = `400 21px ${FONT}`;
  ctx.fillText(homeData.brand.name, 1210, 85);
  ctx.fillStyle = "#1a1a1a";
  ctx.font = `400 34px ${FONT}`;
  ctx.fillText("Our mission", 60, 290);
  ctx.font = `400 66px ${FONT}`;
  drawLines(ctx, mission, 60, 405, 1260, 75);
  ctx.strokeStyle = "#989386";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(58, 904);
  ctx.lineTo(1442, 904);
  ctx.stroke();
  ctx.font = `400 26px ${FONT}`;
  ctx.fillText(homeData.brand.name, 58, 958);
  ctx.textAlign = "center";
  ctx.fillText("Precision medicine", 750, 958);
}

function rollingFooter(ctx) {
  const words = ["Open science", "Open source"];
  const paper = ctx.getImageData(1120, 922, 325, 58);
  let lastFrame = "";
  return (elapsed) => {
    const wordIndex = Math.floor(elapsed / 3000) % words.length;
    const transition = Math.max(0, ((elapsed % 3000) - 2350) / 650);
    const frameKey = transition === 0 ? `${wordIndex}` : `${elapsed}`;
    if (frameKey === lastFrame) return;
    lastFrame = frameKey;
    ctx.putImageData(paper, 1120, 922);
    ctx.save();
    ctx.beginPath();
    ctx.rect(1120, 922, 325, 58);
    ctx.clip();
    ctx.fillStyle = "#1a1a1a";
    ctx.font = `400 26px ${FONT}`;
    ctx.textAlign = "left";
    const drawWord = (word, incoming) => {
      let x = 1442 - ctx.measureText(word).width;
      [...word].forEach((letter, index) => {
        const progress = Math.min(1, Math.max(0, (transition - index * 0.025) / 0.7));
        const eased = 1 - (1 - progress) ** 3;
        const scale = incoming ? Math.sin((eased * Math.PI) / 2) : Math.cos((eased * Math.PI) / 2);
        ctx.save();
        ctx.translate(x, 958 + (incoming ? 25 * (1 - eased) : -25 * eased));
        ctx.scale(1, scale);
        ctx.globalAlpha = scale;
        ctx.fillText(letter, 0, 0);
        ctx.restore();
        x += ctx.measureText(letter).width;
      });
    };
    drawWord(words[wordIndex], false);
    if (transition > 0) drawWord(words[(wordIndex + 1) % words.length], true);
    ctx.restore();
  };
}

function PostcardSide({ children, label, motion, wavy = false }) {
  const tilt = useRef(null);
  const move = (event) => {
    if (!motion.current || event.pointerType === "touch") return;
    const rect = tilt.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.current.style.transform = `perspective(500px) rotateX(${(y * 2 * TILT_DEGREES).toFixed(3)}deg) rotateY(${(-x * 2 * TILT_DEGREES).toFixed(3)}deg)`;
  };
  const reset = () => {
    tilt.current.style.transform = "";
  };
  const Surface = wavy ? WavyFrame : "div";
  return (
    <div
      ref={tilt}
      className="neue-postcard-side"
      role="img"
      aria-label={label}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      <Surface className="neue-postcard-surface">{children}</Surface>
    </div>
  );
}

export default function LabPostcard({ paused, mission }) {
  const front = useRef(null);
  const back = useRef(null);
  const motion = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const update = () => {
      motion.current = !paused && !reducedMotion.matches;
    };
    update();
    reducedMotion.addEventListener("change", update);
    return () => reducedMotion.removeEventListener("change", update);
  }, [paused]);

  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let observer;

    async function setup() {
      await document.fonts.load(`400 60px ${FONT}`);
      const [photo, whiteLogo, bluePaper, paperGrain] = await Promise.all([
        loadImage(PHOTO),
        loadImage(homeData.brand.lightLogoUrl),
        loadImage("/images/homepage-neue/branding-blue-texture.png"),
        loadImage("/images/homepage-neue/paper-texture.webp"),
      ]);
      if (cancelled) return;
      paint(front.current, (ctx) => drawFront(ctx, photo, whiteLogo), 0.3);
      const backContext = paint(back.current, (ctx) =>
        drawBack(ctx, mission, whiteLogo, bluePaper, paperGrain)
      );
      const drawFooter = rollingFooter(backContext);
      drawFooter(0);
      setReady(true);

      let elapsed = 0;
      let previous = null;
      const tick = (time) => {
        if (previous !== null && motion.current) elapsed += Math.min(time - previous, 100);
        previous = time;
        drawFooter(elapsed);
        frame = requestAnimationFrame(tick);
      };
      observer = new IntersectionObserver(([entry]) => {
        cancelAnimationFrame(frame);
        previous = null;
        if (entry.isIntersecting) frame = requestAnimationFrame(tick);
      });
      observer.observe(back.current);
    }
    setup().catch(() => {});
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [mission]);

  return (
    <div className={`neue-postcard ${ready ? "is-ready" : ""}`}>
      <PostcardSide
        motion={motion}
        label={`Postcard: Welcome to ${homeData.brand.name}, with the team in matching hoodies holding Québec flags.`}
      >
        <canvas ref={front} width={WIDTH} height={HEIGHT} />
      </PostcardSide>
      <PostcardSide
        motion={motion}
        wavy
        label={`Back of the postcard. Our mission: ${mission} Open science. Open source.`}
      >
        <canvas ref={back} width={WIDTH} height={HEIGHT} />
      </PostcardSide>
    </div>
  );
}
