import {
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const origin = new Vector3();
const HEIGHT = 6.8;
const RATIO = 0.8;
const WIDTH = HEIGHT * RATIO;
const SEAM = 0.46;
// Distance from the ring's centre to the camera, behind it, as a share of the radius.
const PULL = 0.55;
const NEIGHBOUR_LIGHT = 0.36;
const NEIGHBOUR_SCALE = 0.84;

export function mountRing({ section, stage, viewport, safeArea, slots, count, onSelect }) {
  const renderer = new WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  viewport.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(40, 1, 0.1, 100);
  const loader = new TextureLoader();
  const tint = new Color();
  let disposed = false;
  let frame = 0;
  let visible = false;
  let position = 0;
  let last = 0;
  let active = -1;
  // Redraw on scroll, resize or texture load.
  let dirty = true;
  const step = (2 * Math.PI) / slots.length;
  const radius = (WIDTH + SEAM) / (2 * Math.sin(step / 2));
  const ahead = new Vector3();

  // Share one texture across copies of each poster.
  const library = new Map();
  const share = (source, material) => {
    let entry = library.get(source);
    if (!entry) {
      entry = { materials: [] };
      entry.texture = loader.load(source, (loaded) => {
        if (disposed) return;
        loaded.colorSpace = SRGBColorSpace;
        loaded.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        entry.materials.forEach((shared) => {
          shared.map = loaded;
          shared.opacity = 1;
          shared.needsUpdate = true;
        });
        dirty = true;
      });
      library.set(source, entry);
    }
    entry.materials.push(material);
  };

  const planes = slots.map(({ ring, source, website }) => {
    const geometry = new PlaneGeometry(WIDTH, HEIGHT, 20, 20);
    geometry.computeBoundingSphere();
    // Allow for the maximum bend before testing clicks against the poster.
    geometry.boundingSphere.radius += 0.6;
    const flat = geometry.attributes.position.array.slice();
    const material = new MeshBasicMaterial({ transparent: true, opacity: 0, side: DoubleSide });
    const mesh = new Mesh(geometry, material);
    mesh.userData.website = website;
    const angle = -ring * step;
    mesh.position.set(radius * Math.sin(angle), 0, radius * Math.cos(angle));
    mesh.lookAt(origin);
    scene.add(mesh);
    share(source, material);
    return { mesh, material, geometry, flat, angle };
  });

  const canvas = renderer.domElement;
  const ray = new Raycaster();
  const pointer = new Vector2();
  const posters = planes.map(({ mesh }) => mesh);
  function posterAt(event) {
    const { left, top, width, height } = canvas.getBoundingClientRect();
    if (!width || !height) return undefined;
    pointer.set(((event.clientX - left) / width) * 2 - 1, 1 - ((event.clientY - top) / height) * 2);
    ray.setFromCamera(pointer, camera);
    return ray.intersectObjects(posters, false).find(({ object }) => object.material.opacity > 0)
      ?.object.userData.website;
  }
  const showCursor = (event) => {
    canvas.style.cursor = posterAt(event) ? "pointer" : "";
  };
  const openPoster = (event) => {
    if (event.button !== 0 && event.button !== 1) return;
    const website = posterAt(event);
    if (website) window.open(website, "_blank", "noopener,noreferrer");
  };
  canvas.addEventListener("pointermove", showCursor);
  canvas.addEventListener("click", openPoster);
  canvas.addEventListener("auxclick", openPoster);

  let width = 1;
  let height = 1;
  // Frame the posters between the header and caption.
  const resize = () => {
    width = viewport.clientWidth;
    height = viewport.clientHeight;
    const stageBox = viewport.getBoundingClientRect();
    const safeBox = safeArea.getBoundingClientRect();
    const safeHeight = Math.max(1, safeBox.height);
    const shift = height / 2 - (safeBox.top - stageBox.top + safeHeight / 2);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    // Fit the poster inside the safe area.
    const narrow = width < 700;
    const focal = radius * (1 + PULL);
    const fillHeight = ((narrow ? 0.84 : 0.92) * safeHeight) / height;
    const fillWidth = narrow ? 0.72 : 0.56;
    const tanHalf = Math.max(
      HEIGHT / 2 / focal / fillHeight,
      WIDTH / 2 / focal / (fillWidth * camera.aspect)
    );
    camera.fov = (2 * Math.atan(tanHalf) * 180) / Math.PI;
    camera.setViewOffset(width, height, 0, shift, width, height);
    dirty = true;
  };
  const sizes = new ResizeObserver(resize);
  sizes.observe(viewport);
  resize();

  const targetPosition = () => {
    const travel = section.offsetHeight - stage.offsetHeight;
    return clamp(-section.getBoundingClientRect().top / Math.max(1, travel), 0, 1) * (count - 1);
  };
  position = targetPosition();

  const draw = (time) => {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = last ? Math.min((time - last) / 1000, 0.05) : 1 / 60;
    last = time;
    const target = targetPosition();
    if (!dirty && target === position) {
      frame = requestAnimationFrame(draw);
      return;
    }
    dirty = false;
    const old = position;
    position += (target - position) * (1 - Math.exp(-10 * dt));
    if (Math.abs(target - position) < 0.0001) position = target;
    const speed = (position - old) / Math.max(dt, 0.001);
    const heading = -position * step;
    ahead.set(Math.sin(heading), 0, Math.cos(heading));
    camera.position.copy(ahead).multiplyScalar(-radius * PULL);
    camera.lookAt(ahead.x * radius, 0, ahead.z * radius);
    const next = Math.round(position);
    if (next !== active) {
      active = next;
      onSelect(active);
    }
    const bend = clamp(speed, -5, 5);
    planes.forEach(({ mesh, geometry, flat, material, angle }) => {
      const offset = Math.min(1, Math.abs(angle - heading) / step);
      mesh.scale.setScalar(1 - (1 - NEIGHBOUR_SCALE) * offset);
      const vertices = geometry.attributes.position;
      for (let i = 0; i < vertices.count; i++) {
        const x = flat[i * 3];
        const y = flat[i * 3 + 1];
        const bow = Math.sin((y / HEIGHT + 0.5) * Math.PI);
        vertices.setXYZ(i, x + bow * bend * 0.11, y, bow * bend * 0.05);
      }
      vertices.needsUpdate = true;
      // Dim each poster by its angular distance from the one in focus.
      const light = 1 - (1 - NEIGHBOUR_LIGHT) * offset;
      tint.setRGB(light, light, light, SRGBColorSpace);
      material.color.copy(tint);
    });
    renderer.render(scene, camera);
    frame = requestAnimationFrame(draw);
  };

  const start = () => {
    last = 0;
    dirty = true;
    if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw);
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "100px" }
  );
  observer.observe(stage);
  document.addEventListener("visibilitychange", start);

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      document.removeEventListener("visibilitychange", start);
      canvas.removeEventListener("pointermove", showCursor);
      canvas.removeEventListener("click", openPoster);
      canvas.removeEventListener("auxclick", openPoster);
      planes.forEach(({ geometry, material }) => {
        geometry.dispose();
        material.dispose();
      });
      library.forEach(({ texture }) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
