import type { Metadata } from 'next';
import { Blocks } from '@/components/InfoPageRenderer';
import { RESEARCH_OVERVIEW } from '@/lib/research';
import ResearchHero from '@/components/ResearchHero';
import ResearchQuickNav from '@/components/ResearchQuickNav';
import ResearchAreasGrid from '@/components/ResearchAreasGrid';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = { title: 'Research — Overview — MLRIT' };

const NAV_ITEMS = [
  { id: 'research-overview', label: 'Overview' },
];

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

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      <ResearchAreasGrid />

      <div id="research-overview" className="bg-white">
        <div className="w-full px-6 md:px-10 lg:px-12 py-10 md:py-14 space-y-10 md:space-y-14">
          <Blocks blocks={rest} />
        </div>
      </div>

        </div>
      </div>
    </>
  );
}
