'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const DEFAULT_STATS = [
  { num: '2015', label: 'Autonomous Since' },
  { num: 'R25',  label: 'Current Regulation' },
  { num: 'OBE',  label: 'Framework' },
  { num: '3',    label: 'Programmes' },
];

type Stat = { num: string; label: string };

export default function ExaminationsHero({
  title,
  italic,
  dek,
  crumbs,
  stats = DEFAULT_STATS,
}: {
  title: string;
  italic?: string;
  dek: string;
  crumbs: { label: string; href?: string }[];
  stats?: Stat[];
}) {
  return (
    <section className="relative overflow-hidden bg-green-hero text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-32 w-[560px] h-[560px] rounded-full bg-primary/20 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-32 w-[520px] h-[520px] rounded-full bg-[#46b85f]/25 blur-[120px]" />

      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative w-full px-8 md:px-12 lg:px-16 py-20 md:py-24 lg:py-28">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[0.78rem] tracking-[0.16em] uppercase text-white/60 mb-8">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2">
              {c.href ? <Link href={c.href} className="hover:text-primary transition-colors">{c.label}</Link> : c.label}
              {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
            </span>
          ))}
        </div>

        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/20 backdrop-blur-md text-warm font-sans font-extrabold text-[0.72rem] tracking-[0.24em] uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-warm animate-pulse" />
          Examinations
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-sans font-black tracking-tighter-2 leading-[0.98] text-white text-[clamp(2.6rem,7vw,6rem)] max-w-[1200px]"
        >
          {title}
          {italic && (
            <span
              className="block font-display italic font-medium mt-2"
              style={{
                background: 'linear-gradient(180deg, #fff 0%, #f2b56b 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {italic}
            </span>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 text-white/80 leading-relaxed text-[clamp(1.05rem,1.35vw,1.4rem)] max-w-[900px]"
        >
          {dek}
        </motion.p>

        {stats && stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-[1100px]"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md p-5 md:p-6 overflow-hidden"
              >
                <div className="font-mono text-[0.6rem] font-bold tracking-[0.2em] text-warm/80">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="mt-2 font-sans font-black tracking-tighter-2 text-white text-[clamp(1.4rem,2.4vw,2rem)] leading-none">
                  {s.num}
                </div>
                <div className="mt-2 font-mono text-[0.62rem] tracking-[0.14em] uppercase text-white/60 leading-tight">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none" className="w-full block" style={{ height: '56px' }}>
          <path d="M0 56 C360 0 1080 0 1440 56 L1440 56 L0 56Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
