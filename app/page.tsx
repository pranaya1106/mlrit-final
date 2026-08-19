import Banners from '@/components/sections/Banners';
import { resolveAssetUrl } from '@/lib/cdn/url';
import { PreviewProvider } from '@/lib/preview/context';
import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Achievements from '@/components/sections/Achievements';
import WhyMLRIT from '@/components/sections/WhyMLRIT';
import SuccessStories from '@/components/sections/SuccessStories';
import Programs from '@/components/sections/Programs';
import Placements from '@/components/sections/Placements';
import Events from '@/components/sections/Events';
import Testimonials from '@/components/sections/Testimonials';

const isFilled = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Copy for one CMS section. Returns {} on any failure — missing env vars,
 * network error, no row, or a row missing any required field — and the section
 * component falls back to its own hardcoded defaults. Every field is required
 * together so a partial row can never mix CMS text with fallback text. Imported
 * dynamically because lib/supabase.ts throws at module scope when its env vars
 * are absent, which a top-level import could not catch.
 */
async function getSectionCopy<K extends string, O extends string = never>(
  section: string,
  fields: readonly K[],
  optional: readonly O[] = [] as readonly O[]
): Promise<Partial<Record<K | O, string>>> {
  try {
    const { getSection } = await import('@/lib/content/client');
    const row = await getSection('home', section);
    const content = (row?.content ?? {}) as Record<string, unknown>;

    if (fields.every((field) => isFilled(content[field]))) {
      const required = fields.map((field) => [field, content[field] as string] as const);
      // Optional fields (media) are carried through only when populated; an
      // empty one means "nothing uploaded", and the component's own default wins.
      const extras = optional
        .filter((field) => isFilled(content[field]))
        .map((field) => [field, content[field] as string] as const);

      return Object.fromEntries([...required, ...extras]) as Partial<Record<K | O, string>>;
    }
  } catch {
    // fall through to the defaults baked into the component
  }
  return {};
}

const HEADLINE_FIELDS = ['headlineLead', 'headlineAccent', 'body'] as const;

export const revalidate = 60;

export default async function HomePage() {
  // Fetched together so one slow section cannot serialise behind another.
  const [hero, achievements, programs, whyMlrit] = await Promise.all([
    getSectionCopy('hero', HEADLINE_FIELDS),
    getSectionCopy('achievements', HEADLINE_FIELDS),
    getSectionCopy('programs', HEADLINE_FIELDS),
    getSectionCopy('why-mlrit', ['heading', 'body'] as const, ['video'] as const),
  ]);

  return (
    <PreviewProvider>
      <Hero {...hero} />
      <Banners />
      <Stats />
      {/* New order: Accreditations → Why MLRIT → Success Stories THEN Programs */}
      <Achievements {...achievements} />
      <WhyMLRIT {...whyMlrit} video={resolveAssetUrl(whyMlrit.video)} />
      <SuccessStories />
      <Programs {...programs} />
      <Placements />
      <Testimonials />
      <Events />
    </PreviewProvider>
  );
}
