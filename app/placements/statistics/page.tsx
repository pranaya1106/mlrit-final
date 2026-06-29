'use client';

import Reveal, { Stagger, StaggerItem } from '@/components/motion/Reveal';
import { DRIVES } from '@/lib/placements';

const gradientText: React.CSSProperties = {
  backgroundImage: 'linear-gradient(180deg, var(--foreground) 0%, var(--primary) 115%)',
  WebkitBackgroundClip: 'text', backgroundClip: 'text',
  WebkitTextFillColor: 'transparent', color: 'transparent',
};

export default function PlacementsStatisticsPage() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <Reveal>
          <span className="font-mono text-[0.7rem] font-bold tracking-[0.22em] uppercase text-secondary">On Campus</span>
          <h2 className="mt-3 font-sans font-black tracking-tighter-2 text-foreground text-[clamp(2rem,3.6vw,3rem)] leading-[1.04]">
            Placement <span className="font-display italic font-medium text-secondary" style={gradientText}>drives.</span>
          </h2>
          <p className="mt-4 text-muted max-w-[640px]">
            Dozens of companies. Hundreds of offers. Every placement season, MLRIT brings industry directly to campus.
          </p>
        </Reveal>
        <Stagger className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5" delay={0.07}>
          {DRIVES.map((d, i) => (
            <StaggerItem key={i}>
              <div className="group relative overflow-hidden rounded-2xl border border-border bg-black aspect-[4/3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={d.img} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute left-4 right-4 bottom-4 font-mono text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-white/90">
                  {d.tag}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
