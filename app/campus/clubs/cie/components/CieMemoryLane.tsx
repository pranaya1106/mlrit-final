'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Instagram, Linkedin, Youtube, Twitter, Mail } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;
const IN_VIEW = { once: true, margin: '-80px' } as const;

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

const GALLERY = [
  { src: '/images/clubs/cie/gallery/cie.jpg',                caption: 'The CIE floor',          span: 8 },
  { src: '/images/clubs/cie/gallery/makerspace.jpg',         caption: 'Makerspace',             span: 4 },
  { src: '/images/clubs/cie/gallery/3d-printing.jpg',        caption: '3D printing',            span: 4 },
  { src: '/images/clubs/cie/gallery/epicslab.jpg',           caption: 'EPICS Lab',              span: 4 },
  { src: '/images/clubs/cie/gallery/laser-engraver.jpg',     caption: 'Laser engraver',         span: 4 },
  { src: '/images/clubs/cie/gallery/wooden-graver.jpg',      caption: 'Wooden graver',          span: 6 },
  { src: '/images/clubs/cie/gallery/u-table.jpg',            caption: 'The U-table',            span: 6 },
  { src: '/images/clubs/cie/gallery/efest-auditorium.jpg',   caption: 'E-Summit stage',         span: 8 },
  { src: '/images/clubs/cie/gallery/innovation-challenge.jpg', caption: 'Innovation challenge', span: 4 },
];

export default function CieMemoryLane() {
  return (
    <>
      {/* Gallery bento */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="max-w-[1200px] mx-auto mb-12">
            <Eyebrow>Gallery</Eyebrow>
            <motion.h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(1.8rem,3vw,2.6rem)]"
              initial="hidden" whileInView="show" viewport={IN_VIEW}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }} style={{ display: 'block' }}
            >
              {['Living', 'document.'].map((w, i) => (
                <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                  style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
              ))}
            </motion.h2>
          </div>

          <motion.div className="grid grid-cols-12 gap-3 md:gap-4"
            initial="hidden" whileInView="show" viewport={IN_VIEW}
            variants={stagger(0.06, 0.05)}
          >
            {GALLERY.map((g) => (
              <motion.figure
                key={g.src}
                variants={{
                  hidden: { opacity: 0, y: 32, clipPath: 'inset(0 0 100% 0)' },
                  show:   { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 0.9, ease: EASE } },
                }}
                className="relative group overflow-hidden rounded-xl bg-white/[0.03] aspect-[4/3]"
                style={{ gridColumn: `span ${g.span} / span ${g.span}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src} alt={g.caption}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
                <div aria-hidden className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                  style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.78) 100%)' }} />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 md:p-4 translate-y-1 group-hover:translate-y-0 transition-transform duration-500 ease-out-quart">
                  <span aria-hidden className="block h-px w-0 group-hover:w-8 bg-primary transition-all duration-500 ease-out-quart mb-2" />
                  <span className="font-mono text-[0.6rem] font-bold tracking-[0.2em] uppercase text-white/85">{g.caption}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>

          <div className="mt-10 flex justify-center">
            <Link href="https://mlritcie.in/gallery" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 h-11 px-5 rounded-full font-sans font-semibold text-[0.9rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 transition-all"
            >
              Full archive on mlritcie.in
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="relative bg-black py-20 md:py-28 overflow-hidden border-t border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <Eyebrow>Get involved</Eyebrow>
          <motion.h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.02] text-white text-[clamp(2rem,3.6vw,3rem)] mb-8"
            initial="hidden" whileInView="show" viewport={IN_VIEW}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } }} style={{ display: 'block' }}
          >
            {['Bring', 'the', 'idea.'].map((w, i) => (
              <motion.span key={i} variants={{ hidden: { opacity: 0, y: '0.4em' }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
                style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
            ))}
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="text-white/60 leading-[1.75] text-[1rem] md:text-[1.05rem] max-w-[52ch]"
          >
            Any branch, any year. Walk in during club hours, or reach out on any channel below.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={IN_VIEW}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link href="https://mlritcie.in" target="_blank" rel="noopener noreferrer"
              style={{ backgroundColor: '#e85d04', color: '#fff' }}
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] hover:-translate-y-[1px] hover:shadow-primary-glow transition-all duration-300"
            >
              Visit mlritcie.in <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link href="mailto:ciemlrit@mlrit.ac.in"
              className="inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.06] text-white border border-white/15 hover:bg-white/[0.1] hover:border-white/30 hover:-translate-y-[1px] transition-all duration-300"
            >
              <Mail className="w-4 h-4" /> Email us
            </Link>
          </motion.div>

          <div className="mt-14 border-t border-white/10 pt-8 grid md:grid-cols-3 gap-y-8 gap-x-10">
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">Address</div>
              <div className="mt-2 text-white/85 text-[0.95rem] leading-snug">MLRIT, Dundigal,<br />Hyderabad, Telangana 500043</div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">Email</div>
              <div className="mt-2 space-y-1">
                <Link href="mailto:ciemlrit@mlrit.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem]">ciemlrit@mlrit.ac.in</Link>
                <Link href="mailto:cie@mlrinstitutions.ac.in" className="block text-white/85 hover:text-primary text-[0.95rem]">cie@mlrinstitutions.ac.in</Link>
              </div>
            </div>
            <div>
              <div className="font-mono text-[0.62rem] font-bold tracking-[0.22em] uppercase text-white/45">Follow</div>
              <div className="mt-3 flex items-center gap-2">
                {[
                  { Icon: Instagram, href: 'https://mlritcie.in', label: 'Instagram' },
                  { Icon: Linkedin,  href: 'https://mlritcie.in', label: 'LinkedIn' },
                  { Icon: Youtube,   href: 'https://mlritcie.in', label: 'YouTube' },
                  { Icon: Twitter,   href: 'https://mlritcie.in', label: 'X' },
                ].map(({ Icon, href, label }) => (
                  <Link key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                    className="w-9 h-9 rounded-full border border-white/15 text-white/70 grid place-items-center hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
