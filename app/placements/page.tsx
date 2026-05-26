import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Placements — MLRIT',
  description: 'MLRIT placement records: 80%+ placements every year, ₹33 LPA highest package, 62+ recruiting companies and 7000+ alumni placed.',
};

const WALL_STATS = [
  { val: '₹33 LPA', lbl: 'Highest Package' },
  { val: '536+',    lbl: 'Offers · 2025'   },
  { val: '62+',     lbl: 'Companies'       },
  { val: '7000+',   lbl: 'Alumni Placed'   },
];

const RECRUITERS = [
  'Microsoft', 'Amazon', 'Cognizant', 'Infosys', 'TCS', 'Wipro', 'Accenture', 'HCL Tech',
  'Capgemini', 'Tech Mahindra', 'Deloitte', 'IBM', 'L&T', 'Virtusa', 'Cyient', 'Mphasis',
  'Hexaware', 'Genpact', 'EPAM', 'Eidiko', 'Mehta Hitech', 'Verzeo', 'Safran', 'GE Aviation',
];

const INFRA_LIST = [
  'Dedicated placement block with multiple interview suites',
  '1200-seat auditorium for pre-placement talks',
  '800+ system computer labs for online assessments',
  'High-speed 1 Gbps campus-wide connectivity',
  'Hostel accommodation for visiting recruiters',
];

const INFRA_STATS = [
  { num: '800+',   label: 'Systems'         },
  { num: '1200',   label: 'Seat Auditorium' },
  { num: '1 Gbps', label: 'Connectivity'    },
];

const MOU = [
  { name: 'IBM Centre of Excellence',    desc: 'AI, Cloud and Cybersecurity training tracks for B.Tech students.' },
  { name: 'Wipro TalentNext',            desc: 'Java Full Stack certification programme for faculty and students.' },
  { name: 'L&T EduTech',                 desc: 'Industry-led courses in construction technology and design.' },
  { name: 'Salesforce Trailhead',        desc: 'CRM platform training and cloud certifications.' },
  { name: 'AWS Academy',                 desc: 'Cloud foundations and architect-associate certification tracks.' },
  { name: 'Microsoft Learn for Educators', desc: 'Curriculum-integrated Azure and AI learning paths.' },
];

const GALLERY = [
  { tag: 'Cognizant · Pre-Placement Talk',          img: 'https://mlrit.ac.in/wp-content/uploads/2025/04/Aero1.jpeg' },
  { tag: 'Infosys · Campus Drive 2025',             img: 'https://mlrit.ac.in/wp-content/uploads/2024/08/AIRA_Bot.jpeg' },
  { tag: 'HCL Tech · Open Day',                     img: 'https://mlrit.ac.in/wp-content/uploads/2025/09/or.jpeg' },
  { tag: 'Eidiko Systems · Walk-in',                img: 'https://i.ibb.co/YFgQdGgx/1.jpg' },
  { tag: 'Cybage Software · Scholarships',          img: 'https://mlrit.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2025-12-18-at-07.43.56.jpeg' },
  { tag: 'Microsoft Internship Programme',          img: 'https://i.ibb.co/MxvbKjRH/8.jpg' },
];

