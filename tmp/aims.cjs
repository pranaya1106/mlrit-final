const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('https://aims.ac.in/facilities/transport', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(6000);

  const h = await p.evaluate(() => document.body.scrollHeight);
  console.log('scrollHeight', h, 'title', await p.title());

  const bands = [[0, 'a-hero'], [900, 'b-list'], [1750, 'c-detail'], [2600, 'd-map'], [3300, 'e-playback'], [4000, 'f-stops']];
  for (const [y, name] of bands) {
    await p.evaluate((v) => window.scrollTo(0, v), y);
    await p.waitForTimeout(900);
    await p.screenshot({ path: `C:/mlrit-final/tmp/aims-${name}.png` });
  }

  // structural outline of the transport section
  const outline = await p.evaluate(() => {
    const out = [];
    const walk = (el, depth) => {
      if (depth > 7) return;
      for (const c of el.children) {
        const tag = c.tagName.toLowerCase();
        if (['script', 'style', 'svg', 'path', 'canvas', 'img'].includes(tag)) continue;
        const txt = (c.childNodes.length && [...c.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 60));
        const cls = typeof c.className === 'string' ? c.className.replace(/\s+/g, '.').slice(0, 90) : '';
        out.push(`${'  '.repeat(depth)}${tag}${cls ? '.' + cls : ''}${txt ? ' :: ' + txt : ''}`);
        walk(c, depth + 1);
      }
    };
    const main = document.querySelector('main') || document.body;
    walk(main, 0);
    return out.slice(0, 260).join('\n');
  });
  fs.writeFileSync('C:/mlrit-final/tmp/aims-outline.txt', outline);

  const styles = await p.evaluate(() => {
    const pick = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const s = getComputedStyle(el);
      return { sel, bg: s.backgroundColor, color: s.color, radius: s.borderRadius, border: s.border, font: s.fontFamily.slice(0, 40), size: s.fontSize, weight: s.fontWeight };
    };
    return [pick('main'), pick('h1'), pick('section'), pick('button'), pick('input'), pick('a[href^="tel"]')].filter(Boolean);
  });
  console.log(JSON.stringify(styles, null, 1));
  console.log('OUTLINE LINES', outline.split('\n').length);
  await b.close();
})();
