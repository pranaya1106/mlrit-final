// Generic light content section used by IQAC, Research and similar pages.
import { ReactNode } from 'react';

export function Section({ children, surface = false, id }: { children: ReactNode; surface?: boolean; id?: string }) {
  return (
    <section id={id} className={`${surface ? 'bg-[#f4f1ea]' : 'bg-white'} py-14 md:py-20`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">{children}</div>
    </section>
  );
}

export function H2({ children, italic }: { children: ReactNode; italic?: string }) {
  return (
    <h2 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(1.7rem,2.8vw,2.4rem)] mb-5">
      {children}
      {italic && <span className="font-display italic font-medium ml-1" style={{
        backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent', color: 'transparent',
      }}>{italic}</span>}
    </h2>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <p className="text-muted leading-relaxed text-[1.05rem] max-w-[720px]">{children}</p>;
}
