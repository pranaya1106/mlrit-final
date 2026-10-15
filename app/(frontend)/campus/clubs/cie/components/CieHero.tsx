'use client';

/**
 * CIE — hero built on the club's banner video.
 *
 * Full-bleed autoplaying motion poster behind a legibility wash, with the CIE
 * logo, a masked-reveal headline, magnetic CTAs and an editorial detail strip.
 * Entrance animation respects prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useMotionValue, useSpring, type Variants } from 'framer-motion';
import { ArrowUpRight, ArrowDown } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
};
const lineReveal: Variants = {
  hidden: { y: '115%' },
  show: { y: 0, transition: { duration: 1, ease: EASE } },
};

export default function CieHero() {
  const reduced = !!useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white flex flex-col"
    >
      {/* Banner video */}
      <div aria-hidden className="absolute inset-0 z-0">
        <video
          src="/videos/cie-hero.mp4"
          poster="/images/clubs/cie-hero.svg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Legibility wash + vignette */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.5) 46%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.78) 100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.12) 38%, transparent 62%)' }}
        />
      </div>

      {/* Corner frame */}
      {['top-5 left-5 border-t border-l', 'top-5 right-5 border-t border-r', 'bottom-5 left-5 border-b border-l', 'bottom-5 right-5 border-b border-r'].map((c, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, scale: 0.6 }}
          animate={mounted ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.1, ease: EASE }}
          className={`pointer-events-none absolute z-[3] hidden md:block h-6 w-6 border-primary/60 ${c}`}
        />
      ))}

      {/* Top bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={mounted ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-[4] max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-16 pt-6 md:pt-8"
      >
        <div className="flex items-center justify-between gap-4">
          <a href="/campus/clubs" className="inline-flex items-center gap-2 font-mono text-[0.7rem] font-bold tracking-[0.24em] uppercase text-white/60 hover:text-primary transition-colors">
            ← Clubs &amp; Societies
          </a>
          <span className="font-mono text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/45 hidden md:inline">
            MLRIT · Centre for Innovation &amp; Entrepreneurship
          </span>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={mounted ? 'show' : 'hidden'}
        className="relative z-[4] flex-1 flex items-center"
      >
        <div className="max-w-[1440px] mx-auto w-full px-6 md:px-10 lg:px-16 py-16">
          {/* CIE logo */}
          <motion.img
            variants={rise}
            // eslint-disable-next-line @next/next/no-img-element
            src="/images/clubs/cie-logo-white.svg"
            alt="CIE — Centre for Innovation and Entrepreneurship"
            className="h-14 md:h-16 w-auto mb-7 select-none"
            draggable={false}
          />

          {/* Eyebrow */}
          <motion.div variants={rise} className="flex items-center gap-3">
            <span aria-hidden className="h-px w-10 bg-primary" />
            <span className="font-mono text-[0.72rem] font-bold tracking-[0.34em] uppercase text-primary">
              Ideate · Build · Innovate
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mt-7 font-sans font-black tracking-tighter-3 leading-[0.9] text-white text-[clamp(3rem,9vw,8.5rem)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={lineReveal} className="block">Making ideas</motion.span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span variants={lineReveal} className="block">
                <span className="cie-accent">happen.</span>
              </motion.span>
            </span>
          </h1>

          {/* Supporting line */}
          <motion.p variants={rise} className="mt-8 text-white/70 leading-[1.7] text-[1.05rem] md:text-[1.2rem] max-w-[58ch]">
            CIE is MLRIT&apos;s student-run innovation and entrepreneurship
            centre — where builders, designers and first-time founders turn
            curiosity into shipped work.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-3">
            <MagneticLink href="https://mlritcie.in" external primary reduced={reduced}>
              Visit mlritcie.in
              <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticLink>
            <MagneticLink href="#about" reduced={reduced}>
              Explore CIE
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            </MagneticLink>
          </motion.div>

          {/* Detail strip */}
          <motion.div variants={rise} className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
            {[
              ['Dundigal · Hyderabad', true],
              ['Student-run incubator', true],
              ['500+ builders', false],
            ].map(([label, muted], i) => (
              <div key={i} className="flex items-center gap-3">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" style={{ boxShadow: '0 0 8px rgba(232,93,4,0.7)' }} />
                <span className={`font-mono text-[0.64rem] font-bold tracking-[0.24em] uppercase ${muted ? 'text-white/55' : 'text-white/85'}`}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to read more"
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 1.3, ease: EASE }}
        className="group absolute left-1/2 bottom-7 -translate-x-1/2 z-[4] hidden sm:flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[0.54rem] font-bold tracking-[0.3em] uppercase text-white/55 group-hover:text-primary transition-colors">Scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-white/20">
          {!reduced && (
            <motion.span className="absolute left-0 top-0 block h-3 w-px bg-primary" animate={{ y: [-12, 36] }} transition={{ duration: 1.6, ease: 'easeInOut', repeat: Infinity }} />
          )}
        </span>
      </motion.a>

      <style jsx global>{`
        .cie-accent {
          background-image: linear-gradient(100deg, #ffffff 0%, #ffffff 30%, #ffc89a 46%, #e85d04 54%, #ffffff 72%, #ffffff 100%);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: cie-shine 6.5s linear infinite;
        }
        @keyframes cie-shine {
          from { background-position: 150% 0; }
          to { background-position: -150% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cie-accent { animation: none; }
        }
      `}</style>
    </section>
  );
}

// ─── Magnetic CTA ─────────────────────────────────────────────────────────────

function MagneticLink({
  href,
  external,
  primary,
  children,
  reduced,
}: {
  href: string;
  external?: boolean;
  primary?: boolean;
  children: React.ReactNode;
  reduced: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y, ...(primary ? { backgroundColor: '#e85d04', color: '#fff' } : {}) }}
      className={
        primary
          ? 'group inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] shadow-primary-glow transition-shadow duration-300 hover:shadow-[0_12px_44px_rgba(232,93,4,0.55)]'
          : 'group inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.07] text-white border border-white/20 backdrop-blur-sm hover:bg-white/[0.14] hover:border-white/40 transition-colors duration-300'
      }
    >
      {children}
    </motion.a>
  );
}
