// Generic dark-gradient hero used by IQAC, Research, Departments etc.
import { ReactNode } from 'react';

export default function PageHeader({
  eyebrow,
  title,
  italic,
  dek,
  crumbs,
  variant = 'green',
}: {
  eyebrow?: string;
  title: string;
  italic?: string;
  dek?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  variant?: 'green' | 'navy' | 'orange';
}) {
  const bg = {
    green:  'bg-gradient-to-br from-[#0d3320] to-[#18453B]',
    navy:   'bg-gradient-to-br from-[#0B0F1A] to-[#18283b]',
    orange: 'bg-gradient-to-br from-[#3a1503] to-[#6a2a0a]',
  }[variant];

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
    </section>
  );
}
