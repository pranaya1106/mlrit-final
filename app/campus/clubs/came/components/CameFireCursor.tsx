'use client';

import { useEffect, useRef, useId } from 'react';

// Flame-streak ember cursor for CAME club.
// Each particle is a tiny elongated streak/trail — like the floating embers
// in the reference images: small bright sparks drifting upward with a comet tail.

// Color ramp: deep crimson → orange → bright amber
const DEEP   = [200,  30,   5] as const;
const ORANGE = [245, 118,  10] as const;
const AMBER  = [255, 185,  40] as const;
const SPARK  = [255, 240, 160] as const;  // white-hot centre

const PARTICLE_COUNT = 38;
const CANVAS_W = 160;
const CANVAS_H = 180;
const CX = CANVAS_W / 2;
const BASE_Y = CANVAS_H - 10;

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;    // 0→1
  decay: number;
  size: number;    // head radius
  trail: number;   // tail length multiplier
  hue: number;     // 0=deep, 1=spark
  angle: number;   // rotation of streak
  spin: number;    // angular velocity
}

function rand(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function lerpRgb(
  a: readonly [number, number, number],
  b: readonly [number, number, number],
  t: number,
): [number, number, number] {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function emberColor(hue: number, alpha: number): string {
  let rgb: [number, number, number];
  if (hue < 0.33) {
    rgb = lerpRgb(DEEP, ORANGE, hue / 0.33);
  } else if (hue < 0.66) {
    rgb = lerpRgb(ORANGE, AMBER, (hue - 0.33) / 0.33);
  } else {
    rgb = lerpRgb(AMBER, SPARK, (hue - 0.66) / 0.34);
  }
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha.toFixed(3)})`;
}

function spawnEmber(): Ember {
  // Spawn in a tight cluster at the bottom centre, spread outward
  const spread = rand(0, Math.PI * 2);
  const radius = rand(0, 14);
  return {
    x:     CX + Math.cos(spread) * radius,
    y:     BASE_Y + rand(-6, 6),
    vx:    rand(-1.1, 1.1),
    vy:    rand(-3.8, -1.6),       // mainly upward
    life:  0,
    decay: rand(0.008, 0.018),     // slow decay → long visible trail
    size:  rand(1.2, 3.2),
    trail: rand(3, 9),             // tail length = size × trail
    hue:   rand(0.3, 0.85),        // mid-orange to near-white-hot
    angle: Math.atan2(rand(-1, 1), rand(-1, 1)),
    spin:  rand(-0.06, 0.06),
  };
}

export default function CameFireCursor() {
  const filterId  = useId().replace(/:/g, '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const embers    = useRef<Ember[]>(Array.from({ length: PARTICLE_COUNT }, spawnEmber));
  const rafRef    = useRef(0);
  const noiseRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    // ── mouse tracking ────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      wrap.style.left = `${e.clientX - CANVAS_W / 2}px`;
      wrap.style.top  = `${e.clientY - CANVAS_H + 10}px`;
    };

    const SELECTOR = 'a,button,[role="button"],[role="tab"],input,select,textarea';

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

    // ── draw loop ─────────────────────────────────────────────────────────────
    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      // Fade trail: very light erase so streaks persist for a few frames
      c.globalCompositeOperation = 'source-over';
      c.fillStyle = 'rgba(0,0,0,0.18)';
      c.fillRect(0, 0, CANVAS_W, CANVAS_H);

      noiseRef.current += 0.028;
      const noise = noiseRef.current;

      for (let i = 0; i < embers.current.length; i++) {
        const p = embers.current[i];

        if (p.life >= 1) {
          embers.current[i] = spawnEmber();
          continue;
        }

        p.life += p.decay;

        // Turbulent drift — sin/cos wobble mimics hot-air convection
        const wobble = Math.sin(noise * 2.1 + i * 1.9) * 0.14
                     + Math.cos(noise * 1.4 + i * 2.7) * 0.09;
        p.vx += wobble;
        p.vx *= 0.96;
        p.vy -= rand(0, 0.04);   // slight upward acceleration (heat rise)

        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        const t = p.life;
        // Size: ember stays bright then shrinks and fades at end
        const headR = p.size * Math.max(0.2, 1 - t * 0.6);
        // Hue: shifts from orange→white-hot as it ages, then back to deep red
        const hue   = t < 0.5 ? p.hue + t * 0.3 : Math.max(0, p.hue - (t - 0.5) * 1.2);
        // Alpha: quick fade-in, long hold, fast fade-out tail
        const alpha = t < 0.12
          ? t / 0.12
          : t < 0.75
            ? 1
            : Math.max(0, 1 - (t - 0.75) / 0.25);

        if (alpha < 0.008 || headR < 0.3) continue;

        // --- Draw streak: a tapered line (tail) + bright dot (head) ---
        const tailLen = headR * p.trail * (1 - t * 0.4);
        const tx = Math.cos(p.angle + Math.PI * 0.5) * tailLen;
        const ty = Math.sin(p.angle + Math.PI * 0.5) * tailLen;

        // Tail gradient: bright at head → transparent at tip
        try {
          const tailGrad = c.createLinearGradient(p.x, p.y, p.x + tx, p.y + ty);
          tailGrad.addColorStop(0,   emberColor(Math.min(1, hue + 0.15), alpha * 0.9));
          tailGrad.addColorStop(0.4, emberColor(hue, alpha * 0.45));
          tailGrad.addColorStop(1,   emberColor(Math.max(0, hue - 0.3), 0));

          c.globalCompositeOperation = 'screen';
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p.x + tx, p.y + ty);
          c.strokeStyle = tailGrad;
          c.lineWidth   = headR * 1.6;
          c.lineCap     = 'round';
          c.stroke();

          // Bright core dot at the head
          const headGrad = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, headR * 1.8);
          headGrad.addColorStop(0,   emberColor(Math.min(1, hue + 0.35), alpha));
          headGrad.addColorStop(0.5, emberColor(Math.min(1, hue + 0.15), alpha * 0.7));
          headGrad.addColorStop(1,   emberColor(hue, 0));
          c.beginPath();
          c.arc(p.x, p.y, headR * 1.8, 0, Math.PI * 2);
          c.fillStyle = headGrad;
          c.fill();
        } catch { /* ignore rare gradient errors */ }
      }

      c.globalCompositeOperation = 'source-over';
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
      {/* SVG filter: turbulence warps the edges for organic fire distortion */}
      <svg
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`ember-${filterId}`} x="-40%" y="-40%" width="180%" height="180%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.035 0.055" numOctaves={2} seed={7} result="turb">
              <animate attributeName="baseFrequency" values="0.035 0.055;0.045 0.07;0.035 0.055" dur="3s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={7} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Canvas — follows cursor, only visible on interactive elements */}
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
          transition:    'opacity 0.22s ease',
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
