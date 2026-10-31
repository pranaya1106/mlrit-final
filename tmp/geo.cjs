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

// 1. stop coordinate map
const st = s.indexOf('var fG={');
const i = s.indexOf('{', st);
const e = scanBalanced(s, i);
const coordsLit = s.slice(i, e + 1);
fs.writeFileSync('C:/mlrit-final/tmp/coords-lit.txt', coordsLit);
const coords = eval('(' + coordsLit + ')');
console.log('coords entries:', Object.keys(coords).length);
console.log('sample:', JSON.stringify(Object.entries(coords).slice(0, 3)));

// 2. dense polyline arrays: [[lng,lat],...] long runs
const re = /\[\s*\[-?\d+\.\d+,-?\d+\.\d+\]\s*,\s*\[-?\d+\.\d+,-?\d+\.\d+\]/g;
let m, hits = [];
while ((m = re.exec(s))) hits.push(m.index);
console.log('dense array starts:', hits.length);
for (const h of hits.slice(0, 40)) {
  const end = scanBalanced(s, h);
  const lit = s.slice(h, end + 1);
  const pts = eval(lit);
  const key = s.slice(Math.max(0, h - 90), h).replace(/\s+/g, ' ');
  console.log('len', String(pts.length).padStart(5), '| ctx:', key.slice(-80));
}
