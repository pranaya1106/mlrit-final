'use client';

import { useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './LeaderScrollStack.css';

export const LeaderStackItem = ({ children, itemClassName = '' }) => (
  <div className={`leader-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const LeaderScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  onStackComplete,
}) => {
  const scrollerRef         = useRef(null);
  const stackCompletedRef   = useRef(false);
  const animationFrameRef   = useRef(null);
  const lenisRef            = useRef(null);
  const cardsRef            = useRef([]);
  const lastTransformsRef   = useRef(new Map());
  const isUpdatingRef       = useRef(false);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    const scroller = scrollerRef.current;
    return {
      scrollTop:       scroller.scrollTop,
      containerHeight: scroller.clientHeight,
    };
  }, []);

  const getElementOffset = useCallback((element) => element.offsetTop, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPx     = parsePercentage(stackPosition, containerHeight);
    const scaleEndPx  = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = scrollerRef.current?.querySelector('.leader-stack-end');
    const endTop     = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop    = getElementOffset(card);
      const triggerStart = cardTop - stackPx - itemStackDistance * i;
      const triggerEnd   = cardTop - scaleEndPx;
      const pinStart     = triggerStart;
      const pinEnd       = endTop - containerHeight / 2;

      // Scale
      let scaleProgress = 0;
      if (scrollTop > triggerStart) {
        scaleProgress = Math.min(1, (scrollTop - triggerStart) / Math.max(1, triggerEnd - triggerStart));
      }
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      // Pin translate
      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      const newT = {
        translateY: Math.round(translateY * 100) / 100,
        scale:      Math.round(scale * 1000) / 1000,
      };
      const last = lastTransformsRef.current.get(i);
      const changed =
        !last ||
        Math.abs(last.translateY - newT.translateY) > 0.1 ||
        Math.abs(last.scale - newT.scale) > 0.001;

      if (changed) {
        card.style.transform = `translate3d(0,${newT.translateY}px,0) scale(${newT.scale})`;
        lastTransformsRef.current.set(i, newT);
      }

      if (i === cardsRef.current.length - 1) {
        const inView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (inView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!inView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, onStackComplete, parsePercentage, getScrollData, getElementOffset]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(scroller.querySelectorAll('.leader-stack-card'));
    cardsRef.current = cards;
    const cache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange        = 'transform';
      card.style.transformOrigin   = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform         = 'translateZ(0)';
    });

    const lenis = new Lenis({
      wrapper:  scroller,
      content:  scroller.querySelector('.leader-stack-inner'),
      duration: 1.2,
      easing:   t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:    true,
      wheelMultiplier: 1,
      lerp:     0.1,
      syncTouch: true,
      syncTouchLerp: 0.075,
    });

    lenis.on('scroll', updateCardTransforms);

    const raf = (time) => {
      lenis.raf(time);
      animationFrameRef.current = requestAnimationFrame(raf);
    };
    animationFrameRef.current = requestAnimationFrame(raf);
    lenisRef.current = lenis;

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lenisRef.current?.destroy();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      cache.clear();
      isUpdatingRef.current = false;
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, onStackComplete, updateCardTransforms]);

  return (
    <div className={`leader-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="leader-stack-inner">
        {children}
        <div className="leader-stack-end" />
      </div>
    </div>
  );
};

export default LeaderScrollStack;
