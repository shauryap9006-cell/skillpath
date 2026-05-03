import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf2json'],

  // Turbopack configuration for Next.js 16
  experimental: {
    turbo: {
      // Empty or defaults — removing pdfjs-dist specific aliases
      resolveAlias: {},
    },
  },
};

export default nextConfig;
