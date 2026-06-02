'use client';

import { useState } from 'react';

const LEADERS = [
  {
    tag: 'Founder',
    name: 'Sri Marri Laxman Reddy',
    role: 'Founder, KMR Educational Society',
    img: '/images/about/milestone-2005.jpg',
    message: 'Our founding vision was simple — give every student from Telangana access to world-class engineering education, right here at home. In 2005, we laid the foundation stone at Dundigal with a single promise: right education, bright placements.',
  },
  {
    tag: 'Patron',
    name: 'Sri Marri Rajashekhar Reddy',
    role: 'Founder Secretary · MLA, Malkajgiri',
    img: '/images/about/milestone-2019.jpg',
    message: 'MLRIT stands as proof that public service and quality education can go hand in hand. We continue to invest in infrastructure, faculty and student welfare because we believe every engineer we produce is a gift to the nation.',
  },
  {
    tag: 'Principal',
    name: 'Dr. K. Srinivas Rao',
    role: 'Principal, MLR Institute of Technology',
    img: '/images/about/milestone-2022.jpg',
    message: 'Academic rigour and student welfare are not opposing goals — at MLRIT we have always pursued both, together. Our autonomous status lets us stay ahead of industry, while our NAAC and NBA accreditations validate our quality.',
  },
  {
    tag: 'Dean — Academics',
    name: 'Dr. P. Rajashekar',
    role: 'Dean, Academics',
    img: '/images/about/milestone-2012.jpg',
    message: 'We design curricula that respond to where industry is going, not just where it has been. Autonomous status gives us the agility to refresh syllabi, integrate emerging tools, and keep our students ahead of the curve.',
  },
  {
    tag: 'Head — Placements',
    name: 'Prof. Ravi Chandra P',
    role: 'Head, Training & Placements',
    img: '/images/about/milestone-2026.jpg',
    message: 'Placement is not a season — it is a year-round culture of preparation, industry exposure and relentless follow-through. 621 offers in 2025–26 with a ₹51 LPA top package is a result of that culture.',
  },
  {
    tag: 'Dean — Research',
    name: 'Dr. M. Anitha',
    role: 'Dean, Research & Innovation',
    img: '/images/about/milestone-2017.jpg',
    message: 'Research at MLRIT is not an afterthought — it is embedded in every department, every lab and every faculty development plan. Through our IPFC and three JNTUH-recognised research centres, we are building a genuine culture of inquiry.',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function LeadershipCards() {
  const [active, setActive] = useState(0);
  const leader = LEADERS[active];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Heading */}
        <div className="mb-12">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">People</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Leadership and{' '}
            <span className="font-display italic font-medium" style={gradientText}>governance.</span>
          </h2>
        </div>

        {/* Main layout — accordion list left, big card right */}
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 items-start">

          {/* LEFT — accordion list */}
          <div className="flex flex-col divide-y divide-border border border-border rounded-2xl overflow-hidden">
            {LEADERS.map((l, i) => {
              const isActive = i === active;
              return (
                <button
                  key={l.name}
                  onClick={() => setActive(i)}
                  className="w-full text-left px-6 py-5 transition-all duration-300 flex items-center justify-between gap-4 group"
                  style={{ background: isActive ? '#f0f9f1' : 'white' }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Active indicator bar */}
                    <div
                      className="w-1 rounded-full flex-shrink-0 transition-all duration-300"
                      style={{
                        height:     isActive ? '36px' : '16px',
                        background: isActive ? '#1F6B24' : '#d1d5db',
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-primary mb-0.5">
                        {l.tag}
                      </div>
                      <div className={`font-sans font-extrabold text-[0.95rem] tracking-tight truncate transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted group-hover:text-foreground'}`}>
                        {l.name}
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                    className="flex-shrink-0 transition-transform duration-300"
                    style={{ transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M6 3l5 5-5 5" stroke={isActive ? '#1F6B24' : '#9ca3af'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              );
            })}
          </div>

          {/* RIGHT — big expanded card */}
          <div
            key={active}
            className="rounded-2xl overflow-hidden border border-border shadow-card-soft"
            style={{ animation: 'fadeSlideIn 0.35s cubic-bezier(0.22,1,0.36,1) both' }}
          >
            {/* Image — short */}
            <div className="relative w-full overflow-hidden" style={{ height: '220px' }}>
              <img
                src={leader.img}
                alt={leader.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              {/* Tag pill over image */}
              <div className="absolute bottom-4 left-5">
                <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-primary border border-primary/20">
                  {leader.tag}
                </span>
              </div>
              {/* Counter */}
              <div className="absolute bottom-4 right-5 font-mono text-[0.62rem] text-white/70 tracking-widest">
                {String(active + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}
              </div>
            </div>

            {/* Content */}
            <div className="p-7 md:p-8 bg-white">
              <h3 className="font-sans font-black text-foreground text-[clamp(1.2rem,2vw,1.55rem)] leading-snug tracking-tight">
                {leader.name}
              </h3>
              <p className="mt-1 font-mono text-[0.72rem] text-muted tracking-wide uppercase">
                {leader.role}
              </p>

              {/* Divider */}
              <div className="my-5 h-px bg-border" />

              {/* Message */}
              <blockquote className="pl-4 border-l-2 border-primary">
                <p className="font-display italic text-[1rem] text-foreground/75 leading-relaxed">
                  "{leader.message}"
                </p>
              </blockquote>

              {/* Dot nav */}
              <div className="mt-6 flex gap-1.5 items-center">
                {LEADERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      active === i ? '24px' : '7px',
                      height:     '7px',
                      background: active === i ? '#1F6B24' : '#d1d5db',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
