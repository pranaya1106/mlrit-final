'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: '-80px' } as const;
const CIE_AMBER = '#f59e0b';

const stagger = (childDelay = 0.06, initial = 0.02) => ({
  hidden: {},
  show: { transition: { staggerChildren: childDelay, delayChildren: initial } },
});

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <motion.div className="flex items-center gap-3" initial="hidden" whileInView="show" viewport={IN_VIEW} variants={stagger(0.15, 0)}>
      <motion.span aria-hidden className="h-px w-8 bg-primary origin-left"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } } }} />
      <motion.span className="font-mono text-[0.68rem] font-bold tracking-[0.3em] uppercase text-primary"
        variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } } }}>
        {children}
      </motion.span>
    </motion.div>
  );
}

const EVENTS = [
  { name: 'Workshop Carnival 2.0', date: 'Apr 10–11, 2026', kind: 'Workshop',              body: 'UI/UX, IoT, content and product design — expert mentors, real-time reviews on every table.', poster: '/images/clubs/cie/events/wc-2.png' },
  { name: 'Business to Brand',     date: 'Apr 3–4, 2025',   kind: 'Innovation Challenge',  body: '48 hours to build branding, visual identity, logo and an ad-film — judged by an industry panel that arrives with opinions.', poster: '/images/clubs/cie/events/b2b.png' },
  { name: 'Equinox E-Summit',      date: 'Nov 28–30, 2024', kind: 'Startup Summit',        body: 'A three-day summit — student pitches, investor connections, speaker series and an innovation showcase.', poster: '/images/clubs/cie/events/equinox.png' },
  { name: 'GI Mahotsav 2024',      date: 'Mar 26–28, 2024', kind: 'Culture · Marketplace', body: 'A Geographical Indications mela — India\'s protected regional crafts and MSME connectivity, on campus.', poster: '/images/clubs/cie/events/gi.png' },
  { name: 'Workshop Carnival',     date: 'Mar 11–16, 2024', kind: 'Workshop · 6 days',     body: 'Six-day hands-on run across UI/UX, IoT prototyping and WordPress, with domain contests every night.', poster: '/images/clubs/cie/events/wc.png' },
  { name: 'MetaLoop',              date: 'Oct 6–7, 2023',   kind: 'Hackathon · Flagship',  body: '36-hour flagship hackathon — AR/VR, blockchain and virtual-world tracks. ₹75,000 prize pool.', poster: '/images/clubs/cie/events/metaloop.png' },
  { name: 'Hustle Mania',          date: 'Apr 24, 2023',    kind: 'Innovation Challenge',  body: 'Five competitive domains — sales sprints, negotiation duels, ad-blitz and strategy — under one roof.', poster: '/images/clubs/cie/events/hustle-mania.png' },
];

const FACILITIES = [
  { title: 'Innovation Hub / EPICS Lab', meta: 'Flagship',                body: 'Where cohort projects live and Friday demos happen.' },
  { title: 'Makerspace',                 meta: '3D · Laser · CNC',        body: '3D printers, laser cutters, CNC routers.' },
  { title: 'Prototype Lab',              meta: 'Bench · Test · Iterate',  body: 'Benches and instruments for the second and third builds.' },
  { title: 'Internet of Things Lab',     meta: 'Sensors · MCUs · Radios', body: 'Dev kits, radios and MCUs — sensor to cloud.' },
  { title: 'Social Square',              meta: 'Community · Events',      body: 'Cohort meets, speakers, the after-parties.' },
  { title: 'Meeting Room',               meta: 'Investors · Mentors',     body: 'The quiet room for the harder conversations.' },
];

const VALUES = ['Innovation', 'Leadership', 'Collaboration', 'Creativity', 'Integrity', 'Impact', 'Continuous Learning', 'Inclusivity'];

// Count-up hook
function useCountUp(target: number, ms = 1400) {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true;
      let start: number | null = null;
      const step = (t: number) => {
        if (start == null) start = t;
        const p = Math.min(1, (t - start) / ms);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, ms]);

  return { ref, n };
}

