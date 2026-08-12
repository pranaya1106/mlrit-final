import Hero from '@/components/sections/Hero';
import Stats from '@/components/sections/Stats';
import Achievements from '@/components/sections/Achievements';
import WhyMLRIT from '@/components/sections/WhyMLRIT';
import SuccessStories from '@/components/sections/SuccessStories';
import Programs from '@/components/sections/Programs';
import Placements from '@/components/sections/Placements';
import Events from '@/components/sections/Events';
import Testimonials from '@/components/sections/Testimonials';

type HeroCopy = {
  headlineLead?: string;
  headlineAccent?: string;
  body?: string;
};

const isFilled = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Hero copy from the CMS. Returns {} on any failure — missing env vars, network
 * error, no row, or a row missing any of the three fields — and Hero falls back
 * to its own hardcoded defaults. All three are required together so a partial
 * row can never mix CMS text with fallback text. Imported dynamically because
 * lib/supabase.ts throws at module scope when its env vars are absent, which a
 * top-level import could not catch.
 */
async function getHeroCopy(): Promise<HeroCopy> {
  try {
    const { getSection } = await import('@/lib/content/client');
    const section = await getSection('home', 'hero');
    const { headlineLead, headlineAccent, body } = (section?.content ?? {}) as Record<
      string,
      unknown
    >;

    if (isFilled(headlineLead) && isFilled(headlineAccent) && isFilled(body)) {
      return { headlineLead, headlineAccent, body };
    }
  } catch {
    // fall through to the defaults baked into Hero
  }
  return {};
}

export const revalidate = 60;

export default async function HomePage() {
  const hero = await getHeroCopy();

  return (
    <>
      <Hero {...hero} />
      <Stats />
      {/* New order: Accreditations → Why MLRIT → Success Stories THEN Programs */}
      <Achievements />
      <WhyMLRIT />
      <SuccessStories />
      <Programs />
      <Placements />
      <Testimonials />
      <Events />
    </>
  );
}
