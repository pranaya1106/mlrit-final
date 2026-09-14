'use client';

import { motion } from 'framer-motion';

type Card = {
  img: string;
  season: string;
  name: string;
  detail?: string;
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
  return (
    <section id="ssSection" className="relative bg-paper grain-texture text-foreground overflow-hidden py-16 md:py-20">
      {/* Soft warm glows */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(1100px 500px at 20% 30%, rgba(232,93,4,0.06) 0%, transparent 60%),' +
            'radial-gradient(900px 500px at 85% 70%, rgba(1,116,31,0.05) 0%, transparent 60%)',
        }}
      />

      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-[900px] mx-auto mb-10 md:mb-12"
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span aria-hidden className="h-px w-8 bg-primary/70" />
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.3em] uppercase text-primary">
              Wall of Achievements
            </span>
            <span aria-hidden className="h-px w-8 bg-primary/70" />
          </div>

          <h2 className="font-sans font-black text-foreground leading-[0.96] tracking-tighter-3 text-[clamp(2.2rem,4.8vw,4.2rem)]">
            <span className="block">Building Real Careers,</span>
            <span className="relative inline-block mt-1 md:mt-2">
              <span
                className="font-display italic font-medium pb-[0.14em] text-foreground"
                style={{
                  fontFamily: 'var(--font-playfair), Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  lineHeight: 1.08,
                }}
              >
                Not Just Degrees.
              </span>
              <svg
                aria-hidden
                viewBox="0 0 480 24"
                preserveAspectRatio="none"
                className="absolute left-0 right-0 -bottom-1 md:-bottom-2 w-full h-3 md:h-4 pointer-events-none"
                fill="none"
              >
                <path
                  d="M4 14 Q 80 4, 160 12 T 320 12 T 476 10"
                  stroke="url(#underline-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="underline-grad" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0" stopColor="#c49a10" />
                    <stop offset="0.5" stopColor="#e85d04" />
                    <stop offset="1" stopColor="#01741f" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          <p className="mt-6 mx-auto max-w-[620px] text-muted leading-[1.7] text-[0.98rem] md:text-[1.02rem]">
            Real placements, real achievements — MLRIT students on the biggest
            campus stages and the country&apos;s top recruiters.
          </p>
        </motion.div>
      </div>

      {/* ── Infinite marquee — cards scroll continuously; hover pauses. ── */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
          maskImage:
            'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)',
        }}
      >
        <div className="flex w-max gap-5 md:gap-6 py-2 marquee-cards">
          {/* Duplicated once so the track loops seamlessly at -50% */}
          {[...CARDS, ...CARDS].map((c, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[74vw] max-w-[380px] md:w-[36vw] md:max-w-[440px] lg:w-[26vw] lg:max-w-[420px] aspect-[3/4] relative rounded-2xl md:rounded-[24px] overflow-hidden bg-ink-2 group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.img}
                alt={c.name}
                loading={i < 4 ? 'eager' : 'lazy'}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(12,12,14,0) 0%, rgba(12,12,14,0.9) 100%)',
                }}
              />
              <div className="absolute top-4 left-4 md:top-5 md:left-5 z-[2]">
                <span className="inline-flex items-center h-7 md:h-8 px-3 rounded-full bg-black/45 backdrop-blur-sm border border-white/15 text-white/85 font-mono text-[0.6rem] md:text-[0.65rem] font-bold tracking-[0.18em] uppercase">
                  {c.season}
                </span>
              </div>
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
      </div>

      {/* Local marquee keyframes — long duration so it feels leisurely,
          pauses on hover so users can inspect a card. */}
      <style jsx>{`
        .marquee-cards {
          animation: ss-marquee 60s linear infinite;
        }
        .marquee-cards:hover {
          animation-play-state: paused;
        }
        @keyframes ss-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-cards { animation: none; }
        }
      `}</style>
    </section>
  );
}
