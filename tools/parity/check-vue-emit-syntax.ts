#!/usr/bin/env tsx
/**
 * Static check: every `defineEmits` in `packages/vue` is written in the
 * inline named-tuple form that the parity extractor can read.
 *
 * A malformed declaration extracts as *zero* emits, which is indistinguishable
 * from perfect output parity in the report — the most dangerous failure mode
 * the harness has. This check uses the very same parser as the extractor
 * (`parseDefineEmits`) so the two cannot disagree.
 *
 * Usage:  npx tsx tools/parity/check-vue-emit-syntax.ts
 */
import { readFileSync } from 'node:fs';
import { parseDefineEmits } from './api.ts';
// @ts-expect-error -- plain .mjs helper, no type declarations by design
import { report, vueRoot, walk } from './vue-fs.mjs';

const files: string[] = await walk(vueRoot, (n: string) => n.endsWith('.vue'));
const problems: { file: string; line?: number; reason: string }[] = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const { errors } = parseDefineEmits(src);

  for (const reason of errors) {
    problems.push({
      file,
      line: src.slice(0, src.indexOf('defineEmits')).split('\n').length,
      reason,
    });
  }
}

report('vue defineEmits syntax check', files.length, problems);
