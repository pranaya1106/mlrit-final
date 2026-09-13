'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

type Card = {
  img: string;
  season: string;    // small pill label
  name: string;      // person / entity headline
  detail?: string;   // optional short detail (2-3 words)
};

const CARDS: Card[] = [
  {
    img: 'https://i.ibb.co/MxvbKjRH/8.jpg',
    season: 'Placement · 2026',
    name: 'Microsoft — 51 LPA',
    detail: 'Sai Loukhya & Sailatha · CSE',
  },
  {
    img: 'https://i.ibb.co/670CTVrD/6.png',
    season: 'Faculty · Cert',
    name: 'Mrs. Vijay Keerthika',
    detail: 'Wipro TalentNext · 87 %',
  },
  {
    img: 'https://i.ibb.co/99JB52L2/4.jpg',
    season: 'Sports · 1st Place',
    name: 'MLRIT Football',
    detail: 'vs. St. Peter\'s · March 21–22',
  },
  {
    img: 'https://i.ibb.co/YFgQdGgx/1.jpg',
    season: 'Placement · 2025',
    name: '19 Students at Eidiko',
    detail: 'Eidiko Systems · ₹4.70 LPA',
  },
  {
    img: 'https://i.ibb.co/S4L7YCQY/2.jpg',
    season: 'Recognition',
    name: 'Careers360 AAAA',
    detail: 'Four-A Accredited',
  },
  {
    img: 'https://i.ibb.co/Xf6Vbj44/5.jpg',
    season: 'Placement · 2025',
    name: 'Mehta Hitech Industries',
    detail: '3 Students · Batch 2025',
  },
];

export default function SuccessStories() {
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  // Observe which card is centered in the scroll container
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-card]'));
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const i = cards.indexOf(best.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { root: track, threshold: [0.5, 0.75, 0.99] }
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    const card = track?.querySelectorAll<HTMLElement>('[data-card]')[i];
    if (card && track) {
      const cardRect = card.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const target = card.offsetLeft - (trackRect.width - cardRect.width) / 2;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }
  };

  return (
    <section id="ssSection" className="relative bg-paper grain-texture text-foreground overflow-hidden py-20 md:py-28">
      {/* Soft warm glows to give the cream canvas some depth */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(1100px 500px at 20% 30%, rgba(232,93,4,0.06) 0%, transparent 60%),' +
            'radial-gradient(900px 500px at 85% 70%, rgba(1,116,31,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        {/* ── HEADER — centered, editorial ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-[820px] mx-auto"
        >
          <h2 className="font-sans font-semibold text-foreground leading-[1.06] tracking-tighter-2 text-[clamp(2rem,4vw,3.4rem)]">
            Building Real Careers,{' '}
            <span
              className="font-display italic font-medium"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, var(--foreground) 0%, var(--primary) 115%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              Not Just Degrees.
            </span>
          </h2>
          <p className="mt-5 mx-auto max-w-[620px] text-muted leading-[1.7] text-[1rem] md:text-[1.05rem]">
            Real placements, real achievements — MLRIT students on the biggest
            campus stages and the country&apos;s top recruiters.
          </p>
        </motion.div>
      </div>

      {/* ── CARD TRACK — horizontal snap carousel, full-bleed ── */}
      <div className="relative mt-12 md:mt-16">
        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[15vw] md:px-[22vw] lg:px-[28vw] pb-8"
          style={{ scrollBehavior: 'smooth' }}
        >
          {CARDS.map((c, i) => (
            <div
              key={i}
              data-card
              className="snap-center flex-shrink-0 w-[60vw] max-w-[380px] md:w-[36vw] md:max-w-[440px] lg:w-[26vw] lg:max-w-[420px] aspect-[3/4] relative rounded-2xl md:rounded-[24px] overflow-hidden bg-ink-2 group cursor-pointer transition-transform duration-500 hover:-translate-y-1"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.name}
                loading={i < 3 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Bottom vignette */}
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(12,12,14,0) 0%, rgba(12,12,14,0.9) 100%)',
                }}
              />

              {/* Top pill — season / category */}
              <div className="absolute top-4 left-4 md:top-5 md:left-5 z-[2]">
                <span className="inline-flex items-center h-7 md:h-8 px-3 rounded-full bg-black/45 backdrop-blur-sm border border-white/15 text-white/85 font-mono text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  {c.season}
                </span>
              </div>

              {/* Bottom name + detail */}
              <div className="absolute inset-x-0 bottom-0 z-[2] p-5 md:p-6">
                <div className="font-sans font-black text-white text-[1.05rem] md:text-[1.2rem] leading-[1.15] tracking-tight">
                  {c.name}
                </div>
                {c.detail && (
                  <div className="mt-1.5 text-white/70 text-[0.82rem] md:text-[0.88rem] leading-snug">
                    {c.detail}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {CARDS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`Go to story ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? 'w-8 bg-foreground' : 'w-1.5 bg-foreground/25 hover:bg-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
