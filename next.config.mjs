import fs from 'fs';
import path from 'path';
import https from 'https';
const hostname = process.env.NEXT_PUBLIC_HOSTNAME || 'default-host.com';
const nextConfig = {
  images: {
    domains: ['images.seeklogo.com', 'source.unsplash.com'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  assetPrefix: `http://${hostname}:3000`,
  reactStrictMode: true,
  output: "export",
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `/:path*`,
      },
      {
        source: "/admin/:path*",
        destination: `/admin/:path*`,
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        has: [
          {
            type: 'host',
            value: `admin.${hostname}:3000`,
          },
        ],
        destination: `http://admin.${hostname}:3000/:path*`,
        permanent: false,
      }
    ];
  },
  basePath: '',
  // output: 'export',
};

export default nextConfig;
