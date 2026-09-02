import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { mezzanineAliases, scssLoadPaths } from './vite.alias';

const here = dirname(fileURLToPath(import.meta.url));

const pkg = JSON.parse(
  readFileSync(resolve(here, 'package.json'), 'utf-8'),
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/**
 * Every `<component>/index.ts` is a build entry, plus the package root
 * `index.ts`. Mirrors `scripts/build.js`, which globs `src/**\/index.ts` for
 * the React package — the published shape has to match so that
 * `@mezzanine-ui/vue/button` resolves the same way `@mezzanine-ui/react/Button`
 * does.
 */
function collectEntries(): Record<string, string> {
  const entries: Record<string, string> = { index: resolve(here, 'index.ts') };

  for (const name of readdirSync(here)) {
    if (name.startsWith('.') || name === 'node_modules' || name === 'dist') {
      continue;
    }

    const full = join(here, name);

    if (!statSync(full).isDirectory()) continue;

    try {
      const entry = join(full, 'index.ts');

      statSync(entry);
      entries[`${name}/index`] = entry;
    } catch {
      // directory without a public entry point — internal-only, skip
    }
  }

  return entries;
}

const externalPrefixes = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

export default defineConfig({
  resolve: { alias: mezzanineAliases },
  css: { preprocessorOptions: { scss: { loadPaths: scssLoadPaths } } },
  plugins: [
    vue(),
    dts({
      tsconfigPath: resolve(here, 'tsconfig.lib.json'),
      entryRoot: here,
      outDir: resolve(here, 'dist'),
      // Types are consumed per sub-path entry; a single rolled-up bundle would
      // break `@mezzanine-ui/vue/<component>` type resolution.
      rollupTypes: false,
      insertTypesEntry: false,
    }),
  ],
  build: {
    target: 'es2022',
    minify: false,
    sourcemap: false,
    // `prepareBuild.js` has already created dist and copied LICENSE / README /
    // package.json / COMPONENTS.md into it; emptying here would delete them.
    emptyOutDir: false,
    lib: {
      entry: collectEntries(),
      formats: ['es'],
    },
    rollupOptions: {
      external: (id) => externalPrefixes.some((ext) => id.startsWith(ext)),
      output: {
        preserveModules: true,
        preserveModulesRoot: here,
        entryFileNames: '[name].js',
      },
    },
  },
});
