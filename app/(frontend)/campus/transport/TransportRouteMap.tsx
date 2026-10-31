'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import type { BusRoute } from '@/lib/transport-routes';
import { ROUTE_PATHS, stopPoint, type LatLng } from '@/lib/transport-geo';

type Leaflet = typeof import('leaflet');

const INK = '#0c0c0e';
const ORANGE = '#e85d04';
const MUTED = '#9d9b94';
const BASE_MS = 42000; // one full route at 1x
const SPEEDS = [1, 2, 5, 10];

/** framer-motion's hook freezes the value at first render, so it can miss the
    preference during hydration; this tracks the media query live. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return reduced;
}

const PIN = (n: number, passed: boolean) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;` +
  `background:${passed ? ORANGE : '#fff'};color:${passed ? '#fff' : INK};border:1.5px solid ${passed ? ORANGE : 'rgba(12,12,14,0.35)'};` +
  `font:700 10px/1 var(--font-mono), ui-monospace, monospace;box-shadow:0 1px 4px rgba(0,0,0,0.25)">${n}</span>`;

const BUS_PIN =
  '<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:' + INK +
  ';box-shadow:0 2px 8px rgba(0,0,0,0.35)"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" ' +
  'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 6v6M16 6v6M2 12h19.5M4 6h16a2 2 0 0 1 2 2v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a2 2 0 0 1 2-2Z"/><path d="M6 18h12" stroke="#f7a45c"/></svg></span>';

function distance(a: LatLng, b: LatLng) {
  const R = 6371000, toR = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toR, dLng = (b[1] - a[1]) * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function geometry(route: BusRoute) {
  const path = (ROUTE_PATHS[route.routeNumber] ?? []) as LatLng[];
  const stops = route.stops.map((name) => stopPoint(name)).filter((p): p is LatLng => !!p);

  const cum: number[] = [0];
  for (let i = 1; i < path.length; i++) cum.push(cum[i - 1] + distance(path[i - 1], path[i]));
  const total = cum[cum.length - 1] || 1;

  // Each stop pins to the first polyline vertex at or after the previous stop's
  // vertex, so travel order can never fold back along the line.
  const offsets: number[] = [];
  let cursor = 0;
  for (const s of stops) {
    let best = cursor, bestD = Infinity;
    for (let i = cursor; i < path.length; i++) {
      const d = distance(path[i], s);
      if (d < bestD) { bestD = d; best = i; }
    }
    offsets.push(cum[best] / total);
    cursor = best;
  }
  return { path, stops, cum, total, offsets };
}

function pointAt(geo: ReturnType<typeof geometry>, t: number): LatLng {
  const target = t * geo.total;
  let i = 1;
  while (i < geo.cum.length - 1 && geo.cum[i] < target) i++;
  const a = geo.path[i - 1], b = geo.path[i];
  const span = geo.cum[i] - geo.cum[i - 1] || 1;
  const f = Math.min(Math.max((target - geo.cum[i - 1]) / span, 0), 1);
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

export default function TransportRouteMap({ route }: { route: BusRoute }) {
  const prefersReduced = usePrefersReducedMotion();
  const hostRef = useRef<HTMLDivElement>(null);
  const LRef = useRef<Leaflet | null>(null);
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const layerRef = useRef<import('leaflet').LayerGroup | null>(null);
  const pinsRef = useRef<import('leaflet').Marker[]>([]);
  const busRef = useRef<import('leaflet').Marker | null>(null);
  const geoRef = useRef<ReturnType<typeof geometry> | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef(0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [atStop, setAtStop] = useState(0);

  const geo = useMemo(() => geometry(route), [route]);

  // ── leaflet is browser-only: load it after mount ──
  useEffect(() => {
    let cancelled = false;
    import('leaflet').then((mod) => {
      const L = (mod.default ?? mod) as unknown as Leaflet;
      if (cancelled || !hostRef.current) return;
      LRef.current = L;
      const map = L.map(hostRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
      });
      L.control.zoom({ position: 'topright' }).addTo(map);
      // OpenStreetMap's own tile server — same source the campus MapEmbed uses,
      // and unlike CARTO's basemaps it needs no API key.
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      pinsRef.current = [];
      busRef.current = null;
    };
  }, []);

  // ── with reduced motion the preview is stepped, never panned around ──
  useEffect(() => {
    const dragging = mapRef.current?.dragging;
    if (!ready || !dragging) return;
    prefersReduced ? dragging.disable() : dragging.enable();
  }, [ready, prefersReduced]);

  // ── draw the selected route ──
  useEffect(() => {
    const L = LRef.current;
    const map = mapRef.current;
    const group = layerRef.current;
    if (!L || !map || !group || !ready || geo.path.length < 2) return;
    geoRef.current = geo;
    group.clearLayers();
    pinsRef.current = [];

    group.addLayer(L.polyline(geo.path, { color: INK, weight: 6, opacity: 0.18, lineJoin: 'round' }));
    const ink = L.polyline(geo.path, { color: ORANGE, weight: 4, opacity: 0.95, lineJoin: 'round' });
    group.addLayer(ink);
    map.fitBounds(ink.getBounds(), { padding: [36, 36] });

    pinsRef.current = geo.stops.map((pos, i) =>
      L.marker(pos, {
        icon: L.divIcon({ className: '', html: PIN(i + 1, i === 0), iconSize: [22, 22], iconAnchor: [11, 11] }),
        title: `${i + 1}. ${route.stops[i]}`,
        alt: `${route.stops[i]}, stop ${i + 1} of ${route.stops.length}`,
        keyboard: true,
      }).addTo(group)
    );
    busRef.current = L.marker(geo.path[0], {
      icon: L.divIcon({ className: '', html: BUS_PIN, iconSize: [26, 26], iconAnchor: [13, 13] }),
      zIndexOffset: 1000,
      interactive: false,
      title: `Route ${route.routeNumber} bus preview`,
      alt: `Animated preview marker for Route ${route.routeNumber}`,
    }).addTo(group);

    setAtStop(0);
    setPlaying(false);
    if (sliderRef.current) sliderRef.current.value = '0';
  }, [geo, ready, route]);

  // ── pins light up as the bus reaches them ──
  useEffect(() => {
    const L = LRef.current;
    if (!L) return;
    pinsRef.current.forEach((marker, i) => {
      marker.setIcon(L.divIcon({ className: '', html: PIN(i + 1, i <= atStop), iconSize: [22, 22], iconAnchor: [11, 11] }));
    });
  }, [atStop, ready]);

  const paint = (t: number, forceStop?: number) => {
    const g = geoRef.current;
    if (!g || !busRef.current) return;
    busRef.current.setLatLng(pointAt(g, t));
    if (sliderRef.current) sliderRef.current.value = String(Math.round(t * 1000));
    // Two nearby stops can project onto the same point of the road polyline; an
    // explicit jump must win over the geometric reading of that position.
    const reached = forceStop ?? g.offsets.reduce((acc, o, i) => (t + 1e-4 >= o ? i : acc), 0);
    setAtStop((cur) => (cur === reached ? cur : reached));
  };

  // ── playback ──
  useEffect(() => {
    if (!playing || prefersReduced) return;
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = now - lastRef.current;
      lastRef.current = now;
      const t = Math.min(Number(sliderRef.current?.value ?? 0) / 1000 + (dt * speed) / BASE_MS, 1);
      paint(t);
      if (t >= 1) { setPlaying(false); return; }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing, speed, prefersReduced]);

  const jumpToStop = (i: number) => {
    const g = geoRef.current;
    if (!g) return;
    const clamped = Math.min(Math.max(i, 0), g.stops.length - 1);
    setAtStop(clamped);
    paint(g.offsets[clamped], clamped);
  };

  const onPlay = () => {
    if (prefersReduced) {
      jumpToStop(atStop + 1 >= route.stops.length ? 0 : atStop + 1);
      return;
    }
    if (Number(sliderRef.current?.value ?? 0) >= 995) paint(0);
    setPlaying((p) => !p);
  };

  const hasMap = geo.path.length > 1;

  return (
    <div>
      {hasMap && (
        <div className="relative" style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e8e3d9' }}>
          <div ref={hostRef} style={{ height: 'clamp(300px, 42vh, 440px)', background: '#eef0f2' }} />
          <div
            className="pointer-events-none absolute left-3 top-3 z-[500] font-sans font-semibold"
            style={{
              background: 'rgba(255,255,255,0.94)', border: '1px solid #e8e3d9', borderRadius: 999,
              padding: '6px 12px', fontSize: '0.74rem', color: INK, boxShadow: '0 2px 10px rgba(0,0,0,0.10)',
            }}
          >
            Starts at <span style={{ color: MUTED }}>:</span> {route.stops[0]}
          </div>
        </div>
      )}

      {/* ── playback ── */}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          aria-label={prefersReduced ? 'Move the preview to the next stop' : playing ? 'Pause the route preview' : 'Play the route preview'}
          className="flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          style={{ width: 38, height: 38, borderRadius: '50%', background: INK, border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          {prefersReduced ? (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 4l10 8-10 8V4zM19 5v14" />
            </svg>
          ) : playing ? (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          )}
        </button>

        <input
          ref={sliderRef}
          type="range"
          min={0}
          max={1000}
          defaultValue={0}
          aria-label="Position along the route"
          onChange={(e) => { setPlaying(false); paint(Number(e.target.value) / 1000); }}
          className="tp-range flex-1 basis-full order-last min-w-[120px] sm:order-none sm:basis-auto"
        />

        <div className="flex items-center gap-1.5" role="group" aria-label="Preview speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              aria-pressed={speed === s}
              className="font-mono transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{
                fontSize: '0.66rem', padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
                background: speed === s ? ORANGE : '#fff',
                color: speed === s ? '#fff' : '#6a6a64',
                border: `1px solid ${speed === s ? ORANGE : '#e4e0d7'}`,
              }}
            >
              {s}x
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5" role="group" aria-label="Stop navigation">
          {[
            { label: 'Previous stop', d: 'M19 20L9 12l10-8v16zM5 19V5', act: () => jumpToStop(atStop - 1) },
            { label: 'Next stop', d: 'M5 4l10 8-10 8V4zM19 5v14', act: () => jumpToStop(atStop + 1) },
          ].map(({ label, d, act }) => (
            <button
              key={label}
              type="button"
              onClick={act}
              aria-label={label}
              className="flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              style={{ width: 30, height: 30, borderRadius: 8, background: '#fff', border: '1px solid #e4e0d7', cursor: 'pointer' }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
            </button>
          ))}
        </div>
      </div>

      {/* ── stop list ── */}
      <p className="sr-only" role="status" aria-live="polite">
        {`Stop ${atStop + 1} of ${route.stops.length}: ${route.stops[atStop]}`}
      </p>
      <ol className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {route.stops.map((stop, i) => {
          const active = i === atStop;
          const passed = i < atStop;
          return (
            <li key={`${route.id}-g-${i}`}>
              <button
                type="button"
                onClick={() => { setPlaying(false); jumpToStop(i); }}
                aria-current={active ? 'step' : undefined}
                className="flex w-full items-center gap-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                style={{
                  padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
                  background: active ? INK : passed ? 'rgba(232,93,4,0.06)' : '#fff',
                  border: `1px solid ${active ? INK : passed ? 'rgba(232,93,4,0.28)' : '#eee9e0'}`,
                }}
              >
                <span
                  className="font-mono flex-shrink-0"
                  style={{
                    fontSize: '0.62rem', width: 20, height: 20, borderRadius: '50%',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    background: active ? ORANGE : passed ? 'rgba(232,93,4,0.14)' : '#f4f1ea',
                    color: active ? '#fff' : passed ? ORANGE : MUTED,
                  }}
                >
                  {i + 1}
                </span>
                <span
                  className="truncate font-sans"
                  style={{ fontSize: '0.78rem', color: active ? '#fff' : '#0f0f0f', fontWeight: active ? 700 : 500 }}
                >
                  {stop}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <style>{`
        .tp-range { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 999px;
          background: #e4e0d7; outline: none; }
        .tp-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 14px; height: 14px;
          border-radius: 50%; background: ${ORANGE}; border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,.3); cursor: pointer; }
        .tp-range::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: ${ORANGE};
          border: 2px solid #fff; cursor: pointer; }
        .tp-range:focus-visible { box-shadow: 0 0 0 3px rgba(232,93,4,.35); }
        .leaflet-container { font-family: var(--font-sans), ui-sans-serif, system-ui, sans-serif; background: #eef0f2; }
        /* Mute OSM's palette so the route line and pins stay the loudest thing on the map. */
        .leaflet-tile-pane { filter: saturate(0.18) contrast(0.92) brightness(1.04); }
        .leaflet-control-zoom a { color: ${INK} !important; }
        .leaflet-control-attribution { font-size: 10px !important; background: rgba(255,255,255,.72) !important; }
      `}</style>
    </div>
  );
}
