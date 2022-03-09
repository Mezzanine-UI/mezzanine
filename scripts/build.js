const path = require('path');
const fse = require('fs-extra');
const glob = require('glob');
const { rollup } = require('rollup');
const ts = require('rollup-plugin-typescript2');

const { PWD } = process.env;
const packagePath = PWD;
const packageJson = require(path.resolve(packagePath, 'package.json'));
const tsconfigPath = path.resolve(packagePath, 'tsconfig.build.json');
const packageSrcPath = path.resolve(packagePath, 'src');
const packageDistPath = path.resolve(packagePath, 'dist');
const repoPath = path.resolve(packagePath, '..', '..');
const nodeModulesPath = path.resolve(repoPath, 'node_modules');
const tsPluginCachePath = path.resolve(nodeModulesPath, '.cache', 'rts2');

const externals = [
  ...Object.keys({
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  }),
  'lodash',
  'moment',
  'dayjs',
  'events',
];

function getFilesByGlob(globPath) {
  return new Promise((resolve, reject) => {
    glob(globPath, (error, files) => {
      if (error) {
        reject(error);
      }

      resolve(files);
    });
  });
}

async function rollupBuild({ output, ...options }) {
  const bundle = await rollup(options);

  if (Array.isArray(output)) {
    await Promise.all(output.map((o) => bundle.write(o)));
  } else {
    await bundle.write(output);
  }
}

async function run() {
  require('./prepareBuild');

  /**
   * copy scss files
   */
  const scssFiles = await getFilesByGlob(`${packageSrcPath}/**/*.scss`);

  scssFiles.forEach((file) => {
    const dist = path.resolve(packageDistPath, path.relative(packageSrcPath, file));
    const distDir = dist.split('/').slice(0, -1).join('/');

    if (!fse.existsSync(distDir)) {
      fse.mkdirSync(distDir, { recursive: true });
    }

    fse.copyFileSync(file, dist);
  });

  /**
   * build
   */
  const input = await getFilesByGlob(`${packageSrcPath}/**/index.ts`);

  await rollupBuild({
    input,
    external: (id) => externals.some((ext) => id.startsWith(ext)),
    output: [
      {
        dir: packageDistPath,
        externalLiveBindings: false,
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: packageSrcPath,
      },
    ],
    plugins: [
      ts({
        check: true,
        cacheRoot: tsPluginCachePath,
        tsconfig: tsconfigPath,
      }),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  });

  /**
   * copy dist to node_modules
   */
  fse.copySync(
    packageDistPath,
    path.resolve(nodeModulesPath, ...packageJson.name.split('/')),
  );
}

run();
