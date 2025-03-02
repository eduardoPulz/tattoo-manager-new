/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Otimizações para reduzir o uso de memória
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-icons', 'styled-components'],
    cpus: 1, // Limitar a 1 CPU para reduzir o uso de memória
  },
  // Desativar análise de fonte para reduzir uso de memória
  productionBrowserSourceMaps: false,
  // Configurações para reduzir o tamanho do bundle
  webpack: (config, { dev, isServer }) => {
    // Minimizar apenas em produção
    if (!dev && !isServer) {
      config.optimization.minimize = true;
    }
    return config;
  },
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
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
