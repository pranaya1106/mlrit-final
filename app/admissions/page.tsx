'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

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

// Row 1: pill · photo · pill · photo · pill
// Row 2: photo · pill · photo · pill · arrow
// Photos: s1=saree girl, s2=camera boy, s3=beach boy, s4=girl station, s5=girl campus
// 4 unique student photos — cycled
const S = [
  '/images/students/s1.jpg',
  '/images/students/s2.jpg',
  '/images/students/s3.png',
  '/images/students/s4.png',
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
    type: 'Merit Based',
    sub: 'Top 10% TS EAMCET rank',
    img: '/images/about/milestone-2008.jpg',
    href: '/admissions/scholarships',
  },
  {
    type: 'Need Based',
    sub: 'Students from low-income backgrounds',
    img: '/images/about/milestone-2022.jpg',
    href: '/admissions/scholarships',
  },
  {
    type: 'Special Category',
    sub: 'Sports · SC/ST · Women in STEM',
    img: '/images/about/milestone-2026.jpg',
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
  const [openStep, setOpenStep] = useState<number>(0);

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
        style={{ background: 'linear-gradient(135deg, #0f2d13 0%, #1F6B24 60%, #2d8a35 100%)' }}
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
                More than marks.<br />
                <span className="font-display italic font-medium" style={{ color: '#ffb27a' }}>
                  More than a seat.
                </span>
              </h1>

              <p className="hero-fade mt-6 text-white/75 text-[1.06rem] leading-relaxed max-w-[480px]"
                style={{ animationDelay: '0.45s' }}>
                MLRIT opens its doors to students who are curious, driven and ready to shape the future. A transparent, merit-based admissions process — designed for you.
              </p>

              <div className="hero-fade mt-10 flex flex-wrap gap-4" style={{ animationDelay: '0.6s' }}>
                <a
                  href="https://mlrit.ac.in/admissions"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-primary-glow hover:scale-105"
                >
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a
                  href="https://files.mlrit.ac.in/uploads/"
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

      {/* ── HOW TO APPLY — sticky image left, retractable accordion right */}
      <section className="bg-warm-light py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">How to Apply</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(2rem,3.5vw,3rem)] leading-[1.04] text-foreground">
              Five steps to <span className="font-display italic font-medium" style={gradientText}>your seat.</span>
            </h2>
          </Reveal>

          <div className="mt-14 flex flex-col lg:flex-row gap-14 lg:gap-20 items-start">

            {/* Sticky image — updates to show active step */}
            <div className="lg:sticky lg:top-28 lg:w-[420px] shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-card-strong aspect-[4/5]">
                <img
                  src="/images/about/milestone-2012.jpg"
                  alt="MLRIT student applying"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-mono text-[0.62rem] tracking-[0.15em] uppercase text-muted">
                        Step {openStep + 1} of {STEPS.length}
                      </p>
                      <span className="font-mono text-[0.62rem] text-secondary font-bold">{Math.round(((openStep + 1) / STEPS.length) * 100)}%</span>
                    </div>
                    <p className="font-sans font-bold text-foreground text-[0.95rem]">
                      {STEPS[openStep].title}
                    </p>
                    <div className="mt-3 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${((openStep + 1) / STEPS.length) * 100}%`, background: '#1F6B24' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Retractable accordion steps */}
            <div className="flex-1 divide-y divide-border border border-border rounded-2xl overflow-hidden bg-white shadow-card-soft">
              {STEPS.map((s, i) => {
                const isOpen = openStep === i;
                return (
                  <div key={s.num}>
                    <button
                      onClick={() => setOpenStep(isOpen ? i : i)}
                      className="w-full flex items-center gap-5 px-7 py-5 text-left group transition-colors hover:bg-warm-light"
                      style={{ background: isOpen ? '#f0f9f1' : undefined }}
                    >
                      {/* Number bubble */}
                      <span
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                        style={{
                          background: isOpen ? '#1F6B24' : '#f5f0e8',
                          color:      isOpen ? '#ffffff' : '#9ca3af',
                          transform:  isOpen ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        {i + 1}
                      </span>

                      {/* Title */}
                      <span
                        className="flex-1 font-sans font-bold text-[1.05rem] transition-colors duration-300"
                        style={{ color: isOpen ? '#0f2d13' : 'var(--foreground)' }}
                      >
                        {s.title}
                      </span>

                      {/* Chevron */}
                      <svg
                        width="18" height="18" viewBox="0 0 18 18" fill="none"
                        className="shrink-0 transition-transform duration-300"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke={isOpen ? '#1F6B24' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>

                    {/* Expandable content */}
                    <div
                      className="overflow-hidden transition-all duration-400 ease-in-out"
                      style={{ maxHeight: isOpen ? '200px' : '0px' }}
                    >
                      <div className="px-7 pb-6 pt-1 pl-[4.75rem]">
                        <p className="text-muted text-[0.96rem] leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Apply CTA */}
          <div className="mt-10">
            <a
              href="https://mlrit.ac.in/admissions"
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

      {/* ── FEES & SCHOLARSHIPS — brand card with overlapping image */}
      <section className="py-20 md:py-28 bg-warm-light">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <div
              className="relative rounded-3xl overflow-hidden px-10 md:px-16 pt-14 pb-0 md:pb-0"
              style={{ background: 'linear-gradient(135deg, #0f2d13 0%, #1F6B24 100%)' }}
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

      {/* ── VALUES — scroll-driven: row1 moves left, row2 moves right on scroll */}
      <ValuesMarquee gradientText={gradientText} />

      {/* ── BRAND CLOSE — "You're more than a score" */}
      <section
        className="relative py-24 md:py-36 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f2d13 0%, #1F6B24 100%)' }}
      >
        {/* Decorative */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }} />

        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-2 gap-12 items-center">
          <Reveal preset="right">
            <h2 className="font-sans font-black text-white text-[clamp(2.2rem,4.5vw,4rem)] leading-[1.05] tracking-tighter-2">
              You're more than<br />a score. And we're<br />
              <span className="font-display italic font-medium" style={{ color: '#ffb27a' }}>
                more than a college.
              </span>
            </h2>
            <p className="mt-6 text-white/70 text-[1rem] leading-relaxed max-w-[460px]">
              At MLRIT, we look at who you are — your curiosity, your drive, your potential. Walk in with ambition. Walk out as an engineer the world needs.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/admissions/why-mlrit"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-all shadow-primary-glow"
              >
                Why MLRIT
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/admissions/by-degree"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-all"
              >
                Browse Programmes
              </Link>
            </div>
          </Reveal>

          <Reveal preset="scale" delay={0.15}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card-strong aspect-[4/3]">
                <img
                  src="/images/about/milestone-2019.jpg"
                  alt="MLRIT campus"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl px-5 py-4 shadow-card-strong">
                <div className="font-sans font-black text-foreground text-[1.5rem] tracking-tighter-2">NAAC</div>
                <div className="font-mono text-muted text-[0.62rem] tracking-[0.15em] uppercase">Accredited</div>
              </div>
              <div className="absolute -top-5 -right-5 bg-primary rounded-2xl px-5 py-4 shadow-card-strong">
                <div className="font-sans font-black text-white text-[1.5rem] tracking-tighter-2">NBA</div>
                <div className="font-mono text-white/80 text-[0.62rem] tracking-[0.15em] uppercase">Accredited</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
