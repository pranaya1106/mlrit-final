'use client';

import { useState, useCallback, useRef, useEffect, useId } from 'react';
import { Maximize2, Minimize2, RotateCcw, MapPin } from 'lucide-react';
import {
  VIRTUAL_TOUR_CATEGORIES,
  VIRTUAL_TOUR_LOCATIONS,
  getLocationsByCategory,
  getDefaultLocation,
  type VirtualTourCategory,
  type VirtualTourLocation,
} from '@/lib/virtual-tour-data';
import { motion, AnimatePresence } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Status announcer for screen readers ──────────────────────────────────────
function useAnnouncer() {
  const [msg, setMsg] = useState('');
  const announce = useCallback((text: string) => {
    setMsg('');
    setTimeout(() => setMsg(text), 50);
  }, []);
  return { msg, announce };
}

// ── Single iframe stage ───────────────────────────────────────────────────────
function TourStage({
  location,
  onLoad,
  onError,
  status,
}: {
  location: VirtualTourLocation;
  onLoad: () => void;
  onError: () => void;
  status: 'loading' | 'ready' | 'error';
}) {
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
      {/* Loading shimmer */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            key="shimmer"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center gap-3"
            aria-hidden="true"
          >
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-muted">
              Loading tour…
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute inset-0 bg-neutral-50 flex flex-col items-center justify-center gap-4 p-8 text-center"
          >
            <RotateCcw className="w-8 h-8 text-muted" aria-hidden="true" />
            <div>
              <p className="font-sans font-semibold text-foreground text-[0.95rem]">
                Tour unavailable
              </p>
              <p className="mt-1 text-muted text-[0.82rem] leading-relaxed max-w-xs">
                This 360° view could not be loaded. Please try visiting{' '}
                <a
                  href="https://mlrit.ac.in/virtual-tour/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  the official tour page
                </a>{' '}
                directly.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Iframe — always mounted to fire onLoad/onError */}
      <iframe
        key={location.id}
        src={location.embedUrl}
        title={location.iframeTitle}
        allowFullScreen={location.allowFullScreen}
        allow="fullscreen"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 w-full h-full border-0"
        style={{ opacity: status === 'ready' ? 1 : 0, transition: 'opacity 0.4s' }}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function VirtualTourSection() {
  const [activeCategory, setActiveCategory] = useState<VirtualTourCategory>('campus');
  const [activeLocation, setActiveLocation] = useState<VirtualTourLocation>(
    getDefaultLocation('campus')
  );
  const [iframeStatus, setIframeStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const { msg: ariaMsg, announce } = useAnnouncer();
  const catTabsId = useId();

  // Locations for active category
  const locations = getLocationsByCategory(activeCategory);

  // Switch category
  const handleCategoryChange = useCallback(
    (cat: VirtualTourCategory) => {
      setActiveCategory(cat);
      const def = getDefaultLocation(cat);
      setActiveLocation(def);
      setIframeStatus('loading');
      const label = VIRTUAL_TOUR_CATEGORIES.find((c) => c.id === cat)?.label ?? cat;
      announce(`Switched to ${label} tour. Showing ${def.title}.`);
    },
    [announce]
  );

  // Switch location
  const handleLocationChange = useCallback(
    (loc: VirtualTourLocation) => {
      if (loc.id === activeLocation.id) return;
      setActiveLocation(loc);
      setIframeStatus('loading');
      announce(`Loading 360° view of ${loc.title}.`);
    },
    [activeLocation.id, announce]
  );

  // Category keyboard navigation (arrow keys)
  const handleCategoryKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      const len = VIRTUAL_TOUR_CATEGORIES.length;
      let next = -1;
      if (e.key === 'ArrowRight') next = (idx + 1) % len;
      if (e.key === 'ArrowLeft') next = (idx - 1 + len) % len;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = len - 1;
      if (next >= 0) {
        e.preventDefault();
        const tabs = document.querySelectorAll<HTMLButtonElement>(
          `[data-cat-tab]`
        );
        tabs[next]?.focus();
        handleCategoryChange(VIRTUAL_TOUR_CATEGORIES[next].id);
      }
    },
    [handleCategoryChange]
  );

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <section aria-labelledby="vt-heading" className="bg-cream">
      {/* Live region for screen readers */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaMsg}
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16 py-20 md:py-28">
        {/* Section header */}
        <div className="mb-12 md:mb-16 max-w-[680px]">
          <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] font-bold tracking-[0.22em] uppercase text-primary">
            <MapPin className="w-3 h-3" aria-hidden="true" />
            Virtual Campus Tour
          </span>
          <h2
            id="vt-heading"
            className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,4vw,3.2rem)] leading-[1.04]"
          >
            Explore MLRIT,{' '}
            <span className="font-display italic font-medium text-secondary">
              from wherever you are.
            </span>
          </h2>
          <p className="mt-5 text-muted leading-[1.75] text-[1.02rem] max-w-[560px]">
            Step inside every corner of our campus through official 360° panoramas —
            classrooms, labs, sports facilities, and more.
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-start">
          {/* ── Left: category + location nav ─────────────────────────── */}
          <div className="flex-none lg:w-[220px] xl:w-[240px]">
            {/* Category tabs */}
            <div
              role="tablist"
              aria-label="Tour categories"
              id={catTabsId}
              className="flex lg:flex-col gap-1.5"
            >
              {VIRTUAL_TOUR_CATEGORIES.map((cat, idx) => {
                const isActive = cat.id === activeCategory;
                return (
                  <button
                    key={cat.id}
                    role="tab"
                    data-cat-tab
                    aria-selected={isActive}
                    aria-controls="vt-stage-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => handleCategoryChange(cat.id)}
                    onKeyDown={(e) => handleCategoryKeyDown(e, idx)}
                    className={`relative text-left px-4 py-2.5 rounded-xl font-sans font-semibold text-[0.88rem] transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 flex-1 lg:flex-none ${
                      isActive
                        ? 'bg-foreground text-white'
                        : 'text-muted hover:text-foreground hover:bg-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Location list */}
            <div
              className="mt-4 lg:mt-6 flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0 no-scrollbar"
              aria-label={`Locations in ${VIRTUAL_TOUR_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex lg:flex-col gap-1.5 lg:gap-1"
                >
                  {locations.map((loc) => {
                    const isActive = loc.id === activeLocation.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => handleLocationChange(loc)}
                        aria-pressed={isActive}
                        className={`flex-none lg:w-full text-left px-3.5 py-2 rounded-lg text-[0.82rem] font-sans leading-snug transition-all duration-150 whitespace-nowrap lg:whitespace-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-1 ${
                          isActive
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-muted hover:text-foreground hover:bg-white'
                        }`}
                      >
                        {loc.title}
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: tour stage ─────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Stage wrapper */}
            <div
              id="vt-stage-panel"
              role="tabpanel"
              aria-label={`Tour: ${activeLocation.title}`}
              ref={stageRef}
              className="relative rounded-2xl overflow-hidden border border-border/50 shadow-card-soft bg-neutral-100"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeLocation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <TourStage
                    location={activeLocation}
                    status={iframeStatus}
                    onLoad={() => setIframeStatus('ready')}
                    onError={() => setIframeStatus('error')}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Fullscreen button */}
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="absolute top-3 right-3 z-10 w-9 h-9 rounded-lg bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Active location label */}
            <div className="mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
              <p className="font-sans font-semibold text-foreground text-[0.88rem]">
                {activeLocation.title}
              </p>
              <span className="text-muted text-[0.82rem]">
                · {VIRTUAL_TOUR_CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
