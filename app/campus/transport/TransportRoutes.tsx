'use client';

import {
  useState,
  useEffect,
  useRef,
  type KeyboardEvent,
} from 'react';
import { motion, useReducedMotion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { X, Search, Phone, ChevronRight, MapPin } from 'lucide-react';
import type { BusRoute } from '@/lib/transport-routes';
import { searchRoutes } from '@/lib/transport-routes';


/* ══════════════════════════════════════ ROUTE DETAIL MODAL ═══════ */

function RouteModal({ route, onClose }: { route: BusRoute; onClose: () => void }) {
  const origin = route.stops[0] ?? '—';
  const destination = route.stops[route.stops.length - 1] ?? '—';

  useEffect(() => {
    const fn = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', fn);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 56, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 56, opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full sm:max-w-[520px] max-h-[88vh] overflow-y-auto"
        style={{ background: '#faf7f0', border: '1px solid #e8e3d9', borderRadius: 4, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-5"
          style={{ background: 'linear-gradient(to bottom, #faf7f0 80%, rgba(250,247,240,0))', borderBottom: '1px solid #e8e3d9' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xl flex-shrink-0"
              style={{ background: 'rgba(232,93,4,0.1)', border: '1.5px solid rgba(232,93,4,0.28)', color: '#e85d04' }}>
              {route.routeNumber}
            </div>
            <div>
              <p className="font-sans font-bold leading-tight" style={{ fontSize: '1.02rem', color: '#0f0f0f' }}>Route {route.routeNumber}</p>
              <p className="font-mono mt-0.5" style={{ fontSize: '0.72rem', color: '#9d9b94' }}>{route.stops.length} stops</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            style={{ color: '#9d9b94' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0ede6'; (e.currentTarget as HTMLButtonElement).style.color = '#0f0f0f'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9d9b94'; }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Origin → Destination */}
          <div className="flex items-center gap-3 mb-6 px-4 py-3.5 rounded-2xl"
            style={{ background: 'rgba(232,93,4,0.06)', border: '1.5px solid rgba(232,93,4,0.18)' }}>
            <div className="flex-1 min-w-0">
              <p className="font-mono mb-0.5" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b5afa6' }}>From</p>
              <p className="font-sans font-semibold truncate" style={{ fontSize: '0.92rem', color: '#0f0f0f' }}>{origin}</p>
            </div>
            <div className="w-px h-8 flex-shrink-0" style={{ background: '#d6cfc4' }} />
            <div className="flex-1 min-w-0 text-right">
              <p className="font-mono mb-0.5" style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b5afa6' }}>To</p>
              <p className="font-sans font-semibold truncate" style={{ fontSize: '0.92rem', color: '#0f0f0f' }}>{destination}</p>
            </div>
          </div>

          {/* All stops */}
          <p className="font-mono mb-3" style={{ fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#b5afa6' }}>
            Route Map — {route.stops.length} stops
          </p>
          <ol aria-label={`Stops for Route ${route.routeNumber}`} className="mb-6">
            {route.stops.map((stop, i) => {
              const isFirst = i === 0, isLast = i === route.stops.length - 1;
              return (
                <li key={i} className="flex items-stretch gap-3.5">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 18 }}>
                    <div
                      style={{
                        flexShrink: 0, borderRadius: '50%',
                        width: isFirst || isLast ? 9 : 6, height: isFirst || isLast ? 9 : 6,
                        marginTop: 11,
                        background: isFirst || isLast ? '#e85d04' : '#d6cfc4',
                        boxShadow: isFirst || isLast ? '0 0 0 3px rgba(232,93,4,0.18)' : 'none',
                      }} />
                    {!isLast && (
                      <div className="flex-1 mt-1" style={{ width: 1, minHeight: 6,
                        background: 'linear-gradient(to bottom, #d6cfc4, #ece8e0)' }} />
                    )}
                  </div>
                  <div className="py-2 flex-1">
                    <span style={{
                      fontSize: '0.88rem', lineHeight: 1.45,
                      fontWeight: isFirst || isLast ? 600 : 400,
                      color: isFirst || isLast ? '#0f0f0f' : '#6a6a64',
                    }}>
                      {stop}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Driver & Incharge */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { icon: <MapPin className="w-3 h-3" />, label: 'Driver', name: route.driverName, contact: route.driverContact },
              { icon: <Phone className="w-3 h-3" />, label: 'Incharge', name: route.inchargeName, contact: route.inchargeContact },
            ].map(({ icon, label, name, contact }) => (
              <div key={label} className="rounded-2xl p-4"
                style={{ background: '#fff', border: '1.5px solid #e8e3d9' }}>
                <p className="font-mono mb-2 flex items-center gap-1.5"
                  style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b5afa6' }}>
                  {icon} {label}
                </p>
                <p className="font-semibold leading-snug mb-1.5" style={{ fontSize: '0.86rem', color: '#0f0f0f' }}>{name}</p>
                <a href={`tel:${contact}`}
                  className="hover:underline focus-visible:outline-none font-mono block"
                  style={{ fontSize: '0.82rem', color: '#e85d04' }}>
                  {contact}
                </a>
              </div>
            ))}
          </div>

          <p className="leading-relaxed" style={{ fontSize: '0.7rem', color: '#b5afa6' }}>
            Source: mlrit.ac.in/campus-life/transport-facility/ — confirm current details with the transport office.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════ FLIP ROUTE CARD ══════════ */

interface RouteCardProps {
  route: BusRoute;
  onViewDetails: (r: BusRoute) => void;
}

function RouteCard({ route, onViewDetails }: RouteCardProps) {
  const [flipped, setFlipped] = useState(false);
  const prefersReduced = useReducedMotion();
  const origin = route.stops[0] ?? '—';
  const destination = route.stops[route.stops.length - 1] ?? '—';
  const duration = prefersReduced ? 0 : 0.52;

  return (
    /* Perspective wrapper — fixed height so the card doesn't expand */
    <div
      role="button"
      tabIndex={0}
      aria-label={`Route ${route.routeNumber} — ${origin} to ${destination}`}
      aria-pressed={flipped}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewDetails(route); } }}
      style={{
        perspective: 1000,
        height: 200,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Flipper — rotates the whole card */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {/* ── FRONT FACE ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: '#fff',
            border: `1.5px solid ${flipped ? '#f5a96a' : '#e8e3d9'}`,
            borderRadius: 4,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
            padding: '16px 14px',
            boxShadow: flipped ? '0 0 0 4px rgba(232,93,4,0.10), 0 8px 32px rgba(232,93,4,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Circle badge */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#fdf5ee',
            border: '1.5px solid #f5d9c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 10,
          }}>
            <span style={{
              fontFamily: 'sans-serif', fontWeight: 900, fontSize: 20,
              color: '#e85d04', lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              {route.routeNumber}
            </span>
          </div>
          <p style={{
            fontWeight: 800, fontSize: '0.92rem', color: '#0f0f0f',
            lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 3,
          }}>
            Route {route.routeNumber}
          </p>
          <p style={{
            fontSize: '0.72rem', color: '#9d9b94',
            fontFamily: 'monospace', letterSpacing: '0.01em',
          }}>
            {route.stops.length} stops
          </p>
        </div>

        {/* ── BACK FACE ── */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(232,93,4,0.07) 0%, #fff 60%)',
            border: '1.5px solid #f5a96a',
            borderRadius: 4,
            display: 'flex', flexDirection: 'column',
            padding: '12px 12px 10px',
            boxShadow: '0 0 0 4px rgba(232,93,4,0.08), 0 8px 32px rgba(232,93,4,0.12)',
          }}
        >
          {/* Route badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: '#fdf5ee', border: '1.5px solid #f5a96a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: 11, color: '#e85d04', lineHeight: 1 }}>
                {route.routeNumber}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0f0f0f', lineHeight: 1.1 }}>
                Route {route.routeNumber}
              </p>
              <p style={{ fontSize: '0.62rem', color: '#9d9b94', fontFamily: 'monospace', marginTop: 1 }}>
                {route.stops.length} stops
              </p>
            </div>
          </div>

          {/* Origin → Destination */}
          <div style={{
            padding: '7px 9px', borderRadius: 4,
            background: '#faf7f0', border: '1px solid #e8e3d9',
            marginBottom: 8, flex: '0 0 auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e85d04' }} />
                <div style={{ width: 1, height: 10, background: '#d6cfc4', margin: '2px 0' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', border: '1.5px solid #c4bdb0' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.72rem', color: '#0f0f0f', fontWeight: 600, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {origin}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#6a6a64', marginTop: 6, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {destination}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); onViewDetails(route); }}
            style={{
              marginTop: 'auto',
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              background: '#e85d04', border: 'none', borderRadius: 4,
              padding: '7px 0', color: '#fff', fontSize: '0.76rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.03em',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f06a14'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e85d04'; }}
          >
            Full route details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════ PARALLAX CARD GRID ═══════ */

// Each column scrolls at a different speed — alternating up/down creates depth
const COL_SPEEDS = [40, -50, 40]; // px travel per column over the scroll range

function ParallaxColumn({
  routes,
  colIndex,
  containerRef,
  onViewDetails,
}: {
  routes: BusRoute[];
  colIndex: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onViewDetails: (r: BusRoute) => void;
}) {
  const prefersReduced = useReducedMotion();
  const speed = COL_SPEEDS[colIndex % COL_SPEEDS.length];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReduced ? [0, 0] : [-speed, speed]
  );

  return (
    <motion.div
      style={{ y, display: 'flex', flexDirection: 'column', gap: 12 }}
    >
      {routes.map((route) => (
        <RouteCard key={route.id} route={route} onViewDetails={onViewDetails} />
      ))}
    </motion.div>
  );
}

function ParallaxCardGrid({
  routes,
  onViewDetails,
}: {
  routes: BusRoute[];
  onViewDetails: (r: BusRoute) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const NUM_COLS = 3;

  // Distribute routes into columns in order: col0=[0,3,6…], col1=[1,4,7…]
  const columns: BusRoute[][] = Array.from({ length: NUM_COLS }, () => []);
  routes.forEach((r, i) => columns[i % NUM_COLS].push(r));

  return (
    // Overflow hidden so fast columns don't bleed outside the section
    <div ref={containerRef} style={{ overflow: 'hidden', paddingBlock: 32 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(200px, 1fr))', gap: 12 }}>
        {columns.map((col, ci) => (
          <ParallaxColumn
            key={ci}
            routes={col}
            colIndex={ci}
            containerRef={containerRef}
            onViewDetails={onViewDetails}
          />
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
        <div className="w-full px-6 md:px-10 lg:px-12">

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
              {routes.length} official routes across Hyderabad. Hover a card to preview stops — then open full details for driver and incharge info.
            </p>
          </div>

          {/* ── Search ── */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
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

          {/* ── Card grid ── */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: '#c4bdb0' }} />
              <p style={{ fontSize: '0.9rem', color: '#9d9b94' }}>No routes match that area or stop.</p>
            </div>
          ) : (
            <ParallaxCardGrid routes={filtered} onViewDetails={setActiveRoute} />
          )}

        </div>
      </section>

      {/* Detail modal */}
      <AnimatePresence>
        {activeRoute && (
          <RouteModal route={activeRoute} onClose={() => setActiveRoute(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
