#!/usr/bin/env node
/**
 * Compose React + Angular + Hub Storybook static outputs into a single
 * directory tree for deployment. The final layout is:
 *
 *   storybook-static/
 *   ├── index.html                Hub (root)
 *   ├── sb-addons/ sb-manager/ …  Hub assets
 *   ├── react/                    React Storybook (full static output)
 *   └── angular/                  Angular Storybook (full static output)
 *
 * The Hub's `refs` point at `./react` and `./angular`, same-origin so no
 * CORS plumbing is needed.
 *
 * The final dir name is `storybook-static` rather than
 * `storybook-composed` so the existing Cloudflare Pages project
 * (`storybook.mezzanine-ui.org`, build command `yarn storybook build`,
 * output dir `storybook-static`) keeps working without any dashboard
 * changes. See also `scripts/storybook-dispatch.mjs`.
 *
 * Expected pre-conditions (this script does NOT run the builds itself):
 *   - yarn react:build            → storybook-static/      (will be moved)
 *   - yarn ng:build-storybook     → storybook-ng-static/
 *   - yarn hub:build-storybook    → storybook-hub-static/
 */

import { cpSync, existsSync, renameSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(import.meta.url), '..', '..');

const sources = {
  hub: resolve(repoRoot, 'storybook-hub-static'),
  react: resolve(repoRoot, 'storybook-static'),
  angular: resolve(repoRoot, 'storybook-ng-static'),
};

const finalDest = resolve(repoRoot, 'storybook-static');
const reactStaging = resolve(repoRoot, 'storybook-static-react-tmp');

for (const [name, path] of Object.entries(sources)) {
  if (!existsSync(path)) {
    console.error(
      `[compose-storybooks] Missing source "${name}" at ${path}. ` +
        `Run the corresponding build first (react:build / ng:build-storybook / hub:build-storybook).`,
    );
    process.exit(1);
  }
}

// Step 1 — move React's own output out of the way. We want to reuse the
// name `storybook-static/` for the final composed tree, so shuffle the
// React bundle into a staging slot first.
if (existsSync(reactStaging)) {
  rmSync(reactStaging, { recursive: true, force: true });
}
renameSync(sources.react, reactStaging);

// Step 2 — create fresh final destination (React was just moved, so it
// no longer exists at this path).
if (existsSync(finalDest)) {
  rmSync(finalDest, { recursive: true, force: true });
}

// Step 3 — Hub at the root
cpSync(sources.hub, finalDest, { recursive: true });

// Step 4 — React at /react (move the staged bundle in)
renameSync(reactStaging, resolve(finalDest, 'react'));

// Step 5 — Angular at /angular
cpSync(sources.angular, resolve(finalDest, 'angular'), { recursive: true });

console.log(`[compose-storybooks] Composed into ${finalDest}`);
console.log('  /          → Hub');
console.log('  /react/    → React');
console.log('  /angular/  → Angular');
