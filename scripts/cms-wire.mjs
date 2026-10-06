#!/usr/bin/env node
/**
 * Turns every visible string on a page into a CMS field.
 *
 * Wiring pages by hand is what left 545 strings uneditable and shipped a
 * statistics page whose list was editable and whose heading was not. This
 * reads a page, names a field per text node, rewrites the JSX to read it
 * through copy(), and prints the config block to paste into CONTENT_SECTIONS.
 *
 *   node scripts/cms-wire.mjs app/iqac/page.tsx iqac/overview --apply
 *
 * Without --apply it only prints, so the field names can be read before any
 * file changes. Fallbacks stay in the source: an unsaved section renders
 * exactly as before.
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [file, sectionKey, ...flags] = process.argv.slice(2);
const APPLY = flags.includes('--apply');
if (!file || !sectionKey) {
  console.error('usage: cms-wire.mjs <page.tsx> <page/section> [--apply]');
  process.exit(1);
}

const SKIP_ATTR =
  /^(className|style|href|src|id|key|alt|aria-hidden|aria-label|type|rel|target|width|height|viewBox|fill|stroke|d|preserveAspectRatio|download|variant|tone|preset|delay|active|name|property|content|eyebrow|title|italic|dek)$/;
const NOISE = /^(\s*|[\d\s.,%+–—-]*|#[0-9a-f]{3,8}|\/[^\s]*|https?:\/\/\S+|[a-z-]+|[A-Z_]+|&[a-z]+;)$/;

const src = readFileSync(file, 'utf8');

/**
 * Only the default export's body is rewritten. copy() closes over the section
 * content that function awaits, so a call placed in a module-level constant —
 * admissions/policies keeps its sections in one — compiles to "Cannot find
 * name 'copy'". Text above the default export needs the constant turned into a
 * function of copy, which is a judgement call, not something to generate; the
 * audit keeps reporting those pages until someone does it.
 */
const bodyStart = (() => {
  const m = src.match(/export default (async )?function/);
  if (!m) {
    console.error(`no default export function in ${file} — nothing rewritten`);
    process.exit(2);
  }
  return m.index;
})();
const head = src.slice(0, bodyStart);
const body = src.slice(bodyStart);


/**
 * JSX renders &apos; as an apostrophe; a JS string does not — it would print
 * the entity. Every fallback and default therefore carries the decoded text,
 * which is also what an editor expects to see in the form.
 */
const ENTITIES = {
  '&apos;': "'", '&quot;': '"', '&ldquo;': '\u201c', '&rdquo;': '\u201d',
  '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ndash;': '\u2013', '&mdash;': '\u2014',
  '&nbsp;': ' ', '&hellip;': '\u2026', '&amp;': '&',
};
const decode = (t) => t.replace(/&[a-z]+;/g, (e) => ENTITIES[e] ?? e);

/** camelCase key from the copy itself, so the admin shows a readable name. */
function keyFor(text, used) {
  let base = text
    .replace(/&[a-z]+;/g, ' ')
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
  if (!base || /^\d/.test(base)) base = `text${base}`;
  let key = base;
  let n = 2;
  while (used.has(key)) key = `${base}${n++}`;
  used.add(key);
  return key;
}

const used = new Set();
const fields = [];
let out = body;

// Longest first: replacing a short string that also occurs inside a longer one
// would corrupt the longer match.
// `>` also ends an arrow function and `<` opens a generic, so a naive
// >text< match can span real JavaScript. It did: a run from `=>` to the next
// JSX tag was rewritten as copy(), producing `; return (')}<`. Two guards:
// the `>` must not be part of `=>`, and the captured run must not contain
// characters that only appear in code.
const CODE = /[;=(){}[\]]|=>|\breturn\b|\bconst\b/;

const nodes = [...body.matchAll(/(.)>([^<>{}]+)</g)]
  .filter((m) => m[1] !== '=' && !CODE.test(m[2]))
  .map((m) => ({ raw: m[2], text: decode(m[2].replace(/\s+/g, ' ').trim()) }))
  .filter((n) => n.text.length > 2 && !NOISE.test(n.text) && /[a-z]{3}/i.test(n.text))
  .sort((a, b) => b.raw.length - a.raw.length);

const seen = new Set();
for (const { raw, text } of nodes) {
  if (seen.has(raw)) continue;
  seen.add(raw);
  const key = keyFor(text, used);
  const js = text.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  fields.push({ key, text });
  // Replace every occurrence of this exact node.
  out = out.split(`>${raw}<`).join(`>{copy('${key}', '${js}')}<`);
}

const label = (t) => (t.length > 46 ? `${t.slice(0, 46)}…` : t);
const esc = (t) => JSON.stringify(t);
const block = fields
  .map(
    (f) =>
      `      { name: '${f.key}', label: ${esc(label(f.text))}${
        f.text.length > 90 ? ', multiline: true' : ''
      }, defaultValue: ${esc(f.text)} },`
  )
  .join('\n');

console.log(`// ${sectionKey} — ${fields.length} field(s)\n${block}\n`);

if (APPLY) {
  writeFileSync(file, head + out);
  console.log(`applied to ${file}`);
} else {
  console.log('(dry run — pass --apply to rewrite the page)');
}
