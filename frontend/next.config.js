/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  // Required for static export with dynamic routes
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
