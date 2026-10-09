import type { CollectionConfig } from 'payload';

import { CONTENT_SECTIONS } from '@/lib/content/sections';

import { isOwner, isOwnerField, isSignedIn } from '../access';

/**
 * Admin accounts. Replaces the `admin_users` table: `role` is the same
 * owner/editor split, and `sections` the same per-section allow list, so the
 * existing rows migrate across unchanged.
 *
 * Unlike the old table there is no bootstrap mode. An empty admin_users table
 * granted everyone owner, which meant permissions were never actually enforced
 * until the first row existed; Payload creates the first user through its own
 * one-time signup screen instead, and everyone after that is explicit.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    cookies: {
      // The session cookie must not travel over plain HTTP in production.
      // Tied to NODE_ENV rather than hardcoded true so local development over
      // http://localhost keeps working — but it does mean a production deploy
      // served without TLS cannot log in, which is the intended pressure.
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  admin: { useAsTitle: 'email', group: 'Administration' },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data;
        // The first account must be an owner. `role` defaults to editor and
        // only an owner may change it, so a first user created as an editor
        // would leave nobody able to promote anyone — the CMS locked out of
        // itself. Payload's create-first-user screen runs before any owner
        // exists, which is exactly when that happens.
        const { totalDocs } = await req.payload.count({
          collection: 'users',
          overrideAccess: true,
        });
        return totalDocs === 0 ? { ...data, role: 'owner' } : data;
      },
    ],
  },
  access: {
    // Anyone signed in can read the user list (the admin UI needs it), but only
    // an owner may create, change or delete accounts — an editor must not be
    // able to widen its own `sections` list.
    read: isSignedIn,
    create: isOwner,
    update: isOwner,
    delete: isOwner,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Owner — full access', value: 'owner' },
        { label: 'Editor — named sections only', value: 'editor' },
      ],
      access: { update: isOwnerField },
    },
    {
      name: 'sections',
      type: 'select',
      hasMany: true,
      label: 'Editable sections',
      admin: {
        condition: (data) => data?.role !== 'owner',
        description: 'Sections this editor may change. Owners may change everything.',
      },
      access: { update: isOwnerField },
      options: Object.entries(CONTENT_SECTIONS).map(([value, config]) => ({
        value,
        label: config.label,
      })),
    },
  ],
};
