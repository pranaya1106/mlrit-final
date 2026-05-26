import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';
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
      />

      {data.bullets && (
        <Section>
          <H2 italic="points">Key</H2>
          <ul className="mt-6 grid md:grid-cols-2 gap-x-10 gap-y-3.5">
            {data.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-[1.02rem] text-foreground">
                <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
                {b}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {data.cards && (
        <Section surface={!data.bullets}>
          <H2 italic="in detail">Highlights</H2>
          <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.cards.map((c) => (
              <div key={c.title} className="rounded-2xl border border-border bg-white p-7 hover:border-primary hover:-translate-y-1 transition-all">
                <div className="font-sans font-extrabold text-foreground text-lg">{c.title}</div>
                <p className="mt-2 text-muted leading-relaxed text-[0.96rem]">{c.body}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section surface>
        <H2 italic="research areas">Browse other</H2>
        <div className="mt-6 flex flex-wrap gap-2">
          {RESEARCH_NAV.filter((n) => n.slug && n.slug !== params.slug).map((n) => (
            <a key={n.slug} href={`/research/${n.slug}`} className="px-3.5 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary transition-colors text-sm">
              {n.label}
            </a>
          ))}
        </div>
      </Section>
    </>
  );
}
