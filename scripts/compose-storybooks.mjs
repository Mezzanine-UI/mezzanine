#!/usr/bin/env node
/**
 * Compose React + Angular Storybook static outputs plus a hand-written
 * landing page into a single directory tree:
 *
 *   storybook-static/
 *   ├── index.html            Landing (links to both frameworks)
 *   ├── react/                React Storybook (full static output)
 *   └── angular/              Angular Storybook (full static output)
 *
 * Earlier iterations used a Storybook-based "hub" with Composition refs,
 * but the manager's dynamic `import.meta.url` resolution clashed with
 * Cloudflare Pages's sub-path hosting (and its `.html` extension-stripping
 * normalization), producing recursive `./sb-addons/…` URLs and 404s.
 *
 * A plain static landing page has none of that surface area: no iframe,
 * no cross-frame chunk loading, no URL base assumptions.
 *
 * The final dir name is `storybook-static` so the existing Cloudflare
 * Pages project (`storybook.mezzanine-ui.org`, build command
 * `yarn storybook build`, output dir `storybook-static`) keeps working
 * without any dashboard changes. See also `scripts/storybook-dispatch.mjs`.
 *
 * Expected pre-conditions (this script does NOT run the builds itself):
 *   - yarn react:build            → storybook-static/      (will be moved)
 *   - yarn ng:build-storybook     → storybook-ng-static/
 */

import {
  cpSync,
  existsSync,
  mkdirSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(fileURLToPath(import.meta.url), '..', '..');

const sources = {
  react: resolve(repoRoot, 'storybook-static'),
  angular: resolve(repoRoot, 'storybook-ng-static'),
};

const finalDest = resolve(repoRoot, 'storybook-static');
const reactStaging = resolve(repoRoot, 'storybook-static-react-tmp');

for (const [name, path] of Object.entries(sources)) {
  if (!existsSync(path)) {
    console.error(
      `[compose-storybooks] Missing source "${name}" at ${path}. ` +
        `Run the corresponding build first (react:build / ng:build-storybook).`,
    );
    process.exit(1);
  }
}

// Step 1 — stash React's own output so we can reuse the directory name.
if (existsSync(reactStaging)) {
  rmSync(reactStaging, { recursive: true, force: true });
}
renameSync(sources.react, reactStaging);

// Step 2 — fresh final destination (React was just moved away).
if (existsSync(finalDest)) {
  rmSync(finalDest, { recursive: true, force: true });
}
mkdirSync(finalDest, { recursive: true });

// Step 3 — React at /react (move the staged bundle in).
renameSync(reactStaging, resolve(finalDest, 'react'));

// Step 4 — Angular at /angular.
cpSync(sources.angular, resolve(finalDest, 'angular'), { recursive: true });

// Step 5 — landing page at /index.html.
writeFileSync(resolve(finalDest, 'index.html'), renderLanding(), 'utf-8');

console.log(`[compose-storybooks] Composed into ${finalDest}`);
console.log('  /          → landing page');
console.log('  /react/    → React Storybook');
console.log('  /angular/  → Angular Storybook');

function renderLanding() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Mezzanine UI</title>
    <meta
      name="description"
      content="Mezzanine UI — component library for React and Angular."
    />
    <link rel="icon" href="./react/favicon.svg" type="image/svg+xml" />
    <style>
      :root {
        color-scheme: dark;
        --bg: #0d0d0d;
        --surface: #161616;
        --surface-hover: #1d1d1d;
        --border: #2a2a2a;
        --border-hover: #3d7dff;
        --text: #ededed;
        --text-dim: #9a9a9a;
        --brand: #3d7dff;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family:
          'Nunito Sans',
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          sans-serif;
        background: var(--bg);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      main {
        flex: 1;
        max-width: 920px;
        width: 100%;
        margin: 0 auto;
        padding: 96px 24px 48px;
      }

      header {
        text-align: center;
        margin-bottom: 64px;
      }

      h1 {
        font-size: 48px;
        font-weight: 700;
        margin: 0 0 16px;
        letter-spacing: -0.02em;
      }

      header p {
        margin: 0;
        font-size: 18px;
        color: var(--text-dim);
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .card {
        display: flex;
        flex-direction: column;
        padding: 32px;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        text-decoration: none;
        color: inherit;
        transition:
          border-color 0.15s,
          background 0.15s,
          transform 0.15s;
      }

      .card:hover {
        border-color: var(--border-hover);
        background: var(--surface-hover);
        transform: translateY(-2px);
      }

      .card h2 {
        font-size: 24px;
        font-weight: 700;
        margin: 0 0 8px;
        color: var(--brand);
      }

      .card .pkg {
        font-family:
          'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', monospace;
        font-size: 13px;
        color: var(--text-dim);
        margin: 0 0 16px;
      }

      .card p {
        margin: 0 0 24px;
        color: var(--text-dim);
        line-height: 1.5;
      }

      .card .cta {
        margin-top: auto;
        color: var(--brand);
        font-weight: 600;
        font-size: 14px;
      }

      footer {
        text-align: center;
        padding: 32px 24px;
        color: var(--text-dim);
        font-size: 14px;
      }

      footer a {
        color: var(--brand);
        text-decoration: none;
      }

      footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>Mezzanine UI</h1>
        <p>Design system for React and Angular, sharing the same core styles.</p>
      </header>

      <section class="cards" aria-label="Browse by framework">
        <a class="card" href="./react/">
          <h2>React</h2>
          <p class="pkg">@mezzanine-ui/react</p>
          <p>Interactive component documentation for the React implementation.</p>
          <span class="cta">Open Storybook →</span>
        </a>
        <a class="card" href="./angular/">
          <h2>Angular</h2>
          <p class="pkg">@mezzanine-ui/ng</p>
          <p>Interactive component documentation for the Angular implementation.</p>
          <span class="cta">Open Storybook →</span>
        </a>
      </section>
    </main>

    <footer>
      <a href="https://github.com/Mezzanine-UI/mezzanine">GitHub</a>
      &nbsp;·&nbsp;
      <a href="https://www.npmjs.com/package/@mezzanine-ui/react">npm (React)</a>
      &nbsp;·&nbsp;
      <a href="https://www.npmjs.com/package/@mezzanine-ui/ng">npm (Angular)</a>
    </footer>
  </body>
</html>
`;
}
