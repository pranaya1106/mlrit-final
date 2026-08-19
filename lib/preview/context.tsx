'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Live preview plumbing.
 *
 * The admin editor embeds the real homepage in an iframe and pushes draft
 * content over postMessage. Nothing here touches the database: overrides live
 * in React state for the lifetime of the iframe and vanish on reload.
 *
 * Preview mode is detected client-side from the query string rather than via
 * `searchParams` in the page. Reading searchParams server-side would opt `/`
 * out of static rendering and kill its ISR, for a feature only the admin sees.
 */

export const PREVIEW_PARAM = '__preview';

export const MESSAGE = {
  update: 'cms-preview-update',
  scroll: 'cms-preview-scroll',
  ready: 'cms-preview-ready',
} as const;

/** Stable DOM id for a section, e.g. "home/hero" -> "cms-section-home-hero". */
export const sectionDomId = (sectionKey: string): string =>
  `cms-section-${sectionKey.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

type Overrides = Record<string, Record<string, string>>;

const PreviewContext = createContext<Overrides>({});

const isPreviewWindow = (): boolean => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === '1';
};

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Overrides>({});

  const scrollToSection = useCallback((sectionKey: string) => {
    const el = document.getElementById(sectionDomId(sectionKey));
    if (!el) return;
    // Next frame, so a freshly applied override has painted before we measure.
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  useEffect(() => {
    if (!isPreviewWindow()) return;

    function onMessage(event: MessageEvent) {
      // Same-origin only: this listener applies arbitrary text to the page.
      if (event.origin !== window.location.origin) return;

      const data = event.data as { type?: string; payload?: Record<string, unknown> } | null;
      if (!data || typeof data !== 'object') return;

      if (data.type === MESSAGE.update) {
        const sectionKey = data.payload?.sectionKey;
        const content = data.payload?.content;
        if (typeof sectionKey !== 'string' || !content || typeof content !== 'object') return;

        // Only string values are renderable; ignore anything else.
        const clean: Record<string, string> = {};
        for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
          if (typeof value === 'string') clean[key] = value;
        }

        setOverrides((current) => ({ ...current, [sectionKey]: clean }));
        return;
      }

      if (data.type === MESSAGE.scroll) {
        const sectionKey = data.payload?.sectionKey;
        if (typeof sectionKey === 'string') scrollToSection(sectionKey);
      }
    }

    window.addEventListener('message', onMessage);

    // Tell the editor we are listening; it replies with the current draft.
    if (window.parent !== window) {
      window.parent.postMessage({ type: MESSAGE.ready }, window.location.origin);
    }

    return () => window.removeEventListener('message', onMessage);
  }, [scrollToSection]);

  return <PreviewContext.Provider value={overrides}>{children}</PreviewContext.Provider>;
}

/**
 * Draft content for a section, or undefined outside preview. Components merge
 * this over their props, so their existing fallback logic is untouched.
 */
export function usePreviewOverride(sectionKey: string): Record<string, string> | undefined {
  const overrides = useContext(PreviewContext);
  return overrides[sectionKey];
}

/** Merges an override over props; override keys win when present. */
export function useMergedSection<T extends Record<string, unknown>>(
  sectionKey: string,
  props: T
): T & Record<string, string | undefined> {
  const override = usePreviewOverride(sectionKey);
  return useMemo(() => ({ ...props, ...(override ?? {}) }), [props, override]);
}
