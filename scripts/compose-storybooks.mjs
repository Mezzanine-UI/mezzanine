#!/usr/bin/env node
/**
 * Compose React + Angular + Hub Storybook static outputs into a single
 * directory tree for deployment:
 *
 *   storybook-composed/
 *   ├── index.html                Hub (root)
 *   ├── sb-addons/ sb-manager/ …  Hub assets
 *   ├── react/                    React Storybook (full static output)
 *   └── angular/                  Angular Storybook (full static output)
 *
 * The Hub's `refs` point at `./react` and `./angular`, same-origin so no
 * CORS plumbing is needed.
 *
 * Expected pre-conditions (this script does NOT run the builds itself):
 *   - yarn react:build            → storybook-static/
 *   - yarn ng:build-storybook     → storybook-ng-static/
 *   - yarn hub:build-storybook    → storybook-hub-static/
 */

import { cpSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(import.meta.url), '..', '..');

const sources = {
  hub: resolve(repoRoot, 'storybook-hub-static'),
  react: resolve(repoRoot, 'storybook-static'),
  angular: resolve(repoRoot, 'storybook-ng-static'),
};

const dest = resolve(repoRoot, 'storybook-composed');

for (const [name, path] of Object.entries(sources)) {
  if (!existsSync(path)) {
    console.error(
      `[compose-storybooks] Missing source "${name}" at ${path}. ` +
        `Run the corresponding build first (react:build / ng:build-storybook / hub:build-storybook).`,
    );
    process.exit(1);
  }
}

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}

// 1. Hub at the root
cpSync(sources.hub, dest, { recursive: true });

// 2. React at /react
cpSync(sources.react, resolve(dest, 'react'), { recursive: true });

// 3. Angular at /angular
cpSync(sources.angular, resolve(dest, 'angular'), { recursive: true });

console.log(`[compose-storybooks] Composed into ${dest}`);
console.log('  /          → Hub');
console.log('  /react/    → React');
console.log('  /angular/  → Angular');
