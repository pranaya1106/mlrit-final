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
  const lerpRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetRef.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const tick = () => {
      lerpRef.current += (targetRef.current - lerpRef.current) * 0.1;
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
      {/* Heading */}
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
            <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">

              {/* LEFT — horizontal MLRIT letters like Masters Union */}
              <div className="flex flex-col">
                {/* Letters row — all 5 in a horizontal line */}
                <div className="flex items-end gap-2 md:gap-4 select-none">
                  {STORY.map((s, i) => {
                    const isActive = i === active;
                    const isPast   = i < active;
                    return (
                      <span
                        key={s.letter}
                        className="font-sans font-black leading-none tracking-tighter transition-all duration-500"
                        style={{
                          fontSize:   isActive ? 'clamp(6rem, 12vw, 9rem)' : 'clamp(4rem, 8vw, 6rem)',
                          color:      isActive ? s.accent : isPast ? '#c5c0b8' : '#dedad4',
                          opacity:    isActive ? 1 : isPast ? 0.7 : 0.4,
                          transform:  isActive ? 'translateY(-8px)' : 'translateY(0)',
                        }}
                      >
                        {s.letter}
                      </span>
                    );
                  })}
                </div>

                {/* Word labels under letters */}
                <div className="flex items-start gap-2 md:gap-4 mt-2">
                  {STORY.map((s, i) => {
                    const isActive = i === active;
                    return (
                      <span
                        key={s.letter}
                        className="font-mono font-bold tracking-wide transition-all duration-500"
                        style={{
                          fontSize:  isActive ? '0.75rem' : '0.62rem',
                          color:     isActive ? s.accent : '#9ca3af',
                          opacity:   isActive ? 1 : 0.5,
                          minWidth:  'clamp(3rem, 8vw, 6rem)',
                        }}
                      >
                        {s.word}
                      </span>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div className="mt-6 h-1 rounded-full bg-border overflow-hidden max-w-[320px]">
                  <div
                    className="h-full rounded-full transition-all duration-400"
                    style={{
                      width: `${((active + 1) / STORY.length) * 100}%`,
                      background: current.accent,
                    }}
                  />
                </div>

                {/* "Ready to be part of" below letters */}
                <div className="mt-8">
                  <p className="font-display italic text-[1.1rem] text-muted leading-snug">
                    Ready to be part of
                  </p>
                  <p
                    className="font-sans font-black text-[1.6rem] leading-tight tracking-tight transition-colors duration-500"
                    style={{ color: current.accent }}
                  >
                    the MLRIT story?
                  </p>
                </div>
              </div>

              {/* RIGHT — content cross-fades */}
              <div className="relative min-h-[280px] flex items-center">
                {STORY.map((s, i) => {
                  const isActive = i === active;
                  return (
                    <div
                      key={s.letter}
                      className="absolute inset-0 flex flex-col justify-center transition-all duration-500"
                      style={{
                        opacity:       isActive ? 1 : 0,
                        transform:     isActive ? 'translateY(0)' : i < active ? 'translateY(-16px)' : 'translateY(16px)',
                        pointerEvents: isActive ? 'auto' : 'none',
                      }}
                    >
                      <span
                        className="font-mono text-[0.65rem] font-bold tracking-[0.22em] uppercase mb-3 block"
                        style={{ color: s.accent }}
                      >
                        {String(i + 1).padStart(2, '0')} / {String(STORY.length).padStart(2, '0')} — {s.word}
                      </span>

                      <h3
                        className="font-sans font-black text-foreground tracking-tighter-2 leading-[1.06]"
                        style={{ fontSize: 'clamp(1.6rem, 3vw, 2.6rem)' }}
                      >
                        {s.title}
                      </h3>

                      <p className="mt-4 text-muted leading-relaxed text-[1rem] max-w-[480px]">
                        {s.desc}
                      </p>

                      {/* Stat */}
                      <div
                        className="mt-7 inline-flex items-center gap-3 px-6 py-4 rounded-2xl border"
                        style={{
                          borderColor: s.accent + '30',
                          background:  s.accent + '0c',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <div>
                          <div
                            className="font-sans font-black tracking-tighter-2 leading-none"
                            style={{ fontSize: 'clamp(1.5rem, 2.2vw, 1.9rem)', color: s.accent }}
                          >
                            {s.stat.val}
                          </div>
                          <div className="mt-1 font-mono text-[0.62rem] font-bold tracking-[0.16em] uppercase text-muted">
                            {s.stat.sub}
                          </div>
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
