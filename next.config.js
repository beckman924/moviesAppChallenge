/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["image.tmdb.org"],
  },
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
    API_URL: process.env.API_URL,
  },
};

module.exports = nextConfig;
