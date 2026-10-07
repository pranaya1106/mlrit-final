'use client';

import { useId } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Props {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function EwbAtmosphere({ containerRef: _unused }: Props) {
  const filterId = useId().replace(/:/g, '');

  const { scrollY } = useScroll();

  const spring = { stiffness: 55, damping: 18, restDelta: 0.001 };

  const rawOpacity = useTransform(scrollY, [0, 300, 900, 4500, 6000], [0, 0.12, 0.28, 0.28, 0]);
  const opacity    = useSpring(rawOpacity, spring);

  const rawScale = useTransform(scrollY, [0, 900], [1.22, 1.04]);
  const scale    = useSpring(rawScale, spring);

  return (
    <>
      {/* Static SVG filter — no animation on SVG attributes (not GPU-composited) */}
      <svg
        aria-hidden
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={`atm-${filterId}`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02 0.025" numOctaves={3} seed={8} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={30} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* opacity + scale — both GPU-composited (opacity/transform only) */}
      <motion.div
        aria-hidden="true"
        style={{ opacity, willChange: 'opacity' }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          style={{ scale, willChange: 'transform' }}
          className="absolute inset-[-10%] w-[120%] h-[120%]"
        >
          {/* No video here — the hero's source video is shot on light paper,
              so even heavily darkened it reads as a whitish wash once blurred
              full-bleed behind the rest of the (black) page. A plain green
              radial glow gives the same ambient "breathing" accent while
              keeping every other section solid black. */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:   'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(63,174,92,0.30) 0%, rgba(20,60,30,0.18) 55%, transparent 75%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
