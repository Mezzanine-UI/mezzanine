#!/usr/bin/env node
/**
 * Static check: no unbalanced HTML tags inside `<script>` comments of a Vue SFC.
 *
 * The SFC tokenizer does not fully ignore markup inside script comments. An
 * unbalanced tag there — `onto the inner <span>, not the container <div>` in a
 * JSDoc block, say — can make the whole file fail to parse, and the compiler
 * reports it as:
 *
 *     Element is missing end tag.  <file>.vue:<lastLine + 1>:<column>
 *
 * pointing at end-of-file rather than at the comment. Worse, whether it
 * triggers depends on what else the file contains, so an identical comment can
 * be harmless in one component and fatal in the next. `@vue/compiler-sfc`'s own
 * `parse()` does not report it either, so this cannot be caught by parsing.
 *
 * Balanced markup is fine — that is what `@example` blocks are made of. Write
 * incidental element mentions without angle brackets.
 *
 * Usage:  node tools/parity/check-vue-comment-tags.mjs
 */
import { readFileSync } from 'node:fs';
import { report, vueRoot, walk } from './vue-fs.mjs';

/** Elements that never carry an end tag. */
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
  'param',
  'source',
  'track',
  'wbr',
]);

const TAG = /<(\/?)([a-zA-Z][\w.-]*)\b[^>]*?(\/?)>/g;

/**
 * Whether a match is a TypeScript generic rather than markup.
 *
 * A generic welds the `<` to an identifier — `Record<string, any>`,
 * `Meta<typeof MznIcon>` — while an element mentioned in prose does not.
 * The test applies to *opening* tags only: `</Name>` is never a generic, and
 * a closing tag frequently follows text directly, as in
 * `<MznAnchor href="#a">ACR 1</MznAnchor>`.
 */
function isGeneric(text, index, isClosing) {
  if (isClosing) return false;

  const before = text[index - 1];

  return !!before && /[A-Za-z0-9_$]/.test(before);
}
const BLOCK_COMMENT = /\/\*[\s\S]*?\*\//g;
const LINE_COMMENT = /\/\/[^\n]*/g;

/** Extract every `<script …>…</script>` body by index, tolerating broken files. */
function scriptBodies(src) {
  const bodies = [];
  let cursor = 0;

  for (;;) {
    const open = src.indexOf('<script', cursor);

    if (open < 0) break;

    const openEnd = src.indexOf('>', open);

    if (openEnd < 0) break;

    // `<\/script>` is the conventional escape used inside example blocks and
    // must not be mistaken for the real closing tag.
    const close = src.indexOf('</script>', openEnd);

    if (close < 0) break;

    bodies.push({ text: src.slice(openEnd + 1, close), offset: openEnd + 1 });
    cursor = close + '</script>'.length;
  }

  return bodies;
}

function unbalancedTags(comment) {
  // Treat the `<\/tag>` escape as the closing tag it stands for.
  const normalized = comment.replace(/<\\\//g, '</');
  const stack = [];
  const problems = [];

  for (const match of normalized.matchAll(TAG)) {
    const [, slash, name, selfClose] = match;

    if (isGeneric(normalized, match.index, !!slash)) continue;
    if (VOID_ELEMENTS.has(name.toLowerCase()) || selfClose) continue;

    if (slash) {
      const last = stack.pop();

      if (last !== name) problems.push(`unexpected </${name}>`);
    } else {
      stack.push(name);
    }
  }

  for (const name of stack) problems.push(`unclosed <${name}>`);

  return problems;
}

const files = await walk(vueRoot, (n) => n.endsWith('.vue'));
const problems = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');

  for (const body of scriptBodies(src)) {
    const comments = [
      ...body.text.matchAll(BLOCK_COMMENT),
      ...body.text.matchAll(LINE_COMMENT),
    ];

    for (const match of comments) {
      const found = unbalancedTags(match[0]);

      if (found.length === 0) continue;

      problems.push({
        file,
        line: src.slice(0, body.offset + match.index).split('\n').length,
        reason:
          `${found.join(', ')} in a script comment. Unbalanced markup here can ` +
          'break SFC parsing with an end-of-file "Element is missing end tag" ' +
          'error. Write element names without angle brackets.',
      });
    }
  }
}

report('vue script-comment tag check', files.length, problems);
