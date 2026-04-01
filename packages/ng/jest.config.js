module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/+(*.)+(spec|test).+(ts)'],
  moduleNameMapper: {
    '@angular/core/testing':
      '<rootDir>/../../node_modules/@angular/core/fesm2022/testing.mjs',
    '@angular/platform-browser-dynamic/testing':
      '<rootDir>/../../node_modules/@angular/platform-browser-dynamic/fesm2022/testing.mjs',
    '@mezzanine-ui/icons$': '<rootDir>/../icons/src',
    '@mezzanine-ui/system/([a-zA-Z-_/]*)$': '<rootDir>/../system/src/$1',
    '@mezzanine-ui/core/([a-zA-Z-_/]*)$': '<rootDir>/../core/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  collectCoverageFrom: [
    'icon/**/*.ts',
    'src/**/*.ts',
    '!**/index.ts',
    '!**/*.stories.ts',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
};
