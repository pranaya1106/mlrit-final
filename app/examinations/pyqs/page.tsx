import type { Metadata } from 'next';
import PageHeader from '@/components/PageHeader';
import ExaminationsQuickNav from '@/components/ExaminationsQuickNav';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

export const metadata: Metadata = { title: 'Previous Question Papers — Examinations — MLRIT' };

const BASE = 'https://exams.mlrinstitutions.ac.in/Old_Qp/';

/* ── Data ────────────────────────────────────────────────────────── */
type Entry = { label: string; file: string };
type YearGroup = { year: string; entries: Entry[] };

const BTECH: YearGroup[] = [
  {
    year: '2026',
    entries: [
      { label: 'I B.Tech — January 2026',       file: '1-B.Tech(Jan26).rar' },
      { label: 'II B.Tech — December 2025',     file: '2-B.Tech(Dec25).rar' },
      { label: 'III B.Tech — November 2025',    file: '3-B.Tech(Nov25).rar' },
      { label: 'IV B.Tech — November 2025',     file: '4-B.Tech(Nov25).rar' },
    ],
  },
  {
    year: '2025',
    entries: [
      { label: 'I B.Tech — July 2025',          file: '1-BTech(July25).rar' },
      { label: 'II B.Tech — June 2025',         file: '2-BTech(June25).rar' },
      { label: 'III B.Tech — June 2025',        file: '3-BTech(June25).rar' },
      { label: 'IV B.Tech — May 2025',          file: '4-BTech(May25).rar' },
      { label: 'I B.Tech — February 2025',      file: 'I-BTECH-Feb25.rar' },
    ],
  },
  {
    year: '2024',
    entries: [
      { label: 'IV B.Tech — December 2024',     file: 'IV-BTECH-Dec24.rar' },
      { label: 'III B.Tech — December 2024',    file: 'III-BTECH-Dec24.rar' },
      { label: 'II B.Tech — December 2024',     file: 'II-BTECH-Dec24.rar' },
      { label: 'II B.Tech — August 2024',       file: 'II-B.Tech-August2024.rar' },
      { label: 'III B.Tech — July 2024',        file: 'III-B.Tech-July2024.rar' },
      { label: 'I B.Tech — July 2024',          file: 'I-B.Tech-July2024.rar' },
      { label: 'IV-II B.Tech — July 2024',      file: 'IV-II-ADS-July2024.rar' },
      { label: 'IV-II B.Tech — April 2024',     file: '4-2-RegularApril-2024.rar' },
      { label: 'I B.Tech — January 2024',       file: 'I-B.Tech(July24).rar' },
      { label: 'II B.Tech — February 2024',     file: 'II-B.Tech(Feb24).rar' },
      { label: 'III B.Tech — January 2024',     file: 'III-B.Tech(Jan224).rar' },
    ],
  },
  {
    year: '2023',
    entries: [
      { label: 'IV B.Tech — November 2023',     file: '4-1-November2023.rar' },
      { label: 'I B.Tech — September 2023',     file: 'I-B.Tech-September2023.rar' },
      { label: 'II B.Tech — August 2023',       file: 'II-B.Tech-August2023.rar' },
      { label: 'III B.Tech — June 2023',        file: '3-B.Tech-June2023.rar' },
      { label: 'IV B.Tech — May 2023',          file: '4-B.Tech-May2023.rar' },
      { label: 'I B.Tech — March 2023',         file: 'B.Tech-March2023.rar' },
      { label: 'II B.Tech — February 2023',     file: 'B.Tech-February2023.rar' },
    ],
  },
  {
    year: '2022',
    entries: [
      { label: 'III & IV B.Tech — December 2022', file: 'B.Tech-December2022.rar' },
      { label: 'B.Tech — June 2022',            file: 'B.Tech-June2022.rar' },
    ],
  },
  {
    year: '2021',
    entries: [
      { label: 'B.Tech — December 2021',        file: 'B.Tech-December2021.rar' },
      { label: 'B.Tech — July 2021',            file: 'B.Tech-July2021.rar' },
      { label: 'B.Tech — February 2021',        file: 'B.Tech-February2021.rar' },
    ],
  },
  {
    year: '2020',
    entries: [
      { label: 'B.Tech — October 2020',         file: 'B.Tech-October2020.rar' },
      { label: 'B.Tech — September 2020',       file: 'B.Tech-September2020.rar' },
      { label: 'B.Tech — April 2020',           file: 'B.Tech-April2020.rar' },
    ],
  },
  {
    year: '2019',
    entries: [
      { label: 'B.Tech — December 2019',        file: 'B.Tech-December2019.rar' },
      { label: 'B.Tech — May 2019',             file: 'B.Tech-May2019.rar' },
    ],
  },
  {
    year: '2018',
    entries: [
      { label: 'B.Tech — December 2018',        file: 'B.Tech-December2018.rar' },
      { label: 'B.Tech — May 2018',             file: 'B.Tech-May2018.rar' },
    ],
  },
  {
    year: '2017',
    entries: [
      { label: 'B.Tech — December 2017',        file: 'B.Tech-December2017.rar' },
      { label: 'B.Tech — June 2017',            file: 'B.Tech-June2017.rar' },
      { label: 'B.Tech — May 2017',             file: 'B.Tech-May2017.rar' },
    ],
  },
  {
    year: '2016',
    entries: [
      { label: 'B.Tech — December 2016',        file: 'B.Tech-December2016.rar' },
      { label: 'B.Tech — June 2016',            file: 'B.Tech-June2016.rar' },
    ],
  },
];

