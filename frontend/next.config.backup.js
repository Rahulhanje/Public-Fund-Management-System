/** @type {import('next').NextConfig} */

// Configuration for static export (current)
const staticConfig = {
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

// Configuration for dynamic deployment (recommended for blockchain apps)
const dynamicConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  trailingSlash: true,
  experimental: {
    appDir: true,
  },
  // Better for dynamic content
  poweredByHeader: false,
  reactStrictMode: true,
};

// Choose configuration based on deployment target
const nextConfig = process.env.DEPLOYMENT_TARGET === 'static' ? staticConfig : dynamicConfig;

module.exports = nextConfig;