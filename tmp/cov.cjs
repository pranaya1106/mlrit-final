const fs = require('fs');
const geo = JSON.parse(fs.readFileSync('C:/mlrit-final/tmp/geo.json', 'utf8'));
const src = fs.readFileSync('C:/mlrit-final/lib/transport-routes.ts', 'utf8');

const names = new Set(Object.keys(geo.coords));
const out = [];
let pos = 0;
while (true) {
  const s = src.indexOf('stops: [', pos);
  if (s === -1) break;
  const open = src.indexOf('[', s);
  let d = 0, end = -1, inStr = false, q = '';
  for (let k = open; k < src.length; k++) {
    const c = src[k];
    if (inStr) { if (c === q && src[k - 1] !== '\\') inStr = false; continue; }
    if (c === '"' || c === "'") { inStr = true; q = c; continue; }
    if (c === '[') d++;
    else if (c === ']') { d--; if (d === 0) { end = k; break; } }
  }
  const body = src.slice(open, end + 1);
  const stops = [...body.matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2]);
  out.push(stops);
  pos = end + 1;
}

const totalStops = out.reduce((a, r) => a + r.length, 0);
const missing = new Map();
for (const stops of out) for (const stop of stops) {
  if (stop === 'MLRIT') continue;
  if (!names.has(stop)) missing.set(stop, (missing.get(stop) || 0) + 1);
}
console.log('route arrays:', out.length, 'total stop refs:', totalStops);
console.log('distinct missing:', missing.size);
console.log(JSON.stringify([...missing.entries()], null, 1));

// near-miss suggestions
const keys = [...names];
for (const m of missing.keys()) {
  const cand = keys.filter((k) => k.toLowerCase().includes(m.split(/[ (]/)[0].toLowerCase().slice(0, 6)));
  if (cand.length) console.log('?', m, '->', cand.slice(0, 4).join(' | '));
}
