const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  for (const rm of ['reduce', 'no-preference']) {
    const ctx = await b.newContext({ reducedMotion: rm, viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto('http://localhost:3000/campus/transport', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await p.waitForSelector('.leaflet-marker-icon', { timeout: 60000 });
    await p.waitForTimeout(2000);
    const labels = await p.evaluate(() => [...document.querySelectorAll('.tp-range')].map((el) => {
      const row = el.parentElement;
      return [...row.querySelectorAll('button')].map((x) => x.getAttribute('aria-label'));
    }));
    console.log(rm, JSON.stringify(labels));
    await ctx.close();
  }
  await b.close();
})();
