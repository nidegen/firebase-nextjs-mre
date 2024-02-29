const { i18n } = require('./next-i18next.config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'echo-photos-dev.web.app',
        port: '',
        pathname: '/api/v1/**',
      },
    ],
  },
  reactStrictMode: true,
  i18n,
};

module.exports = nextConfig;
