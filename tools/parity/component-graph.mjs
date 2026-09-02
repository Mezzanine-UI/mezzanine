#!/usr/bin/env node
/**
 * Derive the React component dependency graph and emit parallel-safe porting
 * batches.
 *
 * Why this exists: components must be ported leaves-first, because a
 * container's parity depends on its children already being at zero diffs —
 * porting a container early means debugging someone else's diffs. And when
 * work is fanned out to sub-agents, only components that cannot touch each
 * other may run concurrently.
 *
 * Two graphs are derived, because they answer different questions:
 *
 *   1. **implementation** — imports in the component sources. This is what
 *      determines porting order and what can safely run in parallel.
 *   2. **story-only** — additional components a file's stories render. Parity
 *      includes the stories, so a component is not *finished* until these
 *      exist too — but they must not drive the ordering, because stories
 *      cross-reference each other freely and make the graph cyclic (Button's
 *      story renders a Dropdown; Dropdown is built from Buttons).
 *
 * Spec files count for neither — they are not part of the parity surface.
 *
 * Usage:  node tools/parity/component-graph.mjs [--json]
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { repoRoot, walk } from './vue-fs.mjs';

const reactRoot = resolve(repoRoot, 'packages/react/src');
const vueRoot = resolve(repoRoot, 'packages/vue');

const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const components = readdirSync(reactRoot)
  .filter((n) => /^[A-Z]/.test(n) && statSync(join(reactRoot, n)).isDirectory())
  .sort();

const componentSet = new Set(components);
const deps = new Map(components.map((c) => [c, new Set()]));
const storyDeps = new Map(components.map((c) => [c, new Set()]));
const barrelUsers = new Set();

const IMPORT = /from\s+['"]\.\.\/([A-Za-z][A-Za-z0-9]*)(?:\/[^'"]*)?['"]/g;
const BARREL = /from\s+['"]\.\.['"]/;

for (const component of components) {
  const files = await walk(
    join(reactRoot, component),
    (n) =>
      (n.endsWith('.ts') || n.endsWith('.tsx')) &&
      !n.endsWith('.spec.ts') &&
      !n.endsWith('.spec.tsx'),
  );

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const isStory = file.endsWith('.stories.tsx') || file.endsWith('.stories.ts');
    const bucket = isStory ? storyDeps : deps;

    if (BARREL.test(src)) barrelUsers.add(component);

    for (const m of src.matchAll(IMPORT)) {
      const dep = m[1];

      if (dep !== component && componentSet.has(dep)) {
        bucket.get(component).add(dep);
      }
    }
  }
}

// Story deps that the implementation does not already require.
for (const [component, set] of storyDeps) {
  for (const d of deps.get(component)) set.delete(d);
}

// ---- Kahn's algorithm, level by level -------------------------------------
const remaining = new Map([...deps].map(([c, d]) => [c, new Set(d)]));
const batches = [];

while (remaining.size > 0) {
  const ready = [...remaining.entries()]
    .filter(([, d]) => d.size === 0)
    .map(([c]) => c)
    .sort();

  if (ready.length === 0) {
    batches.push({ cycle: true, members: [...remaining.keys()].sort() });
    break;
  }

  batches.push({ cycle: false, members: ready });

  for (const c of ready) remaining.delete(c);
  for (const d of remaining.values()) for (const c of ready) d.delete(c);
}

const ported = (c) => existsSync(join(vueRoot, kebab(c)));

if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify(
      {
        batches: batches.map((b, i) => ({
          batch: i + 1,
          cycle: b.cycle,
          members: b.members.map((c) => ({
            react: c,
            vue: kebab(c),
            ported: ported(c),
            dependsOn: [...deps.get(c)].sort(),
            storiesAlsoNeed: [...storyDeps.get(c)].sort(),
          })),
        })),
        barrelUsers: [...barrelUsers].sort(),
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.log(`React components: ${components.length}\n`);

for (const [i, batch] of batches.entries()) {
  const label = batch.cycle
    ? `batch ${i + 1} (CYCLE — must be ported together / broken manually)`
    : i === 0
      ? `batch ${i + 1} (no dependencies, parallel-safe)`
      : `batch ${i + 1} (depends on batch ${i})`;

  console.log(`${label} — ${batch.members.length} component(s)`);
  console.log(
    `  ${batch.members
      .map((c) => `${kebab(c)}${ported(c) ? ' ✓' : ''}`)
      .join(', ')}\n`,
  );
}

console.log(
  'Parallelization rule: components within one batch may be dispatched to\n' +
    'separate sub-agents; across batches, always sequential. Any change to\n' +
    'packages/vue/_internal/ or to an already-ported component must be pulled\n' +
    'back onto the main line rather than done in parallel.\n',
);

const withStoryDeps = components.filter((c) => storyDeps.get(c).size > 0);

if (withStoryDeps.length > 0) {
  console.log(
    `Story-only dependencies (${withStoryDeps.length} component(s)): these do not\n` +
      'affect implementation order, but a component is not finished until its\n' +
      'stories can render, so they gate the final parity run:\n',
  );

  for (const c of withStoryDeps) {
    console.log(
      `  ${kebab(c)} → ${[...storyDeps.get(c)].map(kebab).sort().join(', ')}`,
    );
  }

  console.log('');
}

if (barrelUsers.size > 0) {
  console.log(
    `Note: ${barrelUsers.size} component(s) import from the package barrel ('..'),\n` +
      'whose targets cannot be resolved statically. Their edges may be\n' +
      `incomplete: ${[...barrelUsers].sort().join(', ')}\n`,
  );
}
