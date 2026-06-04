import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';

// ── Policy sections ────────────────────────────────────────────────────────
const POLICIES = [
  {
    id: 'criteria',
    title: 'Admission Criteria',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M11 2L2 7v8l9 5 9-5V7l-9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M7 11l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-muted text-[0.93rem] leading-relaxed">
        <p>
          Admissions to all undergraduate (B.Tech) programmes are governed by the EAMCET rank secured by the candidate in the respective state (AP/TS) engineering entrance examination. Admissions to M.Tech programmes are based on PGECET or GATE scores. MBA admissions are based on AP/TS ICET rank.
        </p>
        <ul className="space-y-2 pl-4">
          {[
            'B.Tech: 10+2 with Physics, Mathematics and Chemistry; minimum 45% aggregate (40% for SC/ST).',
            'M.Tech: B.Tech/B.E. in relevant discipline with minimum 50% aggregate; GATE/PGECET qualified.',
            'MBA: Any bachelor\'s degree with minimum 50% aggregate; ICET qualified.',
            'Lateral Entry (B.Tech 2nd year): Diploma holders in relevant engineering discipline with 60% aggregate.',
          ].map(item => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p>
          MLRIT does not discriminate on the basis of gender, religion, caste, race or place of birth. All eligible candidates who have secured a valid rank are welcome to seek admission.
        </p>
      </div>
    ),
  },
  {
    id: 'reservation',
    title: 'Reservation Policy',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <circle cx="11" cy="11" r="9" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 11h8M11 7v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-muted text-[0.93rem] leading-relaxed">
        <p>
          Seat reservation follows the norms prescribed by the Government of Andhra Pradesh and Telangana respectively, as applicable to private unaided minority/non-minority institutions. Convener quota seats are filled through state counselling; management quota seats are filled by the institution as per AICTE/UGC guidelines.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead className="bg-green-50">
              <tr>
                <th className="text-left px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-widest text-secondary">Category</th>
                <th className="text-right px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-widest text-secondary">Convener Quota</th>
                <th className="text-right px-4 py-2.5 font-mono text-[0.7rem] uppercase tracking-widest text-secondary">Management Quota</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Open / Unreserved (OC)', conv: '33%', mgmt: '—' },
                { cat: 'Backward Classes (BC-A to E)', conv: '29%', mgmt: '—' },
                { cat: 'Scheduled Castes (SC)', conv: '15%', mgmt: '—' },
                { cat: 'Scheduled Tribes (ST)', conv: '6%', mgmt: '—' },
                { cat: 'EWS (Economically Weaker Section)', conv: '10%', mgmt: '—' },
                { cat: 'NRI / NRI-Sponsored', conv: '—', mgmt: 'Up to 5%' },
                { cat: 'PH / Differently Abled', conv: '3% horizontal', mgmt: '—' },
              ].map(row => (
                <tr key={row.cat} className="border-t border-border hover:bg-warm-light/40 transition-colors">
                  <td className="px-4 py-3">{row.cat}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{row.conv}</td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">{row.mgmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[0.85rem]">
          Reservation percentages are indicative and subject to state government notifications for the respective academic year. Inter-se merit within each category is the basis for seat allotment.
        </p>
      </div>
    ),
  },
  {
    id: 'conduct',
    title: 'Code of Conduct',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="3" y="3" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
        <path d="M7 11l3 3 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-muted text-[0.93rem] leading-relaxed">
        <p>
          Students admitted to MLRIT are expected to abide by the rules and regulations of the institution. Violation of the code of conduct may result in disciplinary action up to and including expulsion.
        </p>
        <ul className="space-y-2 pl-4">
          {[
            'Maintain academic integrity — plagiarism and malpractice are strictly prohibited.',
            'Respect the dignity of all students, faculty and staff irrespective of gender, caste or religion.',
            'Adhere to the prescribed dress code during academic hours.',
            'Use of mobile phones in classrooms and laboratories is not permitted.',
            'Damaging or defacing institutional property is a punishable offence.',
            'Students must maintain minimum 75% attendance to be eligible for examinations.',
          ].map(item => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: 'antiragging',
    title: 'Anti-Ragging Policy',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M11 3L3 7v7a9 9 0 008 9 9 9 0 008-9V7l-8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M8 11l2 2 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-muted text-[0.93rem] leading-relaxed">
        <p className="font-semibold text-foreground">
          MLRIT has a ZERO TOLERANCE policy towards ragging. Ragging in any form — physical, verbal, psychological or online — is a criminal offence under the UGC Regulations on Curbing the Menace of Ragging (2009).
        </p>
        <ul className="space-y-2 pl-4">
          {[
            'All students must sign an anti-ragging undertaking at the time of admission.',
            'Parents/guardians must submit a separate anti-ragging declaration.',
            'A 24×7 anti-ragging helpline and committee is operational throughout the academic year.',
            'Complaints may be reported to the National Anti-Ragging Helpline: 1800-180-5522.',
            'Proven cases of ragging will result in immediate suspension/expulsion and criminal prosecution.',
          ].map(item => (
            <li key={item} className="flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-[0.88rem]">
          <strong className="text-primary">UGC Helpline:</strong> 1800-180-5522 (Toll Free, 24×7) &nbsp;|&nbsp;
          <strong className="text-primary">MLRIT Helpline:</strong> +91 40 2398 8101
        </div>
      </div>
    ),
  },
  {
    id: 'grievance',
    title: 'Grievance Redressal',
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M4 4h14a2 2 0 012 2v8a2 2 0 01-2 2H8l-5 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    ),
    content: (
      <div className="space-y-4 text-muted text-[0.93rem] leading-relaxed">
        <p>
          MLRIT has a multi-tier grievance redressal mechanism to ensure all student concerns are addressed fairly and promptly.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { tier: 'Level 1 — Faculty Mentor', detail: 'Students first report issues to their assigned faculty mentor. Resolution expected within 3 working days.' },
            { tier: 'Level 2 — HOD / Advisor',  detail: 'Unresolved grievances escalated to the Head of Department. Resolution within 7 working days.' },
            { tier: 'Level 3 — Dean of Academics', detail: 'Academic and administrative grievances escalated to the Dean\'s office.' },
            { tier: 'Level 4 — Grievance Cell',  detail: 'Formal written complaints to the institutional grievance cell, constituted as per UGC norms. Appeals to management thereafter.' },
          ].map(t => (
            <div key={t.tier} className="bg-warm-light rounded-xl p-4 border border-border">
              <p className="font-sans font-semibold text-foreground text-[0.88rem]">{t.tier}</p>
              <p className="text-[0.83rem] mt-1">{t.detail}</p>
            </div>
          ))}
        </div>
        <p className="text-[0.85rem]">
          Written grievances may also be submitted via email to <a href="mailto:grievance@mlrit.ac.in" className="text-secondary underline underline-offset-2">grievance@mlrit.ac.in</a> or dropped in the grievance box at the administrative office.
        </p>
      </div>
    ),
  },
];

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Policies"
        title="Institutional policies &"
        italic="student rights."
        dek="Transparency and fairness define MLRIT's institutional framework. Our policies are aligned with UGC, AICTE and state regulatory guidelines."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Policies' },
        ]}
      />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col gap-10">
          {POLICIES.map((policy, i) => (
            <Reveal key={policy.id} preset="up" delay={i * 0.07}>
              <div className="bg-white rounded-2xl border border-border shadow-card-soft overflow-hidden">
                <div className="flex items-center gap-3 px-7 py-5 border-b border-border bg-green-50/50">
                  <span className="text-secondary">{policy.icon}</span>
                  <h2 className="font-sans font-bold text-[1.08rem] text-foreground">{policy.title}</h2>
                </div>
                <div className="px-7 py-6">
                  {policy.content}
                </div>
              </div>
            </Reveal>
          ))}

          {/* Disclaimer */}
          <Reveal preset="up" delay={0.1}>
            <p className="text-center text-muted text-[0.82rem] font-mono leading-relaxed">
              Policies are subject to revision as per regulatory directives. This page was last updated June 2025. For the most current version, contact the MLRIT administrative office.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
