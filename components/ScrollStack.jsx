'use client';
import { useLayoutEffect, useRef, useCallback, useEffect } from 'react';

/**
 * ScrollStack — buttery-smooth pinned-card stack.
 *
 * Why it doesn't jitter (esp. on scroll-up):
 *  • All per-card layout offsets are cached at mount and on resize.
 *    No getBoundingClientRect / offsetTop reads happen during scroll.
 *  • Updates run on a single requestAnimationFrame loop, not on every
 *    `scroll` event. The loop also lerps the current scroll position
 *    toward the latest scrollY, so abrupt direction changes glide
 *    instead of snapping.
 *  • Transforms are sub-pixel (no Math.round) so reverse-scroll
 *    interpolations don't visibly step.
 *  • Lenis is removed — it was double-smoothing native scroll and
 *    fighting the browser's compositor on scroll-up.
 */

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full my-8 box-border origin-top ${itemClassName}`.trim()}
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
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  useWindowScroll = true,
  onStackComplete,
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const offsetsRef = useRef([]);       // cached per-card [{ top, height }]
  const endTopRef = useRef(0);
  const lenScroll = useRef(0);          // lerped scroll position
  const targetScroll = useRef(0);       // latest raw scroll position
  const rafRef = useRef(null);
  const completedRef = useRef(false);

  const parsePct = useCallback((value, h) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * h;
    }
    return parseFloat(value);
  }, []);

  /** Read layout offsets once. Cheap, run on mount and resize only. */
  const measure = useCallback(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    const offsets = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        height: rect.height,
      };
    });
    offsetsRef.current = offsets;

    const endEl = useWindowScroll
      ? document.querySelector('.scroll-stack-end')
      : scrollerRef.current?.querySelector('.scroll-stack-end');
    if (endEl) {
      const rect = endEl.getBoundingClientRect();
      endTopRef.current = rect.top + window.scrollY;
    }
  }, [useWindowScroll]);

  /** Apply transforms from cached offsets. Runs every rAF. */
  const apply = useCallback(() => {
    const cards = cardsRef.current;
    const offsets = offsetsRef.current;
    if (!cards.length || !offsets.length) return;

    const containerHeight = window.innerHeight;
    const stackPx = parsePct(stackPosition, containerHeight);
    const scaleEndPx = parsePct(scaleEndPosition, containerHeight);
    const endTop = endTopRef.current;
    const scrollTop = lenScroll.current;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const off = offsets[i];
      if (!card || !off) continue;

      const cardTop = off.top;
      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPx;
      const pinStart = triggerStart;
      const pinEnd = endTop - containerHeight / 2;

      // Scale interpolation
      let p = 0;
      if (scrollTop > triggerStart) {
        p = (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart);
        if (p > 1) p = 1;
      }
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - p * (1 - targetScale);

      // Pin translation
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      // Single sub-pixel transform write — no rounding, no filter, no rotate
      card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;

      // Completion event
      if (i === cards.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !completedRef.current) {
          completedRef.current = true;
          onStackComplete?.();
        } else if (!inView && completedRef.current) {
          completedRef.current = false;
        }
      }
    }
  }, [
    parsePct,
    stackPosition,
    scaleEndPosition,
    baseScale,
    itemScale,
    itemStackDistance,
    onStackComplete,
  ]);

  /** rAF loop: lerp lenScroll → targetScroll then apply transforms. */
  const tick = useCallback(() => {
    const t = targetScroll.current;
    const l = lenScroll.current;
    // Inside the CMS preview pane the easing reads as lag: the editor is
    // checking layout, not enjoying the effect, and a trailing viewport feels
    // like the wheel is being fought. Track scroll 1:1 there; the public site
    // keeps the eased motion.
    const instant =
      typeof document !== 'undefined' && document.documentElement.dataset.cmsPreview === '1';
    // Lerp factor: higher = snappier. 0.18 is smooth without lag.
    const next = instant ? t : l + (t - l) * 0.18;
    // Snap to exact value when very close to avoid sub-pixel drift over time.
    lenScroll.current = Math.abs(next - t) < 0.05 ? t : next;
    apply();
    rafRef.current = requestAnimationFrame(tick);
  }, [apply]);

  /** Cheap scroll handler: just stores the target value. */
  const onScroll = useCallback(() => {
    targetScroll.current = window.scrollY;
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;

    // Style each card once
    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translate3d(0,0,0) scale(1)';
    });

    // Initial measurement and seed scroll values
    measure();
    targetScroll.current = window.scrollY;
    lenScroll.current = window.scrollY;
    apply();

    // Listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      measure();
    });
    cards.forEach((c) => ro.observe(c));
    window.addEventListener('resize', measure);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
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
    apply,
    measure,
    onScroll,
    tick,
  ]);

  // After images / fonts load, remeasure once (offsets may change).
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
