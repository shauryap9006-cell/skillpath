import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfjs-dist'],

  // Turbopack config replaces webpack in Next.js 16
  // Note: Using 'as any' if the type definition hasn't caught up to the latest beta/RC
  turbopack: {
    resolveAlias: {
      // Prevents pdfjs-dist from trying to load canvas in serverless
      canvas: { browser: './empty-module.ts' },
    },
  } as any,
};

export default nextConfig;
