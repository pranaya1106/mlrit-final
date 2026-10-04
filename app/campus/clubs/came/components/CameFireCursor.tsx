'use client';

import { useEffect, useRef, useId } from 'react';

// Ambient ember columns — dense rising sparks on the left and right sides of
// the viewport only. Embers spawn near the bottom edge, float straight upward
// with gentle convective wobble and comet trails, fading as they rise.

const COUNT_PER_SIDE = 38;   // embers per side
const TRAIL_LEN      = 18;   // longer trail = more visible streak
const SIDE_W         = 0.22; // each column is 22% of viewport width

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

interface Ember {
  x: number; y: number;
  vx: number; vy: number;
  life: number; decay: number;
  r: number;
  trail: Array<{ x: number; y: number }>;
  heat: number;
  side: 'left' | 'right';
}

function heatColor(heat: number, alpha: number): string {
  let r: number, g: number, b: number;
  if (heat < 0.3) {
    const t = heat / 0.3;
    r = Math.round(200 + t * 45); g = Math.round(30 + t * 88); b = Math.round(5 + t * 5);
  } else if (heat < 0.6) {
    const t = (heat - 0.3) / 0.3;
    r = 245; g = Math.round(118 + t * 67); b = Math.round(10 + t * 30);
  } else {
    const t = (heat - 0.6) / 0.4;
    r = 255; g = Math.round(185 + t * 55); b = Math.round(40 + t * 120);
  }
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

function spawnEmber(w: number, h: number, side: 'left' | 'right', stagger = false): Ember {
  // Nearly straight up — vy strongly negative, tiny vx
  const speed = rand(0.8, 2.2);
  const x = side === 'left'
    ? rand(0, w * SIDE_W)
    : rand(w * (1 - SIDE_W), w);
  return {
    x,
    y:     stagger ? rand(0, h) : h + rand(0, 60),
    vx:    rand(-0.35, 0.35),
    vy:    -speed,
    life:  stagger ? rand(0, 1) : 0,
    decay: rand(0.003, 0.009),   // slow decay → long visible lifetime
    r:     rand(1.5, 3.8),
    trail: [],
    heat:  rand(0.25, 1.0),
    side,
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
      // Stagger initial positions so column is immediately filled top-to-bottom
      embers.current = [
        ...Array.from({ length: COUNT_PER_SIDE }, (_, i) =>
          spawnEmber(canvas.width, canvas.height, 'left',  i < COUNT_PER_SIDE * 0.6)),
        ...Array.from({ length: COUNT_PER_SIDE }, (_, i) =>
          spawnEmber(canvas.width, canvas.height, 'right', i < COUNT_PER_SIDE * 0.6)),
      ];
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const W = canvas!.width;
      const H = canvas!.height;
      c.clearRect(0, 0, W, H);

      noiseT.current += 0.018;
      const noise = noiseT.current;

      for (let i = 0; i < embers.current.length; i++) {
        const p = embers.current[i];

        if (p.life >= 1 || p.y < -80) {
          embers.current[i] = spawnEmber(W, H, p.side);
          continue;
        }

        p.life += p.decay;

        // Gentle convective wobble — mostly vertical, slight lateral sway
        const wx = Math.sin(noise * 1.8 + i * 2.3) * 0.10
                 + Math.cos(noise * 1.2 + i * 3.7) * 0.06;
        p.vx += wx;
        p.vx *= 0.92;   // strong horizontal damping — keeps rising nearly straight
        p.vy *= 0.991;  // very slight vertical drag

        p.x += p.vx;
        p.y += p.vy;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();
        if (p.trail.length < 2) continue;

        const t = p.life;
        const life_alpha =
          t < 0.10 ? t / 0.10 :
          t < 0.65 ? 1 :
          Math.max(0, 1 - (t - 0.65) / 0.35);

        if (life_alpha < 0.01) continue;

        const curHeat = t < 0.4
          ? Math.min(1, p.heat + t * 0.6)
          : Math.max(0, p.heat - (t - 0.4) * 1.2);

        // Draw streak trail
        const n = p.trail.length;
        for (let j = 1; j < n; j++) {
          const segFrac  = j / (n - 1);
          const segAlpha = life_alpha * segFrac * segFrac;
          const segHeat  = curHeat * (0.25 + 0.75 * segFrac);
          const segWidth = p.r * segFrac * 2.4;
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

        // Bright head glow
        const headR = p.r * (1 - t * 0.4);
        if (headR > 0.4 && life_alpha > 0.02) {
          try {
            const grd = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, headR * 3);
            grd.addColorStop(0,   heatColor(Math.min(1, curHeat + 0.25), life_alpha));
            grd.addColorStop(0.4, heatColor(curHeat, life_alpha * 0.55));
            grd.addColorStop(1,   heatColor(Math.max(0, curHeat - 0.25), 0));
            c.beginPath();
            c.arc(p.x, p.y, headR * 3, 0, Math.PI * 2);
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
      <svg aria-hidden style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <defs>
          <filter id={`ember-${filterId}`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.018 0.032" numOctaves={2} seed={11} result="turb">
              <animate attributeName="baseFrequency" values="0.018 0.032;0.024 0.042;0.018 0.032" dur="5s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={3} xChannelSelector="R" yChannelSelector="G" />
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
