module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    '__tests__/**/*.js',
  ],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transform: {},
  transformIgnorePatterns: ['/node_modules/'],
};
