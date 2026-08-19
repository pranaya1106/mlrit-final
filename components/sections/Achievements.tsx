'use client';

import { motion } from 'framer-motion';

import { sectionDomId, useMergedSection } from '@/lib/preview/context';

const RANKS = [
  { num: '201',  title: 'NIRF Rankings 2024',       sub: '201–300 Band · Engineering Category', tint: '#e85d04' },
  { num: '#6',   title: 'Times Engineering Survey', sub: '6th in Telangana',                    tint: '#1F6B24' },
  { num: 'AAAA', title: 'Careers360 Rating',        sub: 'Four-A Accredited Institution',       tint: '#c26a2b' },
];

const BUBBLES = [
  { name: 'NAAC',         src: '/legacy/nirf/naac.svg',         x: 0,    y: 0,    size: 'lg', cx: 260, cy: 240 },
  { name: 'AICTE',        src: '/legacy/nirf/aicte.svg',        x: -120, y: -120, size: 'md', cx: 90,  cy: 90  },
  { name: 'The Week',     src: '/legacy/nirf/the%20week.svg',   x: 120,  y: -120, size: 'md', cx: 405, cy: 75  },
  { name: 'ARIIA',        src: '/legacy/nirf/arha.svg',         x: 155,  y: 20,   size: 'sm', cx: 445, cy: 220 },
  { name: 'NBA',          src: '/legacy/nirf/nba.svg',          x: 90,   y: 145,  size: 'md', cx: 410, cy: 395 },
  { name: 'Dataquest',    src: '/legacy/nirf/dataquest.svg',    x: -90,  y: 145,  size: 'md', cx: 205, cy: 420 },
  { name: 'Gyaan Vigyan', src: '/legacy/nirf/gyaanvigyan.svg',  x: -155, y: 20,   size: 'sm', cx: 75,  cy: 295 },
];

// SVG lines connecting bubbles
const LINES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1],
];

const sizePx = (s: string) =>
  s === 'lg'
    ? 'w-32 h-32 md:w-36 md:h-36'
    : s === 'md'
    ? 'w-24 h-24 md:w-28 md:h-28'
    : 'w-20 h-20 md:w-24 md:h-24';

/**
 * Fallback copy. Used whenever the CMS lookup in app/page.tsx fails, returns
 * nothing, or returns a row missing any field — the section must always render
 * complete text, never a blank or half-filled headline.
 */
const DEFAULT_HEADLINE_LEAD = 'Accreditations';
const DEFAULT_HEADLINE_ACCENT = 'and Approvals.';
const DEFAULT_BODY =
  'AICTE, NAAC, NBA, ARIIA and more — MLRIT is recognised by every leading national body for academic excellence, programme quality and innovation.';

type AchievementsProps = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
};

