'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type VideoLightboxProps = {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title?: string;
  eyebrow?: string;
  description?: string;
};

/**
 * Full-screen video modal — mastersunion.org-style. Click a trigger →
 * dark overlay fades in, video plays centered with rounded corners, and
 * the eyebrow / title / description sit beneath it. ESC and backdrop
 * click both close. Body scroll locks while open.
 */
export default function VideoLightbox({
  open,
  onClose,
  src,
  poster,
  title,
  eyebrow,
  description,
}: VideoLightboxProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Autoplay the video whenever we open the lightbox.
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      v.play().catch(() => {});
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      v?.pause();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[3000] bg-ink/95 backdrop-blur-md flex items-center justify-center px-4 md:px-10 py-16 md:py-20 overflow-y-auto"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title || 'Video preview'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[1200px] mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="absolute -top-14 md:-top-16 right-0 inline-flex items-center gap-2 h-11 pl-4 pr-4 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white/90 hover:text-white hover:bg-white/20 transition-all text-[0.82rem] font-medium tracking-[-0.005em] z-[2]"
            >
              Close <X className="w-4 h-4" />
            </button>

            {/* Video card */}
            <div className="relative aspect-video w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-black shadow-[0_60px_140px_-30px_rgba(0,0,0,0.7),0_20px_60px_-20px_rgba(232,93,4,0.18)]">
              <video
                ref={videoRef}
                src={src}
                poster={poster}
                controls
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* Text below the video */}
            {(eyebrow || title || description) && (
              <div className="mt-8 md:mt-10 max-w-[820px]">
                {eyebrow && (
                  <div className="editorial-eyebrow !text-white/60 !text-[0.68rem]">
                    {eyebrow}
                  </div>
                )}
                {title && (
                  <h3 className="mt-3 font-display italic font-medium text-white leading-[1.12] tracking-[-0.02em] text-[clamp(1.6rem,3vw,2.4rem)]">
                    {title}
                  </h3>
                )}
                {description && (
                  <p className="mt-4 text-white/72 font-light leading-[1.7] text-[1rem] md:text-[1.05rem] max-w-[640px]">
                    {description}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
