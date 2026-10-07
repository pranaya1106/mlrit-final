import type { Access, FieldAccess } from 'payload';

/**
 * The admin-account shape these rules read. Payload types `req.user` as
 * `UntypedUser` until `payload generate:types` has run against a live database;
 * narrowing here keeps the rules honest without blocking on that, and the
 * generated `User` type can replace it afterwards.
 */
type AdminUser = { role?: 'owner' | 'editor'; sections?: string[] | null } | null;

const asAdmin = (user: unknown): AdminUser => (user ?? null) as AdminUser;

export const isOwner: Access = ({ req: { user } }) => asAdmin(user)?.role === 'owner';

export const isOwnerField: FieldAccess = ({ req: { user } }) => asAdmin(user)?.role === 'owner';

export const isSignedIn: Access = ({ req: { user } }) => Boolean(user);

/**
 * An owner may edit every section; an editor only the `page/section` keys
 * listed on its account. The list is owner-writable only, so an editor cannot
 * widen its own access.
 */
export const canEditSection =
  (sectionKey: string): Access =>
  ({ req: { user } }) => {
    const admin = asAdmin(user);
    if (!admin) return false;
    if (admin.role === 'owner') return true;
    return Boolean(admin.sections?.includes(sectionKey));
  };
