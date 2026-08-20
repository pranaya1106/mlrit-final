
import Image from 'next/image';
import Reveal from '@/components/motion/Reveal';
import { DRIVES } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementDrivesPage() {
  return (
    <>
      {/* Page intro */}
      <section className="bg-white pt-14 pb-4">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
          <Reveal>
            <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-primary">On Campus</span>
            <h1 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
              Placement <span className="font-display italic font-medium" style={gradientText}>Drives.</span>
            </h1>
            <p className="mt-4 max-w-[680px] text-muted leading-relaxed">
              Industry partners recruit directly from campus — bringing pre-placement talks, assessments, and offer sessions to MLRIT every year.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-white py-14 md:py-20">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">

          {/* Feature image — full width */}
          <Reveal preset="scale" delay={0.05}>
            <div className="relative overflow-hidden rounded-2xl bg-warm-light aspect-[21/9]">
              <Image
                src={DRIVES[0].src}
                alt={DRIVES[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 1280px"
                className="object-cover object-center transition-transform duration-700 ease-[0.22,1,0.36,1] hover:scale-[1.015]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
                <span className="font-mono text-[0.7rem] tracking-[0.14em] text-white/90">{DRIVES[0].caption}</span>
              </div>
            </div>
          </Reveal>

          {/* Supporting grid */}
          <div className="mt-4 md:mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {DRIVES.slice(1).map((drive, i) => (
              <Reveal key={drive.id} preset="scale" delay={0.08 + i * 0.06}>
                <div className="relative overflow-hidden rounded-2xl bg-warm-light aspect-[4/3]">
                  <Image
                    src={drive.src}
                    alt={drive.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-700 ease-[0.22,1,0.36,1] hover:scale-[1.015]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-3">
                    <span className="font-mono text-[0.62rem] leading-snug tracking-[0.12em] text-white/90">{drive.caption}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
