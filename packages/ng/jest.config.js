module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setupJest.ts'],
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
    '@mezzanine-ui/system/([a-zA-Z-_/]*)$': '<rootDir>/../system/src/$1',
    '@mezzanine-ui/core/([a-zA-Z-_/]*)$': '<rootDir>/../core/src/$1',
    '@mezzanine-ui/ng/([a-zA-Z-_/]*)$': '<rootDir>/$1',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*', '!**/index.ts', '!src/**/*stories*'],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
