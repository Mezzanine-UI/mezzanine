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
  moduleNameMapper: {
    '@mezzanine-ui/icons$': '<rootDir>/../icons/src',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*', '!**/index.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
