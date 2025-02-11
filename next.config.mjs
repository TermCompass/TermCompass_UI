import fs from 'fs';
import path from 'path';
import https from 'https';
const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'default-host.com';
const nextConfig = {
  images: {
    domains: ['images.seeklogo.com', 'source.unsplash.com'],
  },
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
