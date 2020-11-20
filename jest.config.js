module.exports = {
  transform: {
    '\\.t(s|sx)$': 'ts-jest',
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['packages/*/src/**/*', '!**/index.ts', '!**/*fixtures*/**', '!**/*mocks*/**', '!**/*stories*'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
