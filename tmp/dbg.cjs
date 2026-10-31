const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  const warns = [];
  p.on('console', (m) => { const t = m.text(); if (t.includes('hydrat') || t.includes('Hydrat')) warns.push(t.slice(0, 2000)); });
  await p.goto('http://localhost:3000/campus/transport', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(5000);
  await p.locator('#routes').scrollIntoViewIfNeeded();
  await p.waitForTimeout(2500);

  const wide = await p.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll('#routes *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 1 || r.width > vw + 1) {
        bad.push({
          tag: el.tagName.toLowerCase(),
          cls: (typeof el.className === 'string' ? el.className : '').slice(0, 50),
          w: Math.round(r.width), right: Math.round(r.right),
          txt: (el.textContent || '').trim().slice(0, 34),
        });
      }
    });
    return { vw, scrollW: document.documentElement.scrollWidth, bad: bad.slice(0, 12) };
  });
  console.log(JSON.stringify(wide, null, 1));
  console.log('HYDRATION:', warns.slice(0, 2).join('\n=====\n') || 'none');
  await b.close();
})();
