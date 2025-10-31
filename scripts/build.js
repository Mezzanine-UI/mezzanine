const path = require('path');
const fse = require('fs-extra');
const { glob } = require('glob');
const { rollup } = require('rollup');
const ts = require('@rollup/plugin-typescript');

/**
 * Rollup plugin to preserve 'use client' directives
 */
function preserveDirectives() {
  return {
    name: 'preserve-directives',
    renderChunk(code, chunk) {
      // 檢查原始文件是否有 'use client'
      const modulePath = chunk.facadeModuleId;
      if (!modulePath) return null;

      try {
        const originalCode = fse.readFileSync(modulePath, 'utf-8');
        const hasUseClient = /^['"]use client['"];?\s*/m.test(originalCode);
        const hasUseServer = /^['"]use server['"];?\s*/m.test(originalCode);

        if (hasUseClient) {
          return {
            code: `'use client';\n${code}`,
            map: null,
          };
        }

        if (hasUseServer) {
          return {
            code: `'use server';\n${code}`,
            map: null,
          };
        }
      } catch {
        // 如果讀取文件失敗，繼續處理
      }

      return null;
    },
  };
}

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
  'luxon',
  'events',
];

async function getFilesByGlob(globPath) {
  return await glob(globPath);
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
    const dist = path.resolve(
      packageDistPath,
      path.relative(packageSrcPath, file),
    );
    const distDir = dist.split('/').slice(0, -1).join('/');

    if (!fse.existsSync(distDir)) {
      fse.mkdirSync(distDir, { recursive: true });
    }

    fse.copyFileSync(file, dist);
  });

  /**
   * copy font files (otf, ttf, woff, woff2)
   */
  const fontFiles = await getFilesByGlob(
    `${packageSrcPath}/**/*.{otf,ttf,woff,woff2}`,
  );

  fontFiles.forEach((file) => {
    const dist = path.resolve(
      packageDistPath,
      path.relative(packageSrcPath, file),
    );
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
        cacheDir: tsPluginCachePath,
        tsconfig: tsconfigPath,
      }),
      preserveDirectives(),
    ],
    treeshake: {
      moduleSideEffects: false,
    },
  });

  /**
   * copy dist to node_modules
   */
  const nodeModulesPackagePath = path.resolve(
    nodeModulesPath,
    ...packageJson.name.split('/'),
  );

  // Remove existing file/symlink before copying
  if (fse.existsSync(nodeModulesPackagePath)) {
    fse.removeSync(nodeModulesPackagePath);
  }

  fse.copySync(packageDistPath, nodeModulesPackagePath);
}

run();
