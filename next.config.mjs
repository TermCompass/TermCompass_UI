/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.seeklogo.com', 'source.unsplash.com'],
  },
  assetPrefix: 'http://localhost:3000',
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
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
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
            value: 'admin.localhost:3000',
          },
        ],
        destination: 'http://admin.localhost:3000/:path*',
        permanent: false,
      }
    ];
  },
  basePath: '',
};

export default nextConfig;
