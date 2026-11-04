'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, RenderTarget, Texture } from 'ogl';

import './MicroSlats.css';

const SWELL_PRESETS = {
  swell: {
    scale: 1.5,
    speed: 0.6,
    direction: 250,
    chop: 0.55,
    stretch: 0,
    glint: 0.7,
    contrast: 1.25,
    perspective: 0.55,
    fog: 0.55
  },
  tide: {
    scale: 1.3,
    speed: 0.5,
    direction: 262,
    chop: 0.2,
    stretch: 0.12,
    glint: 0.45,
    contrast: 1.1,
    perspective: 0.5,
    fog: 0.4
  },
  storm: {
    scale: 0.55,
    speed: 1.6,
    direction: 236,
    chop: 1,
    stretch: 0.3,
    glint: 1.3,
    contrast: 1.8,
    perspective: 0.8,
    fog: 0.35
  },
  signal: {
    scale: 0.85,
    speed: 1.2,
    direction: 180,
    chop: 0.6,
    stretch: 0.85,
    glint: 0.25,
    contrast: 1.2,
    perspective: 0,
    fog: 0
  }
};

const FLUID_SIZE = 96;
const PRESSURE_STEPS = 16;
const SPLAT_FORCE = 6900;
const SPLASH_JETS = 3;
const PIXEL_BUDGET = 4.5e6;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseColor = (value, fallback) => {
  try {
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = '#000000';
    ctx.fillStyle = value;
    const resolved = ctx.fillStyle;
    if (resolved.startsWith('#')) {
      const n = parseInt(resolved.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
    }
    const parts = resolved.match(/[\d.]+/g);
    if (!parts || parts.length < 3) return fallback;
    return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255, parts[3] ? Number(parts[3]) : 1];
  } catch {
    return fallback;
  }
};

const passVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fluidVertex = `#version 300 es
in vec2 position;
uniform vec2 uTexel;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
void main() {
  vUv = position * 0.5 + 0.5;
  vL = vUv - vec2(uTexel.x, 0.0);
  vR = vUv + vec2(uTexel.x, 0.0);
  vT = vUv + vec2(0.0, uTexel.y);
  vB = vUv - vec2(0.0, uTexel.y);
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fluidHead = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
out vec4 fragColor;
`;

const splatFragment = `${fluidHead}
uniform sampler2D uTarget;
uniform float uAspect;
uniform vec2 uPoint;
uniform vec3 uValue;
uniform float uRadius;
void main() {
  vec2 offset = vUv - uPoint;
  offset.x *= uAspect;
  float falloff = exp(-dot(offset, offset) / uRadius);
  fragColor = vec4(texture(uTarget, vUv).xyz + uValue * falloff, 1.0);
}
`;

const curlFragment = `${fluidHead}
uniform sampler2D uVelocity;
void main() {
  float left = texture(uVelocity, vL).y;
  float right = texture(uVelocity, vR).y;
  float top = texture(uVelocity, vT).x;
  float bottom = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (right - left - top + bottom), 0.0, 0.0, 1.0);
}
`;

const vorticityFragment = `${fluidHead}
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float uSwirl;
uniform float uDt;
void main() {
  float left = texture(uCurl, vL).x;
  float right = texture(uCurl, vR).x;
  float top = texture(uCurl, vT).x;
  float bottom = texture(uCurl, vB).x;
  float middle = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(top) - abs(bottom), abs(right) - abs(left));
  force = force / (length(force) + 0.0001) * uSwirl * middle;
  force.y = -force.y;
  vec2 velocity = texture(uVelocity, vUv).xy + force * uDt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}
`;

