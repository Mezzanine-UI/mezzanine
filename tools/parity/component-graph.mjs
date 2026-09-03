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
 * ## Why edges are resolved file by file
 *
 * A directory is not a unit of dependency. `Toggle.tsx` reads
 *
 *     import { useSwitchControlValue } from '../Form/useSwitchControlValue';
 *     import { FormControlContext } from '../Form';
 *
 * and a directory-level scan concludes Toggle depends on Form — which depends
 * on Select, which sits in the 31-component cycle, so Toggle looks unportable
 * for months. What Toggle actually needs is a thirty-line boolean-state hook
 * and a four-field context: both port alongside Toggle in an afternoon, and
 * Toggle's only real component dependency is Typography.
 *
 * So every import is resolved to a **file**, and the file decides:
 *
 *   - a `.tsx` module is a component — record a dependency on its directory
 *     and stop, because whatever it imports is that component's problem;
 *   - a `.ts` module is a hook, context, type or helper — record it as a
 *     *shared module* the importer must carry, and keep walking through it,
 *     since a hook can still reach a real component;
 *   - a barrel (`index.ts`) is resolved through the named bindings actually
 *     imported, so `{ FormControlContext } from '../Form'` lands on
 *     `Form/FormControlContext.ts` and never on `Form/FormField.tsx`.
 *
 * Comments are stripped first: JSDoc `@example` blocks are full of import
 * lines, and they are documentation, not edges.
 *
 * Usage:  node tools/parity/component-graph.mjs [--json]
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { repoRoot, walk } from './vue-fs.mjs';

const reactRoot = resolve(repoRoot, 'packages/react/src');
const vueRoot = resolve(repoRoot, 'packages/vue');

const kebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const components = readdirSync(reactRoot)
  .filter((n) => /^[A-Z]/.test(n) && statSync(join(reactRoot, n)).isDirectory())
  .sort();

const componentSet = new Set(components);

const isStoryFile = (f) => f.endsWith('.stories.tsx') || f.endsWith('.stories.ts');
const isSpecFile = (f) => f.endsWith('.spec.tsx') || f.endsWith('.spec.ts');
const isSource = (f) => (f.endsWith('.ts') || f.endsWith('.tsx')) && !isSpecFile(f);

/** Strip block and line comments so JSDoc examples cannot contribute edges. */
const stripComments = (src) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

const sourceCache = new Map();

function read(file) {
  if (!sourceCache.has(file)) {
    sourceCache.set(file, stripComments(readFileSync(file, 'utf8')));
  }

  return sourceCache.get(file);
}

/** Resolve a relative specifier to an existing file, TypeScript-style. */
function resolveFile(fromFile, spec) {
  const base = resolve(dirname(fromFile), spec);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ];

  return (
    candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? null
  );
}

/** The component directory a file belongs to, or null for hooks/utils/… */
function ownerOf(file) {
  const [dir] = relative(reactRoot, file).split('/');

  return componentSet.has(dir) ? dir : null;
}

const isBarrel = (file) => /\/index\.tsx?$/.test(file);
const isComponentModule = (file) => file.endsWith('.tsx') && !isBarrel(file);

/**
 * Import clause → the exported names it pulls in.
 *
 * `namespace` is a wildcard: `import * as X from '../Y'` can reach anything Y
 * exports, so a barrel behind one is resolved conservatively.
 */
function parseBindings(clause) {
  const trimmed = clause.replace(/^type\s+/, '').trim();

  if (/^\*\s+as\s/.test(trimmed)) return { names: [], namespace: true };

  const names = [];
  const braced = trimmed.match(/\{([\s\S]*)\}/);
  const beforeBrace = trimmed.split('{')[0].replace(/,\s*$/, '').trim();

  if (beforeBrace) names.push('default');

  if (braced) {
    for (const part of braced[1].split(',')) {
      const name = part
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0]
        .trim();

      if (name) names.push(name);
    }
  }

  return { names, namespace: false };
}

/** Names a module exports at its definition site (for `export * from`). */
function exportedNames(file) {
  const names = new Set();
  const src = read(file);

  for (const m of src.matchAll(
    /export\s+(?:declare\s+)?(?:abstract\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
  )) {
    names.add(m[1]);
  }

  for (const m of src.matchAll(/export\s*\{([^}]*)\}(?![\s]*from\b)/g)) {
    for (const part of m[1].split(',')) {
      const name = part.trim().split(/\s+as\s+/).pop()?.trim();

      if (name) names.add(name);
    }
  }

  if (/export\s+default\s/.test(src)) names.add('default');

  return names;
}

/**
 * Local name → file, for every relative import in a file.
 *
 * A barrel does not always re-export directly. `Typography/index.ts` imports
 * its own default, casts it, and exports the cast — so `export … from` alone
 * finds nothing, and a default import of Typography silently resolves to no
 * file at all.
 */
