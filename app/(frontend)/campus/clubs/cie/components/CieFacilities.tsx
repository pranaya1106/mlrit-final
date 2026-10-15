'use client';

/**
 * CIE — Facilities as a pinned horizontal-scroll gallery.
 *
 * The section pins to the viewport and the cards translate horizontally as you
 * scroll down, with a progress bar underneath. The section's own height is set
 * to (viewport + track overflow) so vertical scroll maps ~1:1 to horizontal
 * travel. Progress comes from a per-frame read, so it works under Lenis.
 *
 * Reduced-motion falls back to a native swipeable horizontal scroll.
 */

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { SectionHead } from './cieShared';

const FACILITIES = [
  { title: 'Innovation Hub / EPICS Lab', meta: 'Flagship',                body: 'Where cohort projects live and Friday demos happen.' },
  { title: 'Makerspace',                 meta: '3D · Laser · CNC',        body: '3D printers, laser cutters, CNC routers.' },
  { title: 'Prototype Lab',              meta: 'Bench · Test · Iterate',  body: 'Benches and instruments for the second and third builds.' },
  { title: 'Internet of Things Lab',     meta: 'Sensors · MCUs · Radios', body: 'Dev kits, radios and MCUs — sensor to cloud.' },
  { title: 'Social Square',              meta: 'Community · Events',      body: 'Cohort meets, speakers, the after-parties.' },
  { title: 'Meeting Room',               meta: 'Investors · Mentors',     body: 'The quiet room for the harder conversations.' },
];

function Card({ f, i }: { f: typeof FACILITIES[number]; i: number }) {
  return (
    <article className="group relative flex-shrink-0 w-[270px] md:w-[360px] h-[360px] md:h-[440px] rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-7 md:p-9 flex flex-col overflow-hidden transition-colors duration-300 hover:border-primary/40">
      {/* hover glow */}
      <span aria-hidden className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'rgba(232,93,4,0.28)' }} />
      <div className="relative flex items-start justify-between gap-3">
        <span className="font-sans font-black text-white/15 text-[clamp(2.6rem,4vw,3.6rem)] leading-none tracking-tighter-3 tabular-nums transition-colors duration-500 group-hover:text-primary">
          {String(i + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[0.56rem] font-bold tracking-[0.2em] uppercase text-white/40 pt-2 text-right">{f.meta}</span>
      </div>
      <h3 className="relative mt-auto font-sans font-black text-white text-[clamp(1.3rem,2vw,1.9rem)] leading-[1.05] tracking-tight">{f.title}</h3>
      <p className="relative mt-3 text-white/55 text-[0.95rem] leading-[1.6]">{f.body}</p>
    </article>
  );
}

export default function CieFacilities() {
  const reduced = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const scaleX = useMotionValue(0);

  useEffect(() => {
    if (reduced) return;
    const sec = sectionRef.current;
    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!sec || !track || !sticky) return;

    let maxX = 0;
    const measure = () => {
      maxX = Math.max(0, track.scrollWidth - sticky.clientWidth);
      sec.style.height = `${window.innerHeight + maxX}px`;
    };
    measure();
    window.addEventListener('resize', measure);

    let raf = 0;
    let active = false;
    const tick = () => {
      if (!active) return;
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const total = sec.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-sec.getBoundingClientRect().top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      x.set(-(p * maxX));
      scaleX.set(p);
    };
    const run = () => {
      if (active) return;
      active = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      active = false;
      cancelAnimationFrame(raf);
    };
    // Pin math only runs while the section is on (or near) screen.
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? run() : stop()),
      { rootMargin: '200px 0px 200px 0px' },
    );
    io.observe(sec);
    return () => {
      io.disconnect();
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(raf);
    };
  }, [reduced, x, scaleX]);

  // Reduced-motion: native swipeable row.
  if (reduced) {
    return (
      <section id="facilities" className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
          <SectionHead eyebrow="Facilities" index="§ the space" title={<>Our space.</>} lead="Six rooms, from first build to final pitch." />
        </div>
        <div className="mt-12 overflow-x-auto no-scrollbar">
          <div className="flex gap-5 px-6 md:px-10 lg:px-16 w-max">
            {FACILITIES.map((f, i) => (
              <Card key={f.title} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="facilities" ref={sectionRef} className="relative bg-black border-t border-white/[0.08]">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="max-w-[1280px] mx-auto w-full px-6 md:px-10 lg:px-16">
          <SectionHead eyebrow="Facilities" index="§ the space" title={<>Our space.</>} lead="Six rooms, from first build to final pitch — scroll to move through the floor." />
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="mt-10 md:mt-14 flex gap-5 md:gap-6 px-6 md:px-10 lg:px-16 pr-[14vw] w-max will-change-transform"
        >
          {FACILITIES.map((f, i) => (
            <Card key={f.title} f={f} i={i} />
          ))}
        </motion.div>

        {/* Progress bar */}
        <div className="max-w-[1280px] mx-auto w-full px-6 md:px-10 lg:px-16 mt-10 md:mt-14">
          <div className="relative h-px w-full bg-white/10 overflow-hidden">
            <motion.span
              aria-hidden
              className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-primary to-primary/50"
              style={{ scaleX }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
