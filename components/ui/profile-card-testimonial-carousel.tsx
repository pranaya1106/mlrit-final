'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Twitter, Youtube, Github, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Testimonial {
  name: string;
  title: string;
  description: string;
  /** Cloudinary or external MP4. Will autoplay muted + loop. */
  videoUrl: string;
  /** Optional poster shown until the first frame paints */
  poster?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  githubUrl?: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Gopi Pavani',
    title: 'Aerospace Engineer · Safran',
    description:
      'MLRIT gave me the tools and confidence to walk into Safran from day one. The aero labs, the mentorship and the projects we ran together — it all compounded into a career I am proud of.',
    videoUrl: '/videos/av3.mp4',
    linkedinUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Ishant',
    title: 'Software Development Engineer · Amazon',
    description:
      'Late-night DSA sessions in the CSE block paid off in the most unexpected way — I was solving Amazon interview problems with the same group of friends I built my projects with. That community made the difference.',
    videoUrl: '/videos/av1.mp4',
    linkedinUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Snigdha Reddy',
    title: 'Analyst · DBS Bank',
    description:
      'The placement cell at MLRIT did not just prepare us for interviews — they shaped how we think about careers. DBS happened because the institute insists you learn finance, communication and tech in the same week.',
    videoUrl: '/videos/av2.mp4',
    linkedinUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Sravya Lingisetty',
    title: 'Software Engineer · Infosys',
    description:
      'I joined MLRIT not knowing what I wanted. I left with a job at Infosys, a thesis on cloud automation, and three internships under my belt. The faculty backed me at every step.',
    videoUrl: '/videos/inno.mp4',
    linkedinUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    githubUrl: '#',
  },
  {
    name: 'Aishwarya',
    title: 'Associate Consultant · Cognizant',
    description:
      'From hackathons in the second year to a consulting role on day one — MLRIT made every classroom feel like the start of a real project. Cognizant noticed, and so did the world.',
    videoUrl: '/videos/sports.mp4',
    linkedinUrl: '#',
    twitterUrl: '#',
    youtubeUrl: '#',
    githubUrl: '#',
  },
];

export interface TestimonialCarouselProps {
  className?: string;
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ className, testimonials = DEFAULT_TESTIMONIALS }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const desktopVid = useRef<HTMLVideoElement | null>(null);
  const mobileVid  = useRef<HTMLVideoElement | null>(null);

  const current = testimonials[currentIndex];

  // Whenever the slide changes, force the videos to reload and play
  useEffect(() => {
    [desktopVid.current, mobileVid.current].forEach((v) => {
      if (!v) return;
      v.muted = muted;
      v.load();
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    });
  }, [currentIndex, muted]);

  const handleNext = () => setCurrentIndex((i) => (i + 1) % testimonials.length);
  const handlePrev = () => setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  const socialIcons = [
    { Icon: Linkedin, url: current.linkedinUrl, label: 'LinkedIn' },
    { Icon: Twitter,  url: current.twitterUrl,  label: 'Twitter'  },
    { Icon: Youtube,  url: current.youtubeUrl,  label: 'YouTube'  },
    { Icon: Github,   url: current.githubUrl,   label: 'GitHub'   },
  ];

  return (
    <div className={cn('w-full max-w-5xl mx-auto px-4', className)}>
      {/* DESKTOP */}
      <div className="hidden md:flex relative items-center">
        {/* Video pane */}
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 relative">
          <AnimatePresence mode="wait">
            <motion.video
              key={current.videoUrl}
              ref={desktopVid}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              poster={current.poster}
              autoPlay
              muted={muted}
              loop
              playsInline
              preload="auto"
            >
              <source src={current.videoUrl} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          {/* Subtle bottom gradient for legibility */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/45 backdrop-blur text-white grid place-items-center hover:bg-black/70 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-card rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.18)] p-8 ml-[-80px] z-10 max-w-xl flex-1 border border-neutral-200/60">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6">
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white mb-2">
                  {current.name}
                </h2>
                <p className="font-mono text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-neutral-500">
                  {current.title}
                </p>
              </div>
              <p className="text-neutral-700 dark:text-white/85 leading-relaxed text-[1.02rem] mb-8">
                {current.description}
              </p>
              <div className="flex space-x-3">
                {socialIcons.map(({ Icon, url, label }) => (
                  <Link
                    key={label}
                    href={url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-all hover:scale-105"
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 text-white dark:text-neutral-900" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden max-w-sm mx-auto text-center">
        <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-3xl overflow-hidden mb-6 relative">
          <AnimatePresence mode="wait">
            <motion.video
              key={current.videoUrl + '_m'}
              ref={mobileVid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              poster={current.poster}
              autoPlay
              muted={muted}
              loop
              playsInline
              preload="auto"
            >
              <source src={current.videoUrl} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? 'Unmute' : 'Mute'}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/45 backdrop-blur text-white grid place-items-center"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <div className="px-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name + '_m'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="font-sans text-xl font-extrabold text-neutral-900 dark:text-white mb-1">
                {current.name}
              </h2>
              <p className="font-mono text-[0.7rem] tracking-[0.16em] uppercase text-neutral-500 mb-3">
                {current.title}
              </p>
              <p className="text-neutral-700 dark:text-white/85 text-sm leading-relaxed mb-6">
                {current.description}
              </p>
              <div className="flex justify-center gap-3">
                {socialIcons.map(({ Icon, url, label }) => (
                  <Link
                    key={label}
                    href={url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center"
                    aria-label={label}
                  >
                    <Icon className="w-4 h-4 text-white dark:text-neutral-900" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-6 mt-10">
        <button
          onClick={handlePrev}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-white dark:bg-card border border-neutral-300 dark:border-white/15 shadow-md flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                'h-2 rounded-full transition-all',
                i === currentIndex ? 'w-7 bg-neutral-900 dark:bg-white' : 'w-2 bg-neutral-400 dark:bg-white/40 hover:bg-neutral-600'
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleNext}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-white dark:bg-card border border-neutral-300 dark:border-white/15 shadow-md flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
