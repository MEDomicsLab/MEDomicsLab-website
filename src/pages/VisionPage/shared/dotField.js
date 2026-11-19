// The SVG pattern is the fallback for the WebGL dot field.

const VERTEX = `
attribute vec2 aPlace;
attribute vec3 aDot;
uniform vec4 uView;
uniform vec2 uCanvas;
uniform float uPixels;
uniform float uClock;
uniform float uFlow;
uniform vec3 uPointer;
uniform float uReach;
uniform float uHead;
uniform vec3 uWeight;
uniform float uRadius;
varying float vAlpha;
varying float vSize;

float has(float bits, float bit) {
  return mod(floor(bits / bit + 0.001), 2.0);
}

void main() {
  vec2 place = aPlace * uView.xy + uView.zw;

  /* a current of light runs through the grid from the left, bending gently as it goes */
  float bend = sin(place.y * 0.011 + uClock * 0.31) * 24.0;
  float wave = 0.5 + 0.5 * sin((place.x + bend) * 0.016 - uClock * 0.8);
  float band = wave * wave * wave * uFlow;
  float breath = sin(place.x * 0.0045 - place.y * 0.006 + uClock * 0.27) * uFlow;
  float swell = (1.0 + band * 0.62 - 0.16 * uFlow) * (1.0 + breath * 0.07);

  /* the pointer is a lens: dots within reach swell and part, never past the edge of their shape */
  vec2 away = place - uPointer.xy;
  float near = exp(-dot(away, away) / (uReach * uReach)) * uPointer.z;
  vec2 push = away * near * 0.42;
  float room = aDot.y * uView.x;
  push *= min(1.0, room / max(length(push), 0.0001));
  place += push;
  swell *= 1.0 + near * 0.5;

  /* where shapes overlap their dots add up; under the words they all but disappear */
  float alpha = 1.0 - (1.0 - has(aDot.x, 1.0) * uWeight.x)
    * (1.0 - has(aDot.x, 2.0) * uWeight.y)
    * (1.0 - has(aDot.x, 4.0) * uWeight.z);
  alpha *= (1.0 + band * 0.55 - 0.12 * uFlow) * (1.0 - 0.86 * aDot.z);

  /* on the way in the dots arrive from the left, as the banner's lines do */
  float front = uHead * (uCanvas.x + 260.0) - 130.0;
  alpha *= 1.0 - smoothstep(front - 130.0, front, place.x);

  vAlpha = clamp(alpha, 0.0, 1.0);
  vSize = 2.0 * uRadius * swell * uPixels + 1.0;
  gl_PointSize = vSize;
  gl_Position = vec4(place.x / uCanvas.x * 2.0 - 1.0, 1.0 - place.y / uCanvas.y * 2.0, 0.0, 1.0);
}`;

const FRAGMENT = `
precision mediump float;
uniform vec3 uColor;
varying float vAlpha;
varying float vSize;

void main() {
  float distance = length(gl_PointCoord - 0.5) * vSize;
  float edge = vSize * 0.5 - 0.5;
  float cover = (1.0 - smoothstep(edge - 0.6, edge + 0.4, distance)) * vAlpha;
  gl_FragColor = vec4(uColor * cover, cover);
}`;

const PAPER = [240 / 255, 231 / 255, 212 / 255];
// The closest two dots may sit on screen, and each dot's radius, in CSS pixels.
const PITCH = 7;
const RADIUS = 0.82;
const ENTRANCE = 1700;

function program(gl) {
  const compile = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };
  const vertex = compile(gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT);
  if (!vertex || !fragment) return null;
  const linked = gl.createProgram();
  gl.attachShader(linked, vertex);
  gl.attachShader(linked, fragment);
  gl.linkProgram(linked);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  return gl.getProgramParameter(linked, gl.LINK_STATUS) ? linked : null;
}

// How far a point lies inside a circle or a rounded rectangle, negative outside.
function depth(shape, x, y) {
  if (shape.circle) {
    const [cx, cy, r] = shape.circle;
    return r - Math.hypot(x - cx, y - cy);
  }
  const [left, top, width, height, round] = shape.rect;
  const qx = Math.abs(x - left - width / 2) - (width / 2 - round);
  const qy = Math.abs(y - top - height / 2) - (height / 2 - round);
  return round - Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) - Math.min(Math.max(qx, qy), 0);
}