const PG: YearGroup[] = [
  {
    year: '2026',
    entries: [
      { label: 'I PG — February 2026',          file: 'I-PG(Feb2026).rar' },
      { label: 'II PG — January 2026',          file: '2-PG(Jan2026).rar' },
    ],
  },
  {
    year: '2025',
    entries: [
      { label: 'PG — July / August 2025',       file: 'PG-July&Aug 2025.rar' },
      { label: 'PG — February / March 2025',    file: 'PG-Feb&March25.rar' },
      { label: 'PG — March 2025',               file: 'PG-March2025.rar' },
    ],
  },
  {
    year: '2024',
    entries: [
      { label: 'PG — August 2024',              file: 'PG-August2024.rar' },
      { label: 'PG — July 2024',                file: 'PG-July2024.rar' },
      { label: 'MBA & M.Tech III & IV Sem — January 2024', file: 'MBA & M.Tech III & IV Sem Regular & Supple January-2024.rar' },
      { label: 'MBA & M.Tech I & II Sem — March 2024',     file: 'MBA & M.Tech I, II Sem Regular & Supply March-2024.rar' },
    ],
  },
  {
    year: '2023',
    entries: [
      { label: 'PG — August 2023',              file: 'PG-August2023.rar' },
      { label: 'PG — March 2023',               file: 'PG-March2023.rar' },
    ],
  },
  {
    year: '2022',
    entries: [
      { label: 'PG — October 2022',             file: 'PG-October2022.rar' },
      { label: 'PG — September 2022',           file: 'PG-September2022.rar' },
      { label: 'PG — April 2022',               file: 'PG-April2022.rar' },
    ],
  },
  {
    year: '2021',
    entries: [
      { label: 'PG — October 2021',             file: 'PG-October2021.rar' },
      { label: 'PG — July 2021',                file: 'PG-July2021.rar' },
      { label: 'PG — January 2021',             file: 'PG-January2021.rar' },
    ],
  },
  {
    year: '2020',
    entries: [
      { label: 'PG — October 2020',             file: 'PG-October2020.rar' },
      { label: 'PG — September 2020',           file: 'PG-September2020.rar' },
    ],
  },
];

