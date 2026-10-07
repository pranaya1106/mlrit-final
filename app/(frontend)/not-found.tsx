import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="font-mono text-[0.72rem] tracking-[0.18em] uppercase text-muted mb-4">
          404
        </div>
        <h1 className="font-serif font-bold text-foreground text-3xl mb-4">
          Page not found
        </h1>
        <p className="text-muted text-[0.95rem] mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex px-5 py-2.5 rounded-full bg-primary text-white text-[0.85rem] font-semibold hover:bg-primary/90 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
