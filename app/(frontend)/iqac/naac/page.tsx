import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import IQACQuickNav from '@/components/IQACQuickNav';
import { Section, H2, Lede } from '@/components/PageSection';
import SideQuickNav from '@/components/SideQuickNav';
import { getSection } from '@/lib/content/client';
import { asText } from '@/lib/content/sections';

export const metadata: Metadata = { title: 'NAAC — MLRIT' };

const NAV_ITEMS = [
  { id: 'documents', label: 'Documents' },
];

export default async function NAACPage() {
  const row = await getSection('iqac', 'naac').catch(() => null);
  const c = (row?.content ?? {}) as Record<string, unknown>;
  const copy = (key: string, fallback: string) => asText(c[key], fallback);
  return (
    <>
      <PageHeader
        eyebrow="Accreditation"
        title="NAAC"
        italic="at MLRIT"
        dek="National Assessment and Accreditation Council — MLRIT's institutional accreditation, self-study reports and assessment cycle artefacts."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'NAAC' }]}
        variant="green"
      />
      <IQACQuickNav active="/iqac/naac" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

          <Section id="documents">
            <H2 italic="snapshot">{copy('accreditation', 'Accreditation')}</H2>
            <Lede>{copy('mlritIsAccreditedBy', 'MLRIT is accredited by NAAC. Below are the key documents available for public download.')}</Lede>
            <div className="mt-5 md:mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
              {['SSR — Self Study Report', 'Peer Team Report', 'IIQA — Institutional Information', 'DVV Clarifications', 'AQAR 2023-24', 'NAAC Certificate'].map((d) => (
                <div key={d} className="rounded-2xl border border-border bg-white p-4 md:p-6">
                  <div className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">{copy('document', 'Document')}</div>
                  <div className="mt-2 font-sans font-extrabold text-foreground text-lg">{d}</div>
                  <div className="mt-4 text-muted text-sm">{copy('availableOnRequestContact', 'Available on request — contact')}<a href="mailto:iqac@mlrinstitutions.ac.in" className="text-primary hover:underline">{copy('iqacMlrinstitutionsAcIn', 'iqac@mlrinstitutions.ac.in')}</a></div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted">{copy('forDirectDocumentAccess', 'For direct document access, write to the IQAC office at')}<a href="mailto:iqac@mlrinstitutions.ac.in" className="text-primary hover:underline">{copy('iqacMlrinstitutionsAcIn', 'iqac@mlrinstitutions.ac.in')}</a>.</p>
          </Section>

        </div>
      </div>
    </>
  );
}
