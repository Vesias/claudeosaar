/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: 'dist/ui',
  // Add redirects or rewrites as needed
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:6600/api/:path*',
      },
    ];
  },
  webpack: (config) => {
    config.resolve.preferRelative = true
    return config
  }
}

module.exports = nextConfig;