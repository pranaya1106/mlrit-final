#!/usr/bin/env node
/**
 * Split a client page into a server page that reads its CMS section and a
 * client view that renders it.
 *
 *   node scripts/cms-client-split.mjs app/(frontend)/admissions/page.tsx admissions/overview --apply
 *
 * A client component cannot await, so it cannot read its own section — which
 * is why these pages stayed uneditable while every server page around them got
 * wired. The split is the smallest fix that keeps the interactivity: the server
 * half does the read, the client half gets a plain object prop and defines the
 * same copy() helper every wired page uses. The content crosses as data, not a
 * function, because a function prop cannot cross that boundary.
 *
 * Run cms-wire against the generated view afterwards; its default export is
 * the component, so copy() calls land inside the function that defines it.
 */
import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const [file, sectionKey, ...flags] = process.argv.slice(2);
const APPLY = flags.includes('--apply');
if (!file || !sectionKey) {
  console.error('usage: cms-client-split.mjs <page.tsx> <page/section> [--apply]');
  process.exit(1);
}

const [page, section] = sectionKey.split('/');
const src = readFileSync(file, 'utf8');

if (!/^\s*['"]use client['"]/m.test(src.split('\n').slice(0, 3).join('\n'))) {
  console.error(`SKIP (not a client component): ${file}`);
  process.exit(2);
}

const m = src.match(/export default function (\w+)\s*\(\s*\)\s*\{/);
if (!m) {
  console.error(`SKIP (no zero-argument default export): ${file}`);
  process.exit(2);
}
const name = m[1];
const viewName = `${name}View`;
const viewFile = join(dirname(file), `${viewName}.tsx`);
if (existsSync(viewFile)) {
  console.error(`SKIP (already split): ${viewFile}`);
  process.exit(2);
}

// The view: same file, taking the section content as a prop.
let view = src.replace(
  m[0],
  `export default function ${viewName}({ content }: { content: Record<string, unknown> }) {\n` +
    '  const copy = (key: string, fallback: string) => asText(content[key], fallback);'
);
if (!view.includes("from '@/lib/content/sections'")) {
  view = view.replace(
    /^(\s*['"]use client['"];\s*\n)/m,
    `$1\nimport { asText } from '@/lib/content/sections';`
  );
}

const wrapper = `import { getSection } from '@/lib/content/client';

import ${viewName} from './${viewName}';

/**
 * Server half of ${file.split('/').pop()}: reads the CMS section so the client
 * view below can render it. The view keeps all the interactivity.
 */
export default async function ${name}() {
  const row = await getSection('${page}', '${section}').catch(() => null);
  return <${viewName} content={(row?.content ?? {}) as Record<string, unknown>} />;
}
`;

console.log(`split ${file} -> ${viewFile} + server wrapper (${sectionKey})`);
if (!APPLY) {
  console.log('(dry run — pass --apply to write)');
  process.exit(0);
}

renameSync(file, viewFile);
writeFileSync(viewFile, view);
writeFileSync(file, wrapper);
