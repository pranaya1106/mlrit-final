'use client';

// Video-essence transition — the hero video dissolves into the background
// after the hero section, creating an atmospheric diffusion effect.
// Scroll-driven: reversible, responds to scroll progress.
//
// Technique:
// 1. Fixed blurred+scaled video behind everything
// 2. SVG feTurbulence + feDisplacementMap creates organic edge dissolution
// 3. Opacity, scale, blur all scroll-driven via useTransform
// 4. Feels like: sharp video → blurred haze → pure atmosphere → darkness

import { useRef, useId } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface Props {
  containerRef?: React.RefObject<HTMLElement | null>;
}

export default function ApexAtmosphere({ containerRef: _unused }: Props) {
  const filterId = useId().replace(/:/g, '');
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollY } = useScroll();

  // Phase 1 (0→300px):  hero visible, atmosphere fades in subtly
  // Phase 2 (300→900px): dissolves to atmospheric haze as hero exits
  // Phase 3 (900→4500px): holds as red atmospheric glow through Quote+About+HowItWorks
  // Phase 4 (4500→6000px): fades out entering Events Gallery

  const spring = { stiffness: 60, damping: 20 };

  const rawOpacity = useTransform(scrollY, [0, 300, 900, 4500, 6000], [0, 0.12, 0.28, 0.28, 0]);
  const opacity    = useSpring(rawOpacity, spring);

  const rawScale   = useTransform(scrollY, [0, 900], [1.22, 1.04]);
  const scale      = useSpring(rawScale, spring);

  const rawBlur    = useTransform(scrollY, [0, 400, 900], [80, 60, 42]);
  const blurVal    = useSpring(rawBlur, spring);

  // Turbulence baseFrequency animates as video dissolves in
  const turbFreq   = useTransform(scrollY, [0, 900], [0.045, 0.012]);
  const dispScale  = useTransform(scrollY, [0, 900], [80, 22]);

  return (
    <>
      {/* SVG filter — turbulence displacement for organic edge dissolution */}
      <svg
        aria-hidden
        className="absolute w-0 h-0 overflow-hidden"
        style={{ position: 'fixed', top: 0, left: 0 }}
      >
        <defs>
          <filter id={`atm-${filterId}`} x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.025"
              numOctaves={3}
              seed={8}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={35}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feGaussianBlur in="displaced" stdDeviation={0} />
          </filter>
        </defs>
      </svg>

      <motion.div
        aria-hidden="true"
        style={{ opacity }}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      >
        <motion.div
          style={{ scale }}
          className="absolute inset-[-10%] w-[120%] h-[120%]"
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
            }}
          >
            <motion.video
              ref={videoRef}
              src="/videos/apex-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: `blur(52px) saturate(1.6) brightness(0.55)`,
              }}
            />
            {/* Soft color bleed overlay — amplifies the red/dark palette */}
            <div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(120,0,0,0.28) 0%, transparent 70%)',
                mixBlendMode: 'screen',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
