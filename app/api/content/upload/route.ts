import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { uploadAsset } from '@/lib/cdn/client';

// Reference points from public/videos: sports.mp4 is 1.5MB and hero.mp4 21MB,
// so 25MB covers the kind of clip this section actually uses. The site does
// carry two ~29MB videos (placements, equinox) — raise this if those ever need
// to be CMS-managed.
const MAX_BYTES: Record<'image' | 'video', number> = {
  image: 5 * 1024 * 1024,
  video: 25 * 1024 * 1024,
};

/**
 * Resolves the caller's session. Independent of middleware.ts on purpose — this
 * route is reachable by any HTTP client, and an auth check that assumes a proxy
 * ran in front of it is not an auth check.
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
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return Boolean(user);
}

const badRequest = (error: string, field: string) =>
  NextResponse.json({ error, field }, { status: 400 });

/**
 * Storage prefixes are interpolated into an object key, so restrict them to a
 * plain slug rather than trusting whatever the client sends.
 */
const isSafePrefix = (prefix: string): boolean => /^[a-z0-9][a-z0-9/_-]{0,63}$/i.test(prefix);

/**
 * Authenticated upload for CMS media fields.
 *
 * Thin wrapper over uploadAsset — same content-addressed hashing already proven
 * by the banner uploads. This exists only so the generic editor has an entry
 * point that is not banner-specific.
 */
export async function POST(request: Request) {
  if (!(await hasValidSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest('Request body must be multipart form data.', 'form');
  }

  const prefix = typeof form.get('prefix') === 'string' ? String(form.get('prefix')).trim() : '';
  if (!prefix || !isSafePrefix(prefix)) {
    return badRequest('A valid storage prefix is required.', 'prefix');
  }

  const file = form.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return badRequest('A file is required.', 'file');
  }

  const kind = file.type.startsWith('image/')
    ? 'image'
    : file.type.startsWith('video/')
      ? 'video'
      : null;

  if (!kind) {
    return badRequest('File must be an image or a video.', 'file');
  }

  if (file.size > MAX_BYTES[kind]) {
    const limitMb = Math.round(MAX_BYTES[kind] / (1024 * 1024));
    return badRequest(`${kind === 'image' ? 'Image' : 'Video'} must be ${limitMb}MB or smaller.`, 'file');
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const key = await uploadAsset(prefix, buffer, file.type);

    // The key is what gets stored in content; the url is what the public
    // component renders, served through our own /cdn proxy.
    return NextResponse.json({ key, url: `/cdn/${key}` }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
