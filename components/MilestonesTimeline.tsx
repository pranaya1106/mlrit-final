'use client';

import { useEffect, useRef, useState } from 'react';

const TIMELINE = [
  { y: '2005', t: 'Foundation Stone',   d: 'MLR Institute of Technology established under KMR Educational Society at Dundigal, Hyderabad.',             img: '/images/about/milestone-2005.jpg' },
  { y: '2008', t: 'First Graduation',   d: 'First batch of B.Tech graduates step out — placed across Wipro, Infosys and TCS.',                          img: '/images/about/milestone-2008.jpg' },
  { y: '2012', t: 'NBA Cycle Begins',   d: 'CSE, ECE and Mechanical programmes earn first NBA accreditation cycle.',                                     img: '/images/about/milestone-2012.jpg' },
  { y: '2017', t: 'IPFC Established',   d: 'Intellectual Property Facilitation Centre opens to support patent filings and IPR awareness.',               img: '/images/about/milestone-2017.jpg' },
  { y: '2019', t: 'NAAC Accreditation', d: 'Institutional NAAC accreditation granted — recognises overall quality.',                                     img: '/images/about/milestone-2019.jpg' },
  { y: '2022', t: 'Autonomous Status',  d: 'UGC grants autonomous status — institution designs its own regulations.',                                    img: '/images/about/milestone-2022.jpg' },
  { y: '2025', t: 'Two Decades',        d: 'MLRIT crosses 20 years with 7,000+ alumni placed across the world.',                                        img: '/images/about/milestone-2025.jpg' },
  { y: '2026', t: 'Trishna 2K26',       d: '21st Annual Day — 621 placement offers and a ₹51 LPA top package mark the strongest season yet.',           img: '/images/about/milestone-2026.jpg' },
];

const COLORS = ['#1F6B24','#2d7a34','#1a5e1f','#266b2c','#1F6B24','#2d7a34','#1a5e1f','#266b2c'];

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function MilestonesTimeline() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ticking = useRef(false);

  // Detect which card is most centred in the scroll container
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const containerMid = el.scrollLeft + el.clientWidth / 2;
        let closest = 0;
        let minDist = Infinity;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const cardMid = card.offsetLeft + card.offsetWidth / 2;
          const dist = Math.abs(containerMid - cardMid);
          if (dist < minDist) { minDist = dist; closest = i; }
        });
        setActive(closest);
        ticking.current = false;
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = scrollRef.current;
    const card = cardRefs.current[i];
    if (!el || !card) return;
    const target = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <section className="bg-warm-light py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Heading */}
        <div className="mb-12">
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Milestones</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Two decades,{' '}
            <span className="font-display italic font-medium" style={gradientText}>in eight moments.</span>
          </h2>
        </div>

        {/* Two-column: sticky image LEFT + horizontal scroll track RIGHT */}
        <div className="flex gap-10 lg:gap-16 items-start">

          {/* ── Sticky image pane ── */}
          <div className="hidden md:block sticky top-28 w-[38%] flex-shrink-0">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-card-soft">
              {TIMELINE.map((item, i) => (
                <div
                  key={item.y}
                  className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{ opacity: active === i ? 1 : 0, zIndex: active === i ? 1 : 0 }}
                >
                  {/* Coloured fallback behind image */}
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ background: COLORS[i] }}
                  >
                    <span
                      className="font-display italic font-black text-white/15 select-none leading-none"
                      style={{ fontSize: 'clamp(5rem,12vw,8rem)' }}
                    >
                      {item.y}
                    </span>
                  </div>
                  <img
                    src={item.img}
                    alt={item.t}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>

            {/* Active year + counter */}
            <div className="mt-5 flex items-baseline gap-3">
              <span
                className="font-display italic font-black leading-none tracking-tighter-2 transition-all duration-300"
                style={{ ...gradientText, fontSize: 'clamp(2.2rem,3vw,2.8rem)' }}
              >
                {TIMELINE[active].y}
              </span>
              <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-subtle">
                {String(active + 1).padStart(2, '0')} / {String(TIMELINE.length).padStart(2, '0')}
              </span>
            </div>

            {/* Dot nav */}
            <div className="mt-4 flex gap-2 items-center">
              {TIMELINE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to ${TIMELINE[i].y}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active === i ? '28px' : '8px',
                    height: '8px',
                    background: active === i ? '#1F6B24' : '#d1d5db',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── Horizontal scroll track ── */}
          <div className="flex-1 min-w-0">

            {/* Horizontal rail line */}
            <div className="relative mb-0">
              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {/* Leading spacer */}
                <div className="flex-shrink-0 w-1" />

                {TIMELINE.map((item, i) => (
                  <div
                    key={item.y}
                    ref={(el) => { cardRefs.current[i] = el; }}
                    className="snap-center flex-shrink-0 w-[min(320px,80vw)] relative pt-8"
                    onClick={() => scrollTo(i)}
                  >
                    {/* Node + horizontal rail */}
                    <div className="absolute top-0 left-0 right-0 h-8 flex items-center">
                      {/* Rail segment left */}
                      <div className="flex-1 h-px" style={{ background: i === 0 ? 'transparent' : 'var(--border)' }} />
                      {/* Node */}
                      <div
                        className="flex-shrink-0 grid place-items-center w-4 h-4 rounded-full border-2 transition-colors duration-300 z-10"
                        style={{
                          borderColor: active === i ? '#1F6B24' : '#d1d5db',
                          background: '#f5f0e8',
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                          style={{ background: active === i ? '#1F6B24' : '#d1d5db' }}
                        />
                      </div>
                      {/* Rail segment right */}
                      <div className="flex-1 h-px" style={{ background: i === TIMELINE.length - 1 ? 'transparent' : 'var(--border)' }} />
                    </div>

                    {/* Mobile image (shown on sm) */}
                    <div className="md:hidden mb-3 aspect-[4/3] rounded-xl overflow-hidden border border-border relative">
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: COLORS[i] }}>
                        <span className="font-display italic font-black text-white/15 text-[5rem] leading-none select-none">{item.y}</span>
                      </div>
                      <img src={item.img} alt={item.t} className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>

                    {/* Card */}
                    <div
                      className="rounded-2xl border bg-white/85 backdrop-blur-sm p-5 md:p-6 transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-card-soft"
                      style={{ borderColor: active === i ? '#1F6B24' : 'var(--border)' }}
                    >
                      <div className="flex items-baseline gap-3">
                        <span
                          className="font-display italic font-black leading-none tracking-tighter-2"
                          style={{ ...gradientText, fontSize: 'clamp(1.9rem,2.8vw,2.4rem)' }}
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

                {/* Trailing spacer */}
                <div className="flex-shrink-0 w-1" />
              </div>
            </div>

            {/* Mobile dot nav */}
            <div className="md:hidden mt-4 flex justify-center gap-2 items-center">
              {TIMELINE.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to ${TIMELINE[i].y}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: active === i ? '24px' : '7px',
                    height: '7px',
                    background: active === i ? '#1F6B24' : '#d1d5db',
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
