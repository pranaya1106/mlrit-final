/**
 * Resolve a stored media value to something an <img>/<video> can load.
 *
 * blob: URLs, absolute URLs and rooted paths are already loadable; a bare
 * storage key is served through the /cdn proxy.
 *
 * Deliberately NOT in lib/preview/context.tsx: that module is 'use client', so
 * a Server Component importing this from there receives a client reference
 * proxy rather than a function, and calling it throws during prerender
 * ("TypeError: i is not a function"). A neutral module is importable by both.
 */
export const resolveAssetUrl = (
  value?: string,
  options?: { allowTransient?: boolean }
): string | undefined => {
  if (!value) return undefined;

  // blob:/data: are document-scoped handles. They are legitimate ONLY while the
  // admin live preview holds a not-yet-uploaded file (allowTransient). Reaching
  // here from saved content means a bad value was persisted despite the
  // server-side guard — return undefined so the component falls back to its
  // built-in asset rather than rendering a permanently broken element.
  if (/^(blob|data):/i.test(value)) {
    return options?.allowTransient ? value : undefined;
  }

  if (value.startsWith('/') || /^https?:\/\//i.test(value)) return value;
  return `/cdn/${value}`;
};
