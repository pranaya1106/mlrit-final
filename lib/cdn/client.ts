import { createHash } from 'crypto';

import { supabase, getServiceClient } from '@/lib/supabase';

export const ASSETS_BUCKET = 'assets';

/**
 * Extension for a storage key, derived from the MIME type rather than from any
 * caller-supplied filename. Falls back to the subtype for anything unlisted,
 * and to `bin` when even that is unusable.
 */
const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
  'video/mp4': 'mp4',
  'application/pdf': 'pdf',
};

function extensionFor(contentType: string): string {
  const type = contentType.split(';')[0].trim().toLowerCase();
  if (EXTENSIONS[type]) return EXTENSIONS[type];

  const subtype = type.split('/')[1]?.replace(/[^a-z0-9]/g, '');
  return subtype || 'bin';
}

/**
 * Public URL for an object in the `assets` bucket. Assumes the bucket is
 * public; for a private bucket use createSignedUrl instead.
 */
export function getAssetUrl(key: string): string {
  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

/**
 * Upload an object into the `assets` bucket under a content-addressed key.
 * Server-only — uses the service-role client. Returns the derived storage key.
 *
 * The key is `${prefix}/${sha256(file).slice(0, 16)}.${ext}`, so identical
 * bytes always land on the same key and different bytes never collide with an
 * existing one. That is what makes `upsert: true` safe here — a re-upload
 * rewrites a key with byte-identical content, so the year-long immutable
 * Cache-Control the /cdn route sets can never serve a stale object.
 */
export async function uploadAsset(
  prefix: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const hash = createHash('sha256').update(file).digest('hex').slice(0, 16);
  const key = `${prefix}/${hash}.${extensionFor(contentType)}`;

  const { data, error } = await getServiceClient()
    .storage.from(ASSETS_BUCKET)
    .upload(key, file, { contentType, upsert: true });

  if (error) throw error;
  return data.path;
}
