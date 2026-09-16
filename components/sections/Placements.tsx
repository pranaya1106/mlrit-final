'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

import { asGalleryItems } from '@/lib/content/sections';
import { recruiterLogosFrom } from '@/lib/placements';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';

type PlacementsProps = {
  logos?: unknown;
};

type MiniStat = { value: string; label: string; note: string };

const MINI_STATS: MiniStat[] = [
  { value: '5,000+', label: 'Students Placed',      note: 'in Top MNCs since 2005' },
  { value: '200+',   label: 'Recruiters on Campus', note: 'incl. IIT / IIM / NIT hirers' },
  { value: '18 LPA', label: 'Average · Top Quartile', note: 'Placed batch of 2025' },
  { value: '98 %',   label: 'Placement Rate',        note: 'Batch of 2025 · Verified' },
];

/** Split a logo list into two roughly-equal halves for the dual marquee. */
function splitLogos<T>(list: T[]): [T[], T[]] {
  const half = Math.ceil(list.length / 2);
  return [list.slice(0, half), list.slice(half)];
}

/** Count-up hook — animates 0 → target when the ref enters the viewport. */
function useCountUp(target: number, durationMs = 1400) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-30% 0px' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, durationMs]);
  return { ref, n };
}

export default function Placements(props: PlacementsProps) {
  const { logos } = useMergedSection('placements/recruiters', props);
  const recruiterLogos = recruiterLogosFrom(asGalleryItems(logos));
  const [rowA, rowB] = splitLogos(recruiterLogos);

  const highest = useCountUp(44);

  return (
    <div id={sectionDomId('placements/recruiters')}>
      <section
        id="placements"
        className="relative bg-paper grain-texture text-foreground overflow-hidden py-20 md:py-28"
      >
        {/* Soft warm glows */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{
            background:
              'radial-gradient(1200px 500px at 15% 20%, rgba(1,116,31,0.06) 0%, transparent 60%),' +
              'radial-gradient(1100px 500px at 90% 65%, rgba(196,154,16,0.06) 0%, transparent 60%)',
          }}
        />

        {/* Editorial dot-grid pattern — 22px lattice, soft ink dots, vignetted
            so the pattern quietly fades at the section edges. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.55]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(24, 20, 15, 0.09) 1px, transparent 1.4px)',
            backgroundSize: '22px 22px',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 65% at 50% 45%, #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 70% 65% at 50% 45%, #000 0%, rgba(0,0,0,0.6) 55%, transparent 100%)',
          }}
        />

        {/* Optional accent — one faint editorial hairline crosshair, off-center
            top-left, in the primary orange. Purely decorative. */}
        <div
          aria-hidden
          className="absolute top-[6%] left-[4%] w-[110px] h-[110px] pointer-events-none opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgba(232,93,4,0.35) 0 1px, transparent 1px 100%),' +
              'linear-gradient(0deg, rgba(232,93,4,0.35) 0 1px, transparent 1px 100%)',
            backgroundPosition: '50% 0, 0 50%',
            backgroundSize: '1px 100%, 100% 1px',
            backgroundRepeat: 'no-repeat, no-repeat',
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          {/* ── HEADER ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-end mb-14 md:mb-16"
          >
            <div>
              <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-primary/70" />
                <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
                  Placements · 2025 / 26
                </span>
              </div>
              <h2 className="mt-6 font-sans font-black tracking-tighter-2 leading-[1.02] text-foreground text-[clamp(2.2rem,4.4vw,3.8rem)]">
                Why MLRIT{' '}
                <span
                  className="font-display italic font-medium"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, var(--foreground) 0%, var(--primary) 115%)',
                    WebkitBackgroundClip: 'text', backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent', color: 'transparent',
                  }}
                >
                  gets hired.
                </span>
              </h2>
            </div>

            <p className="text-muted leading-[1.7] text-[1rem] max-w-[440px] lg:justify-self-end lg:text-right">
              A data-backed look at where our engineers go, what they earn, and
              which companies come back every year to recruit them.
            </p>
          </motion.div>

          {/* ── FEATURED HERO + STATS SIDEBAR ─────────────── */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-5 md:gap-6">
            {/* Featured card — massive number + company + quote */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden bg-ink text-white p-8 md:p-12 lg:p-14 min-h-[380px] md:min-h-[440px]"
            >
              {/* Warm gradient wash */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-90"
                style={{
                  background:
                    'radial-gradient(600px 400px at 100% 0%, rgba(232,93,4,0.28) 0%, transparent 60%),' +
                    'radial-gradient(600px 400px at 0% 100%, rgba(1,116,31,0.22) 0%, transparent 60%)',
                }}
              />
              {/* Faint hairline grid */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '48px 48px',
                }}
              />

              <div className="relative h-full flex flex-col justify-between">
                {/* Top eyebrow + company mark */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="font-mono text-[0.65rem] font-bold tracking-[0.24em] uppercase text-white/50">
                      Featured · Batch 2026
                    </span>
                    <div className="mt-1 font-sans font-medium text-white/85 text-[1rem]">
                      Highest Package of the Year
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-2 h-8 px-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-white/85">
                    Microsoft
                  </span>
                </div>

                {/* Massive numeric */}
                <div className="my-8 md:my-0">
                  <div className="flex items-baseline gap-3">
                    <span
                      ref={highest.ref}
                      className="font-sans font-black tracking-tighter-3 leading-[0.86] text-white text-[clamp(6rem,14vw,12rem)]"
                    >
                      {highest.n}
                    </span>
                    <span className="font-display italic font-medium text-primary text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.9]">
                      LPA
                    </span>
                  </div>
                  <div className="mt-4 font-sans font-medium text-white/70 text-[1.02rem] md:text-[1.1rem] max-w-[520px] leading-[1.55]">
                    Awarded to <span className="text-white font-semibold">Sai Loukhya Chundi</span> and{' '}
                    <span className="text-white font-semibold">Kakumanu Sailatha</span> — the two CSE
                    engineers now interning at Microsoft on ₹1.25 L / month stipends.
                  </div>
                </div>

                {/* Bottom: mini meta pills */}
                <div className="flex flex-wrap gap-2">
                  {['CSE · Batch 2026', '₹1.25 L / month stipend', 'On-campus offer'].map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center h-8 px-3 rounded-full bg-white/[0.06] border border-white/12 text-white/80 text-[0.78rem] font-medium backdrop-blur-sm"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Mini stats — 2×2 grid on the right */}
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {MINI_STATS.map((s, i) => (
                <MiniStatCard key={i} stat={s} index={i} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 text-center"
          >
            <Link
              href="/placements/overview"
              style={{ backgroundColor: '#e85d04' }}
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full text-white font-semibold text-[0.9rem] hover:shadow-primary-glow hover:-translate-y-[1px] transition-all duration-300"
            >
              Explore All Placements
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ── GLOBAL HIRING PARTNERS · dual marquee ────────── */}
        <div className="relative mt-16 md:mt-20">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <span aria-hidden className="h-px w-8 bg-muted/50" />
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-muted">
                Global Hiring Partners
              </span>
              <span aria-hidden className="h-px w-8 bg-muted/50" />
            </div>
          </div>

          {/* Row A — left to right */}
          <div
            className="relative overflow-hidden mb-3"
            style={{
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
            }}
          >
            <div className="flex w-max animate-marquee gap-10 md:gap-16 items-center py-3">
              {[...rowA, ...rowA].map((logo, i) => (
                <LogoCell key={`a-${i}`} src={logo.src} />
              ))}
            </div>
          </div>

          {/* Row B — right to left (reverse animation direction) */}
          <div
            className="relative overflow-hidden"
            style={{
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)',
            }}
          >
            <div
              className="flex w-max animate-marquee gap-10 md:gap-16 items-center py-3"
              style={{ animationDirection: 'reverse', animationDuration: '48s' }}
            >
              {[...rowB, ...rowB].map((logo, i) => (
                <LogoCell key={`b-${i}`} src={logo.src} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniStatCard({ stat, index }: { stat: MiniStat; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col justify-between h-full min-h-0 md:min-h-[180px] rounded-2xl md:rounded-3xl overflow-hidden p-4 md:p-6 border border-white/60 bg-white/45 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_20px_50px_-24px_rgba(24,20,15,0.18),inset_0_1px_0_rgba(255,255,255,0.65)] hover:border-white/80 hover:bg-white/60 hover:shadow-[0_28px_60px_-24px_rgba(24,20,15,0.24),inset_0_1px_0_rgba(255,255,255,0.75)] hover:-translate-y-1 transition-all duration-500"
      style={{
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        backdropFilter: 'blur(28px) saturate(160%)',
      }}
    >
      {/* Subtle inner sheen — top-left highlight fading down */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl md:rounded-3xl"
        style={{
          background:
            'radial-gradient(120% 80% at 0% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 55%),' +
            'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%)',
        }}
      />
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-primary/60 to-transparent"
      />
      <div className="relative z-10">
        <div className="font-sans font-black tracking-tighter-2 leading-[0.98] text-foreground text-[clamp(1.8rem,2.6vw,2.4rem)]">
          {stat.value}
        </div>
      </div>
      <div className="relative z-10 mt-4 md:mt-0">
        <div className="font-sans font-semibold text-foreground text-[0.94rem] md:text-[1rem] leading-[1.25]">
          {stat.label}
        </div>
        <div className="mt-1.5 text-muted text-[0.82rem] leading-[1.4]">
          {stat.note}
        </div>
      </div>
    </motion.div>
  );
}

function LogoCell({ src }: { src: string }) {
  return (
    <div className="flex-shrink-0 h-20 md:h-28 lg:h-32 w-40 md:w-56 lg:w-64 grid place-items-center rounded-2xl bg-white border border-border px-6 py-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.10)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        loading="lazy"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
