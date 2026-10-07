'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// Full-bleed dark quote band between Hero and About.
export default function RoboticsQuote() {
  return (
    <div
      className="relative w-full overflow-hidden flex items-center"
      style={{ minHeight: '160px', backgroundColor: '#0c0c0e', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 w-full py-12 md:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          className="font-mono text-[0.66rem] font-bold tracking-[0.28em] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          § Robotics Club · MLRIT
        </motion.div>
        <motion.blockquote
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="font-display italic text-right"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.5rem)', color: '#c9a84c', maxWidth: '42ch', lineHeight: 1.35 }}
        >
          &ldquo;Passionate innovators exploring Robotics, AI, Embedded Systems, and Automation through hands-on learning.&rdquo;
        </motion.blockquote>
      </div>
    </div>
  );
}
