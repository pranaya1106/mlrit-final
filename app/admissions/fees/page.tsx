'use client';

import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';

// ── Fee data ───────────────────────────────────────────────────────────────
const FEE_DATA = [
  {
    degree: 'B.Tech',
    via: 'AP/TS EAMCET (Convener & Management Quota)',
    programmes: [
      { name: 'All B.Tech Branches (CSE, ECE, EEE, MECH, AERO, IT, AIML, etc.)', tuition: '1,10,000', total: '1,10,000' },
    ],
    color: 'border-secondary/30',
    headerBg: 'bg-green-50',
    badge: 'bg-green-50 border-green-200 text-secondary',
  },
  {
    degree: 'M.Tech',
    via: 'GATE / PGECET',
    programmes: [
      { name: 'CSE / VLSI / Power Systems / Aerospace Propulsion', tuition: '60,000', total: '60,000' },
    ],
    color: 'border-primary/30',
    headerBg: 'bg-orange-50',
    badge: 'bg-orange-50 border-orange-200 text-primary',
  },
  {
    degree: 'MBA',
    via: 'AP/TS ICET',
    programmes: [
      { name: 'Master of Business Administration (Dual Specialisation)', tuition: '60,000', total: '60,000' },
    ],
    color: 'border-secondary/30',
    headerBg: 'bg-green-50',
    badge: 'bg-green-50 border-green-200 text-secondary',
  },
];

const OTHER_FEES = [
  { label: 'Admission Fee (one-time)',       amount: '₹5,000'  },
  { label: 'Library & Reading Room',         amount: '₹3,000 / year' },
  { label: 'Sports & Cultural Activities',   amount: '₹2,500 / year' },
  { label: 'Examination Fee (per semester)', amount: '₹2,500'  },
  { label: 'Hostel Fee (optional)',           amount: '₹55,000–₹75,000 / year' },
];

export default function FeesPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Fee Structure 2025–26"
        title="Transparent &"
        italic="competitive fees."
        dek="MLRIT offers quality education at accessible fee levels. Fee structure is approved by the Telangana Fee Regulation Committee (TSFRC) / APSCHE."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Fee Structure' },
        ]}
      />

      <section className="bg-warm-light min-h-screen py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col gap-12">

          {/* Programme fee tables */}
          {FEE_DATA.map((deg, i) => (
            <Reveal key={deg.degree} preset="up" delay={i * 0.1}>
              <div className={`bg-white rounded-2xl border-2 ${deg.color} shadow-card-soft overflow-hidden`}>
                {/* Card header */}
                <div className={`${deg.headerBg} px-6 py-5 flex flex-wrap items-center gap-4 border-b border-border`}>
                  <span className={`px-3.5 py-1.5 rounded-full border text-[0.68rem] font-mono font-bold tracking-widest uppercase ${deg.badge}`}>
                    {deg.degree}
                  </span>
                  <div>
                    <span className="font-sans font-bold text-foreground text-[1.05rem]">{deg.degree} Programmes</span>
                    <span className="ml-3 font-mono text-[0.78rem] text-muted">via {deg.via}</span>
                  </div>
                </div>

                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-6 py-3 font-mono text-[0.7rem] uppercase tracking-widest text-muted font-bold w-[55%]">Programme</th>
                        <th className="text-right px-6 py-3 font-mono text-[0.7rem] uppercase tracking-widest text-muted font-bold">Tuition Fee / Year</th>
                        <th className="text-right px-6 py-3 font-mono text-[0.7rem] uppercase tracking-widest text-muted font-bold">Approx. Total / Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {deg.programmes.map((p, j) => (
                        <tr key={j} className="border-b border-border last:border-0 hover:bg-warm-light/60 transition-colors">
                          <td className="px-6 py-4 font-sans text-foreground font-medium">{p.name}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-foreground">₹{p.tuition}</td>
                          <td className="px-6 py-4 text-right font-mono text-muted">₹{p.total}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden flex flex-col divide-y divide-border">
                  {deg.programmes.map((p, j) => (
                    <div key={j} className="p-5 flex flex-col gap-2">
                      <p className="font-sans font-medium text-foreground text-[0.95rem]">{p.name}</p>
                      <div className="flex justify-between mt-1">
                        <span className="font-mono text-[0.75rem] text-muted">Tuition / year</span>
                        <span className="font-mono font-bold text-foreground">₹{p.tuition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-mono text-[0.75rem] text-muted">Approx. total / year</span>
                        <span className="font-mono text-muted">₹{p.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}

          {/* Other fees */}
          <Reveal preset="up" delay={0.15}>
            <div className="bg-white rounded-2xl border border-border shadow-card-soft overflow-hidden">
              <div className="px-6 py-5 border-b border-border">
                <h3 className="font-sans font-bold text-[1.05rem] text-foreground">Other Fees & Charges</h3>
                <p className="text-muted text-[0.85rem] mt-1">These are in addition to the annual tuition fee.</p>
              </div>
              <Stagger className="flex flex-col divide-y divide-border">
                {OTHER_FEES.map(f => (
                  <StaggerItem key={f.label}>
                    <div className="flex items-center justify-between px-6 py-4 hover:bg-warm-light/60 transition-colors">
                      <span className="font-sans text-foreground text-[0.93rem]">{f.label}</span>
                      <span className="font-mono font-bold text-foreground text-[0.9rem]">{f.amount}</span>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </Reveal>

          {/* Note + Download */}
          <Reveal preset="up" delay={0.1}>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
              <div>
                <p className="font-sans font-semibold text-foreground text-[0.95rem]">Fee Revision Note</p>
                <p className="text-muted text-[0.87rem] mt-1 max-w-xl">
                  Fee structure is subject to revision by the respective fee regulatory authority each academic year. Fees shown are for AY 2025–26. Management quota fees differ from convener quota and are available on request.
                </p>
              </div>
              <a
                href="/fee-structure-2025.pdf"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-bold font-sans text-sm hover:bg-primary-hover transition-colors shadow-primary-glow whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M8 2v8m-3-3 3 3 3-3M3 13h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Fee Structure
              </a>
            </div>
          </Reveal>

          {/* Payment modes */}
          <Reveal preset="up" delay={0.1}>
            <div className="bg-white border border-border rounded-2xl p-6 shadow-card-soft">
              <h3 className="font-sans font-bold text-[1.02rem] text-foreground mb-4">Accepted Payment Modes</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { mode: 'Online Portal', detail: 'MLRIT student portal — debit/credit card, UPI, net banking' },
                  { mode: 'DD / Cheque',   detail: 'Demand Draft in favour of "MLRIT" payable at Hyderabad'     },
                  { mode: 'At Counter',    detail: 'Cash or card payment at the MLRIT accounts office'          },
                ].map(p => (
                  <div key={p.mode} className="bg-warm-light rounded-xl p-4">
                    <p className="font-sans font-semibold text-foreground text-[0.9rem]">{p.mode}</p>
                    <p className="text-muted text-[0.83rem] mt-1">{p.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

        </div>
      </section>
    </>
  );
}
