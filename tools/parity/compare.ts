/**
 * React ↔ target-framework Storybook parity harness.
 *
 * React is always the reference side; `--target` selects which port it is
 * compared against.
 *
 * Usage:
 *   yarn parity -- <component-kebab>              # Angular, one component
 *   yarn parity:all                               # Angular, everything
 *   yarn parity:vue -- <component-kebab>          # Vue, one component
 *   yarn parity:vue:all                           # Vue, everything
 *
 * Pre-conditions:
 *   - React Storybook   on http://localhost:6006  (PARITY_REACT_URL)
 *   - Angular Storybook on http://localhost:6007  (PARITY_NG_URL)
 *   - Vue Storybook     on http://localhost:6008  (PARITY_VUE_URL)
 *
 * Exit code: 0 iff every diff is empty (or suppressed by the target's
 * deviations file).
 */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

import {
  ARGS_SOURCE,
  SNAPSHOT_SOURCE,
  STYLE_KEYS,
  type NormalizedNode,
  type StoryArgs,
} from './normalize.ts';
import { loadDeviations, isSuppressed } from './deviations.ts';
import { renderReport } from './report.ts';
import { diffApi } from './api.ts';

const REACT_URL = process.env.PARITY_REACT_URL ?? 'http://localhost:6006';

export type TargetId = 'ng' | 'vue';

type TargetConfig = {
  id: TargetId;
  label: string;
  url: string;
  outDir: string;
  deviationsFile: string;
};

const TARGETS: Record<TargetId, TargetConfig> = {
  ng: {
    id: 'ng',
    label: 'Angular',
    url: process.env.PARITY_NG_URL ?? 'http://localhost:6007',
    outDir: resolve(process.cwd(), 'tools/parity/.out'),
    deviationsFile: resolve(process.cwd(), 'DEVIATIONS.md'),
  },
  vue: {
    id: 'vue',
    label: 'Vue',
    url: process.env.PARITY_VUE_URL ?? 'http://localhost:6008',
    outDir: resolve(process.cwd(), 'tools/parity/.out-vue'),
    deviationsFile: resolve(process.cwd(), 'DEVIATIONS-VUE.md'),
  },
};

/** Selected in `main()` before any snapshot work begins. */
let cfg: TargetConfig = TARGETS.ng;

export type Diff = {
  story: string;
  path: string;
  kind:
    | 'tag'
    | 'attr'
    | 'style'
    | 'text'
    | 'args'
    | 'missing'
    | 'extra'
    | 'error'
    | 'input'
    | 'output';
  react?: unknown;
  target?: unknown;
};

type IndexEntry = { id: string; title: string; name: string; type?: string };
type StoryIndex = { entries: Record<string, IndexEntry> };

async function fetchIndex(url: string): Promise<StoryIndex> {
  const res = await fetch(`${url}/index.json`);
  if (!res.ok)
    throw new Error(`Failed to fetch ${url}/index.json: ${res.status}`);
  return (await res.json()) as StoryIndex;
}

function lastTitleSegment(title: string): string {
  return title.split('/').pop()!.replace(/\s+/g, '');
}

