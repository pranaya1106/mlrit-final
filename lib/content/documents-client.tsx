'use client';

import { createContext, useContext } from 'react';

import { DEFAULT_BROCHURE } from '@/lib/content/documents';

/**
 * Site-wide document links, for client components that cannot fetch.
 *
 * The admissions page links the prospectus but is a client component with
 * hooks, so it cannot be async and cannot read the CMS itself. The root
 * layout already resolves the URL for the side button and the chatbot; this
 * hands the same value to anything else that needs it.
 */
const BrochureContext = createContext<string>(DEFAULT_BROCHURE);

export function BrochureProvider({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return <BrochureContext.Provider value={value}>{children}</BrochureContext.Provider>;
}

export const useBrochureUrl = (): string => useContext(BrochureContext);
