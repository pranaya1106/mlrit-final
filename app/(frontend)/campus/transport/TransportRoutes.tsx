'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { usePrefersReducedMotion } from './TransportRouteMap';
import { Search, Phone, ChevronRight, Info, MapPin } from 'lucide-react';
import type { BusRoute } from '@/lib/transport-routes';
import { searchRoutes, viaSummary } from '@/lib/transport-routes';
import { routeKm } from '@/lib/transport-geo';
import TransportRouteMap from './TransportRouteMap';

const INK = '#0c0c0e';
const ORANGE = '#e85d04';

/* ══════════════════════════════════════ ROUTE ROW ═══════════════ */

function RouteRow({
  route,
  selected,
  onSelect,
  registerRef,
}: {
  route: BusRoute;
  selected: boolean;
  onSelect: (n: number) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <li>
      <button
        type="button"
        ref={registerRef}
        onClick={() => onSelect(route.routeNumber)}
        aria-current={selected ? 'true' : undefined}
        aria-label={`Route ${route.routeNumber} from ${route.stops[0]} to MLRIT, ${route.stops.length} stops`}
        className="flex w-full items-center gap-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55"
        style={{
          background: selected ? INK : '#fff',
          border: `1px solid ${selected ? INK : '#e8e3d9'}`,
          borderRadius: 14,
          padding: '11px 13px',
          cursor: 'pointer',
        }}
      >
        <span
          className="font-mono flex-shrink-0"
          style={{
            width: 34, height: 34, borderRadius: 10, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700,
            background: selected ? ORANGE : 'rgba(232,93,4,0.08)',
            color: selected ? '#fff' : ORANGE,
          }}
        >
          {String(route.routeNumber).padStart(2, '0')}
        </span>
        <span className="min-w-0 flex-1">
          <span
            className="block truncate font-sans font-bold"
            style={{ fontSize: '0.88rem', color: selected ? '#fff' : '#0f0f0f' }}
          >
            {route.stops[0]}
          </span>
          <span
            className="block truncate font-sans"
            style={{ fontSize: '0.72rem', color: selected ? 'rgba(255,255,255,0.6)' : '#9d9b94', marginTop: 2 }}
          >
            via {viaSummary(route.stops)}
          </span>
        </span>
        <span
          className="flex flex-shrink-0 items-center gap-1 font-mono uppercase"
          style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: selected ? '#fff' : '#9d9b94' }}
        >
          View
          <ChevronRight className="w-3 h-3" aria-hidden="true" />
        </span>
      </button>
    </li>
  );
}

/* ══════════════════════════════════════ CONTACT PILL ════════════ */

function ContactPill({ label, name, contact }: { label: string; name: string; contact: string }) {
  return (
    <a
      href={`tel:${contact.replace(/\s/g, '')}`}
      className="flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/55"
      style={{ background: '#fff', border: '1px solid #e8e3d9', borderRadius: 12, padding: '9px 14px', textDecoration: 'none' }}
    >
      <span
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(232,93,4,0.09)', color: ORANGE }}
      >
        {label === 'Driver' ? <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> : <Phone className="w-3.5 h-3.5" aria-hidden="true" />}
      </span>
      <span className="min-w-0">
        <span className="block font-mono uppercase" style={{ fontSize: '0.56rem', letterSpacing: '0.14em', color: '#b5afa6' }}>
          {label}
        </span>
        <span className="block truncate font-sans font-bold" style={{ fontSize: '0.82rem', color: '#0f0f0f', marginTop: 1 }}>
          {name}
        </span>
        <span className="block font-mono" style={{ fontSize: '0.74rem', color: ORANGE, marginTop: 1 }}>
          {contact}
        </span>
      </span>
    </a>
  );
}

/* ══════════════════════════════════════ MAIN COMPONENT ══════════ */

