import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.'
  );
}

/**
 * Browser/anon client. Safe to import from client components; only ever has
 * the permissions granted to the `anon` role by row level security.
 */
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let serviceClient: SupabaseClient | null = null;

/**
 * Service-role client for writes. Server-only — the service role key bypasses
 * row level security, so this must never be reachable from a client component.
 * Lazily created so that importing this module in a browser bundle does not
 * throw purely because the server-only key is absent.
 */
export function getServiceClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getServiceClient() must only be called on the server.');
  }

  if (serviceClient) return serviceClient;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  serviceClient = createClient(SUPABASE_URL!, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serviceClient;
}
