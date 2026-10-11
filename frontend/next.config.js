/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/intake',
        destination: '/lab',
        permanent: true,
      },
      {
        source: '/compare',
        destination: '/benchmarks#models',
        permanent: true,
      },
      {
        source: '/noise',
        destination: '/benchmarks#noise',
        permanent: true,
      },
      {
        source: '/training',
        destination: '/benchmarks#training',
        permanent: true,
      },
      {
        source: '/ethics',
        destination: '/about#governance',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
