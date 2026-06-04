'use client';

import { useEffect, useRef, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

// ── Floating values data ───────────────────────────────────────────────────
const VALUES = [
  { label: 'Integrity',   color: 'bg-green-50 border-green-200 text-secondary',   delay: '0s',    dur: '4s'  },
  { label: 'Inclusivity', color: 'bg-orange-50 border-orange-200 text-primary',   delay: '0.8s',  dur: '5s'  },
  { label: 'Empathy',     color: 'bg-green-50 border-green-200 text-secondary',   delay: '1.6s',  dur: '4.5s'},
  { label: 'Excellence',  color: 'bg-orange-50 border-orange-200 text-primary',   delay: '0.4s',  dur: '5.5s'},
  { label: 'Innovation',  color: 'bg-green-50 border-green-200 text-secondary',   delay: '1.2s',  dur: '3.8s'},
];

// ── Steps data ─────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: 1,
    title: 'Explore Programs',
    desc: 'Browse our 10 B.Tech, M.Tech & MBA programmes and find the one that aligns with your passion and career goals.',
  },
  {
    num: 2,
    title: 'Check Eligibility',
    desc: 'Review EAMCET / ICET / PGECET cutoffs, minimum qualifying marks and reservation criteria for each programme.',
  },
  {
    num: 3,
    title: 'Submit Application',
    desc: 'Apply online via mlrit.ac.in or walk in to the admissions office. Keep your hall ticket and score card handy.',
  },
  {
    num: 4,
    title: 'Document Verification',
    desc: 'Submit original mark sheets, transfer certificate, caste certificate (if applicable) and passport-size photographs.',
  },
  {
    num: 5,
    title: 'Admission Confirmation',
    desc: 'Pay the semester fee, collect your allotment letter and student ID, and begin your MLRIT journey.',
  },
];

// ── Stats data ─────────────────────────────────────────────────────────────
const STATS = [
  { value: '10+',     label: 'Programmes',       sub: 'B.Tech · M.Tech · MBA' },
  { value: '621',     label: 'Placements',        sub: '2025–26 batch offers'  },
  { value: '200+',    label: 'Hiring Partners',   sub: 'Campus recruiters'     },
  { value: '₹51 LPA', label: 'Top Package',       sub: 'Highest offer 2025–26' },
];

