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

          {/* Full image — served uncompressed, full resolution */}
          <div className="rounded-3xl overflow-hidden shadow-card-strong mb-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/admissions/b-category.jpeg"
              alt="B-Category Admissions — MLRIT"
              className="w-full h-auto block"
              style={{ imageRendering: 'auto' }}
            />
          </div>

          {/* Info grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              {
                title: 'What is B-Category?',
                body: 'B-Category seats are Management Quota seats filled directly by the institution outside the state counselling process. They are available across all B.Tech programmes offered at MLRIT.',
              },
              {
                title: 'Eligibility',
                body: 'Candidates must have passed 10+2 (or equivalent) with Physics, Chemistry and Mathematics, securing a minimum of 45% aggregate marks (40% for reserved categories).',
              },
              {
                title: 'How to Apply',
                body: 'Contact the MLRIT Admissions Office directly or visit the campus. Walk-in admissions are welcome. Seats are allotted on a first-come, first-served basis subject to eligibility.',
              },
              {
                title: 'Documents Required',
                body: '10th & 12th mark sheets, Transfer Certificate, Migration Certificate, Caste Certificate (if applicable), Aadhaar card, and 6 passport-size photographs.',
              },
            ].map(({ title, body }) => (
              <div key={title}
                className="bg-white rounded-2xl p-8"
                style={{ border: '1.5px solid #e4e0d7' }}>
                <h3 className="font-sans font-black text-[1.15rem] mb-3" style={{ color: '#0f0f0f' }}>{title}</h3>
                <p className="text-[0.95rem] leading-relaxed" style={{ color: '#6a6a64' }}>{body}</p>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="rounded-2xl px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: '#01741f' }}>
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-white/60 mb-1">Limited seats available</p>
              <h3 className="font-sans font-black text-white text-[1.5rem] leading-snug">Ready to join MLRIT?</h3>
            </div>
            <div className="flex flex-wrap gap-4 shrink-0">
              <Link
                href="/admissions/support"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-foreground font-bold text-sm hover:bg-warm-light transition-all"
              >
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
