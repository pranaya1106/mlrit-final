'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

declare global {
  interface Window {
    __smoother?: { scrollTo: (target: number | Element, smooth?: boolean) => void };
    __lenisInstance?: Lenis;
  }
}

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let lenis: Lenis | null = null;
    let rafId = 0;

    if (!reducedMotion) {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, syncTouch: false });

      // Expose on window so sticky-scroll components can subscribe via lenis.on('scroll', cb)
      window.__lenisInstance = lenis;

      const raf = (time: number) => {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // ── GSAP anchor-link smooth scroll ───────────────────────────────────────
    let cleanup: (() => void) | undefined;
    if (!reducedMotion && typeof gsap !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      const handler = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute('href')?.slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, { duration: 1.2, scrollTo: { y: target, offsetY: 132 }, ease: 'power3.inOut' });
      };
      document.addEventListener('click', handler);
      cleanup = () => document.removeEventListener('click', handler);
    }

    return () => {
      cleanup?.();
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      window.__lenisInstance = undefined;
    };
  }, []);

  return null;
}
