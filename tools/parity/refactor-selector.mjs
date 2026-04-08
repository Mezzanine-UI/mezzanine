#!/usr/bin/env node
// @ts-check
/**
 * Convert an Angular `@Component({ selector: 'mzn-xxx' })` to an
 * attribute-selector form `@Component({ selector: '[mznXxx]' })`,
 * rewrite its template to drop any outer wrapper, and update every
 * consumer file across packages/ng from `<mzn-xxx>` / `<mzn-xxx />`
 * to `<host mznXxx>` / `<host mznXxx></host>`.
 *
 * Usage:
 *   node tools/parity/refactor-selector.mjs <component-file.ts> [host-tag]
 *
 *   node tools/parity/refactor-selector.mjs packages/ng/layout/layout.component.ts
 *   node tools/parity/refactor-selector.mjs packages/ng/tag/tag.component.ts span
 *
 * The script is conservative: if the template can't be rewritten safely
 * (complex outer wrapper, conditional root, etc.) it prints a WARN and
 * leaves the template alone so the human can fix it by hand.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';

const REPO_ROOT = resolve(process.cwd());
const NG_ROOT = resolve(REPO_ROOT, 'packages/ng');

function kebabToCamel(kebab) {
  // mzn-foo-bar → mznFooBar
  return kebab.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}

/**
 * Parse `selector: '...'` from a component/directive source string.
 * Returns the first element-selector (not attribute, not class) or null.
 */
function parseElementSelector(source) {
  const m = source.match(/selector:\s*['"]([^'"]+)['"]/);
  if (!m) return null;
  const raw = m[1];
  if (raw.startsWith('[') || raw.startsWith('.')) return null;
  // Single-selector (no comma) only for this script's scope.
  if (raw.includes(',')) return null;
  return raw;
}

/**
 * Find all .ts / .html files under packages/ng (excluding spec / stories
 * / .d.ts / .js / dist) that mention the given element tag.
 */
function findConsumerFiles(tag) {
  const opening = `<${tag}`;
  const closing = `</${tag}>`;
  const results = [];
  const walk = (dir) => {
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === 'dist' || entry.startsWith('.'))
        continue;
      const full = join(dir, entry);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.(ts|html)$/.test(full)) continue;
      if (/\.(d\.ts|spec\.ts)$/.test(full)) continue;
      const text = readFileSync(full, 'utf-8');
      if (text.includes(opening) || text.includes(closing)) {
        results.push(full);
      }
    }
  };
  walk(NG_ROOT);
  return results;
}

/**
 * Replace `<tag ...>` / `</tag>` / `<tag ... />` occurrences in the given
 * text with `<host attr ...>` / `</host>` / `<host attr ...></host>`.
 * Handles multi-line self-closing via non-greedy regex with `s` flag.
 */
const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
]);

function rewriteConsumerText(text, tag, host, attr) {
  const isVoid = VOID_ELEMENTS.has(host);
  // Boundary: tag must NOT be followed by another tag-name character
  // (letter / digit / hyphen), otherwise `mzn-empty` would match
  // `mzn-empty-main-icon`. Use a negative lookahead instead of `\b`.
  const boundary = `(?![-\\w])`;
  // Multi-line self-closing first (non-greedy inside).
  const selfClose = new RegExp(`<${tag}${boundary}([^>]*?)/>`, 'gs');
  let out = text.replace(
    selfClose,
    isVoid ? `<${host} ${attr}$1 />` : `<${host} ${attr}$1></${host}>`,
  );
  // Opening tag `<tag attrs>content</tag>`.
  const opening = new RegExp(`<${tag}${boundary}`, 'g');
  out = out.replace(opening, `<${host} ${attr}`);
  // Closing tag (only emit if host is not void).
  const closing = new RegExp(`</${tag}>`, 'g');
  out = out.replace(closing, isVoid ? '' : `</${host}>`);
  return out;
}

/**
 * Rewrite the component file itself:
 *   - selector: 'mzn-x'  →  selector: '[mznX]'
 *   - template outer `<div class="mzn-x">...</div>` wrapper collapsed
 *     (moved to host class binding) if detectable.
 *
 * Returns { text, templateRewritten, warnings }.
 */
