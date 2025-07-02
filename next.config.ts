import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  images: {
    domains: ['placehold.co', 'static.vecteezy.com'],
  },
};

export default nextConfig;
