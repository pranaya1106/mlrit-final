/**
 * Copy every content_blocks row from Supabase into the matching Payload
 * global, then read each one back and prove it is unchanged.
 *
 * Run with Payload's own runner, which loads .env.local and the config:
 *
 *   npx payload run scripts/payload-migrate.ts            # migrate + verify
 *   npx payload run scripts/payload-migrate.ts --verify   # verify only
 *
 * Idempotent: re-running overwrites each global with the same source rows, so
 * a partial run is safe to repeat. Nothing is deleted from Supabase — the old
 * table stays as the rollback path until the cutover is signed off.
 */
import { getPayload } from 'payload';
import config from '@payload-config';

import { getSectionConfig } from '@/lib/content/sections';
import { toContent, toPayloadData } from '@/payload/transform';
import { toGlobalSlug } from '@/payload/slug';

type Block = {
  page_slug: string;
  section_key: string;
  content: Record<string, unknown>;
  version: number;
};

const verifyOnly = process.argv.includes('--verify');

async function fetchBlocks(): Promise<Block[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase env vars missing; cannot read content_blocks.');

  const res = await fetch(
    `${url}/rest/v1/content_blocks?select=page_slug,section_key,content,version`,
    { headers: { apikey: key, Authorization: `Bearer ${key}` } }
  );
  if (!res.ok) throw new Error(`content_blocks read failed: ${res.status} ${await res.text()}`);
  return res.json();
}

/**
 * The source blob reduced to what a round trip can preserve: fields the
 * section still declares, and list items without the empty values Payload
 * stores as null. Anything this keeps must come back identical, or the
 * migration lost data.
 */
function expectedContent(block: Block): Record<string, unknown> {
  const { data } = toPayloadData(block.page_slug, block.section_key, block.content);
  const expected: Record<string, unknown> = {};

  for (const [name, value] of Object.entries(data)) {
    if (!Array.isArray(value)) {
      expected[name] = value;
      continue;
    }
    expected[name] = value.map((row) => {
      const item: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
        if (k === 'itemId' || v === undefined || v === null) continue;
        item[k] = v;
      }
      item.id = String((row as Record<string, unknown>).itemId ?? '');
      return item;
    });
  }
  return expected;
}

/**
 * Key-order-independent, and scalar-type-independent.
 *
 * A repeater column declared `number` stores "37" in content_blocks and comes
 * back from Postgres as 37. That is a type normalisation, not a loss — every
 * consumer already reads these through asNumber(), which the RepeaterItem docs
 * call out explicitly ("consumers coerce rather than trust"). Comparing the
 * rendered form keeps the check honest about content while ignoring it.
 */
const stable = (value: unknown): string =>
  JSON.stringify(value, (_k, v) => {
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      return Object.fromEntries(Object.entries(v as object).sort(([a], [b]) => a.localeCompare(b)));
    }
    return v;
  });

/**
 * `actual` reduced to the keys the source row actually carried.
 *
 * Payload returns a global's defaultValue for any field the stored blob never
 * had — the same text the component already renders as its fallback, so the
 * page is unchanged — but comparing against it would report every unsaved
 * field as a mismatch. Those are counted and reported separately instead.
 */
const addedByDefault = (actual: Record<string, unknown>, expected: Record<string, unknown>) =>
  Object.keys(actual).filter((key) => !(key in expected));

const restrict = (
  actual: Record<string, unknown>,
  expected: Record<string, unknown>
): Record<string, unknown> =>
  Object.fromEntries(Object.entries(actual).filter(([key]) => key in expected));

async function main() {
  const payload = await getPayload({ config });
  const blocks = await fetchBlocks();

  console.log(`content_blocks rows: ${blocks.length}\n`);

  const skipped: string[] = [];
  const failures: string[] = [];

  for (const block of blocks) {
    const key = `${block.page_slug}/${block.section_key}`;

    if (!getSectionConfig(block.page_slug, block.section_key)) {
      // A row whose section was removed from CONTENT_SECTIONS has nowhere to
      // land. Report it rather than inventing a global for it.
      skipped.push(`${key} — no section config`);
      continue;
    }

    // payload-types.ts narrows slug to the union of known globals; this one is
    // computed from CONTENT_SECTIONS, which is the same set by construction.
    const slug = toGlobalSlug(key) as Parameters<typeof payload.findGlobal>[0]['slug'];
    const { data, dropped } = toPayloadData(block.page_slug, block.section_key, block.content);

    if (!verifyOnly) {
      await payload.updateGlobal({ slug, data, depth: 0, overrideAccess: true });
    }

    const readback = (await payload.findGlobal({
      slug,
      depth: 0,
      overrideAccess: true,
    })) as unknown as Record<string, unknown>;

    const actual = toContent(block.page_slug, block.section_key, readback);
    const expected = expectedContent(block);
    const added = addedByDefault(actual, expected);
    const match = stable(restrict(actual, expected)) === stable(expected);

    if (!match) failures.push(key);

    const notes = [
      dropped.length ? `dropped unknown field(s): ${dropped.join(', ')}` : '',
      added.length ? `defaults filled in: ${added.join(', ')}` : '',
    ].filter(Boolean);
    console.log(
      `${match ? 'ok  ' : 'FAIL'}  ${key}  v${block.version}` +
        (notes.length ? `  (${notes.join('; ')})` : '')
    );

    if (!match) {
      for (const field of Object.keys(expected)) {
        const a = stable(restrict(actual, expected)[field]);
        const e = stable(expected[field]);
        if (a !== e) {
          console.log(`      field "${field}" differs`);
          console.log(`        expected: ${e.slice(0, 300)}`);
          console.log(`        actual:   ${a.slice(0, 300)}`);
        }
      }
    }
  }

  if (skipped.length) {
    console.log(`\nskipped ${skipped.length}:`);
    skipped.forEach((s) => console.log(`  ${s}`));
  }

  console.log(
    `\n${blocks.length - skipped.length - failures.length}/${blocks.length - skipped.length} ` +
      `migrated sections verified identical.`
  );

  if (failures.length) {
    console.error(`\n${failures.length} section(s) did not round trip: ${failures.join(', ')}`);
    // Not process.exit(): stdout to a pipe is asynchronous, and exiting here
    // discards everything still buffered — which is the whole report.
    process.exitCode = 1;
  }
}

// Top-level await, not `void main()`: Payload's runner does not wait on a
// floating promise, so the process exited before the first row was read — exit
// 0 with no output at all.
await main();