function rewriteComponentFile(text, elementSelector, attrName) {
  const warnings = [];
  // 1. Selector.
  const selectorRe = new RegExp(
    `selector:\\s*['"]${elementSelector}['"]`,
  );
  if (!selectorRe.test(text)) {
    warnings.push('selector string not found');
    return { text, templateRewritten: false, warnings };
  }
  let next = text.replace(selectorRe, `selector: '[${attrName}]'`);

  // 2. Template outer wrapper collapse.
  // Look for `template: \`\\n  <div class="${elementSelector}">...</div>\\n\``
  // and similar patterns. Very conservative: only collapse if the outer
  // element is a single <div> / <span> / etc. with class attribute that
  // contains the element selector, and it wraps the entire template.
  const templateRe = /template:\s*`([\s\S]*?)`/;
  const tm = next.match(templateRe);
  let templateRewritten = false;
  if (tm) {
    const body = tm[1];
    const trimmed = body.trim();
    const wrapperRe = new RegExp(
      `^<(div|span|section|nav|header|footer|ul|ol|dl|a)\\b([^>]*)>([\\s\\S]*)</\\1>$`,
    );
    const wm = trimmed.match(wrapperRe);
    if (wm) {
      const [, wrapperTag, wrapperAttrs, inner] = wm;
      const classMatch = wrapperAttrs.match(
        /\[?class\]?\s*=\s*['"]([^'"]*)['"]/,
      );
      const hostClassBindingPresent =
        /host:\s*\{[\s\S]*?\[class\]/.test(next);
      const staticClassContainsSelector =
        classMatch && classMatch[1].includes(elementSelector);
      if (staticClassContainsSelector && !hostClassBindingPresent) {
        // Safe to collapse: move class to host binding, drop wrapper.
        const newBody = `\n${inner
          .split('\n')
          .map((l) => (l.length ? `  ${l}` : l))
          .join('\n')}\n  `;
        next = next.replace(templateRe, `template: \`${newBody}\``);
        // Inject host class binding into @Component metadata.
        const componentBlockRe = /@Component\(\{([\s\S]*?)\}\)/;
        const cm = next.match(componentBlockRe);
        if (cm) {
          const meta = cm[1];
          if (!/host:\s*\{/.test(meta)) {
            const injected = meta.replace(
              /(selector:\s*'[^']*'\s*,)/,
              `$1\n  host: {\n    '[class]': \`'${classMatch[1]}'\`,\n  },`,
            );
            next = next.replace(componentBlockRe, `@Component({${injected}})`);
          } else {
            warnings.push(
              'existing host metadata — host class binding not auto-injected; add manually',
            );
          }
        }
        templateRewritten = true;
      } else if (hostClassBindingPresent) {
        warnings.push(
          'host class binding already present — leaving template alone',
        );
      } else {
        warnings.push(
          'wrapper element class does not match selector — leaving template alone',
        );
      }
    } else {
      warnings.push('template root is not a single wrapper element');
    }
  } else {
    warnings.push('no template literal found');
  }

  return { text: next, templateRewritten, warnings };
}

function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error(
      'Usage: node tools/parity/refactor-selector.mjs <component-file.ts> [host-tag]',
    );
    process.exit(2);
  }
  const file = resolve(args[0]);
  const hostOverride = args[1];

  const src = readFileSync(file, 'utf-8');
  const elementSelector = parseElementSelector(src);
  if (!elementSelector) {
    console.error(
      `! ${relative(REPO_ROOT, file)}: no single element selector found`,
    );
    process.exit(1);
  }
  if (!elementSelector.startsWith('mzn-')) {
    console.error(
      `! ${relative(REPO_ROOT, file)}: selector '${elementSelector}' does not start with mzn-`,
    );
    process.exit(1);
  }

  const attrName = kebabToCamel(elementSelector);
  const host = hostOverride ?? 'div';

  console.log(
    `[${elementSelector}] → attribute [${attrName}], host=<${host}>`,
  );

  // 1. Rewrite the component file.
  const { text: newSrc, templateRewritten, warnings } = rewriteComponentFile(
    src,
    elementSelector,
    attrName,
  );
  for (const w of warnings) console.log(`  WARN: ${w}`);
  writeFileSync(file, newSrc);
  console.log(
    `  component file: selector rewritten${templateRewritten ? ', template collapsed' : ''}`,
  );

  // 2. Rewrite consumers.
  const consumers = findConsumerFiles(elementSelector);
  let updated = 0;
  for (const consumer of consumers) {
    const before = readFileSync(consumer, 'utf-8');
    const after = rewriteConsumerText(before, elementSelector, host, attrName);
    if (after !== before) {
      writeFileSync(consumer, after);
      updated += 1;
    }
  }
  console.log(`  consumers: ${updated}/${consumers.length} files updated`);
}

main();
