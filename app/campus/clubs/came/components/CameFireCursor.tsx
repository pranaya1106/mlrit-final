'use client';

import { useEffect, useRef, useId } from 'react';

// Ambient fire-streak embers — always present, scattered across the page.
// Embers spawn from random x positions along the bottom, float upward with
// comet tails, and loop continuously. No interaction required.

const PARTICLE_COUNT = 55;
const TRAIL_LEN = 14;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  r: number;
  trail: Array<{ x: number; y: number }>;
  heat: number;
}

function heatColor(heat: number, alpha: number): string {
  let r: number, g: number, b: number;
  if (heat < 0.3) {
    const t = heat / 0.3;
    r = Math.round(200 + t * 45);
    g = Math.round(30  + t * 88);
    b = Math.round(5   + t * 5);
  } else if (heat < 0.6) {
    const t = (heat - 0.3) / 0.3;
    r = 245;
    g = Math.round(118 + t * 67);
    b = Math.round(10  + t * 30);
  } else {
    const t = (heat - 0.6) / 0.4;
    r = 255;
    g = Math.round(185 + t * 55);
    b = Math.round(40  + t * 120);
  }
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

function spawnEmber(w: number, h: number): Ember {
  const angle = rand(-Math.PI * 0.65, -Math.PI * 0.35); // mostly upward
  const speed = rand(1.2, 3.4);
  return {
    x:     rand(0, w),
    y:     h + rand(0, 30),          // spawn below visible area
    vx:    Math.cos(angle) * speed * rand(0.15, 0.7),
    vy:    Math.sin(angle) * speed,
    life:  rand(0, 0.9),             // stagger so they don't all appear at once
    decay: rand(0.004, 0.012),       // slower decay = longer visible lifetime
    r:     rand(1.2, 3.2),
    trail: [],
    heat:  rand(0.3, 0.95),
  };
}

export default function CameFireCursor() {
  const filterId  = useId().replace(/:/g, '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embers    = useRef<Ember[]>([]);
  const rafRef    = useRef(0);
  const noiseT    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-seed embers on resize so they fill the new dimensions
      embers.current = Array.from(
        { length: PARTICLE_COUNT },
        () => spawnEmber(canvas.width, canvas.height),
      );
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      rafRef.current = requestAnimationFrame(draw);

      const W = canvas!.width;
      const H = canvas!.height;

      c.clearRect(0, 0, W, H);

      noiseT.current += 0.022;
      const noise = noiseT.current;

      for (let i = 0; i < embers.current.length; i++) {
        const p = embers.current[i];

        // Respawn below screen when fully spent or drifted off sides
        if (p.life >= 1 || p.x < -40 || p.x > W + 40) {
          embers.current[i] = spawnEmber(W, H);
          continue;
        }

        p.life += p.decay;

        // Convective wobble
        const wx = Math.sin(noise * 2.1 + i * 1.9) * 0.14
                 + Math.cos(noise * 1.4 + i * 3.3) * 0.09;
        p.vx += wx;
        p.vx *= 0.94;
        p.vy *= 0.988;

        p.x += p.vx;
        p.y += p.vy;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        if (p.trail.length < 2) continue;

        const t = p.life;
        const life_alpha = t < 0.12
          ? t / 0.12
          : t < 0.72
            ? 1
            : Math.max(0, 1 - (t - 0.72) / 0.28);

        if (life_alpha < 0.01) continue;

        const curHeat = t < 0.45
          ? Math.min(1, p.heat + t * 0.5)
          : Math.max(0, p.heat - (t - 0.45) * 1.1);

        // Trail segments
        const n = p.trail.length;
        for (let j = 1; j < n; j++) {
          const segFrac  = j / (n - 1);
          const segAlpha = life_alpha * segFrac * segFrac;
          const segHeat  = curHeat * (0.3 + 0.7 * segFrac);
          const segWidth = p.r * segFrac * 2.2;

          if (segAlpha < 0.005 || segWidth < 0.3) continue;

          const prev = p.trail[j - 1];
          const curr = p.trail[j];

          c.beginPath();
          c.moveTo(prev.x, prev.y);
          c.lineTo(curr.x, curr.y);
          c.strokeStyle = heatColor(segHeat, segAlpha);
          c.lineWidth   = segWidth;
          c.lineCap     = 'round';
          c.lineJoin    = 'round';
          c.stroke();
        }

        // Head glow
        const headR = p.r * (1 - t * 0.45);
        if (headR > 0.4 && life_alpha > 0.02) {
          try {
            const grd = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, headR * 2.5);
            grd.addColorStop(0,   heatColor(Math.min(1, curHeat + 0.2), life_alpha));
            grd.addColorStop(0.4, heatColor(curHeat, life_alpha * 0.6));
            grd.addColorStop(1,   heatColor(Math.max(0, curHeat - 0.2), 0));
            c.beginPath();
            c.arc(p.x, p.y, headR * 2.5, 0, Math.PI * 2);
            c.fillStyle = grd;
            c.fill();
          } catch { /* gradient bounds */ }
        }
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <svg
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`ember-${filterId}`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.025 0.04" numOctaves={2} seed={7} result="turb">
              <animate attributeName="baseFrequency" values="0.025 0.04;0.035 0.055;0.025 0.04" dur="4s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={4} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          inset:         0,
          width:         '100%',
          height:        '100%',
          pointerEvents: 'none',
          zIndex:        5,
          filter:        `url(#ember-${filterId})`,
          mixBlendMode:  'screen',
        }}
      />
    </>
  );
}
