'use client';

import TypographicSculpture, { WordConfig } from '@/components/TypographicSculpture';

// ── Art direction ──────────────────────────────────────────────────────────────
// Words are placed in a diagonal stacked composition — each occupies a unique
// spatial position, overlapping its neighbours. Font size is driven by `scale`
// combined with a large base `clamp` in the shared component (set via inline style).
// dX / dY are pixel offsets accumulated across full scroll progress [0→1].
// Words further from centre move more — gives the sense of parallax depth.

const APEX_WORDS: WordConfig[] = [
  {
    text:     'INFINITE',
    x:        62,  y: 18,
    rotate:   -14, scale: 1.0,
    skewX:    -3,
    fontSize: 'clamp(5rem, 12vw, 13rem)',
    dX:       -38, dY: -22, dRotate: -2,
    opacity:  0.95,
    mX: 55, mY: 14, mScale: 0.58, mRotate: -10,
    mFontSize: 'clamp(2.8rem, 9vw, 5rem)',
  },
  {
    text:     'PROGRESS',
    x:        38,  y: 33,
    rotate:   -11, scale: 0.82,
    skewX:    -2,
    fontSize: 'clamp(4rem, 10vw, 11rem)',
    dX:        26, dY: -12, dRotate: 1.5,
    opacity:  1,
    mX: 45, mY: 30, mScale: 0.50, mRotate: -8,
    mFontSize: 'clamp(2.2rem, 7.5vw, 4rem)',
  },
  {
    text:     'INNOVATION',
    x:        54,  y: 49,
    rotate:   -8,  scale: 0.92,
    skewX:    -1,
    fontSize: 'clamp(4.5rem, 11vw, 12rem)',
    dX:       -18, dY:  6,  dRotate: -1,
    opacity:  0.90,
    mX: 52, mY: 47, mScale: 0.44, mRotate: -6,
    mFontSize: 'clamp(2rem, 7vw, 3.5rem)',
  },
  {
    text:     'FAILURE',
    x:        30,  y: 63,
    rotate:   -13, scale: 0.70,
    skewX:    -4,
    fontSize: 'clamp(3.5rem, 9vw, 10rem)',
    dX:        40, dY:  14, dRotate: 2,
    opacity:  0.75,
    mX: 42, mY: 62, mScale: 0.46, mRotate: -10,
    mFontSize: 'clamp(2rem, 7vw, 3.5rem)',
  },
  {
    text:     'DREAMS',
    x:        60,  y: 76,
    rotate:   -9,  scale: 0.88,
    skewX:    -2,
    fontSize: 'clamp(4.5rem, 11vw, 12rem)',
    dX:       -28, dY:  20, dRotate: -1.5,
    opacity:  0.88,
    mX: 54, mY: 76, mScale: 0.52, mRotate: -7,
    mFontSize: 'clamp(2.4rem, 8vw, 4rem)',
  },
  {
    text:     'ACHIEVEMENT',
    x:        44,  y: 89,
    rotate:   -6,  scale: 0.62,
    skewX:    -1,
    fontSize: 'clamp(3rem, 8vw, 9rem)',
    dX:        18, dY:  28, dRotate: 1,
    opacity:  0.70,
    mX: 50, mY: 89, mScale: 0.36, mRotate: -4,
    mFontSize: 'clamp(1.6rem, 5.5vw, 2.8rem)',
  },
];

export default function ApexTypographicSculpture() {
  return (
    <TypographicSculpture
      words={APEX_WORDS}
      accentColor="#D80000"
      scrollHeight={1.5}
      label="APEX — Infinite Progress. Innovation. Dreams. Achievement."
    />
  );
}
