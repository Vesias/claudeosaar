/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist/ui',
  // Next.js 15 configuration
  experimental: {},
  // Add redirects or rewrites as needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:6600/api/:path*',
      },
    ];
  }
}

module.exports = nextConfig;
