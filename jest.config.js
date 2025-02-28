const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Forneça o caminho para o seu aplicativo Next.js
  dir: './',
});

// Qualquer configuração personalizada que você queira passar para o Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Mapeie os aliases do seu projeto aqui
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!next/dist/server/)',
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração Next.js
module.exports = createJestConfig(customJestConfig);
