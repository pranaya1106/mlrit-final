'use client';

import { usePathname } from 'next/navigation';
import { createContext, useContext } from 'react';

import { asRepeaterItems, asText } from '@/lib/content/sections';

export type HeaderOverride = {
  eyebrow?: string;
  title?: string;
  italic?: string;
  dek?: string;
};

/**
 * Header overrides for every route, fetched once in the root layout.
 *
 * A map rather than a per-page fetch: the hero renders on ~36 routes and the
 * layout already reads the CMS for the footer, so this rides along on a
 * request that was happening anyway.
 */
const HeadersContext = createContext<Record<string, HeaderOverride>>({});

export function PageHeaderProvider({
  value,
  children,
}: {
  value: Record<string, HeaderOverride>;
  children: React.ReactNode;
}) {
  return <HeadersContext.Provider value={value}>{children}</HeadersContext.Provider>;
}

/**
 * The override for the current route, or an empty object.
 *
 * usePathname rather than a prop at each call site: the component already
 * knows which page it is on, and threading a key through 36 call sites would
 * be 36 chances to typo one. Reading it client-side also keeps every route
 * statically rendered — headers() would not.
 */
export function usePageHeaderOverride(): HeaderOverride {
  const pathname = usePathname();
  const all = useContext(HeadersContext);
  return (pathname && all[pathname]) || {};
}

/** Shapes the stored repeater into the path-keyed map the context serves. */
export function headerMapFrom(value: unknown): Record<string, HeaderOverride> {
  const map: Record<string, HeaderOverride> = {};
  for (const row of asRepeaterItems(value)) {
    const path = asText(row.path);
    if (!path) continue;
    map[path] = {
      eyebrow: asText(row.eyebrow) || undefined,
      title: asText(row.title) || undefined,
      italic: asText(row.italic) || undefined,
      dek: asText(row.dek) || undefined,
    };
  }
  return map;
}
