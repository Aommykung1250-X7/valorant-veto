/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.vicinitihosting.com',
      },
    ],
  },
};

module.exports = nextConfig;
