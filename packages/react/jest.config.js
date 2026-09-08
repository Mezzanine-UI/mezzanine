module.exports = {
  transform: {
    '\\.t(s|sx)$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  moduleNameMapper: {
    '@mezzanine-ui/icons$': '<rootDir>/../icons/src',
    '@mezzanine-ui/system/([a-zA-Z-_/]*)$': '<rootDir>/../system/src/$1',
    '@mezzanine-ui/core/([a-zA-Z-_/]*)$': '<rootDir>/../core/src/$1',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ['src/**/*', '!**/index.ts', '!src/**/*stories*'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  /**
   * Jest's own default is 5s, and the heaviest suites here sit right on it:
   * DateRangePicker alone runs 29 tests through 43 `await act` round-trips
   * against a moment-backed calendar, and under the parallelism the monorepo
   * runs (`nx.json` parallel 3, each runner spawning its own workers) a 4.5s
   * test becomes a 5.1s one. That produced failures that moved between runs of
   * identical code rather than pointing at any defect.
   *
   * 15s is not a new number: it is what `Upload.spec.tsx` already opts into
   * per-test. Only failing tests ever wait it out.
   */
  testTimeout: 15000,
};
