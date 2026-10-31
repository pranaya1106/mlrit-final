const fs = require('fs');
const geo = JSON.parse(fs.readFileSync('C:/mlrit-final/tmp/geo.json', 'utf8'));
const src = fs.readFileSync('C:/mlrit-final/lib/transport-routes.ts', 'utf8');

// MLRIT published spelling -> reference spelling for the same stop
const ALIAS = {
  'Chilakalaguda X Road': 'Chilkalguda X Roads',
  'Chilkalaguda X Roads': 'Chilkalguda X Roads',
  Vanasthalipuram: 'Vanasthalipuram (Panama)',
  'L B Nagar': 'L.B. Nagar',
  'Uppal X Road': 'Uppal X Roads',
  'Ring Road': 'Attapur Ring Road',
  Mahaveer: 'Mahavir',
  Lakdikapool: 'Lakdikapul',
  Khairathabad: 'Khairatabad',
  Punjagutta: 'Panjagutta',
  'Bharat Nagar': 'Bharath Nagar',
  Tankbund: 'Tank Bund',
  Dharmakaram: 'Dharam Karan Road',
  Fathenagar: 'Fatehnagar',
  'Balanagar X Road': 'Balanagar X Roads',
  Shahpur: 'Shapur',
  'Moti Nagar': 'Motinagar',
  Rahmatnagar: 'Rahmath Nagar',
  'Anand Bagh': 'Anandbagh',
  Chanderghat: 'Chaderghat',
  YMC: 'YMCA',
  'Narayanaguda X Road': 'Narayanaguda X Roads',
  'Lowe Tank Bund': 'Lower Tank Bund',
  'Image Hospital Hitech City': 'Image Hospital',
  JNTUH: 'JNTU',
  'Shapur X Road': 'Shapur X Roads',
  'Neredmet X Road': 'Neredmet X Roads',
  Lakadawla: 'Lakdawala',
  'Reliance Park': 'Reliance',
  'Nizampet X Road': 'Nizampet X Roads',
  'KPHB Road No.1': 'KPHB Road No. 1',
  Boduppla: 'Boduppal',
  Sangeetha: 'Sangeeth',
  'Pragathi Nagar Bus Stop': 'Pragathi Nagar',
  'Ganesh Nagar (Sha Theater)': 'Ganesh Nagar (Sha Theatre)',
  Ashoknagar: 'Ashok Nagar',
  Krishnareddypeta: 'Krishna Reddy Pet',
  Shambirpur: 'Shambipur',
};

const CAMPUS = [17.5918, 78.3873]; // MLRIT Dundigal, from components/MapEmbed.tsx
const AIMS = geo.coords.AIMS;

function dist(a, b) {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b[0] - a[0]) * toR, dLng = (b[1] - a[1]) * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * toR) * Math.cos(b[0] * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// parse MLRIT routes (number -> stops in travel order)
const routes = [];
let pos = src.indexOf('export const BUS_ROUTES');
const routesEnd = src.indexOf('export function', pos);
pos += 1;
while (pos < routesEnd) {
  const s = src.indexOf('routeNumber:', pos);
  if (s === -1 || s > routesEnd) break;
  const m = /routeNumber:\s*(\d+)/.exec(src.slice(s, s + 40));
  if (!m) { pos = s + 1; continue; }
  const num = +m[1];
  const ss = src.indexOf('stops: [', s);
  const o = src.indexOf('[', ss);
  let d = 0, e = -1;
  for (let k = o; k < src.length; k++) {
    const c = src[k];
    if (c === '[') d++;
    else if (c === ']') { d--; if (!d) { e = k; break; } }
  }
  const stops = [...src.slice(o, e + 1).matchAll(/'([^']*)'/g)].map((m) => m[1]);
  routes.push({ num, stops });
  pos = e + 1;
}

const stopPoints = {};
const unresolved = [];
for (const r of routes) {
  for (const name of r.stops) {
    if (name === 'MLRIT') continue;
    const key = geo.coords[name] ? name : ALIAS[name];
    if (!key || !geo.coords[key]) { unresolved.push(name); continue; }
    stopPoints[name] = geo.coords[key];
  }
}

// paths: [lng,lat] -> [lat,lng]; drop the AIMS-only approach leg, join to MLRIT
const paths = {};
const km = {};
const checks = [];
for (const { num } of routes) {
  const raw = geo.routes[num].pts.map(([lng, lat]) => [lat, lng]);
  let cut = raw.length;
  while (cut > 2 && dist(raw[cut - 1], AIMS) < 1.2) cut--;
  const path = raw.slice(0, cut).concat([CAMPUS]);
  paths[num] = path.map((p) => [+p[0].toFixed(5), +p[1].toFixed(5)]);
  km[num] = +path.reduce((a, p, i) => (i ? a + dist(path[i - 1], p) : 0), 0).toFixed(1);
  const first = routes.find((r) => r.num === num).stops[0];
  checks.push(`${num}: start->${first} ${dist(paths[num][0], stopPoints[first]).toFixed(2)}km, pts ${paths[num].length}, ${km[num]}km`);
}

const fmt = (o) =>
  Object.entries(o)
    .map(([k, v]) => `  ${/^\d+$/.test(k) ? k : JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join('\n');

const file = `// Route geometry for the campus transport map.
//
// Stop coordinates and road polylines are the values published on the MLR-group
// transport page (aims.ac.in/facilities/transport) for this same Dundigal bus
// network. Stop names follow MLRIT's published spellings; where the two sources
// transliterate a stop differently the reference point is aliased here.
// Polylines keep their published shape up to the campus approach, then join to
// MLRIT's own coordinates (components/MapEmbed.tsx). Positions are approximate —
// the page says so, and it is not live GPS.

export type LatLng = [number, number];

/** MLR Institute of Technology, Dundigal — the terminus of every route. */
export const CAMPUS: LatLng = ${JSON.stringify(CAMPUS)};

/** One coordinate per published stop name, in travel order on most routes. */
export const STOP_POINTS: Record<string, LatLng> = {
${fmt(stopPoints)}
};

/** Road geometry per route number, campus leg appended. */
export const ROUTE_PATHS: Record<number, LatLng[]> = {
${Object.keys(paths).sort((a, b) => +a - +b).map((n) => `  ${n}: [\n    ${paths[n].map((p) => JSON.stringify(p)).join(', ')}\n  ],`).join('\n')}
};

/** Approximate road distance per route, measured from the published geometry. */
export const ROUTE_KM: Record<number, number> = {
${Object.keys(km).sort((a, b) => +a - +b).map((n) => `  ${n}: ${km[n]},`).join('\n')}
};

export function routeKm(routeNumber: number): number | undefined {
  return ROUTE_KM[routeNumber];
}

export function stopPoint(name: string): LatLng | undefined {
  if (name === 'MLRIT') return CAMPUS;
  return STOP_POINTS[name];
}
`;

fs.writeFileSync('C:/mlrit-final/lib/transport-geo.ts', file);
console.log('stops mapped:', Object.keys(stopPoints).length, 'unresolved:', JSON.stringify(unresolved));
console.log('bytes:', file.length);
console.log(checks.slice(0, 8).join('\n'));
