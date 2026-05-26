export default function Testimonials() {
  const cards = [
    { name: 'Sathvika',      role: 'CSIT · MLRIT',                    batch: 'B.Tech CSE · 2023',  src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777366665/av1.mp4', accent: '#2E7D32' },
    { name: 'Dasam Pranay',  role: 'Aeronautical Engineering',        batch: 'B.Tech AE · 2023',   src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777366673/av2.mp4', accent: '#0668E1' },
    { name: 'Gopi Pavani',   role: 'Placed at Safran',                batch: 'B.Tech AE · 2022',   src: 'https://res.cloudinary.com/dhqhhtvym/video/upload/v1777366676/av3.mp4', accent: '#E8500A' },
  ];
  return (
    <section className="bg-gradient-to-br from-[#f0f2f0] via-[#e8ede9] to-[#eef0ee] py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-[640px] mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Alumni Voices
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.4rem)]">
            What Our <span className="font-display italic font-medium" style={{
              background: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text',
              WebkitTextFillColor: 'transparent', color: 'transparent',
            }}>Graduates Say.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <article key={c.name} className="group relative rounded-2xl overflow-hidden bg-black aspect-[3/4] border border-border">
              <video src={c.src} muted loop playsInline autoPlay preload="metadata" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent pointer-events-none" />
              <div className="absolute left-5 right-5 bottom-5 text-white">
                <div className="font-mono text-[0.62rem] tracking-[0.18em] uppercase" style={{ color: c.accent }}>{c.batch}</div>
                <div className="mt-1 font-sans font-extrabold text-xl">{c.name}</div>
                <div className="text-white/70 text-sm">{c.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
