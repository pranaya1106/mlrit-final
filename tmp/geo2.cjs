const fs = require('fs');
const s = fs.readFileSync('C:/mlrit-final/tmp/tp.js', 'utf8');

function scanBalanced(str, openIdx) {
  let d = 0, inStr = false, q = '';
  for (let k = openIdx; k < str.length; k++) {
    const c = str[k];
    if (inStr) { if (c === q && str[k - 1] !== '\\') inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; q = c; continue; }
    if (c === '{' || c === '[') d++;
    else if (c === '}' || c === ']') { d--; if (d === 0) return k; }
  }
  return -1;
}

const st = s.indexOf('var fG={');
const ci = s.indexOf('{', st);
const coords = eval('(' + s.slice(ci, scanBalanced(s, ci) + 1) + ')');

// per-route polylines live in `mG={1:[...],2:[...]}`
const mg = s.indexOf('mG={');
const mi = s.indexOf('{', mg);
const polylines = eval('(' + s.slice(mi, scanBalanced(s, mi) + 1) + ')');

// Douglas–Peucker simplification on [lng,lat]
function perp(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  let max = -1, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perp(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) { max = d; idx = i; }
  }
  if (max > eps) {
    const a = dp(pts.slice(0, idx + 1), eps);
    const b = dp(pts.slice(idx), eps);
    return a.slice(0, -1).concat(b);
  }
  return [pts[0], pts[pts.length - 1]];
}
function haversine(a, b) {
  const R = 6371, toR = Math.PI / 180;
  const dLat = (b[1] - a[1]) * toR, dLng = (b[0] - a[0]) * toR;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * toR) * Math.cos(b[1] * toR) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const km = (pts) => pts.reduce((acc, p, i) => (i ? acc + haversine(pts[i - 1], p) : 0), 0);

const out = {};
for (const [n, pts] of Object.entries(polylines)) {
  const full = km(pts);
  const simp = dp(pts, 0.00035).map((p) => [+p[0].toFixed(5), +p[1].toFixed(5)]);
  out[n] = { raw: pts.length, simp: simp.length, km: +full.toFixed(1), pts: simp };
}
fs.writeFileSync('C:/mlrit-final/tmp/geo.json', JSON.stringify({ coords, routes: out }, null, 0));

// coverage against MLRIT's published stop names
const src = fs.readFileSync('C:/mlrit-final/lib/transport-routes.ts', 'utf8');
const names = new Set(Object.keys(coords));
const block = src.slice(src.indexOf('export const BUS_ROUTES'));
const rows = [...block.matchAll(/routeNumber:\s*(\d+),[\s\S]*?stops:\s*\[([\s\S]*?)\]/g)];
const missing = new Map();
let total = 0;
for (const r of rows) {
  const stops = r[2].split(/',\s*'/).map((x) => x.replace(/^'|'$/g, '').trim());
  for (const stop of stops) {
    total++;
    if (!names.has(stop) && stop !== 'MLRIT') {
      missing.set(stop, (missing.get(stop) || 0) + 1);
    }
  }
}
console.log('routes parsed', rows.length, 'stop refs', total, 'coord table', names.size);
console.log('MISSING coords for:', JSON.stringify([...missing.keys()], null, 1));
console.log('sample km:', Object.entries(out).slice(0, 5).map(([k, v]) => `${k}:${v.km}km ${v.raw}->${v.simp}pts`).join(' '));
console.log('total simplified points:', Object.values(out).reduce((a, v) => a + v.simp, 0));
