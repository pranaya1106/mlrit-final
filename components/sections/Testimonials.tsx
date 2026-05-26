'use client';

import { useEffect, useRef, useState } from 'react';

type Card = { name: string; role: string; company: string; src: string; accent: string };

const CARDS: Card[] = [
  { name: 'Gopi Pavani',        role: 'Placed at Safran',  company: 'B.Tech AE · 2022', src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777366676/av3.mp4',          accent: '#e85d04' },
  { name: 'Ishant',             role: 'SDE @ Amazon',      company: 'B.Tech CSE · 2023', src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495632/alumni_card1.mp4', accent: '#2d8b55' },
  { name: 'Snigdha Reddy',      role: 'Analyst @ DBS',     company: 'B.Tech CSE · 2023', src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495647/alumni_card2.mp4', accent: '#0668e1' },
  { name: 'Sravya Lingisetty',  role: 'Engineer @ Infosys',company: 'B.Tech IT · 2024',  src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777371368/sneha_patel.mp4',  accent: '#a83232' },
  { name: 'Aishwarya',          role: 'Consultant @ Cognizant', company: 'B.Tech CSE · 2024', src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495652/alumni_card5.mp4', accent: '#7a4f00' },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [muted, setMuted]   = useState(true);
  const featureVid = useRef<HTMLVideoElement | null>(null);

  // Auto-rotate every 9s
  useEffect(() => {
    const t = window.setInterval(() => setActive((c) => (c + 1) % CARDS.length), 9000);
    return () => window.clearInterval(t);
  }, []);

  // Sync featured video src / muted
  useEffect(() => {
    if (!featureVid.current) return;
    featureVid.current.muted = muted;
    featureVid.current.load();
    const p = featureVid.current.play(); if (p?.catch) p.catch(() => {});
  }, [active, muted]);

  const c = CARDS[active];

  return (
    <section id="testimonials" className="bg-[#0a0a0a] text-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center max-w-[680px] mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-warm font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Alumni Voices
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2.2rem,4vw,3.6rem)]">
            What Our <span className="font-display italic font-medium text-warm">Graduates Say.</span>
          </h2>
        </div>

        {/* Layout: feature + rail */}
        <div className="grid lg:grid-cols-[1.45fr_1fr] gap-6 lg:gap-10 items-stretch">
          {/* FEATURE */}
          <article className="relative rounded-3xl overflow-hidden bg-black aspect-[16/10] lg:aspect-auto lg:min-h-[520px] border border-white/10 group">
            <video
              ref={featureVid}
              key={c.src}  // forces remount on swap
              src={c.src}
              muted={muted}
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
            <div className="absolute left-7 right-7 bottom-7 md:left-10 md:right-10 md:bottom-10 z-10">
              <span
                className="inline-block font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase mb-3 px-3 py-1 rounded-full"
                style={{ background: c.accent + '26', color: c.accent, border: `1px solid ${c.accent}55` }}
              >
                {c.company}
              </span>
              <h3 className="font-sans font-black text-white tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05]">
                {c.name}
              </h3>
              <p className="mt-2 text-white/72 text-lg font-light">{c.role}</p>
            </div>
            {/* Mute toggle inside the feature card */}
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label="Toggle sound"
              className="absolute top-5 right-5 z-10 w-11 h-11 rounded-full border border-white/30 bg-black/40 backdrop-blur-sm grid place-items-center text-white hover:bg-white hover:text-black transition-colors"
            >
              {muted ? (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              )}
            </button>
          </article>

          {/* RAIL — compact list of other alumni */}
          <div className="flex flex-col gap-3 md:gap-3.5">
            {CARDS.map((card, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`group flex items-center gap-4 text-left rounded-2xl border p-3 md:p-4 transition-all ${
                    isActive
                      ? 'border-primary/60 bg-white/[0.04]'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]'
                  }`}
                >
                  <span
                    className="relative flex-shrink-0 w-16 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden bg-black"
                    style={{ outline: isActive ? `2px solid ${card.accent}` : 'none', outlineOffset: 2 }}
                  >
                    <video src={card.src} muted loop playsInline preload="metadata" className="w-full h-full object-cover" />
                    {isActive && <span className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-warm/55 mb-1">
                      {card.company}
                    </span>
                    <span className="block font-sans font-extrabold text-white text-base md:text-lg leading-tight truncate">
                      {card.name}
                    </span>
                    <span className="block text-white/55 text-sm truncate">{card.role}</span>
                  </span>
                  <span className={`flex-shrink-0 text-white/40 group-hover:text-white transition-colors text-lg ${isActive ? 'text-white' : ''}`}>
                    →
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick CTA */}
        <div className="mt-12 text-center">
          <a
            href="/chronicles"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-white/30 text-white font-medium text-sm hover:bg-white hover:text-black transition-colors"
          >
            Read more alumni stories →
          </a>
        </div>
      </div>
    </section>
  );
}