function componentSlug(title: string): string {
  // PascalCase → kebab-case so that grouping matches Angular's directory naming.
  return lastTitleSegment(title)
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

async function snapshotStory(
  page: Page,
  baseUrl: string,
  storyId: string,
): Promise<NormalizedNode | null> {
  await page.goto(
    `${baseUrl}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`,
    {
      waitUntil: 'domcontentloaded',
    },
  );
  // Wait until #storybook-root has rendered actual content (not just a framework wrapper).
  await page.waitForFunction(
    () => {
      const root = document.querySelector('#storybook-root');
      if (!root) return false;
      // Skip Angular's <storybook-root> wrapper if present.
      let host: Element = root;
      const first = host.firstElementChild;
      if (first && first.tagName.toLowerCase() === 'storybook-root')
        host = first;
      return !!host.firstElementChild;
    },
    null,
    { timeout: 15000 },
  );
  await page.evaluate(() => document.fonts.ready);
  // Suppress CSS transitions/animations so getComputedStyle() does not return
  // mid-animation interpolated values. Storybook's .sb-show-main applies a
  // `transition: color` for theme switching; in fresh story loads it causes
  // the inherited `color` to fade from #000 → token, and React vs Angular
  // mount-timing differences would otherwise capture different frames.
  await page.addStyleTag({
    content: `*, *::before, *::after { transition: none !important; animation: none !important; }`,
  });
  // Settle animations before reading computed styles. Two kinds cannot be
  // awaited and used to hang the run indefinitely:
  //   - infinite CSS animations, and
  //   - scroll-driven animations (OverlayScrollbars creates two on every
  //     scrollbar handle), whose computed timing is expressed in percentages
  //     because progress comes from a ScrollTimeline rather than the clock.
  // Neither has an end state, so their `finished` promise never resolves.
  // They are cancelled instead, which reverts the element to its base style —
  // the same thing the injected `animation: none` does to CSS animations, and
  // symmetric across both sides. A hard cap guards anything not covered.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const settled = Promise.all(
          document.getAnimations().map((animation) => {
            let endTime: unknown;

            try {
              endTime = animation.effect?.getComputedTiming().endTime;
            } catch {
              endTime = undefined;
            }

            if (typeof endTime !== 'number' || !Number.isFinite(endTime)) {
              animation.cancel();

              return undefined;
            }

            return animation.finished.catch(() => undefined);
          }),
        );
        const timer = setTimeout(() => resolve(), 2000);

        void settled.then(() => {
          clearTimeout(timer);
          resolve();
        });
      }),
  );
  // Some components defer initialisation to `requestIdleCallback` — anything
  // built on OverlayScrollbars does, via its `defer` option. Whether that
  // callback has run by snapshot time otherwise depends on how busy the page
  // is, which differs between the two dev servers and makes the first story of
  // a run flaky. Wait for idle, then let the resulting DOM changes paint.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const idle = (
          window as unknown as {
            requestIdleCallback?: (
              cb: () => void,
              opts?: { timeout: number },
            ) => void;
          }
        ).requestIdleCallback;

        if (typeof idle === 'function')
          idle(() => resolve(), { timeout: 2000 });
        else setTimeout(resolve, 100);
      }),
  );
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  return (await page.evaluate(
    `(${SNAPSHOT_SOURCE})(${JSON.stringify(STYLE_KEYS)})`,
  )) as NormalizedNode | null;
}

async function readStoryArgs(
  page: Page,
  storyId: string,
): Promise<StoryArgs | null> {
  try {
    return (await page.evaluate(
      `(${ARGS_SOURCE})(${JSON.stringify(storyId)})`,
    )) as StoryArgs | null;
  } catch {
    return null;
  }
}

/**
 * Compare Storybook `argTypes` for the controls that BOTH sides declare.
 *
 * Intersection-only, deliberately: React's argTypes are generated by
 * react-docgen-typescript (one entry per prop of the component), while the
 * Angular and Vue stories declare theirs by hand. Comparing full key sets
 * would emit dozens of spurious diffs per story and bury the real ones.
 *
 * The intersection still catches what matters for story parity — a control
 * both Storybooks expose but with a different option list or control type,
 * which means the two sides are not offering the same scenario.
 */
function diffArgs(
  story: string,
  react: StoryArgs | null,
  target: StoryArgs | null,
  out: Diff[],
): void {
  if (!react || !target) return;

  // A story that declares no args has no meaningful Controls panel, and
  // Storybook populates argTypes inconsistently for those: React leaves the
  // control and options null on a render-only story while Vue's docgen still
  // fills them in. Neither offers the reader anything to operate, so there is
  // nothing to compare.
  if (
    Object.keys(react.initialArgs).length === 0 &&
    Object.keys(target.initialArgs).length === 0
  ) {
    return;
  }

  for (const [name, r] of Object.entries(react.argTypes)) {
    const t = target.argTypes[name];

    if (!t) continue;

    if (JSON.stringify(r.options) !== JSON.stringify(t.options)) {
      out.push({
        story,
        path: `argTypes.${name}.options`,
        kind: 'args',
        react: r.options,
        target: t.options,
      });
    }

    // `vue-component-meta` does not resolve type aliases (`DateType`) or the
    // props a component inherits through `Pick<>`: it reports them as
    // `{ name: 'other' }`, and Storybook then falls back to the `object`
    // control. That fallback says the target's docgen gave up, not that the
    // two stories offer different scenarios, so it is not compared. Every
    // other case still is — a control the story declares itself (a `select`
    // with its own options), or one whose type both docgens resolved — and
    // option lists are compared regardless.
    const targetControlIsUnresolvedFallback =
      t.type === 'other' && t.control === 'object';

    if (r.control !== t.control && !targetControlIsUnresolvedFallback) {
      out.push({
        story,
        path: `argTypes.${name}.control`,
        kind: 'args',
        react: r.control,
        target: t.control,
      });
    }
  }
}

function nodePath(prefix: string, idx: number, tag: string): string {
  return `${prefix}/${tag}[${idx}]`;
}

