import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Blocks } from '@/components/InfoPageRenderer';
import { RESEARCH_OVERVIEW } from '@/lib/research';

export const metadata: Metadata = { title: 'Research — Overview — MLRIT' };

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="R&D Cell"
        title={RESEARCH_OVERVIEW.title}
        italic={RESEARCH_OVERVIEW.italic}
        dek={RESEARCH_OVERVIEW.dek}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }, { label: 'Overview' }]}
        variant="green"
      />
      <div className="bg-white">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 space-y-14 md:space-y-20">
          <Blocks blocks={RESEARCH_OVERVIEW.blocks} />
        </div>
      </div>
    </>
  );
}