export default function AdmissionsPage() {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      {/* ── Floating-values keyframes ──────────────────────────────────── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-14px) rotate(1deg); }
        }
        .value-float { animation: float var(--dur) ease-in-out var(--delay) infinite; }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <PageHeader
        variant="green"
        eyebrow="Admissions 2025–26"
        title="Your journey"
        italic="starts here."
        dek="MLRIT welcomes students who are curious, driven and ready to shape the future. Our streamlined admissions process is designed to be transparent, merit-based and accessible to all."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Admissions' }]}
      />

      {/* Hero CTAs */}
      <section className="bg-green-hero -mt-1 pb-14 md:pb-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 flex flex-wrap gap-4">
          <a
            href="https://mlrit.ac.in/admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-sans font-bold text-sm hover:bg-primary-hover transition-colors shadow-primary-glow"
          >
            Apply Now
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a
            href="/brochure-2025.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/25 text-white font-sans font-semibold text-sm hover:bg-white/20 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <path d="M8 2v8m-3-3 3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download Brochure
          </a>
        </div>
      </section>

      {/* ── How to Apply — Sticky heading + scroll-revealed steps ─────────── */}
      <section className="bg-cream-2 py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            {/* Sticky left */}
            <div className="lg:w-72 shrink-0">
              <div className="lg:sticky lg:top-28">
                <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">How to Apply</span>
                <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-foreground">
                  Five steps to<br />
                  <span className="font-display italic font-medium text-secondary">your seat.</span>
                </h2>
                <p className="mt-4 text-muted text-[0.96rem] leading-relaxed">
                  Our process is transparent and merit-driven. Follow these steps to secure your admission to MLRIT.
                </p>
                <div className="mt-8 hidden lg:flex flex-col gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.num}
                      onClick={() => stepRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                      className={`flex items-center gap-3 text-left px-3 py-2 rounded-lg transition-colors text-sm font-sans ${
                        activeStep === i
                          ? 'bg-secondary/10 text-secondary font-semibold'
                          : 'text-muted hover:text-foreground'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.65rem] font-bold shrink-0 transition-colors ${
                        activeStep === i ? 'bg-secondary text-white' : 'bg-border text-muted'
                      }`}>{s.num}</span>
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Steps list */}
            <div className="flex-1 flex flex-col gap-0">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  className="relative flex gap-6 py-8 group"
                >
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[22px] top-[68px] bottom-0 w-px bg-border"
                    />
                  )}
                  {/* Number pill */}
                  <div
                    className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${
                      activeStep === i
                        ? 'bg-secondary text-white shadow-secondary-glow scale-110'
                        : 'bg-white border-2 border-border text-muted'
                    }`}
                  >
                    {s.num}
                  </div>
                  {/* Content */}
                  <div
                    className={`transition-all duration-500 pt-1 ${
                      activeStep === i ? 'opacity-100' : 'opacity-50'
                    }`}
                  >
                    <h3
                      className={`font-sans font-bold text-[1.12rem] transition-colors duration-500 ${
                        activeStep === i ? 'text-foreground' : 'text-muted'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-2 text-muted text-[0.95rem] leading-relaxed max-w-prose">
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MLRIT Values — Floating cards ─────────────────────────────────── */}
      <section className="bg-white py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal preset="up">
            <div className="text-center mb-14">
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">Our Foundation</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-foreground">
                Values that guide<br />
                <span className="font-display italic font-medium text-primary">every decision.</span>
              </h2>
            </div>
          </Reveal>

          {/* Desktop floating cluster */}
          <div className="hidden md:block relative h-80">
            {VALUES.map((v, i) => {
              const positions = [
                { top: '10%',  left: '8%'  },
                { top: '5%',   left: '32%' },
                { top: '15%',  left: '56%' },
                { top: '45%',  left: '20%' },
                { top: '42%',  left: '62%' },
              ];
              const pos = positions[i];
              return (
                <div
                  key={v.label}
                  className={`value-float absolute px-6 py-4 rounded-2xl border-2 shadow-card-soft ${v.color} font-sans font-bold text-lg select-none cursor-default`}
                  style={{ '--dur': v.dur, '--delay': v.delay, ...pos } as React.CSSProperties}
                >
                  {v.label}
                </div>
              );
            })}
          </div>

          {/* Mobile grid */}
          <div className="md:hidden flex flex-wrap gap-3 justify-center">
            {VALUES.map(v => (
              <span
                key={v.label}
                className={`px-5 py-3 rounded-2xl border-2 shadow-card-soft ${v.color} font-sans font-bold text-base`}
              >
                {v.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Highlights ─────────────────────────────────────────────────── */}
      <section className="bg-green-hero py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal preset="up">
            <div className="text-center mb-14">
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-primary font-bold">Key Highlights</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-white">
                Numbers that speak<br />
                <span className="font-display italic font-medium text-warm">for themselves.</span>
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map(s => (
              <StaggerItem key={s.label}>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-7 text-center hover:bg-white/15 transition-colors">
                  <div className="font-sans font-black tracking-tighter-2 text-[clamp(2rem,3.5vw,2.8rem)] text-white leading-none">
                    {s.value}
                  </div>
                  <div className="mt-2 font-sans font-bold text-white/90 text-[0.95rem]">{s.label}</div>
                  <div className="mt-1 font-mono text-white/55 text-[0.72rem] tracking-wide">{s.sub}</div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* Bottom CTA */}
          <Reveal preset="up" delay={0.3}>
            <div className="mt-14 text-center">
              <a
                href="/admissions/by-degree"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold font-sans hover:bg-primary-hover transition-colors shadow-primary-glow"
              >
                Explore All Programmes
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