export default function TransportRoutes({ routes }: { routes: BusRoute[] }) {
  const prefersReduced = usePrefersReducedMotion();
  const [query, setQuery] = useState('');
  const [selectedNo, setSelectedNo] = useState(routes[0]?.routeNumber ?? 1);
  const detailRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<number, HTMLButtonElement>());

  const filtered = query.trim() ? searchRoutes(query) : routes;
  const selected = filtered.find((r) => r.routeNumber === selectedNo) ?? filtered[0] ?? routes[0];

  // Keep the selection valid when a search narrows the list.
  useEffect(() => {
    if (filtered.length && !filtered.some((r) => r.routeNumber === selectedNo)) {
      setSelectedNo(filtered[0].routeNumber);
    }
  }, [filtered, selectedNo]);

  // Below the desktop split the detail sits under the list, so follow the pick.
  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) return;
    detailRef.current?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }, [selectedNo, prefersReduced]);

  const onListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const i = filtered.findIndex((r) => r.routeNumber === selected?.routeNumber);
    const next = e.key === 'ArrowDown' ? Math.min(i + 1, filtered.length - 1) : Math.max(i - 1, 0);
    const route = filtered[next];
    if (!route) return;
    setSelectedNo(route.routeNumber);
    itemRefs.current.get(route.routeNumber)?.focus();
  };

  const km = selected ? routeKm(selected.routeNumber) : undefined;

  return (
    <section id="routes" aria-label="Bus network" style={{ background: '#faf7f0' }} className="pb-16 md:pb-24">
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(300px,360px)_1fr] lg:gap-8 items-start">

          {/* ── Route picker ── */}
          <div className="lg:sticky lg:top-24 min-w-0">
            <label htmlFor="route-search" className="sr-only">Search routes by area or stop</label>
            <div
              className="flex items-center gap-2.5"
              style={{ background: '#fff', border: '1px solid #e8e3d9', borderRadius: 999, padding: '11px 16px' }}
            >
              <Search className="w-4 h-4 flex-shrink-0" style={{ color: '#b5afa6' }} aria-hidden="true" />
              <input
                id="route-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') setQuery(''); }}
                placeholder="Search your area or stop, e.g. Miyapur"
                className="w-full font-sans focus-visible:outline-none"
                style={{ fontSize: '0.84rem', color: '#0f0f0f', background: 'transparent' }}
              />
            </div>

            <p className="mt-3 mb-2 font-mono uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.14em', color: '#b5afa6' }}>
              <span role="status" aria-live="polite">{filtered.length} of {routes.length} routes</span>
            </p>

            <ul
              onKeyDown={onListKey}
              className="flex flex-col gap-2 lg:max-h-[min(560px,calc(100vh-16rem))] lg:overflow-y-auto lg:pr-1"
            >
              {filtered.map((route) => (
                <RouteRow
                  key={route.id}
                  route={route}
                  selected={route.routeNumber === selected?.routeNumber}
                  onSelect={setSelectedNo}
                  registerRef={(btn) => {
                    if (btn) itemRefs.current.set(route.routeNumber, btn);
                    else itemRefs.current.delete(route.routeNumber);
                  }}
                />
              ))}
              {!filtered.length && (
                <li className="font-sans" style={{ fontSize: '0.84rem', color: '#6a6a64', padding: '14px 2px' }}>
                  No route stops at “{query.trim()}”. Try an area name such as Miyapur, Uppal or Ameerpet.
                </li>
              )}
            </ul>
          </div>

          {/* ── Selected route ── */}
          {selected && (
            <div ref={detailRef} className="scroll-mt-24 min-w-0">
              <article
                aria-labelledby={`route-${selected.routeNumber}-heading`}
                style={{
                  background: '#fff', border: '1px solid #ece7de', borderRadius: 20,
                  padding: '18px 18px 20px', boxShadow: '0 12px 40px rgba(15,15,15,0.05)',
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono uppercase" style={{ fontSize: '0.62rem', letterSpacing: '0.18em', color: '#b5afa6' }}>
                      Route {String(selected.routeNumber).padStart(2, '0')}
                    </p>
                    <h3
                      id={`route-${selected.routeNumber}-heading`}
                      className="mt-1.5 font-sans font-extrabold"
                      style={{ fontSize: 'clamp(1.15rem,2.4vw,1.55rem)', lineHeight: 1.2, letterSpacing: '-0.02em', color: '#0f0f0f' }}
                    >
                      {selected.stops[0]} <span style={{ color: '#b5afa6' }}>→</span>{' '}
                      <span style={{ color: ORANGE }}>MLRIT</span>
                    </h3>
                    <p className="mt-1.5 font-sans" style={{ fontSize: '0.82rem', color: '#6a6a64' }}>
                      {selected.stops.length} stops
                      {km ? ` · approx. ${Math.round(km)} km by road` : ''}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <ContactPill label="Route Incharge" name={selected.inchargeName} contact={selected.inchargeContact} />
                    <ContactPill label="Driver" name={selected.driverName} contact={selected.driverContact} />
                  </div>
                </div>

                <div className="mt-5">
                  <TransportRouteMap route={selected} />
                </div>

                <p className="mt-4 flex items-start gap-2 font-sans" style={{ fontSize: '0.74rem', color: '#9d9b94', lineHeight: 1.5 }}>
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" aria-hidden="true" />
                  The map is an animated preview of the route, not live GPS tracking. Stop positions are
                  approximate — for pick-up timings, call the route incharge.
                </p>
              </article>
            </div>
          )}
        </div>

        {/* ── Transport incharges ── */}
        <div className="mt-10 md:mt-14 pt-8" style={{ borderTop: '1px solid #e4e0d7' }}>
          <h2 className="font-sans font-black mb-4" style={{ fontSize: 'clamp(1.2rem,2.4vw,1.6rem)', letterSpacing: '-0.025em', color: '#0f0f0f' }}>
            Transport Incharges
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: 'Mr. J Pradeep', phone: '97039 95722' },
              { name: 'Mr. Hanmandhulu', phone: '91604 04652' },
            ].map(({ name, phone }) => (
              <ContactPill key={name} label="Transport Incharge" name={name} contact={phone} />
            ))}
          </div>
          <p className="mt-5 font-sans" style={{ fontSize: '0.72rem', color: '#b5afa6' }}>
            Routes and contacts: mlrit.ac.in/campus-life/transport-facility/ · map geometry for this same bus
            network published at aims.ac.in/facilities/transport. Confirm current details with the transport office.
          </p>
        </div>
      </div>
    </section>
  );
}
