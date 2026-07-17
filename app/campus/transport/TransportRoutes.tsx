'use client';

import {
  useState,
  useEffect,
  type KeyboardEvent,
} from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
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
        style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24 }}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 pt-6 pb-5"
          style={{ background: 'linear-gradient(to bottom, #13131a 75%, transparent)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-black text-xl text-primary flex-shrink-0"
              style={{ background: 'rgba(232,93,4,0.1)', border: '1px solid rgba(232,93,4,0.22)' }}>
              {route.routeNumber}
            </div>
            <div>
              <p className="font-sans font-bold text-white leading-tight" style={{ fontSize: '0.95rem' }}>Route {route.routeNumber}</p>
              <p className="font-mono text-white/30 mt-0.5" style={{ fontSize: '0.68rem' }}>{route.stops.length} stops</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Origin → Destination */}
          <div className="flex items-center gap-3 mb-6 px-4 py-3.5 rounded-2xl"
            style={{ background: 'rgba(232,93,4,0.055)', border: '1px solid rgba(232,93,4,0.14)' }}>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-white/25 mb-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>From</p>
              <p className="font-sans font-semibold text-white truncate" style={{ fontSize: '0.88rem' }}>{origin}</p>
            </div>
            <div className="w-px h-8 bg-white/10 flex-shrink-0" />
            <div className="flex-1 min-w-0 text-right">
              <p className="font-mono text-white/25 mb-0.5" style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>To</p>
              <p className="font-sans font-semibold text-white truncate" style={{ fontSize: '0.88rem' }}>{destination}</p>
            </div>
          </div>

          {/* All stops */}
          <p className="font-mono text-white/28 mb-3" style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Route Map — {route.stops.length} stops
          </p>
          <ol aria-label={`Stops for Route ${route.routeNumber}`} className="mb-6">
            {route.stops.map((stop, i) => {
              const isFirst = i === 0, isLast = i === route.stops.length - 1;
              return (
                <li key={i} className="flex items-stretch gap-3.5">
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 18 }}>
                    <div className={['flex-shrink-0 rounded-full', isFirst || isLast ? 'bg-primary ring-4 ring-primary/20' : 'bg-white/18'].join(' ')}
                      style={{ width: isFirst || isLast ? 9 : 6, height: isFirst || isLast ? 9 : 6, marginTop: 11 }} />
                    {!isLast && (
                      <div className="flex-1 mt-1" style={{ width: 1, minHeight: 6,
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.04))' }} />
                    )}
                  </div>
                  <div className="py-2 flex-1">
                    <span className={['leading-snug', isFirst || isLast ? 'font-semibold text-white' : 'text-white/45'].join(' ')}
                      style={{ fontSize: '0.84rem' }}>
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
                style={{ background: '#1c1c26', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-mono text-white/25 mb-2 flex items-center gap-1.5"
                  style={{ fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {icon} {label}
                </p>
                <p className="text-white/80 font-semibold leading-snug mb-1.5" style={{ fontSize: '0.82rem' }}>{name}</p>
                <a href={`tel:${contact}`}
                  className="text-primary hover:underline focus-visible:outline-none font-mono block"
                  style={{ fontSize: '0.78rem' }}>
                  {contact}
                </a>
              </div>
            ))}
          </div>

          <p className="text-white/18 leading-relaxed" style={{ fontSize: '0.68rem' }}>
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
        height: 240,
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
            borderRadius: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
            padding: '28px 20px',
            boxShadow: flipped ? '0 0 0 4px rgba(232,93,4,0.10), 0 8px 32px rgba(232,93,4,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Large circle badge */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: '#fdf5ee',
            border: '1.5px solid #f5d9c0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <span style={{
              fontFamily: 'sans-serif', fontWeight: 900, fontSize: 30,
              color: '#e85d04', lineHeight: 1, letterSpacing: '-0.02em',
            }}>
              {route.routeNumber}
            </span>
          </div>
          <p style={{
            fontWeight: 800, fontSize: '1rem', color: '#0f0f0f',
            lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 5,
          }}>
            Route {route.routeNumber}
          </p>
          <p style={{
            fontSize: '0.73rem', color: '#9d9b94',
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
            borderRadius: 20,
            display: 'flex', flexDirection: 'column',
            padding: '18px 18px 16px',
            boxShadow: '0 0 0 4px rgba(232,93,4,0.08), 0 8px 32px rgba(232,93,4,0.12)',
          }}
        >
          {/* Route badge row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
              background: '#fdf5ee', border: '1.5px solid #f5a96a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontWeight: 900, fontSize: 14, color: '#e85d04', lineHeight: 1 }}>
                {route.routeNumber}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f0f0f', lineHeight: 1.1 }}>
                Route {route.routeNumber}
              </p>
              <p style={{ fontSize: '0.62rem', color: '#9d9b94', fontFamily: 'monospace', marginTop: 2 }}>
                {route.stops.length} stops
              </p>
            </div>
          </div>

          {/* Origin → Destination */}
          <div style={{
            padding: '10px 12px', borderRadius: 12,
            background: '#faf7f0', border: '1px solid #e8e3d9',
            marginBottom: 12, flex: '0 0 auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e85d04' }} />
                <div style={{ width: 1, height: 14, background: '#d6cfc4', margin: '3px 0' }} />
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', border: '1.5px solid #c4bdb0' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.72rem', color: '#0f0f0f', fontWeight: 600, lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {origin}
                </p>
                <p style={{ fontSize: '0.72rem', color: '#6a6a64', marginTop: 10, lineHeight: 1.3,
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
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#e85d04', border: 'none', borderRadius: 12,
              padding: '10px 0', color: '#fff', fontSize: '0.8rem', fontWeight: 700,
              cursor: 'pointer', letterSpacing: '0.03em',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f06a14'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#e85d04'; }}
          >
            Full route details
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
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
                  style={{ background: '#fff', border: '1.5px solid #e4e0d7', borderRadius: 14, padding: '12px 18px', textDecoration: 'none' }}
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
                  borderRadius: 14, paddingLeft: 44, paddingRight: query ? 40 : 16,
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
            <motion.div
              layout
              className="grid gap-4"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
            >
              {filtered.map((route) => (
                <RouteCard key={route.id} route={route} onViewDetails={setActiveRoute} />
              ))}
            </motion.div>
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
