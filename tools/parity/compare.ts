/**
 * React ↔ Angular Storybook parity harness.
 *
 * Usage:
 *   npm run parity -- <component-kebab>     # one component
 *   npm run parity:all                      # everything intersected
 *
 * Pre-conditions:
 *   - React Storybook running on http://localhost:6006
 *   - Angular Storybook running on http://localhost:6007
 *
 * Exit code: 0 iff every diff is empty (or every diff is suppressed by DEVIATIONS.md).
 */

import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium, type Browser, type Page } from 'playwright';

import {
  SNAPSHOT_SOURCE,
  STYLE_KEYS,
  type NormalizedNode,
} from './normalize.ts';
import { loadDeviations, isSuppressed } from './deviations.ts';
import { renderReport } from './report.ts';
import { diffApi } from './api.ts';

const REACT_URL = process.env.PARITY_REACT_URL ?? 'http://localhost:6006';
const NG_URL = process.env.PARITY_NG_URL ?? 'http://localhost:6007';
const OUT_DIR = resolve(process.cwd(), 'tools/parity/.out');

export type Diff = {
  story: string;
  path: string;
  kind:
    | 'tag'
    | 'attr'
    | 'style'
    | 'text'
    | 'missing'
    | 'extra'
    | 'error'
    | 'input'
    | 'output';
  react?: unknown;
  ng?: unknown;
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
  return (await page.evaluate(
    `(${SNAPSHOT_SOURCE})(${JSON.stringify(STYLE_KEYS)})`,
  )) as NormalizedNode | null;
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
    out.push({ story, path: pathStr, kind: 'extra', ng: b });
    return;
  }
  if (!b) {
    out.push({ story, path: pathStr, kind: 'missing', react: a });
    return;
  }
  if (a.tag !== b.tag) {
    out.push({ story, path: pathStr, kind: 'tag', react: a.tag, ng: b.tag });
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
        ng: b.text,
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
        ng: b.attrs[k],
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
        ng: b.style[k],
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
  ngEntries: Map<string, IndexEntry>,
): Promise<{ component: string; diffs: Diff[] }> {
  const reactCtx = await browser.newContext();
  const ngCtx = await browser.newContext();
  const reactPage = await reactCtx.newPage();
  const ngPage = await ngCtx.newPage();
  const allDiffs: Diff[] = [];
  const compDir = resolve(OUT_DIR, component);
  rmSync(compDir, { recursive: true, force: true });
  mkdirSync(compDir, { recursive: true });

  for (const entry of reactIds) {
    const story = entry.name;
    const ngEntry = ngEntries.get(entry.id);
    if (!ngEntry) {
      allDiffs.push({
        story,
        path: '/',
        kind: 'missing',
        react: entry.id,
        ng: null,
      });
      continue;
    }
    try {
      const [r, n] = await Promise.all([
        snapshotStory(reactPage, REACT_URL, entry.id),
        snapshotStory(ngPage, NG_URL, entry.id),
      ]);
      const storyDiffs: Diff[] = [];
      diffTree(story, '/', r, n, storyDiffs);
      writeFileSync(
        resolve(compDir, `${slug(story)}.react.json`),
        JSON.stringify(r, null, 2),
      );
      writeFileSync(
        resolve(compDir, `${slug(story)}.ng.json`),
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
        ng: String((e as Error).message),
      });
    }
  }

  // Detect Angular-only stories.
  const reactIdSet = new Set(reactIds.map((e) => e.id));
  for (const [id, e] of ngEntries) {
    if (!reactIdSet.has(id))
      allDiffs.push({
        story: e.name,
        path: '/',
        kind: 'extra',
        react: null,
        ng: id,
      });
  }

  await reactCtx.close();
  await ngCtx.close();

  // Source-level API parity (props/inputs/outputs) — runs once per component.
  // If either side has no single primary source file (e.g. meta-only React
  // dirs, multi-directive Angular folders), we silently skip API comparison.
  const apiResult = diffApi(pascalName);
  if (apiResult.reactFile && apiResult.ngFile) {
    for (const d of apiResult.diffs) {
      allDiffs.push({
        story: '__api__',
        path: `${d.kind}.${d.name}`,
        kind: d.kind,
        react: d.side === 'missing' ? 'present' : 'missing',
        ng: d.side === 'missing' ? 'missing' : 'present',
      });
    }
  }

  const suppressions = loadDeviations();
  const filtered = allDiffs.filter(
    (d) => !isSuppressed(suppressions, component, d.story, d.kind),
  );
  writeFileSync(
    resolve(compDir, 'report.txt'),
    renderReport(component, filtered),
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

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const target = args.find((a) => !a.startsWith('--'));
  if (!all && !target) {
    console.error(
      'Usage: npm run parity -- <component>   |   npm run parity:all',
    );
    process.exit(2);
  }

  if (all) rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });
  const [reactIndex, ngIndex] = await Promise.all([
    fetchIndex(REACT_URL),
    fetchIndex(NG_URL),
  ]);
  const reactByComp = groupByComponent(reactIndex);
  const ngByComp = groupByComponent(ngIndex);

  const components = all ? [...reactByComp.keys()].sort() : [target!];
  const browser = await chromium.launch();
  let totalDiffs = 0;
  const summary: { component: string; count: number }[] = [];
  for (const c of components) {
    const reactIds = reactByComp.get(c) ?? [];
    if (reactIds.length === 0) {
      console.log(`! ${c}: no React stories found, skipping`);
      continue;
    }
    const ngEntries = new Map(
      (ngByComp.get(c) ?? []).map((e) => [e.id, e] as const),
    );
    const pascalName = pascalNameForSlug(reactIds);
    const { diffs } = await runComponent(
      browser,
      c,
      pascalName,
      reactIds,
      ngEntries,
    );
    summary.push({ component: c, count: diffs.length });
    totalDiffs += diffs.length;
    console.log(
      `${diffs.length === 0 ? 'OK' : 'XX'} ${c}: ${diffs.length} diff(s)`,
    );
  }
  await browser.close();

  writeFileSync(
    resolve(OUT_DIR, 'summary.json'),
    JSON.stringify(summary, null, 2),
  );
  console.log(`\nTotal diffs: ${totalDiffs}`);
  process.exit(totalDiffs === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
