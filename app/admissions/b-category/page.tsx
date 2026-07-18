import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'B-Category Admissions — MLRIT',
  description: 'B-Category (Management Quota) admissions at MLR Institute of Technology, Dundigal. Direct admissions for B.Tech programmes.',
};

export default function BCategoryPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative min-h-[60vh] flex flex-col justify-center overflow-hidden"
        style={{ background: '#01741f' }}
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e85d04 0%, transparent 70%)' }} />

        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-24">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/50 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/admissions" className="hover:text-white transition-colors">Admissions</Link>
            <span>/</span>
            <span className="text-white/80">B-Category</span>
          </div>

          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/80 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Management Quota
          </span>

          <h1 className="font-sans font-black text-white leading-[1.02] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem,5.5vw,5rem)' }}>
            B-Category<br />
            <span className="font-display italic font-medium" style={{ color: '#ffb27a' }}>
              Admissions
            </span>
          </h1>

          <p className="mt-6 text-white/75 text-[1.06rem] leading-relaxed max-w-[520px]">
            Direct admissions under Management Quota (B-Category) for B.Tech programmes at MLRIT. Seats are limited — secure yours early.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/admissions/support"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-foreground font-bold text-sm hover:bg-warm-light transition-all hover:scale-105"
            >
              Contact Admissions
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link
              href="/admissions/fees"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-all"
            >
              View Fee Structure
            </Link>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60Z" fill="#faf7f0"/>
          </svg>
        </div>
      </section>

      {/* ── MAIN CONTENT ── */}
      <section style={{ background: '#faf7f0' }} className="py-20 md:py-28">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">

          {/* ── Notification banner ── */}
          <div className="rounded-2xl mb-12 px-8 py-6 flex flex-wrap items-center gap-4"
            style={{ background: '#fff8f0', border: '1.5px solid #f5a96a' }}>
            <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase font-bold" style={{ color: '#e85d04' }}>
              Official Notification
            </span>
            <p className="font-sans font-semibold text-[0.95rem]" style={{ color: '#0f0f0f' }}>
              Admission into I B.Tech. under B-Category Seats — A.Y. 2026–27
            </p>
            <span className="ml-auto font-mono text-[0.72rem]" style={{ color: '#9d9b94' }}>Dated: 03-07-2026</span>
          </div>

          {/* ── Seat matrix ── */}
          <div className="mb-12">
            <h2 className="font-sans font-black text-[1.4rem] mb-1" style={{ color: '#0f0f0f', letterSpacing: '-0.02em' }}>
              Available Seats
            </h2>
            <p className="text-[0.88rem] mb-6" style={{ color: '#6a6a64' }}>
              15% Management Quota (Cat-B) · 15% NRI Quota — A.Y. 2026–27
            </p>
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1.5px solid #e4e0d7' }}>
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                  <tr style={{ background: '#01741f', color: '#fff' }}>
                    {['Course', 'Total Intake', 'Cat-B Seats (15%)', 'NRI Seats (15%)'].map(h => (
                      <th key={h} className="px-5 py-4 text-left font-bold text-[0.78rem] tracking-wide" style={{ letterSpacing: '0.04em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { course: 'Aerospace Engineering (AERO)',        intake: 60,  catB: 9,   nri: 9  },
                    { course: 'Computer Science & Engineering (CSE)', intake: 420, catB: 63,  nri: 63 },
                    { course: 'CSE (AI & Machine Learning)',          intake: 120, catB: 18,  nri: 18 },
                    { course: 'CSE (Data Science)',                   intake: 240, catB: 36,  nri: 36 },
                    { course: 'Electrical & Electronics Engg (EEE)',  intake: 180, catB: 27,  nri: 27 },
                    { course: 'Electronics & Communication (ECE)',    intake: 120, catB: 18,  nri: 18 },
                    { course: 'ECE (VLSI)',                           intake: 120, catB: 18,  nri: 18 },
                    { course: 'Mechanical Engineering (MECH)',        intake: 60,  catB: 9,   nri: 9  },
                    { course: 'MECH (Manufacturing)',                 intake: 30,  catB: 5,   nri: 5  },
                  ].map((row, i) => (
                    <tr key={row.course}
                      style={{ background: i % 2 === 0 ? '#faf7f0' : '#fff', borderBottom: '1px solid #e4e0d7' }}>
                      <td className="px-5 py-3.5 font-semibold" style={{ color: '#0f0f0f' }}>{row.course}</td>
                      <td className="px-5 py-3.5 tabular-nums text-center" style={{ color: '#6a6a64' }}>{row.intake}</td>
                      <td className="px-5 py-3.5 tabular-nums text-center font-bold" style={{ color: '#e85d04' }}>{row.catB}</td>
                      <td className="px-5 py-3.5 tabular-nums text-center" style={{ color: '#6a6a64' }}>{row.nri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Info grid ── */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {[
              {
                icon: '📋',
                title: 'Application Fee',
                body: 'Rs. 1,000/- (Non-Refundable). Payable in cash or DD in favour of MLR Institute of Technology, payable at Hyderabad.',
              },
              {
                icon: '🗓️',
                title: 'Last Date to Apply',
                body: 'On or before 10-07-2026. Applications accepted on any working day between 10:00 AM – 04:00 PM at the college campus.',
              },
              {
                icon: '📄',
                title: 'Documents Required',
                body: '10th & 12th mark sheets, Transfer Certificate, Migration Certificate, Caste Certificate (if applicable), Aadhaar card, and passport-size photographs.',
              },
              {
                icon: '✅',
                title: 'Eligibility',
                body: 'Passed 10+2 with Physics, Chemistry & Mathematics. Minimum 45% aggregate (40% for reserved categories). Subject to TS Govt. Rules & TSCHE orders.',
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-7" style={{ border: '1.5px solid #e4e0d7' }}>
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-sans font-black text-[1.05rem] mb-2" style={{ color: '#0f0f0f' }}>{title}</h3>
                <p className="text-[0.9rem] leading-relaxed" style={{ color: '#6a6a64' }}>{body}</p>
              </div>
            ))}
          </div>

          {/* ── Important note ── */}
          <div className="rounded-2xl px-7 py-5 mb-12" style={{ background: '#f0faf1', border: '1.5px solid #a8d5b0' }}>
            <p className="text-[0.88rem] leading-relaxed" style={{ color: '#0a3d15' }}>
              <span className="font-bold">Note:</span> Admissions are subject to approval from the Government of Telangana and JNTUH, and as per the orders of the Government of Telangana issued from time to time and the final verdict of Honorable High Court I.A. No. 1 of 2026 in W.P. No. 19192 of 2026. Tuition fee payable is Rs. 1,10,000/- per annum.
            </p>
          </div>

          {/* ── CTA strip ── */}
          <div className="rounded-2xl px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: '#01741f' }}>
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/60 mb-1">Limited seats — apply early</p>
              <h3 className="font-sans font-black text-white text-[1.5rem] leading-snug">Ready to join MLRIT?</h3>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link href="/admissions/support"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-foreground font-bold text-sm hover:bg-warm-light transition-all">
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link href="/admissions/fees"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold text-sm hover:bg-white/20 transition-all">
                Fee Structure
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
