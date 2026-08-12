import { supabase, getServiceClient } from '@/lib/supabase';

export const ASSETS_BUCKET = 'assets';

/**
 * Public URL for an object in the `assets` bucket. Assumes the bucket is
 * public; for a private bucket use createSignedUrl instead.
 */
export function getAssetUrl(key: string): string {
  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(key);
  return data.publicUrl;
}

/**
 * Upload (or replace) an object in the `assets` bucket. Server-only — uses the
 * service-role client. Returns the storage key.
 */
export async function uploadAsset(
  key: string,
  file: Buffer,
  contentType: string
): Promise<string> {
  const { data, error } = await getServiceClient()
    .storage.from(ASSETS_BUCKET)
    .upload(key, file, { contentType, upsert: true });

  if (error) throw error;
  return data.path;
}
