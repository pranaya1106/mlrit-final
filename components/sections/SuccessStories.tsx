'use client';

import { useEffect, useRef, useState } from 'react';

type Card = { img: string; tag: string; name: string; role: string; company: string };

const CARDS: Card[] = [
  {
    img:  'https://i.ibb.co/MxvbKjRH/8.jpg',
    tag:  'Placement · Batch 2026',
    name: 'Microsoft Internship',
    role: 'Sai Loukhya Chundi & Kakumanu Sailatha',
    company: 'Microsoft · 51 LPA · ₹1.25 L/month Stipend',
  },
  {
    img:  'https://i.ibb.co/670CTVrD/6.png',
    tag:  'Faculty · Certification',
    name: 'Mrs. Vijay Keerthika',
    role: 'MLRIT CSE-AIML Faculty',
    company: 'Wipro TalentNext · Java Full Stack · 87%',
  },
  {
    img:  'https://i.ibb.co/99JB52L2/4.jpg',
    tag:  'Sports · Football',
    name: 'MLRIT Football Team',
    role: 'Sports Tournament · March 21–22',
    company: "1st Place · St. Peter's Engineering College",
  },
  {
    img:  'https://i.ibb.co/YFgQdGgx/1.jpg',
    tag:  'Placement · Batch 2025',
    name: '19 Students at Eidiko',
    role: 'Right Education, Bright Placements',
    company: 'Eidiko Systems Integrators · 4.70 LPA',
  },
  {
    img:  'https://i.ibb.co/S4L7YCQY/2.jpg',
    tag:  'Recognition · Rating',
    name: 'Careers360 AAAA',
    role: 'Four-A Accredited Institution',
    company: 'Careers360 · Top Engineering College',
  },
];

export default function SuccessStories() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((c) => (c + 1) % CARDS.length);
    }, 5000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  return (
    <section className="bg-[#fbf5e6] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Wall of Achievements
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.4rem)]">
            Success<br />
            <span className="font-display italic font-medium" style={{
              background: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>Stories.</span>
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Students, faculty and athletes — every banner tells a story of excellence.
          </p>
        </div>

        <div className="relative max-w-[1100px] mx-auto">
          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-[0_20px_50px_rgba(17,17,17,0.06)]">
            <div className="flex transition-transform duration-700 ease-out-quart"
                 style={{ transform: `translateX(-${active * 100}%)` }}>
              {CARDS.map((c, i) => (
                <article key={i} className="min-w-full grid md:grid-cols-[1.2fr_1fr] gap-8 p-8 md:p-12 items-center">
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="inline-block font-mono font-bold text-[0.66rem] tracking-[0.16em] uppercase text-primary bg-orange-50 border border-orange-200 rounded-full px-3 py-1">{c.tag}</span>
                    <h3 className="mt-4 font-sans font-extrabold tracking-tight text-foreground text-[clamp(1.6rem,2.4vw,2.2rem)]">{c.name}</h3>
                    <p className="mt-2 text-muted">{c.role}</p>
                    <p className="mt-1 text-foreground font-semibold">{c.company}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {CARDS.map((_, i) => (
              <button
                key={i}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setActive(i)}
                className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-7 bg-primary' : 'w-2 bg-border hover:bg-muted'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
