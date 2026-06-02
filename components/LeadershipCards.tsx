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

function Card({ leader, index }: { leader: typeof LEADERS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-[3fr_2fr] transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(60px)',
        transitionDelay: `${index * 80}ms`,
      }}
    >
      {/* Photo — full bleed */}
      <div className="relative aspect-[4/3] md:aspect-auto min-h-[280px]">
        <img
          src={leader.img}
          alt={leader.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Dark green panel */}
      <div
        className="relative flex flex-col justify-between p-8 md:p-10"
        style={{ background: '#0f2d13' }}
      >
        {/* Decorative pattern top-right */}
        <div className="absolute top-4 right-4 opacity-10">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="8"  r="6" fill="white" />
            <circle cx="56" cy="32" r="6" fill="white" />
            <circle cx="32" cy="56" r="6" fill="white" />
            <circle cx="8"  cy="32" r="6" fill="white" />
            <circle cx="32" cy="32" r="4" fill="white" />
          </svg>
        </div>

        <div>
          {/* Tag */}
          <span className="inline-block font-mono text-[0.62rem] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
            {leader.tag}
          </span>

          {/* Name */}
          <h3 className="font-sans font-black text-white text-[clamp(1.4rem,2.2vw,2rem)] leading-snug tracking-tight">
            {leader.name}
          </h3>

          {/* Role */}
          <p className="mt-1 text-white/50 text-[0.8rem] font-mono tracking-wide">
            {leader.role}
          </p>

          {/* Quote */}
          <p className="mt-6 text-white/75 text-[0.98rem] leading-relaxed font-display italic">
            "{leader.message}"
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="mt-8 h-px w-12 rounded-full" style={{ background: '#1F6B24' }} />
      </div>
    </div>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function LeadershipCards() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Heading — centred like Anurag */}
        <div className="text-center mb-14">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Leadership and{' '}
            <span className="font-display italic font-medium" style={gradientText}>governance.</span>
          </h2>
          <p className="mt-4 text-muted text-[1rem] leading-relaxed max-w-[560px] mx-auto">
            Meet the people who founded, lead and shape MLR Institute of Technology — from the visionary chairman to the deans driving research and placements.
          </p>
        </div>

        {/* Cards — stacked, slide up on scroll */}
        <div className="flex flex-col gap-5">
          {LEADERS.map((leader, i) => (
            <Card key={leader.name} leader={leader} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}
