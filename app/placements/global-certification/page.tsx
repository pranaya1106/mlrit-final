
import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { CERTIFICATIONS } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

// Verified certification partners with known names
const VERIFIED_CERTS = CERTIFICATIONS.filter(
  (c) => c.studentsCount !== undefined || c.id === 'sap' || c.id === 'servicenow',
);
const OTHER_CERTS = CERTIFICATIONS.filter(
  (c) => c.studentsCount === undefined && c.id !== 'sap' && c.id !== 'servicenow',
);

export default function GlobalCertificationPage() {
  return (
    <>
      {/* Page intro */}
      <section className="bg-white pt-14 pb-4">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Global Certification</span>
            <h1 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Credentials that <span className="font-display italic font-medium" style={gradientText}>travel with you.</span>
            </h1>
            <p className="mt-4 max-w-[700px] text-muted leading-relaxed">
              MLRIT students earn globally recognised certifications through formal partnerships with leading technology organisations —
              credentials that strengthen career prospects and validate domain expertise to employers worldwide.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Featured verified certifications */}
      <section className="bg-white py-14 md:py-20">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <h2 className="font-sans font-black tracking-tighter-2 text-foreground text-[1.5rem] mb-8">
              Verified <span className="font-display italic font-medium" style={gradientText}>certifications.</span>
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-5">
            {VERIFIED_CERTS.map((cert, i) => (
              <Reveal key={cert.id} preset="up" delay={i * 0.07}>
                <div className="rounded-2xl border border-border bg-warm-light p-7 h-full">
                  {/* Logo */}
                  {cert.logoSrc && (
                    <div className="mb-5 h-12 flex items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cert.logoSrc}
                        alt={`${cert.name} logo`}
                        className="max-h-full max-w-[120px] object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <h3 className="font-sans font-extrabold text-foreground text-[1.1rem] mb-1">{cert.name}</h3>
                  <p className="font-mono text-[0.72rem] tracking-[0.1em] text-muted mb-3">{cert.issuer}</p>
                  <p className="text-muted text-[0.92rem] leading-relaxed">{cert.description}</p>
                  {cert.skills && (
                    <div className="mt-4 flex flex-wrap gap-2" aria-label="Skills covered">
                      {cert.skills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 font-mono text-[0.68rem] text-primary tracking-wide">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {cert.studentsCount && (
                    <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border font-mono text-[0.72rem] font-semibold text-foreground tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" aria-hidden />
                      {cert.studentsCount}
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certification partners strip */}
      {OTHER_CERTS.length > 0 && (
        <section className="bg-ink text-white py-10 md:py-14">
          <div className="w-full px-6 md:px-10 lg:px-12">
            <Reveal>
              <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-warm/55">Certification Partners</span>
              <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-white text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
                More <span className="font-display italic font-medium text-warm">programmes.</span>
              </h2>
              <p className="mt-3 text-white/50 max-w-[540px] text-[0.92rem]">
                Additional certification partners — full programme details updated as institutional records are confirmed.
              </p>
            </Reveal>
            <Stagger className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5" delay={0.07}>
              {OTHER_CERTS.map((cert) => (
                <StaggerItem key={cert.id}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 h-full flex flex-col items-center justify-center text-center gap-3 hover:border-warm/30 transition-all">
                    {cert.logoSrc && (
                      <div className="h-10 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={cert.logoSrc}
                          alt={`${cert.name} certification partner logo`}
                          className="max-h-full max-w-[100px] object-contain opacity-80"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className="font-mono text-[0.68rem] tracking-[0.1em] text-white/45 uppercase">Partner</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* Value proposition */}
      <section className="bg-white py-10 md:py-14">
        <div className="w-full px-6 md:px-10 lg:px-12">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">Why It Matters</span>
            <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Beyond the <span className="font-display italic font-medium" style={gradientText}>degree.</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid md:grid-cols-3 gap-5">
            {[
              {
                title: 'Global Recognition',
                body: 'Certifications from SAP, ServiceNow, and other industry leaders are accepted and valued by employers worldwide.',
              },
              {
                title: 'Competitive Edge',
                body: 'Certified graduates enter the job market with verified domain credentials, standing out in competitive hiring processes.',
              },
              {
                title: 'Industry Alignment',
                body: 'Programmes are selected in partnership with our recruiting companies to match the skills they actively seek on campus.',
              },
            ].map((card, i) => (
              <Reveal key={card.title} preset="up" delay={i * 0.07}>
                <div className="rounded-2xl border border-border bg-warm-light p-7 h-full">
                  <div className="w-2 h-2 rounded-full bg-primary mb-4" aria-hidden />
                  <h3 className="font-sans font-extrabold text-foreground text-[1.05rem] mb-3">{card.title}</h3>
                  <p className="text-muted text-[0.9rem] leading-relaxed">{card.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
