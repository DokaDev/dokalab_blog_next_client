import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  
  // Build configuration for production
  typescript: {
    // Enforce type checking during build
    // This ensures no type errors slip into production
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enforce ESLint rules during build
    // This maintains code quality and catches potential bugs
    ignoreDuringBuilds: false,
  },
  
  experimental: {
    // Enable experimental features if needed
    turbo: {
      // Turbopack has built-in SASS support, no need for custom rules
    }
  },

  // Performance optimisations
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      }
    ],
  },

  // Bundle optimisations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Production client-side optimisations
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
      };
    }

    // Optimise moment.js if used
    config.resolve.alias = {
      ...config.resolve.alias,
      moment$: 'moment/moment.js',
    };

    return config;
  },

  // Compression and output optimisations
  compress: true,
  poweredByHeader: false,
  
  // Bundle analysis (only in development with ANALYZE=true)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config: any) => {
      const { BundleAnalyzerPlugin } = require('@next/bundle-analyzer')({
        enabled: true
      });
      
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    }
  }),
};

export default nextConfig;
