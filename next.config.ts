import type { NextConfig } from "next";

// Conditionally import bundle analyzer only when ANALYZE environment variable is set
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({
      enabled: true,
      openAnalyzer: true,
    })
  : (config: NextConfig) => config;

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
        // Improved code splitting configuration
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Framework chunks (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI libraries chunk
            ui: {
              name: 'ui-lib',
              test: /[\\/]node_modules[\\/](@codemirror|react-markdown|remark-|rehype-)[\\/]/,
              priority: 30,
              enforce: true,
            },
            // Math and diagram libraries
            math: {
              name: 'math-lib', 
              test: /[\\/]node_modules[\\/](katex|mermaid|prismjs)[\\/]/,
              priority: 25,
              enforce: true,
            },
            // Default vendor chunk for other libraries
            vendor: {
              name: 'vendor',
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common chunks for shared code
            common: {
              name: 'common',
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    // Optimise moment.js if used
    config.resolve.alias = {
      ...config.resolve.alias,
      moment$: 'moment/moment.js',
    };

    // Enable webpack bundle analysis in development
    if (process.env.ANALYZE === 'true') {
      console.log('🔍 Bundle analysis enabled - detailed webpack stats will be generated');
    }

    return config;
  },

  // Compression and output optimisations
  compress: true,
  poweredByHeader: false,
  
  // Bundle analysis configuration
  env: {
    ANALYZE: process.env.ANALYZE || 'false',
  },
};

// Apply bundle analyzer wrapper if enabled
export default withBundleAnalyzer(nextConfig);