export default function Achievements(props: AchievementsProps) {
  // Live-preview draft wins over the saved props; fallbacks below are unchanged.
  const { headlineLead, headlineAccent, body } = useMergedSection('home/achievements', props);

  const lead = headlineLead?.trim() || DEFAULT_HEADLINE_LEAD;
  const accent = headlineAccent?.trim() || DEFAULT_HEADLINE_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;

  return (
    <div id={sectionDomId('home/achievements')}>
    <section id="achievements" className="relative bg-snow py-16 md:py-24 overflow-hidden">
      {/* Decorative blobs */}
      <div aria-hidden className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-secondary/[0.10] blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute top-1/2 -right-32 w-[420px] h-[420px] rounded-full bg-gold-400/[0.10] blur-[100px] pointer-events-none" />
      <div aria-hidden className="absolute -bottom-32 left-1/2 w-[420px] h-[420px] rounded-full bg-primary/[0.06] blur-[100px] pointer-events-none" />
      {/* Faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className="relative w-full px-6 md:px-10 lg:px-16 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-20 items-center">
        {/* Left column — headline + rank list */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.78rem] tracking-[0.24em] uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Recognition
          </span>

          <h2 className="mt-6 font-sans font-black tracking-tighter-2 leading-[0.98] text-foreground text-[clamp(2.6rem,5.4vw,4.8rem)]">
            {lead}{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text',
                WebkitTextFillColor: 'transparent', color: 'transparent',
              }}
            >
              {accent}
            </span>
          </h2>

          <p className="mt-6 max-w-[620px] text-foreground/75 leading-[1.7] text-[clamp(1.05rem,1.25vw,1.2rem)]">
            {bodyText}
          </p>

          <ul className="mt-10 space-y-3">
            {RANKS.map((r, i) => (
              <motion.li
                key={r.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 6 }}
                className="group relative grid grid-cols-[120px_1fr_auto] items-center gap-5 rounded-2xl bg-white border border-border p-5 md:p-6 hover:border-transparent hover:shadow-[0_18px_40px_-16px_rgba(0,0,0,0.18)] transition-shadow duration-500 overflow-hidden"
              >
                <span
                  aria-hidden
                  className="absolute left-0 inset-y-0 w-1 transition-all duration-500 group-hover:w-2"
                  style={{ background: r.tint }}
                />
                <div
                  className="pl-3 font-display italic font-black text-[clamp(2.4rem,3.6vw,3.2rem)] leading-none tracking-tighter-2 transition-transform duration-500 origin-left group-hover:scale-[1.08]"
                  style={{ color: r.tint }}
                >
                  {r.num}
                </div>
                <div>
                  <div className="font-sans font-extrabold text-foreground text-[1.06rem] tracking-tight">
                    {r.title}
                  </div>
                  <div className="mt-1 text-muted text-[0.92rem] leading-snug">{r.sub}</div>
                </div>
                <span
                  aria-hidden
                  className="font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ color: r.tint }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right column — constellation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-square max-w-[560px] mx-auto w-full"
        >
          {/* pulse rings around the core */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 md:w-52 md:h-52 rounded-full border-2 border-primary/25 animate-ping"
            style={{ animationDuration: '4s' }}
          />
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-64 md:h-64 rounded-full border border-primary/15 animate-ping"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          />

          {/* Orbit rings — decorative dashed circles */}
          {[220, 320, 420].map((d) => (
            <div
              key={d}
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/12"
              style={{ width: d, height: d }}
            />
          ))}

          <div className="absolute inset-0 origin-center scale-[0.8] sm:scale-95 md:scale-100">
            <svg viewBox="0 0 520 480" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="rgba(232, 93, 4, 0.35)" />
                  <stop offset="1" stopColor="rgba(31, 107, 36, 0.30)" />
                </linearGradient>
              </defs>
              {LINES.map(([a, b], i) => (
                <line
                  key={i}
                  x1={BUBBLES[a].cx}
                  y1={BUBBLES[a].cy}
                  x2={BUBBLES[b].cx}
                  y2={BUBBLES[b].cy}
                  stroke="url(#lineGrad)"
                  strokeWidth={1.4}
                  strokeDasharray="4 5"
                />
              ))}
            </svg>

            {BUBBLES.map((b, i) => {
              const isCore = i === 0;
              return (
                <div
                  key={b.name}
                  className="absolute top-1/2 left-1/2"
                  style={{ transform: `translate(calc(-50% + ${b.x}px), calc(-50% + ${b.y}px))` }}
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.12 }}
                    className={`group relative rounded-full bg-white grid place-items-center p-3 transition-shadow duration-500 ${
                      isCore
                        ? 'border-2 border-primary shadow-[0_16px_40px_-8px_rgba(232,93,4,0.35)]'
                        : 'border border-border shadow-[0_10px_28px_-8px_rgba(17,17,17,0.15)] hover:border-primary hover:shadow-[0_18px_44px_-10px_rgba(232,93,4,0.28)]'
                    } ${sizePx(b.size)}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={b.src} alt={b.name} className="max-w-full max-h-full" />
                    <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[0.62rem] font-bold tracking-[0.16em] uppercase text-primary bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full border border-orange-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                      {b.name}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Bottom label */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.68rem] font-extrabold tracking-[0.28em] uppercase text-muted">
            7 · Trust marks
          </div>
        </motion.div>
      </div>
    </section>
    </div>
  );
}
