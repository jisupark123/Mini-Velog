const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/_variables.scss"; @import "styles/_mixins.scss";`,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  // env: {
  //   BASE_URL: process.env.BASE_URL,
  // },
  async redirects() {
    return [
      {
        source: '/users/:id',
        destination: '/users/:id/dashboard',
        permanent: true,
      },
    ];
  },
  images: {
    domains: ['imagedelivery.net'],
  },
};

module.exports = nextConfig;