const STATS = [
  { value: 500, label: 'Students engaged',  suffix: '+' },
  { value: 80,  label: 'Microprojects',     suffix: '+' },
  { value: 40,  label: 'Products built',    suffix: '+' },
  { value: 25,  label: 'Startups mentored', suffix: '+' },
];

function StatItem({ value, label, suffix, showDivider, index }: { value: number; label: string; suffix: string; showDivider: boolean; index: number }) {
  const { ref, n } = useCountUp(value);
  return (
    <motion.div className="group relative px-4 md:px-8 lg:px-10 py-2 md:py-6"
      initial="hidden" whileInView="show" viewport={IN_VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {showDivider && (
        <motion.span aria-hidden className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 w-px bg-white/10 origin-center"
          style={{ height: '100%' }}
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease: EASE } } }}
        />
      )}
      <motion.div variants={{ hidden: { opacity: 0, x: -6 }, show: { opacity: 0.5, x: 0, transition: { duration: 0.5, ease: EASE } } }}
        className="font-mono text-[0.58rem] font-bold tracking-[0.28em] uppercase text-white/40 mb-4">
        № 0{index + 1}
      </motion.div>
      <motion.div ref={ref}
        variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
        className="font-sans font-black text-white leading-[0.85] tracking-tighter-3 tabular-nums group-hover:text-primary transition-colors duration-700"
        style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)' }}
      >
        {n.toLocaleString('en-IN')}<span className="text-primary">{suffix}</span>
      </motion.div>
      <motion.div aria-hidden variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } } }}
        className="mt-6 h-px bg-white/15 origin-left w-[70%] group-hover:bg-primary transition-colors duration-500" />
      <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
        className="mt-4 font-mono text-[0.66rem] font-bold tracking-[0.24em] uppercase text-white/60">
        {label}
      </motion.div>
    </motion.div>
  );
}

