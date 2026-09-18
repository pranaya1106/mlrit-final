'use client';

import { resolveAssetUrl } from '@/lib/cdn/url';
import { asGalleryItems, asText } from '@/lib/content/sections';
import { sectionDomId, useMergedSection } from '@/lib/preview/context';
import {
  TestimonialCarousel,
  type Testimonial,
} from '@/components/ui/profile-card-testimonial-carousel';

const DEFAULT_EYEBROW = 'Alumni Voices';
const DEFAULT_HEADING_LEAD = 'What Our';
const DEFAULT_HEADING_ACCENT = 'Graduates Say.';
const DEFAULT_BODY = 'Five MLRIT alumni — five different paths, one shared starting line.';

type TestimonialsProps = {
  eyebrow?: string;
  headingLead?: string;
  headingAccent?: string;
  body?: string;
  /** Gallery items from the CMS; falls back to the carousel's bundled set. */
  people?: unknown;
};

/**
 * Maps gallery items onto the carousel's Testimonial shape. The item's primary
 * key is the clip itself, so `accept: 'video'` on the field.
 *
 * Returns undefined — not an empty array — when nothing is saved, so the
 * carousel keeps its own DEFAULT_TESTIMONIALS rather than rendering an empty
 * track. That is the same fallback contract every other section uses.
 */
function peopleFrom(value: unknown): Testimonial[] | undefined {
  const items = asGalleryItems(value);
  if (items.length === 0) return undefined;

  const mapped = items
    .map((item) => ({
      name: asText(item.name),
      title: asText(item.title),
      description: asText(item.description),
      videoUrl: resolveAssetUrl(item.key, { allowTransient: true }) ?? '',
    }))
    .filter((person) => person.videoUrl);

  return mapped.length > 0 ? mapped : undefined;
}

export default function Testimonials(props: TestimonialsProps) {
  // Live-preview draft wins over the saved props; fallbacks below are unchanged.
  const { eyebrow, headingLead, headingAccent, body, people } = useMergedSection(
    'home/testimonials',
    props
  );

  const eyebrowText = eyebrow?.trim() || DEFAULT_EYEBROW;
  const headingLeadText = headingLead?.trim() || DEFAULT_HEADING_LEAD;
  const headingAccentText = headingAccent?.trim() || DEFAULT_HEADING_ACCENT;
  const bodyText = body?.trim() || DEFAULT_BODY;
  const testimonials = peopleFrom(people);

  return (
    <div id={sectionDomId('home/testimonials')}>
    <section id="testimonials" className="bg-paper-2 grain-texture text-foreground py-12 md:py-16 relative overflow-hidden">
      {/* Same decorative background artwork as Hero / WhyMLRIT / Programs. */}
      <img
        src="/vectors/whymlrit-background.svg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-[0] opacity-60"
      />
      {/* Soft brand glows — muted for the light canvas */}
      <div className="absolute -top-40 -left-40 w-[460px] h-[460px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none z-[0]" />
      <div className="absolute -bottom-40 -right-40 w-[460px] h-[460px] rounded-full bg-secondary/[0.08] blur-[120px] pointer-events-none z-[0]" />

      <div className="relative z-[1] w-full px-6 md:px-10 lg:px-12">
        <div className="text-center max-w-[680px] mx-auto mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-border text-primary font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            {eyebrowText}
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.6rem)]">
            {headingLeadText}{' '}
            <span className="font-display italic font-medium text-primary">{headingAccentText}</span>
          </h2>
          <p className="mt-4 text-foreground/65">{bodyText}</p>
        </div>

        {/* Undefined leaves the carousel on its own bundled alumni. */}
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
    </div>
  );
}
