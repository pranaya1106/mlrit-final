'use client';

import { createContext, useContext } from 'react';

import { asText } from '@/lib/content/sections';
import { usePreviewOverride } from '@/lib/preview/context';

/**
 * Live-editable text on a Server-Component page.
 *
 * Pages wired after the homepage read their copy on the server, so the
 * editor's draft messages could never reach them — the preview only changed
 * after a save. This closes that gap without moving the page off static
 * rendering: the server still resolves the saved content and passes it down
 * as a plain prop, and only the leaf that prints the string is a client
 * component, subscribing to the same draft store the homepage sections use.
 *
 * Precedence is draft > saved > the fallback in the JSX, so an unsaved
 * section still renders exactly what the page shipped with.
 */
const SectionContext = createContext<{ key: string; content: Record<string, unknown> }>({
  key: '',
  content: {},
});

export function SectionContent({
  sectionKey,
  content,
  children,
}: {
  sectionKey: string;
  content: Record<string, unknown>;
  children: React.ReactNode;
}) {
  return (
    <SectionContext.Provider value={{ key: sectionKey, content }}>
      {children}
    </SectionContext.Provider>
  );
}

/** One field, draft-aware. `children` is the fallback baked into the page. */
export function Copy({ k, children }: { k: string; children: string }) {
  const { key, content } = useContext(SectionContext);
  const draft = usePreviewOverride(key);

  const live = draft && k in draft ? draft[k] : content[k];
  return <>{asText(live, children)}</>;
}
