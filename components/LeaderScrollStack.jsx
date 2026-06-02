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
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const wrapperRef          = useRef(null);   // scoping wrapper
  const stackCompletedRef   = useRef(false);
  const animationFrameRef   = useRef(null);
  const lenisRef            = useRef(null);
  const cardsRef            = useRef([]);
  const lastTransformsRef   = useRef(new Map());
  const isUpdatingRef       = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => ({
    scrollTop: window.scrollY,
    containerHeight: window.innerHeight,
  }), []);

  const getElementOffset = useCallback((element) => {
    const rect = element.getBoundingClientRect();
    return rect.top + window.scrollY;
  }, []);

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx    = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    // scope end element to this wrapper
    const endElement    = wrapperRef.current?.querySelector('.leader-stack-end');
    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop      = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd   = cardTop - scaleEndPositionPx;
      const pinStart     = triggerStart;
      const pinEnd       = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale   = baseScale + i * itemScale;
      const scale         = 1 - scaleProgress * (1 - targetScale);
      const rotation      = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jTop   = getElementOffset(cardsRef.current[j]);
          const jStart = jTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jStart) topCardIndex = j;
        }
        if (i < topCardIndex) blur = Math.max(0, (topCardIndex - i) * blurAmount);
      }

      let translateY = 0;
      if (scrollTop >= pinStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newT = {
        translateY: Math.round(translateY * 100) / 100,
        scale:      Math.round(scale * 1000) / 1000,
        rotation:   Math.round(rotation * 100) / 100,
        blur:       Math.round(blur * 100) / 100,
      };

      const last = lastTransformsRef.current.get(i);
      const changed = !last ||
        Math.abs(last.translateY - newT.translateY) > 0.1 ||
        Math.abs(last.scale      - newT.scale)      > 0.001 ||
        Math.abs(last.rotation   - newT.rotation)   > 0.1 ||
        Math.abs(last.blur       - newT.blur)        > 0.1;

      if (changed) {
        card.style.transform = `translate3d(0,${newT.translateY}px,0) scale(${newT.scale}) rotate(${newT.rotation}deg)`;
        card.style.filter    = newT.blur > 0 ? `blur(${newT.blur}px)` : '';
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
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale,
      rotationAmount, blurAmount, onStackComplete,
      calculateProgress, parsePercentage, getScrollData, getElementOffset]);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // scope to THIS wrapper only — no global selector bleed
    const cards = Array.from(wrapper.querySelectorAll('.leader-stack-card'));
    cardsRef.current = cards;
    const cache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
      card.style.willChange        = 'transform, filter';
      card.style.transformOrigin   = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform         = 'translateZ(0)';
      card.style.webkitTransform   = 'translateZ(0)';
      card.style.perspective       = '1000px';
    });

    // Lenis on window scroll — same as React Bits useWindowScroll=true
    const lenis = new Lenis({
      duration:       1.2,
      easing:         t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:    true,
      touchMultiplier: 2,
      infinite:       false,
      wheelMultiplier: 1,
      lerp:           0.1,
      syncTouch:      true,
      syncTouchLerp:  0.075,
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
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition,
      baseScale, rotationAmount, blurAmount, onStackComplete, updateCardTransforms]);

  return (
    <div ref={wrapperRef} className={`leader-stack-wrapper ${className}`.trim()}>
      <div className="leader-stack-inner">
        {children}
        <div className="leader-stack-end" />
      </div>
    </div>
  );
};

export default LeaderScrollStack;
