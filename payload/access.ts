import type { Access, FieldAccess } from 'payload';

import { canManageFaculty, canSeeSection, isOwnerUser, type AdminLike } from '../lib/content/visibility';

/**
 * The admin-account shape these rules read. Payload types `req.user` as
 * `UntypedUser` until `payload generate:types` has run against a live database;
 * narrowing here keeps the rules honest without blocking on that, and the
 * generated `User` type can replace it afterwards.
 */
type AdminUser = AdminLike;

const asAdmin = (user: unknown): AdminUser => (user ?? null) as AdminUser;

export const isOwner: Access = ({ req: { user } }) => isOwnerUser(asAdmin(user));

export const isOwnerField: FieldAccess = ({ req: { user } }) => isOwnerUser(asAdmin(user));

export const isSignedIn: Access = ({ req: { user } }) => Boolean(user);

/**
 * An owner may edit every section; an editor only the `page/section` keys
 * listed on its account. The list is owner-writable only, so an editor cannot
 * widen its own access.
 */
export const canEditSection =
  (sectionKey: string): Access =>
  ({ req: { user } }) =>
    canSeeSection(asAdmin(user), sectionKey);

/** Faculty: the owner, or an editor whose account has the faculty box ticked. */
export const canEditFaculty: Access = ({ req: { user } }) => canManageFaculty(asAdmin(user));

/**
 * Sidebar and route visibility, the counterpart of the rules above: a screen an
 * account may not edit is not shown to it at all. Used as `admin.hidden`, which
 * Payload calls with the signed-in user.
 */
export const hiddenUnlessSection =
  (sectionKey: string) =>
  ({ user }: { user: unknown }): boolean =>
    !canSeeSection(asAdmin(user), sectionKey);

export const hiddenUnlessFaculty = ({ user }: { user: unknown }): boolean => !canManageFaculty(asAdmin(user));

export const hiddenUnlessOwner = ({ user }: { user: unknown }): boolean => !isOwnerUser(asAdmin(user));
