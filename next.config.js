/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000/api',
  },
  // Configuração para exportação estática se necessário para o Netlify
  output: process.env.BUILD_STATIC === 'true' ? 'export' : undefined,
}

export default nextConfig;
