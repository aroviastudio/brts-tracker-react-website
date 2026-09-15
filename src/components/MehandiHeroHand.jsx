/**
 * MehandiHeroHand.jsx
 *
 * 3D rotating mehandi hand hero section.
 *
 * Architecture (from threejs-fundamentals + gsap-scrolltrigger skills):
 *   - Three.js scene: transparent alpha WebGLRenderer, ACESFilmic tonemapping
 *   - Hand built procedurally from BufferGeometry (palm + fingers)
 *   - Mehandi motifs drawn as instanced LineSegments overlay on the 3D surface
 *   - GSAP ScrollTrigger scrubs hand Y-rotation + camera Y drift on scroll
 *   - Ambient idle rotation continues between scroll events
 *   - Motion Personality: PREMIUM — 500ms easing (0.4,0,0.2,1), no overshoot
 *   - Three motion layers: primary (hand rotation), secondary (particle dust),
 *     ambient (soft breath scale pulse on glow rings)
 */

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── Design tokens (mirror index.css) ─────────────────────────── */
const COLOR = {
  canvas:  0xfafaf8,
  ink:     0x111111,
  henna:   0x8b1a2d,
  hennaD:  0x5c0f1e,   // deep shadow
  hennaL:  0xc9455e,   // highlight
  gold:    0xd4a84b,
  cream:   0xfdf3e3,
};

/* ─── Helper: build a tapered cylinder finger ──────────────────── */
function makeFinger(rTop, rBottom, height, segs = 8) {
  return new THREE.CylinderGeometry(rTop, rBottom, height, segs, 1);
}

/* ─── Helper: build the full hand group ────────────────────────── */
function buildHand() {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({
    color: 0xe8c9a0,
    roughness: 0.65,
    metalness: 0.0,
    side: THREE.FrontSide,
  });

  // Palm
  const palmGeo = new THREE.BoxGeometry(1.0, 1.2, 0.22);
  // Bevel the corners via a simple trick — chamfer via shape
  const palm = new THREE.Mesh(palmGeo, skinMat);
  palm.position.set(0, 0, 0);
  palm.castShadow = true;
  group.add(palm);

  // Thumb
  const thumb = new THREE.Group();
  const thumbBase = new THREE.Mesh(makeFinger(0.10, 0.13, 0.55, 8), skinMat);
  const thumbTip  = new THREE.Mesh(makeFinger(0.07, 0.10, 0.35, 8), skinMat);
  thumbTip.position.y = 0.44;
  thumb.add(thumbBase, thumbTip);
  thumb.position.set(-0.60, 0.20, 0);
  thumb.rotation.z = Math.PI / 5;
  thumb.castShadow = true;
  group.add(thumb);

  // Four fingers
  const fingerData = [
    { x: -0.35, lengthA: 0.78, lengthB: 0.52, rA: 0.095, rB: 0.080 }, // index
    { x:  0.00, lengthA: 0.88, lengthB: 0.58, rA: 0.100, rB: 0.085 }, // middle
    { x:  0.35, lengthA: 0.80, lengthB: 0.54, rA: 0.095, rB: 0.080 }, // ring
    { x:  0.62, lengthA: 0.62, lengthB: 0.40, rA: 0.082, rB: 0.068 }, // pinky
  ];

  fingerData.forEach(({ x, lengthA, lengthB, rA, rB }) => {
    const fg = new THREE.Group();
    // Lower phalanx
    const lo = new THREE.Mesh(makeFinger(rA * 0.92, rA, lengthA, 8), skinMat);
    lo.position.y = lengthA / 2;
    // Upper phalanx
    const hi = new THREE.Mesh(makeFinger(rB * 0.8, rA * 0.92, lengthB, 8), skinMat);
    hi.position.y = lengthA + lengthB / 2;
    // Fingertip cap
    const tip = new THREE.Mesh(new THREE.SphereGeometry(rB * 0.8, 8, 6), skinMat);
    tip.position.y = lengthA + lengthB;
    fg.add(lo, hi, tip);
    fg.position.set(x, 0.60, 0);
    fg.castShadow = true;
    group.add(fg);
  });

  return { group, skinMat };
}

