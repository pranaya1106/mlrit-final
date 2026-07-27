import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import DocActions from '@/components/examinations/DocActions';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = {
  title: 'Circulars — Examinations — MLRIT',
  description: 'Official examination circulars published by the Controller of Examinations at MLRIT.',
};

type Circular = {
  title: string;
  file: string;
  category: 'Timetable' | 'Fee' | 'Results' | 'Notice' | 'Condonation';
  date: string;
};

const CIRCULARS: Circular[] = [
  {
    title: 'I B.Tech II SEM — Verify CBT Marks in Autonomous Portal (Last Date: 25-07-2026)',
    file: 'I-B.Tech.-II-SEM-Students-are-Verify-your-CBT-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-25-07-2026.pdf',
    category: 'Notice',
    date: 'July 2026',
  },
  {
    title: 'II B.Tech II Sem Regular / Supply & II B.Tech I Sem Supply — June 2026 Results & Revaluation (Last Date: 25-07-2026)',
    file: 'II-B.Tech.-II-Sem.-Regular-Supply-and-II-B.Tech.-I-Sem.-Supply-Examinations-June-2026-Results-Declaration-and-Revaluation-and-Last-Date-for-Revaluation-is-25-07-2026.pdf',
    category: 'Results',
    date: 'July 2026',
  },
  {
    title: 'Issue of Provisional Certificate and Consolidated Grade Memo — B.Tech 2022–26 Batch',
    file: 'Issue-of-Provisional-Certificate-and-Consolidated-Grade-Memo-for-B.Tech-2022-26-Batch-Students.pdf',
    category: 'Notice',
    date: 'July 2026',
  },
  {
    title: 'I B.Tech II Semester R25 — Regular CBT Examinations July 2026 Fee Notification',
    file: 'I-B.Tech-II-Semester-R25-Regulations-Regular-CBT-Examinations-July-2026-Fee-Notification.pdf',
    category: 'Fee',
    date: 'July 2026',
  },
  {
    title: 'MBA Special Supplementary OTC End Semester Examinations July–August 2026',
    file: 'FINAL-TIMETABLE-MBA-OTC-2026.pdf',
    category: 'Timetable',
    date: 'July 2026',
  },
  {
    title: 'B.Tech Special Supplementary OTC End Semester Examinations July–August 2026',
    file: 'FINAL-TIMETABLE-BTECH-OTC-2026.pdf',
    category: 'Timetable',
    date: 'July 2026',
  },
  {
    title: 'MBA & M.Tech. August 2026 Supplementary Examinations — Fee Notification (Last Date: 06-07-2026)',
    file: 'I-MBA-and-M.Tech.-II-Semester-Regular-and-Supplementary-and-I-MBA-and-M.Tech.-I-Semester-Supplementary-Examinations-August-2026-Fee-Notification-and-Last-Date-for-Fee-Payment-without-Late-Fee-is-06-07-2026.pdf',
    category: 'Fee',
    date: 'July 2026',
  },
  {
    title: 'II MBA II Sem. Regular & Supply and II MBA I Sem. Supply — July 2026 Fee Notification',
    file: 'II-MBA-II-Sem.-Regular-and-Supply-and-II-MBA-I-Sem.-Supply-Examinations-July-2026-Fee-Notification.pdf',
    category: 'Fee',
    date: 'July 2026',
  },
  {
    title: 'II M.Tech. I Sem. Supply Examinations July 2026 — Fee Notification',
    file: 'II-M.Tech.-I-Sem.-Supply-Examinations-July-2026-Fee-Notification.pdf',
    category: 'Fee',
    date: 'July 2026',
  },
  {
    title: 'JNTUH B.Tech, M.Tech & MBA Special Supplementary OTC — June/July 2026 Fee Notification',
    file: 'JNTUH-B.Tech.-M.Tech.-and-MBA-Special-Supplementary-One-Time-Chance-Examinations-June-July-2026-Fee-Notification.pdf',
    category: 'Fee',
    date: 'June 2026',
  },
  {
    title: 'I B.Tech II Sem. Regular & Supply and I B.Tech I Sem. Supply — June 2026 Fee Notification',
    file: 'I-B.Tech-II-Sem.-Regular-and-Supply-and-I-B.Tech.-I-Sem.-Supply-Examinations-June-2026-Fee-Notification.pdf',
    category: 'Fee',
    date: 'June 2026',
  },
  {
    title: 'I B.Tech II SEM — Verify CIE II and Final Internal Marks (Last Date: 25-06-2026)',
    file: 'I-B.Tech.-II-SEM-Students-are-Verify-your-CIE-II-and-Final-Internal-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-25-06-2026.pdf',
    category: 'Notice',
    date: 'June 2026',
  },
  {
    title: 'IV B.Tech II Semester — Advance Supplementary Examinations June 2026 Fee Notification (Last Date: 24-05-2026)',
    file: 'IV-B.Tech.-II-Semester-Advance-Supplementary-Examinations-June-2026-Fee-Notification-and-Last-Date-Without-Late-Fee-is-24-05-2026.pdf',
    category: 'Fee',
    date: 'May 2026',
  },
  {
    title: 'Autonomous I B.Tech II Sem — Condonation Fee Circular (Last Date: 11-06-2026)',
    file: 'Autonomous-I-B.Tech.-II-Sem.-Condonation-Fee-Circular.-Last-Date-For-Payment-Of-Condonation-Fee-is-11-06-2026-Through-Online.pdf',
    category: 'Condonation',
    date: 'June 2026',
  },
  {
    title: 'III & IV B.Tech I & II Sem — Regular & Supply April 2026 Revaluation Results & Challenge Valuation',
    file: 'III-and-IV-B.Tech.-I-and-II-Sem-Regular-and-Supply-Examinations-April-2026-Revaluation-Results-and-Opportunity-Challenge-Valuation.pdf',
    category: 'Results',
    date: 'April 2026',
  },
  {
    title: 'III & IV B.Tech II SEM — Verify CIE II and Final Internal Marks (Last Date: 21-04-2026)',
    file: 'III-and-IV-B.Tech.-II-SEM-Students-are-Verify-your-CIE-II-and-Final-Internal-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-21-04-2026.pdf',
    category: 'Notice',
    date: 'April 2026',
  },
  {
    title: 'III B.Tech I & II Sem Examination April 2026 — Results Declaration and Revaluation',
    file: 'III-B.Tech-I-and-II-Sem-Examionation-April-2026-Declaration-and-Revaluation.pdf',
    category: 'Results',
    date: 'April 2026',
  },
  {
    title: 'II B.Tech II Semester — Condonation Notification (Submit by 01-05-2026)',
    file: 'II-B.Tech.-II-Semester-Condonation-Notification-Submission-of-Undertaking-and-Medical-Certificate-on-or-before-01-05-2026.pdf',
    category: 'Condonation',
    date: 'April 2026',
  },
  {
    title: 'Autonomous III & IV B.Tech II Sem — Condonation Fee Circular (Last Date: 04-04-2026)',
    file: 'Autonomous-III-and-IV-B.Tech.-II-Sem.-Condonation-Fee-Circular.-Last-Date-For-Payment-Of-Condonation-Fee-is-04-04-2026-Through-Online.pdf',
    category: 'Condonation',
    date: 'April 2026',
  },
  {
    title: 'I B.Tech II SEM — Verify CIE I Marks in Autonomous Portal (Last Date: 04-04-2026)',
    file: 'I-B.TECH-II-SEM-Students-are-Verify-your-CIE-I-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-04-04-2026.pdf',
    category: 'Notice',
    date: 'April 2026',
  },
  {
    title: 'I M.Tech & MBA I & II Semester — Feb 2026 Results Released & Revaluation Notification',
    file: 'I-M.Tech-and-MBA-I-and-II-Semester-Regular-and-Supple-Examinations-February-2026-Results-Released-Revaluation-Notification.pdf',
    category: 'Results',
    date: 'February 2026',
  },
  {
    title: 'One Time Chance Special Supply Examination Feb 2026 — Revaluation Results & Challenge Valuation',
    file: 'One-Time-chance-Special-Supply-Examination-Feb-2026-Revaluation-Results-Opportunity-Challange-Valuation-1.pdf',
    category: 'Results',
    date: 'February 2026',
  },
  {
    title: 'MBA Project Thesis Submission for Plagiarism Check',
    file: 'MBA-Project-Thesis-Submission-for-Plagiarism-Check.pdf',
    category: 'Notice',
    date: '2026',
  },
  {
    title: 'Data Corrections Reminder — B.Tech, M.Tech & MBA Students (Verification of Student Details)',
    file: 'Data-Corrections-Reminder-for-B.Tech.-M.Tech.-and-MBA-Students-Verification-of-Student-Details.pdf',
    category: 'Notice',
    date: '2026',
  },
  {
    title: 'Issue of Provisional Certificate and Consolidated Grade Memo — B.Tech',
    file: 'Issue-of-PC-and-CGM-to-the-students-of-B.Tech..pdf',
    category: 'Notice',
    date: '2026',
  },
];

