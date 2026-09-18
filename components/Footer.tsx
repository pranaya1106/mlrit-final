'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUp } from './icons';
import { resolveAssetUrl } from '@/lib/cdn/url';
import { asGalleryItems, asRepeaterItems, asText } from '@/lib/content/sections';

// ── Main nav columns (kept clean — no Careers, no Academics) ──────────────
const MAIN_COLS = [
  {
    head: 'About',
    links: [
      { label: 'About MLRIT',       href: '/about' },
      { label: 'Vision & Mission',  href: '/about/vision-mission/vision-mission' },
      { label: 'Legacy',            href: '/about/legacy' },
      { label: 'Rankings & Awards', href: '/about/rankings-awards' },
      { label: 'Internal Governance', href: '/about/internal-governance' },
    ],
  },
  {
    head: 'Admissions',
    links: [
      { label: 'Overview',      href: '/admissions' },
      { label: 'Counselling',   href: '/admissions/counselling' },
      { label: 'Scholarships',  href: '/admissions/scholarships' },
      { label: 'Fee Structure', href: '/admissions/fees' },
      { label: 'Why MLRIT',     href: '/admissions/why-mlrit' },
    ],
  },
  {
    head: 'Examinations',
    links: [
      { label: 'Overview',          href: '/examinations' },

      { label: 'Timetable',         href: '/examinations/timetable' },
      { label: 'Regulations',       href: '/examinations/regulations' },
      { label: 'AQAR',              href: '/iqac/aqar' },
    ],
  },
  {
    head: 'Follow Us',
    links: [
      { label: 'LinkedIn',   href: 'https://www.linkedin.com/school/mlr-institute-of-technology/', ext: true },
      { label: 'Instagram',  href: 'https://www.instagram.com/mlritofficial/',                     ext: true },
      { label: 'Facebook',   href: 'https://www.facebook.com/Mlrit/',                              ext: true },
      { label: 'X.com',      href: 'https://x.com/mlritin',                                        ext: true },
      { label: 'YouTube',    href: 'https://www.youtube.com/channel/UCAfZfemyTCM-965RZy6QiGA',    ext: true },
    ],
  },
];

// ── Useful Links — categorised, expandable ────────────────────────────────
const USEFUL_SECTIONS = [
  {
    id: 'accreditation',
    label: 'Accreditation & Rankings',
    links: [
      { label: 'AICTE Approvals',       href: 'https://mlrit.ac.in/aicte-approvals/',       ext: true },
      { label: 'NIRF Rankings',         href: 'https://mlrit.ac.in/nirf-ranked-institution/', ext: true },
      { label: 'NAAC SSR',              href: 'https://naac.mlrit.ac.in/',                   ext: true },
      { label: 'NBA — DCP',             href: '/iqac/nba' },
      { label: 'AQAR Reports',          href: '/iqac/aqar' },
      { label: 'Rankings & Awards',     href: '/about/rankings-awards' },
      { label: 'Mandatory Disclosures', href: 'https://mlrit.ac.in/mandatory-disclosures/',  ext: true },
    ],
  },
  {
    id: 'governance',
    label: 'Governance & Policies',
    links: [
      { label: 'UGC Undertaking',      href: 'https://files.mlrit.ac.in/uploads/UGC-2f_12b.pdf', ext: true },
      { label: 'Service Rules',        href: 'https://mlrit.ac.in/wp-content/uploads/gen/govern/Recruitment-policy-service%20rules.pdf', ext: true },
      { label: 'Financial Statements', href: 'https://mlrit.ac.in/financial-statements/',   ext: true },
      { label: 'DPR',                  href: 'https://files.mlrit.ac.in/university/DPR.pdf', ext: true },
      { label: 'Admission Policies',   href: '/admissions/policies' },
      { label: 'OBE Portal',           href: 'https://103.15.62.235/ioncudos_mlrit_tier1/',  ext: true },
      { label: 'Examination Policy',   href: '/examinations/exam-policy.pdf',                 ext: true },
    ],
  },
  {
    id: 'committees',
    label: 'Committees & Cells',
    links: [
      { label: 'Anti-Ragging Committee',       href: 'https://files.mlrit.ac.in/uploads/Committees/Anti-Ragging_Disciplinary_Committee.pdf', ext: true },
      { label: 'SC-ST Committee',              href: 'https://files.mlrit.ac.in/uploads/Committees/SC-ST_Committee.pdf', ext: true },
      { label: 'ICC',                          href: 'https://files.mlrit.ac.in/ICC_Committee.pdf',  ext: true },
      { label: 'Women Empowerment Cell',       href: "https://files.mlrit.ac.in/uploads/Committees/Women's_Empowerment_Cell.pdf", ext: true },
      { label: 'Student Counsellor Committee', href: 'https://files.mlrit.ac.in/uploads/Committees/Student_Counsellor.pdf', ext: true },
      { label: 'IIC',                          href: 'https://files.mlrit.ac.in/uploads/Committees/Institution_Industry_Cell.pdf', ext: true },
      { label: 'RTI Committee',                href: 'https://files.mlrit.ac.in/uploads/Committees/RTI_Committee.pdf', ext: true },
      { label: 'Grievance Portal',             href: 'https://mlrit.edugrievance.com/', ext: true },
    ],
  },
  {
    id: 'student',
    label: 'Student Resources',
    links: [
      { label: 'Scholarships',      href: '/admissions/scholarships' },
      { label: 'Admissions FAQ',    href: '/admissions/support' },
      { label: 'Fee Structure',     href: '/admissions/fees' },
      { label: 'Sports',            href: '/campus/sports' },
      { label: 'Student Clubs',      href: '/campus/clubs' },
      { label: 'NSS Event Reports', href: 'https://mlrit.ac.in/nss-event-reports/', ext: true },
      { label: 'Virtual Tour',      href: '/student-life/discover-mlr' },
      { label: 'LMS',               href: 'https://lms.mlrit.ac.in/',              ext: true },
      { label: 'ERP Login',         href: 'https://portal.vmedulife.com/public/auth/#/login/mlrit-hyderabad', ext: true },
    ],
  },
];

