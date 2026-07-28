import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  cleanDistDir: true,
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "./"),
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
