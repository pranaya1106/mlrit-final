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
    desc: "From a first-generation engineering student in Dundigal to a placed professional in Bengaluru, Dubai or Frankfurt — MLRIT's placement engine, alumni network and career readiness programmes transform potential into reality.",
    accent: '#01741f',
    stat: { val: '₹51 LPA', sub: 'Top package 2025–26' },
  },
];

export default function MLRITStory() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
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
      {/* Section heading */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-6">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">What MLRIT Stands For</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Five letters,{' '}
          <span
            className="font-display italic font-medium"
            style={{
              backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            five promises.
          </span>
        </h2>
      </div>

      {/* Tall scroll container */}
      <div ref={wrapperRef} style={{ height: `${STORY.length * 100}vh` }}>
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          <div className="w-full max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">

            {/* TOP — centered MLRIT letters with word below each */}
            <div className="flex justify-center gap-6 md:gap-10 lg:gap-14 select-none mb-8">
              {STORY.map((s, i) => {
                const isActive = i === active;
                const isPast   = i < active;
                return (
                  <div key={s.letter} className="flex flex-col items-center gap-2">
                    <span
                      className="font-sans font-black leading-none tracking-tighter transition-all duration-500"
                      style={{
                        fontSize:  isActive ? 'clamp(5rem, 10vw, 9rem)' : 'clamp(3.5rem, 7vw, 6rem)',
                        color:     isActive ? s.accent : isPast ? '#b8b2a8' : '#d4cfc8',
                        transform: isActive ? 'translateY(-6px)' : 'translateY(0)',
                      }}
                    >
                      {s.letter}
                    </span>
                    <span
                      className="font-mono font-bold tracking-wide transition-all duration-400 text-center"
                      style={{
                        fontSize: isActive ? '0.72rem' : '0.6rem',
                        color:    isActive ? s.accent : '#b0a99f',
                      }}
                    >
                      {s.word}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Progress bar — centred */}
            <div className="flex justify-center mb-10">
              <div className="h-0.5 w-[280px] rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-400"
                  style={{ width: `${((active + 1) / STORY.length) * 100}%`, background: current.accent }}
                />
              </div>
            </div>

            {/* BOTTOM — content cross-fades, centred on mobile, two-col on md+ */}
            <div className="relative min-h-[220px]">
              {STORY.map((s, i) => {
                const isActive = i === active;
                return (
                  <div
                    key={s.letter}
                    className="absolute inset-0 flex flex-col md:flex-row md:items-center gap-6 transition-all duration-500"
                    style={{
                      opacity:       isActive ? 1 : 0,
                      transform:     isActive ? 'translateY(0)' : i < active ? 'translateY(-12px)' : 'translateY(12px)',
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    {/* Text */}
                    <div className="flex-1">
                      <span
                        className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase mb-3 block"
                        style={{ color: s.accent }}
                      >
                        {String(i + 1).padStart(2, '0')} / {String(STORY.length).padStart(2, '0')} — {s.word}
                      </span>
                      <h3
                        className="font-sans font-black text-foreground tracking-tighter-2 leading-[1.06]"
                        style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2.4rem)' }}
                      >
                        {s.title}
                      </h3>
                      <p className="mt-3 text-muted leading-relaxed text-[0.98rem] max-w-[520px]">
                        {s.desc}
                      </p>
                    </div>

                    {/* Stat badge */}
                    <div
                      className="shrink-0 px-7 py-5 rounded-2xl border"
                      style={{
                        borderColor: s.accent + '30',
                        background:  s.accent + '0c',
                      }}
                    >
                      <div
                        className="font-sans font-black tracking-tighter-2 leading-none"
                        style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2rem)', color: s.accent }}
                      >
                        {s.stat.val}
                      </div>
                      <div className="mt-1.5 font-mono text-[0.62rem] font-bold tracking-[0.16em] uppercase text-muted">
                        {s.stat.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      <div className="h-8 bg-[#f7f5f0]" />
    </section>
  );
}