function diffTree(
  story: string,
  pathStr: string,
  a: NormalizedNode | null,
  b: NormalizedNode | null,
  out: Diff[],
): void {
  if (!a && !b) return;
  if (!a) {
    out.push({ story, path: pathStr, kind: 'extra', target: b });
    return;
  }
  if (!b) {
    out.push({ story, path: pathStr, kind: 'missing', react: a });
    return;
  }
  if (a.tag !== b.tag) {
    out.push({
      story,
      path: pathStr,
      kind: 'tag',
      react: a.tag,
      target: b.tag,
    });
    // Soft-continue: if the two nodes share the same `class` attribute,
    // they almost certainly represent the same logical element rendered as
    // a different tag (e.g. React `<p class="x">` vs Angular `<span class="x">`,
    // or Angular's pre-refactor `<mzn-empty>` vs React's `<div>` host). Keep
    // walking the subtree so descendant diffs are not silently masked.
    // Otherwise (different class or text node etc.), preserve the original
    // early-return so genuinely-divergent subtrees do not explode the report.
    const aClass = a.attrs.class ?? '';
    const bClass = b.attrs.class ?? '';
    if (a.tag === '#text' || b.tag === '#text' || aClass !== bClass) {
      return;
    }
    // fall through to attrs/styles/children walk
  }
  if (a.tag === '#text') {
    if (a.text !== b.text)
      out.push({
        story,
        path: pathStr,
        kind: 'text',
        react: a.text,
        target: b.text,
      });
    return;
  }
  // attrs
  const attrKeys = new Set([...Object.keys(a.attrs), ...Object.keys(b.attrs)]);
  for (const k of [...attrKeys].sort()) {
    if (a.attrs[k] !== b.attrs[k]) {
      out.push({
        story,
        path: `${pathStr}@${k}`,
        kind: 'attr',
        react: a.attrs[k],
        target: b.attrs[k],
      });
    }
  }
  // styles
  const styleKeys = new Set([...Object.keys(a.style), ...Object.keys(b.style)]);
  for (const k of [...styleKeys].sort()) {
    if (a.style[k] !== b.style[k]) {
      out.push({
        story,
        path: `${pathStr}#${k}`,
        kind: 'style',
        react: a.style[k],
        target: b.style[k],
      });
    }
  }
  // children
  const max = Math.max(a.children.length, b.children.length);
  for (let i = 0; i < max; i += 1) {
    const ac = a.children[i] ?? null;
    const bc = b.children[i] ?? null;
    const tag = (ac ?? bc)?.tag ?? '?';
    diffTree(story, nodePath(pathStr, i, tag), ac, bc, out);
  }
}

