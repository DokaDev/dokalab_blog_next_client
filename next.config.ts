import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // 타입 오류가 있어도 빌드가 진행됩니다!
    // 실제 운영 환경에서는 비활성화하는 것이 좋습니다.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint 오류가 있어도 빌드가 진행됩니다
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['placehold.co', 'static.vecteezy.com'],
  },
};

export default nextConfig;
