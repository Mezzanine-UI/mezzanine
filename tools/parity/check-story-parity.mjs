#!/usr/bin/env node
/**
 * Static check: React and Vue story files agree on `title` and on the set and
 * order of exported stories.
 *
 * The browser harness already reports missing/extra stories, but only after
 * booting two Storybooks and driving Playwright. This runs in under a second
 * and is meant to gate that slow path — a missing story is a spec violation
 * (rule R6: the two Storybooks must present identical scenarios), not
 * something to discover five minutes into a parity run.
 *
 * React stories without a Vue counterpart are not errors: they are simply
 * not ported yet.
 *
 * Usage:  node tools/parity/check-story-parity.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repoRoot, report, walk } from './vue-fs.mjs';

const TITLE = /title:\s*['"`]([^'"`]+)['"`]/;
const EXPORT_CONST = /^export\s+const\s+([A-Za-z_$][\w$]*)/gm;

function readStories(file) {
  const src = readFileSync(file, 'utf8');
  const title = src.match(TITLE)?.[1] ?? null;
  const names = [...src.matchAll(EXPORT_CONST)].map((m) => m[1]);

  return { file, title, names };
}

const reactFiles = await walk(
  resolve(repoRoot, 'packages/react/src'),
  (n) => n.endsWith('.stories.tsx'),
);
// `_`-prefixed directories (`_internal`, `_smoke`) are not ported components
// and have no React counterpart by design.
const vueFiles = (
  await walk(resolve(repoRoot, 'packages/vue'), (n) => n.endsWith('.stories.ts'))
).filter((f) => !/\/_[^/]*\//.test(f));

const reactByTitle = new Map();

for (const file of reactFiles) {
  const entry = readStories(file);

  if (entry.title) reactByTitle.set(entry.title, entry);
}

const problems = [];

for (const file of vueFiles) {
  const vue = readStories(file);

  if (!vue.title) {
    problems.push({ file, reason: 'no `title` found in the story meta' });
    continue;
  }

  const react = reactByTitle.get(vue.title);

  if (!react) {
    problems.push({
      file,
      reason:
        `title "${vue.title}" has no React counterpart. Story ids are derived ` +
        'from title + export name, so a title that differs by even one ' +
        'character makes every story of this component unpairable.',
    });
    continue;
  }

  const missing = react.names.filter((n) => !vue.names.includes(n));
  const extra = vue.names.filter((n) => !react.names.includes(n));

  if (missing.length) {
    problems.push({
      file,
      reason: `missing story export(s) present in React: ${missing.join(', ')}`,
    });
  }

  if (extra.length) {
    problems.push({
      file,
      reason: `Vue-only story export(s) with no React counterpart: ${extra.join(', ')}`,
    });
  }

  if (
    !missing.length &&
    !extra.length &&
    react.names.join(',') !== vue.names.join(',')
  ) {
    problems.push({
      file,
      reason:
        'story order differs from React, so the two Storybook sidebars will ' +
        `not read the same.\n     react: ${react.names.join(', ')}\n     vue:   ${vue.names.join(', ')}`,
    });
  }
}

report(
  `story parity check (${reactFiles.length} react / ${vueFiles.length} vue)`,
  vueFiles.length,
  problems,
);
