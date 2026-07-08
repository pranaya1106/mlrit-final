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
