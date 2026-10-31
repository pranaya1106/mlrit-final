const fs = require('fs');
const s = fs.readFileSync('tmp/tp.js', 'utf8');
const needle = process.argv[2];
const span = Number(process.argv[3] || 700);
let i = -1;
const hits = [];
while ((i = s.indexOf(needle, i + 1)) !== -1) hits.push(i);
console.log('hits for', JSON.stringify(needle), ':', hits.length, hits.slice(0, 12));
for (const h of hits.slice(0, Number(process.argv[4] || 4))) {
  console.log('\n===== @' + h);
  console.log(s.slice(Math.max(0, h - span), h + span).replace(/\s+/g, ' '));
}
