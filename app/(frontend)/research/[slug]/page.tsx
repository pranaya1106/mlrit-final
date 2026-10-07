import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Blocks } from '@/components/InfoPageRenderer';
import { RESEARCH_PAGES, RESEARCH_NAV } from '@/lib/research';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import { getSection } from '@/lib/content/client';
import { asText } from '@/lib/content/sections';

export function generateStaticParams() {
  return Object.keys(RESEARCH_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const p = RESEARCH_PAGES[params.slug];
  if (!p) return { title: 'Research — MLRIT' };
  return { title: `${p.title}${p.italic ? ' ' + p.italic : ''} — MLRIT Research` };
}

export default async function ResearchSubPage(props: { params: Promise<{ slug: string }> }) {
  const row = await getSection('site', 'research-profile').catch(() => null);
  const c = (row?.content ?? {}) as Record<string, unknown>;
  const copy = (key: string, fallback: string) => asText(c[key], fallback);
  const params = await props.params;
  const data = RESEARCH_PAGES[params.slug];
  if (!data) notFound();
  return (
    <>
      <ResearchQuickNav active={`/research/${params.slug}`} />


      <div className="bg-white">
        <div className="w-full px-6 md:px-10 lg:px-12 py-10 md:py-14 space-y-14 md:space-y-20">
          <Blocks blocks={data.blocks} />
        </div>
      </div>

      {/* Browse other research areas */}
      <section className="bg-cream-2 py-14 md:py-20">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <h2 className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.5rem,2.4vw,2rem)] mb-6">
            Browse other{' '}
            <span className="font-display italic font-medium text-secondary">{copy('researchAreas', 'research areas')}</span>
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {RESEARCH_NAV.filter((n) => n.slug !== params.slug).map((n) => (
              <a
                key={n.slug}
                href={n.slug ? `/research/${n.slug}` : '/research'}
                className="px-4 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm font-sans font-semibold"
              >
                {n.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
