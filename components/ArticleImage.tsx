'use client';

import { useState } from 'react';

/**
 * Chronicles' article images come from whatever publisher the news scraper
 * hits — TOI, The Hindu, Telangana Today, EdexLive, LinkedIn, etc. That list
 * changes with every scrape and some hosts intermittently 404, expire signed
 * URLs, or get blocked outright (e.g. LinkedIn's CDN triggers the browser's
 * ORB check). There's no allowlist that stays correct, so instead of trying
 * to predict every failure mode, this collapses to nothing on error — a
 * missing photo should never show a broken-image icon or blank gap.
 */
export default function ArticleImage({
  src,
  alt,
  className,
  wrapperClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  /** When set, wraps the <img> in a div with this class — and drops that
   * wrapper too on failure, so a dead image doesn't leave a stray margin/gap
   * behind (e.g. the "mb-3" spacer these cards use above the headline). */
  wrapperClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  const img = (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setFailed(true)}
    />
  );

  return wrapperClassName ? <div className={wrapperClassName}>{img}</div> : img;
}
