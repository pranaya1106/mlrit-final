// Chatbot backend origin the browser needs to `fetch()` — derived from env vars so
// CSP tracks whatever backend is actually configured, in both dev and prod,
// instead of silently blocking the request. Falls back to the local-dev default
// URL (matching components/Chatbot.tsx's own fallback).
function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const CONNECT_SRC_EXTRA = Array.from(
  new Set(
    [
      originOf(process.env.NEXT_PUBLIC_CHATBOT_URL || 'http://127.0.0.1:8001'),
      'http://127.0.0.1:8001',
    ].filter(Boolean)
  )
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'mlrit.ac.in' },
      { protocol: 'https', hostname: 'files.mlrit.ac.in' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'mlrit-next.vercel.app' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Block clickjacking via iframes
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Force HTTPS for 1 year (enable once TLS is confirmed in prod)
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Control referrer info sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Restrict browser features not needed by the app
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
          // Content Security Policy — tightened for this static/SSG site
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js inline scripts + Framer Motion require unsafe-inline; nonce approach is preferred long-term
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Images: self + all whitelisted image hosts
              "img-src 'self' data: blob: https://mlrit.ac.in https://files.mlrit.ac.in https://res.cloudinary.com https://i.ibb.co https://mlrit-next.vercel.app",
              // News API + Supabase (auth + content reads) + chatbot backend + self
              `connect-src 'self' https://mlrit.ac.in https://lkfrcvxdpfpgosogvvvg.supabase.co ${CONNECT_SRC_EXTRA.join(' ')}`,
              // Google Street View / Maps panorama embeds (Virtual Tour) + Instagram Reels
              // Video/audio: bundled files, /cdn proxy (both 'self'), plus blob:
              // for the admin live preview showing a not-yet-uploaded file.
              "media-src 'self' blob: data:",
              "frame-src 'self' https://www.google.com https://www.instagram.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // Expose the archived static site at /legacy/* for reference
  async rewrites() {
    return [
      { source: '/legacy/:path*', destination: '/legacy/:path*' },
    ];
  },
  async redirects() {
    return [
      { source: '/about/vision-mission/introduction', destination: '/about', permanent: true },
      { source: '/campus/events', destination: '/campus/clubs', permanent: true },
    ];
  },
};

module.exports = nextConfig;