const divergenceFragment = `${fluidHead}
uniform sampler2D uVelocity;
void main() {
  vec2 middle = texture(uVelocity, vUv).xy;
  float left = vL.x < 0.0 ? -middle.x : texture(uVelocity, vL).x;
  float right = vR.x > 1.0 ? -middle.x : texture(uVelocity, vR).x;
  float top = vT.y > 1.0 ? -middle.y : texture(uVelocity, vT).y;
  float bottom = vB.y < 0.0 ? -middle.y : texture(uVelocity, vB).y;
  fragColor = vec4(0.5 * (right - left + top - bottom), 0.0, 0.0, 1.0);
}
`;

const pressureFragment = `${fluidHead}
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((left + right + top + bottom - divergence) * 0.25, 0.0, 0.0, 1.0);
}
`;

const projectFragment = `${fluidHead}
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
void main() {
  float left = texture(uPressure, vL).x;
  float right = texture(uPressure, vR).x;
  float top = texture(uPressure, vT).x;
  float bottom = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(right - left, top - bottom);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`;

const advectFragment = `${fluidHead}
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uDt;
uniform float uFade;
void main() {
  vec2 from = vUv - uDt * texture(uVelocity, vUv).xy * uTexel;
  fragColor = texture(uSource, from) / (1.0 + uFade * uDt);
}
`;

const scaleFragment = `${fluidHead}
uniform sampler2D uSource;
uniform float uValue;
void main() {
  fragColor = texture(uSource, vUv) * uValue;
}
`;

const fieldFragment = `#version 300 es
precision highp float;
uniform vec2 uSize;
uniform vec4 uGrid;
uniform vec2 uOrigin;
uniform vec2 uSlat;
uniform float uTime;
uniform float uScale;
uniform float uDirection;
uniform float uChop;
uniform float uStretch;
uniform float uGlint;
uniform float uContrast;
uniform float uPerspective;
uniform float uFog;
uniform float uIntro;
uniform sampler2D tVelocity;
uniform sampler2D tInk;
uniform vec2 uFluidTexel;
uniform float uFluid;
uniform float uInk;
uniform float uLean;
out vec4 fragColor;

const float TURN[4] = float[4](0.0, -0.95, 0.78, 1.62);
const float LENGTH[4] = float[4](2.6, 1.7, 1.12, 0.76);
const float HEIGHT[4] = float[4](1.0, 0.75, 0.5, 0.3);
const float SHIFT[4] = float[4](0.0, 2.3, 4.1, 1.1);

void main() {
  vec2 cell = floor(gl_FragCoord.xy);
  float row = uGrid.y - 1.0 - cell.y;
  vec2 center = uOrigin + vec2(cell.x, row) * uGrid.zw + uSlat * 0.5;
  float v = clamp(center.y / uSize.y, 0.0, 1.0);

  vec2 fluidUv = center / uSize;
  vec2 velocity = texture(tVelocity, fluidUv).xy * uFluid;
  vec3 ink = texture(tInk, fluidUv).xyz * uInk;

  float persp = mix(1.0, 1.0 - v * 0.6, uPerspective);
  float fog = mix(1.0, 1.0 - v * 0.85, uFog);
  float introFade = clamp((uIntro - (1.0 - v)) * 6.0, 0.0, 1.0);

  float dir = radians(uDirection);
  float wave = 0.0;
  for (int i = 0; i < 4; i++) {
    float ang = dir + TURN[i];
    vec2 k = vec2(cos(ang), sin(ang)) / (uScale * LENGTH[float(i)]);
    float phase = dot(center * persp, k) + uTime * HEIGHT[float(i)] + SHIFT[float(i)];
    float raw = sin(phase);
    float chopped = sign(raw) * pow(abs(raw), 1.0 + uChop * 2.5);
    wave += chopped * HEIGHT[float(i)];
  }
  wave /= 2.6;

  float vel = length(velocity);
  float velWave = wave + vel * 0.4;
  float stretch = mix(1.0, clamp(0.5 + velWave * 0.5, 0.0, 1.0), uStretch);
  float lean = velocity.x * uLean * 0.012;

  vec2 local = (gl_FragCoord.xy - cell - 0.5) / uSlat - 0.5 + vec2(lean, 0.0);
  float hw = uSlat.x * 0.5 / uSlat.y;
  float r = min(hw, uSlat.x * 0.5 * 0.75 / uSlat.y);

  float slatTop = 0.5 * stretch + velWave * 0.03;
  float slatBot = -0.5 * stretch + velWave * 0.03;
  float inSlat = step(slatBot, local.y) * step(local.y, slatTop) * step(-hw, local.x) * step(local.x, hw);

  float corner = length(max(abs(local + vec2(0.0, -slatTop + r)) - vec2(hw - r, 0.0), 0.0)) - r;
  float cornerB = length(max(abs(local + vec2(0.0, -slatBot - r)) - vec2(hw - r, 0.0), 0.0)) - r;
  float roundMask = 1.0 - smoothstep(-0.5 / uSlat.y, 0.5 / uSlat.y, max(corner, cornerB));

  float glint = clamp((velWave + 1.0) * 0.5, 0.0, 1.0) * uGlint;

  fragColor = vec4(wave, stretch, glint, inSlat * roundMask * fog * introFade);
}
`;

