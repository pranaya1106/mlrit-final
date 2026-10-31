const { chromium } = require('playwright');

const URL = 'http://localhost:3000/campus/transport';

const state = (p) => p.evaluate(() => {
  const slider = document.querySelector('.tp-range');
  const pins = [...document.querySelectorAll('.leaflet-marker-icon')];
  const passed = pins.filter((el) => (el.innerHTML || '').includes('#e85d04')).length;
  const cur = document.querySelector('#routes ol li button[aria-current="step"]');
  const bus = document.querySelector('.leaflet-marker-icon[title*="bus preview"]');
  return {
    t: Number(slider?.value ?? -1),
    passedPins: passed,
    live: document.querySelector('#routes p[role="status"]')?.textContent?.trim(),
    currentStop: cur?.textContent?.trim(),
    busAt: bus ? (bus.style.transform || '').replace(/translate3d\(([-\d.]+)px, ([-\d.]+)px.*/, '$1,$2') : null,
    pins: pins.length,
  };
});

const log = (k, v) => console.log(k.padEnd(30), JSON.stringify(v));

(async () => {
  const b = await chromium.launch();
  const errs = [];
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message.slice(0, 200)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 200)); });

  await p.goto(URL, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await p.waitForSelector('.leaflet-marker-icon', { timeout: 60000 });
  await p.waitForTimeout(1500);

  log('1 initial', await state(p));

  // ── play at 10x ──
  await p.getByRole('button', { name: '10x' }).click();
  await p.getByRole('button', { name: 'Play the route preview' }).click();
  await p.waitForTimeout(2500);
  const mid = await state(p);
  log('2 after 2.5s @10x', mid);
  await p.screenshot({ path: 'C:/mlrit-final/tmp/anim-playing.png', timeout: 90000, animations: 'disabled' });

  await p.getByRole('button', { name: 'Pause the route preview' }).click();
  const a = await state(p);
  await p.waitForTimeout(1200);
  const bb = await state(p);
  log('3 pause holds', { before: a.t, after: bb.t, moved: bb.t !== a.t });

  // ── next / prev stop ──
  await p.getByRole('button', { name: 'Next stop' }).click();
  await p.waitForTimeout(300);
  const n1 = await state(p);
  await p.getByRole('button', { name: 'Previous stop' }).click();
  await p.waitForTimeout(300);
  const n2 = await state(p);
  log('4 next then prev', { afterNext: n1.currentStop, afterPrev: n2.currentStop });

  // ── jump from the stop grid ──
  await p.locator('#routes ol li button').nth(7).click();
  await p.waitForTimeout(400);
  log('5 clicked stop #8', await state(p));

  // ── scrub to the end ──
  await p.locator('.tp-range').evaluate((el) => {
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
    set.call(el, '1000');
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await p.waitForTimeout(400);
  log('6 scrubbed to end', await state(p));
  await p.screenshot({ path: 'C:/mlrit-final/tmp/anim-end.png', timeout: 90000, animations: 'disabled' });

  // ── switch route ──
  const pinsBefore = (await state(p)).pins;
  await p.locator('#routes li button').filter({ hasText: 'Lothkunta' }).first().click();
  await p.waitForTimeout(1500);
  const sw = await state(p);
  log('7 route switch', { pinsBefore, pinsAfter: sw.pins, live: sw.live, t: sw.t });

  // ── search + keyboard nav ──
  await p.fill('#route-search', 'miyapur');
  await p.waitForTimeout(500);
  const count = await p.locator('#routes li button').count();
  await p.locator('#routes li button').first().focus();
  await p.keyboard.press('ArrowDown');
  const focused = await p.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 40));
  log('8 search+arrows', { matches: count, focused });
  await p.locator('#route-search').focus();
  await p.keyboard.press('Escape');
  await p.waitForTimeout(300);
  log('   after escape', await p.locator('#routes li').count());

  // ── reduced motion ──
  const ctx = await b.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const rp = await ctx.newPage();
  rp.on('pageerror', (e) => errs.push('[reduced] PAGEERROR ' + e.message.slice(0, 200)));
  await rp.goto(URL, { waitUntil: 'domcontentloaded', timeout: 180000 });
  await rp.waitForSelector('.leaflet-marker-icon', { timeout: 60000 });
  await rp.waitForTimeout(1200);
  const r0 = await state(rp);
  await rp.getByRole('button', { name: 'Move the preview to the next stop' }).click();
  await rp.waitForTimeout(600);
  const r1 = await state(rp);
  await rp.waitForTimeout(1500);
  const r2 = await state(rp);
  log('9 reduced motion', { start: r0.currentStop, stepped: r1.currentStop, stillThere: r2.currentStop });
  await ctx.close();

  console.log('ERRORS:', errs.length ? errs.slice(0, 6) : 'none');
  await b.close();
})();
