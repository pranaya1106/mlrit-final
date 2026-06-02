import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { Blocks } from '@/components/InfoPageRenderer';
import { RESEARCH_PAGES, RESEARCH_NAV } from '@/lib/research';

export function generateStaticParams() {
  return Object.keys(RESEARCH_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = RESEARCH_PAGES[params.slug];
  if (!p) return { title: 'Research — MLRIT' };
  return { title: `${p.title}${p.italic ? ' ' + p.italic : ''} — MLRIT Research` };
}

export default function ResearchSubPage({ params }: { params: { slug: string } }) {
  const data = RESEARCH_PAGES[params.slug];
  if (!data) notFound();
  const navItem = RESEARCH_NAV.find((n) => n.slug === params.slug);
  return (
    <>
      <PageHeader
        eyebrow={`Research · ${navItem?.label ?? ''}`}
        title={data.title}
        italic={data.italic}
        dek={data.dek}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Research', href: '/research' },
          { label: navItem?.label ?? params.slug },
        ]}
        variant="green"
      />

      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 space-y-14 md:space-y-20">
          <Blocks blocks={data.blocks} />
        </div>
      </div>

      {/* Browse other research areas */}
      <section className="bg-cream-2 py-14 md:py-20">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="font-sans font-black tracking-tighter-2 text-foreground text-[clamp(1.5rem,2.4vw,2rem)] mb-6">
            Browse other{' '}
            <span className="font-display italic font-medium text-secondary">research areas</span>
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
