const path = require('path');
const fse = require('fs-extra');

const { PWD } = process.env;
const packagePath = PWD;
const packageDistPath = path.resolve(packagePath, 'dist');
const repoPath = path.resolve(packagePath, '..', '..');

require('./cleanBuild');

/**
 * prepare dist
 */
fse.mkdirSync(packageDistPath);

/**
 * copy LICENSE
 */
const licenseFilePath = path.resolve(repoPath, 'LICENSE');
const licenseDistPath = path.resolve(packageDistPath, 'LICENSE');

fse.copyFileSync(licenseFilePath, licenseDistPath);

/**
 * copy README.md/package.json
 */
['README.md', 'package.json'].forEach((file) => {
  const readmeFilePath = path.resolve(packagePath, file);
  const readmeDistpath = path.resolve(packageDistPath, file);

  fse.copyFileSync(readmeFilePath, readmeDistpath);
});