export default function PlacementsPage() {
  return (
    <div>
      {/* WALL — dark hero */}
      <section id="pl-wall" className="relative bg-[#0d0d0d] text-white overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          autoPlay muted loop playsInline preload="metadata"
        >
          <source src="https://res.cloudinary.com/dhqhhtvym/video/upload/v1777367629/hero1_hq.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/85" />
        <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-24 md:py-32 lg:py-40">
          <span className="font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase text-white/55 mb-4 inline-block">
            Placements at MLRIT
          </span>
          <h1 className="font-sans font-extrabold leading-[0.96] tracking-tighter-2 text-white text-[clamp(2.4rem,5.6vw,5rem)] mb-5">
            Engineering careers<br />
            <span className="font-display italic font-medium text-warm">are built here.</span>
          </h1>
          <p className="text-white/72 font-light leading-relaxed text-[1.08rem] max-w-[640px] mb-10">
            80% and above placements every year — engineers from MLRIT land roles at the world's most respected organisations.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 pt-6 border-t border-white/15 max-w-[820px]">
            {WALL_STATS.map((s) => (
              <div key={s.lbl}>
                <div className="font-sans font-black text-white leading-none tracking-tighter-2 text-[clamp(1.6rem,2.4vw,2.4rem)]">{s.val}</div>
                <div className="mt-2 font-mono font-medium text-[0.66rem] tracking-[0.16em] uppercase text-white/55">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PERFORMANCE — light */}
      <section id="pl-performance" className="bg-white py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Eyebrow>Performance</Eyebrow>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)] mb-12">
            Placement <span className="font-display italic font-medium" style={gradientText}>performance.</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { yr: '2023', stat: '492 offers', extra: '₹28 LPA highest' },
              { yr: '2024', stat: '510 offers', extra: '₹31 LPA highest' },
              { yr: '2025', stat: '536+ offers', extra: '₹33 LPA highest' },
            ].map((p) => (
              <div key={p.yr} className="rounded-2xl border border-border p-8 bg-white hover:border-primary hover:-translate-y-1 transition-all">
                <div className="font-mono font-semibold text-[0.7rem] tracking-[0.18em] uppercase text-muted">{p.yr}</div>
                <div className="mt-3 font-sans font-black text-foreground text-[clamp(1.8rem,2.4vw,2.2rem)] tracking-tighter-2">{p.stat}</div>
                <div className="mt-2 text-muted">{p.extra}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RECRUITERS — dark */}
      <section id="pl-recruiters" className="bg-[#0B0F1A] text-white py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Eyebrow dark>Recruiters</Eyebrow>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2rem,3.6vw,3rem)] mb-3">
            Top Hiring <span className="font-display italic font-medium text-warm">Partners.</span>
          </h2>
          <p className="text-white/55 max-w-[640px] mb-10">
            Leading organisations across IT, product, consulting, and core engineering sectors recruit regularly from MLRIT.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {RECRUITERS.map((r) => (
              <div key={r} className="bg-white/[0.04] border border-white/10 rounded-xl px-4 py-5 text-center font-medium text-white/85 hover:bg-white/10 hover:border-primary transition-colors">
                {r}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INFRA — surface */}
      <section id="pl-infra" className="bg-[#f7f7f5] py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <Eyebrow>Infrastructure</Eyebrow>
            <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)] mb-4">
              Placement <span className="font-display italic font-medium" style={gradientText}>infrastructure.</span>
            </h2>
            <p className="text-muted leading-relaxed mb-7 max-w-[560px]">
              MLRIT maintains a dedicated placement block equipped to host large-scale campus recruitment drives throughout the year.
            </p>
            <ul className="space-y-3.5">
              {INFRA_LIST.map((i) => (
                <li key={i} className="flex items-start gap-3 text-[1.02rem]">
                  <span className="flex-shrink-0 mt-2 w-2 h-2 rounded-full bg-primary" />
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {INFRA_STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white border border-border p-7">
                <div className="font-sans font-black text-foreground text-[clamp(2rem,3vw,2.6rem)] leading-none tracking-tighter-2">{s.num}</div>
                <div className="mt-2 font-mono font-semibold text-[0.72rem] tracking-[0.16em] uppercase text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOU — white */}
      <section id="pl-mou" className="bg-white py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Eyebrow>Partnerships</Eyebrow>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)] mb-3">
            MoUs and <span className="font-display italic font-medium" style={gradientText}>Centres of Excellence.</span>
          </h2>
          <p className="text-muted max-w-[640px] mb-10">
            MLRIT has established formal partnerships and Centres of Excellence with leading industry organisations to provide students with advanced domain training and direct placement pathways.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOU.map((m) => (
              <div key={m.name} className="rounded-2xl border border-border bg-white p-6 hover:border-primary hover:shadow-[0_12px_32px_rgba(17,17,17,0.06)] transition-all">
                <div className="font-sans font-extrabold text-foreground text-lg">{m.name}</div>
                <p className="mt-2 text-muted leading-relaxed text-[0.95rem]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY — surface */}
      <section id="pl-gallery" className="bg-[#f7f7f5] py-20 md:py-24">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Eyebrow green>Gallery</Eyebrow>
          <h2 className="mt-4 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2rem,3.6vw,3rem)] mb-3">
            Placement <span className="font-display italic font-medium text-secondary">drives.</span>
          </h2>
          <p className="text-muted max-w-[640px] mb-10">
            Dozens of companies. Hundreds of offers. Every placement season, MLRIT brings industry directly to campus.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {GALLERY.map((g, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-black aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.img} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 font-mono text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white/90">
                  {g.tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

function Eyebrow({ children, dark, green }: { children: React.ReactNode; dark?: boolean; green?: boolean }) {
  const cls = dark
    ? 'bg-white/[0.06] border border-white/15 text-white/60'
    : green
    ? 'bg-green-50 border border-green-200 text-secondary'
    : 'bg-orange-50 border border-orange-200 text-primary';
  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${green ? 'bg-secondary' : dark ? 'bg-primary' : 'bg-primary'} animate-pulse`} />
      {children}
    </span>
  );
}
