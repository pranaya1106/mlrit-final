const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 300)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  await p.goto('http://localhost:3000/campus/transport', { waitUntil: 'domcontentloaded', timeout: 180000 });
  await p.waitForSelector('.leaflet-marker-icon', { timeout: 60000 });
  await p.waitForTimeout(2000);
  const out = await p.evaluate(() => ({
    mq: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    labels: [...document.querySelectorAll('#routes button[aria-label]')].map((el) => el.getAttribute('aria-label')).slice(0, 12),
    markers: document.querySelectorAll('.leaflet-marker-icon').length,
    tiles: document.querySelectorAll('.leaflet-tile-loaded').length,
  }));
  console.log(JSON.stringify(out, null, 1));
  console.log('ERRORS:', errs.length ? errs.slice(0, 4) : 'none');
  await b.close();
})();
