/**
 * Stable DOM id for a section, e.g. "home/hero" -> "cms-section-home-hero".
 *
 * Deliberately NOT in lib/preview/context.tsx: that module is 'use client', so
 * a Server Component importing this from there receives a client reference
 * proxy rather than a function, and calling it throws at render
 * ("sectionDomId is not a function"). A neutral module is importable by both.
 * Same reasoning as lib/cdn/url.ts.
 */
export const sectionDomId = (sectionKey: string): string =>
  `cms-section-${sectionKey.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
