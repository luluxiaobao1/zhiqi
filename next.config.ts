import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/zhiqi' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/zhiqi/' : '',
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lf-coze-web-cdn.coze.cn',
        pathname: '/**',
      },
    ],
  },
  // async redirects() {
  //   return [
  //     {
  //       source: '/enterprise',
  //       destination: '/zhiqi/console',
  //       permanent: true, // 308 永久重定向
  //     },
  //     {
  //       source: '/enterprise/admin',
  //       destination: '/zhiqi/admin',
  //       permanent: true,
  //     },
  //   ];
  // },
};

export default nextConfig;
