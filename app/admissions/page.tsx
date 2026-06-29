'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import AdmissionsQuickNav from '@/components/AdmissionsQuickNav';


const STEPS = [
  {
    num: 1,
    title: 'Choose Your Programme',
    desc: 'Explore our 10 B.Tech branches, M.Tech specialisations and MBA — find the one that aligns with your passion and career goals.',
  },
  {
    num: 2,
    title: 'Check Eligibility',
    desc: 'Review TS EAMCET / ICET / PGECET cutoffs and minimum qualifying marks. Most UG programmes accept TS EAMCET scores.',
  },
  {
    num: 3,
    title: 'Apply Online',
    desc: 'Fill out the application form on mlrit.ac.in, upload required documents and submit. Walk-in admissions are also welcome.',
  },
  {
    num: 4,
    title: 'Attend Counselling',
    desc: 'Receive your counselling schedule. Bring originals of all documents — mark sheets, TC, caste certificate, photographs.',
  },
  {
    num: 5,
    title: 'Secure Your Seat',
    desc: 'Pay the semester fee, collect your allotment letter and student ID. Your MLRIT journey begins here.',
  },
];

// 4 unique student photos
const S = [
  '/images/students/s1.jpg',
  '/images/students/s2.jpg',
  '/images/students/s3.jpg',
  '/images/students/s4.jpg',
];

// Row 1 — pill · photo · pill · photo · pill · photo · pill · photo · pill
const ROW1 = [
  { type: 'pill',  label: 'Integrity',        bg: '#f5e8ea', color: '#3d1f24' },
  { type: 'photo', src: S[0] },
  { type: 'pill',  label: 'Inclusivity',      bg: '#e8edf5', color: '#1f2d4a' },
  { type: 'photo', src: S[1] },
  { type: 'pill',  label: 'Empathy',          bg: '#f5e8ea', color: '#3d1f24' },
  { type: 'photo', src: S[2] },
  { type: 'pill',  label: 'Excellence',       bg: '#e8edf5', color: '#1f2d4a' },
  { type: 'photo', src: S[3] },
  { type: 'pill',  label: 'Innovation',       bg: '#edf5ea', color: '#1f3d20' },
];

// Row 2 — photo · pill · photo · pill · photo · pill · photo · pill
const ROW2 = [
  { type: 'photo', src: S[2] },
  { type: 'pill',  label: 'Learning for Life', bg: '#e8edf5', color: '#1f2d4a' },
  { type: 'photo', src: S[3] },
  { type: 'pill',  label: 'Leadership',        bg: '#f5e8ea', color: '#3d1f24' },
  { type: 'photo', src: S[0] },
  { type: 'pill',  label: 'Research',          bg: '#edf5ea', color: '#1f3d20' },
  { type: 'photo', src: S[1] },
  { type: 'pill',  label: 'Community',         bg: '#e8edf5', color: '#1f2d4a' },
];

const SCHOLARSHIPS = [
  {
    type: 'Sports',
    sub: 'State · National · International athletes',
    img: '/images/about/milestone-2026.jpg',
    href: '/admissions/scholarships',
  },
  {
    type: 'Industry & External',
    sub: 'Cybage Khushboo Trust · Partner schemes',
    img: '/images/about/milestone-2022.jpg',
    href: '/admissions/scholarships',
  },
  {
    type: 'SC / ST / EWS',
    sub: 'Full fee reimbursement via state ePass',
    img: '/images/about/milestone-2008.jpg',
    href: '/admissions/scholarships',
  },
];

const STATS = [
  { value: '10+',      label: 'Programmes Offered',  sub: 'B.Tech · M.Tech · MBA' },
  { value: '621',      label: 'Placement Offers',     sub: '2025–26 season' },
  { value: '200+',     label: 'Hiring Partners',      sub: 'Campus recruiters' },
  { value: '₹51 LPA',  label: 'Top Package',          sub: 'Highest offer 2025–26' },
];

