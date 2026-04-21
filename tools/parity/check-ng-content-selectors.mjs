#!/usr/bin/env node
/**
 * Static check: every `<ng-content select="mzn-xxx" />` in packages/ng must
 * resolve to a real element selector of a declared component. Catches the
 * Phase 3A class of bugs where templates used `select="mzn-navigation-header"`
 * while the sub-component was an attribute directive `[mznNavigationHeader]`.
 *
 * Attribute-form selectors (`select="[mznFoo]"`) are NOT checked: they are
 * frequently used as plain slot markers (`<div mznFoo>` without a backing
 * directive), which is a legitimate Angular content-projection pattern.
 *
 * Exits 0 on clean, 1 on any unresolved element selector.
 *
 * Usage:  node tools/parity/check-ng-content-selectors.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..', '..');

async function walk(dir, ignore = new Set(['node_modules', 'dist', '.git'])) {
  const { readdir } = await import('node:fs/promises');
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignore.has(entry.name)) continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full, ignore)));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      out.push(full);
    }
  }
  return out;
}

const files = await walk(resolve(repoRoot, 'packages', 'ng'));

// Pass 1: collect every declared selector from @Component / @Directive blocks.
const elementSelectors = new Set();
const attributeSelectors = new Set();
const SELECTOR_RE = /selector:\s*['"`]([^'"`]+)['"`]/g;

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let m;
  while ((m = SELECTOR_RE.exec(src)) !== null) {
    for (const raw of m[1].split(',')) {
      const sel = raw.trim();
      const attrMatch = sel.match(/^[a-zA-Z0-9-]*\[([a-zA-Z][a-zA-Z0-9]*)\]$/);
      if (attrMatch) {
        attributeSelectors.add(attrMatch[1]);
        continue;
      }
      const bareAttr = sel.match(/^\[([a-zA-Z][a-zA-Z0-9]*)\]$/);
      if (bareAttr) {
        attributeSelectors.add(bareAttr[1]);
        continue;
      }
      const elName = sel.match(/^([a-z][a-z0-9-]*)$/);
      if (elName) {
        elementSelectors.add(elName[1]);
      }
    }
  }
}

// Pass 2: find every `<ng-content select="..." />` and validate selectors.
const NG_CONTENT_RE = /<ng-content\b[^>]*\bselect\s*=\s*["']([^"']+)["']/g;
const problems = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  let m;
  while ((m = NG_CONTENT_RE.exec(src)) !== null) {
    const raw = m[1];
    const line = src.slice(0, m.index).split('\n').length;
    for (const piece of raw.split(',')) {
      const sel = piece.trim();
      if (!sel) continue;
      if (!/mzn/i.test(sel)) continue;

      // Attribute-form selectors are treated as plain slot markers and skipped.
      if (/^\[[a-zA-Z][a-zA-Z0-9]*\]$/.test(sel)) continue;
      const elName = sel.match(/^([a-z][a-z0-9-]*)$/);
      if (elName) {
        if (!elementSelectors.has(elName[1])) {
          problems.push({
            file,
            line,
            selector: sel,
            reason: `element selector "${elName[1]}" not found — did you mean the attribute form?`,
          });
        }
        continue;
      }
    }
  }
}

if (problems.length === 0) {
  console.log(
    `ng-content selector check: ${files.length} files scanned, 0 problems.`,
  );
  process.exit(0);
}

console.error(`ng-content selector check: ${problems.length} problem(s):\n`);
for (const p of problems) {
  const rel = p.file.replace(repoRoot + '/', '');
  console.error(`  ${rel}:${p.line}  select="${p.selector}"`);
  console.error(`    ${p.reason}\n`);
}
process.exit(1);
