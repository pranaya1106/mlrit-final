'use client';

import { useEffect, useRef, useState } from 'react';

type Card = { name: string; role: string; src: string; rot: number; ty: number };

const CARDS: Card[] = [
  { name: 'Ishant',             role: 'SDE @ Amazon',  src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495632/alumni_card1.mp4', rot: -18, ty: 40 },
  { name: 'Snigdha Reddy',      role: 'DBS',           src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495647/alumni_card2.mp4', rot:  -9, ty: 15 },
  { name: 'Gopi Pavani',        role: 'Safran',        src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777366676/av3.mp4',          rot:   0, ty:  0 }, // centre
  { name: 'Sravya Lingisetty',  role: 'Infosys',       src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777371368/sneha_patel.mp4',  rot:   9, ty: 15 },
  { name: 'Aishwarya',          role: 'Cognizant',     src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777495652/alumni_card5.mp4', rot:  18, ty: 40 },
];

export default function Testimonials() {
  const [active, setActive] = useState(2); // centre by default
  const [muted, setMuted]   = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Play the active card; pause others to save bandwidth
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) {
        v.muted = muted;
        const p = v.play(); if (p?.catch) p.catch(() => {});
      } else {
        try { v.pause(); } catch {}
      }
    });
  }, [active, muted]);

  return (
    <section id="testimonials" className="relative bg-gradient-to-br from-[#f0f2f0] via-[#e8ede9] to-[#eef0ee] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-[680px] mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Alumni Voices
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.6rem)]">
            What Our <span className="font-display italic font-medium" style={{
              backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>Graduates Say.</span>
          </h2>
          <p className="mt-4 text-muted">Hover over any card to bring it forward.</p>
        </div>

        {/* Fan deck */}
        <div className="relative h-[520px] md:h-[600px] flex items-end justify-center">
          {CARDS.map((c, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group absolute bottom-0 w-[180px] sm:w-[220px] md:w-[260px] aspect-[3/4] rounded-2xl overflow-hidden border border-border bg-black shadow-[0_30px_60px_rgba(17,17,17,0.18)] transition-transform duration-500 ease-out-quart"
                style={{
                  transform: `rotate(${c.rot}deg) translateY(${isActive ? -80 : c.ty}px) scale(${isActive ? 1.08 : 1})`,
                  zIndex: isActive ? 20 : 10 - Math.abs(i - 2),
                }}
                aria-label={`${c.name} testimonial`}
              >
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={c.src}
                  muted={muted}
                  loop
                  playsInline
                  preload={i === 2 ? 'auto' : 'metadata'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-transparent pointer-events-none" />
                <div className="absolute left-4 right-4 bottom-4 text-white">
                  <div className="font-sans font-extrabold text-lg leading-tight">{c.name}</div>
                  <div className="text-white/72 text-sm">{c.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Sound toggle */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label="Toggle testimonial sound"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-medium"
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
            Sound {muted ? 'Off' : 'On'}
          </button>
        </div>
      </div>
    </section>
  );
}