/* ── Sub-components ──────────────────────────────────────────────── */
const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
};

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 2v7M4 7l3 3 3-3M2 12h10"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function YearSection({ group, badge, badgeClass }: {
  group: YearGroup;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div>
      {/* year heading */}
      <div className="flex items-center gap-3 mb-4">
        <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.65rem] font-mono font-bold tracking-widest uppercase ${badgeClass}`}>
          {badge}
        </span>
        <span className="font-sans font-black text-foreground text-[1.1rem] tracking-tight">
          {group.year}
        </span>
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-muted text-[0.65rem]">{group.entries.length} set{group.entries.length !== 1 ? 's' : ''}</span>
      </div>

      {/* entry cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {group.entries.map((e) => (
          <a
            key={e.file}
            href={BASE + encodeURIComponent(e.file)}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5
              hover:border-secondary hover:-translate-y-0.5 hover:shadow-sm transition-all"
          >
            {/* RAR icon */}
            <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center bg-secondary/8 text-secondary">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M7 6h6M7 9.5h4M7 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M13 11l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-sans font-semibold text-foreground text-[0.83rem] leading-snug group-hover:text-secondary transition-colors truncate">
                {e.label}
              </p>
              <p className="font-mono text-muted text-[0.6rem] mt-0.5 uppercase tracking-wide">.rar archive</p>
            </div>
            <div className="shrink-0 text-muted group-hover:text-secondary transition-colors">
              <DownloadIcon />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────── */
export default function PYQsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Examinations"
        title="Previous Question"
        italic="Papers."
        dek="Download past examination question papers for B.Tech and PG (M.Tech / MBA) programmes. All files are RAR archives — extract with WinRAR or 7-Zip."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Examinations', href: '/examinations' },
          { label: 'Previous Papers' },
        ]}
        variant="green"
      />
      <ExaminationsQuickNav active="/examinations/pyqs" />

      <section className="bg-white py-20 md:py-28">
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-20">

          {/* ── B.Tech section ── */}
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">
              Undergraduate
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              B.Tech{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                Question Papers.
              </span>
            </h2>
            <p className="mt-3 text-muted text-[0.9rem] max-w-[540px] leading-relaxed">
              Semester-wise archives from 2016 to 2026, organised by year.
            </p>
          </Reveal>

          <Stagger className="mt-10" delay={0.05}>
            {BTECH.map((group) => (
              <StaggerItem key={group.year}>
                <YearSection group={group} badge="B.Tech" badgeClass="bg-green-50 border-green-200 text-secondary" />
              </StaggerItem>
            ))}
          </Stagger>

          {/* divider */}
          <div className="my-14 border-t-2 border-dashed border-border" />

          {/* ── PG section ── */}
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">
              Postgraduate
            </span>
            <h2 className="mt-3 font-sans font-black tracking-tighter text-foreground text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.04]">
              M.Tech &amp; MBA{' '}
              <span className="font-display italic font-medium" style={gradientText}>
                Question Papers.
              </span>
            </h2>
            <p className="mt-3 text-muted text-[0.9rem] max-w-[540px] leading-relaxed">
              PG programme archives from 2020 to 2026.
            </p>
          </Reveal>

          <Stagger className="mt-10" delay={0.05}>
            {PG.map((group) => (
              <StaggerItem key={group.year}>
                <YearSection group={group} badge="M.Tech / MBA" badgeClass="bg-orange-50 border-orange-200 text-primary" />
              </StaggerItem>
            ))}
          </Stagger>

          {/* info note */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-10 p-5 rounded-xl border border-border bg-warm-light flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="text-secondary shrink-0 mt-0.5" aria-hidden>
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 7v5M8 5v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <p className="text-muted text-[0.88rem] leading-relaxed">
                Files are hosted on the{' '}
                <a href="https://exams.mlrinstitutions.ac.in/" target="_blank" rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline">
                  MLRIT Exam Portal
                </a>
                . You need a RAR extractor such as{' '}
                <a href="https://www.win-rar.com/" target="_blank" rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline">
                  WinRAR
                </a>{' '}
                or{' '}
                <a href="https://www.7-zip.org/" target="_blank" rel="noopener noreferrer"
                  className="text-secondary font-semibold hover:underline">
                  7-Zip
                </a>{' '}
                to open the downloaded archives.
              </p>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
