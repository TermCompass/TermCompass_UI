// next.config.mjs
const hostname = process.env.NEXT_PUBLIC_HOSTNAME;
const nextConfig = {
  images: {
    domains: [`https://${hostname}`],
    path: `https://${hostname}`,
  },
  output: "export",
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // next.config.mjs

  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      // `minimizer`가 정의되지 않으면 빈 배열로 초기화
      if (!config.optimization.minimizer) {
        config.optimization.minimizer = [];
      }
      // 첫 번째 minimizer가 있다면, 기존의 terserOptions 수정
      const terserOptions = config.optimization.minimizer[0].options || {};
      terserOptions.compress = {
        ...terserOptions.compress,
        keep_classnames: true,  // 클래스 이름 유지
        keep_fnames: true,      // 함수 이름 유지
      };
      config.optimization.minimizer[0].options = terserOptions;
    }
    return config;
  }
};

export default nextConfig;
