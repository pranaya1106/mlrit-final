'use client';

import { useEffect, useRef } from 'react';
import { Stagger, StaggerItem } from '@/components/motion/Reveal';
import Reveal from '@/components/motion/Reveal';

const WALL_STATS = [
  { val: '81%',     lbl: 'Students getting placed' },
  { val: '7000+',   lbl: 'Alumni in MNCs'          },
  { val: '200+',    lbl: 'Campus visiting partners' },
  { val: '₹58 LPA', lbl: 'Highest package'         },
];

export default function PlacementsWall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    let raf = 0;
    const NODES = 62, MAX_DIST = 180, R = 2.2, SPEED = 0.38;
    type N = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: N[] = [];
    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = canvas.width = rect.width; H = canvas.height = rect.height;
    };
    const mkNode = (): N => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
      r: R + Math.random() * 1.2, accent: Math.random() < 0.12,
    });
    const init = () => { resize(); nodes = Array.from({ length: NODES }, mkNode); };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d > MAX_DIST) continue;
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = (a.accent || b.accent) ? `rgba(255,140,30,${alpha})` : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }
      }
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? 'rgba(255,140,30,0.85)' : 'rgba(255,255,255,0.55)';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    init();
    raf = requestAnimationFrame(tick);
    const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement!);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <section className="relative bg-ink text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/40 via-transparent to-black/80 pointer-events-none" />
      <div className="relative z-[2] max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-28 md:py-40">
        <Reveal>
          <span className="font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/55 mb-4 inline-block">
            Placements at MLRIT
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="font-sans font-extrabold leading-[0.96] tracking-tighter-2 text-white text-[clamp(2.8rem,6vw,5.5rem)] mb-5">
            Engineering careers<br />
            <span className="font-display italic font-medium text-warm">are built here.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="text-white/72 font-light leading-relaxed text-[1.1rem] max-w-[720px] mb-14">
            81% students placed every year — engineers from MLRIT land roles at the world&apos;s most respected organisations.
          </p>
        </Reveal>
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-8 border-t border-white/15 max-w-[920px]" delay={0.1}>
          {WALL_STATS.map((s) => (
            <StaggerItem key={s.lbl}>
              <div className="font-sans font-black text-white leading-none tracking-tighter-2 text-[clamp(1.7rem,2.6vw,2.6rem)]">{s.val}</div>
              <div className="mt-2 font-mono font-medium text-[0.68rem] tracking-[0.16em] uppercase text-white/55">{s.lbl}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