async function runComponent(
  browser: Browser,
  component: string,
  pascalName: string,
  reactIds: IndexEntry[],
  targetEntries: Map<string, IndexEntry>,
): Promise<{ component: string; diffs: Diff[] }> {
  const reactCtx = await browser.newContext();
  const targetCtx = await browser.newContext();
  const reactPage = await reactCtx.newPage();
  const targetPage = await targetCtx.newPage();
  const allDiffs: Diff[] = [];
  const compDir = resolve(cfg.outDir, component);
  rmSync(compDir, { recursive: true, force: true });
  mkdirSync(compDir, { recursive: true });

  for (const entry of reactIds) {
    const story = entry.name;
    const targetEntry = targetEntries.get(entry.id);
    if (!targetEntry) {
      allDiffs.push({
        story,
        path: '/',
        kind: 'missing',
        react: entry.id,
        target: null,
      });
      continue;
    }
    try {
      const [r, n] = await Promise.all([
        snapshotStory(reactPage, REACT_URL, entry.id),
        snapshotStory(targetPage, cfg.url, entry.id),
      ]);
      const storyDiffs: Diff[] = [];
      diffTree(story, '/', r, n, storyDiffs);
      // Vue only. Turning argTypes comparison on for the Angular target would
      // change an acceptance criterion that port has already been signed off
      // against, so it stays off there until it is evaluated on its own.
      if (cfg.id === 'vue') {
        // Both pages are already parked on this story's iframe, so the preview
        // store can be queried without another navigation.
        const [reactArgs, targetArgs] = await Promise.all([
          readStoryArgs(reactPage, entry.id),
          readStoryArgs(targetPage, entry.id),
        ]);

        diffArgs(story, reactArgs, targetArgs, storyDiffs);
      }
      writeFileSync(
        resolve(compDir, `${slug(story)}.react.json`),
        JSON.stringify(r, null, 2),
      );
      writeFileSync(
        resolve(compDir, `${slug(story)}.${cfg.id}.json`),
        JSON.stringify(n, null, 2),
      );
      writeFileSync(
        resolve(compDir, `${slug(story)}.diff.json`),
        JSON.stringify(storyDiffs, null, 2),
      );
      allDiffs.push(...storyDiffs);
    } catch (e) {
      allDiffs.push({
        story,
        path: '/',
        kind: 'error',
        react: null,
        target: String((e as Error).message),
      });
    }
  }

  // Detect Angular-only stories.
  const reactIdSet = new Set(reactIds.map((e) => e.id));
  for (const [id, e] of targetEntries) {
    if (!reactIdSet.has(id))
      allDiffs.push({
        story: e.name,
        path: '/',
        kind: 'extra',
        react: null,
        target: id,
      });
  }

  await reactCtx.close();
  await targetCtx.close();

  // Source-level API parity (props/inputs/outputs) — runs once per component.
  // If either side has no single primary source file (e.g. meta-only React
  // dirs, multi-directive Angular folders), we silently skip API comparison.
  const apiResult = diffApi(pascalName, cfg.id);
  if (apiResult.reactFile && apiResult.targetFile) {
    for (const d of apiResult.diffs) {
      allDiffs.push({
        story: '__api__',
        path: `${d.kind}.${d.name}`,
        kind: d.kind,
        react: d.side === 'missing' ? 'present' : 'missing',
        target: d.side === 'missing' ? 'missing' : 'present',
      });
    }
  }

  const suppressions = loadDeviations(cfg.deviationsFile);
  const filtered = allDiffs.filter(
    (d) => !isSuppressed(suppressions, component, d.story, d.kind),
  );
  writeFileSync(
    resolve(compDir, 'report.txt'),
    renderReport(component, filtered, cfg.label),
  );
  writeFileSync(
    resolve(compDir, 'diffs.json'),
    JSON.stringify(filtered, null, 2),
  );
  return { component, diffs: filtered };
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function groupByComponent(index: StoryIndex): Map<string, IndexEntry[]> {
  const out = new Map<string, IndexEntry[]>();
  for (const e of Object.values(index.entries)) {
    if (e.type && e.type !== 'story') continue;
    const slug = componentSlug(e.title);
    const arr = out.get(slug) ?? [];
    arr.push(e);
    out.set(slug, arr);
  }
  return out;
}

function pascalNameForSlug(entries: IndexEntry[]): string {
  return entries.length > 0 ? lastTitleSegment(entries[0].title) : '';
}

/**
 * Pull `--target <id>` / `--target=<id>` out of argv and return the rest, so
 * the target value is never mistaken for the component name.
 */
function parseTarget(argv: string[]): { targetId: TargetId; rest: string[] } {
  const rest: string[] = [];
  let targetId: TargetId = 'ng';

  const coerce = (value: string | undefined): TargetId => {
    if (value === 'ng' || value === 'vue') return value;
    console.error(
      `Unknown --target "${value ?? ''}". Expected one of: ng, vue.`,
    );
    process.exit(2);
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--target') {
      targetId = coerce(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg.startsWith('--target=')) {
      targetId = coerce(arg.slice('--target='.length));
      continue;
    }

    rest.push(arg);
  }

  return { targetId, rest };
}

async function main(): Promise<void> {
  const { targetId, rest: args } = parseTarget(process.argv.slice(2));

  cfg = TARGETS[targetId];

  const all = args.includes('--all');
  const component = args.find((a) => !a.startsWith('--'));
  if (!all && !component) {
    console.error(
      'Usage: yarn parity -- <component>   |   yarn parity:all\n' +
        '       yarn parity:vue -- <component>   |   yarn parity:vue:all',
    );
    process.exit(2);
  }

  if (all) rmSync(cfg.outDir, { recursive: true, force: true });
  mkdirSync(cfg.outDir, { recursive: true });
  const [reactIndex, targetIndex] = await Promise.all([
    fetchIndex(REACT_URL),
    fetchIndex(cfg.url),
  ]);
  const reactByComp = groupByComponent(reactIndex);
  const targetByComp = groupByComponent(targetIndex);

  const components = all ? [...reactByComp.keys()].sort() : [component!];
  const browser = await chromium.launch();
  let totalDiffs = 0;
  const summary: { component: string; count: number }[] = [];
  for (const c of components) {
    const reactIds = reactByComp.get(c) ?? [];
    if (reactIds.length === 0) {
      console.log(`! ${c}: no React stories found, skipping`);
      continue;
    }
    const targetEntries = new Map(
      (targetByComp.get(c) ?? []).map((e) => [e.id, e] as const),
    );
    const pascalName = pascalNameForSlug(reactIds);
    const { diffs } = await runComponent(
      browser,
      c,
      pascalName,
      reactIds,
      targetEntries,
    );
    summary.push({ component: c, count: diffs.length });
    totalDiffs += diffs.length;
    console.log(
      `${diffs.length === 0 ? 'OK' : 'XX'} ${c}: ${diffs.length} diff(s)`,
    );
  }
  await browser.close();

  writeFileSync(
    resolve(cfg.outDir, 'summary.json'),
    JSON.stringify(summary, null, 2),
  );
  console.log(`\nTotal diffs (react vs ${cfg.label}): ${totalDiffs}`);
  process.exit(totalDiffs === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
