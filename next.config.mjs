import fs from 'fs';
import path from 'path';
import https from 'https';
const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'default-host.com';
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.seeklogo.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
    ],
  },
  assetPrefix: `http://${hostname}:3000`,
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  basePath: '',
  // output: 'export',
};

export default nextConfig;
