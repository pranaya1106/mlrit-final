'use client';

import { useEffect, useRef, useState } from 'react';

const STORY = [
  {
    letter: 'M',
    word: 'Merit',
    title: 'Merit that opens every door.',
    desc: 'At MLRIT, merit is not just a criterion — it is a culture. From EAMCET ranks to research fellowships, every student earns their place through ability, hard work and a drive to prove themselves on a national stage.',
    accent: '#01741f',
    stat: { val: '621', sub: 'Placements 2025–26' },
  },
  {
    letter: 'L',
    word: 'Learning',
    title: 'Learning that never stops.',
    desc: 'Autonomous curriculum, industry-integrated labs, NPTEL certifications and live project capstones — learning at MLRIT goes far beyond the classroom. Our students graduate with portfolios, not just degrees.',
    accent: '#e85d04',
    stat: { val: '10+', sub: 'Programmes offered' },
  },
  {
    letter: 'R',
    word: 'Research',
    title: 'Research embedded in everything.',
    desc: 'Three JNTUH-recognised research centres, an Intellectual Property Facilitation Centre, 1,200+ publications and 42+ patents — research at MLRIT is a living, breathing part of campus life, not an afterthought.',
    accent: '#01741f',
    stat: { val: '42+', sub: 'Patents filed' },
  },
  {
    letter: 'I',
    word: 'Innovation',
    title: 'Innovation as a daily habit.',
    desc: 'Hackathons, drone labs, Boeing-partnered aerospace projects, Tata Technologies workshops and a campus culture that rewards curiosity. MLRIT graduates are engineers who build things, not just engineers who know things.',
    accent: '#e85d04',
    stat: { val: '200+', sub: 'Industry partners' },
  },
  {
    letter: 'T',
    word: 'Transformation',
    title: 'Transformation you can measure.',
    desc: 'From a first-generation engineering student in Dundigal to a placed professional in Bengaluru, Dubai or Frankfurt — MLRIT\'s placement engine, alumni network and career readiness programmes transform potential into reality.',
    accent: '#01741f',
    stat: { val: '₹51 LPA', sub: 'Top package 2025–26' },
  },
];

export default function MLRITStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const rafRef = useRef<number | null>(null);
  const scrollRef = useRef(0);
  const targetRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      // Lerp scroll for smooth content updates
      scrollRef.current += (targetRef.current - scrollRef.current) * 0.12;

      const el = wrapperRef.current;
      if (el) {
        const { top, height } = el.getBoundingClientRect();
        const scrolled = -top;
        const total = height - window.innerHeight;
        if (total > 0) {
          const p = Math.max(0, Math.min(1, scrolled / total));
          const idx = Math.min(STORY.length - 1, Math.floor(p * STORY.length));
          setActive(idx);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const current = STORY[active];

  return (
    <section className="bg-[#f7f5f0]">
      {/* Section heading — outside sticky */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-6">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">What MLRIT Stands For</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Five letters,{' '}
          <span className="font-display italic font-medium" style={{
            backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            five promises.
          </span>
        </h2>
      </div>

      {/* Tall scroll container */}
      <div ref={wrapperRef} style={{ height: `${STORY.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[360px_1fr] gap-10 lg:gap-20 items-center">

              {/* LEFT — large MLRIT letters, one per row */}
              <div className="hidden md:flex flex-col gap-1 select-none">
                {STORY.map((s, i) => {
                  const isActive = i === active;
                  const isPast   = i < active;
                  return (
                    <div
                      key={s.letter}
                      className="flex items-center gap-4 transition-all duration-500"
                      style={{ opacity: isActive ? 1 : isPast ? 0.4 : 0.18 }}
                    >
                      {/* Large letter */}
                      <span
                        className="font-sans font-black leading-none tracking-tighter transition-all duration-500"
                        style={{
                          fontSize: isActive ? 'clamp(5rem, 10vw, 8rem)' : 'clamp(3rem, 6vw, 5rem)',
                          color: isActive ? s.accent : '#6b7280',
                        }}
                      >
                        {s.letter}
                      </span>
                      {/* Word label */}
                      <span
                        className="font-sans font-bold tracking-wide transition-all duration-500"
                        style={{
                          fontSize: isActive ? '1.1rem' : '0.85rem',
                          color: isActive ? s.accent : '#9ca3af',
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        {s.word}
                      </span>
                      {/* Active indicator */}
                      {isActive && (
                        <div className="h-px flex-1" style={{ background: s.accent, opacity: 0.3 }} />
                      )}
                    </div>
                  );
                })}

                {/* Progress bar */}
                <div className="mt-6 h-1 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${((active + 1) / STORY.length) * 100}%`,
                      background: current.accent,
                    }}
                  />
                </div>
              </div>

              {/* RIGHT — content area, cross-fades per letter */}
              <div className="relative min-h-[320px] flex items-center">
                {STORY.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <div
                      key={s.letter}
                      className="absolute inset-0 flex flex-col justify-center transition-all duration-500"
                      style={{
                        opacity:   isActive ? 1 : 0,
                        transform: isActive ? 'translateY(0px)' : i < active ? 'translateY(-20px)' : 'translateY(20px)',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                    >
                      {/* Mobile letter */}
                      <div className="md:hidden mb-4 flex items-center gap-3">
                        <span className="font-sans font-black text-[4rem] leading-none" style={{ color: s.accent }}>{s.letter}</span>
                        <span className="font-sans font-bold text-[1rem]" style={{ color: s.accent }}>{s.word}</span>
                      </div>

                      {/* Eyebrow */}
                      <span
                        className="font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase mb-4"
                        style={{ color: s.accent }}
                      >
                        {String(i + 1).padStart(2, '0')} / {String(STORY.length).padStart(2, '0')} — {s.word}
                      </span>

                      {/* Title */}
                      <h3 className="font-sans font-black text-foreground tracking-tighter-2 leading-[1.06]"
                        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}>
                        {s.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-5 text-muted leading-relaxed text-[1.05rem] max-w-[560px]">
                        {s.desc}
                      </p>

                      {/* Stat badge */}
                      <div className="mt-8 inline-flex items-center gap-4">
                        <div
                          className="px-6 py-4 rounded-2xl border"
                          style={{ borderColor: s.accent + '33', background: s.accent + '0d' }}
                        >
                          <div className="font-sans font-black tracking-tighter-2 leading-none"
                            style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', color: s.accent }}>
                            {s.stat.val}
                          </div>
                          <div className="mt-1 font-mono text-[0.65rem] font-bold tracking-[0.16em] uppercase text-muted">
                            {s.stat.sub}
                          </div>
                        </div>
                        {/* Dot progress indicator for mobile */}
                        <div className="md:hidden flex gap-1.5">
                          {STORY.map((_, j) => (
                            <div key={j} className="rounded-full transition-all duration-300"
                              style={{ width: j === i ? '20px' : '6px', height: '6px', background: j === i ? s.accent : '#d1d5db' }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="h-16 bg-[#f7f5f0]" />
    </section>
  );
}