function UsefulLinkSection({ section, open, onToggle }: { section: typeof USEFUL_SECTIONS[0]; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className={`font-sans font-semibold text-[0.85rem] transition-colors ${open ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
          {section.label}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? 'rotate-180 text-primary' : ''}`}
        >
          <path d="M2.5 5l4.5 4 4.5-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${section.links.length * 36}px` : '0px' }}
      >
        <ul className="pb-3 space-y-0.5">
          {section.links.map((l) => (
            <li key={l.label}>
              <Link
                href={l.href}
                target={l.ext ? '_blank' : undefined}
                rel={l.ext ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-1 py-1 text-[0.85rem] text-muted hover:text-primary transition-colors"
              >
                {l.label}
                {l.ext && <span className="text-[0.68rem] opacity-60">↗</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function UsefulLinksAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div className="col-span-2 md:col-span-4 lg:col-span-1">
      <h5 className="text-primary font-bold text-[0.7rem] tracking-[0.2em] uppercase mb-4">
        Useful Links
      </h5>
      <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-white/60">
        {USEFUL_SECTIONS.map((s) => (
          <div key={s.id} className="px-4">
            <UsefulLinkSection
              section={s}
              open={openId === s.id}
              onToggle={() => setOpenId(openId === s.id ? null : s.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Bundled accreditation marks, used until the CMS gallery is populated. */
const ACCREDITATION = [
  { src: '/legacy/nirf/naac.svg', name: 'NAAC' },
  { src: '/legacy/nirf/aicte.svg', name: 'AICTE' },
  { src: '/legacy/nirf/nba.svg', name: 'NBA' },
];

const DEFAULT_WATERMARK = 'MLRIT';
const DEFAULT_CRAFTED_LEAD = 'Crafted with passion by ';
const DEFAULT_CRAFTED_NAME = 'The Students';
const DEFAULT_CRAFTED_TAIL = ' of MLRIT';
const DEFAULT_COPYRIGHT = '© 2026 KMR Educational Society';
const DEFAULT_BADGES = ['Affiliated to JNTUH', 'Approved by AICTE'];
const DEFAULT_DISCLOSURES_LABEL = 'Disclosures';
const DEFAULT_DISCLOSURES_HREF = 'https://mlrit.ac.in/mandatory-disclosures/';

export type FooterContent = {
  links?: unknown;
  logos?: unknown;
  watermark?: string;
  craftedLead?: string;
  craftedName?: string;
  craftedTail?: string;
  copyright?: string;
  badges?: unknown;
  disclosuresLabel?: string;
  disclosuresHref?: string;
};

type FooterColumn = { head: string; links: { label: string; href: string; ext?: boolean }[] };

/**
 * Groups the flat CMS link list back into columns, in row order — the first
 * time a `head` appears fixes that column's position. A flat list is what a
 * repeater can express; the nesting is rebuilt here rather than asking an
 * editor to manage two levels.
 *
 * An empty list yields MAIN_COLS verbatim.
 */
function columnsFrom(value: unknown): FooterColumn[] {
  const rows = asRepeaterItems(value);
  if (rows.length === 0) return MAIN_COLS as FooterColumn[];

  const byHead = new Map<string, FooterColumn>();
  for (const row of rows) {
    const head = asText(row.head);
    const label = asText(row.label);
    const href = asText(row.href);
    if (!head || !label || !href) continue;

    if (!byHead.has(head)) byHead.set(head, { head, links: [] });
    byHead.get(head)!.links.push({
      label,
      href,
      ext: asText(row.external).toLowerCase() === 'yes' || undefined,
    });
  }

  const columns = [...byHead.values()];
  return columns.length > 0 ? columns : (MAIN_COLS as FooterColumn[]);
}

export default function Footer(props: FooterContent = {}) {
  const columns = columnsFrom(props.links);

  const uploaded = asGalleryItems(props.logos);
  const logos =
    uploaded.length > 0
      ? uploaded
          .map((item, i) => ({
            src: resolveAssetUrl(item.key, { allowTransient: true }) ?? ACCREDITATION[i]?.src ?? '',
            name: asText(item.name, ACCREDITATION[i]?.name ?? ''),
          }))
          .filter((logo) => logo.src)
      : ACCREDITATION;

  const badgeRows = asRepeaterItems(props.badges);
  const badges =
    badgeRows.length > 0
      ? badgeRows.map((row) => asText(row.label)).filter(Boolean)
      : DEFAULT_BADGES;

  const watermark = props.watermark?.trim() || DEFAULT_WATERMARK;
  const craftedLead = props.craftedLead?.trim() || DEFAULT_CRAFTED_LEAD;
  const craftedName = props.craftedName?.trim() || DEFAULT_CRAFTED_NAME;
  const craftedTail = props.craftedTail?.trim() || DEFAULT_CRAFTED_TAIL;
  const copyright = props.copyright?.trim() || DEFAULT_COPYRIGHT;
  const disclosuresLabel = props.disclosuresLabel?.trim() || DEFAULT_DISCLOSURES_LABEL;
  const disclosuresHref = props.disclosuresHref?.trim() || DEFAULT_DISCLOSURES_HREF;

  return (
    <footer className="bg-warm-light border-t border-border relative isolate">

      {/* Main footer grid */}
      <div className="w-full px-6 md:px-10 lg:px-12 pt-16 md:pt-24 pb-10 md:pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-8">

          {/* 4 main columns */}
          {columns.map((c) => (
            <div key={c.head}>
              <h5 className="text-primary font-bold text-[0.7rem] tracking-[0.2em] uppercase mb-4">
                {c.head}
              </h5>
              <ul className="space-y-1">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      target={'ext' in l && l.ext ? '_blank' : undefined}
                      rel={'ext' in l && l.ext ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center gap-1 py-1.5 text-[0.9rem] text-foreground hover:text-primary transition-colors"
                    >
                      {l.label}
                      {'ext' in l && l.ext && <span className="text-[0.68rem] text-muted">↗</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Useful Links — 5th column with single-open accordion */}
          <UsefulLinksAccordion />

        </div>
      </div>

      {/* Accredited row */}
      <div className="border-y border-border">
        <div className="w-full px-6 md:px-10 lg:px-12 py-5 flex flex-wrap items-center gap-7">
          <span className="font-mono text-[0.66rem] font-bold tracking-[0.22em] uppercase text-muted flex-shrink-0">
            Accredited by
          </span>
          <div className="flex items-center gap-7 flex-1 min-w-0">
            {logos.map((logo) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.name}
                className="h-9 w-auto opacity-90"
              />
            ))}
          </div>
          <BackToTop />
        </div>
      </div>

      {/* Big watermark + crafted line */}
      <div className="text-center overflow-hidden pt-5">
        <div
          className="font-sans font-black uppercase leading-[0.92] tracking-tighter-3 select-none text-[clamp(2.75rem,16vw,4.5rem)] md:text-[clamp(8rem,28vw,24rem)]"
          style={{
            backgroundImage:
              'linear-gradient(180deg, #161616 0%, #2b1605 25%, #6a2f00 45%, #e85d04 62%, #ffb27a 82%, rgba(245,239,229,0) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}
        >
          {watermark}
        </div>
        <p className="mt-3 mb-6 tracking-[0.22em] uppercase select-none" style={{ fontSize: '0.68rem', color: '#9a9080' }}>
          <span className="font-display italic" style={{ fontStyle: 'italic', letterSpacing: '0.18em' }}>{craftedLead}</span>
          <span className="font-sans font-black not-italic" style={{ color: '#3d3328', letterSpacing: '0.22em' }}>{craftedName}</span>
          <span className="font-display italic" style={{ fontStyle: 'italic', letterSpacing: '0.18em' }}>{craftedTail}</span>
        </p>
      </div>

      {/* Bottom legal */}
      <div className="border-t border-border">
        <div className="w-full px-6 md:px-10 lg:px-12 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[0.8rem] text-muted font-sans">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 items-center">
            <span>{copyright}</span>
            {/* Dot bundled with the label that follows it so a mobile wrap
                can't strand the separator alone at the end of a line. */}
            {badges.map((badge) => (
              <span key={badge}>
                <span className="text-subtle mr-1">·</span>
                {badge}
              </span>
            ))}
          </div>
          <div className="flex gap-6">
            <a href={disclosuresHref} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{disclosuresLabel}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="ml-auto inline-flex items-center gap-3.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors group"
      aria-label="Back to top"
    >
      Back to top
      <span className="w-11 h-11 lg:w-10 lg:h-10 rounded-full border-[1.4px] border-foreground inline-flex items-center justify-center transition-all group-hover:bg-primary group-hover:border-primary group-hover:text-white group-hover:-translate-y-0.5">
        <ArrowUp className="w-4 h-4" />
      </span>
    </button>
  );
}
