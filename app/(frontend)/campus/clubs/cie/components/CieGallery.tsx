'use client';

/** CIE — Gallery as a clip-reveal bento with hover zoom. */

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHead, MagneticButton, EASE, IN_VIEW } from './cieShared';

const GALLERY = [
  { src: '/images/clubs/cie/gallery/cie.jpg',                 caption: 'The CIE floor',        span: 8 },
  { src: '/images/clubs/cie/gallery/makerspace.jpg',          caption: 'Makerspace',           span: 4 },
  { src: '/images/clubs/cie/gallery/3d-printing.jpg',         caption: '3D printing',          span: 4 },
  { src: '/images/clubs/cie/gallery/epicslab.jpg',            caption: 'EPICS Lab',            span: 4 },
  { src: '/images/clubs/cie/gallery/laser-engraver.jpg',      caption: 'Laser engraver',       span: 4 },
  { src: '/images/clubs/cie/gallery/wooden-graver.jpg',       caption: 'Wooden graver',        span: 6 },
  { src: '/images/clubs/cie/gallery/u-table.jpg',             caption: 'The U-table',          span: 6 },
  { src: '/images/clubs/cie/gallery/efest-auditorium.jpg',    caption: 'E-Summit stage',       span: 8 },
  { src: '/images/clubs/cie/gallery/innovation-challenge.jpg', caption: 'Innovation challenge', span: 4 },
];

export default function CieGallery() {
  return (
    <section id="gallery" className="relative bg-black py-20 md:py-32 overflow-hidden border-t border-white/[0.08]">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHead eyebrow="Gallery" index="§ living document" title={<>The floor, in frames.</>} />

        <motion.div
          className="mt-14 grid grid-cols-12 gap-3 md:gap-4"
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        >
          {GALLERY.map((g) => (
            <motion.figure
              key={g.src}
              variants={{
                hidden: { opacity: 0, y: 30, clipPath: 'inset(0 0 100% 0)' },
                show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.85, ease: EASE } },
              }}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl bg-neutral-900 aspect-[4/3] ring-1 ring-white/5 hover:ring-primary/40 transition-[box-shadow,--tw-ring-color] duration-500"
              style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={g.src}
                alt={g.caption}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.08]"
              />
              <span aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 52%, rgba(0,0,0,0.72) 100%)' }} />
              <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-1 opacity-90 group-hover:translate-y-0 transition-transform duration-500 ease-out-quart">
                <span aria-hidden className="block h-px w-0 group-hover:w-9 bg-primary transition-all duration-500 ease-out-quart mb-2" />
                <span className="font-mono text-[0.58rem] font-bold tracking-[0.2em] uppercase text-white">{g.caption}</span>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <MagneticButton href="https://mlritcie.in/gallery" external>
            Full archive on mlritcie.in
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
