'use client';

import { useEffect, useRef, useId } from 'react';

// Flame-streak ember cursor — tiny comet-tail sparks floating up from cursor.
// Each ember stores its last N positions so we draw a real pixel trail,
// not just a single-frame gradient line that disappears instantly.

const PARTICLE_COUNT = 44;
const CANVAS_W = 180;
const CANVAS_H = 200;
const CX = CANVAS_W / 2;
const BASE_Y = CANVAS_H - 12;

// Trail: store last this many positions per particle
const TRAIL_LEN = 12;

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;    // 0→1
  decay: number;
  r: number;       // head radius
  // ring buffer of past positions
  trail: Array<{ x: number; y: number }>;
  // color: 0=deep-red, 1=white-hot
  heat: number;
}

// Color stops
function heatColor(heat: number, alpha: number): string {
  // 0   → deep crimson  200,30,5
  // 0.3 → orange        245,118,10
  // 0.6 → amber         255,185,40
  // 1.0 → white-spark   255,240,160
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

function spawnEmber(): Ember {
  const angle = rand(-Math.PI * 0.6, -Math.PI * 0.4); // mostly upward
  const speed = rand(1.4, 3.8);
  return {
    x:     CX + rand(-16, 16),
    y:     BASE_Y + rand(-5, 5),
    vx:    Math.cos(angle) * speed * rand(0.2, 0.8),
    vy:    Math.sin(angle) * speed,
    life:  rand(0, 0.3),   // stagger start
    decay: rand(0.007, 0.016),
    r:     rand(1.5, 3.8),
    trail: [],
    heat:  rand(0.35, 0.9),
  };
}

export default function CameFireCursor() {
  const filterId  = useId().replace(/:/g, '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const embers    = useRef<Ember[]>(Array.from({ length: PARTICLE_COUNT }, spawnEmber));
  const rafRef    = useRef(0);
  const noiseT    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    const SELECTOR = 'a,button,[role="button"],[role="tab"],input,select,textarea';

    const onMove = (e: MouseEvent) => {
      wrap.style.left = `${e.clientX - CANVAS_W / 2}px`;
      wrap.style.top  = `${e.clientY - CANVAS_H + 12}px`;
    };
    const onEnter = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(SELECTOR)) {
        wrap.style.opacity = '1';
      }
    };
    const onLeave = (e: MouseEvent) => {
      if (!(e.relatedTarget as HTMLElement | null)?.closest(SELECTOR)) {
        wrap.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onEnter, { passive: true });
    document.addEventListener('mouseout',  onLeave, { passive: true });

    function draw() {
      rafRef.current = requestAnimationFrame(draw);

      // Full clear each frame — trail is stored in particle data, not canvas state
      c.clearRect(0, 0, CANVAS_W, CANVAS_H);

      noiseT.current += 0.03;
      const noise = noiseT.current;

      for (let i = 0; i < embers.current.length; i++) {
        const p = embers.current[i];

        if (p.life >= 1) {
          embers.current[i] = spawnEmber();
          continue;
        }

        p.life += p.decay;

        // Convective wobble
        const wx = Math.sin(noise * 2.2 + i * 1.7) * 0.12
                 + Math.cos(noise * 1.5 + i * 3.1) * 0.08;
        p.vx += wx;
        p.vx *= 0.95;
        p.vy *= 0.985;  // slight drag

        p.x += p.vx;
        p.y += p.vy;

        // Store trail point
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > TRAIL_LEN) p.trail.shift();

        if (p.trail.length < 2) continue;

        const t    = p.life;
        // Particle alpha envelope: ramp up → hold → ramp down
        const life_alpha = t < 0.15
          ? t / 0.15
          : t < 0.7
            ? 1
            : Math.max(0, 1 - (t - 0.7) / 0.3);

        if (life_alpha < 0.01) continue;

        // Heat shifts hotter as ember rises, then cools
        const curHeat = t < 0.45
          ? Math.min(1, p.heat + t * 0.5)
          : Math.max(0, p.heat - (t - 0.45) * 1.1);

        // Draw trail: iterate segments from oldest (tail) to newest (head)
        const n = p.trail.length;
        for (let j = 1; j < n; j++) {
          const segFrac  = j / (n - 1);           // 0=tail, 1=head
          const segAlpha = life_alpha * segFrac * segFrac; // quadratic falloff toward tail
          const segHeat  = curHeat * (0.3 + 0.7 * segFrac); // cooler at tail
          const segWidth = p.r * segFrac * 2.2;   // thicker at head

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
          } catch { /* gradient bounds error */ }
        }
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
      <svg
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`ember-${filterId}`} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves={2} seed={4} result="turb">
              <animate attributeName="baseFrequency" values="0.03 0.05;0.04 0.065;0.03 0.05" dur="3.2s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={5} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        ref={wrapRef}
        aria-hidden="true"
        style={{
          position:      'fixed',
          width:         CANVAS_W,
          height:        CANVAS_H,
          pointerEvents: 'none',
          zIndex:        9999,
          opacity:       0,
          transition:    'opacity 0.2s ease',
          filter:        `url(#ember-${filterId})`,
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
