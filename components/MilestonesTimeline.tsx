'use client';

import { useEffect, useRef, useState } from 'react';

const TIMELINE = [
  {
    y: '2005', t: 'Foundation Stone',
    d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad.',
    img: '/images/about/milestone-2005.jpg',
  },
  {
    y: '2008', t: 'First Graduation',
    d: 'First batch of B.Tech graduates step out — placed across Wipro, Infosys and TCS.',
    img: '/images/about/milestone-2008.jpg',
  },
  {
    y: '2012', t: 'NBA Cycle Begins',
    d: 'CSE, ECE and Mechanical programmes earn first NBA accreditation cycle.',
    img: '/images/about/milestone-2012.jpg',
  },
  {
    y: '2017', t: 'IPFC Established',
    d: 'Intellectual Property Facilitation Centre opens to support patent filings and IPR awareness.',
    img: '/images/about/milestone-2017.jpg',
  },
  {
    y: '2019', t: 'NAAC Accreditation',
    d: 'Institutional NAAC accreditation granted — recognises overall quality.',
    img: '/images/about/milestone-2019.jpg',
  },
  {
    y: '2022', t: 'Autonomous Status',
    d: 'UGC grants autonomous status — institution designs its own regulations.',
    img: '/images/about/milestone-2022.jpg',
  },
  {
    y: '2025', t: 'Two Decades',
    d: 'MLRIT crosses 20 years with 7,000+ alumni placed across the world.',
    img: '/images/about/milestone-2025.jpg',
  },
  {
    y: '2026', t: 'Trishna 2K26',
    d: '21st Annual Day — 621 placement offers and a ₹51 LPA top package mark the strongest season yet.',
    img: '/images/about/milestone-2026.jpg',
  },
];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

// Fallback solid-color placeholder when image is missing
const PLACEHOLDER_COLORS = [
  '#1F6B24', '#2d7a34', '#1a5e1f', '#266b2c',
  '#1F6B24', '#2d7a34', '#1a5e1f', '#266b2c',
];

export default function MilestonesTimeline() {
  const [active, setActive] = useState(0);
  const [imgVisible, setImgVisible] = useState(true);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevActive = useRef(0);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (prevActive.current !== i) {
              // Crossfade image
              setImgVisible(false);
              setTimeout(() => {
                setActive(i);
                prevActive.current = i;
                setImgVisible(true);
              }, 200);
            }
          }
        },
        { threshold: 0.55 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <section className="bg-warm-light py-20 md:py-28">
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Section heading */}
        <div className="mb-14 md:mb-16">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Two decades,{' '}
            <span className="font-display italic font-medium" style={gradientText}>
              in eight moments.
            </span>
          </h2>
        </div>

        {/* Desktop: sticky image left + scrolling cards right */}
        <div className="hidden md:flex gap-16 items-start">

          {/* Sticky image pane */}
          <div className="sticky top-28 w-[42%] flex-shrink-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-soft">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.y}
                  className="absolute inset-0 transition-opacity duration-500"
                  style={{ opacity: active === i ? 1 : 0 }}
                >
                  <img
                    src={item.img}
                    alt={item.t}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to colored div if image missing
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Colored fallback behind image */}
                  <div
                    className="absolute inset-0 -z-10 flex items-center justify-center"
                    style={{ background: PLACEHOLDER_COLORS[i] }}
                  >
                    <span
                      className="font-display italic font-black text-white/20 select-none"
                      style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', lineHeight: 1 }}
                    >
                      {item.y}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Year indicator below image */}
            <div className="mt-5 flex items-baseline gap-3">
              <span
                className="font-display italic font-black text-[clamp(2.4rem,3.5vw,3rem)] leading-none tracking-tighter-2 transition-all duration-300"
                style={gradientText}
              >
                {TIMELINE[active].y}
              </span>
              <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
              </span>
            </div>

            {/* Progress dots */}
            <div className="mt-4 flex gap-2 items-center">
              {TIMELINE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => itemRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="transition-all duration-300 rounded-full"
                  style={{
                    width: active === i ? '28px' : '8px',
                    height: '8px',
                    background: active === i ? '#1F6B24' : '#d1d5db',
                  }}
                  aria-label={`Go to ${TIMELINE[i].y}`}
                />
              ))}
            </div>
          </div>

          {/* Scrolling cards */}
          <div className="flex-1 relative">
            {/* Vertical rail */}
            <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

            <div className="space-y-10 pl-8">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.y}
                  ref={(el) => { itemRefs.current[i] = el; }}
                  className="relative"
                >
                  {/* Node on rail */}
                  <span
                    className="absolute -left-8 top-7 -translate-x-1/2 z-10 grid place-items-center w-4 h-4 rounded-full border-2 transition-colors duration-300"
                    style={{
                      borderColor: active === i ? '#1F6B24' : '#d1d5db',
                      background: '#f5f0e8',
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                      style={{ background: active === i ? '#1F6B24' : '#d1d5db' }}
                    />
                  </span>

                  <div
                    className="rounded-2xl border bg-white/85 backdrop-blur-sm p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-soft"
                    style={{
                      borderColor: active === i ? '#1F6B24' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-baseline gap-3">
                      <span
                        className="font-display italic font-black text-[clamp(2rem,3vw,2.6rem)] leading-none tracking-tighter-2"
                        style={gradientText}
                      >
                        {item.y}
                      </span>
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                        {String(i + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-3 font-sans font-extrabold text-foreground text-[1.2rem] tracking-tight leading-snug">
                      {item.t}
                    </h3>
                    <p className="mt-2 text-muted leading-relaxed text-[0.96rem]">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: horizontal scroll track */}
        <div className="md:hidden">
          {/* Horizontal scroll container */}
          <div className="relative">
            {/* Horizontal rail */}
            <div className="absolute top-[26px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            <div
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {TIMELINE.map((item, i) => (
                <div
                  key={item.y}
                  className="snap-start flex-shrink-0 w-[78vw] pt-10 relative"
                >
                  {/* Node */}
                  <span className="absolute top-[18px] left-6 -translate-x-1/2 z-10 grid place-items-center w-4 h-4 rounded-full border-2 border-primary bg-warm-light">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </span>

                  {/* Image */}
                  <div className="mx-1 mb-4 aspect-[4/3] rounded-xl overflow-hidden border border-border relative">
                    <img
                      src={item.img}
                      alt={item.t}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div
                      className="absolute inset-0 -z-10 flex items-center justify-center"
                      style={{ background: PLACEHOLDER_COLORS[i] }}
                    >
                      <span className="font-display italic font-black text-white/20 text-[5rem] leading-none select-none">
                        {item.y}
                      </span>
                    </div>
                  </div>

                  {/* Card */}
                  <div className="rounded-2xl border border-border bg-white/85 backdrop-blur-sm p-5 mx-1">
                    <div className="flex items-baseline gap-3">
                      <span
                        className="font-display italic font-black text-[2rem] leading-none tracking-tighter-2"
                        style={gradientText}
                      >
                        {item.y}
                      </span>
                      <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                        {String(i + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="mt-3 font-sans font-extrabold text-foreground text-[1.1rem] tracking-tight leading-snug">
                      {item.t}
                    </h3>
                    <p className="mt-2 text-muted leading-relaxed text-[0.93rem]">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