// ── Scroll-driven values marquee ─────────────────────────────────────────────
function ValuesMarquee({ gradientText }: { gradientText: React.CSSProperties }) {
  const sectionRef  = useRef<HTMLElement>(null);
  const row1Ref     = useRef<HTMLDivElement>(null);
  const row2Ref     = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef(0);
  const rafRef      = useRef<number | null>(null);
  const targetRef   = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      // Smooth lerp toward target
      scrollRef.current += (targetRef.current - scrollRef.current) * 0.08;

      const section = sectionRef.current;
      if (section) {
        const rect   = section.getBoundingClientRect();
        const top    = rect.top + window.scrollY;
        const offset = scrollRef.current - top + window.innerHeight * 0.3;
        const travel = offset * 0.18; // speed factor

        if (row1Ref.current) row1Ref.current.style.transform = `translateX(${-travel}px)`;
        if (row2Ref.current) row2Ref.current.style.transform = `translateX(${travel}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const renderRow = (items: typeof ROW1, ref: React.RefObject<HTMLDivElement>) => (
    <div className="relative overflow-hidden mb-5">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-40 z-10"
        style={{ background: 'linear-gradient(to right, white 0%, transparent 100%)' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-40 z-10"
        style={{ background: 'linear-gradient(to left, white 0%, transparent 100%)' }} />
      <div
        ref={ref}
        className="flex items-center gap-5 py-2"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {/* Render items twice for seamless visual density */}
        {[...items, ...items].map((item, i) =>
          item.type === 'pill' ? (
            <div
              key={i}
              className="shrink-0 px-9 py-5 font-sans font-bold text-[1.05rem] md:text-[1.35rem] select-none"
              style={{
                background: item.bg,
                color: item.color,
                borderRadius: '999px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              {item.label}
            </div>
          ) : (
            <div
              key={i}
              className="shrink-0 w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            >
              <img
                src={item.src!}
                alt="MLRIT student"
                className="w-full h-full object-cover object-center"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/about/milestone-2005.jpg'; }}
              />
            </div>
          )
        )}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 mb-14">
        <div className="text-center">
          <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">Our Foundation</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(2rem,3.5vw,3rem)] leading-[1.04] text-foreground">
            Values that guide <span className="font-display italic font-medium" style={gradientText}>every decision.</span>
          </h2>
          <p className="mt-4 text-muted text-[1rem] max-w-[480px] mx-auto leading-relaxed">
            These aren't just words on a wall — they shape how we teach, hire and welcome every student.
          </p>
        </div>
      </div>

      {renderRow(ROW1, row1Ref)}
      {renderRow(ROW2, row2Ref)}
    </section>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function AdmissionsPage() {
  const stepRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let closest = 0;
      let minDist = Infinity;
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elMid = rect.top + rect.height / 2;
        const dist = Math.abs(elMid - mid);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveStep(closest);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade { animation: fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      {/* ── HERO ── full viewport, green bg, bold typographic */}
      <section
        className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden"
        style={{ background: '#01741f' }}
      >
        {/* Background texture circles */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e85d04 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-20">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/50 mb-8 hero-fade" style={{ animationDelay: '0.1s' }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/80">Admissions</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="hero-fade inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/80 mb-6"
                style={{ animationDelay: '0.2s' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Admissions 2025–26 Open
              </span>

              <h1 className="hero-fade font-sans font-black text-white leading-[1.02] tracking-tighter-2"
                style={{ fontSize: 'clamp(2.8rem,5.5vw,5rem)', animationDelay: '0.3s' }}>
                You're more than<br />a score. And we're<br />
                <span className="font-display italic font-medium" style={{ color: '#ffb27a' }}>
                  more than a college.
                </span>
              </h1>

              <p className="hero-fade mt-6 text-white/75 text-[1.06rem] leading-relaxed max-w-[480px]"
                style={{ animationDelay: '0.45s' }}>
                MLRIT opens its doors to students who are curious, driven and ready to shape the future. A transparent, merit-based admissions process — designed for you.
              </p>

              <div className="hero-fade mt-10 flex flex-wrap gap-4" style={{ animationDelay: '0.6s' }}>
                <Link
                  href="/admissions/why-mlrit"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-foreground font-bold text-sm hover:bg-warm-light transition-all hover:scale-105"
                >
                  Why MLRIT
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a
                  href="/admissions/mlrit-brochure.pdf"
                  download="MLRIT-Brochure-2025-26.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-all"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M8 2v8m-3-3 3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Brochure
                </a>
              </div>
            </div>

            {/* Stats on hero */}
            <div className="hero-fade grid grid-cols-2 gap-4" style={{ animationDelay: '0.5s' }}>
              {STATS.map(s => (
                <div key={s.label} className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/15 transition-colors">
                  <div className="font-sans font-black text-white tracking-tighter-2" style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)' }}>
                    {s.value}
                  </div>
                  <div className="mt-1 font-sans font-bold text-white/90 text-[0.9rem]">{s.label}</div>
                  <div className="mt-0.5 font-mono text-white/50 text-[0.65rem] tracking-wide uppercase">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60Z" fill="#faf7f0"/>
          </svg>
        </div>
      </section>

      {/* ── HOW TO APPLY — sticky image left, scroll-driven steps right */}
      <section className="bg-warm-light py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">How to Apply</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(2rem,3.5vw,3rem)] leading-[1.04] text-foreground">
              Five steps to <span className="font-display italic font-medium" style={gradientText}>your seat.</span>
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

            {/* Sticky image */}
            <div className="lg:sticky lg:top-28 lg:w-[420px] shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-card-strong aspect-[4/5]">
                <img
                  src="/images/about/milestone-2012.jpg"
                  alt="MLRIT student"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted">
                        Step {activeStep + 1} of {STEPS.length}
                      </p>
                      <span className="font-mono text-[0.62rem] text-secondary font-bold">
                        {Math.round(((activeStep + 1) / STEPS.length) * 100)}%
                      </span>
                    </div>
                    <p className="font-sans font-bold text-foreground text-[0.95rem]">
                      {STEPS[activeStep].title}
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%`, background: '#1F6B24' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll-driven steps */}
            <div className="flex-1">
              {STEPS.map((s, i) => (
                <div
                  key={s.num}
                  ref={el => { stepRefs.current[i] = el; }}
                  className="relative flex gap-5 pb-4 last:pb-0"
                >
                  {/* Vertical connector */}
                  {i < STEPS.length - 1 && (
                    <div
                      className="absolute left-[22px] top-[52px] bottom-0 w-0.5 transition-colors duration-500"
                      style={{ background: activeStep > i ? '#01741f' : '#d1cec9' }}
                    />
                  )}

                  {/* Circle node */}
                  <div
                    className="shrink-0 mt-3 w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 z-10 border-2"
                    style={{
                      borderColor: activeStep >= i ? '#01741f' : '#d1cec9',
                      background:  activeStep === i ? '#01741f' : activeStep > i ? '#d4f0d8' : '#ffffff',
                      color:       activeStep === i ? '#ffffff' : activeStep > i ? '#01741f' : '#9ca3af',
                      transform:   activeStep === i ? 'scale(1.15)' : 'scale(1)',
                      boxShadow:   activeStep === i ? '0 0 0 4px rgba(1,116,31,0.15)' : 'none',
                    }}
                  >
                    {activeStep > i ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : s.num}
                  </div>

                  {/* Card — full highlighted when active */}
                  <div
                    className="flex-1 rounded-2xl border-2 px-6 py-5 mb-5 transition-all duration-500"
                    style={{
                      borderColor:  activeStep === i ? '#01741f' : activeStep > i ? '#d4f0d8' : '#e5e0d8',
                      background:   activeStep === i ? '#f0faf1' : activeStep > i ? '#fafffe' : '#ffffff',
                      boxShadow:    activeStep === i ? '0 4px 24px rgba(1,116,31,0.12)' : 'none',
                      opacity:      activeStep < i ? 0.5 : 1,
                    }}
                  >
                    {/* Step label */}
                    <div
                      className="font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase mb-2 transition-colors duration-500"
                      style={{ color: activeStep === i ? '#01741f' : '#9ca3af' }}
                    >
                      Step {s.num}
                    </div>
                    <h3
                      className="font-sans font-extrabold text-[1.2rem] leading-snug transition-colors duration-500"
                      style={{ color: activeStep === i ? '#0a2e0f' : activeStep > i ? '#4a5568' : '#6b7280' }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="mt-2 text-[0.95rem] leading-relaxed transition-colors duration-500"
                      style={{ color: activeStep === i ? '#374151' : '#9ca3af' }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-10 ml-[3.75rem]">
                <a
                  href="https://qr-mlr.vercel.app"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-primary-glow hover:scale-105"
                >
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCHOLARSHIP TYPES — 3 photo cards */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <div className="mb-12">
              <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">Financial Support</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(2rem,3.5vw,3rem)] leading-[1.04] text-foreground">
                Scholarship <span className="font-display italic font-medium" style={gradientText}>types.</span>
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid md:grid-cols-3 gap-6">
            {SCHOLARSHIPS.map(s => (
              <StaggerItem key={s.type}>
                <Link href={s.href} className="group block">
                  <div className="rounded-2xl overflow-hidden border border-border shadow-card-soft aspect-[4/3] relative">
                    <img
                      src={s.img}
                      alt={s.type}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="mt-4 px-1">
                    <h3 className="font-sans font-bold text-foreground text-[1.05rem]">{s.type}</h3>
                    <p className="mt-1 text-muted text-[0.88rem]">{s.sub}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-foreground text-white text-[0.8rem] font-semibold group-hover:bg-primary transition-colors">
                      Explore More
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path d="M2 6h8M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── VALUES — scroll-driven: row1 moves left, row2 moves right on scroll */}
      <ValuesMarquee gradientText={gradientText} />

      {/* ── FEES & SCHOLARSHIPS — brand card with overlapping image */}
      <section className="py-20 md:py-28 bg-warm-light">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <div
              className="relative rounded-3xl overflow-hidden px-10 md:px-16 pt-14 pb-0 md:pb-0"
              style={{ background: '#01741f' }}
            >
              {/* Decorative shapes */}
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
                <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #e85d04, transparent 70%)' }} />
              </div>
              <div className="absolute bottom-0 left-0 w-48 h-48 opacity-10">
                <div className="w-full h-full rounded-full" style={{ background: 'radial-gradient(circle, #ffffff, transparent 70%)' }} />
              </div>

              <div className="relative grid md:grid-cols-2 gap-10 items-end">
                {/* Text */}
                <div className="pb-14">
                  <h2 className="font-sans font-black text-white text-[clamp(2rem,3.5vw,3.2rem)] leading-[1.06] tracking-tighter-2">
                    Fees &<br />Scholarships
                  </h2>
                  <p className="mt-5 text-white/75 text-[1rem] leading-relaxed max-w-[420px]">
                    We believe no student should miss out on quality education for financial reasons. MLRIT disburses scholarships across merit, need, sports and SC/ST categories every year.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                      href="/admissions/fees"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-foreground font-bold text-sm hover:bg-warm-light transition-colors"
                    >
                      View Fee Structure
                    </Link>
                    <Link
                      href="/admissions/scholarships"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-colors"
                    >
                      Explore Scholarships
                    </Link>
                  </div>
                </div>

                {/* Overlapping image */}
                <div className="relative mt-auto">
                  <div className="rounded-t-2xl overflow-hidden shadow-card-strong" style={{ height: '320px' }}>
                    <img
                      src="/images/about/milestone-2025.jpg"
                      alt="MLRIT students"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

    </>
  );
}
