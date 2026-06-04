'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';

// ── FAQ data ───────────────────────────────────────────────────────────────
const FAQS = [
  {
    id: 'q1',
    q: 'What is the last date to apply for admissions AY 2025–26?',
    a: 'MLRIT admissions are linked to the AP/TS EAMCET, ICET and PGECET state counselling schedules. Typically, the convener quota counselling runs from July to September. Management quota admissions continue until seats are filled. Visit mlrit.ac.in/admissions for the latest dates.',
    tags: ['dates', 'apply', 'deadline'],
  },
  {
    id: 'q2',
    q: 'What is the minimum EAMCET rank required for CSE at MLRIT?',
    a: 'Cutoff ranks vary each year based on the number of applicants and seat availability. Historically, CSE and AIML have the highest demand. We recommend checking the previous year\'s closing ranks on the official EAMCET counselling website and contacting our admissions office for updated guidance.',
    tags: ['eamcet', 'rank', 'cutoff', 'cse'],
  },
  {
    id: 'q3',
    q: 'Does MLRIT offer hostel / residential facilities?',
    a: 'Yes. Separate hostel facilities are available for male and female students within or near the campus. Hostel fee ranges from ₹55,000 to ₹75,000 per year depending on the room type. Contact the hostel warden office at warden@mlrit.ac.in for availability.',
    tags: ['hostel', 'accommodation', 'residential'],
  },
  {
    id: 'q4',
    q: 'Can I apply for lateral entry (direct second year)?',
    a: 'Yes. Diploma holders in the relevant engineering branch with a minimum 60% aggregate are eligible for lateral entry admission to the second year of B.Tech. Admissions are through the AP/TS ECET (Engineering Common Entrance Test) state counselling.',
    tags: ['lateral entry', 'diploma', 'ecet', 'second year'],
  },
  {
    id: 'q5',
    q: 'What documents are needed at the time of admission?',
    a: 'You will need: SSC and Intermediate original mark sheets, EAMCET/ICET/PGECET hall ticket and score card, provisional allotment letter, transfer certificate, Aadhaar card, caste/income certificate (if applicable) and 4 passport-size photographs. Carry one set of photocopies.',
    tags: ['documents', 'certificates', 'verification'],
  },
  {
    id: 'q6',
    q: 'What is the total annual fee for B.Tech?',
    a: 'The annual tuition fee for B.Tech programmes is ₹1,60,000 for AY 2025–26 (convener quota). Additional charges include admission fee (one-time ₹5,000), library, sports and exam fees totalling approximately ₹15,000 per year. Refer to the full fee structure page for details.',
    tags: ['fee', 'tuition', 'btech', 'cost'],
  },
  {
    id: 'q7',
    q: 'Are there scholarships available for meritorious students?',
    a: 'Yes. MLRIT offers Merit Scholarships (top 10% EAMCET rank), Sports Scholarships and SC/ST fee reimbursement under the AP ePass / TS ePass scheme. Management quota merit awards are also available. Visit the Scholarships page for full details.',
    tags: ['scholarship', 'merit', 'fee waiver', 'financial aid'],
  },
  {
    id: 'q8',
    q: 'How do I check my application status?',
    a: 'You can check your application and admission status by logging into the MLRIT student portal at portal.mlrit.ac.in using your application number. For any issues, contact the admissions office directly.',
    tags: ['application status', 'portal', 'check'],
  },
  {
    id: 'q9',
    q: 'Does MLRIT accept students from states other than AP/TS?',
    a: 'Yes. Students from other states can seek admission through the management quota. They must meet the standard eligibility criteria (10+2 with PCM, minimum 45% aggregate for B.Tech) and should contact the admissions office directly for the management quota application process.',
    tags: ['other state', 'management quota', 'eligibility', 'out of state'],
  },
  {
    id: 'q10',
    q: 'What is the placement track record of MLRIT?',
    a: 'The 2025–26 batch received 621 placement offers from 200+ companies. The highest package was ₹51 LPA. Key recruiters include TCS, Infosys, Wipro, Cognizant, Amazon, Microsoft, Deloitte and many more. The placement cell offers training, mock interviews and internship facilitation.',
    tags: ['placement', 'jobs', 'salary', 'companies', 'package'],
  },
];

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-100 text-foreground rounded px-0.5">{part}</mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

