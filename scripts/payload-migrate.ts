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

const stable = (value: unknown): string =>
  JSON.stringify(value, (_k, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as object).sort(([a], [b]) => a.localeCompare(b)))
      : v
  );

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

    const slug = toGlobalSlug(key);
    const { data, dropped } = toPayloadData(block.page_slug, block.section_key, block.content);

    if (!verifyOnly) {
      await payload.updateGlobal({ slug, data, depth: 0, overrideAccess: true });
    }

    const readback = (await payload.findGlobal({
      slug,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;

    const actual = toContent(block.page_slug, block.section_key, readback);
    const expected = expectedContent(block);
    const match = stable(actual) === stable(expected);

    if (!match) failures.push(key);

    const note = dropped.length ? `  (dropped unknown field(s): ${dropped.join(', ')})` : '';
    console.log(`${match ? 'ok  ' : 'FAIL'}  ${key}  v${block.version}${note}`);

    if (!match) {
      console.log(`      expected: ${stable(expected)}`);
      console.log(`      actual:   ${stable(actual)}`);
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
    process.exit(1);
  }

  process.exit(0);
}

void main();
