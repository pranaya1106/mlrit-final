'use client';

import { useEffect, useRef, useState } from 'react';

type Card = { img: string; tag: string; name: string; role: string; company: string };

const CARDS: Card[] = [
  { img: 'https://i.ibb.co/MxvbKjRH/8.jpg',  tag: 'Placement · Batch 2026', name: 'Microsoft Internship',     role: 'Sai Loukhya Chundi & Kakumanu Sailatha', company: 'Microsoft · 51 LPA · ₹1.25 Lakh/month Stipend' },
  { img: 'https://i.ibb.co/670CTVrD/6.png',  tag: 'Faculty · Certification', name: 'Mrs. Vijay Keerthika',     role: 'MLRIT CSE-AIML Faculty',                  company: 'Wipro TalentNext · Java Full Stack · 87%' },
  { img: 'https://i.ibb.co/99JB52L2/4.jpg',  tag: 'Sports · Football',       name: 'MLRIT Football Team',      role: 'Sports Tournament · March 21–22',         company: "1st Place · St. Peter's Engineering College" },
  { img: 'https://i.ibb.co/YFgQdGgx/1.jpg',  tag: 'Placement · Batch 2025',  name: '19 Students at Eidiko',    role: 'Right Education, Bright Placements',      company: 'Eidiko Systems Integrators · 4.70 LPA' },
  { img: 'https://i.ibb.co/S4L7YCQY/2.jpg',  tag: 'Recognition · Rating',    name: 'Careers360 AAAA',          role: 'Four-A Accredited Institution',           company: 'Careers360 · Top Engineering College' },
  { img: 'https://i.ibb.co/Xf6Vbj44/5.jpg',  tag: 'Placements · 2025',       name: 'Mehta Hitech Industries',  role: '3 Students · Batch 2025',                 company: 'Bright Placements · Right Education' },
];

export default function SuccessStories() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setActive((c) => (c + 1) % CARDS.length);
    }, 5500);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, []);

  const restartTimer = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => setActive((c) => (c + 1) % CARDS.length), 5500);
  };

  return (
    <section id="ssSection" className="bg-cream py-16 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="max-w-[680px] mb-12">
          <span className="font-mono text-[0.7rem] font-extrabold tracking-[0.22em] uppercase text-primary">
            Wall of Achievements
          </span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 leading-[1.0] text-foreground text-[clamp(2.6rem,5vw,4.5rem)]">
            Success<br />
            <span className="font-display italic font-medium" style={{
              backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>Stories.</span>
          </h2>
          <p className="mt-4 text-muted leading-relaxed max-w-[480px]">
            Students, faculty and athletes — every banner tells a story of excellence.
          </p>
        </div>

        {/* Carousel — full-width image, text on hover only */}
        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-out-quart" style={{ transform: `translateX(-${active * 100}%)` }}>
              {CARDS.map((c, i) => (
                <article key={i} className="min-w-full">
                  <a href="#" className="group relative block rounded-3xl overflow-hidden border border-border bg-neutral-50 aspect-[16/9]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.img} alt={c.name} loading={i === 0 ? 'eager' : 'lazy'} className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 md:group-hover:scale-105" />
                    {/* Overlay — always visible on touch/mobile; hover-only from md up (no hover on touch) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute left-6 right-6 bottom-6 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 text-white">
                      <span className="inline-block font-mono font-bold text-[0.62rem] tracking-[0.18em] uppercase text-warm/85">{c.tag}</span>
                      <h3 className="mt-2 font-sans font-extrabold tracking-tighter-2 text-[clamp(1.4rem,2.2vw,2rem)] leading-tight">{c.name}</h3>
                      <p className="mt-1.5 text-white/80 text-[0.96rem]">{c.role}</p>
                      <p className="mt-1 text-white/65 text-[0.92rem]">{c.company}</p>
                    </div>
                  </a>
                </article>
              ))}
            </div>
          </div>

          {/* Controls — centred */}
          <div className="mt-7 flex items-center justify-center gap-6">
            <button aria-label="Previous" onClick={() => { setActive((c) => (c - 1 + CARDS.length) % CARDS.length); restartTimer(); }} className="w-11 h-11 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors grid place-items-center">←</button>
            <div className="flex gap-2">
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => { setActive(i); restartTimer(); }}
                  className={`h-1 rounded-full transition-all duration-300 ${i === active ? 'w-8 bg-primary' : 'w-2 bg-border hover:bg-muted'}`}
                />
              ))}
            </div>
            <button aria-label="Next" onClick={() => { setActive((c) => (c + 1) % CARDS.length); restartTimer(); }} className="w-11 h-11 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors grid place-items-center">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}
