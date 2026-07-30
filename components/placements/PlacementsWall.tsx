'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HIGHLIGHTS = [
  { val: '81%',     lbl: 'Placement Rate',       sub: 'Consistently, every year' },
  { val: '621',     lbl: 'Offers · Batch 2026',  sub: 'From 37 companies'         },
  { val: '₹58 LPA', lbl: 'Highest Package',      sub: 'Palo Alto Networks · 2023' },
  { val: '7,000+',  lbl: 'Alumni in MNCs',       sub: 'Across the globe'          },
];

const TOP_RECRUITERS = [
  'Microsoft', 'Amazon', 'ServiceNow', 'Palo Alto Networks', 'Boeing',
  'TCS', 'Infosys', 'Capgemini', 'Wipro', 'HCL Tech', 'Tata Technologies',
  'Virtusa', 'EPAM', 'Cognizant', 'Accenture',
];

export default function PlacementsWall() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    const NODES = 72, MAX_DIST = 200, R = 2.2, SPEED = 0.32;
    type N = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: N[] = [];
    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    };
    const mkNode = (): N => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
      r: R + Math.random() * 1.2, accent: Math.random() < 0.14,
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
          const alpha = (1 - d / MAX_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = (a.accent || b.accent)
            ? `rgba(255,140,30,${alpha})`
            : `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.accent ? 'rgba(255,150,50,0.85)' : 'rgba(255,255,255,0.5)';
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    init();
    tick();
    const onR = () => init();
    window.addEventListener('resize', onR);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onR); };
  }, []);

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Canvas net */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden />

      {/* Colour orbs */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[560px] h-[560px] rounded-full bg-primary/25 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#c26a2b]/25 blur-[120px]" />

      {/* Content */}
      <div className="relative w-full px-8 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md text-warm font-sans font-extrabold text-[0.72rem] tracking-[0.24em] uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-warm animate-pulse" />
          Training &amp; Placement Cell
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.1 }}
          className="font-sans font-black tracking-tighter-2 leading-[0.94] text-white text-[clamp(3rem,8vw,7.5rem)] max-w-[1250px]"
        >
          Where{' '}
          <span
            className="font-display italic font-medium"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, #f2b56b 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            careers
          </span>
          <br />
          take flight.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-8 text-white/78 leading-relaxed text-[clamp(1.05rem,1.35vw,1.45rem)] max-w-[900px]"
        >
          Twenty-one years. Thousands of alumni across Fortune-500 companies, global MNCs and
          high-growth startups. Every year, MLRIT places <strong className="text-warm">81%+ of its graduates</strong> —
          this is what makes it possible.
        </motion.p>

        {/* Highlight cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1200px]"
        >
          {HIGHLIGHTS.map((s, i) => (
            <motion.div
              key={s.lbl}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-5 md:p-6 overflow-hidden group"
            >
              <span
                aria-hidden
                className="absolute -top-2 -right-2 font-display italic font-black text-[5.5rem] leading-none tracking-tighter text-white/[0.05] group-hover:text-warm/25 transition-colors duration-500 select-none"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative">
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.22em] text-warm/80 uppercase">
                  {String(i + 1).padStart(2, '0')} · Highlight
                </div>
                <div className="mt-2 font-sans font-black tracking-tighter-2 text-white text-[clamp(1.6rem,2.8vw,2.3rem)] leading-none">
                  {s.val}
                </div>
                <div className="mt-2 font-sans font-bold text-white/95 text-[0.95rem] tracking-tight">
                  {s.lbl}
                </div>
                <div className="mt-1 font-mono text-[0.66rem] tracking-[0.14em] uppercase text-white/50 leading-tight">
                  {s.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recruiter marquee row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-14 relative overflow-hidden"
        >
          <div className="font-mono text-[0.68rem] font-extrabold tracking-[0.24em] uppercase text-white/45 mb-4">
            Recent Recruiters
          </div>
          <div className="relative">
            <div
              aria-hidden
              className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent z-10 pointer-events-none"
            />
            <div
              aria-hidden
              className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent z-10 pointer-events-none"
            />
            <div className="flex gap-3 flex-wrap">
              {TOP_RECRUITERS.map((c) => (
                <span
                  key={c}
                  className="inline-block px-4 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-md font-sans font-semibold text-[0.86rem] text-white/85 hover:border-warm/40 hover:text-warm transition-colors"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85 }}
          className="mt-12 flex flex-wrap gap-3"
        >
          <Link
            href="/placements/statistics"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-warm text-ink font-sans font-bold text-[0.95rem] hover:bg-white transition-colors"
          >
            View Placement Statistics →
          </Link>
          <Link
            href="/placements/support"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-md text-white font-sans font-semibold text-[0.95rem] hover:bg-white/15 transition-colors"
          >
            Reach Placements Cell
          </Link>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" className="w-full block" style={{ height: '56px' }}>
          <path d="M0 56 C360 0 1080 0 1440 56 L1440 56 L0 56Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
