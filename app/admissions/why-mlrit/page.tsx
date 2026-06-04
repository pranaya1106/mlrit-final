import PageHeader from '@/components/PageHeader';
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import MLRITStory from '@/components/MLRITStory';

// ── Section data ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    tag: 'Academic Excellence',
    heading: 'NAAC Accredited.',
    italic: 'NBA Approved.',
    body: 'MLRIT holds NAAC accreditation and NBA approval for multiple programmes — the gold standard in Indian technical education. As an autonomous institution affiliated to JNTUH, we design our own curriculum that is current, industry-relevant and research-integrated.',
    stats: [
      { val: 'NAAC',    sub: 'Accredited'          },
      { val: 'NBA',     sub: '4 Programmes'         },
      { val: 'Auto.',   sub: 'Autonomous'            },
    ],
    accent: 'text-secondary',
  },
  {
    tag: 'Placements',
    heading: '621 Offers.',
    italic: 'One campus.',
    body: 'Our placement cell works year-round to connect students with global and Indian companies. The 2025–26 batch received 621 job offers, with the highest package of ₹51 LPA. 200+ companies visit campus for recruitment each year.',
    stats: [
      { val: '621',     sub: 'Placement Offers'  },
      { val: '₹51 LPA', sub: 'Highest Package'   },
      { val: '200+',    sub: 'Hiring Companies'  },
    ],
    accent: 'text-primary',
  },
  {
    tag: 'Innovation & Research',
    heading: 'Ideas that',
    italic: 'change things.',
    body: 'MLRIT\'s Innovation, Product, and Firmware Centre (IPFC) supports student-led product development from ideation to prototype. Three dedicated research centres focus on AI/ML, embedded systems and green energy. Students have filed 50+ patents.',
    stats: [
      { val: 'IPFC',   sub: 'Innovation Centre'     },
      { val: '3',      sub: 'Research Centres'      },
      { val: '50+',    sub: 'Patents Filed'          },
    ],
    accent: 'text-secondary',
  },
  {
    tag: 'Sports & Campus Life',
    heading: '38 acres of',
    italic: 'possibility.',
    body: 'A sprawling green campus, a 1,200-seat state-of-the-art auditorium, indoor sports complex, basketball courts, cricket ground and cafeteria — MLRIT campus is designed for holistic development, not just academics.',
    stats: [
      { val: '38 ac',  sub: 'Green Campus'              },
      { val: '1,200',  sub: 'Seat Auditorium'           },
      { val: '15+',    sub: 'Sports Facilities'         },
    ],
    accent: 'text-primary',
  },
  {
    tag: 'Industry Connections',
    heading: 'Bridging campus',
    italic: 'to the world.',
    body: 'MLRIT has signed 40+ Memoranda of Understanding with industry leaders including TCS, Infosys, Microsoft, Amazon Web Services, and ISRO. Students benefit from internship pipelines, industry mentors, and live project engagements.',
    stats: [
      { val: '40+',   sub: 'Industry MoUs'        },
      { val: '100+',  sub: 'Internship Partners'  },
      { val: '₹0',    sub: 'Extra Cost for Labs'  },
    ],
    accent: 'text-secondary',
  },
  {
    tag: 'Student Ecosystem',
    heading: 'Clubs, fests &',
    italic: 'community.',
    body: 'From technical clubs to cultural fests, hackathons to NSS and NCC — MLRIT student life is vibrant and inclusive. 30+ student clubs, an annual tech-cultural fest INVENTE, and inter-collegiate competitions shape well-rounded graduates.',
    stats: [
      { val: '30+',     sub: 'Student Clubs'    },
      { val: 'INVENTE', sub: 'Annual Tech Fest'  },
      { val: 'NSS',     sub: 'NCC & Service'   },
    ],
    accent: 'text-primary',
  },
];

export default function WhyMLRITPage() {
  return (
    <>
      <PageHeader
        variant="green"
        eyebrow="Why MLRIT"
        title="More than a degree —"
        italic="a launchpad."
        dek="MLRIT isn't just where you get a degree. It's where you discover your potential, build your network, and launch your career. Here's why thousands choose MLRIT every year."
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Admissions', href: '/admissions' },
          { label: 'Why MLRIT' },
        ]}
      />

      <div className="bg-warm-light min-h-screen">
        {SECTIONS.map((sec, i) => {
          const isEven = i % 2 === 0;
          return (
            <section
              key={sec.tag}
              className={`py-20 md:py-28 border-b border-border last:border-0 ${isEven ? 'bg-warm-light' : 'bg-white'}`}
            >
              <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
                <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}>
                  {/* Text */}
                  <div className="flex-1">
                    <Reveal preset="right">
                      <span className="font-mono text-[0.68rem] tracking-[0.2em] uppercase text-secondary font-bold">
                        {String(i + 1).padStart(2, '0')} — {sec.tag}
                      </span>
                      <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-foreground">
                        {sec.heading}
                        <br />
                        <span className={`font-display italic font-medium ${sec.accent}`}>{sec.italic}</span>
                      </h2>
                      <p className="mt-5 text-muted text-[0.97rem] leading-relaxed max-w-prose">{sec.body}</p>
                    </Reveal>
                  </div>

                  {/* Stats */}
                  <div className="lg:w-[360px] shrink-0">
                    <Stagger className="grid grid-cols-3 gap-4">
                      {sec.stats.map(st => (
                        <StaggerItem key={st.sub}>
                          <div className="bg-white border border-border rounded-2xl p-5 text-center shadow-card-soft hover:shadow-card-strong transition-shadow h-[90px] flex flex-col items-center justify-center">
                            <div className={`font-sans font-black tracking-tighter-2 text-[1.25rem] leading-none ${sec.accent}`}>
                              {st.val}
                            </div>
                            <div className="mt-2 font-mono text-muted text-[0.65rem] tracking-wide leading-tight text-center">
                              {st.sub}
                            </div>
                          </div>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </div>
              </div>
            </section>
          );
        })}

      </div>

      {/* ── MLRIT Letter Storytelling ── */}
      <MLRITStory />

      {/* Final CTA */}
      <section className="bg-green-hero py-20 md:py-24">
        <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
          <Reveal preset="up">
            <h2 className="font-sans font-black tracking-tighter-2 text-[clamp(1.8rem,3vw,2.8rem)] text-white leading-tight">
              Ready to be part of<br />
              <span className="font-display italic font-medium text-warm">the MLRIT story?</span>
            </h2>
            <p className="mt-5 text-white/75 text-[1rem] max-w-xl mx-auto">
              Admissions for AY 2025–26 are open. Apply today and take the first step towards an extraordinary career.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="https://mlrit.ac.in/admissions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-white font-bold font-sans hover:bg-primary-hover transition-colors shadow-primary-glow"
              >
                Apply Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="/departments/ug"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white/10 border border-white/25 text-white font-semibold font-sans hover:bg-white/20 transition-colors"
              >
                Explore Programmes
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
