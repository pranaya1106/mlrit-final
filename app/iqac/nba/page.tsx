import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import { Section, H2, Lede } from '@/components/PageSection';

export const metadata: Metadata = { title: 'NBA — MLRIT' };

export default function NBAPage() {
  const programmes = [
    { dept: 'CSE',  cycle: '2022-2025', status: 'Accredited' },
    { dept: 'ECE',  cycle: '2022-2025', status: 'Accredited' },
    { dept: 'EEE',  cycle: '2022-2025', status: 'Accredited' },
    { dept: 'MECH', cycle: '2022-2025', status: 'Accredited' },
    { dept: 'IT',   cycle: '2022-2025', status: 'Accredited' },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Accreditation"
        title="NBA"
        italic="programme accreditation"
        dek="National Board of Accreditation — programme-level accreditation for MLRIT's engineering branches."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'IQAC', href: '/iqac' }, { label: 'NBA' }]}
        variant="green"
      />
      <Section>
        <H2 italic="programmes">Accredited</H2>
        <Lede>Five engineering programmes currently hold NBA accreditation under the Tier-1 framework.</Lede>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left">
            <thead className="bg-warm-light/60">
              <tr>
                <th className="px-6 py-4 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">Department</th>
                <th className="px-6 py-4 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">Cycle</th>
                <th className="px-6 py-4 font-mono text-[0.7rem] tracking-[0.16em] uppercase text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {programmes.map((p) => (
                <tr key={p.dept} className="border-t border-border">
                  <td className="px-6 py-4 font-sans font-bold text-foreground">{p.dept}</td>
                  <td className="px-6 py-4 text-foreground">{p.cycle}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-secondary font-semibold text-[0.78rem]">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </>
  );
}
