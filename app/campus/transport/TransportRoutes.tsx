'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Search, Phone, MapPin } from 'lucide-react';
import type { BusRoute } from '@/lib/transport-routes';
import { searchRoutes } from '@/lib/transport-routes';

/* ══════════════════════════════════════ DETAIL MODAL ════════════ */

function RouteDetail({ route, onClose }: { route: BusRoute; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', fn); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 30, opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: 540,
          background: '#13131a',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 20,
          display: 'flex', flexDirection: 'column',
          maxHeight: '88vh',
          overflow: 'hidden',
        }}
      >
        {/* Header — always visible, never scrolls */}
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px 18px',
          background: '#13131a',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: 'rgba(232,93,4,0.12)', border: '1px solid rgba(232,93,4,0.28)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'monospace', fontWeight: 900, fontSize: '1.15rem', color: '#e85d04',
            }}>
              {route.routeNumber}
            </div>
            <div>
              <p style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', lineHeight: 1.2 }}>
                Route {route.routeNumber}
              </p>
              <p style={{ fontFamily: 'monospace', fontSize: '0.63rem', color: 'rgba(255,255,255,0.28)', marginTop: 4, letterSpacing: '0.07em' }}>
                {route.stops[0]} → {route.stops[route.stops.length - 1]}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none',
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X style={{ width: 16, height: 16 }} />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px 32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Stops */}
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 14 }}>
              {route.stops.length} stops
            </p>
            <ol>
              {route.stops.map((stop, i) => {
                const first = i === 0, last = i === route.stops.length - 1;
                return (
                  <li key={i} style={{ display: 'flex', alignItems: 'stretch', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 16, flexShrink: 0 }}>
                      <div style={{
                        borderRadius: '50%', marginTop: 10, flexShrink: 0,
                        width: first || last ? 9 : 6, height: first || last ? 9 : 6,
                        background: first || last ? '#e85d04' : 'rgba(255,255,255,0.18)',
                        boxShadow: first || last ? '0 0 0 3px rgba(232,93,4,0.18)' : 'none',
                      }} />
                      {!last && <div style={{ flex: 1, width: 1, marginTop: 3, background: 'linear-gradient(to bottom,rgba(255,255,255,0.1),rgba(255,255,255,0.02))' }} />}
                    </div>
                    <div style={{ padding: '6px 0', flex: 1 }}>
                      <span style={{ fontSize: '0.82rem', color: first || last ? '#fff' : 'rgba(255,255,255,0.4)', fontWeight: first || last ? 600 : 400, lineHeight: 1.4 }}>
                        {stop}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Contacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 2 }}>
              Contacts
            </p>
            {[
              { label: 'Incharge', name: route.inchargeName, contact: route.inchargeContact, Icon: Phone },
              { label: 'Driver', name: route.driverName, contact: route.driverContact, Icon: MapPin },
            ].map(({ label, name, contact, Icon }) => (
              <div key={label} style={{ borderRadius: 12, padding: '14px 16px', background: '#1c1c26', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '0.56rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Icon style={{ width: 11, height: 11 }} /> {label}
                </p>
                <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'rgba(255,255,255,0.82)', lineHeight: 1.3, marginBottom: 6 }}>{name}</p>
                <a href={`tel:${contact}`} style={{ fontFamily: 'monospace', fontSize: '0.79rem', color: '#e85d04', textDecoration: 'none' }}>{contact}</a>
              </div>
            ))}
            <p style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.13)', lineHeight: 1.5, marginTop: 4 }}>
              Confirm timings with the transport office.
            </p>
          </div>
        </div>
        </div>{/* end scrollable body */}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════ DECK STACK CAROUSEL ═════ */

const CARD_W = 520;
const CARD_H = 360;
// Back cards shift upward so their top edges peek above the card in front
const PEEK_Y   = 18;   // px upward each card sits above the previous
const PEEK_SCL = 0.04; // scale shrink per depth
const VISIBLE_STACK = 4;
const AUTO_MS = 2500;

function DeckCarousel({
  routes,
  paused,
  onTap,
}: {
  routes: BusRoute[];
  paused: boolean;
  onTap: (r: BusRoute) => void;
}) {
  const prefersReduced = useReducedMotion();
  const [topIdx, setTopIdx] = useState(0);
  const [ejecting, setEjecting] = useState(false);

  // Keep mutable refs so the interval callback never goes stale
  const pausedRef   = useRef(paused);
  const routesLen   = useRef(routes.length);
  const ejectingRef = useRef(false);
  const dirRef      = useRef<1 | -1>(1); // alternates: 1=right, -1=left
  const [ejectDir, setEjectDir] = useState<1 | -1>(1);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { routesLen.current = routes.length; }, [routes.length]);

  const doEject = useCallback(() => {
    if (ejectingRef.current || pausedRef.current) return;
    ejectingRef.current = true;
    const dir = dirRef.current;
    dirRef.current = dir === 1 ? -1 : 1; // flip for next time
    setEjectDir(dir);
    setEjecting(true);
    setTimeout(() => {
      setTopIdx(i => (i + 1) % routesLen.current);
      setEjecting(false);
      ejectingRef.current = false;
    }, 300);
  }, []);

  // Single stable interval — never torn down except on unmount
  useEffect(() => {
    const id = setInterval(doEject, AUTO_MS);
    return () => clearInterval(id);
  }, [doEject]);

  const jumpTo = (i: number) => {
    if (ejectingRef.current) return;
    setTopIdx(i);
  };

  const goBack = () => {
    if (ejectingRef.current) return;
    setTopIdx(i => (i - 1 + routes.length + routes.length) % routes.length);
  };

  // Build the visible stack: index 0 = top card, 1 = second, …
  const stackIndices: number[] = [];
  for (let k = 0; k < VISIBLE_STACK; k++) {
    stackIndices.push((topIdx + k) % routes.length);
  }

  // Reset to Route 1 when carousel scrolls out of view
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // scrolled past — reset silently
          setTopIdx(0);
          ejectingRef.current = false;
          setEjecting(false);
          dirRef.current = 1;
        }
      },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Stage height: top card + space for back cards peeking above
  const peekTotal = PEEK_Y * (VISIBLE_STACK - 1);
  const stageH = CARD_H + peekTotal + 32;

  const springCfg = prefersReduced
    ? { type: 'tween' as const, duration: 0 }
    : { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.85 };

  return (
    <div ref={sectionRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48, paddingBottom: 64 }}>

      {/* ── Stack stage ── */}
      <div style={{ position: 'relative', width: CARD_W, height: stageH, overflow: 'visible', marginTop: peekTotal }}>
        {/* Render back→front so top card paints last */}
        {[...stackIndices].reverse().map((routeIdx) => {
          const depth = stackIndices.indexOf(routeIdx); // 0 = top
          const route = routes[routeIdx];
          const isTop  = depth === 0;
          const isEjecting = isTop && ejecting;

          const scl  = 1 - depth * PEEK_SCL;
          // depth 0 (top) is at y=0; depth 1 is PEEK_Y above, depth 2 is 2*PEEK_Y above
          // so back cards peek ABOVE the top card like a real stack viewed from top-down
          const yPos = -depth * PEEK_Y;
          const dim  = 1 - depth * 0.13;

          return (
            <motion.div
              key={routeIdx}
              onClick={() => { if (isTop && !isEjecting) { onTap(route); } }}
              animate={
                isEjecting
                  ? { translateX: ejectDir * 520, rotate: ejectDir * 22, opacity: 0, scale: scl * 0.9 }
                  : { translateX: 0, rotate: 0, opacity: 1, scale: scl }
              }
              transition={
                isEjecting
                  ? { duration: 0.28, ease: [0.55, 0, 0.85, 0.06] }
                  : springCfg
              }
              style={{
                position: 'absolute',
                top: yPos,
                left: '50%',
                marginLeft: -CARD_W / 2,
                width: CARD_W,
                height: CARD_H,
                cursor: isTop ? 'pointer' : 'default',
                zIndex: VISIBLE_STACK - depth,
                transformOrigin: 'bottom center',
                userSelect: 'none',
                filter: `brightness(${dim})`,
              }}
            >
              <div style={{
                width: '100%', height: '100%',
                borderRadius: 18,
                overflow: 'hidden',
                background: '#e8e4dd',
                position: 'relative',
                boxShadow: isTop
                  ? '0 28px 64px rgba(0,0,0,0.46), 0 8px 24px rgba(0,0,0,0.28)'
                  : `0 ${4 + depth * 2}px ${16 + depth * 8}px rgba(0,0,0,0.20)`,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/campus/transport/buses/Route ${route.routeNumber} Bus.${route.routeNumber === 2 ? 'jpg' : 'png'}`}
                  alt={`Route ${route.routeNumber} bus`}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                  draggable={false}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center center', padding: '16px 20px' }}
                />

                {/* Top card label */}
                {isTop && !isEjecting && (
                  <div style={{
                    position: 'absolute', inset: 'auto 0 0 0',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 65%, transparent 100%)',
                    padding: '36px 18px 18px',
                    borderRadius: '0 0 18px 18px',
                  }}>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.57rem', letterSpacing: '0.17em', color: 'rgba(255,255,255,0.44)', textTransform: 'uppercase', marginBottom: 5 }}>
                      {route.stops[0]} → {route.stops[route.stops.length - 1]}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: 900, fontSize: '0.9rem', color: '#fff' }}>
                        Tap to view details
                      </p>
                      <div style={{
                        background: 'rgba(232,93,4,0.2)', border: '1px solid rgba(232,93,4,0.55)',
                        borderRadius: 8, padding: '3px 11px',
                        fontFamily: 'monospace', fontWeight: 800, fontSize: '0.76rem', color: '#e85d04',
                      }}>
                        Route {route.routeNumber}
                      </div>
                    </div>
                  </div>
                )}

                {/* Back-card dimming tint so image is still visible */}
                {!isTop && (
                  <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.18 + depth * 0.1})`, borderRadius: 18 }} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Route counter */}
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#e85d04', fontWeight: 800, letterSpacing: '0.04em' }}>
          Route {routes[topIdx].routeNumber}
        </span>
        <span style={{ color: 'rgba(0,0,0,0.2)', fontSize: '0.75rem' }}>/ {routes.length}</span>
      </div>

      {/* Dot track */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 5, marginTop: 14, maxWidth: 340 }}>
        {routes.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpTo(i)}
            aria-label={`Go to route ${i + 1}`}
            style={{
              width: i === topIdx ? 22 : 6, height: 6, borderRadius: 99,
              background: i === topIdx ? '#e85d04' : 'rgba(0,0,0,0.15)',
              border: 'none', padding: 0, cursor: 'pointer',
              transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)', flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Prev / Next */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16 }}>
        {[
          { label: '←', action: goBack },
          { label: '→', action: doEject },
        ].map(({ label, action }) => (
          <button key={label} onClick={action} aria-label={label === '←' ? 'Previous' : 'Next'}
            style={{
              width: 42, height: 42, borderRadius: '50%', border: 'none',
              background: '#e85d04', color: '#fff',
              cursor: 'pointer', fontSize: '1.05rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════ MAIN COMPONENT ═══════════ */

export default function TransportRoutes({ routes }: { routes: BusRoute[] }) {
  const [query, setQuery] = useState('');
  const [activeRoute, setActiveRoute] = useState<BusRoute | null>(null);

  const filtered = query.trim() ? searchRoutes(query) : routes;
  const isSearching = query.trim().length > 0;

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') setQuery('');
  };

  return (
    <>
      <section style={{ background: '#faf7f0' }} className="pb-28" aria-label="Bus network">
        <div className="max-w-[1280px] mx-auto px-6 md:px-14 lg:px-20">

          {/* ── Transport Incharges ── */}
          <div className="pt-14 pb-10" style={{ borderBottom: '1px solid #e4e0d7' }}>
            <h2 className="font-sans font-black leading-[1.04] mb-6"
              style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)', letterSpacing: '-0.03em', color: '#0f0f0f' }}>
              Transport Incharges
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Incharge 1', name: 'Mr. J Pradeep', phone: '97039 95722' },
                { label: 'Incharge 2', name: 'Mr. Hanmandhulu', phone: '91604 04652' },
              ].map(({ label, name, phone }) => (
                <a key={label} href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 transition-all"
                  style={{ background: '#fff', border: '1.5px solid #e4e0d7', borderRadius: 4, padding: '12px 18px', textDecoration: 'none' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#f5a96a'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 0 3px rgba(232,93,4,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#e4e0d7'; (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: '#fdf5ee', border: '1.5px solid #f5d9c0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Phone className="w-4 h-4" style={{ color: '#e85d04' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', color: '#9d9b94', fontFamily: 'monospace', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>{label}</p>
                    <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f0f0f', lineHeight: 1.2 }}>{name}</p>
                    <p style={{ fontSize: '0.78rem', color: '#e85d04', fontWeight: 600, marginTop: 1 }}>{phone}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── Header ── */}
          <div className="pt-12 pb-7">
            <p className="font-mono text-primary mb-3" style={{ fontSize: '0.67rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Bus Network
            </p>
            <h2 className="font-sans font-black leading-[1.04] mb-3"
              style={{ fontSize: 'clamp(2rem,4vw,3.2rem)', letterSpacing: '-0.03em', color: '#0f0f0f' }}>
              Find your route
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#6a6a64', lineHeight: 1.6, maxWidth: 480 }}>
              {routes.length} routes — auto-cycling from Route 1. Tap the top card for stops and contacts.
            </p>
          </div>

          {/* ── Search ── */}
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[260px] max-w-[480px] flex-1">
              <label htmlFor="route-search" className="sr-only">Search routes</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#9d9b94' }} />
              <input
                id="route-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Area, stop or route number…"
                autoComplete="off"
                spellCheck={false}
                className="w-full focus:outline-none transition-all"
                style={{
                  background: '#fff', border: '1.5px solid #e4e0d7', color: '#0f0f0f',
                  borderRadius: 4, paddingLeft: 44, paddingRight: query ? 40 : 16,
                  paddingTop: 13, paddingBottom: 13, fontSize: '0.88rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                }}
                onFocus={(e) => { (e.target as HTMLInputElement).style.borderColor = 'rgba(232,93,4,0.5)'; (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(232,93,4,0.10)'; }}
                onBlur={(e) => { (e.target as HTMLInputElement).style.borderColor = '#e4e0d7'; (e.target as HTMLInputElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.05)'; }}
              />
              {query && (
                <button onClick={() => setQuery('')} aria-label="Clear"
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors focus-visible:outline-none"
                  style={{ color: '#9d9b94' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#0f0f0f'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#9d9b94'; }}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {isSearching && (
              <p role="status" aria-live="polite" className="tabular-nums" style={{ fontSize: '0.82rem', color: '#6a6a64' }}>
                {filtered.length === 0 ? 'No routes match.' : `${filtered.length} route${filtered.length === 1 ? '' : 's'} found`}
              </p>
            )}
          </div>

          {/* ── Deck carousel ── */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: '#c4bdb0' }} />
              <p style={{ fontSize: '0.9rem', color: '#9d9b94' }}>No routes match that area or stop.</p>
            </div>
          ) : (
            <DeckCarousel
              routes={filtered}
              paused={activeRoute !== null}
              onTap={setActiveRoute}
            />
          )}

        </div>
      </section>

      {/* Detail modal — mounts over everything, pauses carousel while open */}
      <AnimatePresence>
        {activeRoute && (
          <RouteDetail route={activeRoute} onClose={() => setActiveRoute(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
