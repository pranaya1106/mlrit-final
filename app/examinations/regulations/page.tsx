import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import DocActions from '@/components/examinations/DocActions';

export const metadata: Metadata = { title: 'Regulations — Examinations — MLRIT' };

type RegDoc = { badge: string; label: string; desc: string; href: string; badgeColor: string };
type RegGroup = {
  code: string;
  title: string;
  years: string;
  status: 'current' | 'active' | 'phasing-out';
  summary: string;
  docs: RegDoc[];
};

const GROUPS: RegGroup[] = [
  {
    code: 'R25',
    title: 'Regulation 2025',
    years: '2025 intake onwards',
    status: 'current',
    summary:
      'The latest autonomous regulation introduced for the 2025 intake. Built on Outcome-Based Education (OBE) with enhanced industry integration, choice-based credit system (CBCS), and updated grading norms aligned with NEP 2020.',
    docs: [
      {
        badge: 'B.Tech', label: 'B.Tech Regulations (R25)',
        desc: 'Credit framework, promotion rules, CIE + SEE weightage, and grading policy for undergraduate programmes.',
        href: '/examinations/btech-regulations-r25.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
      {
        badge: 'M.Tech', label: 'M.Tech Regulations (R25)',
        desc: 'Course structure, minimum credits, thesis evaluation and examination norms for postgraduate engineering.',
        href: '/examinations/mtech-regulations-r25.pdf',
        badgeColor: 'bg-orange-50 border-orange-200 text-primary',
      },
      {
        badge: 'MBA', label: 'MBA Regulations (R25)',
        desc: 'Dual specialisation, CGPA requirements, project evaluation and lateral exit norms for the MBA programme.',
        href: '/examinations/mba-regulations-r25.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
    ],
  },
  {
    code: 'R22',
    title: 'Regulation 2022',
    years: '2022 – 2024 intake',
    status: 'active',
    summary:
      'Introduced for the 2022 batch with a strengthened OBE framework, revised credit distribution, and new mandatory courses on environmental science, gender sensitization and the constitution of India.',
    docs: [
      {
        badge: 'B.Tech', label: 'B.Tech Regulations (R22)',
        desc: 'Credit structure, attendance policy, internal assessment breakdown and re-examination rules for the 2022 batch.',
        href: '/examinations/btech-regulations-r22.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
      {
        badge: 'M.Tech', label: 'M.Tech Regulations (R22)',
        desc: 'PG programme structure, seminar and dissertation guidelines under the R22 framework.',
        href: '/examinations/mtech-regulations-r22.pdf',
        badgeColor: 'bg-orange-50 border-orange-200 text-primary',
      },
      {
        badge: 'MBA', label: 'MBA Regulations (R22)',
        desc: 'Course work, specialisation electives, summer internship and project evaluation under R22.',
        href: '/examinations/mba-regulations-r22.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
    ],
  },
  {
    code: 'MLR20',
    title: 'MLR Regulation 2020',
    years: '2020 – 2021 intake',
    status: 'active',
    summary:
      'Autonomous regulation introduced in 2020 during the transition to full autonomy. Features a revised credit system, updated elective structure and new bridge courses for lateral entry students.',
    docs: [
      {
        badge: 'B.Tech', label: 'B.Tech Regulations (MLR20)',
        desc: 'Full credit framework, promotion criteria and supplementary examination rules for the 2020 batch.',
        href: '/examinations/btech-regulations-mlr20.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
      {
        badge: 'M.Tech', label: 'M.Tech Regulations (MLR20)',
        desc: 'PG course structure, minimum attendance, dissertation and viva-voce norms under MLR20.',
        href: '/examinations/mtech-regulations-mlr20.pdf',
        badgeColor: 'bg-orange-50 border-orange-200 text-primary',
      },
      {
        badge: 'MBA', label: 'MBA Regulations (MLR20)',
        desc: 'MBA course credit plan, internal marks distribution and project guidelines under MLR20.',
        href: '/examinations/mba-regulations-mlr20.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
    ],
  },
  {
    code: 'MLR18',
    title: 'MLR Regulation 2018',
    years: '2018 – 2019 intake',
    status: 'phasing-out',
    summary:
      'The first regulation issued after UGC autonomous status was conferred in 2015, implemented for the 2018 batch. Students under this regulation are in their final years; regulations remain available for reference and re-examination purposes.',
    docs: [
      {
        badge: 'B.Tech', label: 'B.Tech Regulations (MLR18)',
        desc: 'Original autonomous B.Tech regulation — credit distribution, grading scale and examination norms for the 2018 batch.',
        href: '/examinations/btech-regulations-mlr18.pdf',
        badgeColor: 'bg-green-50 border-green-200 text-secondary',
      },
      {
        badge: 'M.Tech', label: 'M.Tech Regulations (MLR18)',
        desc: 'PG programme rules and thesis guidelines as defined under the MLR18 framework.',
        href: '/examinations/mtech-regulations-mlr18.pdf',
        badgeColor: 'bg-orange-50 border-orange-200 text-primary',
      },
    ],
  },
];

const STATUS_STYLES: Record<RegGroup['status'], { pill: string; dot: string; label: string }> = {
  current:      { pill: 'bg-green-50 border-green-300 text-secondary',  dot: 'bg-secondary animate-pulse', label: 'Current'      },
  active:       { pill: 'bg-blue-50 border-blue-200 text-blue-700',     dot: 'bg-blue-500',                label: 'Active'       },
  'phasing-out':{ pill: 'bg-neutral-100 border-neutral-300 text-muted', dot: 'bg-muted',                   label: 'Phasing Out'  },
};

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function RegulationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Academic"
        italic="regulations."
        dek="All active and historical academic regulations governing B.Tech, M.Tech and MBA programmes at MLRIT — R25, R22, MLR20 and MLR18."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations/coe' },
          { label: 'Regulations' },
        ]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/regulations" />

      <section className="bg-white py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20">

          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              All Regulations
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Programme <span className="font-display italic font-medium" style={gradientText}>regulations.</span>
            </h2>
            <p className="mt-4 text-muted text-[1rem] max-w-[600px] leading-relaxed">
              As an autonomous institution since 2015, MLRIT designs its own regulations approved by UGC and affiliated to JNTUH. Download the applicable regulation PDF for your programme and batch year.
            </p>
          </Reveal>

          {/* Regulation groups */}
          <div className="mt-14 space-y-16">
            {GROUPS.map((g, gi) => {
              const st = STATUS_STYLES[g.status];
              return (
                <Reveal key={g.code} preset="up" delay={gi * 0.06}>
                  {/* group header */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="font-sans font-black text-foreground text-[1.5rem] tracking-tight">
                      {g.code}
                    </span>
                    <span className="font-mono text-muted text-[0.8rem]">— {g.title}</span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-wide uppercase ${st.pill}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    <span className="ml-auto font-mono text-muted text-[0.7rem]">{g.years}</span>
                  </div>

                  {/* summary */}
                  <p className="text-muted text-[0.92rem] leading-relaxed mb-6 max-w-[720px]">
                    {g.summary}
                  </p>

                  {/* doc cards */}
                  <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" delay={0.06}>
                    {g.docs.map((d) => (
                      <StaggerItem key={d.label}>
                        <div className="flex flex-col gap-3 rounded-2xl border-2 border-border bg-white p-6 h-full">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[0.62rem] font-mono font-bold tracking-widest uppercase w-fit ${d.badgeColor}`}>
                            {d.badge}
                          </span>
                          <h3 className="font-sans font-extrabold text-foreground text-[0.95rem] leading-snug">
                            {d.label}
                          </h3>
                          <p className="text-muted text-[0.82rem] leading-relaxed flex-1">{d.desc}</p>
                          <DocActions href={d.href} />
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>

                  {gi < GROUPS.length - 1 && (
                    <div className="mt-16 border-t border-dashed border-border" />
                  )}
                </Reveal>
              );
            })}
          </div>

          {/* Exam policy note */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-16 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.88rem] leading-relaxed">
                For the institutional examination policy covering conduct, malpractice, re-evaluation and grievance procedures, download the{' '}
                <a href="/examinations/exam-policy.pdf" target="_blank" rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline">
                  Examination Policy PDF
                </a>. For any regulation-related queries, visit{' '}
                <a href="/examinations/support" className="text-secondary font-semibold hover:underline">
                  Examinations Support
                </a>.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
