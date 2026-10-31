const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => console.log('PAGEERROR', e.message.slice(0, 1500)));
  p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text().slice(0, 1500)); });
  p.on('requestfailed', (r) => console.log('REQFAIL', r.url().slice(0, 160)));
  p.on('response', (r) => { if (r.status() >= 400) console.log('HTTP', r.status(), r.url().slice(0, 160)); });
  await p.goto('http://localhost:3000/campus/transport', { waitUntil: 'domcontentloaded', timeout: 180000 });
  await p.waitForTimeout(6000);
  await b.close();
})();
