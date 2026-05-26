import { ChevronRight } from '../icons';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh-132px)] min-h-[640px] overflow-hidden flex flex-col justify-end items-start">
      {/* Background video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/legacy/nirf/nirf-2.jpeg"
      >
        <source src="https://res.cloudinary.com/dhqhhtvym/video/upload/v1777367629/hero1_hq.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
           style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 85%, rgba(0,0,0,0.75) 100%)' }} />

      {/* Content */}
      <div className="relative z-[2] w-full max-w-[720px] px-16 pb-[70px]">
        <h1 className="font-sans font-extrabold text-white leading-[0.96] tracking-tighter-2"
            style={{ fontSize: 'clamp(3.4rem, 6.8vw, 6rem)', textShadow: '0 2px 32px rgba(0,0,0,0.35)' }}>
          Engineering
          <span className="block font-display italic font-medium tracking-tight pb-[0.06em] mt-[0.05em]"
                style={{
                  letterSpacing: '-0.015em',
                  backgroundImage: 'linear-gradient(180deg, #fff 0%, var(--primary) 110%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}>
            the Future.
          </span>
        </h1>
        <p className="mt-5 max-w-[480px] text-white/90 leading-[1.55] text-[1.02rem] font-normal"
           style={{ textShadow: '0 1px 8px rgba(0,0,0,0.5)' }}>
          Two decades of shaping minds. 11,000+ engineers and counting. At MLRIT, we don't just teach the future — we build it.
        </p>
        <Link
          href="#programs"
          className="mt-8 inline-flex items-center gap-2.5 h-[50px] pl-3 pr-6 rounded-[10px] bg-primary text-white font-semibold text-[0.95rem] border border-primary transition-all duration-300 ease-out-quart hover:bg-primary-hover hover:shadow-primary-glow hover:-translate-y-0.5"
        >
          <span className="inline-flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20">
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
          Explore Programs
        </Link>
      </div>
    </section>
  );
}