const renderFragment = `#version 300 es
precision highp float;
uniform sampler2D tField;
uniform vec4 uColor;
uniform vec4 uGlint;
uniform vec4 uBg;
uniform float uContrast;
uniform vec3 uInkColor;
uniform sampler2D tInk;
uniform vec2 uSize;
uniform float uInk;
out vec4 fragColor;

void main() {
  vec2 uv = gl_FragCoord.xy / uSize;
  vec4 f = texture(tField, uv);
  float wave = f.x;
  float stretch = f.y;
  float glint = f.z;
  float mask = f.w;

  float bright = clamp((wave + 1.0) * 0.5 * uContrast, 0.0, 1.0);
  vec4 slatColor = mix(uColor, uGlint, glint);
  slatColor = mix(slatColor, vec4(1.0), glint * 0.3);

  vec3 inkSample = texture(tInk, uv).xyz * uInk;
  slatColor.rgb += inkSample * (1.0 - glint);

  vec4 col = mix(uBg, slatColor, mask);
  fragColor = col;
}
`;

function makeRT(gl, w, h) {
  return new RenderTarget(gl, {
    width: w,
    height: h,
    type: gl.HALF_FLOAT,
    format: gl.RGBA,
    internalFormat: gl.RGBA16F,
    minFilter: gl.LINEAR,
    magFilter: gl.LINEAR,
  });
}

function makeRTDouble(gl, w, h) {
  return { read: makeRT(gl, w, h), write: makeRT(gl, w, h), swap() { const t = this.read; this.read = this.write; this.write = t; } };
}

