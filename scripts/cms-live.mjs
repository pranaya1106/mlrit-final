#!/usr/bin/env node
/**
 * Converts a page's copy() calls to <Copy>, so its preview updates as the
 * editor types instead of only after a save.
 *
 *   node scripts/cms-live.mjs app/iqac/nba/page.tsx iqac/nba
 *
 * The server still resolves saved content; only the leaf that prints each
 * string becomes a client component. Pages keep their static rendering.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [file, sectionKey] = process.argv.slice(2);
if (!file || !sectionKey) {
  console.error('usage: cms-live.mjs <page.tsx> <page/section>');
  process.exit(1);
}

let s = readFileSync(file, 'utf8');
const before = (s.match(/\{copy\(/g) ?? []).length;
if (before === 0) {
  console.log(`${file}: no copy() calls`);
  process.exit(0);
}

// Single-line and wrapped forms, single- or double-quoted fallback.
const tag = (k, quote, body) => `<Copy k="${k}">{${quote}${body}${quote}}</Copy>`;
s = s.replace(/\{copy\(\s*'([^']+)',\s*'((?:[^'\\]|\\.)*)'\s*\)\}/gs, (_, k, v) => tag(k, "'", v));
s = s.replace(/\{copy\(\s*'([^']+)',\s*"((?:[^"\\]|\\.)*)"\s*\)\}/gs, (_, k, v) => tag(k, '"', v));

const after = (s.match(/\{copy\(/g) ?? []).length;

if (!s.includes("from '@/lib/content/live'")) {
  s = s.replace(
    /^(import .*?;\n)/m,
    `$1import { Copy, SectionContent } from '@/lib/content/live';\n`
  );
}

// Wrap the returned tree so <Copy> can read the saved content.
if (!s.includes('<SectionContent')) {
  s = s.replace(/\n  return \(\n    <>/, `\n  return (\n    <SectionContent sectionKey="${sectionKey}" content={c}>`);
  s = s.replace(/\n    <\/>\n  \);\n\}/, '\n    </SectionContent>\n  );\n}');
}

writeFileSync(file, s);
console.log(`${file}: ${before - after}/${before} converted${after ? ` — ${after} left (unusual shape)` : ''}`);
