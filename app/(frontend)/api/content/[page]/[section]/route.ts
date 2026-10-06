import { NextResponse } from 'next/server';

/**
 * Retired write endpoint for the previous admin.
 *
 * The site renders from Payload now, so a write landing in content_blocks
 * would never appear on the page and would be lost when that table is retired.
 * Refusing is the safe failure: the route stays reachable only so that anyone
 * still pointed at it is told where editing moved, instead of silently saving
 * into a table nothing reads.
 *
 * The validation, authorisation and revalidation this used to do all live in
 * Payload now — access control on each generated global, required fields in
 * the field config, and revalidation in the globals' afterChange hook.
 */
export async function PUT() {
  return NextResponse.json(
    {
      error: 'This editor has been replaced. Content is now edited in Payload at /cms.',
      movedTo: '/cms',
    },
    { status: 410 }
  );
}
