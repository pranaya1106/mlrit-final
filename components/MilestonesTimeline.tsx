'use client';

import { useEffect, useRef, useState } from 'react';

// Each milestone has 3 stacked mock images (different shades of green as placeholders)
const TIMELINE = [
  {
    y: '2005', t: 'Foundation Stone',
    d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad.',
    imgs: [
      { bg: 'linear-gradient(135deg,#1F6B24,#2d8a35)', label: 'Foundation Ceremony' },
      { bg: 'linear-gradient(135deg,#14532d,#1F6B24)', label: 'Campus Layout' },
      { bg: 'linear-gradient(135deg,#166534,#22c55e55)', label: 'First Block' },
    ],
  },
  {
    y: '2008', t: 'First Graduation',
    d: 'First batch of B.Tech graduates step out — placed across Wipro, Infosys and TCS.',
    imgs: [
      { bg: 'linear-gradient(135deg,#064e3b,#1F6B24)', label: 'Convocation' },
      { bg: 'linear-gradient(135deg,#1F6B24,#166534)', label: 'Graduates 2008' },
      { bg: 'linear-gradient(135deg,#15803d,#14532d)', label: 'Campus' },
    ],
  },
  {
    y: '2012', t: 'NBA Cycle Begins',
    d: 'CSE, ECE and Mechanical programmes earn first NBA accreditation cycle.',
    imgs: [
      { bg: 'linear-gradient(135deg,#166534,#1F6B24)', label: 'NBA Certificate' },
      { bg: 'linear-gradient(135deg,#1F6B24,#064e3b)', label: 'Accreditation' },
      { bg: 'linear-gradient(135deg,#14532d,#2d8a35)', label: 'Labs' },
    ],
  },
  {
    y: '2017', t: 'IPFC Established',
    d: 'Intellectual Property Facilitation Centre opens to support patent filings and IPR awareness.',
    imgs: [
      { bg: 'linear-gradient(135deg,#2d8a35,#1F6B24)', label: 'IPFC Launch' },
      { bg: 'linear-gradient(135deg,#1F6B24,#166534)', label: 'Patent Filing' },
      { bg: 'linear-gradient(135deg,#14532d,#15803d)', label: 'R&D Cell' },
    ],
  },
  {
    y: '2019', t: 'NAAC Accreditation',
    d: 'Institutional NAAC accreditation granted — recognises overall quality.',
    imgs: [
      { bg: 'linear-gradient(135deg,#064e3b,#2d8a35)', label: 'NAAC Visit' },
      { bg: 'linear-gradient(135deg,#1F6B24,#14532d)', label: 'Certificate' },
      { bg: 'linear-gradient(135deg,#166534,#1F6B24)', label: 'Campus Review' },
    ],
  },
  {
    y: '2022', t: 'Autonomous Status',
    d: 'UGC grants autonomous status — institution designs its own regulations.',
    imgs: [
      { bg: 'linear-gradient(135deg,#15803d,#1F6B24)', label: 'UGC Award' },
      { bg: 'linear-gradient(135deg,#1F6B24,#064e3b)', label: 'Ceremony' },
      { bg: 'linear-gradient(135deg,#2d8a35,#166534)', label: 'Faculty Meet' },
    ],
  },
  {
    y: '2025', t: 'Two Decades',
    d: 'MLRIT crosses 20 years with 7,000+ alumni placed across the world.',
    imgs: [
      { bg: 'linear-gradient(135deg,#1F6B24,#2d8a35)', label: '20 Year Celebration' },
      { bg: 'linear-gradient(135deg,#14532d,#15803d)', label: 'Alumni Meet' },
      { bg: 'linear-gradient(135deg,#064e3b,#1F6B24)', label: 'Campus Today' },
    ],
  },
  {
    y: '2026', t: 'Trishna 2K26',
    d: '21st Annual Day — 621 placement offers and a ₹51 LPA top package mark the strongest season yet.',
    imgs: [
      { bg: 'linear-gradient(135deg,#166534,#2d8a35)', label: 'Annual Day' },
      { bg: 'linear-gradient(135deg,#1F6B24,#14532d)', label: 'Placements' },
      { bg: 'linear-gradient(135deg,#15803d,#064e3b)', label: 'Trishna Stage' },
    ],
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function MilestonesTimeline() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = rect.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrolled / total));
      setProgress(p);
      setActive(Math.min(TIMELINE.length - 1, Math.floor(p * TIMELINE.length)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Translate the strip so active milestone is centred
  // Each milestone slot is 340px wide + 32px gap = 372px
  const SLOT = 372;
  const stripTranslate = -active * SLOT;

  return (
    <section className="bg-warm-light">

      {/* Heading — scrolls normally above the sticky zone */}
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-6">
        <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
        <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
          Two decades,{' '}
          <span className="font-display italic font-medium" style={gradientText}>in eight moments.</span>
        </h2>
      </div>

      {/* Tall scroll container — height = scroll distance */}
      <div
        ref={wrapperRef}
        style={{ height: `${TIMELINE.length * 100}vh` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

          {/* Full-width strip — slides horizontally as user scrolls */}
          <div className="w-full overflow-hidden">
            <div
              className="flex items-end gap-8 px-[max(2rem,calc(50vw-170px))]"
              style={{
                transform: `translateX(${stripTranslate}px)`,
                transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                willChange: 'transform',
                width: 'max-content',
              }}
            >
              {TIMELINE.map((item, i) => {
                const isActive = i === active;
                const dist = Math.abs(i - active);
                const scale = isActive ? 1 : Math.max(0.78, 1 - dist * 0.08);
                const opacity = isActive ? 1 : Math.max(0.3, 1 - dist * 0.25);

                return (
                  <div
                    key={item.y}
                    className="flex-shrink-0 flex flex-col items-center"
                    style={{
                      width: '340px',
                      transform: `scale(${scale})`,
                      opacity,
                      transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.6s ease',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Stack of 3 images — fanned behind each other */}
                    <div className="relative w-full" style={{ height: '260px' }}>
                      {item.imgs.map((img, j) => {
                        // j=2 is back, j=0 is front
                        const zIdx = item.imgs.length - j;
                        const fanRotate = isActive
                          ? (j === 0 ? 0 : j === 1 ? -6 : 6)
                          : (j === 0 ? 0 : j === 1 ? -4 : 4);
                        const fanTranslateY = j === 0 ? 0 : j === 1 ? -8 : -12;
                        const fanTranslateX = j === 0 ? 0 : j === 1 ? -14 : 14;
                        const fanScale = j === 0 ? 1 : j === 1 ? 0.95 : 0.90;

                        return (
                          <div
                            key={j}
                            className="absolute inset-0 rounded-2xl overflow-hidden border border-white/30 shadow-card-soft"
                            style={{
                              background: img.bg,
                              zIndex: zIdx,
                              transform: `rotate(${fanRotate}deg) translateX(${fanTranslateX}px) translateY(${fanTranslateY}px) scale(${fanScale})`,
                              transition: 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)',
                              transformOrigin: 'bottom center',
                            }}
                          >
                            {/* Mock image content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                              <span
                                className="font-display italic font-black text-white/20 leading-none select-none"
                                style={{ fontSize: 'clamp(3rem,6vw,4.5rem)' }}
                              >
                                {item.y}
                              </span>
                              <span className="font-mono text-[0.6rem] font-bold tracking-[0.18em] uppercase text-white/35 text-center">
                                {img.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Year + title below image stack */}
                    <div className="mt-6 text-center w-full px-2">
                      <span
                        className="block font-display italic font-black leading-none tracking-tighter-2"
                        style={{ ...gradientText, fontSize: 'clamp(2rem,3vw,2.6rem)' }}
                      >
                        {item.y}
                      </span>
                      <span className="mt-1 block font-sans font-extrabold text-foreground text-[1.05rem] tracking-tight">
                        {item.t}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active milestone text card + progress */}
          <div className="max-w-[600px] mx-auto px-6 mt-8 text-center">
            {TIMELINE.map((item, i) => (
              <div
                key={item.y}
                className="transition-all duration-500 absolute left-1/2 -translate-x-1/2"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: `translateX(-50%) translateY(${active === i ? 0 : 12}px)`,
                  pointerEvents: active === i ? 'auto' : 'none',
                }}
              >
                <p className="text-muted leading-relaxed text-[1rem] max-w-[520px] mx-auto">{item.d}</p>
              </div>
            ))}
            {/* Spacer so the absolute positioned texts don't collapse */}
            <div style={{ height: '60px' }} />
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mt-4">
            {TIMELINE.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: active === i ? '28px' : '7px',
                  height: '7px',
                  background: active === i ? '#1F6B24' : '#d1d5db',
                }}
              />
            ))}
          </div>

          {/* Scroll hint on first load */}
          {progress === 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
              <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-muted">Scroll</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M8 13l-4-4M8 13l4-4" stroke="#1F6B24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}

        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-20 bg-warm-light" />

    </section>
  );
}
