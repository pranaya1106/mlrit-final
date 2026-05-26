export default function Placements() {
  const stats = [
    { num: '44', suffix: 'LPA', label: 'Highest Package' },
    { num: '5',  suffix: 'K+',  label: 'Total Offers' },
    { num: '200', suffix: '+',  label: 'Recruiting Companies' },
    { num: '98', suffix: '%',   label: 'Placement Rate' },
  ];
  return (
    <section id="placements" className="relative bg-[#0d0d0d] text-white py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-[640px] mx-auto">
          <span className="font-sans text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/55 mb-3 inline-block">
            Placements
          </span>
          <h2 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2.2rem,4vw,3.4rem)]">
            From Campus <span className="font-display italic font-medium text-warm">to Corporate.</span>
          </h2>
          <p className="mt-4 text-white/72 font-light leading-relaxed">
            Our placement records reflect the quality of education and industry readiness we build in every student.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-sans font-black text-white leading-none tracking-tighter-2 text-[clamp(2.2rem,3.6vw,3rem)]">
                {s.num}<span className="text-primary">{s.suffix}</span>
              </div>
              <div className="mt-3 font-sans font-bold text-[0.7rem] tracking-[0.16em] uppercase text-white/55">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="/placements"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white text-foreground font-medium text-sm hover:bg-warm transition-colors"
          >
            See full placements →
          </a>
        </div>
      </div>
    </section>
  );
}
