#!/usr/bin/env node
/**
 * Move a module-level constant that renders copy into the default export, so
 * cms-wire can reach it.
 *
 *   node scripts/cms-hoist.mjs app/(frontend)/admissions/policies/page.tsx --apply
 *
 * Several pages keep their content in a top-level array of JSX — the sections
 * of a policy page, the rows of a counselling schedule. That text is as much
 * copy as anything in the component, but it sits outside the function that
 * defines copy(), so wiring it there is a compile error. Hoisting is the
 * smallest fix: the declaration moves to just after the copy() helper, where it
 * is still evaluated once per render and can read it.
 *
 * Only moves a constant referenced nowhere but inside the default export —
 * anything shared with another component in the file is left alone, since
 * moving it would break that use.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [file, ...flags] = process.argv.slice(2);
const APPLY = flags.includes('--apply');
if (!file) {
  console.error('usage: cms-hoist.mjs <page.tsx> [--apply]');
  process.exit(1);
}

let src = readFileSync(file, 'utf8');

const exportMatch = src.match(/export default (?:async )?function \w+\s*\([^)]*\)\s*\{/);
if (!exportMatch) {
  console.error(`SKIP (no default export function): ${file}`);
  process.exit(2);
}

/** End of the declaration starting at `from`, by balancing brackets. */
function declEnd(text, from) {
  let depth = 0;
  let inStr = null;
  for (let i = from; i < text.length; i++) {
    const ch = text[i];
    const prev = text[i - 1];
    if (inStr) {
      if (ch === inStr && prev !== '\\') inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if ('([{'.includes(ch)) depth++;
    else if (')]}'.includes(ch)) depth--;
    else if (ch === ';' && depth === 0) return i + 1;
  }
  return -1;
}

const moved = [];

// Re-scan from scratch after each move: every splice shifts later offsets.
for (;;) {
  const exportAt = src.search(/export default (?:async )?function \w+\s*\([^)]*\)\s*\{/);
  const decls = [...src.slice(0, exportAt).matchAll(/^const ([A-Z][A-Z0-9_]*) = /gm)];

  const next = decls.find(({ 1: name, index }) => {
    if (moved.includes(name)) return false;
    const end = declEnd(src, index);
    if (end === -1) return false;
    const text = src.slice(index, end);
    // Worth moving only if it actually contains JSX copy.
    if (!/>[^<>{}]*[A-Za-z]{3}[^<>{}]*</.test(text)) return false;
    // Referenced outside the default export (other than here)? Leave it.
    const before = src.slice(0, index) + src.slice(end, exportAt);
    return !new RegExp(`\\b${name}\\b`).test(before);
  });

  if (!next) break;

  const name = next[1];
  const start = next.index;
  const end = declEnd(src, start);
  const decl = src.slice(start, end);

  src = src.slice(0, start) + src.slice(end).replace(/^\n+/, '\n');

  // Land it after the copy() helper, which it may now use.
  const header = src.match(/export default (?:async )?function \w+\s*\([^)]*\)\s*\{/)[0];
  const headerAt = src.indexOf(header) + header.length;
  const copyLine = src.indexOf('const copy = ', headerAt);
  const insertAt =
    copyLine !== -1 && copyLine < headerAt + 400
      ? src.indexOf('\n', copyLine) + 1
      : headerAt + 1;

  const indented = decl.split('\n').map((l) => (l ? `  ${l}` : l)).join('\n');
  src = `${src.slice(0, insertAt)}\n${indented}\n${src.slice(insertAt)}`;
  moved.push(name);
}

if (!moved.length) {
  console.log(`nothing to hoist: ${file}`);
  process.exit(0);
}

console.log(`hoisted into the component: ${moved.join(', ')}  (${file})`);
if (APPLY) writeFileSync(file, src);
else console.log('(dry run — pass --apply to write)');
