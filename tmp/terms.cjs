const fs = require('fs');
const s = fs.readFileSync('tmp/tp.js', 'utf8');
const a = Number(process.argv[2]), b = Number(process.argv[3]);
const seg = s.slice(a, b);
const terms = process.argv.slice(4);
for (const t of terms) {
  const re = new RegExp('.{0,140}' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '.{0,220}', 'g');
  const found = [...seg.matchAll(re)].map((m) => m[0].replace(/\s+/g, ' '));
  console.log('\n##### ' + t + '  (' + found.length + ')');
  const seen = new Set();
  found.forEach((f) => { if (!seen.has(f.slice(0, 60))) { seen.add(f.slice(0, 60)); console.log('  •', f.slice(0, 340)); } });
}
