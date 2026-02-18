/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },
  // Exclude large static assets from serverless function tracing (fixes 250MB limit)
  experimental: {
    outputFileTracingExcludes: {
      '/api/character-image/[slug]': ['public/images/characters/**'],
    },
  },
}

module.exports = nextConfig
