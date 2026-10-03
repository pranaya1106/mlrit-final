'use client';

import { useEffect, useRef, RefObject } from 'react';
import { useSpring, useMotionValueEvent, useScroll } from 'framer-motion';

// Vertical amber glow bar that tracks scroll progress from the hero down to
// the HowItWorks section, then fades. Matches the APEX/CAME Glow pattern.

const CIE_AMBER = '#f59e0b';

interface Props {
  endRef: RefObject<HTMLElement | null>;
}

export default function CieGlow({ endRef }: Props) {
  const barRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target:  endRef as RefObject<HTMLElement>,
    offset:  ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  useMotionValueEvent(smooth, 'change', (v) => {
    const bar = barRef.current;
    if (!bar) return;
    const opacity = v < 0.5 ? v * 2 : Math.max(0, 1 - (v - 0.5) * 2);
    bar.style.opacity = opacity.toFixed(3);
  });

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 bottom-0 z-10"
      style={{
        width:      '2px',
        opacity:    0,
        background: `linear-gradient(to bottom, transparent 0%, ${CIE_AMBER}88 30%, ${CIE_AMBER} 50%, ${CIE_AMBER}88 70%, transparent 100%)`,
        boxShadow:  `0 0 18px 2px ${CIE_AMBER}55`,
      }}
    />
  );
}
