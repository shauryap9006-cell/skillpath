import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent canvas (pdfjs optional dep) from causing build errors in serverless
      config.resolve.alias.canvas = false;
    }
    return config;
  },
};

export default nextConfig;