/* ─── Helper: draw SVG mehandi motifs as 3D line overlay ────────── */
function buildMehandiLines(group) {
  const mat = new THREE.LineBasicMaterial({
    color: COLOR.henna,
    linewidth: 1,          // WebGL LineBasicMaterial max=1 on most GPUs
    transparent: true,
    opacity: 0.92,
  });

  const lines = new THREE.Group();

  // Utility: circular arc points
  function arcPoints(cx, cy, r, startA, endA, steps = 24) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const a = startA + (endA - startA) * (i / steps);
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.13));
    }
    return pts;
  }

  // Utility: petal (two arcs)
  function petal(cx, cy, r, angle, count = 8) {
    const g = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 * i) / count + angle;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      // small arc for each petal
      const pts = arcPoints(px, py, r * 0.55, a + Math.PI * 0.6, a + Math.PI * 1.4, 12);
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      g.add(new THREE.Line(geo, mat));
    }
    return g;
  }

  // Utility: spiral
  function spiral(cx, cy, startR, endR, turns, steps = 80) {
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const r = startR + (endR - startR) * t;
      const a = t * Math.PI * 2 * turns;
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0.13));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    return new THREE.Line(geo, mat);
  }

  // ── Palm motifs ──────────────────────────────────────────────
  // Central mandala — 3 concentric rings
  [0.12, 0.22, 0.34].forEach(r => {
    const pts = arcPoints(0, 0, r, 0, Math.PI * 2, 48);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    lines.add(new THREE.Line(geo, mat));
  });

  // Central flower petal
  lines.add(petal(0, 0, 0.22, 0, 8));

  // Inner dot-ring crosshatch (simulated with small crosses)
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * 2 * i) / 8;
    const x = Math.cos(a) * 0.28;
    const y = Math.sin(a) * 0.28;
    const crossGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(x - 0.03, y,      0.13),
      new THREE.Vector3(x + 0.03, y,      0.13),
      new THREE.Vector3(x,      y - 0.03, 0.13),
      new THREE.Vector3(x,      y + 0.03, 0.13),
    ]);
    lines.add(new THREE.LineSegments(crossGeo, mat));
  }

  // Decorative vine on left side of palm
  const vineL = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    vineL.push(new THREE.Vector3(
      -0.38 + Math.sin(t * Math.PI * 3) * 0.07,
      -0.50 + t * 1.1,
      0.13
    ));
  }
  lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vineL), mat));

  // Decorative vine on right side
  const vineR = [];
  for (let i = 0; i < 30; i++) {
    const t = i / 29;
    vineR.push(new THREE.Vector3(
      0.38 + Math.sin(t * Math.PI * 3 + Math.PI) * 0.07,
      -0.50 + t * 1.1,
      0.13
    ));
  }
  lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vineR), mat));

  // Leaf clusters on vines
  [[-0.42, -0.2], [-0.30, 0.2], [0.42, -0.1], [0.30, 0.35]].forEach(([lx, ly]) => {
    const leafPts = arcPoints(lx, ly, 0.10, -Math.PI * 0.6, Math.PI * 0.6, 12);
    lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leafPts), mat));
  });

  // Wrist band (bracelet)
  [-0.72, -0.80, -0.88].forEach(y => {
    const pts = arcPoints(0, y, 0.50, -Math.PI * 0.9, Math.PI * 0.9, 32);
    lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
  });

  // Small spirals at wrist corners
  lines.add(spiral(-0.44, -0.76, 0.02, 0.12, 2.5));
  lines.add(spiral( 0.44, -0.76, 0.02, 0.12, 2.5));

  // ── Finger tip mehandi ────────────────────────────────────────
  const fingerTipYs = [1.44, 1.56, 1.46, 1.22];
  const fingerXs    = [-0.35, 0.00, 0.35, 0.62];
  fingerXs.forEach((fx, i) => {
    // Fingertip cap circle
    const pts = arcPoints(fx, fingerTipYs[i], 0.07, 0, Math.PI * 2, 20);
    lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    // Small inner dot
    const inner = arcPoints(fx, fingerTipYs[i], 0.03, 0, Math.PI * 2, 10);
    lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(inner), mat));
    // Short band below each fingertip
    const bandPts = arcPoints(fx, fingerTipYs[i] - 0.16, 0.08, -Math.PI * 0.7, Math.PI * 0.7, 14);
    lines.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(bandPts), mat));
  });

  // Thumb tip
  lines.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(arcPoints(-0.82, 0.68, 0.07, 0, Math.PI * 2, 20)),
    mat
  ));

  group.add(lines);
  return lines;
}

