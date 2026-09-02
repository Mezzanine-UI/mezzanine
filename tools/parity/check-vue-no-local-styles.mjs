#!/usr/bin/env node
/**
 * Static check: `packages/vue` ships no styles of its own.
 *
 * Styles are shared with React and Angular through `@mezzanine-ui/core`. A
 * local `<style>` block that happens to match core's output today produces
 * zero parity diff — and silently forks the design system tomorrow. That
 * invisibility is exactly why this needs its own check rather than relying
 * on the DOM/computed-style differ.
 *
 * Also flags inline style bindings carrying literal pixel/rem values or hex
 * colours, per the repo-wide "use design tokens" rule in CLAUDE.md.
 *
 * Usage:  node tools/parity/check-vue-no-local-styles.mjs
 */
import { readFileSync } from 'node:fs';
import { report, vueRoot, walk } from './vue-fs.mjs';

const files = await walk(vueRoot, (n) => n.endsWith('.vue'));
const problems = [];

const STYLE_BLOCK = /<style\b/gi;
const INLINE_STYLE = /(?::style|\bstyle)\s*=\s*(["'])([\s\S]*?)\1/g;
const LITERAL_VALUE = /(?:\b\d*\.?\d+(?:px|rem)\b|#[0-9a-fA-F]{3,8}\b)/;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const lineOf = (index) => src.slice(0, index).split('\n').length;

  for (const m of src.matchAll(STYLE_BLOCK)) {
    problems.push({
      file,
      line: lineOf(m.index),
      reason:
        '<style> block found. Vue components must not ship styles; class ' +
        'names come from `@mezzanine-ui/core/<component>`. If a Vue-only ' +
        'style is genuinely required, stop and ask the user first.',
    });
  }

  for (const m of src.matchAll(INLINE_STYLE)) {
    if (!LITERAL_VALUE.test(m[2])) continue;

    problems.push({
      file,
      line: lineOf(m.index),
      reason: `inline style carries a literal value: \`${m[2].slice(0, 60)}\`. Use core classes and design tokens.`,
    });
  }
}

report('vue local-style check', files.length, problems);
