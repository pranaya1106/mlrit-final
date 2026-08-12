import { createServerClient } from '@supabase/ssr';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { getSection, saveSection } from '@/lib/content/client';

const REQUIRED_FIELDS = ['headlineLead', 'headlineAccent', 'body'] as const;

/**
 * Confirms the caller holds a valid Supabase session.
 *
 * Deliberately independent of middleware.ts: this route is reachable by any
 * HTTP client, and an auth check that assumes a proxy ran in front of it is not
 * an auth check.
 */
async function hasValidSession(): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;

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

  return Boolean(user);
}

export async function PUT(
  request: Request,
  { params }: { params: { page: string; section: string } }
) {
  if (!(await hasValidSession())) {
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

  for (const field of REQUIRED_FIELDS) {
    const value = record[field];
    if (typeof value !== 'string' || value.length === 0) {
      return NextResponse.json(
        { error: `${field} is required and cannot be blank.`, field },
        { status: 400 }
      );
    }
  }

  try {
    const saved = await saveSection(params.page, params.section, record, expectedVersion);

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
