import type { CollectionConfig } from 'payload';

import { isSignedIn } from '../access';

/**
 * Uploaded files. The site's media fields store a URL string rather than a
 * relationship to this collection, so that every value already in
 * content_blocks keeps working untouched; this collection is what the picker
 * uploads into and browses.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Administration' },
  access: { read: () => true, create: isSignedIn },
  upload: {
    // ponytail: local disk. Writable on a VM but NOT on Vercel/Lambda — swap in
    // @payloadcms/storage-s3 (Supabase Storage speaks S3) before deploying
    // serverless, or uploads will fail at runtime with EROFS.
    staticDir: 'public/uploads',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [{ name: 'thumbnail', width: 400, height: undefined, position: 'centre' }],
  },
  fields: [{ name: 'alt', type: 'text', label: 'Alt text' }],
};
