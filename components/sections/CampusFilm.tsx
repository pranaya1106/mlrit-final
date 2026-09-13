'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * CampusFilm — Masters Union-style scroll-driven video reveal.
 *
 * The section is 260vh tall so a sticky-pinned viewport inside gets a
 * long scroll runway. As the user scrolls through it, the video card
 * scales from ~62% of viewport up to a full-bleed 100% × 100vh card,
 * holds for a middle beat so the film can play, then shrinks back down.
 *
 * The editorial eyebrow above the card fades out as the card grows, and
 * a caption fades in when the card is fullscreen — same rhythm the
 * mastersunion.org campus-film beat uses.
 */
export default function CampusFilm() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Grow → hold → shrink. Percentages are of `scrollYProgress` (0-1).
  const scale  = useTransform(scrollYProgress, [0, 0.35, 0.72, 1], [0.62, 1, 1, 0.62]);
  const radius = useTransform(scrollYProgress, [0, 0.35, 0.72, 1], [40, 0, 0, 40]);

  return (
    <section
      ref={ref}
      className="relative bg-paper"
      style={{ height: '260vh' }}
      aria-label="Campus film reveal"
    >
      {/* Sticky viewport frame — pins the video card while section scrolls */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Full-viewport video card, scaled by scroll progress */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="absolute inset-0 overflow-hidden bg-ink shadow-[0_40px_100px_-30px_rgba(15,15,15,0.35)] will-change-transform origin-center"
        >
          <video
            autoPlay muted loop playsInline preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </section>
  );
}
