const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [w, h, n] of [[1440, 900, 'desktop'], [390, 844, 'mobile']]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    p.on('pageerror', (e) => errs.push(`[${n}] PAGEERROR ${e.message}`));
    p.on('console', (m) => { if (m.type() === 'error') errs.push(`[${n}] ${m.text().slice(0, 160)}`); });
    await p.goto('http://localhost:3000/campus/transport', { waitUntil: 'domcontentloaded', timeout: 180000 });
    await p.waitForTimeout(4000);
    await p.screenshot({ path: `C:/mlrit-final/tmp/n-${n}-hero.png`, timeout: 90000, animations: 'disabled' });
    await p.locator('#routes').scrollIntoViewIfNeeded();
    await p.waitForTimeout(2500);
    await p.screenshot({ path: `C:/mlrit-final/tmp/n-${n}-explorer.png`, timeout: 90000, animations: 'disabled' });

    const info = await p.evaluate(() => ({
      tiles: document.querySelectorAll('.leaflet-tile-loaded').length,
      pins: document.querySelectorAll('.leaflet-marker-icon').length,
      paths: document.querySelectorAll('path.leaflet-interactive').length,
      zoom: !!document.querySelector('.leaflet-control-zoom-in'),
      attrib: !!document.querySelector('.leaflet-control-attribution'),
      stops: document.querySelectorAll('#routes ol li').length,
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    }));
    console.log(n, JSON.stringify(info));
    await p.close();
  }
  console.log('ERRORS:', errs.length ? errs.slice(0, 8) : 'none');
  await b.close();
})();
