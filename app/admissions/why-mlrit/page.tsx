import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import AdmissionsQuickNav from '@/components/AdmissionsQuickNav';
import MLRITStory from '@/components/MLRITStory';
import WhyMLRITSections from './WhyMLRITSections';

export const metadata: Metadata = {
  title: 'Why MLRIT | Campus Life, Careers, Safety and Opportunities',
  description:
    'Discover why thousands of students choose MLRIT — a 31-acre green campus, strong placements, a safe environment, research hubs, world-class facilities, and vibrant student communities.',
  openGraph: {
    title: 'Why MLRIT | Campus Life, Careers, Safety and Opportunities',
    description:
      'Green campus. Secured futures. Safe environment. Innovation labs. Student communities. Explore the MLRIT difference.',
    url: '/admissions/why-mlrit',
  },
};

export default function WhyMLRITPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Why MLRIT"
        title="More than a degree —"
        italic="a launchpad."
        dek="MLRIT isn't just where you earn a degree — it's where you find your direction, your people, and your future."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Why MLRIT' },
        ]}
      />
      <AdmissionsQuickNav active="/admissions/why-mlrit" />

      {/* Compact intro bridge */}
      <section className="bg-[#f7f5f0] py-16 md:py-20 border-b border-border">
        <div className="max-w-[860px] mx-auto px-6 md:px-12 lg:px-20 text-center">
          <p className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-secondary font-bold mb-4">
            Five letters. One story.
          </p>
          <h2 className="font-sans font-black tracking-tighter-2 text-[clamp(1.9rem,3.5vw,3rem)] leading-[1.07] text-foreground">
            Every letter of MLRIT stands<br className="hidden sm:block" /> for something{' '}
            <span className="font-display italic font-medium text-primary">you can feel.</span>
          </h2>
          <p className="mt-5 text-muted text-[0.97rem] leading-relaxed max-w-[58ch] mx-auto">
            Scroll through Merit, Learning, Research, Innovation, and Transformation — the five pillars that shape every student&apos;s journey here.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-muted text-[0.8rem] font-mono tracking-wider">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M9 3v12M5 11l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ── Preserved MLRIT scroll component ─────────────────────── */}
      <MLRITStory />

      {/* ── All interactive story sections (client boundary) ─────── */}
      <WhyMLRITSections />
    </>
  );
}
