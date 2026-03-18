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
 * copy README.md/package.json/COMPONENTS.md/llms.txt
 */
['README.md', 'package.json', 'COMPONENTS.md', 'llms.txt'].forEach((file) => {
  const filePath = path.resolve(packagePath, file);
  const distPath = path.resolve(packageDistPath, file);

  if (fse.existsSync(filePath)) {
    fse.copyFileSync(filePath, distPath);
  }
});
