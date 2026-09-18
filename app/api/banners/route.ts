import { NextResponse } from 'next/server';

import { uploadAsset } from '@/lib/cdn/client';
import { type AdminUser, getAdminUser, isOwner } from '@/lib/content/permissions';
import { supabase, getServiceClient } from '@/lib/supabase';

const MAX_BYTES = 5 * 1024 * 1024;

/**
 * The signed-in owner, or the response to send instead.
 *
 * Banners are an owner-only area: they publish to every visitor of the site and
 * are not section-scoped, so an editor scoped to a handful of sections has no
 * claim on them. Enforced here rather than only in the admin UI — this route is
 * reachable by any HTTP client holding a valid session, so hiding the page is
 * presentation and this is the control. Independent of middleware.ts for the
 * same reason: a check that assumes a proxy ran in front of it is not a check.
 *
 * The owner is returned rather than a boolean so writes can record who made
 * them without a second round-trip.
 */
async function requireOwner(): Promise<
  { admin: AdminUser; error?: undefined } | { admin?: undefined; error: NextResponse }
> {
  const admin = await getAdminUser();
  if (!admin) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  if (!isOwner(admin)) {
    return { error: NextResponse.json({ error: 'Owners only.' }, { status: 403 }) };
  }
  return { admin };
}

const badRequest = (error: string, field: string) =>
  NextResponse.json({ error, field }, { status: 400 });

/** Empty strings from unfilled form inputs become null, not ''. */
const orNull = (value: FormDataEntryValue | null): string | null => {
  const text = typeof value === 'string' ? value.trim() : '';
  return text.length > 0 ? text : null;
};

/**
 * A stored link_url is rendered straight into an anchor on the public site, so
 * only absolute http(s) URLs and site-relative paths are allowed. This blocks
 * `javascript:` and `data:` payloads, and rejects protocol-relative `//host`
 * URLs, which look site-relative but navigate off-origin.
 */
const isSafeLink = (url: string): boolean =>
  /^https?:\/\//i.test(url) || (url.startsWith('/') && !url.startsWith('//'));

export async function POST(request: Request) {
  const auth = await requireOwner();
  if (auth.error) return auth.error;
  const user = auth.admin;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest('Request body must be multipart form data.', 'form');
  }

  const title = orNull(form.get('title'));
  if (!title) {
    return badRequest('Title is required and cannot be blank.', 'title');
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return badRequest('An image file is required.', 'file');
  }

  if (!file.type.startsWith('image/')) {
    return badRequest('File must be an image.', 'file');
  }

  if (file.size > MAX_BYTES) {
    return badRequest('Image must be 5MB or smaller.', 'file');
  }

  // Checked before the upload so a bad link does not leave an orphaned object
  // in the bucket.
  const linkUrl = orNull(form.get('link_url'));
  if (linkUrl && !isSafeLink(linkUrl)) {
    return badRequest('Link URL must start with http://, https:// or /.', 'link_url');
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const assetKey = await uploadAsset('banners', buffer, file.type);

    const { data, error } = await getServiceClient()
      .from('banners')
      .insert({
        title,
        asset_key: assetKey,
        link_url: linkUrl,
        active: form.get('active') === 'true',
        start_date: orNull(form.get('start_date')),
        end_date: orNull(form.get('end_date')),
        edited_by: user.email,
      })
      .select('id, title, asset_key, link_url, active, start_date, end_date')
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create banner.' }, { status: 500 });
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Flip a banner's active flag. Nothing else on the row is writable here. */
export async function PATCH(request: Request) {
  const auth = await requireOwner();
  if (auth.error) return auth.error;
  const user = auth.admin;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest('Request body must be valid JSON.', 'body');
  }

  const { id, active } = (payload ?? {}) as { id?: unknown; active?: unknown };

  if (typeof id !== 'string' || !UUID.test(id)) {
    return badRequest('A valid banner id is required.', 'id');
  }

  if (typeof active !== 'boolean') {
    return badRequest('active must be a boolean.', 'active');
  }

  try {
    const { data, error } = await getServiceClient()
      .from('banners')
      .update({ active, edited_by: user.email })
      .eq('id', id)
      .select('id, title, asset_key, link_url, active, start_date, end_date')
      .maybeSingle();

    if (error) throw error;
    if (!data) return NextResponse.json({ error: 'Banner not found.' }, { status: 404 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to update banner.' }, { status: 500 });
  }
}

/**
 * Delete a banner row. The storage object is deliberately left in place:
 * keys are content-addressed, so two banners uploaded from identical bytes
 * share one object (proven in testing) and removing it would break the other.
 * Orphan reclamation needs a sweep that checks for remaining references.
 */
export async function DELETE(request: Request) {
  // No edited_by to record — the row is going away.
  const auth = await requireOwner();
  if (auth.error) return auth.error;

  const id = new URL(request.url).searchParams.get('id');

  if (!id || !UUID.test(id)) {
    return badRequest('A valid banner id is required.', 'id');
  }

  try {
    const { data, error } = await getServiceClient()
      .from('banners')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Banner not found.' }, { status: 404 });
    }

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: 'Failed to delete banner.' }, { status: 500 });
  }
}

/**
 * Public list. Uses the anon client, so the banners_public_read policy does the
 * filtering — inactive, not-yet-started and expired rows never come back.
 */
export async function GET() {
  const { data, error } = await supabase
    .from('banners')
    .select('id, title, asset_key, link_url')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: 'Failed to load banners.' }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
