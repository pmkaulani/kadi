/** @type {import('next').NextConfig} */

// Only let the Next.js image optimizer fetch from explicitly approved hosts.
// Add comma-separated hostnames (not full URLs or wildcard patterns) to KADI_IMAGE_HOSTS.
const configuredImageHosts = (process.env.KADI_IMAGE_HOSTS || '')
  .split(',')
  .map((host) => host.trim().toLowerCase())
  .filter((host) => /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(host) && !host.includes('..'));

const imageHosts = [...new Set(['images.unsplash.com', ...configuredImageHosts])];

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...imageHosts.map((hostname) => ({
        protocol: 'https',
        hostname,
      })),
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3005',
        pathname: '/media/**',
      },
    ],
  },
};

module.exports = nextConfig;
