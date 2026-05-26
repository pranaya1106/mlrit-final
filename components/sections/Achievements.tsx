export default function Achievements() {
  const ranks = [
    { num: '201', title: 'NIRF Rankings 2024',     sub: '201–300 Band, Engineering Category' },
    { num: '#6',  title: 'Times Engineering Survey', sub: '6th in Telangana' },
    { num: 'AAAA',title: 'Career360 Rating',        sub: 'Four-A Accredited Institution' },
  ];
  const logos = [
    { name: 'NAAC',  src: '/legacy/nirf/naac.svg' },
    { name: 'AICTE', src: '/legacy/nirf/aicte.svg' },
    { name: 'The Week', src: '/legacy/nirf/the%20week.svg' },
    { name: 'ARIIA', src: '/legacy/nirf/arha.svg' },
    { name: 'NBA',   src: '/legacy/nirf/nba.svg' },
    { name: 'Dataquest', src: '/legacy/nirf/dataquest.svg' },
  ];
  return (
    <section id="achievements" className="bg-[#fafafa] py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Recognition
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)]">
            Accreditations <span className="font-display italic font-medium" style={{
              background: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>and Approvals.</span>
          </h2>
          <p className="mt-4 max-w-[560px] text-muted font-light leading-relaxed text-[1.05rem]">
            AICTE, NAAC, NBA, ARIIA and more — recognised by leading national bodies for academic
            excellence and quality education.
          </p>
          <ul className="mt-8 space-y-4">
            {ranks.map((r) => (
              <li key={r.title} className="grid grid-cols-[80px_1fr] items-center gap-4 border-t border-border pt-4">
                <div className="font-display italic font-black text-[2.4rem] text-foreground leading-none tracking-tighter-2">{r.num}</div>
                <div>
                  <div className="font-bold text-foreground">{r.title}</div>
                  <div className="text-sm text-muted">{r.sub}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-3 gap-6 md:gap-8 items-center justify-items-center">
          {logos.map((l) => (
            <div key={l.name} className="w-24 h-24 rounded-full bg-white shadow-[0_8px_24px_rgba(17,17,17,0.06)] border border-border grid place-items-center p-3 hover:-translate-y-1 transition-transform">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.src} alt={l.name} className="max-w-full max-h-full" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
