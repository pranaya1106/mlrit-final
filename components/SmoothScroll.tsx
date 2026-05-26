'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

declare global { interface Window { __smoother?: { scrollTo: (target: number | Element, smooth?: boolean) => void } } }

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Anchor-link smooth scroll via gsap.to (works without paid ScrollSmoother)
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

    return () => { document.removeEventListener('click', handler); };
  }, []);

  return null;
}
