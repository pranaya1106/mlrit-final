'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-muted mb-4">
          Something went wrong
        </div>
        <h1 className="font-serif font-bold text-foreground text-3xl mb-4">
          An error occurred
        </h1>
        <p className="text-muted text-[0.95rem] mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or return to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-full bg-primary text-white text-[0.85rem] font-semibold hover:bg-primary/90 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-border text-foreground text-[0.85rem] font-medium hover:bg-cream-2 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
