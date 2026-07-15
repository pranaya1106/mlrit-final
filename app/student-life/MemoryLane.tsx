'use client';

import Image from 'next/image';
import { useRef, useState, useEffect, useCallback } from 'react';
import type { MemoryLaneItem } from './data';

interface Props {
  items: MemoryLaneItem[];
}

const CARD_W = 283;
const CARD_H = 339;
const GAP = 20;
const STEP_MS = 500;
const DELAY_MS = 1200;

export default function MemoryLane({ items }: Props) {
  const N = items.length;
  const tripled = [...items, ...items, ...items];

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idxRef = useRef(N);
  const [activeIdx, setActiveIdx] = useState(N);
  const isPaused = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isResetting = useRef(false);

  const getOffset = useCallback((idx: number) => {
    const w = containerRef.current?.clientWidth ?? window.innerWidth;
    return idx * (CARD_W + GAP) - w / 2 + CARD_W / 2;
  }, []);

  const applyTransform = useCallback((offset: number, animate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transition = animate
      ? `transform ${STEP_MS}ms cubic-bezier(0.25,0.46,0.45,0.94)`
      : 'none';
    track.style.transform = `translateX(${-offset}px)`;
  }, []);

  const goTo = useCallback((idx: number, animate: boolean) => {
    idxRef.current = idx;
    setActiveIdx(idx);
    applyTransform(getOffset(idx), animate);
  }, [applyTransform, getOffset]);

  const advance = useCallback(() => {
    if (isPaused.current || isResetting.current) return;
    const next = idxRef.current + 1;
    goTo(next, true);
    // When we reach the last set, silently reset to middle set after transition
    if (next >= N * 2) {
      isResetting.current = true;
      setTimeout(() => {
        goTo(next - N, false);
        isResetting.current = false;
      }, STEP_MS + 50);
    }
  }, [goTo, N]);

  const scheduleNext = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      advance();
      scheduleNext();
    }, DELAY_MS);
  }, [advance]);

  useEffect(() => {
    // Use rAF to ensure refs are measured after first paint
    const raf = requestAnimationFrame(() => {
      goTo(N, false);
      scheduleNext();
    });
    return () => {
      cancelAnimationFrame(raf);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [goTo, scheduleNext, N]);

  const pause = () => {
    isPaused.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const resume = () => {
    isPaused.current = false;
    scheduleNext();
  };

  return (
    <section
      style={{ backgroundColor: '#090909' }}
      className="pt-16 pb-20 md:pt-20 md:pb-24"
      aria-label="Memory Lane"
    >
      <div
        ref={containerRef}
        role="region"
        aria-label="Memory Lane carousel"
        className="relative overflow-hidden"
        style={{ height: `${CARD_H + 32}px` }}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <div
          ref={trackRef}
          className="absolute top-4 flex"
          style={{ gap: `${GAP}px`, left: 0, willChange: 'transform' }}
        >
          {tripled.map((item, i) => {
            const isActive = i === activeIdx;
            return (
              <div
                key={`${item.id}-${i}`}
                aria-hidden={i < N || i >= N * 2}
                className="shrink-0 bg-white"
                style={{
                  width: `${CARD_W}px`,
                  height: `${CARD_H}px`,
                  padding: '16px 15px 47px 16px',
                  borderRadius: 0,
                  boxSizing: 'border-box',
                  transition: `transform ${STEP_MS}ms cubic-bezier(0.25,0.46,0.45,0.94), opacity ${STEP_MS}ms ease`,
                  transform: isActive ? 'scale(1.06)' : 'scale(0.96)',
                  opacity: isActive ? 1 : 0.6,
                }}
              >
                <div className="relative w-full h-full overflow-hidden" style={{ borderRadius: 0 }}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    quality={80}
                    sizes={`${CARD_W}px`}
                    className="object-cover object-center"
                    style={{ borderRadius: 0 }}
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