const BADGE_STYLES: Record<Circular['category'], string> = {
  Timetable:   'bg-green-50 border-green-200 text-secondary',
  Fee:         'bg-orange-50 border-orange-200 text-primary',
  Results:     'bg-blue-50 border-blue-200 text-blue-700',
  Notice:      'bg-warm-light border-border text-muted',
  Condonation: 'bg-purple-50 border-purple-200 text-purple-700',
};

export default function CircularsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Examinations"
        title="COE"
        italic="Circulars."
        dek="Official circulars issued by the Controller of Examinations — examination schedules, fee notifications, mark verifications and general instructions."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Circulars' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/circulars" />

      <section className="bg-warm-light min-h-[60vh] py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              {CIRCULARS.length} Circulars
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              Recent <span className="font-display italic font-medium text-primary">circulars.</span>
            </h2>
            <p className="mt-3 text-muted text-[0.93rem] max-w-[620px] leading-relaxed">
              All documents below are hosted locally. Use View to open in-browser or Download to save a copy.
            </p>
          </Reveal>

          <Stagger className="mt-10 space-y-3" delay={0.04}>
            {CIRCULARS.map((c) => (
              <StaggerItem key={c.file}>
                <div className="bg-white rounded-2xl border border-border px-5 py-4 flex items-center gap-4 hover:border-secondary/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[0.6rem] font-mono font-bold tracking-widest uppercase ${BADGE_STYLES[c.category]}`}>
                        {c.category}
                      </span>
                      <span className="font-mono text-[0.62rem] text-muted tracking-wide">{c.date}</span>
                    </div>
                    <p className="font-sans font-semibold text-foreground text-[0.88rem] leading-snug truncate" title={c.title}>
                      {c.title}
                    </p>
                  </div>
                  <DocActions
                    href={`/examinations/circulars/${c.file}`}
                    filename={c.file}
                    viewLabel="View"
                    downloadLabel="Download"
                  />
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal preset="up" delay={0.2}>
            <div className="mt-8 p-5 rounded-xl border border-border bg-white flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.85rem] leading-relaxed">
                For queries about a specific circular, contact the COE office at{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>{' '}
                or visit the{' '}
                <a href="/examinations/contact" className="text-secondary font-semibold hover:underline">
                  Contact Us
                </a>{' '}
                page.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
