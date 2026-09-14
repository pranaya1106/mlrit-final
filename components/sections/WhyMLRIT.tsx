'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, ArrowRight } from 'lucide-react';

import { sectionDomId, useMergedSection } from '@/lib/preview/context';

const DEFAULT_BODY =
  'An integrated curriculum that gives equal weight to academics, employable skills, and sport.';

const DEFAULT_FOOTNOTE =
  'Founded in **2005** by the KMR Education Trust, headed by **Mr. Marri Laxman Reddy**. Located in Dundigal, Hyderabad. Affiliated to JNTUH. Granted autonomous status by the UGC in 2015.';

type WhyMLRITProps = {
  heading?: string;   // kept for CMS compat; layout ignores it in favour of the split headline
  body?: string;
  video?: string;     // kept for CMS compat
};

/**
 * Turn markdown-lite `**bold**` chunks into real <strong> elements.
 * Only bold is supported here — that's all the footnote needs.
 */
function renderRich(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function WhyMLRIT(props: WhyMLRITProps) {
  const { body } = useMergedSection('home/why-mlrit', props);
  const bodyText = body?.trim() || DEFAULT_BODY;

  return (
    <section
      id={sectionDomId('home/why-mlrit')}
      className="relative bg-cream grain-texture overflow-hidden py-20 md:py-28"
    >
      {/* Ambient soft glow — subtle radial blobs in brand tones */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          background:
            'radial-gradient(1100px 500px at 25% 40%, rgba(232,93,4,0.06) 0%, transparent 60%),' +
            'radial-gradient(900px 500px at 85% 70%, rgba(1,116,31,0.05) 0%, transparent 60%)',
        }}
      />

      {/* ── Decorative background artwork — full opacity everywhere. */}
      <img
        src="/vectors/whymlrit-background.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0]"
      />

      {/* Strong cream spotlight anchored precisely over the headline zone
          (top-left of the section). Fully opaque cream at the centre so
          the "Industry." word reads sharp, fading out to transparent at
          the edges so the ribbons stay visible everywhere else. */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[60%] lg:w-[52%] h-[70%] pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 32% 40%, rgba(250, 247, 240, 1) 0%, rgba(250, 247, 240, 0.95) 35%, rgba(250, 247, 240, 0.55) 65%, rgba(250, 247, 240, 0) 100%)',
        }}
      />

      <div className="relative z-[2] mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 grid lg:grid-cols-[1.35fr_1fr] gap-12 lg:gap-20 items-start">
        {/* ── LEFT — Editorial headline column ─────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Small caps eyebrow */}
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px w-8 bg-primary/70" />
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
              Curriculum · Sports · Life
            </span>
          </div>

          {/* Multi-line headline */}
          <h2 className="mt-8 font-sans font-black leading-[0.98] tracking-tighter-2 text-foreground text-[clamp(2.6rem,5.6vw,4.6rem)]">
            <span className="block">Industry.</span>
            <span
              className="block pb-[0.14em]"
              style={{
                backgroundImage: 'linear-gradient(90deg, var(--primary) 0%, #7a3b00 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                lineHeight: '1.08',
              }}
            >
              Integrated.
            </span>
            <span className="block font-display italic font-medium text-foreground/70 mt-1">
              Blended with sport.
            </span>
          </h2>

          {/* Body */}
          <p className="mt-8 text-foreground/80 leading-[1.6] text-[clamp(1rem,1.15vw,1.15rem)] max-w-[560px]">
            {bodyText}
          </p>

          {/* Founding footnote */}
          <p className="mt-4 text-foreground/60 leading-[1.7] text-[0.95rem] max-w-[560px]">
            {renderRich(DEFAULT_FOOTNOTE)}
          </p>

          {/* CTA row — orange rectangular button + phone pill */}
          <div className="mt-10 flex flex-col gap-4 max-w-[520px]">
            <Link
              href="/admissions/overview"
              style={{ backgroundColor: '#e85d04' }}
              className="group inline-flex items-center gap-3 h-12 md:h-14 pl-5 pr-5 rounded-xl text-white font-semibold text-[0.95rem] md:text-[1rem] tracking-[-0.005em] hover:shadow-primary-glow hover:-translate-y-[1px] transition-all duration-300 ease-out-quart w-fit"
            >
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-white/20 group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              Start Your Application
            </Link>

            {/* Phone pill — admissions contact */}
            <a
              href="tel:+919652226061"
              className="group inline-flex items-center gap-4 h-14 md:h-16 pl-2 pr-6 rounded-full bg-white border border-border hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <span
                className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full text-white flex-shrink-0"
                style={{ backgroundColor: '#e85d04' }}
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase text-muted">
                  Admissions · Talk to Us
                </span>
                <span className="mt-1.5 font-sans font-bold text-foreground text-[1.15rem] md:text-[1.35rem] tabular-nums tracking-tight">
                  9652226061
                </span>
              </div>
            </a>
          </div>
        </motion.div>

        {/* ── RIGHT — Portrait campus card with overlay ────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-2xl md:rounded-[24px] bg-ink shadow-[0_40px_90px_-30px_rgba(15,15,15,0.35)] aspect-[3/4] max-h-[640px]">
            <video
              src="/videos/sports.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom vignette */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgba(12,12,14,0) 0%, rgba(12,12,14,0.85) 100%)',
              }}
            />

            {/* Caption stack */}
            <div className="absolute inset-x-0 bottom-0 z-[2] p-6 md:p-8 pointer-events-none">
              <div className="font-mono text-[0.62rem] md:text-[0.68rem] font-bold tracking-[0.24em] uppercase text-white/70">
                Since 2005 — Dundigal, Hyderabad
              </div>
              <div className="mt-3 font-sans font-black text-white leading-[1.02] tracking-tighter-2 text-[clamp(1.6rem,2.6vw,2.2rem)]">
                Twenty acres.
              </div>
              <div className="mt-1 font-display italic font-medium text-white/80 text-[clamp(1.1rem,1.7vw,1.4rem)] leading-[1.15]">
                Engineered for the next generation.
              </div>
            </div>
          </div>

          {/* Small caption below the card */}
          <div className="mt-4 flex items-center gap-2 justify-end">
            <span aria-hidden className="h-px w-6 bg-muted/50" />
            <span className="font-mono text-[0.62rem] font-bold tracking-[0.28em] uppercase text-muted">
              KMR Education Trust
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
