import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { getServiceClient } from '@/lib/supabase';

export type AdminRole = 'owner' | 'editor';

export type AdminUser = {
  userId: string;
  email: string;
  role: AdminRole;
  /** Section keys an editor may edit. Empty and irrelevant for an owner. */
  sections: string[];
  /**
   * True when no admin_users row exists anywhere yet, so this user is being
   * treated as an owner by default. See `bootstrapping` below.
   */
  isBootstrap: boolean;
};

/**
 * The signed-in admin, or null.
 *
 * Deliberately independent of middleware.ts: these helpers are called from
 * route handlers and pages that are reachable directly, and an authorisation
 * check that assumes a proxy ran in front of it is not a check.
 *
 * getUser() revalidates the token against the auth server. getSession() only
 * decodes what the cookie claims, which a client can forge, so it must never
 * be the basis of an authorisation decision.
 */
async function getSessionUser(): Promise<{ id: string; email: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const cookieStore = cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // Token refresh is the middleware's job; route handlers cannot always
      // write cookies, so dropping the write here is intentional.
      setAll() {},
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? { id: user.id, email: user.email ?? '' } : null;
}

/**
 * Whether the permissions table is still empty.
 *
 * Before 0005_admin_users.sql is applied and seeded, every authenticated user
 * could edit everything — that was the CMS's behaviour for its whole life so
 * far. Treating an empty table as "everyone is an owner" keeps that behaviour
 * rather than locking the only admin out of their own site the moment this
 * code ships. The first inserted row starts enforcement.
 *
 * Read with the service client: an editor's own RLS policy shows them only
 * their row, so they could never tell an empty table from one they are absent
 * from — and "absent" must mean no access, not full access.
 */
async function isBootstrapping(): Promise<boolean> {
  try {
    const { count, error } = await getServiceClient()
      .from('admin_users')
      .select('user_id', { count: 'exact', head: true });

    // A missing table (the migration has not been applied) reads the same as
    // an empty one: nothing has been configured yet.
    if (error) return true;
    return (count ?? 0) === 0;
  } catch {
    return true;
  }
}

/** The current admin with their permissions resolved, or null when signed out. */
export async function getAdminUser(): Promise<AdminUser | null> {
  const user = await getSessionUser();
  if (!user) return null;

  if (await isBootstrapping()) {
    return { userId: user.id, email: user.email, role: 'owner', sections: [], isBootstrap: true };
  }

  try {
    const { data, error } = await getServiceClient()
      .from('admin_users')
      .select('user_id, email, role, sections')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    // Authenticated but not listed: signed in, no edit rights.
    if (!data) {
      return { userId: user.id, email: user.email, role: 'editor', sections: [], isBootstrap: false };
    }

    return {
      userId: user.id,
      email: (data.email as string) || user.email,
      role: (data.role as AdminRole) ?? 'editor',
      sections: Array.isArray(data.sections) ? (data.sections as string[]) : [],
      isBootstrap: false,
    };
  } catch {
    // A failed lookup must not hand out access it could not verify.
    return { userId: user.id, email: user.email, role: 'editor', sections: [], isBootstrap: false };
  }
}

/** Whether this admin may edit `${page}/${section}`. */
export function canEditSection(admin: AdminUser | null, page: string, section: string): boolean {
  if (!admin) return false;
  if (admin.role === 'owner') return true;
  return admin.sections.includes(`${page}/${section}`);
}

/** Owner-only areas: banners, user management, anything not section-scoped. */
export function isOwner(admin: AdminUser | null): boolean {
  return admin?.role === 'owner';
}
