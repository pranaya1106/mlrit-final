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
  auth: true,
  admin: { useAsTitle: 'email', group: 'Administration' },
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
