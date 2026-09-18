'use client';
import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';

/**
 * ScrollStack — pixel-perfect pinned card stack.
 *
 * Rendered pin position uses CSS `position: sticky` so cards snap to the
 * exact viewport pixel every frame — the browser does the math, not JS.
 * A small rAF loop only writes `scale` (a transform that doesn't affect
 * layout), which lets us gently shrink stacked cards without ever
 * introducing sub-pixel drift on the pin itself.
 */

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full box-border origin-top ${itemClassName}`.trim()}
    style={{
      willChange: 'transform',
      transformStyle: 'preserve-3d',
      backfaceVisibility: 'hidden',
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,          // gap between successive cards, in px
  itemScale = 0.02,            // per-index scale added at rest
  itemStackDistance = 30,      // px of vertical offset between stacked cards
  stackPosition = '22%',       // where the top card pins, from viewport top
  scaleEndPosition = '10%',    // where scale interpolation completes
  baseScale = 0.9,             // scale of the deepest card in the stack
  useWindowScroll = true,      // scroll relative to window, not container
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const offsetsRef = useRef([]);
  const rafRef = useRef(null);
  const completedRef = useRef(false);

  const parsePct = useCallback((value, h) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * h;
    }
    return parseFloat(value);
  }, []);

  /** Measure card layout once per mount / resize. */
  const measure = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;
    offsetsRef.current = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: rect.height,
      };
    });
  }, []);

  /** rAF loop — writes SCALE only. Sticky handles the pin natively. */
  const tick = useCallback(() => {
    const cards = cardsRef.current;
    const offsets = offsetsRef.current;
    const scrollTop = window.scrollY;
    const viewportH = window.innerHeight;
    const stackPx = parsePct(stackPosition, viewportH);
    const scaleEndPx = parsePct(scaleEndPosition, viewportH);

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const off = offsets[i];
      if (!card || !off) continue;

      // Scale progress: 0 when card sits at its natural position,
      //                 1 when it has passed scaleEndPx above the viewport top.
      const triggerStart = off.top - stackPx - itemStackDistance * i;
      const triggerEnd = off.top - scaleEndPx;
      let p = 0;
      if (scrollTop > triggerStart) {
        p = (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart);
        if (p > 1) p = 1;
      }
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - p * (1 - targetScale);
      card.style.transform = `scale(${scale})`;

      if (i === cards.length - 1) {
        if (p >= 1 && !completedRef.current) {
          completedRef.current = true;
          onStackComplete?.();
        } else if (p < 1 && completedRef.current) {
          completedRef.current = false;
        }
      }
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [
    parsePct,
    stackPosition,
    scaleEndPosition,
    baseScale,
    itemScale,
    itemStackDistance,
    onStackComplete,
  ]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );
    cardsRef.current = cards;

    // Style each card once — sticky pin + progressive top offset + gap.
    // Top uses CSS calc(22vh + Npx) so the browser resolves the viewport
    // percentage natively — pixel-perfect at every screen size, no JS
    // re-measurement needed on resize.
    const topExpr =
      typeof stackPosition === 'string' && stackPosition.includes('%')
        ? `${parseFloat(stackPosition)}vh`
        : `${parseFloat(stackPosition)}px`;

    cards.forEach((card, i) => {
      card.style.position = 'sticky';
      card.style.top = `calc(${topExpr} + ${Math.round(itemStackDistance * i)}px)`;
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'scale(1)';
    });

    measure();
    rafRef.current = requestAnimationFrame(tick);

    // Resize handling — only re-measures for the scale calculation; the
    // sticky top uses CSS vh so nothing needs re-writing.
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(measure);
    cards.forEach((c) => ro.observe(c));

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardsRef.current = [];
      offsetsRef.current = [];
      completedRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    useWindowScroll,
    measure,
    tick,
  ]);

  // After images / fonts load, remeasure once (heights may change).
  useEffect(() => {
    const onLoad = () => measure();
    window.addEventListener('load', onLoad);
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener('load', onLoad);
      clearTimeout(t);
    };
  }, [measure]);

  const containerClassName = useWindowScroll
    ? `relative w-full ${className}`.trim()
    : `relative w-full h-full overflow-y-auto overflow-x-visible ${className}`.trim();

  return (
    <div className={containerClassName} ref={scrollerRef}>
      <div className="scroll-stack-inner pt-[8vh] pl-3 pr-11 md:pl-6 md:pr-11 lg:px-8 pb-[18rem]">
        {children}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
