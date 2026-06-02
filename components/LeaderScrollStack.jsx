'use client';

/**
 * LeaderScrollStack — identical algorithm to ScrollStack.jsx (cached offsets +
 * lerped rAF, NO Lenis) but scoped to `.leader-stack-card` so it never
 * conflicts with the global `.scroll-stack-card` selector used elsewhere.
 */

import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';

export const LeaderStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`leader-stack-card relative w-full my-8 box-border origin-top ${itemClassName}`.trim()}
    style={{ willChange: 'transform', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
  >
    {children}
  </div>
);

const LeaderScrollStack = ({
  children,
  className = '',
  itemDistance   = 100,
  itemScale      = 0.03,
  itemStackDistance = 30,
  stackPosition  = '20%',
  scaleEndPosition = '10%',
  baseScale      = 0.85,
  onStackComplete,
}) => {
  const scrollerRef  = useRef(null);
  const cardsRef     = useRef([]);
  const offsetsRef   = useRef([]);   // cached absolute tops — NO reads in scroll path
  const endTopRef    = useRef(0);
  const lenScroll    = useRef(0);    // lerped scroll
  const targetScroll = useRef(0);    // raw latest scrollY
  const rafRef       = useRef(null);
  const completedRef = useRef(false);

  const parsePct = useCallback((value, h) => {
    if (typeof value === 'string' && value.includes('%'))
      return (parseFloat(value) / 100) * h;
    return parseFloat(value);
  }, []);

  // ── Measure: read DOM once, cache absolute tops ───────────────────────────
  const measure = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    offsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { top: rect.top + window.scrollY, height: rect.height };
    });

    const endEl = scrollerRef.current?.querySelector('.leader-stack-end');
    if (endEl) {
      const rect = endEl.getBoundingClientRect();
      endTopRef.current = rect.top + window.scrollY;
    }
  }, []);

  // ── Apply: pure math from cached offsets, no DOM reads ───────────────────
  const apply = useCallback(() => {
    const cards   = cardsRef.current;
    const offsets = offsetsRef.current;
    if (!cards.length || !offsets.length) return;

    const vh       = window.innerHeight;
    const stackPx  = parsePct(stackPosition, vh);
    const scaleEndPx = parsePct(scaleEndPosition, vh);
    const endTop   = endTopRef.current;
    const scrollTop = lenScroll.current;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const off  = offsets[i];
      if (!card || !off) continue;

      const cardTop    = off.top;
      const triggerStart = cardTop - stackPx  - itemStackDistance * i;
      const triggerEnd   = cardTop - scaleEndPx;
      const pinStart     = triggerStart;
      const pinEnd       = endTop - vh / 2;

      // scale
      let p = 0;
      if (scrollTop > triggerStart)
        p = Math.min(1, (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart));
      const scale = 1 - p * (1 - (baseScale + i * itemScale));

      // pin translate
      let ty = 0;
      if      (scrollTop >= pinStart && scrollTop <= pinEnd) ty = scrollTop - cardTop + stackPx + itemStackDistance * i;
      else if (scrollTop > pinEnd)                           ty = pinEnd    - cardTop + stackPx + itemStackDistance * i;

      card.style.transform = `translate3d(0,${ty}px,0) scale(${scale})`;

      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView  && !completedRef.current) { completedRef.current = true;  onStackComplete?.(); }
        if (!inView &&  completedRef.current)   completedRef.current = false;
      }
    }
  }, [parsePct, stackPosition, scaleEndPosition, baseScale, itemScale, itemStackDistance, onStackComplete]);

  // ── rAF loop: lerp then apply ─────────────────────────────────────────────
  const tick = useCallback(() => {
    const t    = targetScroll.current;
    const l    = lenScroll.current;
    const next = l + (t - l) * 0.18;
    lenScroll.current = Math.abs(next - t) < 0.05 ? t : next;
    apply();
    rafRef.current = requestAnimationFrame(tick);
  }, [apply]);

  const onScroll = useCallback(() => { targetScroll.current = window.scrollY; }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    // Scoped selector — never touches .scroll-stack-card on other sections
    const cards = Array.from(scroller.querySelectorAll('.leader-stack-card'));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange        = 'transform';
      card.style.transformOrigin   = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform         = 'translate3d(0,0,0) scale(1)';
    });

    measure();
    targetScroll.current = window.scrollY;
    lenScroll.current    = window.scrollY;
    apply();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);

    const ro = new ResizeObserver(measure);
    cards.forEach((c) => ro.observe(c));

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardsRef.current  = [];
      offsetsRef.current = [];
      completedRef.current = false;
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition,
      baseScale, apply, measure, onScroll, tick]);

  // Remeasure after images load (heights may shift)
  useEffect(() => {
    window.addEventListener('load', measure);
    const t = setTimeout(measure, 800);
    return () => { window.removeEventListener('load', measure); clearTimeout(t); };
  }, [measure]);

  return (
    <div className={`relative w-full ${className}`.trim()} ref={scrollerRef}>
      <div className="pt-[4vh] pb-[38rem]">
        {children}
        <div className="leader-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default LeaderScrollStack;
