import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const layout = read('../app/(frontend)/layout.tsx');
const globals = read('../app/(frontend)/globals.css');
const tailwind = read('../tailwind.config.ts');
const devScript = read('../scripts/dev-all.mjs');

test('loads the October 5 font families through next/font on the root layout', () => {
  assert.match(layout, /from 'next\/font\/google'/);
  assert.match(layout, /Manrope\(\{[\s\S]*?variable: '--font-manrope'/);
  assert.match(layout, /Playfair_Display\(\{[\s\S]*?variable: '--font-playfair'/);
  assert.match(layout, /JetBrains_Mono\(\{[\s\S]*?variable: '--font-mono'/);
  assert.match(layout, /className=\{`\$\{manrope\.variable\} \$\{playfair\.variable\} \$\{jetbrains\.variable\}`\}/);
});

test('Tailwind utilities consume the same font variables as global styles', () => {
  assert.match(tailwind, /sans:\s+\['var\(--font-manrope\)'/);
  assert.match(tailwind, /display:\s+\['var\(--font-playfair\)'/);
  assert.match(tailwind, /mono:\s+\['var\(--font-mono\)'/);
  assert.match(globals, /font-family:\s*var\(--font-manrope\)/);
  assert.doesNotMatch(globals, /@import\s+url\(['"]?\/fonts\/|@font-face/);
});

test('development startup never deletes a live Next.js build cache', () => {
  assert.doesNotMatch(devScript, /rmSync\(\s*['"]\.next['"]/);
});
