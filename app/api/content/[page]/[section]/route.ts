import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSection, saveSection } from '@/lib/content/client';
import { getSectionConfig } from '@/lib/content/sections';

// Sections predating CONTENT_SECTIONS validated against this fixed list; keep it
// as the fallback so an unconfigured section still cannot be saved half-empty.
const DEFAULT_REQUIRED_FIELDS = ['headlineLead', 'headlineAccent', 'body'];

/** Required field names for a section, from its config when it has one. */
const requiredFieldsFor = (page: string, section: string): readonly string[] =>
  getSectionConfig(page, section)?.fields.map((field) => field.name) ?? DEFAULT_REQUIRED_FIELDS;

/**
 * Resolves the caller's session, returning the authenticated user or null.
 *
 * Deliberately independent of middleware.ts: this route is reachable by any
 * HTTP client, and an auth check that assumes a proxy ran in front of it is not
 * an auth check. The user is returned rather than a boolean so writes can
 * record who made them without a second round-trip.
 */
async function getSessionUser(): Promise<{ email: string | null } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Route handlers cannot always write cookies; token refresh is the
      // middleware's job, so dropping the write here is intentional.
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? { email: user.email ?? null } : null;
}

export async function PUT(
  request: Request,
  { params }: { params: { page: string; section: string } }
) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { content, expectedVersion } = (payload ?? {}) as {
    content?: unknown;
    expectedVersion?: unknown;
  };

  if (typeof expectedVersion !== 'number' || !Number.isInteger(expectedVersion)) {
    return NextResponse.json(
      { error: 'expectedVersion must be an integer.', field: 'expectedVersion' },
      { status: 400 }
    );
  }

  if (typeof content !== 'object' || content === null || Array.isArray(content)) {
    return NextResponse.json(
      { error: 'content must be an object.', field: 'content' },
      { status: 400 }
    );
  }

  // Trim every string value before validating, so a whitespace-only field is
  // caught by the blank check below rather than stored as if it had content.
  // Applied across all keys so future sections get the same treatment.
  const record = Object.fromEntries(
    Object.entries(content as Record<string, unknown>).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  );

  for (const field of requiredFieldsFor(params.page, params.section)) {
    const value = record[field];
    if (typeof value !== 'string' || value.length === 0) {
      return NextResponse.json(
        { error: `${field} is required and cannot be blank.`, field },
        { status: 400 }
      );
    }
  }

  try {
    const saved = await saveSection(
      params.page,
      params.section,
      record,
      expectedVersion,
      user.email
    );

    // Drop the cached homepage render so the edit is live on the next visit
    // instead of waiting out the ISR window in app/page.tsx.
    revalidatePath('/');

    return NextResponse.json(saved);
  } catch (error) {
    if (error instanceof Error && error.message === 'CONFLICT') {
      const current = await getSection(params.page, params.section);
      return NextResponse.json(
        {
          error: 'CONFLICT',
          content: current?.content ?? null,
          version: current?.version ?? null,
        },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: 'Failed to save section.' }, { status: 500 });
  }
}