export default function CieCollectionGallery() {
  return (
    <>
      {/* Section header */}
      <div className="relative z-10 border-t border-white/10 bg-black">
        <div className="px-6 pb-16 pt-24 sm:px-10 sm:pt-32">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/30">02</span>
          <h2 className="mt-2 font-semibold leading-none tracking-[-0.035em] text-white" style={{ fontSize: 'clamp(2rem,5vw,3.75rem)' }}>
            Collection
          </h2>
        </div>
      </div>

      {/* Events marquee */}
      <section id="events" className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-12">
          <Eyebrow>Events</Eyebrow>
          <motion.h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]"
            initial="hidden" whileInView="show" viewport={IN_VIEW}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }}
            style={{ display: 'block' }}
          >
            {['The', 'record.'].map((w, i) => (
              <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
            ))}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
            className="mt-3 text-white/50 text-[0.92rem] max-w-[52ch]">
            Hover any poster to read what it was.
          </motion.p>
        </div>

        <div className="relative overflow-hidden"
          style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0, #000 6%, #000 94%, transparent 100%)' }}
        >
          <div className="flex w-max gap-5 md:gap-6 py-2 cie-events-marquee">
            {[...EVENTS, ...EVENTS].map((e, i) => (
              <article key={`${e.name}-${i}`}
                className="group relative flex-shrink-0 w-[260px] md:w-[300px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.03] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.poster} alt={e.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 z-[1] transition-opacity duration-300 group-hover:opacity-0">
                  <div className="font-sans font-black text-white text-[1rem] leading-tight tracking-tight">{e.name}</div>
                </div>
                <div className="absolute inset-0 z-[2] p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(180deg, rgba(6,6,6,0.35) 0%, rgba(6,6,6,0.9) 100%)' }}
                >
                  <div className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-primary">{e.kind}</div>
                  <h3 className="mt-2 font-sans font-black text-white text-[1.15rem] leading-tight tracking-tight">{e.name}</h3>
                  <div className="mt-1 font-mono text-[0.62rem] font-bold tracking-[0.18em] uppercase text-white/50">{e.date}</div>
                  <p className="mt-3 text-white/75 text-[0.78rem] leading-[1.5]">{e.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <style jsx>{`
          .cie-events-marquee { animation: cie-events-scroll 60s linear infinite; }
          .cie-events-marquee:hover { animation-play-state: paused; }
          @keyframes cie-events-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @media (prefers-reduced-motion: reduce) { .cie-events-marquee { animation: none; } }
        `}</style>
      </section>

      {/* Facilities */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Facilities</Eyebrow>
          <motion.h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)] mb-14"
            initial="hidden" whileInView="show" viewport={IN_VIEW}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }} style={{ display: 'block' }}
          >
            {['Rooms', 'we', 'use.'].map((w, i) => (
              <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
            ))}
          </motion.h2>
          <div className="grid md:grid-cols-2 md:gap-x-14 lg:gap-x-20">
            {FACILITIES.map((f, i) => (
              <motion.div key={f.title}
                initial="hidden" whileInView="show" viewport={IN_VIEW}
                variants={stagger(0.08, 0)} whileHover="hover"
                className="relative grid grid-cols-[auto_1fr] gap-6 py-6"
              >
                <motion.span aria-hidden className="absolute top-0 left-0 right-0 h-px bg-white/10 origin-left"
                  variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } }, hover: { backgroundColor: 'rgba(232,93,4,0.55)', transition: { duration: 0.4 } } }} />
                <motion.span variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}
                  className="font-mono text-[0.7rem] font-bold tracking-[0.2em] uppercase text-primary pt-1 min-w-[2rem] tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </motion.span>
                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } } }}>
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-sans font-extrabold text-white text-[1.05rem] md:text-[1.15rem] leading-tight">{f.title}</h3>
                    <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/40">{f.meta}</span>
                  </div>
                  <p className="mt-2 text-white/55 text-[0.88rem] leading-[1.65]">{f.body}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="relative bg-black py-24 md:py-32 overflow-hidden border-t border-white/[0.08]">
        <div aria-hidden className="absolute top-8 right-8 hidden md:block z-[1]">
          <div className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/40 text-right">§ Chapter Seven</div>
        </div>
        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 z-[1]">
          <div className="flex items-end justify-between gap-6 mb-16 md:mb-20 flex-wrap">
            <div>
              <Eyebrow>By the numbers</Eyebrow>
              <motion.h2 className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.6rem,6vw,5.5rem)]"
                initial="hidden" whileInView="show" viewport={IN_VIEW}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }} style={{ display: 'block' }}
              >
                {['In', 'practice.'].map((w, i) => (
                  <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                    style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
                ))}
              </motion.h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-14 md:gap-y-0">
            {STATS.map((s, i) => (
              <StatItem key={s.label} value={s.value} label={s.label} suffix={s.suffix} showDivider={i < STATS.length - 1} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Core values marquee */}
      <section className="relative bg-black py-14 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 mb-6">
          <Eyebrow>Core values</Eyebrow>
        </div>
        <div className="relative overflow-hidden py-2"
          style={{ WebkitMaskImage: 'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0, #000 5%, #000 95%, transparent 100%)' }}
        >
          <div className="flex w-max gap-10 items-center cie-values-marquee">
            {[...VALUES, ...VALUES, ...VALUES].map((v, i) => (
              <span key={i} className="inline-flex items-center gap-10 whitespace-nowrap font-sans font-black text-white/85 text-[clamp(1.4rem,2vw,1.8rem)] tracking-tight">
                {v}
                <span aria-hidden className="text-primary text-[0.6em]">■</span>
              </span>
            ))}
          </div>
        </div>
        <style jsx>{`
          .cie-values-marquee { animation: cie-values-scroll 45s linear infinite; }
          .cie-values-marquee:hover { animation-play-state: paused; }
          @keyframes cie-values-scroll { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }
          @media (prefers-reduced-motion: reduce) { .cie-values-marquee { animation: none; } }
        `}</style>
      </section>
    </>
  );
}
