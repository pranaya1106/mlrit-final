'use client';

/** CIE — Pillars as cursor-spotlight cards (Linear-style). */

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { SectionHead, EASE, IN_VIEW } from './cieShared';

const OBJECTIVES = [
  { n: '01', t: 'Foster innovation', b: 'Innovation and entrepreneurial thinking as everyday habits — not one-week competitions.' },
  { n: '02', t: 'Build the room', b: 'Facilities and resources that let the ambitious go from idea to working prototype.' },
  { n: '03', t: 'Open the door', b: 'Direct connections to mentors and founders who reply, review and open the next door.' },
  { n: '04', t: 'Back the founders', b: 'Support student-led startups — from the deck to DPIIT registration and the first customer.' },
  { n: '05', t: 'Bring the stage', b: 'Hackathons, workshops and speaker series that give every good idea an audience.' },
  { n: '06', t: 'Bridge two worlds', b: 'Sit at the intersection of academia and industry — turn coursework into launched product.' },
];

function SpotlightCard({ n, t, b }: { n: string; t: string; b: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - r.left}px`);
    el.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}>
      <div
        ref={ref}
        onMouseMove={onMove}
        className="cie-spot group relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7 md:p-9 transition-colors duration-300 hover:border-primary/40"
      >
        <span aria-hidden className="cie-spot-glow pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <span className="font-sans font-black text-white/15 text-[clamp(2.6rem,4vw,3.6rem)] leading-none tracking-tighter-3 tabular-nums transition-colors duration-500 group-hover:text-primary">
              {n}
            </span>
            <span className="font-mono text-[0.56rem] font-bold tracking-[0.24em] uppercase text-white/30">Pillar</span>
          </div>
          <h3 className="mt-7 font-sans font-black text-white text-[clamp(1.3rem,2vw,1.7rem)] leading-tight tracking-tight">{t}</h3>
          <p className="mt-3 text-white/55 text-[0.98rem] leading-[1.7]">{b}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function CiePillars() {
  return (
    <section id="pillars" className="relative bg-black py-20 md:py-32 overflow-hidden border-t border-white/[0.08]">
      <div className="relative max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHead
          eyebrow="How we work"
          index="§ 01 → 06"
          title={<>Six ways of moving.</>}
          lead="Innovation as an everyday habit — the principles the room runs on."
        />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {OBJECTIVES.map((o) => (
            <SpotlightCard key={o.n} n={o.n} t={o.t} b={o.b} />
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .cie-spot-glow {
          background: radial-gradient(260px circle at var(--x, 50%) var(--y, 50%), rgba(232, 93, 4, 0.18), transparent 62%);
        }
      `}</style>
    </section>
  );
}