export default function SupportPage() {
  const [query, setQuery]   = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return FAQS;
    return FAQS.filter(
      f =>
        f.q.toLowerCase().includes(q) ||
        f.a.toLowerCase().includes(q) ||
        f.tags.some(t => t.includes(q)),
    );
  }, [query]);

  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Admissions Support"
        title="We're here"
        italic="to help."
        dek="Find answers to the most common admissions questions, or reach out to our team directly."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Support & FAQs' },
        ]}
      />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[960px] mx-auto px-6 md:px-12 lg:px-20">

          {/* Search bar */}
          <Reveal preset="up">
            <div className="mb-10 relative">
              <label htmlFor="faq-search" className="sr-only">Search FAQs</label>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M12 12l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={e => { setQuery(e.target.value); setOpenId(null); }}
                placeholder="Search questions — e.g. 'hostel', 'fee', 'documents'…"
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-border bg-white shadow-card-soft font-sans text-[0.95rem] text-foreground placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-secondary/40 focus:border-secondary transition"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); setOpenId(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition"
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </div>
          </Reveal>

          {/* Results count */}
          {query && (
            <p className="text-muted text-[0.85rem] font-mono mb-5">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
          )}

          {/* FAQ accordion */}
          <div className="flex flex-col gap-3 mb-16">
            {filtered.length === 0 ? (
              <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-card-soft">
                <p className="text-muted">No results found for "<strong className="text-foreground">{query}</strong>". Try a different keyword or contact us below.</p>
              </div>
            ) : (
              filtered.map((faq, i) => {
                const isOpen = openId === faq.id;
                return (
                  <Reveal key={faq.id} preset="up" delay={Math.min(i * 0.05, 0.3)}>
                    <div className={`border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-secondary/40 bg-green-50/50' : 'border-border bg-white'}`}>
                      <button
                        className="w-full flex items-start justify-between gap-4 px-6 py-4 text-left"
                        onClick={() => setOpenId(isOpen ? null : faq.id)}
                        aria-expanded={isOpen}
                      >
                        <span className={`font-sans font-semibold text-[0.97rem] transition-colors ${isOpen ? 'text-secondary' : 'text-foreground'}`}>
                          <HighlightText text={faq.q} query={query} />
                        </span>
                        <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all mt-0.5 ${isOpen ? 'bg-secondary text-white rotate-180' : 'bg-border text-muted'}`}>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </button>
                      <div
                        style={{
                          maxHeight: isOpen ? '600px' : '0',
                          overflow: 'hidden',
                          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                        }}
                      >
                        <p className="px-6 pb-5 text-muted text-[0.92rem] leading-relaxed">
                          <HighlightText text={faq.a} query={query} />
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })
            )}
          </div>

          {/* Contact section */}
          <Reveal preset="up">
            <div className="bg-green-hero rounded-2xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-white">Still have questions?</h2>
                <p className="text-white/75 text-[0.93rem] mt-2 mb-8">Our admissions team is available Monday to Saturday, 9 AM – 5 PM.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-px bg-white/10">
                {[
                  {
                    label: 'Call Us',
                    value: '+91 40 2398 8101',
                    sub: 'Mon–Sat, 9 AM – 5 PM',
                    href: 'tel:+914023988101',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M17 12.5a1 1 0 01-.33.66l-1.34 1.34A1 1 0 0114.33 15C7.33 15 6 8 6 8a1 1 0 01.33-1L7.67 5.67A1 1 0 018.33 5l2.5 5a1 1 0 01-.27 1.27L9.5 12a7 7 0 00.5.5 7 7 0 00.5.5l1.07-1.07A1 1 0 0112.83 12l5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Email Us',
                    value: 'admissions@mlrit.ac.in',
                    sub: 'Response within 1 business day',
                    href: 'mailto:admissions@mlrit.ac.in',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    ),
                  },
                  {
                    label: 'Visit Us',
                    value: 'Dundigal, Hyderabad',
                    sub: 'Quthbullapur, Hyderabad — 500043',
                    href: 'https://maps.google.com/?q=MLRIT+Hyderabad',
                    icon: (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
                        <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="10" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    ),
                  },
                ].map(c => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex flex-col gap-3 px-8 py-7 bg-green-hero hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-white/70 group-hover:text-white transition-colors">{c.icon}</span>
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/60">{c.label}</span>
                    <span className="font-sans font-bold text-white text-[0.95rem] leading-snug">{c.value}</span>
                    <span className="text-white/55 text-[0.8rem]">{c.sub}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
