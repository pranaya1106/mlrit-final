'use client';

import { useEffect, useRef, useState } from 'react';

const STORY = [
  {
    letter: 'M',
    word: 'Merit',
    label: 'Merit.',
    desc: 'At MLRIT, merit is the foundation. From EAMCET ranks to research fellowships, every student earns their place through ability, hard work and a drive to prove themselves on a national stage.',
    accent: '#ffffff',
  },
  {
    letter: 'L',
    word: 'Learning',
    label: 'Learning.',
    desc: 'Autonomous curriculum, industry-integrated labs, NPTEL certifications and live project capstones — learning at MLRIT goes far beyond the classroom. Our students graduate with portfolios, not just degrees.',
    accent: '#ffffff',
  },
  {
    letter: 'R',
    word: 'Research',
    label: 'Research.',
    desc: 'Three JNTUH-recognised research centres, an Intellectual Property Facilitation Centre, 1,200+ publications and 42+ patents — research at MLRIT is a living, breathing part of campus life.',
    accent: '#ffffff',
  },
  {
    letter: 'I',
    word: 'Innovation',
    label: 'Innovation.',
    desc: 'Hackathons, drone labs, Boeing-partnered aerospace projects, Tata Technologies workshops — MLRIT graduates are engineers who build things, not just engineers who know things.',
    accent: '#ffffff',
  },
  {
    letter: 'T',
    word: 'Transformation',
    label: 'Transformation.',
    desc: "From Dundigal to Bengaluru, Dubai or Frankfurt — MLRIT's placement engine, alumni network and career readiness programmes transform potential into reality, one engineer at a time.",
    accent: '#ffffff',
  },
];

const GHOST = '#d4cfc8';
const ACCENTS = ['#01741f', '#e85d04', '#01741f', '#e85d04', '#01741f'];

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
          setActive(Math.min(STORY.length - 1, Math.floor(p * STORY.length)));
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
    <div ref={wrapperRef} style={{ height: `${STORY.length * 100}vh` }}>
      <div className="sticky top-0 h-screen bg-[#f7f5f0] flex flex-col justify-center overflow-hidden">

        {/* Dot-grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle, #b8b2a8 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.35,
          }}
        />

        {/* Radial glow behind active letter */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 55% 50% at 50% 48%, ${ACCENTS[active]}18 0%, transparent 70%)`,
          }}
        />

        {/* Diagonal rule lines */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, #c8c2b808 40px, #c8c2b808 41px)',
            opacity: 0.6,
          }}
        />

        {/* Full-width MLRIT letters */}
        <div
          className="relative flex items-center justify-center select-none leading-none px-4 md:px-8"
          style={{ gap: '0.5vw' }}
        >
          {STORY.map((s, i) => (
            <span
              key={s.letter}
              className="font-sans font-black tracking-tighter transition-all duration-500"
              style={{
                fontSize:   'clamp(16vw, 20vw, 22vw)',
                color:      i === active ? ACCENTS[i] : GHOST,
                lineHeight: 0.85,
              }}
            >
              {s.letter}
            </span>
          ))}
        </div>

        {/* Description below — cross-fades */}
        <div className="relative z-10 h-28 mt-8 flex items-center justify-center px-6">
          {STORY.map((s, i) => (
            <div
              key={s.letter}
              className="absolute max-w-[560px] text-center transition-all duration-500"
              style={{
                opacity:   i === active ? 1 : 0,
                transform: i === active ? 'translateY(0)' : i < active ? 'translateY(-10px)' : 'translateY(10px)',
                pointerEvents: i === active ? 'auto' : 'none',
              }}
            >
              <p className="font-sans text-[0.95rem] leading-relaxed text-muted">
                <strong className="text-foreground font-bold">{s.label}</strong>{' '}
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dot nav */}
        <div className="relative z-10 flex justify-center gap-2 mt-6">
          {STORY.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width:      i === active ? '24px' : '6px',
                height:     '6px',
                background: i === active ? ACCENTS[active] : '#d1d5db',
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
