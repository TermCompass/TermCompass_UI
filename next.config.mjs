import fs from 'fs';
import path from 'path';
import https from 'https';

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
  assetPrefix: 'http://kyj9447.ddns.net:3000',
  reactStrictMode: true,
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
