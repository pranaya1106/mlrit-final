import { NextResponse } from 'next/server';

const CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Proxies an object out of the public `assets` bucket.
 *
 * Serving through our own origin keeps asset URLs stable if the storage
 * provider ever changes, and lets us set our own cache headers.
 */
export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const segments = params.path ?? [];

  // The key is interpolated into an upstream URL, so reject anything that could
  // climb out of the bucket prefix or inject a path of its own.
  if (
    segments.length === 0 ||
    segments.some((segment) => !segment || segment === '.' || segment === '..')
  ) {
    return new NextResponse('Not found', { status: 404 });
  }

  const key = segments.join('/');

  try {
    // Imported lazily so a missing Supabase env var surfaces as a 404 here
    // rather than throwing while this module is being evaluated.
    const { getAssetUrl } = await import('@/lib/cdn/client');
    const upstream = await fetch(getAssetUrl(key));

    if (!upstream.ok || !upstream.body) {
      return new NextResponse('Not found', { status: 404 });
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Cache-Control': CACHE_CONTROL,
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
