'use client';
import Reveal from '@/components/motion/Reveal';

/**
 * Fallback copy. Used whenever the CMS lookup in app/page.tsx fails, returns
 * nothing, or returns a row missing any field — the section must always render
 * complete text, never a blank or half-filled heading.
 */
const DEFAULT_HEADING = 'Industry Integrated Curriculum Blended With Sports';
const DEFAULT_VIDEO = '/videos/sports.mp4';
const DEFAULT_BODY =
  'MLRIT is the only engineering college in Telangana where athletic performance is built into your degree — with national-level coaching, sports scholarships, and dedicated training hours. Our students compete at state and national levels across cricket, badminton, athletics, and more, backed by professional infrastructure and full institutional support.';

type WhyMLRITProps = {
  heading?: string;
  body?: string;
  /** Full URL for the background clip; falls back to the bundled file. */
  video?: string;
};

export default function WhyMLRIT({ heading, body, video }: WhyMLRITProps) {
  // The first character carries the display-italic drop-cap treatment, so the
  // heading is split rather than rendered as one node.
  const headingText = heading?.trim() || DEFAULT_HEADING;
  const headingInitial = headingText.slice(0, 1);
  const headingRest = headingText.slice(1);
  const bodyText = body?.trim() || DEFAULT_BODY;
  const videoSrc = video?.trim() || DEFAULT_VIDEO;

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
            <span className="font-display italic font-bold text-[1.05em]">{headingInitial}</span>
            {headingRest}
            <span className="text-primary">&rdquo;</span>
          </h2>
          <p className="mt-6 text-white/72 font-light leading-relaxed text-[1.04rem] max-w-[560px]">
            {bodyText}
          </p>
        </Reveal>
        <Reveal preset="scale" delay={0.2} className="rounded-2xl overflow-hidden aspect-video bg-black/40">
          <video
            src={videoSrc}
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
