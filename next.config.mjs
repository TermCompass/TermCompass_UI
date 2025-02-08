/** @type {import('next').NextConfig} */
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
  // swcMinify: true,
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
