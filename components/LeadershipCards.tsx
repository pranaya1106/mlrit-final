'use client';

import { useEffect, useRef, useState } from 'react';

const LEADERS = [
  {
    tag: 'Founder',
    name: 'Sri Marri Laxman Reddy',
    role: 'Founder, KMR Educational Society',
    img: '/images/about/milestone-2005.jpg',
    message: 'Our founding vision was simple — give every student from Telangana access to world-class engineering education, right here at home.',
  },
  {
    tag: 'Patron',
    name: 'Sri Marri Rajashekhar Reddy',
    role: 'Founder Secretary · MLA, Malkajgiri',
    img: '/images/about/milestone-2019.jpg',
    message: 'MLRIT stands as proof that public service and quality education can go hand in hand — shaping engineers who give back to society.',
  },
  {
    tag: 'Principal',
    name: 'Dr. K. Srinivas Rao',
    role: 'Principal, MLR Institute of Technology',
    img: '/images/about/milestone-2022.jpg',
    message: 'Academic rigour and student welfare are not opposing goals — at MLRIT we have always pursued both, together.',
  },
  {
    tag: 'Dean — Academics',
    name: 'Dr. P. Rajashekar',
    role: 'Dean, Academics',
    img: '/images/about/milestone-2012.jpg',
    message: 'We design curricula that respond to where industry is going, not just where it has been — that is what autonomous status allows us to do.',
  },
  {
    tag: 'Placements',
    name: 'Prof. Ravi Chandra P',
    role: 'Head, Training & Placements',
    img: '/images/about/milestone-2026.jpg',
    message: 'Placement is not a season — it is a year-round culture of preparation, industry exposure and relentless follow-through.',
  },
  {
    tag: 'Dean — Research',
    name: 'Dr. M. Anitha',
    role: 'Dean, Research & Innovation',
    img: '/images/about/milestone-2017.jpg',
    message: 'Research at MLRIT is not an afterthought — it is embedded in every department, every lab and every faculty development plan.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

// How much each card peeks above the next (px)
const PEEK = 24;
// Top offset where first card sticks (below navbar + heading)
const STICKY_TOP = 140;

export default function LeadershipCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const { top, height } = wrapper.getBoundingClientRect();
      const scrolled = -top;
      const total = height - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setActiveIndex(Math.min(LEADERS.length - 1, Math.floor(p * LEADERS.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-white">

      {/* Heading — normal flow, scrolls away */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10 text-center">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Leadership and{' '}
          <span className="font-display italic font-medium" style={gradientText}>governance.</span>
        </h2>
        <p className="mt-4 text-muted text-[1rem] leading-relaxed max-w-[560px] mx-auto">
          Meet the people who founded, lead and shape MLR Institute of Technology.
        </p>
      </div>

      {/* Tall scroll container — creates scroll distance for stacking */}
      <div
        ref={wrapperRef}
        style={{ height: `${LEADERS.length * 100}vh` }}
      >
        {/* Sticky viewport */}
        <div
          className="sticky overflow-hidden"
          style={{
            top: `${STICKY_TOP}px`,
            height: `calc(100vh - ${STICKY_TOP}px)`,
          }}
        >
          {/* Card stack */}
          <div className="relative w-full h-full max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
            {LEADERS.map((leader, i) => {
              // Card is revealed once activeIndex >= i
              const revealed = i <= activeIndex;
              // Cards below active index get pushed up slightly (scale down + translateY)
              const isBuried  = revealed && i < activeIndex;
              const depthFromTop = activeIndex - i;               // 0 = top card, 1 = one below, etc.
              const scale     = isBuried ? Math.max(0.92, 1 - depthFromTop * 0.03) : 1;
              const translateY = isBuried ? -depthFromTop * 6 : 0; // subtle upward peek
              const opacity   = isBuried ? Math.max(0.6, 1 - depthFromTop * 0.15) : 1;

              return (
                <div
                  key={leader.name}
                  className="absolute inset-x-6 md:inset-x-12 lg:inset-x-20"
                  style={{
                    top: `${i * PEEK}px`,
                    zIndex: i + 1,
                    // Before revealed: card sits below viewport (translateY 100%)
                    // After revealed: snaps into place
                    transform: revealed
                      ? `translateY(${translateY}px) scale(${scale})`
                      : 'translateY(110%)',
                    opacity: revealed ? opacity : 0,
                    transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease',
                    transformOrigin: 'top center',
                  }}
                >
                  <div
                    className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[3fr_2fr] shadow-card-strong"
                    style={{ height: 'clamp(260px, 38vh, 360px)' }}
                  >
                    {/* Photo */}
                    <div className="relative overflow-hidden">
                      <img
                        src={leader.img}
                        alt={leader.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      {/* dark gradient overlay at right edge to blend into panel */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30" />
                    </div>

                    {/* Dark green panel */}
                    <div
                      className="relative flex flex-col justify-between p-7 md:p-9"
                      style={{ background: '#0f2d13' }}
                    >
                      {/* Decorative dots */}
                      <div className="absolute top-4 right-4 opacity-10">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                          <circle cx="28" cy="6"  r="5" fill="white"/>
                          <circle cx="50" cy="28" r="5" fill="white"/>
                          <circle cx="28" cy="50" r="5" fill="white"/>
                          <circle cx="6"  cy="28" r="5" fill="white"/>
                          <circle cx="28" cy="28" r="4" fill="white"/>
                        </svg>
                      </div>

                      <div>
                        <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/45">
                          {leader.tag}
                        </span>
                        <h3 className="mt-2 font-sans font-black text-white text-[clamp(1.15rem,1.8vw,1.6rem)] leading-snug tracking-tight">
                          {leader.name}
                        </h3>
                        <p className="mt-1 text-white/45 text-[0.72rem] font-mono tracking-wide">
                          {leader.role}
                        </p>
                        <p className="mt-4 text-white/70 text-[0.88rem] leading-relaxed font-display italic line-clamp-3">
                          "{leader.message}"
                        </p>
                      </div>

                      {/* counter */}
                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="font-mono text-[0.6rem] text-white/30 tracking-widest">
                          {String(i + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-16 bg-white" />
    </section>
  );
}
