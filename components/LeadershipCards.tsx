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
    message: 'We design curricula that respond to where industry is going — that is what autonomous status allows us to do.',
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
    message: 'Research at MLRIT is embedded in every department, every lab and every faculty development plan.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

const PEEK        = 18;   // px each buried card peeks above next
const STICKY_TOP  = 130;  // px from top of viewport where stack sits
const SCROLL_PER  = 50;   // vh per card — less = faster stacking

export default function LeadershipCards() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrolled = -top;
      const total    = height - window.innerHeight;
      const p        = Math.max(0, Math.min(1, scrolled / total));
      setActiveIndex(Math.min(LEADERS.length - 1, Math.floor(p * LEADERS.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="bg-[#f7f5f0]">

      {/* Heading */}
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-10 text-center">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Leadership and{' '}
          <span className="font-display italic font-medium" style={gradientText}>governance.</span>
        </h2>
        <p className="mt-4 text-muted text-[1rem] leading-relaxed max-w-[540px] mx-auto">
          Meet the people who founded, lead and shape MLR Institute of Technology.
        </p>
      </div>

      {/* Tall scroll container */}
      <div
        ref={wrapperRef}
        style={{ height: `${LEADERS.length * SCROLL_PER}vh` }}
      >
        <div
          className="sticky overflow-hidden"
          style={{ top: `${STICKY_TOP}px`, height: `calc(100vh - ${STICKY_TOP}px)` }}
        >
          <div className="relative w-full h-full max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
            {LEADERS.map((leader, i) => {
              const revealed     = i <= activeIndex;
              const depth        = activeIndex - i;           // 0 = top card
              const isBuried     = revealed && depth > 0;
              const scale        = isBuried ? Math.max(0.93, 1 - depth * 0.025) : 1;
              const ty           = isBuried ? -depth * 5 : 0;
              const opacity      = isBuried ? Math.max(0.55, 1 - depth * 0.14) : 1;

              return (
                <div
                  key={leader.name}
                  className="absolute inset-x-0"
                  style={{
                    top:       `${i * PEEK}px`,
                    zIndex:    i + 1,
                    transform: revealed
                      ? `translateY(${ty}px) scale(${scale})`
                      : 'translateY(105%)',
                    opacity:   revealed ? opacity : 1,
                    transition: 'transform 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
                    transformOrigin: 'top center',
                    willChange: 'transform',
                  }}
                >
                  {/* Card — light theme, short height, image left + content right */}
                  <div
                    className="rounded-2xl overflow-hidden border border-border bg-white shadow-card-soft grid grid-cols-1 md:grid-cols-[2fr_3fr]"
                    style={{ height: 'clamp(200px, 28vh, 260px)' }}
                  >
                    {/* Short image column */}
                    <div className="relative overflow-hidden">
                      <img
                        src={leader.img}
                        alt={leader.name}
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                    </div>

                    {/* Light content panel */}
                    <div className="flex flex-col justify-between px-7 py-6 bg-white">
                      <div>
                        {/* Tag + counter row */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">
                            {leader.tag}
                          </span>
                          <span className="font-mono text-[0.6rem] text-muted tracking-widest">
                            {String(i + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-sans font-black text-foreground text-[clamp(1.05rem,1.6vw,1.35rem)] leading-snug tracking-tight">
                          {leader.name}
                        </h3>

                        {/* Role */}
                        <p className="mt-0.5 text-muted text-[0.75rem] font-mono tracking-wide">
                          {leader.role}
                        </p>
                      </div>

                      {/* Quote */}
                      <blockquote className="mt-3 pl-3 border-l-2 border-primary">
                        <p className="font-display italic text-[0.9rem] text-foreground/70 leading-relaxed line-clamp-2">
                          "{leader.message}"
                        </p>
                      </blockquote>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-16 bg-[#f7f5f0]" />
    </section>
  );
}
