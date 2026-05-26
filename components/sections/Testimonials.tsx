import { TestimonialCarousel } from '@/components/ui/profile-card-testimonial-carousel';

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-ink text-white py-20 md:py-28 relative overflow-hidden">
      {/* Soft brand glows */}
      <div className="absolute -top-40 -left-40 w-[460px] h-[460px] rounded-full bg-primary/[0.08] blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[460px] h-[460px] rounded-full bg-secondary/[0.10] blur-[120px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center max-w-[680px] mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-warm font-sans font-extrabold text-[0.66rem] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Alumni Voices
          </span>
          <h2 className="mt-5 font-sans font-black tracking-tighter-2 leading-[1.04] text-white text-[clamp(2.2rem,4vw,3.6rem)]">
            What Our <span className="font-display italic font-medium text-warm">Graduates Say.</span>
          </h2>
          <p className="mt-4 text-white/65">Five MLRIT alumni — five different paths, one shared starting line.</p>
        </div>

        <TestimonialCarousel />
      </div>
    </section>
  );
}
