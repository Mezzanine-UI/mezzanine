module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['**/+(*.)+(spec|test).+(ts)'],
  moduleFileExtensions: ['js', 'json', 'mjs', 'ts'],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  /**
   * Angular and zone.js ship ESM-only entry points that jest must transform
   * rather than skip.
   */
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@mezzanine-ui/icons$': '<rootDir>/../icons/src',
    '^@mezzanine-ui/system/(.*)$': '<rootDir>/../system/src/$1',
    '^@mezzanine-ui/core/(.*)$': '<rootDir>/../core/src/$1',
    /**
     * Components import siblings through the published sub-path
     * (`@mezzanine-ui/ng/button`); map those back to the source tree so specs
     * do not need a build first.
     */
    '^@mezzanine-ui/ng/(.*)$': '<rootDir>/$1',
    '\\.(css|scss)$': '<rootDir>/jest.style-stub.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: [
    '**/*.ts',
    '!**/index.ts',
    '!**/public-api.ts',
    '!**/*.stories.ts',
    '!**/dist/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