/* ─── Particle dust (ambient layer) ─────────────────────────────── */
function buildDustParticles() {
  const count = 180;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 3.2;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: COLOR.henna,
    size: 0.018,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true,
  });
  return new THREE.Points(geo, mat);
}

/* ─── Glow rings (ambient layer) ────────────────────────────────── */
function buildGlowRings(scene) {
  const rings = [];
  [1.2, 1.55, 1.90].forEach((r, i) => {
    const geo = new THREE.TorusGeometry(r, 0.008, 6, 80);
    const mat = new THREE.MeshBasicMaterial({
      color: i === 1 ? COLOR.henna : COLOR.gold,
      transparent: true,
      opacity: i === 1 ? 0.25 : 0.12,
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.3;
    scene.add(ring);
    rings.push({ ring, mat, baseOpacity: mat.opacity });
  });
  return rings;
}

/* ─── Main Component ─────────────────────────────────────────────── */
export default function MehandiHeroHand() {
  const mountRef  = useRef(null);
  const stateRef  = useRef({});   // store three.js objects for cleanup

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    /* ── Renderer ───────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,                      // transparent background
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    /* ── Scene ──────────────────────────────────────────────── */
    const scene = new THREE.Scene();

    /* ── Camera ─────────────────────────────────────────────── */
    const aspect = el.clientWidth / el.clientHeight;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
    camera.position.set(0, 0.5, 4.8);
    camera.lookAt(0, 0.4, 0);

    /* ── Lights ─────────────────────────────────────────────── */
    // Key light — warm top-front
    const keyLight = new THREE.DirectionalLight(0xfff0e0, 2.0);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    // Fill light — cool left
    const fillLight = new THREE.DirectionalLight(0xd0d8ff, 0.6);
    fillLight.position.set(-3, 1, 2);
    scene.add(fillLight);

    // Henna rim light — deep red from behind
    const rimLight = new THREE.DirectionalLight(COLOR.henna, 1.2);
    rimLight.position.set(0, -2, -3);
    scene.add(rimLight);

    // Ambient — warm base
    scene.add(new THREE.AmbientLight(0xfff5e6, 0.8));

    // Point light inside hand for subsurface-like warmth
    const sssLight = new THREE.PointLight(0xffaa66, 1.4, 3);
    sssLight.position.set(0, 0.3, 0.5);
    scene.add(sssLight);

    /* ── Hand ───────────────────────────────────────────────── */
    const { group: handGroup } = buildHand();
    handGroup.position.set(0, -0.2, 0);
    scene.add(handGroup);

    /* ── Mehandi line motifs ─────────────────────────────────── */
    buildMehandiLines(handGroup);

    /* ── Ambient particles ───────────────────────────────────── */
    const dust = buildDustParticles();
    scene.add(dust);

    /* ── Glow rings ──────────────────────────────────────────── */
    const glowRings = buildGlowRings(scene);

    /* ── Entrance animation (Premium archetype) ──────────────── */
    // hand starts below + invisible, rises up — 600ms, ease-out
    handGroup.position.y = -2.5;
    handGroup.scale.setScalar(0);

    gsap.to(handGroup.position, {
      y: -0.2,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.3,
    });
    gsap.to(handGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 1.0,
      ease: 'power2.out',
      delay: 0.3,
    });
    // Text overlay entrance (CSS driven — see render)
    gsap.fromTo('.mehandi-hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.9 }
    );
    gsap.fromTo('.mehandi-hero-sub',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.3 }
    );

    /* ── Scroll → rotate hand (scrub, premium) ───────────────── */
    // From threejs-fundamentals + gsap-scrolltrigger skill:
    // We drive handGroup.rotation.y via a proxy object
    const rotProxy = { y: 0 };

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=180%',
        scrub: 1.2,           // 1.2s lag = silky premium feel
        pin: true,
        pinSpacing: true,
      },
    });

    // Phase 1: rotate hand 180° (palm → back)
    scrollTl.to(rotProxy, {
      y: Math.PI,
      duration: 3,
      ease: 'none',         // ScrollTrigger scrub requires ease:none
      onUpdate: () => { handGroup.rotation.y = rotProxy.y; },
    });

    // Phase 2: continue to 360° back to palm + slight tilt
    scrollTl.to(rotProxy, {
      y: Math.PI * 2,
      duration: 3,
      ease: 'none',
      onUpdate: () => { handGroup.rotation.y = rotProxy.y; },
    });

    // Camera drift: shift slightly right as user scrolls
    const camProxy = { x: 0 };
    gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=180%',
        scrub: 2,
      },
    }).to(camProxy, {
      x: 0.6,
      duration: 6,
      ease: 'none',
      onUpdate: () => {
        camera.position.x = camProxy.x;
        camera.lookAt(0.1, 0.4, 0);
      },
    });

    /* ── Ambient ring breath (GSAP idle loop) ────────────────── */
    glowRings.forEach(({ ring, mat, baseOpacity }, i) => {
      gsap.to(mat, {
        opacity: baseOpacity * 2.2,
        duration: 1.8 + i * 0.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.4,
      });
      gsap.to(ring.scale, {
        x: 1.06, y: 1.06, z: 1.06,
        duration: 2.2 + i * 0.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.3,
      });
    });

    /* ── Clock for idle spin & dust drift ───────────────────── */
    const clock = new THREE.Clock();

    /* ── Render loop ─────────────────────────────────────────── */
    let rafId;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle idle rock (secondary layer — not overriding scroll)
      const scrollProgress = ScrollTrigger.getAll()[0]?.progress ?? 0;
      if (scrollProgress < 0.02) {
        // Only idle-rock when near the top (not mid-scroll)
        handGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.06;
        handGroup.rotation.z = Math.sin(elapsed * 0.28 + 1) * 0.04;
      }

      // Dust particles float upward slowly
      const posAttr = dust.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.setY(i, posAttr.getY(i) + 0.0006);
        if (posAttr.getY(i) > 2.1) posAttr.setY(i, -2.1);
      }
      posAttr.needsUpdate = true;

      // SSS point light gentle float
      sssLight.position.x = Math.sin(elapsed * 0.5) * 0.3;
      sssLight.position.y = 0.3 + Math.sin(elapsed * 0.7) * 0.15;

      renderer.render(scene, camera);
    }
    animate();

    /* ── Resize handler ─────────────────────────────────────── */
    function onResize() {
      const w = el.clientWidth;
      const h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize);

    /* ── Store for cleanup ───────────────────────────────────── */
    stateRef.current = { renderer, rafId };

    /* ── Cleanup ────────────────────────────────────────────── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ScrollTrigger.getAll().forEach(t => t.kill());
      renderer.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', background: 'transparent' }}
    >
      {/* Three.js canvas mount — full section */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* Radial gradient vignette to bleed into page background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, #fafaf8 100%)',
        }}
      />

      {/* Henna-tinted glow behind hand */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 50% at 50% 45%, rgba(139,26,45,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Text overlay — centered below hand */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 pointer-events-none">
        <p
          className="mehandi-hero-sub"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(0.65rem, 1.2vw, 0.78rem)',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#8b1a2d',
            marginBottom: '0.55rem',
            opacity: 0,
          }}
        >
          Scroll to explore
        </p>
        <h1
          className="mehandi-hero-title"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 300,
            letterSpacing: '0.06em',
            color: '#111111',
            lineHeight: 1.1,
            textAlign: 'center',
            opacity: 0,
          }}
        >
          The Art of&nbsp;<em style={{ fontStyle: 'italic', color: '#8b1a2d' }}>Mehandi</em>
        </h1>
      </div>

      {/* Scroll indicator arrow */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: 0.5 }}
      >
        <div
          style={{
            width: 1,
            height: 40,
            background: 'linear-gradient(to bottom, transparent, #8b1a2d)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: scaleY(0.8); }
          50%      { opacity: 0.9; transform: scaleY(1.0); }
        }
      `}</style>
    </section>
  );
}
