import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Lazy singleton — only throws when actually called at runtime,
// not at module-load time, so builds succeed without env vars configured.
let anonClient: SupabaseClient | null = null;

function getAnonClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.'
    );
  }
  if (!anonClient) anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return anonClient;
}

/**
 * Browser/anon client. Safe to import from client components; only ever has
 * the permissions granted to the `anon` role by row level security.
 */
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getAnonClient()[prop as keyof SupabaseClient];
  },
});

let serviceClient: SupabaseClient | null = null;

/**
 * Service-role client for writes. Server-only — the service role key bypasses
 * row level security, so this must never be reachable from a client component.
 */
export function getServiceClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('getServiceClient() must only be called on the server.');
  }

  if (serviceClient) return serviceClient;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.'
    );
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  serviceClient = createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return serviceClient;
}
