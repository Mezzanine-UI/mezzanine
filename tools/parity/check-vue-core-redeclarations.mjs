#!/usr/bin/env node
/**
 * Static check: a Vue type that shadows a `@mezzanine-ui/core` type of the same
 * name must declare the same fields.
 *
 * `packages/core/src/table/table.ts` annotates six fields as `React.ReactNode`,
 * so `packages/vue/table/table.types.ts` re-declares the fourteen types that
 * carry them with `VNodeChild` instead. Re-declaring is the only way to express
 * those fields in Vue, but it also opens the door to silent drift: the Angular
 * port copied the whole surface by hand and `TableDraggable.fixed` quietly
 * became `fixedRowKeys`, which nothing caught because Angular's Table was never
 * run through the DOM harness either.
 *
 * The rule is therefore narrow and mechanical — for every name declared on both
 * sides, the own-body field names and the `extends` clause (or the alias's
 * right-hand side) must match exactly. Only the field *types* may differ, which
 * is the whole point of the re-declaration.
 *
 * Usage:  node tools/parity/check-vue-core-redeclarations.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { repoRoot, report, vueRoot, walk } from './vue-fs.mjs';

const coreRoot = resolve(repoRoot, 'packages', 'core', 'src');

const normalize = (text) => text.replace(/\s+/g, ' ').trim();

/**
 * Find the index just past the matching close brace for the `{` at `open`.
 * Skips over string literals so a brace inside one cannot end the body early.
 */
function matchBrace(text, open) {
  let depth = 0;
  let quote = null;

  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];

    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') quote = ch;
    else if (ch === '{') depth += 1;
    else if (ch === '}') {
      depth -= 1;

      if (depth === 0) return i;
    }
  }

  return -1;
}

/** Top-level field names of an interface body, ignoring nested object types. */
function fieldNames(body) {
  const names = [];
  let depthCurly = 0;
  let depthAngle = 0;
  let depthParen = 0;
  let atLineStart = true;

  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];

    if (atLineStart && depthCurly === 0 && depthAngle === 0 && depthParen === 0) {
      const match = body.slice(i).match(/^\s*([A-Za-z_$][\w$]*)\s*\??\s*[:(]/);

      if (match) names.push(match[1]);
    }

    if (ch === '{') depthCurly += 1;
    else if (ch === '}') depthCurly -= 1;
    else if (ch === '<') depthAngle += 1;
    else if (ch === '>') depthAngle -= 1;
    else if (ch === '(') depthParen += 1;
    else if (ch === ')') depthParen -= 1;

    atLineStart = ch === '\n' || ch === ';';
  }

  return [...new Set(names)].sort();
}

/**
 * Exported interfaces and type aliases of one source file, each reduced to the
 * two things this check compares.
 */
function declarations(file) {
  const text = readFileSync(file, 'utf8');
  const out = new Map();

  for (const match of text.matchAll(
    /^export\s+interface\s+([A-Za-z_$][\w$]*)([\s\S]*?)\{/gm,
  )) {
    const [, name, between] = match;
    const open = match.index + match[0].length - 1;
    const close = matchBrace(text, open);

    if (close === -1) continue;

    const extendsAt = between.indexOf('extends');

    out.set(name, {
      file,
      fields: fieldNames(text.slice(open + 1, close)),
      heritage: extendsAt === -1 ? '' : normalize(between.slice(extendsAt)),
      kind: 'interface',
    });
  }

  for (const match of text.matchAll(
    /^export\s+type\s+([A-Za-z_$][\w$]*)(?:<[\s\S]*?>)?\s*=([\s\S]*?);$/gm,
  )) {
    const [, name, rhs] = match;

    if (out.has(name)) continue;

    out.set(name, { file, fields: [], heritage: normalize(rhs), kind: 'alias' });
  }

  return out;
}

const coreFiles = await walk(coreRoot, (n) => n.endsWith('.ts'));
const vueFiles = await walk(vueRoot, (n) => n.endsWith('.types.ts'));

const core = new Map();

for (const file of coreFiles) {
  for (const [name, decl] of declarations(file)) {
    if (!core.has(name)) core.set(name, decl);
  }
}

const problems = [];

for (const file of vueFiles) {
  for (const [name, vue] of declarations(file)) {
    const shared = core.get(name);

    if (!shared) continue;

    if (vue.kind !== shared.kind) {
      problems.push({
        file,
        reason:
          `\`${name}\` is a ${vue.kind} here and a ${shared.kind} in ` +
          `${shared.file.replace(`${repoRoot}/`, '')}.`,
      });
      continue;
    }

    const missing = shared.fields.filter((f) => !vue.fields.includes(f));
    const extra = vue.fields.filter((f) => !shared.fields.includes(f));

    if (missing.length || extra.length) {
      problems.push({
        file,
        reason:
          `\`${name}\` re-declares a core type with a different field set — ` +
          `${missing.length ? `missing: ${missing.join(', ')}` : ''}` +
          `${missing.length && extra.length ? '; ' : ''}` +
          `${extra.length ? `extra: ${extra.join(', ')}` : ''}. ` +
          'Only the field types may differ.',
      });
    }

    if (vue.heritage !== shared.heritage) {
      problems.push({
        file,
        reason:
          `\`${name}\` re-declares a core type with a different ` +
          `${vue.kind === 'alias' ? 'right-hand side' : 'extends clause'}.\n` +
          `      core: ${shared.heritage || '(none)'}\n` +
          `      vue:  ${vue.heritage || '(none)'}`,
      });
    }
  }
}

report(
  'vue core re-declaration check',
  vueFiles.length,
  problems,
);
