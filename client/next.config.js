/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_ENDPOINT: process.env.API_ENDPOINT,
    PROD: process.env.PROD,
    STATIC_FILES: process.env.STATIC_FILES
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    return config;
  },
  images: {
    domains: ['gateway.pinata.cloud', 'localhost', 'api-nft-marketplace.bc.hamsa.site'],
  },
};

module.exports = nextConfig;
