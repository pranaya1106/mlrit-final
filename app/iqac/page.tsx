import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2 } from '@/components/PageSection';
import Reveal from '@/components/motion/Reveal';
import IQACQuickNav from '@/components/IQACQuickNav';

export const metadata: Metadata = { title: 'IQAC — MLRIT' };

export default function IQACPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality Assurance"
        title="Internal Quality Assurance Cell (IQAC)"
        italic=""
        dek="With a prime mission to develop a system of conscious, consistent and catalytic improvement in the overall performance of the institution, IQAC has been established at MLRIT to promote holistic academic excellence."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac" />

      <Section id="overview">
        <H2 italic="">Overview</H2>
        <div className="mt-6 grid md:grid-cols-2 gap-8">
          <Reveal preset="right">
            <p className="text-foreground leading-relaxed text-[1.05rem]">
              IQAC is a part of the institution's system and works towards realisation of the goals of quality enhancement and sustenance. All the efforts and measures of the institute are channelised towards promoting holistic academic excellence through IQAC.
            </p>
            <p className="mt-4 text-muted leading-relaxed text-[1rem]">
              The cell coordinates self-study reports, AQAR submissions, external audits, outcome-based education initiatives and benchmarking activities — acting as the nodal agency for all internal quality assurance activities.
            </p>
          </Reveal>
          <Reveal preset="up" delay={0.1}>
            <div className="rounded-2xl border-2 border-secondary bg-green-50/40 p-7">
              <div className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary mb-3">Vision</div>
              <p className="font-sans font-extrabold text-foreground text-[1.1rem] leading-snug">
                To ensure quality culture as the prime concern of the Institution through institutionalising and internalising of all the initiatives taken with internal and external support.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
