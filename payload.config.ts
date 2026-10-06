import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { Media } from './payload/collections/Media';
import { Users } from './payload/collections/Users';
import { sectionGlobals } from './payload/globals';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    // Mounted at /cms, not /admin, so the outgoing hand-rolled admin keeps
    // working side by side during the migration — running both is how the
    // migrated content gets checked against the old editor. Move to /admin
    // once app/(frontend)/admin is deleted.
    importMap: { baseDir: dirname },
    livePreview: {
      breakpoints: [
        { name: 'mobile', label: 'Mobile', width: 390, height: 844 },
        { name: 'tablet', label: 'Tablet', width: 834, height: 1112 },
        { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
      ],
    },
  },
  routes: { admin: '/cms', api: '/cms-api' },
  collections: [Users, Media],
  globals: sectionGlobals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // No dev-time schema push. Left on, `next dev` silently syncs the schema
    // and writes a `dev` row into payload_migrations, after which
    // `payload migrate` refuses to run without a "data loss will occur" prompt
    // because it can no longer tell what is already applied. Migrations are the
    // only way the schema changes here, which is also what the eventual move to
    // RDS needs.
    push: false,
    // Payload's tables live beside the existing public.content_blocks rather
    // than in it. Keeping them in their own schema means the migration can be
    // re-run and the old CMS rolled back to without either side colliding.
    schemaName: 'payload',
  }),
  sharp,
})
