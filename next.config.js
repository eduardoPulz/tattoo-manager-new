/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  // Otimizações para melhorar a performance
  poweredByHeader: false,
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
  // Configuração de imagens para otimização
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;
