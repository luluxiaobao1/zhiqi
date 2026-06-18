import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  output: 'export',
  basePath: '/zhiqi',
  trailingSlash: true,
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
  //   // Note: redirects does not work with "output: export"
  //   // Redirects are handled in server.ts instead
  //   return [];
  // },
};

export default nextConfig;
