module.exports = {
  transform: {
    '\\.t(s|sx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*', '!**/index.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
