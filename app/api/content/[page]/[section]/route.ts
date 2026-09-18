import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

import { getSection, saveSection, SectionWriteError } from '@/lib/content/client';
import { canEditSection, getAdminUser } from '@/lib/content/permissions';
import { getSectionConfig, isRequiredField } from '@/lib/content/sections';
import { findTransientMediaError } from '@/lib/content/validate';

// Sections predating CONTENT_SECTIONS validated against this fixed list; keep it
// as the fallback so an unconfigured section still cannot be saved half-empty.
const DEFAULT_REQUIRED_FIELDS = ['headlineLead', 'headlineAccent', 'body'];

/**
 * Required field names for a section, from its config when it has one.
 *
 * Media and repeater fields are excluded: an empty image/video means "no upload
 * yet, use the component's built-in asset" and an empty repeater means "use the
 * component's built-in rows", both legitimate states. Requiring them would make
 * a section with an optional video — or one made only of counters — unsavable.
 */
const requiredFieldsFor = (page: string, section: string): readonly string[] =>
  getSectionConfig(page, section)
    ?.fields.filter(isRequiredField)
    .map((field) => field.name) ?? DEFAULT_REQUIRED_FIELDS;

export async function PUT(
  request: Request,
  { params }: { params: { page: string; section: string } }
) {
  const admin = await getAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // The authorisation gate. The admin UI hides sections a user cannot edit,
  // but this route is reachable by any HTTP client holding a valid session, so
  // hiding is presentation and this is the control.
  if (!canEditSection(admin, params.page, params.section)) {
    return NextResponse.json(
      { error: 'You do not have permission to edit this section.' },
      { status: 403 }
    );
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

  // Reject transient blob:/data: values before anything can persist them.
  // Extracted to lib/content/validate.ts so the guard is unit-testable without
  // standing up auth or an HTTP request.
  const transient = findTransientMediaError(params.page, params.section, record);
  if (transient) {
    return NextResponse.json(transient, { status: 400 });
  }

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
      admin.email
    );

    // Drop the cached homepage render so the edit is live on the next visit
    // instead of waiting out the ISR window in app/page.tsx.
    revalidatePath('/');

    return NextResponse.json(saved);
  } catch (error) {
    if (error instanceof SectionWriteError && error.code === 'CONFLICT') {
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

    // The row was expected to exist and does not — deleted out from under the
    // editor. Distinct from a conflict: telling someone to "refresh to see the
    // latest version" is wrong when there is no version to see.
    if (error instanceof SectionWriteError && error.code === 'MISSING') {
      return NextResponse.json(
        {
          error:
            'This section no longer exists in the database — it may have been deleted. Reload the admin before saving again.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: 'Failed to save section.' }, { status: 500 });
  }
}
