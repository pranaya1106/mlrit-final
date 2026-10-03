'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// Full-bleed photo band with editorial quote — sits between Hero and About.
export default function CieQuote() {
  return (
    <div className="relative w-full h-[260px] md:h-[380px] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/clubs/cie/gallery/cie.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover"
      />
      <span aria-hidden className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 w-full flex items-center justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase text-white/70"
          >
            § Field notes · The floor
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="font-sans text-white/90 text-[clamp(1rem,1.8vw,1.6rem)] max-w-[38ch] text-right hidden md:block italic leading-snug"
          >
            &ldquo;Every idea starts somewhere.&rdquo;
          </motion.div>
        </div>
      </div>
    </div>
  );
}
