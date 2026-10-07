'use client';

import { useRef, useId } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Props {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function ApexAtmosphere({ containerRef: _unused }: Props) {
  const filterId = useId().replace(/:/g, '');
  const videoRef = useRef<HTMLVideoElement>(null);

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
          <video
            ref={videoRef}
            src="/videos/apex-hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-hidden="true"
            style={{
              position:   'absolute',
              inset:      0,
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              // blur + saturate baked as a static CSS filter on the video element
              // (not animated — GPU-composited on its own layer, no restyle cost)
              filter:     'blur(52px) saturate(1.6) brightness(0.5)',
              willChange: 'transform',
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:   'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(120,0,0,0.28) 0%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}
