'use client';

import { useEffect, useRef, useId } from 'react';

// Localized fire-texture cursor effect for CAME club pages.
// A small canvas flame renders at the cursor position — only visible while
// hovering interactive elements inside the page wrapper. Matches the organic
// flickering energy of the motion banner without a page-wide glow.

const ORANGE  = [245, 118, 10]  as const;  // #F5760A
const AMBER   = [255, 170, 30]  as const;
const DEEP    = [180, 40, 10]   as const;
const WHITE   = [255, 230, 180] as const;

const PARTICLE_COUNT = 28;
const CANVAS_W = 120;
const CANVAS_H = 140;
// Hotspot centre: bottom-centre of the canvas (cursor tip)
const CX = CANVAS_W / 2;
const BASE_Y = CANVAS_H - 8;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;      // 0→1
  decay: number;
  size: number;
  hue: number;       // 0=deep, 0.5=orange, 1=white core
}

function randBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function lerpColor(a: readonly [number, number, number], b: readonly [number, number, number], t: number) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ] as [number, number, number];
}

function particleColor(hue: number, alpha: number): string {
  let rgb: [number, number, number];
  if (hue < 0.35) {
    rgb = lerpColor(DEEP, ORANGE, hue / 0.35);
  } else if (hue < 0.7) {
    rgb = lerpColor(ORANGE, AMBER, (hue - 0.35) / 0.35);
  } else {
    rgb = lerpColor(AMBER, WHITE, (hue - 0.7) / 0.3);
  }
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
}

function spawnParticle(): Particle {
  return {
    x:     CX + randBetween(-10, 10),
    y:     BASE_Y + randBetween(-4, 4),
    vx:    randBetween(-0.6, 0.6),
    vy:    randBetween(-2.8, -1.4),
    life:  0,
    decay: randBetween(0.013, 0.024),
    size:  randBetween(6, 15),
    hue:   randBetween(0, 0.5),
  };
}

export default function CameFireCursor() {
  const filterId    = useId().replace(/:/g, '');
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const cursorRef   = useRef<HTMLDivElement>(null);
  const particles   = useRef<Particle[]>(Array.from({ length: PARTICLE_COUNT }, spawnParticle));
  const mouseRef    = useRef({ x: -999, y: -999 });
  const visibleRef  = useRef(false);
  const rafRef      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    // ── mouse tracking ────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Position the container so the canvas centre-bottom aligns with cursor
      cursor.style.left = `${e.clientX - CANVAS_W / 2}px`;
      cursor.style.top  = `${e.clientY - CANVAS_H + 8}px`;
    };

    // Show only when cursor enters an interactive element on the page
    const onEnter = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('a,button,[role="button"],[role="tab"],input,select,textarea')) {
        visibleRef.current = true;
        cursor.style.opacity = '1';
      }
    };
    const onLeave = (e: MouseEvent) => {
      const t = e.relatedTarget as HTMLElement | null;
      if (!t?.closest('a,button,[role="button"],[role="tab"],input,select,textarea')) {
        visibleRef.current = false;
        cursor.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout',  onLeave, { passive: true });

    // ── animation loop ────────────────────────────────────────────────────────
    let noise = 0;
    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      c.clearRect(0, 0, CANVAS_W, CANVAS_H);

      noise += 0.035;

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        if (p.life >= 1) {
          particles.current[i] = spawnParticle();
          continue;
        }

        p.life += p.decay;

        const wobble = Math.sin(noise * 1.7 + i * 2.3) * 0.18
                     + Math.cos(noise * 2.1 + i * 1.1) * 0.12;
        p.vx += wobble;
        p.vx *= 0.94;
        p.vy += randBetween(-0.05, 0.02);

        p.x += p.vx;
        p.y += p.vy;

        const aliveT = p.life;
        const size   = p.size * (1 - aliveT * 0.55);
        const hue    = Math.min(1, p.hue + aliveT * 0.55);
        const alpha  = aliveT < 0.15
          ? aliveT / 0.15
          : Math.max(0, 1 - (aliveT - 0.15) / 0.85);

        if (alpha < 0.005 || size < 0.5) continue;

        try {
          const grad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, size);
          grad.addColorStop(0,   particleColor(Math.min(1, hue + 0.25), alpha));
          grad.addColorStop(0.4, particleColor(hue, alpha * 0.75));
          grad.addColorStop(1,   particleColor(Math.max(0, hue - 0.2), 0));
          c.beginPath();
          c.arc(p.x, p.y, size, 0, Math.PI * 2);
          c.fillStyle = grad;
          c.fill();
        } catch { /* ignore rare out-of-bounds gradient */ }
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout',  onLeave);
    };
  }, []);

  return (
    <>
      {/* SVG turbulence filter — makes the flame edges organic/distorted */}
      <svg
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`fire-${filterId}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.04 0.06" numOctaves={3} seed={12} result="turb">
              <animate attributeName="baseFrequency" values="0.04 0.06;0.05 0.08;0.04 0.06" dur="2.4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={10} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Canvas container — follows cursor, invisible when not over interactive elements */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          width:         CANVAS_W,
          height:        CANVAS_H,
          pointerEvents: 'none',
          zIndex:        9999,
          opacity:       0,
          transition:    'opacity 0.18s ease',
          filter:        `url(#fire-${filterId})`,
          mixBlendMode:  'screen',
        }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          style={{ display: 'block' }}
        />
      </div>
    </>
  );
}
