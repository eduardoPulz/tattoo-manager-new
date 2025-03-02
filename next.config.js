/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração mínima para produção
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  // Adicionar suporte ao styled-components
  compiler: {
    styledComponents: true,
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
  // Redirecionamento simples
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ];
  }
}

module.exports = nextConfig;
