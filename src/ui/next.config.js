/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:6600/api/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'ws://localhost:7681/ws/:path*',
      },
    ];
  },
};

module.exports = nextConfig;