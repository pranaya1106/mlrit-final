const fs = require('fs');
const s = fs.readFileSync('tmp/tp.js', 'utf8');
const a = Number(process.argv[2] || 1980000), b = Number(process.argv[3] || 2035000);
const seg = s.slice(a, b);

const cls = new Set();
const re = /["`]([^"`]{3,400})["`]/g;
let m;
while ((m = re.exec(seg))) {
  const t = m[1].replace(/\s+/g, ' ').trim();
  if (/\b(transition|animate-|duration-|ease-|hover:|group-|scale-|pulse|bounce|spin|fade|slide|translate)/.test(t)) cls.add(t);
}
console.log('=== tailwind-ish class strings:', cls.size);
[...cls].slice(0, 80).forEach((t) => console.log(' •', t.slice(0, 220)));

console.log('\n=== inline style transitions:');
for (const x of seg.matchAll(/transition\s*:\s*[^,}\n]{1,120}/g)) console.log(' •', x[0].trim());
for (const x of seg.matchAll(/transform\s*:\s*[^,}\n]{1,120}/g)) console.log(' •', x[0].trim());

console.log('\n=== rAF / timers:');
for (const x of seg.matchAll(/.{160}(requestAnimationFrame|setInterval|setTimeout).{240}/g))
  console.log(' ---', x[0].replace(/\s+/g, ' '));
