'use client';
import Reveal from '@/components/motion/Reveal';

export default function WhyMLRIT() {
  return (
    <section className="relative bg-neutral-900 text-white py-10 md:py-14 overflow-hidden">
      <div className="w-full px-6 md:px-10 lg:px-12 grid md:grid-cols-2 gap-10 items-center">
        <Reveal preset="right">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-white/55 font-sans font-bold text-[0.66rem] tracking-[0.22em] uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Why MLRIT
          </span>
          <h2 className="font-sans font-black tracking-tighter-2 leading-[1.04] text-[clamp(2rem,3.6vw,3rem)]">
            <span className="text-primary">&ldquo;</span>
            <span className="font-display italic font-bold text-[1.05em]">I</span>ndustry Integrated
            Curriculum Blended With Sports
            <span className="text-primary">&rdquo;</span>
          </h2>
          <p className="mt-6 text-white/72 font-light leading-relaxed text-[1.04rem] max-w-[560px]">
            MLRIT is the only engineering college in Telangana where athletic performance is built into
            your degree — with national-level coaching, sports scholarships, and dedicated training hours.
            Our students compete at state and national levels across cricket, badminton, athletics, and more,
            backed by professional infrastructure and full institutional support.
          </p>
        </Reveal>
        <Reveal preset="scale" delay={0.2} className="rounded-2xl overflow-hidden aspect-video bg-black/40">
          <video
            src="/videos/sports.mp4"
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            className="w-full h-full object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
