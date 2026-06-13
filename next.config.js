/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/zhiqi',
  assetPrefix: '/zhiqi/',
  trailingSlash: true,
  images: { unoptimized: true }
};
module.exports = nextConfig;
