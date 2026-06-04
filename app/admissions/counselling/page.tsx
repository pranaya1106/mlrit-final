'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';

// ── Accordion primitives ───────────────────────────────────────────────────
function AccordionItem({
  id,
  title,
  children,
  open,
  onToggle,
  accent = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  accent?: boolean;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${open ? 'border-secondary/40 bg-green-50/60' : 'border-border bg-white'}`}>
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className={`font-sans font-semibold text-[0.98rem] transition-colors ${open ? 'text-secondary' : 'text-foreground'}`}>
          {accent && <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-3 shrink-0 align-middle" />}
          {title}
        </span>
        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${open ? 'bg-secondary text-white rotate-180' : 'bg-border text-muted'}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div
        style={{ maxHeight: open ? '800px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <div className="px-6 pb-5 text-muted text-[0.93rem] leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────
const ADMISSION_STEPS = [
  {
    id: 'step1',
    title: '1. Online Registration',
    body: 'Register on the MLRIT admissions portal at mlrit.ac.in/admissions. Fill in personal details, academic history and upload a recent photograph. Keep your EAMCET/ICET/PGECET hall ticket and score card ready.',
  },
  {
    id: 'step2',
    title: '2. Web Counselling Participation',
    body: 'Participate in AP EAMCET / TS EAMCET web counselling conducted by the respective state counselling authority. Exercise your college and branch preferences in order of priority. MLRIT institution code will be communicated via official channels.',
  },
  {
    id: 'step3',
    title: '3. Allotment & Reporting',
    body: 'Download your provisional allotment order from the web counselling portal. Report to the MLRIT admissions office within the stipulated time along with all original documents for verification.',
  },
  {
    id: 'step4',
    title: '4. Document Verification',
    body: 'Submit originals of SSC / Intermediate mark sheets, transfer certificate, migration certificate, caste certificate (if applicable), income certificate (for fee reimbursement), Aadhaar card and 4 passport-size photographs.',
  },
  {
    id: 'step5',
    title: '5. Fee Payment & Confirmation',
    body: 'Pay the semester fee online via the student portal or at the accounts counter. Collect your student ID card, library card and admission confirmation letter. Your journey at MLRIT begins here.',
  },
];

const COUNSELLING_SCHEDULE = [
  {
    id: 'eamcet',
    title: 'AP / TS EAMCET Counselling',
    body: (
      <div className="space-y-3">
        {[
          { round: 'Round 1',    dates: 'July 10–18, 2025 (Tentative)' },
          { round: 'Round 2',    dates: 'August 1–8, 2025 (Tentative)'  },
          { round: 'Spot Round', dates: 'August 20–22, 2025 (Tentative)'},
        ].map(r => (
          <div key={r.round} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="font-sans font-semibold text-foreground text-sm">{r.round}</span>
            <span className="font-mono text-[0.8rem] text-muted">{r.dates}</span>
          </div>
        ))}
        <p className="text-[0.85rem] text-muted pt-2">
          Dates are indicative. Refer to the official AP/TS EAMCET counselling website for confirmed schedules.
        </p>
      </div>
    ),
  },
  {
    id: 'icet',
    title: 'AP / TS ICET Counselling (MBA)',
    body: (
      <div className="space-y-3">
        {[
          { round: 'Phase 1', dates: 'August 5–12, 2025 (Tentative)' },
          { round: 'Phase 2', dates: 'August 20–25, 2025 (Tentative)'},
        ].map(r => (
          <div key={r.round} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="font-sans font-semibold text-foreground text-sm">{r.round}</span>
            <span className="font-mono text-[0.8rem] text-muted">{r.dates}</span>
          </div>
        ))}
        <p className="text-[0.85rem] text-muted pt-2">
          Refer to the official AP ICET / TS ICET website for confirmed schedules.
        </p>
      </div>
    ),
  },
  {
    id: 'pgecet',
    title: 'PGECET Counselling (M.Tech)',
    body: (
      <div className="space-y-3">
        {[
          { round: 'Round 1', dates: 'August 8–14, 2025 (Tentative)' },
          { round: 'Round 2', dates: 'August 22–26, 2025 (Tentative)'},
        ].map(r => (
          <div key={r.round} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <span className="font-sans font-semibold text-foreground text-sm">{r.round}</span>
            <span className="font-mono text-[0.8rem] text-muted">{r.dates}</span>
          </div>
        ))}
        <p className="text-[0.85rem] text-muted pt-2">
          GATE qualified candidates may also be considered for direct admission subject to seat availability.
        </p>
      </div>
    ),
  },
];

const DOCUMENTS = [
  {
    id: 'doc1',
    title: 'Academic Documents',
    body: (
      <ul className="space-y-2">
        {[
          'SSC (Class X) Original Mark Sheet & Certificate',
          'Intermediate (Class XII) Original Mark Sheet & Certificate',
          'EAMCET / ICET / PGECET Hall Ticket & Score Card',
          'Provisional Allotment Order from Counselling Authority',
          'Transfer Certificate (TC) from previous institution',
          'Migration Certificate (if applicable)',
        ].map(d => (
          <li key={d} className="flex items-start gap-2">
            <span className="mt-1 w-4 h-4 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                <path d="M1.5 4.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'doc2',
    title: 'Identity & Eligibility Documents',
    body: (
      <ul className="space-y-2">
        {[
          'Aadhaar Card (original + 2 photocopies)',
          'Caste Certificate (for SC/ST/OBC/EWS — issued by competent authority)',
          'Income Certificate (for fee reimbursement eligibility)',
          'PH Certificate (if applicable)',
          'NRI / NRI-sponsored declaration (if applicable)',
          '4 recent passport-size photographs',
        ].map(d => (
          <li key={d} className="flex items-start gap-2">
            <span className="mt-1 w-4 h-4 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                <path d="M1.5 4.5l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

const INSTRUCTIONS = [
  'Report to the admissions office on the allotted date; late reporting may result in cancellation of the seat.',
  'Carry one set of photocopies of all documents. Originals will be returned after verification.',
  'Fee payment must be completed on the same day as document verification to confirm your seat.',
  'Ragging is strictly prohibited on campus. A signed anti-ragging undertaking is mandatory at the time of admission.',
];

type SectionId = string | null;

export default function CounsellingPage() {
  const [openStep, setOpenStep]  = useState<SectionId>(null);
  const [openSched, setOpenSched] = useState<SectionId>(null);
  const [openDoc, setOpenDoc]     = useState<SectionId>(null);

  const toggle = (current: SectionId, id: string, setter: (v: SectionId) => void) =>
    setter(current === id ? null : id);

  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Counselling"
        title="Admission process &"
        italic="counselling guide."
        dek="Everything you need to know about web counselling, required documents and important dates for joining MLRIT."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Counselling' },
        ]}
      />

      <div className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col gap-16">

          {/* ── Admission Process ──────────────────────────────────────── */}
          <Reveal preset="up">
            <section>
              <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-foreground mb-2">
                Admission Process
              </h2>
              <p className="text-muted text-[0.93rem] mb-6">Step-by-step walkthrough from application to confirmation.</p>
              <div className="flex flex-col gap-3">
                {ADMISSION_STEPS.map(s => (
                  <AccordionItem
                    key={s.id}
                    id={s.id}
                    title={s.title}
                    open={openStep === s.id}
                    onToggle={() => toggle(openStep, s.id, setOpenStep)}
                  >
                    {s.body}
                  </AccordionItem>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ── Counselling Schedule ───────────────────────────────────── */}
          <Reveal preset="up" delay={0.1}>
            <section>
              <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-foreground mb-2">
                Counselling Schedule
              </h2>
              <p className="text-muted text-[0.93rem] mb-6">Indicative dates for AP/TS state counselling rounds in 2025.</p>
              <div className="flex flex-col gap-3">
                {COUNSELLING_SCHEDULE.map(s => (
                  <AccordionItem
                    key={s.id}
                    id={s.id}
                    title={s.title}
                    open={openSched === s.id}
                    onToggle={() => toggle(openSched, s.id, setOpenSched)}
                  >
                    {s.body}
                  </AccordionItem>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ── Required Documents ────────────────────────────────────── */}
          <Reveal preset="up" delay={0.1}>
            <section>
              <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-foreground mb-2">
                Required Documents
              </h2>
              <p className="text-muted text-[0.93rem] mb-6">Carry originals and one set of photocopies on the day of verification.</p>
              <div className="flex flex-col gap-3">
                {DOCUMENTS.map(d => (
                  <AccordionItem
                    key={d.id}
                    id={d.id}
                    title={d.title}
                    open={openDoc === d.id}
                    onToggle={() => toggle(openDoc, d.id, setOpenDoc)}
                    accent
                  >
                    {d.body}
                  </AccordionItem>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ── Important Instructions ─────────────────────────────────── */}
          <Reveal preset="up" delay={0.1}>
            <section>
              <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-foreground mb-6">
                Important Instructions
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {INSTRUCTIONS.map((inst, i) => (
                  <div key={i} className="bg-white border border-border rounded-xl p-5 shadow-card-soft flex gap-4">
                    <span className="mt-0.5 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-sm">
                      {i + 1}
                    </span>
                    <p className="text-muted text-[0.9rem] leading-relaxed">{inst}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          {/* ── Contact strip ────────────────────────────────────────────── */}
          <Reveal preset="up" delay={0.1}>
            <div className="bg-green-hero rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="font-sans font-bold text-[1.1rem]">Need help with admissions?</h3>
                <p className="text-white/75 text-[0.9rem] mt-1">Our admissions team is available Mon–Sat, 9 AM – 5 PM.</p>
              </div>
              <a
                href="tel:+914023988101"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary-hover transition-colors shadow-primary-glow"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M14 10.67a1 1 0 01-.33.66l-1.34 1.34A1 1 0 0111.33 13C4.33 13 3 5.67 3 5.67a1 1 0 01.33-1L4.67 3.33A1 1 0 015.33 3l2 4a1 1 0 01-.27 1.27L6 9.33A6 6 0 006.67 10 6 6 0 009.33 10l1.07-1.07A1 1 0 0111.67 9l4 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                +91 40 2398 8101
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
