import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/zhiqi',
  // trailingSlash removed to prevent redirect loops on GitHub Pages
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
};

export default nextConfig;
