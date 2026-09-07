import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'autoarenaindia.ddev.site', pathname: '/**' },
    ],
  },
};

export default nextConfig;
