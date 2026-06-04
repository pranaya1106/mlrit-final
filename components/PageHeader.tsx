// Generic dark-gradient hero used by IQAC, Research, Departments etc.
import { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  italic,
  dek,
  crumbs,
  variant = 'green',
  tone = 'dark',
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  dek?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  variant?: 'green' | 'navy' | 'orange';
  /** 'dark' = the original gradient hero (default). 'light' = editorial cream hero. */
  tone?: 'dark' | 'light';
}) {
  /* ── Light / editorial hero (cream gradient, green accent, orange pill) ── */
  if (tone === 'light') {
    return (
      <section className="relative overflow-hidden bg-cream-gradient text-foreground">
        <span aria-hidden className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-secondary via-primary to-secondary" />
        <div aria-hidden className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-secondary/10 blur-[90px] pointer-events-none" />
        <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-14 md:py-20">
          {crumbs && (
            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-muted mb-6">
              {crumbs.map((c, i) => (
                <span key={i} className="flex items-center gap-2">
                  {c.href ? (
                    <a href={c.href} className="hover:text-primary transition-colors">{c.label}</a>
                  ) : (
                    <span className="text-foreground/70">{c.label}</span>
                  )}
                  {i < crumbs.length - 1 && <span className="text-subtle">/</span>}
                </span>
              ))}
            </div>
          )}
          {eyebrow && (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {eyebrow}
            </span>
          )}
          <h1 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,4vw,3.4rem)]">
            {title}
            {italic && <> <span className="font-display italic font-medium text-secondary">{italic}</span></>}
          </h1>
          {dek && <p className="mt-5 text-muted leading-relaxed text-[1.06rem] max-w-[720px]">{dek}</p>}
        </div>
      </section>
    );
  }

  const bg = {
    green:  'bg-green-hero',
    navy:   'bg-gradient-to-br from-[#0B0F1A] to-[#18283b]',
    orange: 'bg-gradient-to-br from-[#3a1503] to-[#6a2a0a]',
  }[variant];

  // Wave fill colour matches the page background below (always warm-light / white)
  const waveColor = '#faf7f0';

  return (
    <section className={`${bg} text-white relative overflow-hidden`}>
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/15 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-secondary/20 blur-[80px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-28">
        {crumbs && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] tracking-[0.14em] uppercase text-white/55 mb-6">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                {c.href ? <a href={c.href} className="hover:text-primary">{c.label}</a> : c.label}
                {i < crumbs.length - 1 && <span className="text-white/30">/</span>}
              </span>
            ))}
          </div>
        )}
        {eyebrow && (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2rem,4vw,3.6rem)]">
          {title}
          {italic && <span className="block font-display italic font-medium text-warm">{italic}</span>}
        </h1>
        {dek && <p className="mt-6 text-white/78 leading-relaxed text-[1.08rem] max-w-[720px]">{dek}</p>}
      </div>

      {/* Curved bottom wave — same as admissions hero */}
      <div className="absolute bottom-0 left-0 right-0 leading-none">
        <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block" preserveAspectRatio="none" style={{ height: '56px' }}>
          <path d="M0 56 C360 0 1080 0 1440 56 L1440 56 L0 56Z" fill={waveColor} />
        </svg>
      </div>
    </section>
  );
}
