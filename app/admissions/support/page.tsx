'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/motion/Reveal';
import MapEmbed from '@/components/MapEmbed';

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

          {/* Quick contact strip */}
          <Reveal preset="up">
            <div className="bg-green-hero rounded-2xl overflow-hidden">
              <div className="px-8 pt-8 pb-2">
                <h2 className="font-sans font-black tracking-tighter-2 text-[1.5rem] text-white">Still have questions?</h2>
                <p className="text-white/75 text-[0.93rem] mt-2 mb-8">Our admissions team is available Monday to Saturday, 9 AM – 5 PM.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-px bg-white/10">
                {[
                  { label: 'Admissions Helpdesk', value: '+91 96522 26061', sub: 'Mon–Sat, 9 AM – 5 PM', href: 'tel:+919652226061' },
                  { label: 'Email', value: 'admissions@mlrinstitutions.ac.in', sub: 'Response within 1 business day', href: 'mailto:admissions@mlrinstitutions.ac.in' },
                  { label: 'Toll Free', value: '1800 572 4363', sub: 'Free from any network', href: 'tel:18005724363' },
                ].map(c => (
                  <a key={c.label} href={c.href}
                    className="flex flex-col gap-2 px-8 py-7 bg-green-hero hover:bg-white/5 transition-colors group"
                  >
                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/60">{c.label}</span>
                    <span className="font-sans font-bold text-white text-[0.95rem] leading-snug">{c.value}</span>
                    <span className="text-white/55 text-[0.8rem]">{c.sub}</span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Key contacts table */}
          <Reveal preset="up">
            <div>
              <h2 className="font-sans font-black tracking-tighter-2 text-[1.4rem] text-foreground mb-5">Key Contacts</h2>
              <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card-soft overflow-x-auto">
                <table className="w-full text-left text-[0.88rem]">
                  <thead className="bg-warm-light border-b border-border">
                    <tr>
                      <th className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">Name</th>
                      <th className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted hidden md:table-cell">Designation</th>
                      <th className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted">Contact</th>
                      <th className="px-5 py-3 font-mono text-[0.65rem] tracking-[0.14em] uppercase text-muted hidden lg:table-cell">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Dr. P. Sridhar',            role: 'Principal',                           phone: '91604 04636', email: 'principal@mlrinstitutions.ac.in' },
                      { name: 'Dr. CH Achireddy',           role: 'Admissions I/C',                      phone: '98666 52122', email: 'admissions@mlrinstitutions.ac.in' },
                      { name: 'Mr. P Ravi Chandra',         role: 'Head – Placements',                   phone: '98499 91299', email: 'ravichandra@mlrinstitutions.ac.in' },
                      { name: 'Mr. S. Arun Kumar',          role: 'Asst. TPO',                           phone: '98661 93405', email: 'placements@mlrinstitutions.ac.in' },
                      { name: 'Dr. Ajmeera Kiran',          role: 'HOD – CSE',                           phone: '97045 45364', email: 'hodcse@mlrinstitutions.ac.in' },
                      { name: 'Dr. S.V.S Prasad',           role: 'HOD – ECE',                           phone: '91604 04638', email: 'hodece@mlrinstitutions.ac.in' },
                      { name: 'Dr. Kashi Sai Prasad',       role: 'HOD – CSE (AIML)',                    phone: '95059 95544', email: 'hodaiml@mlrinstitutions.ac.in' },
                      { name: 'Dr. M. Satyanarayana Gupta', role: 'HOD – Aeronautical & Hostel I/C',     phone: '91604 04640', email: 'aerohod@mlrinstitutions.ac.in' },
                      { name: 'Mr. G. Prabhakar Reddy',     role: 'Controller of Examinations',          phone: '91009 63025', email: 'coe@mlrinstitutions.ac.in' },
                      { name: 'Mr. A. Koti Reddy',          role: 'Head – Library',                      phone: '94406 53380', email: 'librarian@mlrinstitutions.ac.in' },
                      { name: 'Mr. M. Ganesh',              role: 'Administrative Officer',              phone: '98663 92008', email: 'sao@mlrinstitutions.ac.in' },
                      { name: 'Mr. Ravi',                   role: 'Scholarship Incharge',                phone: '91770 80807', email: 'scholarship@mlrinstitutions.ac.in' },
                    ].map((c, i) => (
                      <tr key={c.name} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-warm-light/20'}`}>
                        <td className="px-5 py-3 font-sans font-semibold text-foreground">{c.name}</td>
                        <td className="px-5 py-3 text-muted hidden md:table-cell">{c.role}</td>
                        <td className="px-5 py-3">
                          <a href={`tel:+91${c.phone.replace(/\s/g,'')}`} className="font-mono text-secondary hover:underline text-[0.85rem]">
                            {c.phone}
                          </a>
                        </td>
                        <td className="px-5 py-3 hidden lg:table-cell">
                          <a href={`mailto:${c.email}`} className="text-muted hover:text-primary transition-colors text-[0.82rem]">
                            {c.email}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>

          {/* Address + Map */}
          <Reveal preset="up">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="font-sans font-black tracking-tighter-2 text-[1.4rem] text-foreground mb-2">Reach Us</h2>
                <p className="text-muted text-[0.9rem] mb-5">Get in touch or find us on campus — we're always here to help.</p>
                <div className="bg-white border border-border rounded-2xl p-7 shadow-card-soft space-y-5">
                  <div>
                    <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">Official Address</p>
                    <p className="text-foreground leading-relaxed">
                      Dundigal V, Survey No. 444, Dundigal,<br />
                      Gandi Maisamma, Medchal Malkajgiri,<br />
                      Telangana – 500 043
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-2">General Enquiries</p>
                    <div className="space-y-1.5">
                      <a href="tel:+919652226061" className="flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M12 9.17a.7.7 0 01-.23.46l-.94.94a.7.7 0 01-.55.19C4.61 10.76 3.28 4.67 3.28 4.67a.7.7 0 01.23-.7l.94-.94a.7.7 0 01.47-.19l1.75 3.5a.7.7 0 01-.19.89l-.56.56a4.2 4.2 0 00.35.35 4.2 4.2 0 00.35.35l.56-.56a.7.7 0 01.89-.19l3.5 1.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        +91 96522 26061
                      </a>
                      <a href="tel:18005724363" className="flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M12 9.17a.7.7 0 01-.23.46l-.94.94a.7.7 0 01-.55.19C4.61 10.76 3.28 4.67 3.28 4.67a.7.7 0 01.23-.7l.94-.94a.7.7 0 01.47-.19l1.75 3.5a.7.7 0 01-.19.89l-.56.56a4.2 4.2 0 00.35.35 4.2 4.2 0 00.35.35l.56-.56a.7.7 0 01.89-.19l3.5 1.75z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        1800 572 4363 (Toll Free)
                      </a>
                      <a href="mailto:info@mlrinstitutions.ac.in" className="flex items-center gap-2 text-secondary font-semibold text-[0.93rem] hover:underline">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5l6 3.5L13 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        info@mlrinstitutions.ac.in
                      </a>
                    </div>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="font-mono text-[0.65rem] font-bold tracking-[0.18em] uppercase text-muted mb-1">EAPCET Code</p>
                    <p className="font-sans font-black text-foreground text-[1.2rem] tracking-tight">MLID</p>
                  </div>
                </div>
              </div>
              <MapEmbed className="h-[400px]" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
