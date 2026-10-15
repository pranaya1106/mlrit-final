'use client';

/** Shared motion primitives for the CIE page sections. */

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const EASE = [0.22, 1, 0.36, 1] as const;
export const IN_VIEW = { once: true, margin: '-80px' } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={IN_VIEW}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="h-px w-10 bg-primary" />
      <span className="font-mono text-[0.72rem] font-bold tracking-[0.34em] uppercase text-primary">{children}</span>
    </div>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
  index,
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  index?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-[760px]', className)}>
      <Reveal>
        <div className="flex items-center gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          {index && <span className="font-mono text-[0.6rem] font-bold tracking-[0.24em] uppercase text-white/35">{index}</span>}
        </div>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-6 font-sans font-black tracking-tighter-3 leading-[0.98] text-white text-[clamp(2.4rem,5.5vw,4.6rem)]">{title}</h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p className="mt-5 text-white/60 leading-[1.7] text-[1.02rem] md:text-[1.12rem]">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

export function useCountUp(target: number, ms = 1600) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    let startT = 0;
    const tick = (t: number) => {
      if (!startT) startT = t;
      const p = Math.min(1, (t - startT) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, ms]);
  return { ref, n };
}

export function MagneticButton({
  href,
  external,
  primary,
  children,
}: {
  href: string;
  external?: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x, y, ...(primary ? { backgroundColor: '#e85d04', color: '#fff' } : {}) }}
      className={
        primary
          ? 'group inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] shadow-primary-glow transition-shadow duration-300 hover:shadow-[0_12px_44px_rgba(232,93,4,0.55)]'
          : 'group inline-flex items-center gap-2.5 h-12 px-6 rounded-full font-semibold text-[0.95rem] bg-white/[0.07] text-white border border-white/20 hover:bg-white/[0.14] hover:border-white/40 transition-colors duration-300'
      }
    >
      {children}
    </motion.a>
  );
}
