import { TestimonialCarousel } from '@/components/ui/profile-card-testimonial-carousel';

export default function Testimonials() {
  return (
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
            Alumni Voices
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-foreground text-[clamp(2.2rem,4vw,3.6rem)]">
            What Our <span className="font-display italic font-medium text-primary">Graduates Say.</span>
          </h2>
          <p className="mt-4 text-foreground/65">Five MLRIT alumni — five different paths, one shared starting line.</p>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