function localImportBindings(file) {
  const out = new Map();

  for (const m of read(file).matchAll(
    /import\s+([^;'"]*?)\s*from\s*['"](\.[^'"]+)['"]/g,
  )) {
    const target = resolveFile(file, m[2]);

    if (!target) continue;

    const clause = m[1].replace(/^type\s+/, '').trim();
    const namespace = clause.match(/^\*\s+as\s+([A-Za-z_$][\w$]*)/);

    if (namespace) {
      out.set(namespace[1], target);
      continue;
    }

    const beforeBrace = clause.split('{')[0].replace(/,\s*$/, '').trim();

    if (beforeBrace) out.set(beforeBrace, target);

    const braced = clause.match(/\{([\s\S]*)\}/);

    if (!braced) continue;

    for (const part of braced[1].split(',')) {
      const cleaned = part.trim().replace(/^type\s+/, '');

      if (!cleaned) continue;

      const [original, alias] = cleaned.split(/\s+as\s+/);

      out.set((alias ?? original).trim(), target);
    }
  }

  return out;
}

const barrelCache = new Map();

/**
 * Map every name a barrel re-exports to the file that *defines* it.
 *
 * Barrels chain — the package root re-exports `./Dropdown`, which re-exports
 * `./Dropdown.tsx` — so a nested barrel is resolved rather than treated as the
 * definition site. Without that, a name looks unresolvable and the caller has
 * to fall back to the whole barrel.
 */
function barrelMap(barrelFile, seen = new Set()) {
  if (barrelCache.has(barrelFile)) return barrelCache.get(barrelFile);
  if (seen.has(barrelFile)) return new Map();

  seen.add(barrelFile);

  const map = new Map();
  const src = read(barrelFile);

  for (const m of src.matchAll(
    /export\s+(type\s+)?(\*|\{[^}]*\})\s*from\s*['"]([^'"]+)['"]/g,
  )) {
    const target = resolveFile(barrelFile, m[3]);

    if (!target) continue;

    const nested = isBarrel(target) ? barrelMap(target, seen) : null;

    if (m[2] === '*') {
      if (nested) for (const [name, file] of nested) map.set(name, file);
      else for (const name of exportedNames(target)) map.set(name, target);

      continue;
    }

    for (const part of m[2].slice(1, -1).split(',')) {
      const cleaned = part.trim().replace(/^type\s+/, '');

      if (!cleaned) continue;

      const [original, alias] = cleaned.split(/\s+as\s+/);
      const source = original.trim();

      map.set((alias ?? original).trim(), nested?.get(source) ?? target);
    }
  }

  // Exports that go through a local binding rather than straight through.
  const locals = localImportBindings(barrelFile);
  const defaultExport = src.match(/export\s+default\s+([A-Za-z_$][\w$]*)/);

  if (defaultExport && locals.has(defaultExport[1])) {
    map.set('default', locals.get(defaultExport[1]));
  }

  for (const m of src.matchAll(
    /export\s+(?:type\s+)?\{([^}]*)\}(?![\s]*from\b)/g,
  )) {
    for (const part of m[1].split(',')) {
      const cleaned = part.trim().replace(/^type\s+/, '');

      if (!cleaned) continue;

      const [original, alias] = cleaned.split(/\s+as\s+/);
      const target = locals.get(original.trim());

      if (target) map.set((alias ?? original).trim(), target);
    }
  }

  if (seen.size === 1) barrelCache.set(barrelFile, map);

  return map;
}

const importCache = new Map();

/** Every `import … from` / `export … from` in a file, with its bindings. */
function importsOf(file) {
  if (importCache.has(file)) return importCache.get(file);

  const src = read(file);
  const out = [];

  for (const m of src.matchAll(
    /import\s+([^;'"]*?)\s*from\s*['"]([^'"]+)['"]/g,
  )) {
    out.push({ spec: m[2], ...parseBindings(m[1]) });
  }

  // A re-export is an edge too, and its bindings are just as informative.
  for (const m of src.matchAll(
    /export\s+(type\s+)?(\*|\{[^}]*\})\s*from\s*['"]([^'"]+)['"]/g,
  )) {
    out.push(
      m[2] === '*'
        ? { spec: m[3], names: [], namespace: true }
        : { spec: m[3], ...parseBindings(m[2]) },
    );
  }

  importCache.set(file, out);

  return out;
}

/**
 * Files an import reaches. A barrel is opened only for the names actually
 * imported; an unresolvable name falls back to the whole barrel, so an
 * unrecognized export shape overstates the dependency rather than hiding it.
 */
