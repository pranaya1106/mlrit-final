'use client';

import { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';

// ── Scholarship data ───────────────────────────────────────────────────────
const SCHOLARSHIPS = [
  {
    id: 'merit',
    badge: 'Academic Merit',
    title: 'Merit Scholarship',
    color: 'border-secondary/30 bg-green-50/40',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    eligibility: 'Top 10% EAMCET rank holders (within 500 rank for open category). Minimum 90% aggregate in Intermediate.',
    benefit: 'Up to 25% tuition fee waiver for the first year, renewable based on CGPA ≥ 8.0.',
    amount: '₹40,000 / year',
    howToApply: 'Submit EAMCET rank card, Intermediate mark sheet and a merit scholarship application form at the time of admission. No separate application required.',
  },
  {
    id: 'sports',
    badge: 'Sports',
    title: 'Sports Scholarship',
    color: 'border-primary/30 bg-orange-50/40',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    eligibility: 'Students who have represented the state or national level in any recognised sport. Proof of participation/award certificate required.',
    benefit: 'Partial to full tuition fee waiver depending on the level of achievement (state / national / international).',
    amount: 'Up to ₹80,000 / year',
    howToApply: 'Submit achievement certificates, a recommendation from the sports authority and the sports scholarship application form to the Dean of Student Affairs.',
  },
  {
    id: 'scst',
    badge: 'SC / ST',
    title: 'SC/ST Fee Reimbursement',
    color: 'border-secondary/30 bg-green-50/40',
    badgeColor: 'bg-green-50 border-green-200 text-secondary',
    eligibility: 'Students belonging to Scheduled Caste or Scheduled Tribe categories with valid caste certificate issued by a competent authority. Family income ceiling as per state government norms.',
    benefit: 'Full tuition fee reimbursement as per AP/TS state government scheme. Hostel and other charges may be partly covered subject to scheme guidelines.',
    amount: 'Full tuition fee (state scheme)',
    howToApply: 'Apply through the AP ePass / TS ePass portal after admission. Submit caste certificate, income certificate and bank account details.',
  },
  {
    id: 'mgmt',
    badge: 'Management Quota',
    title: 'Management Quota Merit Award',
    color: 'border-primary/30 bg-orange-50/40',
    badgeColor: 'bg-orange-50 border-orange-200 text-primary',
    eligibility: 'Management quota students who demonstrate exceptional academic merit. EAMCET rank within top 5,000 and Intermediate aggregate ≥ 85%.',
    benefit: '10–15% concession on management quota fee for the first year. Continued based on annual CGPA ≥ 7.5.',
    amount: '₹16,000–₹24,000 / year',
    howToApply: 'Apply to the admissions office within 30 days of joining. Attach rank card, mark sheets and a filled application form. Committee decision is final.',
  },
];

function ScholarshipCard({ s }: { s: (typeof SCHOLARSHIPS)[number] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${s.color} ${open ? 'shadow-card-strong' : 'shadow-card-soft'}`}>
      {/* Header */}
      <button
        className="w-full flex items-start justify-between gap-4 p-6 text-left"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <div className="flex flex-col gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[0.68rem] font-mono font-bold tracking-widest uppercase ${s.badgeColor} w-fit`}>
            {s.badge}
          </span>
          <h3 className="font-sans font-bold text-[1.12rem] text-foreground">{s.title}</h3>
          <p className="font-sans font-black text-secondary text-[1.05rem]">{s.amount}</p>
        </div>
        <span className={`shrink-0 mt-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${open ? 'bg-secondary text-white rotate-180' : 'bg-white border border-border text-muted'}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* Expanded content */}
      <div
        style={{
          maxHeight: open ? '600px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div className="px-6 pb-7 grid md:grid-cols-3 gap-5 border-t border-border/50 pt-5">
          {[
            { heading: 'Eligibility',  text: s.eligibility  },
            { heading: 'Benefit',      text: s.benefit      },
            { heading: 'How to Apply', text: s.howToApply   },
          ].map(item => (
            <div key={item.heading}>
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-secondary font-bold mb-2">{item.heading}</p>
              <p className="text-muted text-[0.9rem] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScholarshipsPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Financial Support"
        title="Scholarships &"
        italic="fee support."
        dek="MLRIT believes financial constraints should never stand between talent and opportunity. Explore our merit-based, sports and government-linked scholarship programmes."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Scholarships' },
        ]}
      />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 lg:px-20">
          {/* Intro note */}
          <Reveal preset="up">
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card-soft mb-12 flex gap-4 items-start">
              <span className="shrink-0 w-9 h-9 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mt-0.5">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 8v5M9 6v.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </span>
              <div>
                <p className="font-sans font-semibold text-foreground text-[0.95rem]">Applications are processed at the time of admission</p>
                <p className="text-muted text-[0.88rem] mt-1">
                  All scholarship and fee-reimbursement applications must be submitted during or within 30 days of admission. Late applications may not be considered. For queries, contact the accounts or student affairs office.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Scholarship cards */}
          <div className="flex flex-col gap-5">
            {SCHOLARSHIPS.map((s, i) => (
              <Reveal key={s.id} preset="up" delay={i * 0.08}>
                <ScholarshipCard s={s} />
              </Reveal>
            ))}
          </div>

          {/* External schemes note */}
          <Reveal preset="up" delay={0.2}>
            <div className="mt-12 bg-green-hero rounded-2xl p-7 text-white">
              <h3 className="font-sans font-bold text-[1.05rem] mb-3">Government & External Schemes</h3>
              <p className="text-white/80 text-[0.9rem] leading-relaxed mb-4">
                Students may also benefit from the following state and central government schemes: AP ePass / TS ePass fee reimbursement, Post-Matric Scholarship for SC/ST/OBC, EWS scholarships, and AICTE/UGC sponsored fellowships.
              </p>
              <a
                href="https://mlrit.ac.in/scholarships"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 border border-white/25 text-white font-semibold text-sm hover:bg-white/25 transition-colors"
              >
                View all schemes
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
