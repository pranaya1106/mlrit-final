#!/usr/bin/env node
/**
 * Give a server page the three lines cms-wire's copy() calls need, so the two
 * scripts together take a page from hardcoded to editable without hand edits.
 *
 *   node scripts/cms-plumb.mjs app/(frontend)/about/page.tsx about/overview --apply
 *
 * Deliberately does NOT add SectionContent/<Copy>. That pair exists to feed the
 * hand-rolled postMessage draft store, which only ever worked on the homepage;
 * Payload's Live Preview reloads the iframe itself, so a plain server read is
 * both simpler and correct everywhere. Pages already using SectionContent keep
 * working — this only adds the server-side reader.
 *
 * Refuses a client component: it cannot await, and the fix there is a server
 * wrapper, which is a judgement call rather than something to generate.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [file, sectionKey, ...flags] = process.argv.slice(2);
const APPLY = flags.includes('--apply');
if (!file || !sectionKey) {
  console.error('usage: cms-plumb.mjs <page.tsx> <page/section> [--apply]');
  process.exit(1);
}

const [page, section] = sectionKey.split('/');
let src = readFileSync(file, 'utf8');

if (/^\s*['"]use client['"]/m.test(src.split('\n').slice(0, 3).join('\n'))) {
  console.error(`SKIP (client component): ${file}`);
  process.exit(2);
}

if (src.includes(`getSection('${page}', '${section}')`)) {
  console.log(`already plumbed: ${file}`);
  process.exit(0);
}

// 1. Imports, each only if absent.
const IMPORTS = [
  ["from '@/lib/content/client'", "import { getSection } from '@/lib/content/client';"],
  ["asText", "import { asText } from '@/lib/content/sections';"],
];
const lines = src.split('\n');
let lastImport = -1;
lines.forEach((line, i) => {
  if (/^import .*;\s*$/.test(line)) lastImport = i;
});
if (lastImport === -1) {
  console.error(`SKIP (no import block): ${file}`);
  process.exit(2);
}
const added = IMPORTS.filter(([probe]) => !src.includes(probe)).map(([, stmt]) => stmt);
if (added.length) {
  lines.splice(lastImport + 1, 0, ...added);
  src = lines.join('\n');
}

// 2. The default export has to be async to await the section read.
const DEFAULT_EXPORT = /export default (async )?function (\w+)\s*\(([^)]*)\)\s*\{/;
const match = src.match(DEFAULT_EXPORT);
if (!match) {
  console.error(`SKIP (no plain default export function): ${file}`);
  process.exit(2);
}
const [whole, isAsync, name, params] = match;
const header = `export default async function ${name}(${params}) {`;

// 3. The reader, immediately inside the function body. `copy` shadows nothing:
// a page that already declares one is skipped above by the getSection probe.
const body = [
  header,
  `  const row = await getSection('${page}', '${section}').catch(() => null);`,
  '  const c = (row?.content ?? {}) as Record<string, unknown>;',
  '  const copy = (key: string, fallback: string) => asText(c[key], fallback);',
].join('\n');

src = src.replace(whole, body);

console.log(`${isAsync ? 'plumbed' : 'plumbed (made async)'}: ${file} -> ${sectionKey}`);
if (APPLY) writeFileSync(file, src);
else console.log('(dry run — pass --apply to write)');
