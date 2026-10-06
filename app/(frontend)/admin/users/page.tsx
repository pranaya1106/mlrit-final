import Link from 'next/link';

import { getAdminUser, isOwner } from '@/lib/content/permissions';
import { CONTENT_SECTIONS } from '@/lib/content/sections';
import { getServiceClient } from '@/lib/supabase';

import UserTable, { type AdminRow } from './UserTable';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

/**
 * Everyone who can sign in, and what each may edit.
 *
 * Read with the service client: admin_users carries a read-own-row policy, so
 * the anon client would return exactly one row here no matter who asked. The
 * page is owner-gated above this call.
 */
async function loadAdmins(): Promise<{ rows: AdminRow[]; configured: boolean }> {
  try {
    const { data, error } = await getServiceClient()
      .from('admin_users')
      .select('user_id, email, role, sections')
      .order('email');

    if (error) throw error;

    const rows = (data ?? []).map((row) => ({
      userId: row.user_id as string,
      email: (row.email as string) ?? '',
      role: (row.role as AdminRow['role']) ?? 'editor',
      sections: Array.isArray(row.sections) ? (row.sections as string[]) : [],
    }));

    return { rows, configured: rows.length > 0 };
  } catch {
    // Table missing — the migration has not been applied yet.
    return { rows: [], configured: false };
  }
}

export default async function AdminUsersPage() {
  const admin = await getAdminUser();

  if (!isOwner(admin)) {
    return (
      <main className="min-h-screen bg-ink px-6 py-12">
        <div className="mx-auto w-full max-w-[720px]">
          <Link
            href="/admin"
            className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
          >
            ← all sections
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-neutral-0">Owners only</h1>
          <p className="mt-4 max-w-[52ch] text-sm text-subtle">
            Only an owner can change who has access.
          </p>
        </div>
      </main>
    );
  }

  const { rows, configured } = await loadAdmins();
  const sectionKeys = Object.entries(CONTENT_SECTIONS).map(([key, config]) => ({
    key,
    label: config.label,
  }));

  return (
    <main className="min-h-screen bg-ink px-6 py-12">
      <div className="mx-auto w-full max-w-[960px]">
        <Link
          href="/admin"
          className="font-mono text-xs uppercase tracking-widest text-subtle hover:text-neutral-0"
        >
          ← all sections
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-neutral-0">People</h1>
        <p className="mt-2 max-w-[62ch] text-sm text-subtle">
          An owner can edit every section and manage this list. An editor can edit only the
          sections ticked for them.
        </p>

        {!configured && (
          <p
            role="alert"
            className="mt-6 rounded border border-orange-500/40 bg-orange-500/10 px-4 py-3 text-sm text-orange-200"
          >
            No one is listed yet, so <strong>every signed-in account currently has full
            access</strong> — the behaviour the CMS has always had. Apply
            supabase/migrations/0005_admin_users.sql and add yourself as owner to start
            enforcing.
          </p>
        )}

        <UserTable rows={rows} sections={sectionKeys} currentUserId={admin!.userId} />
      </div>
    </main>
  );
}
