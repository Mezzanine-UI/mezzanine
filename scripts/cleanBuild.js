const path = require('path');
const { execSync } = require('child_process');

const { PWD, npm_package_name: npmPackageName } = process.env;
const packagePath = PWD;
const packageInNodeModulesPath = path.resolve(packagePath, '..', '..', 'node_modules', npmPackageName);

execSync(`rm -rf ${packagePath}/{dist,prebuilts,*.tsbuildinfo} ${packageInNodeModulesPath}`);