function targetsOf(file, imported) {
  const resolved = resolveFile(file, imported.spec);

  if (!resolved) return [];
  if (!isBarrel(resolved)) return [resolved];

  const map = barrelMap(resolved);

  if (imported.namespace || imported.names.length === 0) {
    return [...new Set(map.values())];
  }

  const out = [];
  let unresolved = false;

  for (const name of imported.names) {
    const target = map.get(name);

    if (target) out.push(target);
    else unresolved = true;
  }

  // A name a component's own barrel cannot account for is followed into that
  // barrel: walking its imports reaches the real definitions and stops at the
  // component files they live in.
  //
  // The package root barrel is not followed, because everything is behind it —
  // one unresolved name there (`DropdownOption`, re-exported from
  // `@mezzanine-ui/core`, so not resolvable in this package at all) would make
  // a single story depend on all 68 components. Those edges stay missing, and
  // the barrel-users note at the end of the report says so.
  if (unresolved && ownerOf(resolved)) out.push(resolved);

  return [...new Set(out)];
}

/**
 * Walk out from a component's own files, collecting the components it needs
 * and the individual modules it borrows from other components' directories.
 */
function collect(component, seeds) {
  const componentDeps = new Set();
  const moduleDeps = new Set();
  const seen = new Set(seeds);
  const queue = [...seeds];

  while (queue.length > 0) {
    const file = queue.pop();

    for (const imported of importsOf(file)) {
      if (!imported.spec.startsWith('.')) continue;

      for (const target of targetsOf(file, imported)) {
        const owner = ownerOf(target);

        if (owner === component) {
          if (!seen.has(target)) {
            seen.add(target);
            queue.push(target);
          }

          continue;
        }

        if (owner && isComponentModule(target)) {
          componentDeps.add(owner);
          continue;
        }

        // A hook, context or helper: the importer carries it, so keep
        // walking — it can still reach a real component further in. A barrel
        // is only a waypoint, so it is walked but never listed.
        if (owner && !isBarrel(target)) moduleDeps.add(relative(reactRoot, target));

        if (!seen.has(target)) {
          seen.add(target);
          queue.push(target);
        }
      }
    }
  }

  return { componentDeps, moduleDeps };
}

const deps = new Map();
const storyDeps = new Map();
const moduleDeps = new Map();
const barrelUsers = new Set();

for (const component of components) {
  const files = await walk(join(reactRoot, component), isSource);
  const implFiles = files.filter((f) => !isStoryFile(f));
  const storyFiles = files.filter((f) => isStoryFile(f));

  const impl = collect(component, implFiles);
  const story = collect(component, storyFiles);

  deps.set(component, impl.componentDeps);
  moduleDeps.set(component, impl.moduleDeps);
  storyDeps.set(component, story.componentDeps);

  for (const file of files) {
    if (/from\s+['"]\.\.['"]/.test(read(file))) barrelUsers.add(component);
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

/**
 * A component can only *reach parity* once everything its stories render also
 * exists — parity includes the stories. Implementation order and
 * parity-reachable order are therefore different things: `portal` has no
 * implementation dependencies and sits in batch 1, but its stories render a
 * Button, which is not ported until batch 4.
 */
const storyReady = (c) => [...storyDeps.get(c)].every(ported);

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
            storyReady: storyReady(c),
            dependsOn: [...deps.get(c)].sort(),
            sharedModules: [...moduleDeps.get(c)].sort(),
            storiesAlsoNeed: [...storyDeps.get(c)].sort(),
            storiesBlockedOn: [...storyDeps.get(c)]
              .filter((d) => !ported(d))
              .sort(),
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
      .map((c) => {
        if (ported(c)) return `${kebab(c)} ✓`;
        if (storyReady(c)) return kebab(c);

        const blockers = [...storyDeps.get(c)]
          .filter((d) => !ported(d))
          .map(kebab)
          .sort()
          .join('+');

        return `${kebab(c)} (stories blocked on ${blockers})`;
      })
      .join(', ')}\n`,
  );
}

console.log(
  'Parallelization rule: components within one batch may be dispatched to\n' +
    'separate sub-agents; across batches, always sequential. Any change to\n' +
    'packages/vue/_internal/ or to an already-ported component must be pulled\n' +
    'back onto the main line rather than done in parallel.\n',
);

const withModules = components.filter((c) => moduleDeps.get(c).size > 0);

if (withModules.length > 0) {
  console.log(
    `Shared modules (${withModules.length} component(s)): hooks, contexts and\n` +
      "helpers borrowed from another component's directory. These are not\n" +
      'component dependencies — they port alongside the component that needs\n' +
      'them — but they do have to be ported, so they are listed here:\n',
  );

  for (const c of withModules) {
    console.log(`  ${kebab(c)} → ${[...moduleDeps.get(c)].sort().join(', ')}`);
  }

  console.log('');
}

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
