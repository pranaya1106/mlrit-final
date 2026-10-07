#!/usr/bin/env node
/**
 * Flags user-visible text in a page that is still hardcoded.
 *
 * Wiring a page by reading it and spotting the strings does not scale — the
 * placements statistics page shipped with its list editable and the heading
 * above it still baked in. This re-reads the file and reports what a human
 * would see on screen but cannot edit.
 *
 * Heuristic, deliberately: it reports candidates, it does not prove absence.
 * Anything inside copy()/asText()/a *_LIVE list is treated as already wired.
 *
 *   node scripts/cms-audit.mjs app/placements/statistics/page.tsx
 *   node scripts/cms-audit.mjs            # every page that reads the CMS
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const SKIP_ATTR =
  /^(\w*[Cc]lassName|style|href|src|id|key|alt|aria-hidden|aria-label|type|rel|target|width|height|viewBox|fill|stroke|d|preserveAspectRatio|download|variant|tone|preset|delay|active|name|property|content)$/;
// PageHeader's copy is editable through site/page-headers, keyed by route, so
// the literals at the call site are fallbacks rather than unwired content.
// `k` and `sectionKey` on <Copy>/<SectionContent> are field identifiers, not
// copy — flagging them reported a page as unwired precisely because it had
// been wired.
const PAGE_HEADER_ATTR = /^(eyebrow|title|italic|dek|k|sectionKey)$/;
// Not prose: css values, paths, single tokens, numbers, entities.
const NOISE = /^(\s*|[\d\s.,%+–—-]*|#[0-9a-f]{3,8}|\/[^\s]*|https?:\/\/\S+|[a-z-]+|[A-Z_]+|&[a-z]+;)$/;

function audit(file) {
  const src = readFileSync(file, 'utf8');
  const findings = [];

  // Text nodes are matched over the whole file, not line by line: a paragraph
  // wrapped across several lines is still one string a visitor reads, and a
  // per-line scan walks straight past it — which it did, on three paragraphs
  // of the IQAC overview.
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  const lineOf = (index) => stripped.slice(0, index).split('\n').length;

  // Same guard as cms-wire: `=>` is not a tag, and a run containing code
  // punctuation is not prose.
  const CODE = /[;=(){}[\]]|=>|\breturn\b|\bconst\b/;
  for (const m of stripped.matchAll(/(.)>([^<>{}]+)</g)) {
    if (m[1] === '=' || CODE.test(m[2])) continue;
    const t = m[2].replace(/\s+/g, ' ').trim();
    if (t.length > 2 && !NOISE.test(t) && /[a-z]{3}/i.test(t)) {
      findings.push({ n: lineOf(m.index), kind: 'text', t });
    }
  }

  src.split('\n').forEach((line, i) => {
    const n = i + 1;
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;

    // String-valued props that render as copy
    for (const m of line.matchAll(/\b([a-zA-Z-]+)="([^"]{3,})"/g)) {
      const [, attr, val] = m;
      if (SKIP_ATTR.test(attr) || PAGE_HEADER_ATTR.test(attr)) continue;
      if (NOISE.test(val) || !/[a-z]{3}/i.test(val)) continue;
      findings.push({ n, kind: `prop ${attr}`, t: val });
    }
  });

  return findings;
}

const args = process.argv.slice(2);
const files = args.length
  ? args
  : execSync('grep -rl "getRows\\|getInfoPageContent\\|copy(" app --include=page.tsx || true')
      .toString().trim().split('\n').filter(Boolean);

let total = 0;
for (const f of files) {
  const found = audit(f);
  total += found.length;
  if (!found.length) {
    console.log(`\x1b[32mOK\x1b[0m   ${f}`);
    continue;
  }
  console.log(`\x1b[33m${String(found.length).padStart(3)}\x1b[0m  ${f}`);
  for (const { n, kind, t } of found) {
    console.log(`       ${String(n).padStart(4)}  ${kind.padEnd(12)} ${t.slice(0, 72)}`);
  }
}
console.log(`\n${total} hardcoded string(s) across ${files.length} file(s)`);
