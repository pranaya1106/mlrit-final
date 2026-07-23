'use client';

// Tiny wrapper for scroll-reveal — Framer Motion's whileInView with a sensible default
// preset. Used by section headings, cards, stats, etc. Pass `as` to render different
// HTML tags. Pass `delay` to stagger when multiple Reveals appear in sequence.

import { motion, type Variants, type HTMLMotionProps } from 'framer-motion';
import React, { ElementType, ReactNode } from 'react';

type Preset = 'fade' | 'up' | 'right' | 'scale' | 'down';

const VARIANTS: Record<Preset, Variants> = {
  fade:  { hidden: { opacity: 0 },                 show: { opacity: 1 } },
  up:    { hidden: { opacity: 0, y: 28 },          show: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -20 },         show: { opacity: 1, y: 0 } },
  right: { hidden: { opacity: 0, x: -24 },         show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.96 },    show: { opacity: 1, scale: 1 } },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  preset?: Preset;
  delay?: number;
  /** seconds. Default 0.7 — slightly slower than the framer default for elegance */
  duration?: number;
  /** Re-trigger every time it enters viewport */
  once?: boolean;
  /** Viewport amount required before triggering (0–1). Default 0.2 */
  amount?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export default function Reveal({
  children,
  className,
  preset = 'up',
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.2,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={VARIANTS[preset]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// Container that staggers its children automatically. Each child should be wrapped
// in <StaggerItem> (or any motion element with the same variants).
export function Stagger({
  children,
  className,
  style,
  delay = 0.08,
  staggerInitial = 0.05,
  once = true,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  staggerInitial?: number;
  once?: boolean;
  amount?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay, delayChildren: staggerInitial } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  preset = 'up',
  duration = 0.7,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  preset?: Preset;
  duration?: number;
} & Omit<HTMLMotionProps<'div'>, 'children'>) {
  return (
    <motion.div
      variants={VARIANTS[preset]}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
