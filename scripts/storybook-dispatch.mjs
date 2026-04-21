#!/usr/bin/env node
/**
 * `yarn storybook ...` dispatcher.
 *
 * Background: the Cloudflare Pages project that hosts
 * storybook.mezzanine-ui.org predates the React/Angular Storybook
 * Composition hub. Its build command is `yarn storybook build` and its
 * output directory is `storybook-static/`, and we want to keep both
 * unchanged.
 *
 * Historically `yarn storybook build` fell through to the Storybook
 * CLI and produced a React-only `storybook-static/`. This dispatcher
 * intercepts that invocation and runs the composed pipeline instead,
 * so the final `storybook-static/` contains:
 *
 *   /          → Hub
 *   /react/    → React
 *   /angular/  → Angular
 *
 * Any non-`build` subcommand is forwarded to the Storybook CLI
 * unchanged (`yarn storybook dev`, `yarn storybook init`, …).
 */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const args = process.argv.slice(2);

function run(command, commandArgs) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, commandArgs, {
      cwd: repoRoot,
      stdio: 'inherit',
    });
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${command} ${commandArgs.join(' ')} exited with code ${code}`));
    });
    child.on('error', rejectPromise);
  });
}

if (args[0] === 'build') {
  try {
    await run('yarn', ['storybook:build-composed']);
    process.exit(0);
  } catch (err) {
    console.error(`[storybook-dispatch] ${err.message}`);
    process.exit(1);
  }
} else {
  // Forward to Storybook CLI for dev / init / etc.
  const storybookBin = require.resolve('storybook/bin/index.cjs');
  try {
    await run(process.execPath, [storybookBin, ...args]);
    process.exit(0);
  } catch (err) {
    console.error(`[storybook-dispatch] ${err.message}`);
    process.exit(1);
  }
}
