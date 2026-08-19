'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';

export { resolveAssetUrl } from '@/lib/cdn/url';

/**
 * Live preview plumbing.
 *
 * The admin editor embeds the real homepage in an iframe and pushes draft
 * content over postMessage. Nothing here touches the database: overrides live
 * in memory for the lifetime of the iframe and vanish on reload.
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
  exitFullscreen: 'cms-preview-exit-fullscreen',
} as const;

/** Stable DOM id for a section, e.g. "home/hero" -> "cms-section-home-hero". */
export const sectionDomId = (sectionKey: string): string =>
  `cms-section-${sectionKey.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;

type SectionOverride = Record<string, string>;

const shallowEqual = (a?: SectionOverride, b?: SectionOverride): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((k) => a[k] === b[k]);
};

/**
 * Overrides live in a tiny external store rather than component state.
 *
 * With a plain context value, every message allocated a new object and
 * re-rendered ALL section consumers — four framer-motion trees per keystroke,
 * even when only one section's text changed. Subscribing per section lets
 * useSyncExternalStore bail out when a section's slice is referentially
 * unchanged, so typing in one section re-renders only that section.
 */
function createOverrideStore() {
  let sections: Record<string, SectionOverride> = {};
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSection(key: string): SectionOverride | undefined {
      return sections[key];
    },
    setSection(key: string, value: SectionOverride) {
      // Identical payload => no new reference => no re-render anywhere.
      if (shallowEqual(sections[key], value)) return;
      sections = { ...sections, [key]: value };
      listeners.forEach((l) => l());
    },
  };
}

type OverrideStore = ReturnType<typeof createOverrideStore>;

const StoreContext = createContext<OverrideStore | null>(null);

const isPreviewWindow = (): boolean => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === '1';
};

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<OverrideStore>();
  if (!storeRef.current) storeRef.current = createOverrideStore();
  const store = storeRef.current;

  // Object URLs minted inside THIS document, keyed "sectionKey::field", with
  // the Blob each was made from so an unchanged file is not re-minted.
  const localUrlsRef = useRef<Record<string, { blob: Blob; url: string }>>({});

  const scrollToSection = useCallback((sectionKey: string) => {
    const el = document.getElementById(sectionDomId(sectionKey));
    if (!el) return;
    // Next frame, so a freshly applied override has painted before we measure.
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }, []);

  useEffect(() => {
    if (!isPreviewWindow()) return;

    // Flag the document so scroll-smoothing effects (ScrollStack's lerp) can
    // run instantly here. Inside a preview pane the editor wants the wheel to
    // map 1:1 to the page, not to an eased approximation of it.
    const root = document.documentElement;
    root.dataset.cmsPreview = '1';
    const previousScrollBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    function onMessage(event: MessageEvent) {
      // Same-origin only: this listener applies arbitrary text to the page.
      if (event.origin !== window.location.origin) return;

      const data = event.data as { type?: string; payload?: Record<string, unknown> } | null;
      if (!data || typeof data !== 'object') return;

      if (data.type === MESSAGE.update) {
        const sectionKey = data.payload?.sectionKey;
        const content = data.payload?.content;
        if (typeof sectionKey !== 'string' || !content || typeof content !== 'object') return;

        const clean: Record<string, string> = {};
        for (const [key, value] of Object.entries(content as Record<string, unknown>)) {
          if (typeof value === 'string') {
            clean[key] = value;
            continue;
          }

          // A File/Blob arrives when the editor picks a file that has not
          // finished uploading. An object URL is scoped to the document that
          // created it, so the parent's URL is unresolvable here — mint our
          // own against this iframe's document instead.
          // Structured clone may downgrade File to Blob, so accept both.
          if (value instanceof Blob) {
            const slot = `${sectionKey}::${key}`;
            const previous = localUrlsRef.current[slot];

            // pushDraft re-sends the same File on every keystroke. Re-minting
            // each time would revoke the URL a <video> is still loading and
            // surface ERR_FILE_NOT_FOUND, so reuse it unless the file changed.
            if (previous && previous.blob === value) {
              clean[key] = previous.url;
              continue;
            }

            if (previous) URL.revokeObjectURL(previous.url);
            const url = URL.createObjectURL(value);
            localUrlsRef.current[slot] = { blob: value, url };
            clean[key] = url;
          }
        }

        store.setSection(sectionKey, clean);
        return;
      }

      if (data.type === MESSAGE.scroll) {
        const sectionKey = data.payload?.sectionKey;
        if (typeof sectionKey === 'string') scrollToSection(sectionKey);
      }
    }

    // Escape inside the iframe never reaches the parent document, so forward it.
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape' || window.parent === window) return;
      window.parent.postMessage({ type: MESSAGE.exitFullscreen }, window.location.origin);
    }

    window.addEventListener('message', onMessage);
    window.addEventListener('keydown', onKeyDown);

    // Tell the editor we are listening; it replies with the current draft.
    if (window.parent !== window) {
      window.parent.postMessage({ type: MESSAGE.ready }, window.location.origin);
    }

    const localUrls = localUrlsRef.current;
    return () => {
      window.removeEventListener('message', onMessage);
      window.removeEventListener('keydown', onKeyDown);
      delete root.dataset.cmsPreview;
      root.style.scrollBehavior = previousScrollBehavior;
      Object.values(localUrls).forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [scrollToSection, store]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

/**
 * Draft content for one section, or undefined outside preview.
 *
 * Subscribes to that section only — an update to a different section does not
 * re-render this component.
 */
export function usePreviewOverride(sectionKey: string): SectionOverride | undefined {
  const store = useContext(StoreContext);

  const subscribe = useCallback(
    (listener: () => void) => (store ? store.subscribe(listener) : () => {}),
    [store]
  );
  const getSnapshot = useCallback(() => store?.getSection(sectionKey), [store, sectionKey]);

  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

/**
 * Merges an override over props; override keys win when present.
 *
 * Typed as the component's own props: the editor sends the fields that section
 * declares, so the shapes line up. Values are unknown at runtime, hence the
 * cast — components keep their existing `?.trim() || DEFAULT` guards, which is
 * what makes a malformed draft render the fallback rather than crash.
 */
export function useMergedSection<T extends Record<string, unknown>>(
  sectionKey: string,
  props: T
): T {
  const override = usePreviewOverride(sectionKey);
  return useMemo(() => ({ ...props, ...(override ?? {}) }) as T, [props, override]);
}
