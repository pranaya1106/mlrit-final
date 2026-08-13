'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Banner = {
  id: string;
  title: string;
  asset_key: string;
  link_url: string | null;
};

/**
 * Renders the currently live banners.
 *
 * NOTE: not mounted on any page yet — built in isolation for review before a
 * placement is chosen.
 *
 * Only reads GET /api/banners, which queries with the anon client, so the
 * banners_public_read policy has already filtered out drafts, not-yet-started
 * and expired rows. No client-side date filtering is needed or wanted; doing it
 * here would imply the API can be trusted to over-return, which it cannot.
 *
 * Images are served through /cdn/<key> rather than the Supabase URL directly,
 * so they come from this origin under the long immutable cache the proxy sets.
 * Plain <img> rather than next/image because the intrinsic dimensions are not
 * known here — assets.width/height exist for that but are not populated yet.
 */
export default function Banners() {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/banners')
      .then((response) => (response.ok ? response.json() : []))
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setBanners(data);
      })
      .catch(() => {
        // A failed banner fetch is not worth surfacing to a visitor — the
        // section simply stays empty.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (banners.length === 0) return null;

  return (
    <section className="w-full">
      {banners.map((banner) => {
        const image = (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/cdn/${banner.asset_key}`}
            alt={banner.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        );

        return (
          <div key={banner.id} className="w-full">
            {banner.link_url ? (
              <Link href={banner.link_url} aria-label={banner.title}>
                {image}
              </Link>
            ) : (
              image
            )}
          </div>
        );
      })}
    </section>
  );
}