function bounds(shape) {
  if (shape.circle) {
    const [cx, cy, r] = shape.circle;
    return [cx - r, cy - r, cx + r, cy + r];
  }
  const [left, top, width, height] = shape.rect;
  return [left, top, left + width, top + height];
}

// Measure visible labels in SVG coordinates.
function measure(nodes) {
  const boxes = [];
  for (const node of nodes) {
    try {
      const box =
        node.ownerSVGElement && node.tagName === "svg"
          ? {
              x: node.x.baseVal.value,
              y: node.y.baseVal.value,
              width: node.width.baseVal.value,
              height: node.height.baseVal.value,
            }
          : node.getBBox();
      if (box.width > 0 && box.height > 0) boxes.push([box.x, box.y, box.width, box.height]);
    } catch {
      // not rendered in this layout
    }
  }
  return boxes;
}

// Keep the moving dots aligned with the SVG pattern.
function lay({ shapes, words, base, pitch, inset, pad, fade }) {
  const edges = shapes.map(bounds);
  const left = Math.min(...edges.map((edge) => edge[0]));
  const top = Math.min(...edges.map((edge) => edge[1]));
  const right = Math.max(...edges.map((edge) => edge[2]));
  const bottom = Math.max(...edges.map((edge) => edge[3]));
  const first = (from) => base / 2 + Math.ceil((from - base / 2) / pitch) * pitch;
  const x0 = first(left);
  const y0 = first(top);
  const data = [];
  for (let row = 0; y0 + row * pitch <= bottom; row += 1) {
    const y = y0 + row * pitch;
    for (let column = 0; x0 + column * pitch <= right; column += 1) {
      const x = x0 + column * pitch;
      let bits = 0;
      let room = 0;
      for (const shape of shapes) {
        const inside = depth(shape, x, y) - inset;
        if (inside >= 0) {
          bits |= shape.bit;
          room = Math.max(room, inside);
        }
      }
      if (!bits) continue;
      // Clear a soft capsule around each label.
      let clear = 0;
      for (const [bx, by, bw, bh] of words) {
        const r = bh / 2;
        const along = Math.min(
          Math.max(x, bx + Math.min(r, bw / 2)),
          bx + bw - Math.min(r, bw / 2)
        );
        const away = Math.hypot(x - along, y - by - r) - r - pad;
        const t = Math.min(1, Math.max(0, away / fade));
        clear = Math.max(clear, 1 - t * t * (3 - 2 * t));
        if (clear === 1) break;
      }
      data.push(x, y, bits, room, clear);
    }
  }
  return new Float32Array(data);
}

