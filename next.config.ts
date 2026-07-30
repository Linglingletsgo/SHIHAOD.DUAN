import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      {
        source: '/pdfs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/pdfs/undergraduate-thesis-embodied-carbon.pdf',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, noarchive',
          },
        ],
      },
      {
        source: '/pdfs/undergraduate-thesis-embodied-carbon-en.pdf',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, noarchive',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
