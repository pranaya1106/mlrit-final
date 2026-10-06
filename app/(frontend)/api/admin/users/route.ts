import { NextResponse } from 'next/server';

import { getAdminUser, isOwner } from '@/lib/content/permissions';
import { CONTENT_SECTIONS } from '@/lib/content/sections';
import { getServiceClient } from '@/lib/supabase';

const VALID_SECTIONS = new Set(Object.keys(CONTENT_SECTIONS));

/**
 * Owner-only management of admin_users.
 *
 * Writes go through the service-role client because admin_users grants no
 * write policy to authenticated users by design — a self-update policy would
 * let an editor promote themselves. That makes the owner check below the only
 * thing standing between a signed-in editor and full access, so it runs before
 * anything is read or written, and is not delegated to middleware.
 */
export async function POST(request: Request) {
  const admin = await getAdminUser();

  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isOwner(admin)) {
    return NextResponse.json({ error: 'Owners only.' }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const { action, userId, email, role, sections } = (payload ?? {}) as {
    action?: unknown;
    userId?: unknown;
    email?: unknown;
    role?: unknown;
    sections?: unknown;
  };

  const client = getServiceClient();

  try {
    if (action === 'add') {
      if (typeof email !== 'string' || !email.trim()) {
        return NextResponse.json({ error: 'An email address is required.' }, { status: 400 });
      }

      // Grants rights to an account that already exists; it never creates one.
      // Inviting someone who has never signed in would write a row keyed to a
      // user id that does not exist, and the foreign key would reject it.
      const { data: users, error: listError } = await client.auth.admin.listUsers();
      if (listError) throw listError;

      const match = users.users.find(
        (u) => (u.email ?? '').toLowerCase() === email.trim().toLowerCase()
      );
      if (!match) {
        return NextResponse.json(
          { error: 'No account with that email has signed in yet.' },
          { status: 404 }
        );
      }

      const { error } = await client
        .from('admin_users')
        .upsert(
          { user_id: match.id, email: match.email ?? email.trim(), role: 'editor' },
          { onConflict: 'user_id' }
        );
      if (error) throw error;

      return NextResponse.json({ ok: true });
    }

    if (typeof userId !== 'string' || !userId) {
      return NextResponse.json({ error: 'userId is required.' }, { status: 400 });
    }

    // Guards against an owner locking everyone out of user management by
    // demoting or deleting their own account.
    if (userId === admin.userId && (action === 'remove' || role === 'editor')) {
      return NextResponse.json(
        { error: 'You cannot remove your own owner access.' },
        { status: 400 }
      );
    }

    if (action === 'remove') {
      const { error } = await client.from('admin_users').delete().eq('user_id', userId);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    if (action === 'update') {
      const patch: Record<string, unknown> = {};

      if (role !== undefined) {
        if (role !== 'owner' && role !== 'editor') {
          return NextResponse.json({ error: 'role must be owner or editor.' }, { status: 400 });
        }
        patch.role = role;
      }

      if (sections !== undefined) {
        if (!Array.isArray(sections) || sections.some((s) => typeof s !== 'string')) {
          return NextResponse.json({ error: 'sections must be a list of keys.' }, { status: 400 });
        }
        // Only keys that exist. An unknown key grants nothing today, but it
        // would silently start granting access the day someone adds a section
        // with that name.
        const unknown = (sections as string[]).filter((s) => !VALID_SECTIONS.has(s));
        if (unknown.length > 0) {
          return NextResponse.json(
            { error: `Unknown section: ${unknown[0]}` },
            { status: 400 }
          );
        }
        patch.sections = sections;
      }

      if (Object.keys(patch).length === 0) {
        return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
      }

      const { error } = await client.from('admin_users').update(patch).eq('user_id', userId);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  } catch (err) {
    console.error('[admin/users]', err);
    return NextResponse.json({ error: 'Failed to update access.' }, { status: 500 });
  }
}
