/**
 * Who may see and change what in the admin. One place for the rules, used both
 * to refuse a save (payload/access.ts) and to hide the screen from the sidebar
 * (admin.hidden), so a restricted account is neither shown nor allowed what it
 * has not been given.
 *
 * An owner has everything. An editor has only the sections listed on its
 * account, plus Faculty when that box is ticked.
 */
export type AdminLike = {
  role?: string | null;
  sections?: readonly string[] | null;
  canEditFaculty?: boolean | null;
} | null | undefined;

export const isOwnerUser = (user: AdminLike): boolean => user?.role === 'owner';

export const canSeeSection = (user: AdminLike, sectionKey: string): boolean =>
  isOwnerUser(user) || Boolean(user?.sections?.includes(sectionKey));

export const canManageFaculty = (user: AdminLike): boolean =>
  isOwnerUser(user) || user?.canEditFaculty === true;
