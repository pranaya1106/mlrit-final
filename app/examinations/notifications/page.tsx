import type { Metadata } from 'next';
import ExaminationsHero from '@/components/ExaminationsHero';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import DocActions from '@/components/examinations/DocActions';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import SideQuickNav from '@/components/SideQuickNav';

export const metadata: Metadata = {
  title: 'Notifications — Examinations — MLRIT',
  description: 'Examination notifications from the Controller of Examinations at MLRIT — results, revaluation and mark verifications.',
};

type Notification = {
  title: string;
  file: string;
  category: 'Results' | 'Revaluation' | 'Verification' | 'Notice';
  date: string;
  hot?: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    title: 'II B.Tech II Sem Regular/Supply & II B.Tech I Sem Supply — June 2026 Results & Revaluation (Last Date: 25-07-2026)',
    file: 'II-B.Tech.-II-Sem.-Regular-Supply-and-II-B.Tech.-I-Sem.-Supply-Examinations-June-2026-Results-Declaration-and-Revaluation-and-Last-Date-for-Revaluation-is-25-07-2026.pdf',
    category: 'Results',
    date: 'July 2026',
    hot: true,
  },
  {
    title: 'I B.Tech II SEM — Verify CBT Marks in Autonomous Portal (Last Date: 25-07-2026)',
    file: 'I-B.Tech.-II-SEM-Students-are-Verify-your-CBT-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-25-07-2026.pdf',
    category: 'Verification',
    date: 'July 2026',
    hot: true,
  },
  {
    title: 'Issue of Provisional Certificate and Consolidated Grade Memo — B.Tech 2022–26 Batch',
    file: 'Issue-of-Provisional-Certificate-and-Consolidated-Grade-Memo-for-B.Tech-2022-26-Batch-Students.pdf',
    category: 'Notice',
    date: 'July 2026',
    hot: true,
  },
  {
    title: 'III & IV B.Tech I & II Sem — April 2026 Revaluation Results & Challenge Valuation',
    file: 'III-and-IV-B.Tech.-I-and-II-Sem-Regular-and-Supply-Examinations-April-2026-Revaluation-Results-and-Opportunity-Challenge-Valuation.pdf',
    category: 'Revaluation',
    date: 'April 2026',
  },
  {
    title: 'III & IV B.Tech II SEM — Verify CIE II and Final Internal Marks (Last Date: 21-04-2026)',
    file: 'III-and-IV-B.Tech.-II-SEM-Students-are-Verify-your-CIE-II-and-Final-Internal-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-21-04-2026.pdf',
    category: 'Verification',
    date: 'April 2026',
  },
  {
    title: 'III B.Tech I & II Sem Examination April 2026 — Results Declaration and Revaluation',
    file: 'III-B.Tech-I-and-II-Sem-Examionation-April-2026-Declaration-and-Revaluation.pdf',
    category: 'Results',
    date: 'April 2026',
  },
  {
    title: 'I B.Tech II SEM — Verify CIE II and Final Internal Marks (Last Date: 25-06-2026)',
    file: 'I-B.Tech.-II-SEM-Students-are-Verify-your-CIE-II-and-Final-Internal-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-25-06-2026.pdf',
    category: 'Verification',
    date: 'June 2026',
  },
  {
    title: 'I B.Tech II SEM — Verify CIE I Marks in Autonomous Portal (Last Date: 04-04-2026)',
    file: 'I-B.TECH-II-SEM-Students-are-Verify-your-CIE-I-Marks-in-Autonomous-Portal-Last-Date-for-Verification-is-04-04-2026.pdf',
    category: 'Verification',
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
    category: 'Revaluation',
    date: 'February 2026',
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

const BADGE_STYLES: Record<Notification['category'], string> = {
  Results:      'bg-blue-50 border-blue-200 text-blue-700',
  Revaluation:  'bg-orange-50 border-orange-200 text-primary',
  Verification: 'bg-green-50 border-green-200 text-secondary',
  Notice:       'bg-warm-light border-border text-muted',
};

const NAV_ITEMS = [
  { id: 'notifications', label: 'Notifications' },
];

export default function NotificationsPage() {
  return (
    <>
      <ExaminationsHero
        title="Exam"
        italic="Notifications."
        dek="Results announcements, mark verifications, revaluation deadlines and other notifications from the COE office."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Notifications' },
        ]}
      />
      <ExaminationsQuickNav active="/examinations/notifications" />

      <div className="lg:flex lg:gap-0 items-start">
        <aside className="hidden lg:block lg:w-56 shrink-0 self-start sticky top-28">
          <div className="pt-12 pl-6">
            <SideQuickNav items={NAV_ITEMS} />
          </div>
        </aside>
        <div className="flex-1 min-w-0">

      <section id="notifications" className="bg-warm-light min-h-[60vh] py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">

          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              {NOTIFICATIONS.length} Notifications
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              COE <span className="font-display italic font-medium text-primary">notifications.</span>
            </h2>
            <p className="mt-3 text-muted text-[0.93rem] max-w-[620px] leading-relaxed">
              Results declarations, mark verifications and revaluation notices. Use View to open in-browser or Download to save a copy.
            </p>
          </Reveal>

          <Stagger className="mt-10 space-y-3" delay={0.04}>
            {NOTIFICATIONS.map((n) => (
              <StaggerItem key={n.file}>
                <div className="bg-white rounded-2xl border border-border px-5 py-4 flex items-center gap-4 hover:border-secondary/40 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[0.6rem] font-mono font-bold tracking-widest uppercase ${BADGE_STYLES[n.category]}`}>
                        {n.category}
                      </span>
                      {n.hot && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-mono text-[0.58rem] font-bold tracking-wide uppercase">
                          <span className="w-1 h-1 rounded-full bg-secondary animate-pulse" />
                          New
                        </span>
                      )}
                      <span className="font-mono text-[0.62rem] text-muted tracking-wide">{n.date}</span>
                    </div>
                    <p className="font-sans font-semibold text-foreground text-[0.88rem] leading-snug truncate" title={n.title}>
                      {n.title}
                    </p>
                  </div>
                  <DocActions
                    href={`/examinations/circulars/${n.file}`}
                    filename={n.file}
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
                For direct enquiries regarding a specific notification, email the COE office at{' '}
                <a href="mailto:coe@mlrinstitutions.ac.in" className="text-secondary font-semibold hover:underline">
                  coe@mlrinstitutions.ac.in
                </a>{' '}
                or call{' '}
                <a href="tel:+919100963025" className="text-secondary font-semibold hover:underline">
                  91009 63025
                </a>.
              </p>
            </div>
          </Reveal>

        </div>
      </section>

        </div>
      </div>
    </>
  );
}
