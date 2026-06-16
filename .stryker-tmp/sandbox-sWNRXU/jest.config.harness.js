// @ts-nocheck
// Versión .harness del harness original (NO compatible con Next.js 16)
// Usa ts-jest en vez de next/jest — mantener solo como referencia histórica.
// La versión activa está en jest.config.js.
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEach: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      jsx: 'react-jsx',
    }],
  },
  testMatch: ['<rootDir>/tests/**/*.test.(ts|tsx)'],
};
