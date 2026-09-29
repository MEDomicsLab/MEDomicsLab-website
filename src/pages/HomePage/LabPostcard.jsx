import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import * as THREE from "three";
import homeData from "../../data/home.json";

const WIDTH = 1500;
const HEIGHT = 1000;
const FONT = '"Homepage Neue Montreal"';
const PHOTO = "/images/albums/2024-08-20-mall-msc/team.jpg";
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

function cover(ctx, image) {
  const ratio = Math.max(WIDTH / image.width, HEIGHT / image.height);
  const w = image.width * ratio;
  const h = image.height * ratio;
  ctx.drawImage(image, (WIDTH - w) / 2, (HEIGHT - h) / 2 + 45, w, h);
}

function grain(ctx) {
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < 120000; i += 1) {
    ctx.fillStyle = random() > 0.5 ? "rgba(255,255,255,0.11)" : "rgba(30,25,15,0.08)";
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

function texture(draw) {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.roundRect(0, 0, WIDTH, HEIGHT, 24);
  ctx.clip();
  draw(ctx);
  grain(ctx);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  return map;
}

export default function LabPostcard({ paused, mission }) {
  const host = useRef(null);
  const controls = useRef({ flip: false, paused, visible: false, pointer: { x: 0, y: 0 } });
  const [flipped, setFlipped] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    controls.current.paused = paused;
  }, [paused]);

  useEffect(() => {
    let cancelled = false;
    let dispose = () => {};
    const element = host.current;
    const observer = new IntersectionObserver(([entry]) => {
      controls.current.visible = entry.isIntersecting;
    });
    observer.observe(element);

    async function setup() {
      await document.fonts.load(`400 60px ${FONT}`);
      const [photo, whiteLogo, bluePaper, paperGrain] = await Promise.all([
        loadImage(PHOTO),
        loadImage(homeData.brand.lightLogoUrl),
        loadImage("/images/homepage-neue/branding-blue-texture.png"),
        loadImage("/images/homepage-neue/paper-texture.webp"),
      ]);
      if (cancelled) return;
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }
      const front = texture((ctx) => {
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
      });
      const back = texture((ctx) => {
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
        ctx.filter = "grayscale(1) contrast(1.4)";
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
      });
      const backContext = back.image.getContext("2d");
      const footerPaper = backContext.getImageData(1120, 922, 325, 58);
      const words = ["Open science", "Open source"];
      let rollingTime = 0;
      let previousFrame = null;
      let lastRollFrame = "";
      const drawRollingFooter = (elapsed) => {
        const wordIndex = Math.floor(elapsed / 3000) % words.length;
        const transition = Math.max(0, ((elapsed % 3000) - 2350) / 650);
        const frameKey = transition === 0 ? `${wordIndex}` : `${elapsed}`;
        if (frameKey === lastRollFrame) return;
        lastRollFrame = frameKey;
        backContext.putImageData(footerPaper, 1120, 922);
        backContext.save();
        backContext.beginPath();
        backContext.rect(1120, 922, 325, 58);
        backContext.clip();
        backContext.fillStyle = "#1a1a1a";
        backContext.font = `400 26px ${FONT}`;
        backContext.textAlign = "left";
        const drawWord = (word, incoming) => {
          let x = 1442 - backContext.measureText(word).width;
          [...word].forEach((letter, index) => {
            const progress = Math.min(1, Math.max(0, (transition - index * 0.025) / 0.7));
            const eased = 1 - (1 - progress) ** 3;
            const scale = incoming
              ? Math.sin((eased * Math.PI) / 2)
              : Math.cos((eased * Math.PI) / 2);
            backContext.save();
            backContext.translate(x, 958 + (incoming ? 25 * (1 - eased) : -25 * eased));
            backContext.scale(1, scale);
            backContext.globalAlpha = scale;
            backContext.fillText(letter, 0, 0);
            backContext.restore();
            x += backContext.measureText(letter).width;
          });
        };
        drawWord(words[wordIndex], false);
        if (transition > 0) drawWord(words[(wordIndex + 1) % words.length], true);
        backContext.restore();
        back.needsUpdate = true;
      };
      drawRollingFooter(0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setClearColor(0x1a1a1a, 0);
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
      camera.position.z = 7.3;
      const group = new THREE.Group();
      const geometry = new THREE.PlaneGeometry(4.8, 3.2);
      const frontMaterial = new THREE.MeshBasicMaterial({ map: front, transparent: true });
      const backMaterial = new THREE.MeshBasicMaterial({ map: back, transparent: true });
      const frontMesh = new THREE.Mesh(geometry, frontMaterial);
      const backMesh = new THREE.Mesh(geometry, backMaterial);
      frontMesh.position.z = 0.006;
      backMesh.position.z = -0.006;
      backMesh.rotation.y = Math.PI;
      group.add(frontMesh, backMesh);
      scene.add(group);
      const resize = new ResizeObserver(() => {
        const { width, height } = element.getBoundingClientRect();
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.position.z = Math.max(7.3, 8.4 / camera.aspect);
        camera.updateProjectionMatrix();
      });
      resize.observe(element);
      const pointerMove = (event) => {
        const rect = element.getBoundingClientRect();
        controls.current.pointer = {
          x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
        };
      };
      const pointerLeave = () => {
        controls.current.pointer = { x: 0, y: 0 };
      };
      element.addEventListener("pointermove", pointerMove);
      element.addEventListener("pointerleave", pointerLeave);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      renderer.setAnimationLoop((time) => {
        const state = controls.current;
        const delta = previousFrame === null ? 0 : Math.min(time - previousFrame, 100);
        previousFrame = time;
        if (!state.visible || document.hidden) return;
        const motion = !state.paused && !reducedMotion.matches;
        if (motion) rollingTime += delta;
        if (state.flip) drawRollingFooter(rollingTime);
        const float = motion ? Math.sin(time * 0.00065) * 0.06 : 0;
        const x = motion ? -state.pointer.y * 0.08 + float : 0;
        const y = (state.flip ? Math.PI : 0) + (motion ? state.pointer.x * 0.12 : 0);
        const ease = reducedMotion.matches ? 1 : 0.075;
        group.rotation.x += (x - group.rotation.x) * ease;
        group.rotation.y += (y - group.rotation.y) * ease;
        group.rotation.z = motion ? Math.sin(time * 0.0004) * 0.025 : 0;
        group.position.y = float;
        renderer.render(scene, camera);
      });
      setReady(true);
      dispose = () => {
        renderer.setAnimationLoop(null);
        resize.disconnect();
        element.removeEventListener("pointermove", pointerMove);
        element.removeEventListener("pointerleave", pointerLeave);
        geometry.dispose();
        frontMaterial.dispose();
        backMaterial.dispose();
        front.dispose();
        back.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }
    setup().catch(() => {});
    return () => {
      cancelled = true;
      observer.disconnect();
      dispose();
    };
  }, [mission]);

  const flip = () => {
    controls.current.flip = !controls.current.flip;
    setFlipped(controls.current.flip);
  };
  return (
    <div className="neue-postcard-wrap">
      <button
        className={`neue-postcard ${ready ? "is-ready" : ""}`}
        ref={host}
        onClick={flip}
        aria-label={
          flipped ? "Turn postcard to the team photograph" : "Turn postcard to read our mission"
        }
        aria-pressed={flipped}
      >
        <span className="neue-postcard-fallback" aria-hidden="true">
          {flipped ? (
            <span className="neue-postcard-fallback-back">
              <span className="neue-postcard-fallback-header">
                <small>Our mission</small>
                <span className="neue-postcard-fallback-stamp blue-paper">
                  <img src={homeData.brand.lightLogoUrl} alt="" />
                </span>
              </span>
              {mission}
            </span>
          ) : (
            <>
              <img src={PHOTO} alt="" />
              <span>
                Welcome to
                <br />
                {homeData.brand.name}
              </span>
            </>
          )}
        </span>
      </button>
      <p className="neue-postcard-caption">
        <button onClick={flip}>
          <RotateCw size={15} /> Turn the postcard
        </button>
      </p>
      <p className="sr-only">{mission} Open science. Open source.</p>
    </div>
  );
}