export default function MicroSlats({
  preset = 'swell',
  color = '#A855F7',
  glintColor = '#ffffff',
  backgroundColor = '#000000',
  slatWidth = 10,
  slatHeight = 25,
  gap = 3,
  roundness = 0.75,
  scale,
  speed,
  direction,
  chop,
  stretch,
  glint,
  contrast,
  perspective,
  fog,
  interactive = true,
  cursorStrength = 1,
  cursorSize = 40,
  swirl = 0,
  trail = 1.4,
  lean = 0,
  intro = true,
  introDuration = 1.5,
  paused = false,
  className = '',
  style,
}) {
  const containerRef = useRef(null);
  const stateRef = useRef(null);

  const presetData = useMemo(() => SWELL_PRESETS[preset] || SWELL_PRESETS.swell, [preset]);

  const cfg = useMemo(() => ({
    scale: scale ?? presetData.scale,
    speed: speed ?? presetData.speed,
    direction: direction ?? presetData.direction,
    chop: chop ?? presetData.chop,
    stretch: stretch ?? presetData.stretch,
    glint: glint ?? presetData.glint,
    contrast: contrast ?? presetData.contrast,
    perspective: perspective ?? presetData.perspective,
    fog: fog ?? presetData.fog,
  }), [preset, scale, speed, direction, chop, stretch, glint, contrast, perspective, fog, presetData]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), alpha: false, antialias: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 1);
    container.appendChild(gl.canvas);

    const tri = new Triangle(gl);

    const mkProg = (fragment, vertex = passVertex) => new Program(gl, {
      vertex,
      fragment,
      depthTest: false,
      depthWrite: false,
    });

    const mkFluidProg = (fragment) => new Program(gl, {
      vertex: fluidVertex,
      fragment,
      depthTest: false,
      depthWrite: false,
    });

    const splatProg = mkFluidProg(splatFragment);
    const curlProg = mkFluidProg(curlFragment);
    const vorticityProg = mkFluidProg(vorticityFragment);
    const divergenceProg = mkFluidProg(divergenceFragment);
    const pressureProg = mkFluidProg(pressureFragment);
    const projectProg = mkFluidProg(projectFragment);
    const advectProg = mkFluidProg(advectFragment);
    const scaleProg = mkFluidProg(scaleFragment);
    const fieldProg = mkProg(fieldFragment);
    const renderProg = mkProg(renderFragment);

    const mesh = new Mesh(gl, { geometry: tri, program: splatProg });

    const fSize = FLUID_SIZE;
    const velRT = makeRTDouble(gl, fSize, fSize);
    const inkRT = makeRTDouble(gl, fSize, fSize);
    const curlRT = makeRT(gl, fSize, fSize);
    const divRT = makeRT(gl, fSize, fSize);
    const pressureRT = makeRTDouble(gl, fSize, fSize);

    let fieldRT = null;
    let W = 0, H = 0;
    let cols = 0, rows = 0;
    let originX = 0, originY = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      let rW = Math.round(rect.width * dpr);
      let rH = Math.round(rect.height * dpr);
      if (rW * rH > PIXEL_BUDGET) {
        const ratio = Math.sqrt(PIXEL_BUDGET / (rW * rH));
        rW = Math.round(rW * ratio);
        rH = Math.round(rH * ratio);
      }
      if (rW === W && rH === H) return;
      W = rW; H = rH;
      renderer.setSize(W, H);

      const step = slatWidth + gap;
      cols = Math.ceil(W / step);
      rows = Math.ceil(H / step);
      originX = (W - cols * step) / 2;
      originY = (H - rows * step) / 2;

      fieldRT = makeRT(gl, cols, rows);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let introStart = null;
    let time = 0;
    let lastT = null;
    let mouse = null;
    let lastMouse = null;
    let raf = null;

    const splat = (rt, point, value, radius) => {
      mesh.program = splatProg;
      splatProg.uniforms.uTarget = { value: rt.read.texture };
      splatProg.uniforms.uAspect = { value: W / H };
      splatProg.uniforms.uPoint = { value: point };
      splatProg.uniforms.uValue = { value };
      splatProg.uniforms.uRadius = { value: radius };
      renderer.render({ scene: mesh, target: rt.write });
      rt.swap();
    };

    const stepFluid = (dt) => {
      const texel = [1 / fSize, 1 / fSize];

      // curl
      mesh.program = curlProg;
      curlProg.uniforms.uVelocity = { value: velRT.read.texture };
      curlProg.uniforms.uTexel = { value: texel };
      renderer.render({ scene: mesh, target: curlRT });

      // vorticity
      mesh.program = vorticityProg;
      vorticityProg.uniforms.uVelocity = { value: velRT.read.texture };
      vorticityProg.uniforms.uCurl = { value: curlRT.texture };
      vorticityProg.uniforms.uSwirl = { value: swirl };
      vorticityProg.uniforms.uDt = { value: dt };
      vorticityProg.uniforms.uTexel = { value: texel };
      renderer.render({ scene: mesh, target: velRT.write });
      velRT.swap();

      // divergence
      mesh.program = divergenceProg;
      divergenceProg.uniforms.uVelocity = { value: velRT.read.texture };
      divergenceProg.uniforms.uTexel = { value: texel };
      renderer.render({ scene: mesh, target: divRT });

      // pressure
      mesh.program = scaleProg;
      scaleProg.uniforms.uSource = { value: pressureRT.read.texture };
      scaleProg.uniforms.uValue = { value: 0.8 };
      renderer.render({ scene: mesh, target: pressureRT.write });
      pressureRT.swap();

      for (let i = 0; i < PRESSURE_STEPS; i++) {
        mesh.program = pressureProg;
        pressureProg.uniforms.uPressure = { value: pressureRT.read.texture };
        pressureProg.uniforms.uDivergence = { value: divRT.texture };
        pressureProg.uniforms.uTexel = { value: texel };
        renderer.render({ scene: mesh, target: pressureRT.write });
        pressureRT.swap();
      }

      // project
      mesh.program = projectProg;
      projectProg.uniforms.uPressure = { value: pressureRT.read.texture };
      projectProg.uniforms.uVelocity = { value: velRT.read.texture };
      projectProg.uniforms.uTexel = { value: texel };
      renderer.render({ scene: mesh, target: velRT.write });
      velRT.swap();

      // advect velocity
      mesh.program = advectProg;
      advectProg.uniforms.uVelocity = { value: velRT.read.texture };
      advectProg.uniforms.uSource = { value: velRT.read.texture };
      advectProg.uniforms.uTexel = { value: texel };
      advectProg.uniforms.uDt = { value: dt };
      advectProg.uniforms.uFade = { value: 1 / trail };
      renderer.render({ scene: mesh, target: velRT.write });
      velRT.swap();

      // advect ink
      mesh.program = advectProg;
      advectProg.uniforms.uSource = { value: inkRT.read.texture };
      advectProg.uniforms.uFade = { value: 2 / trail };
      renderer.render({ scene: mesh, target: inkRT.write });
      inkRT.swap();
    };

    const draw = (ts) => {
      raf = requestAnimationFrame(draw);
      if (!W || !H || !fieldRT) return;

      const dt = lastT === null ? 0.016 : Math.min((ts - lastT) / 1000, 0.05);
      lastT = ts;

      if (intro && introStart === null) introStart = ts;
      const introT = intro ? Math.min((ts - introStart) / 1000 / introDuration, 1) : 1;

      if (!paused) time += dt * cfg.speed;

      // mouse interaction
      if (interactive && mouse && lastMouse) {
        const dx = (mouse[0] - lastMouse[0]) / W;
        const dy = (mouse[1] - lastMouse[1]) / H;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0.0001) {
          const pt = [mouse[0] / W, 1 - mouse[1] / H];
          const force = [dx * SPLAT_FORCE, -dy * SPLAT_FORCE, 0];
          const radius = Math.pow(cursorSize / Math.max(W, H), 2) * (W / H);
          splat(velRT, pt, force, radius);
          const strength = len * cursorStrength * 15;
          splat(inkRT, pt, [strength, strength * 0.6, strength * 0.9], radius);
        }
      }
      lastMouse = mouse ? [...mouse] : null;

      stepFluid(dt);

      // field pass
      mesh.program = fieldProg;
      const step = slatWidth + gap;
      fieldProg.uniforms.uSize = { value: [W, H] };
      fieldProg.uniforms.uGrid = { value: [cols, rows, step, step] };
      fieldProg.uniforms.uOrigin = { value: [originX, originY] };
      fieldProg.uniforms.uSlat = { value: [slatWidth, slatHeight] };
      fieldProg.uniforms.uTime = { value: time };
      fieldProg.uniforms.uScale = { value: cfg.scale * 80 };
      fieldProg.uniforms.uDirection = { value: cfg.direction };
      fieldProg.uniforms.uChop = { value: cfg.chop };
      fieldProg.uniforms.uStretch = { value: cfg.stretch };
      fieldProg.uniforms.uGlint = { value: cfg.glint };
      fieldProg.uniforms.uContrast = { value: cfg.contrast };
      fieldProg.uniforms.uPerspective = { value: cfg.perspective };
      fieldProg.uniforms.uFog = { value: cfg.fog };
      fieldProg.uniforms.uIntro = { value: introT };
      fieldProg.uniforms.tVelocity = { value: velRT.read.texture };
      fieldProg.uniforms.tInk = { value: inkRT.read.texture };
      fieldProg.uniforms.uFluidTexel = { value: [1 / fSize, 1 / fSize] };
      fieldProg.uniforms.uFluid = { value: 0.012 };
      fieldProg.uniforms.uInk = { value: 1.0 };
      fieldProg.uniforms.uLean = { value: lean };
      renderer.render({ scene: mesh, target: fieldRT });

      // render pass
      mesh.program = renderProg;
      const col = parseColor(color, [0.659, 0.333, 0.969, 1]);
      const glintCol = parseColor(glintColor, [1, 1, 1, 1]);
      const bgCol = parseColor(backgroundColor, [0, 0, 0, 1]);
      renderProg.uniforms.tField = { value: fieldRT.texture };
      renderProg.uniforms.uColor = { value: col };
      renderProg.uniforms.uGlint = { value: glintCol };
      renderProg.uniforms.uBg = { value: bgCol };
      renderProg.uniforms.uContrast = { value: cfg.contrast };
      renderProg.uniforms.tInk = { value: inkRT.read.texture };
      renderProg.uniforms.uSize = { value: [W, H] };
      renderProg.uniforms.uInk = { value: 0.4 };
      renderer.render({ scene: mesh });
    };

    raf = requestAnimationFrame(draw);

    // --- events ---
    const getPos = (e) => {
      const rect = container.getBoundingClientRect();
      const src = e.touches ? e.touches[0] : e;
      return [src.clientX - rect.left, src.clientY - rect.top];
    };

    const onMove = (e) => { if (interactive) mouse = getPos(e); };
    const onLeave = () => { mouse = null; lastMouse = null; };
    const onClick = (e) => {
      if (!interactive) return;
      const pt = getPos(e);
      const npt = [pt[0] / W, 1 - pt[1] / H];
      const radius = Math.pow(cursorSize * 2 / Math.max(W, H), 2) * (W / H);
      for (let j = 0; j < SPLASH_JETS; j++) {
        const ang = (j / SPLASH_JETS) * Math.PI * 2;
        const force = [Math.cos(ang) * SPLAT_FORCE * 2, Math.sin(ang) * SPLAT_FORCE * 2, 0];
        splat(velRT, npt, force, radius);
        splat(inkRT, npt, [cursorStrength * 2, cursorStrength * 1.2, cursorStrength * 1.8], radius);
      }
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseleave', onLeave);
    container.addEventListener('touchmove', onMove, { passive: true });
    container.addEventListener('touchend', onLeave);
    container.addEventListener('click', onClick);

    stateRef.current = { renderer, container };

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseleave', onLeave);
      container.removeEventListener('touchmove', onMove);
      container.removeEventListener('touchend', onLeave);
      container.removeEventListener('click', onClick);
      if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
    };
  }, []);

  // Update cfg live without re-mounting
  useEffect(() => {
    // cfg is read each frame via closure — no extra work needed
  }, [cfg, paused, interactive, cursorStrength, cursorSize, swirl, trail, lean, color, glintColor, backgroundColor, slatWidth, slatHeight, gap, roundness, intro, introDuration]);

  return (
    <div
      ref={containerRef}
      className={`micro-slats${className ? ` ${className}` : ''}`}
      style={style}
    />
  );
}
