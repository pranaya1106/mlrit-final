'use client';

import { useEffect, useRef, useId, RefObject } from 'react';

interface Props {
  startRef: RefObject<HTMLDivElement | null>;
  endRef:   RefObject<HTMLDivElement | null>;
}

// Flying ember particles matching the reference video:
// glowing orange/red dots scattered across the viewport, drifting upward
// and laterally with turbulent motion. Varying sizes and brightness.
// No trails — pure glowing blob particles.

const PARTICLE_COUNT = 120;

function rand(a: number, b: number) { return a + Math.random() * (b - a); }

interface Ember {
  x: number; y: number;
  vx: number; vy: number;
  life: number;   // 0→1
  decay: number;
  r: number;      // glow radius
  bright: number; // 0=deep red, 1=bright orange-white
}

// side: 'left' = left 20% of screen, 'right' = right 20%
function spawnEmber(w: number, h: number, side: 'left' | 'right', stagger = false): Ember {
  const x = side === 'left'
    ? rand(0, w * 0.20)
    : rand(w * 0.80, w);
  return {
    x,
    y:      stagger ? rand(h * 0.3, h) : h + rand(0, 60),
    vx:     rand(-0.4, 0.4),
    vy:     rand(-1.8, -0.5),   // upward only
    life:   stagger ? rand(0, 1) : 0,
    decay:  rand(0.003, 0.008),
    r:      rand(2.5, 12),
    bright: rand(0, 1),
  };
}

function emberColor(bright: number, alpha: number): [string, string] {
  // core: deep red → vivid orange → amber-white
  let cr: number, cg: number, cb: number;
  if (bright < 0.4) {
    const t = bright / 0.4;
    cr = Math.round(180 + t * 65); cg = Math.round(20 + t * 70); cb = 0;
  } else if (bright < 0.75) {
    const t = (bright - 0.4) / 0.35;
    cr = 245; cg = Math.round(90 + t * 80); cb = Math.round(t * 20);
  } else {
    const t = (bright - 0.75) / 0.25;
    cr = 255; cg = Math.round(170 + t * 70); cb = Math.round(20 + t * 120);
  }
  // halo: always a darker orange-red
  const hr = Math.round(cr * 0.55);
  const hg = Math.round(cg * 0.25);
  const hb = 0;
  return [
    `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`,
    `rgba(${hr},${hg},${hb},0)`,
  ];
}

export default function CameFireCursor({ startRef, endRef }: Props) {
  const filterId  = useId().replace(/:/g, '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const embers    = useRef<Ember[]>([]);
  const rafRef    = useRef(0);
  const noiseT    = useRef(0);
  const visibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = ctx;

    // Show embers only while scrolled between startRef and endRef
    let startVisible = false;
    let endVisible   = false;

    const updateVisibility = () => {
      // visible = startRef has left the top (scrolled past hero)
      //           AND endRef hasn't entered the top yet (not yet at HowItWorks)
      const active = startVisible && !endVisible;
      visibleRef.current = active;
      canvas.style.opacity = active ? '1' : '0';
    };

    const startObs = new IntersectionObserver(
      ([e]) => { startVisible = !e.isIntersecting; updateVisibility(); },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    );
    const endObs = new IntersectionObserver(
      ([e]) => { endVisible = e.isIntersecting; updateVisibility(); },
      { threshold: 0, rootMargin: '0px 0px 0px 0px' },
    );

    if (startRef.current) startObs.observe(startRef.current);
    if (endRef.current)   endObs.observe(endRef.current);

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Half on each side, most staggered so columns are full immediately
      embers.current = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const side: 'left' | 'right' = i < PARTICLE_COUNT / 2 ? 'left' : 'right';
        return spawnEmber(canvas.width, canvas.height, side, i % 3 !== 0);
      });
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    function draw() {
      rafRef.current = requestAnimationFrame(draw);
      const W = canvas!.width;
      const H = canvas!.height;
      c.clearRect(0, 0, W, H);

      noiseT.current += 0.016;
      const noise = noiseT.current;

      for (let i = 0; i < embers.current.length; i++) {
        const p = embers.current[i];

        if (p.life >= 1 || p.y < -20) {
          const side: 'left' | 'right' = i < PARTICLE_COUNT / 2 ? 'left' : 'right';
          embers.current[i] = spawnEmber(W, H, side);
          continue;
        }

        p.life += p.decay;

        // Turbulent drift — sideways sway + upward
        const wx = Math.sin(noise * 1.6 + i * 2.1) * 0.18
                 + Math.cos(noise * 0.9 + i * 4.3) * 0.12;
        p.vx += wx;
        p.vx *= 0.97;
        p.vy *= 0.998;

        p.x += p.vx;
        p.y += p.vy;

        // Alpha envelope: fade in → hold → fade out
        const t = p.life;
        const alpha =
          t < 0.08 ? t / 0.08 :
          t < 0.65 ? 1 :
          Math.max(0, 1 - (t - 0.65) / 0.35);

        if (alpha < 0.01) continue;

        // Brightness shifts over lifetime: peaks mid-life
        const liveBright = t < 0.5
          ? Math.min(1, p.bright + t * 0.4)
          : Math.max(0, p.bright - (t - 0.5) * 0.8);

        const [coreColor, haloColor] = emberColor(liveBright, alpha);

        // Outer halo glow (large, dim)
        const haloR = p.r * 2.8;
        try {
          const halo = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
          halo.addColorStop(0,   emberColor(liveBright, alpha * 0.45)[0]);
          halo.addColorStop(0.4, emberColor(liveBright, alpha * 0.2)[0]);
          halo.addColorStop(1,   haloColor);
          c.beginPath();
          c.arc(p.x, p.y, haloR, 0, Math.PI * 2);
          c.fillStyle = halo;
          c.fill();
        } catch { /* bounds */ }

        // Bright core
        try {
          const core = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          core.addColorStop(0,   `rgba(255,240,200,${(alpha * 0.9).toFixed(3)})`);
          core.addColorStop(0.3, coreColor);
          core.addColorStop(1,   emberColor(liveBright, 0)[0]);
          c.beginPath();
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fillStyle = core;
          c.fill();
        } catch { /* bounds */ }
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      startObs.disconnect();
      endObs.disconnect();
    };
  }, [startRef, endRef]);

  return (
    <>
      <svg aria-hidden style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <defs>
          <filter id={`ember-${filterId}`} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves={2} seed={5} result="turb">
              <animate attributeName="baseFrequency" values="0.012 0.018;0.016 0.024;0.012 0.018" dur="6s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="turb" scale={5} xChannelSelector="R" yChannelSelector="G" />
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
          opacity:       0,
          transition:    'opacity 0.8s ease',
          filter:        `url(#ember-${filterId})`,
          mixBlendMode:  'screen',
        }}
      />
    </>
  );
}
