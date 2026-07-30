import type { Metadata } from 'next';
import { Blocks } from '@/components/InfoPageRenderer';
import { RESEARCH_OVERVIEW } from '@/lib/research';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import ResearchHero from '@/components/ResearchHero';
import ResearchAreasGrid from '@/components/ResearchAreasGrid';

export const metadata: Metadata = { title: 'Research — Overview — MLRIT' };

export default function ResearchPage() {
  // The hero shows stats + intro; the areas grid replaces the intro `cards` block.
  // Skip those front blocks and render the R&D Cell / centres / facilities content below.
  const laterBlocks = RESEARCH_OVERVIEW.blocks.filter(
    (b) => b.kind !== 'stat-strip' && !(b.kind === 'cards')
  );
  // Drop the first "Explore the Research section" heading + its intro paragraph too.
  const startIdx = laterBlocks.findIndex(
    (b) => b.kind === 'heading' && 'italic' in b && b.italic?.includes('nurturing')
  );
  const rest = startIdx >= 0 ? laterBlocks.slice(startIdx) : laterBlocks;

  return (
    <>
      <ResearchHero
        title={RESEARCH_OVERVIEW.title}
        italic={RESEARCH_OVERVIEW.italic}
        dek={RESEARCH_OVERVIEW.dek}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Research' }, { label: 'Overview' }]}
      />
      <ResearchQuickNav active="/research" />
      <ResearchAreasGrid />

      <div className="bg-white">
        <div className="w-full px-6 md:px-10 lg:px-12 py-10 md:py-14 space-y-10 md:space-y-14">
          <Blocks blocks={rest} />
        </div>
      </div>
    </>
  );
}
