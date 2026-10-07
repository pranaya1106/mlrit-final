'use client';

import TypographicSculpture, { WordConfig } from '@/components/TypographicSculpture';

// ── Art direction ──────────────────────────────────────────────────────────────
// SCOPE vocabulary: technology, craft, community, ambition.
// Composition mirrors APEX's diagonal stacking but shifts positions slightly
// so each club page feels authored independently, not templated.

const SCOPE_WORDS: WordConfig[] = [
  {
    text:    'BUILD',
    x:       64,  y: 17,
    rotate:  -13, scale: 1.0,
    skewX:   -3,
    dX:      -40, dY: -20, dRotate: -2,
    opacity: 0.95,
    mX: 56, mY: 13, mScale: 0.60, mRotate: -10,
  },
  {
    text:    'PLATFORMS',
    x:       36,  y: 32,
    rotate:  -10, scale: 0.78,
    skewX:   -2,
    dX:       28, dY: -10, dRotate: 1.5,
    opacity: 1,
    mX: 46, mY: 30, mScale: 0.46, mRotate: -7,
  },
  {
    text:    'INNOVATE',
    x:       55,  y: 48,
    rotate:  -7,  scale: 0.90,
    skewX:   -1,
    dX:      -20, dY:  8,  dRotate: -1,
    opacity: 0.90,
    mX: 52, mY: 46, mScale: 0.46, mRotate: -5,
  },
  {
    text:    'COMPETE',
    x:       31,  y: 62,
    rotate:  -12, scale: 0.72,
    skewX:   -3,
    dX:       38, dY:  16, dRotate: 2,
    opacity: 0.78,
    mX: 44, mY: 62, mScale: 0.48, mRotate: -9,
  },
  {
    text:    'SHIP',
    x:       61,  y: 75,
    rotate:  -8,  scale: 0.94,
    skewX:   -2,
    dX:      -26, dY:  22, dRotate: -1.5,
    opacity: 0.88,
    mX: 55, mY: 76, mScale: 0.58, mRotate: -6,
  },
  {
    text:    'COMMUNITY',
    x:       43,  y: 88,
    rotate:  -5,  scale: 0.60,
    skewX:   -1,
    dX:       16, dY:  30, dRotate: 1,
    opacity: 0.70,
    mX: 50, mY: 89, mScale: 0.34, mRotate: -3,
  },
];

export default function ScopeTypographicSculpture() {
  return (
    <TypographicSculpture
      words={SCOPE_WORDS}
      accentColor="#00C2FF"
      scrollHeight={1.5}
      label="SCOPE — Build Platforms. Innovate. Compete. Ship. Community."
    />
  );
}
