/** @type {import('next').NextConfig} */
module.exports = {
  env: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.it49.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/contacts',
        permanent: true,
      },
    ];
  },
  // Mejorar Fast Refresh
  reactStrictMode: true,
  // Suprimir warnings de Sass @import deprecado
  sassOptions: {
    silenceDeprecations: ['legacy-js-api', 'import'],
  },
};
