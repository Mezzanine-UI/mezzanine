#!/usr/bin/env tsx
/**
 * Static check: components have a single root element, or bind `$attrs`
 * explicitly.
 *
 * With multiple roots Vue cannot decide where fallthrough attributes belong,
 * so consumer-supplied `class` / `style` are dropped **silently**. React
 * spreads `className` onto its single root, so the resulting missing class
 * shows up in the diff as a styling mistake rather than as the structural
 * problem it actually is. Angular's single host element made this impossible;
 * Vue needs the check.
 *
 * Usage:  npx tsx tools/parity/check-vue-single-root.ts
 */
import { readFileSync } from 'node:fs';
import { parse } from '@vue/compiler-sfc';
// @ts-expect-error -- plain .mjs helper, no type declarations by design
import { report, vueRoot, walk } from './vue-fs.mjs';

type AstNode = { type: number; tag?: string; content?: string };

const ELEMENT = 1;
const TEXT = 2;

const files: string[] = await walk(vueRoot, (n: string) => n.endsWith('.vue'));
const problems: { file: string; line?: number; reason: string }[] = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const { descriptor } = parse(src, { filename: file });
  const ast = descriptor.template?.ast as unknown as
    | { children?: AstNode[] }
    | undefined;

  if (!ast) continue;

  const roots = (ast.children ?? []).filter(
    (n) => n.type === ELEMENT || (n.type === TEXT && (n.content ?? '').trim()),
  );

  if (roots.length <= 1) continue;
  if (/v-bind\s*=\s*(["'])\$attrs\1/.test(descriptor.template?.content ?? '')) {
    continue;
  }

  problems.push({
    file,
    line: descriptor.template?.loc.start.line,
    reason:
      `${roots.length} root nodes and no explicit \`v-bind="$attrs"\`. ` +
      'Fallthrough class/style will be dropped silently. Use a single root ' +
      'element (React spreads className onto one root) or bind $attrs.',
  });
}

report('vue single-root check', files.length, problems);
