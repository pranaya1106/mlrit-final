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
    // Where files land is set by the s3Storage plugin when S3_BUCKET is
    // configured; this stays as the local fallback for development without
    // AWS credentials. On the EC2 host the bucket is authoritative, so an
    // instance replacement never takes the media with it.
    staticDir: 'public/uploads',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [{ name: 'thumbnail', width: 400, height: undefined, position: 'centre' }],
  },
  fields: [{ name: 'alt', type: 'text', label: 'Alt text' }],
};