export function mountDotField({ stage, art, shapes, words, base, inset, reach, weights, still }) {
  const canvas = stage.querySelector(".dot-canvas");
  const gl = canvas?.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  const linked = gl && program(gl);
  if (!linked) return null;

  const buffer = gl.createBuffer();
  const uniform = (name) => gl.getUniformLocation(linked, name);
  const u = {
    view: uniform("uView"),
    canvas: uniform("uCanvas"),
    pixels: uniform("uPixels"),
    clock: uniform("uClock"),
    flow: uniform("uFlow"),
    pointer: uniform("uPointer"),
    reach: uniform("uReach"),
    head: uniform("uHead"),
    weight: uniform("uWeight"),
    radius: uniform("uRadius"),
    color: uniform("uColor"),
  };
  const aPlace = gl.getAttribLocation(linked, "aPlace");
  const aDot = gl.getAttribLocation(linked, "aDot");

  let alive = true;
  let count = 0;
  let width = 0;
  let height = 0;
  let pixels = 1;
  let view = [1, 1, 0, 0];
  let weight = [...weights];
  let target = [...weights];
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, inside: false, strength: 0 };
  let clock = 0;
  let head = still ? 1 : 0;
  let started = still;
  let first = true;
  let visible = false;
  let frame = 0;
  let pending = 0;
  let last = 0;

  const layout = () => {
    const svg = art(stage);
    if (!svg) return;
    const box = svg.viewBox.baseVal;
    width = stage.clientWidth;
    height = stage.clientHeight;
    if (!width || !height || !box?.width) return;
    pixels = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(width * pixels);
    canvas.height = Math.round(height * pixels);
    const scale = width / box.width;
    view = [scale, scale, -box.x * scale, -box.y * scale];
    const pitch = base * Math.max(1, Math.round(PITCH / (base * scale)));
    const data = lay({
      shapes: shapes(svg),
      words: measure(words(svg)),
      base,
      pitch,
      inset,
      pad: 3 / scale,
      fade: 15 / scale,
    });
    count = data.length / 5;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  };

  const draw = () => {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!count) return;
    const eased = 1 - (1 - head) ** 3;
    gl.useProgram(linked);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPlace);
    gl.vertexAttribPointer(aPlace, 2, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(aDot);
    gl.vertexAttribPointer(aDot, 3, gl.FLOAT, false, 20, 8);
    gl.uniform4fv(u.view, view);
    gl.uniform2f(u.canvas, width, height);
    gl.uniform1f(u.pixels, pixels);
    gl.uniform1f(u.clock, clock);
    gl.uniform1f(u.flow, still ? 0 : 1);
    gl.uniform3f(u.pointer, pointer.x, pointer.y, pointer.strength);
    gl.uniform1f(u.reach, reach);
    gl.uniform1f(u.head, eased);
    gl.uniform3fv(u.weight, weight);
    gl.uniform1f(u.radius, RADIUS);
    gl.uniform3fv(u.color, PAPER);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.POINTS, 0, count);
  };

  const step = (now) => {
    frame = 0;
    const elapsed = last ? Math.min(64, now - last) : 1000 / 60;
    last = now;
    const sixtieths = elapsed / (1000 / 60);
    clock += elapsed / 1000;
    if (started && head < 1) head = Math.min(1, head + elapsed / ENTRANCE);
    const follow = 1 - 0.78 ** sixtieths;
    pointer.x += (pointer.tx - pointer.x) * follow;
    pointer.y += (pointer.ty - pointer.y) * follow;
    pointer.strength += ((pointer.inside ? 1 : 0) - pointer.strength) * (1 - 0.9 ** sixtieths);
    const settle = 1 - 0.84 ** sixtieths;
    weight = weight.map((value, i) => value + (target[i] - value) * settle);
    draw();
    if (visible && !document.hidden) frame = requestAnimationFrame(step);
    else last = 0;
  };

  const wake = () => {
    if (!alive) return;
    if (still) draw();
    else if (!frame && visible && !document.hidden) frame = requestAnimationFrame(step);
  };

  const refit = () => {
    pending = 0;
    if (!alive) return;
    layout();
    draw();
    wake();
  };
  const schedule = () => {
    if (!pending) pending = requestAnimationFrame(refit);
  };

  const move = (event) => {
    const box = stage.getBoundingClientRect();
    pointer.tx = event.clientX - box.left;
    pointer.ty = event.clientY - box.top;
    if (!pointer.inside && pointer.strength < 0.02) {
      pointer.x = pointer.tx;
      pointer.y = pointer.ty;
    }
    pointer.inside = true;
    wake();
  };
  const leave = () => {
    pointer.inside = false;
  };

  const seen = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!started && entry.intersectionRatio >= 0.12) {
        started = true;
        // Already on screen when the field arrived: no entrance, so nothing flickers.
        if (first) head = 1;
      }
      first = false;
      wake();
    },
    { threshold: [0, 0.12] }
  );
  const resized = new ResizeObserver(schedule);

  const release = () => {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(frame);
    cancelAnimationFrame(pending);
    seen.disconnect();
    resized.disconnect();
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerdown", move);
    stage.removeEventListener("pointerleave", leave);
    stage.removeEventListener("pointercancel", leave);
    document.removeEventListener("visibilitychange", wake);
    canvas.removeEventListener("webglcontextlost", lost);
    delete stage.dataset.dots;
    if (!gl.isContextLost()) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(linked);
    }
  };
  // A lost context hands the figure back to its SVG pattern.
  function lost(event) {
    event.preventDefault();
    release();
  }

  layout();
  stage.dataset.dots = still ? "still" : "live";
  draw();
  seen.observe(stage);
  resized.observe(stage);
  if (!still) {
    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerdown", move, { passive: true });
    stage.addEventListener("pointerleave", leave, { passive: true });
    stage.addEventListener("pointercancel", leave, { passive: true });
  }
  document.addEventListener("visibilitychange", wake);
  canvas.addEventListener("webglcontextlost", lost);
  // Labels measure differently once the web font arrives.
  document.fonts?.ready.then(schedule);

  return {
    weigh(next) {
      target = [...next];
      if (still) weight = [...next];
      wake();
    },
    release,
  };
}
