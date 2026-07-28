import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactStrictMode: true,
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  ...(process.env.NODE_ENV === 'production'
    ? {
        generateBuildId: async () => 'venturepilot-v1'
      }
    : {})
};

export default nextConfig;
