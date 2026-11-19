import { stage } from "../shared/canvas.js";
import { withPlate } from "../shared/texture.js";
import plate from "./aurore.webp";

// The sky shoots in once, as the landscape banners do: thin rows sweep in from the left, each a little ahead of or
// behind its neighbours, over SWEEP_S the first time the banner is on screen.
const SWEEP_S = 0.8;
const ROW_PX = 2.5;

// The sky refracts through two slow wave fields. Their influence falls to zero
// at the spruce line. The lake uses a separate, much shorter ripple wavelength.
const vertex = `attribute vec2 xy;varying vec2 uv;
void main(){uv=vec2(xy.x*.5+.5,.5-xy.y*.5);gl_Position=vec4(xy,0.,1.);}`;
const fragment = `precision highp float;
varying vec2 uv;
uniform sampler2D plate;
uniform vec2 crop,origin,hand;
uniform float clock,attention,head,rows;
void main(){
 vec2 p=origin+uv*crop;
 vec3 source=texture2D(plate,p).rgb;
 float veil=(1.-smoothstep(.66,.82,p.y))*smoothstep(.06,.38,max(source.g,source.b));
 vec2 delta=(p-hand)*vec2(2.4,1.);
 float brush=exp(-dot(delta,delta)*29.)*attention;
 float slow=sin(p.x*15.-clock*.26+p.y*2.8)+.45*sin(p.x*28.+clock*.19);
 p.x+=veil*(.0025*sin(clock*.27+p.y*12.)+.005*brush)*sin(3.14159*p.x);
 p.y+=veil*(.011*slow-.037*brush)*sin(3.14159*p.y);
 float water=smoothstep(.865,.92,p.y);
 p.x+=water*.0014*sin(p.y*430.+clock*1.09);
 vec3 ink=texture2D(plate,p).rgb;
 ink*=1.+veil*(.12*sin(p.x*21.-clock*.65)+brush*.55);
 ink+=vec3(.016,.064,.061)*brush*veil;
 float dice=fract(sin(floor(uv.y*rows)*12.9898)*43758.5453);
 float front=head*1.3-dice*.3;
 float shown=1.-smoothstep(front-.025,front,uv.x);
 ink+=vec3(.35,.45,.5)*smoothstep(front-.09,front,uv.x)*shown*(1.-head);
 gl_FragColor=vec4(ink*shown,shown);
}`;

function aurora(host, context, image, onView) {
  let program,
    buffer,
    texture,
    shaders = [],
    uniform = {},
    gl,
    tx = 0.4,
    ty = 0.5,
    attention = 0;
  let cropX = 1,
    cropY = 1,
    originX = 0,
    originY = 0;
  const stop = stage(host, {
    context: "webgl",
    still: context.reducedMotion,
    maxPixels: 1.75,
    layout({ ctx, width, height }) {
      if (width && height) {
        const ratio = width / height;
        cropX = Math.min(1, ratio / 3);
        cropY = Math.min(1, 3.85 / ratio);
        originX = (1 - cropX) * 0.37;
        originY = (1 - cropY) * 0.86;
        onView?.({ cropX, cropY, originX, originY });
      }
      if (!ctx || program) return;
      gl = ctx;
      program = gl.createProgram();
      for (const [type, source] of [
        [gl.VERTEX_SHADER, vertex],
        [gl.FRAGMENT_SHADER, fragment],
      ]) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        gl.attachShader(program, s);
        shaders.push(s);
      }
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      // The still under the canvas waits until the sweep has drawn the sky over it.
      if (!context.reducedMotion) host.dataset.sweeping = "";
      gl.useProgram(program);
      for (const name of ["plate", "crop", "origin", "hand", "clock", "attention", "head", "rows"])
        uniform[name] = gl.getUniformLocation(program, name);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );
      const pos = gl.getAttribLocation(program, "xy");
      gl.enableVertexAttribArray(pos);
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
      texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    },
    draw({ width, height, canvas, time, pointer }) {
      if (!texture || !width || !height) return;
      tx += (originX + (cropX * pointer.x) / width - tx) * 0.08;
      ty += (originY + (cropY * pointer.y) / height - ty) * 0.08;
      attention += ((pointer.inside ? 1 : 0) - attention) * 0.07;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uniform.crop, cropX, cropY);
      gl.uniform2f(uniform.origin, originX, originY);
      gl.uniform2f(uniform.hand, tx, ty);
      gl.uniform1f(uniform.clock, time);
      gl.uniform1f(uniform.attention, attention);
      const head = context.reducedMotion ? 1 : Math.min(1, time / SWEEP_S);
      if (head >= 1) delete host.dataset.sweeping;
      gl.uniform1f(uniform.head, head);
      gl.uniform1f(uniform.rows, height / ROW_PX);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
  });
  return () => {
    stop();
    delete host.dataset.sweeping;
    if (gl) {
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
      gl.deleteProgram(program);
      for (const s of shaders) gl.deleteShader(s);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  };
}
export function mountSky(host, context, onView) {
  return withPlate(plate, (image) => aurora(host, context, image, onView));
}
