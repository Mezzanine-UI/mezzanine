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
const REACT_ROOT = resolve(REPO_ROOT, 'packages/react/src');

function kebabToCamel(kebab) {
  // mzn-foo-bar → mznFooBar
  return kebab.replace(/-(\w)/g, (_, c) => c.toUpperCase());
}

function kebabToPascal(kebab) {
  // mzn-foo-bar → FooBar  (drop the mzn- prefix)
  return kebab
    .replace(/^mzn-/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Map a `HTMLXxxElement` interface name to its lowercase HTML tag.
 * Returns null when the interface is generic (HTMLElement) or unknown.
 */
const HTML_INTERFACE_TAG = {
  HTMLDivElement: 'div',
  HTMLSpanElement: 'span',
  HTMLAnchorElement: 'a',
  HTMLParagraphElement: 'p',
  HTMLButtonElement: 'button',
  HTMLUListElement: 'ul',
  HTMLOListElement: 'ol',
  HTMLDListElement: 'dl',
  HTMLLIElement: 'li',
  HTMLLabelElement: 'label',
  HTMLTableElement: 'table',
  HTMLTableSectionElement: 'tbody',
  HTMLTableRowElement: 'tr',
  HTMLTableCellElement: 'td',
  HTMLImageElement: 'img',
  HTMLInputElement: 'input',
  HTMLTextAreaElement: 'textarea',
  HTMLFormElement: 'form',
  HTMLFieldSetElement: 'fieldset',
  HTMLLegendElement: 'legend',
  HTMLSelectElement: 'select',
  HTMLOptionElement: 'option',
  HTMLHRElement: 'hr',
  HTMLBRElement: 'br',
  HTMLPreElement: 'pre',
  HTMLQuoteElement: 'blockquote',
  HTMLHeadingElement: 'h2',
};

/**
 * Look in packages/react/src/<PascalName>/<PascalName>.tsx for the
 * forwardRef<HTMLXxxElement, ...> generic and infer the tag.
 * Returns { tag, source } or null if no match.
 */
function detectReactRootTag(elementSelector) {
  const pascal = kebabToPascal(elementSelector);
  // Primary location: packages/react/src/<Pascal>/<Pascal>.tsx
  // Fallback: sub-component sitting under a parent folder, e.g.
  // Form/FormGroup.tsx, Card/CardGroup.tsx, Anchor/AnchorGroup.tsx.
  const candidates = [join(REACT_ROOT, pascal, `${pascal}.tsx`)];
  try {
    for (const parent of readdirSync(REACT_ROOT)) {
      if (!/^[A-Z]/.test(parent) || parent === pascal) continue;
      candidates.push(join(REACT_ROOT, parent, `${pascal}.tsx`));
    }
  } catch {
    // ignore
  }
  for (const path of candidates) {
    let text;
    try {
      text = readFileSync(path, 'utf-8');
    } catch {
      continue;
    }
    // Prefer the JSX root tag (the element the component actually renders
    // at its outermost position). Previously we preferred forwardRef's
    // HTMLXxxElement generic, but that points to whichever inner element
    // the `ref` is composed to, which in several components (checkbox,
    // formatted-input, radio) is a descendant, not the root.
    const ret = text.match(/return\s*\(\s*<([a-zA-Z][\w-]*)/);
    if (ret) {
      const tag = ret[1];
      if (/^[a-z]/.test(tag) && !['template', 'script'].includes(tag))
        return { tag, source: `${pascal}.tsx JSX root <${tag}>` };
    }
    // Fall back to forwardRef<HTMLXxxElement, ...> if JSX root is a
    // PascalCase component or Fragment that we can't match.
    const m = text.match(/forwardRef<\s*(HTML\w+Element)/);
    if (m && m[1] !== 'HTMLElement') {
      const iface = m[1];
      const tag = HTML_INTERFACE_TAG[iface];
      if (tag) return { tag, source: `${pascal}.tsx forwardRef<${iface}>` };
    }
  }
  return null;
}

/**
 * Parse `selector: '...'` from a component/directive source string.
 * Returns the first element-selector (not attribute, not class) or null.
 */
function parseElementSelector(source) {
  // Accept single quotes, double quotes, or template-literal backticks.
  // A file may declare multiple @Component blocks (e.g. autocomplete
  // has an existing [mznAutocompletePrefix] directive alongside a new
  // mzn-autocomplete component). Find the first ELEMENT-form selector,
  // skipping attribute or class selectors.
  const matches = [...source.matchAll(/selector:\s*['"`]([^'"`]+)['"`]/g)];
  for (const m of matches) {
    const raw = m[1];
    if (raw.startsWith('[') || raw.startsWith('.')) continue;
    if (raw.includes(',')) continue;
    return raw;
  }
  return null;
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
  // Angular templates sometimes break a closing tag across lines, e.g.
  //   >{{ foo }}</mzn-radio
  //   >
  // Allow whitespace (including newlines) between the tag name and the
  // trailing `>`.
  const closing = new RegExp(`</${tag}\\s*>`, 'gs');
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
/**
 * Remove one level of leading indentation from each non-empty line. Used
 * when collapsing an outer wrapper — the inner content was indented one
 * level deeper inside the wrapper, so we strip 2 spaces (Angular template
 * convention) per line.
 */
function dedent(block) {
  return block
    .split('\n')
    .map((l) => (l.startsWith('  ') ? l.slice(2) : l))
    .join('\n');
}

/**
 * Inject `'[class]': <expr>` into the @Component host metadata block.
 * Creates a fresh `host: { ... }` block if none exists. If a host block
 * exists with NO `[class]` binding, prepends one. If a host block exists
 * WITH a `[class]` binding, leaves it alone and warns.
 *
 * `apply` is a setter that receives the new full file text — done this way
 * to keep the call-site mutation explicit.
 */
function injectHostClassBinding(text, apply, classExpr, warnings) {
  const componentBlockRe = /@Component\(\{([\s\S]*?)\n\}\)/;
  const cm = text.match(componentBlockRe);
  if (!cm) {
    warnings.push('could not locate @Component({...}) for host class injection');
    return;
  }
  const meta = cm[1];
  const hostBlockRe = /host:\s*\{([^{}]*)\}/;
  const hm = meta.match(hostBlockRe);
  if (hm) {
    if (/\[class\]/.test(hm[1])) {
      warnings.push(
        'host already has [class] binding — leaving wrapper class alone',
      );
      return;
    }
    const newMeta = meta.replace(hostBlockRe, (_, body) => {
      const trimmed = body.trim();
      const lines = trimmed
        ? splitHostEntries(trimmed)
            .map((s) => `    ${s},`)
            .join('\n')
        : '';
      return `host: {\n    '[class]': ${quoteClassExpr(classExpr)},\n${lines}\n  }`;
    });
    apply(text.replace(componentBlockRe, `@Component({${newMeta}\n})`));
    return;
  }
  // No host block yet — inject right after selector.
  const newMeta = meta.replace(
    /(selector:\s*['"`][^'"`]*['"`]\s*,)/,
    `$1\n  host: {\n    '[class]': ${quoteClassExpr(classExpr)},\n  },`,
  );
  apply(text.replace(componentBlockRe, `@Component({${newMeta}\n})`));
}

/**
 * Split an Angular host metadata body into individual binding entries.
 * Cannot just split on `,` because string values can contain commas
 * (e.g. `'[attr.aria-label]': '"Calendar, " + view + " view"'`). Use a
 * tiny scanner that tracks string and bracket nesting and only treats
 * commas at depth 0 outside of strings as separators.
 */
function splitHostEntries(body) {
  const entries = [];
  let buf = '';
  let depth = 0;
  let inStr = null;
  let prev = '';
  for (const ch of body) {
    if (inStr) {
      buf += ch;
      if (ch === inStr && prev !== '\\') inStr = null;
      prev = ch;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      inStr = ch;
      buf += ch;
      prev = ch;
      continue;
    }
    if (ch === '(' || ch === '[' || ch === '{') depth += 1;
    if (ch === ')' || ch === ']' || ch === '}') depth -= 1;
    if (ch === ',' && depth === 0) {
      const t = buf.trim();
      if (t) entries.push(t);
      buf = '';
      prev = ch;
      continue;
    }
    buf += ch;
    prev = ch;
  }
  const tail = buf.trim();
  if (tail) entries.push(tail);
  return entries;
}

/**
 * Wrap a class expression as the value side of an Angular host binding:
 *   - bare identifier / call → as-is, single-quoted as a string expression
 *     so Angular evaluates it (e.g. `'statusClass'` → `statusClass`)
 *   - already quoted string literal → keep
 */
function quoteClassExpr(expr) {
  const trimmed = expr.trim();
  if (/^['"`].*['"`]$/.test(trimmed)) return trimmed;
  return `'${trimmed}'`;
}

function rewriteComponentFile(text, elementSelector, attrName) {
  const warnings = [];
  // 1. Selector.
  const selectorRe = new RegExp(
    `selector:\\s*['"\`]${elementSelector}['"\`]`,
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
      // Static `class="..."` (NOT `[class]`)
      const staticClassMatch = wrapperAttrs.match(
        /(?<!\[)class\s*=\s*['"]([^'"]*)['"]/,
      );
      // Dynamic `[class]="..."` only
      const dynamicClassMatch = wrapperAttrs.match(
        /\[class\]\s*=\s*"([^"]+)"/,
      );
      const hostClassBindingPresent =
        /host:\s*\{[\s\S]*?\[class\]/.test(next);
      const staticClassContainsSelector =
        staticClassMatch && staticClassMatch[1].includes(elementSelector);
      if (staticClassContainsSelector && !hostClassBindingPresent) {
        // Safe to collapse: move static class to host binding, drop wrapper.
        const newBody = `\n${dedent(inner)}\n  `;
        next = next.replace(templateRe, `template: \`${newBody}\``);
        injectHostClassBinding(
          next,
          (newText) => (next = newText),
          `'${staticClassMatch[1]}'`,
          warnings,
        );
        templateRewritten = true;
      } else if (
        dynamicClassMatch &&
        !hostClassBindingPresent &&
        !staticClassMatch /* skip if both static + dynamic — too risky */ &&
        // Refuse to collapse a wrapper that has any Angular directive
        // attribute on it (e.g. `mznBackdrop`, `mznPopper`, `*ngIf`,
        // `(event)`, `[property]` bindings other than [class]). These
        // wrappers are functional elements, not purely presentational,
        // and collapsing them would silently drop behavior.
        !/\s(?:mzn[A-Z]\w*|\*\w+|\(\w+\)|\[(?!class\])\w+\])/.test(
          wrapperAttrs,
        )
      ) {
        // Dynamic class wrapper. Move the expression to host '[class]' binding
        // and drop the wrapper. This matches the dropdown-status pattern.
        const expr = dynamicClassMatch[1];
        const newBody = `\n${dedent(inner)}\n  `;
        next = next.replace(templateRe, `template: \`${newBody}\``);
        injectHostClassBinding(
          next,
          (newText) => (next = newText),
          expr,
          warnings,
        );
        templateRewritten = true;
        warnings.push(
          `lifted dynamic [class]="${expr}" wrapper into host binding`,
        );
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

  // 3. Inject `[attr.X]: null` host bindings for every input() name.
  // After the selector switch the host becomes a real DOM element and any
  // static-string consumer attribute (e.g. title="..." / type="..."/ size="...")
  // is left on the element by the HTML parser. React strips these via
  // destructure + {...rest}; Angular has no equivalent, so we explicitly null
  // them out. Inputs that are bracket-bound stay as-is — `[attr.X]: null`
  // only affects the DOM attribute, not the @Input value.
  const inputNames = [
    ...next.matchAll(
      /\b(?:readonly\s+|protected\s+|public\s+|private\s+)*([a-zA-Z_$][\w$]*)\s*=\s*input(?:\.required)?\s*[<(]/g,
    ),
  ].map((m) => m[1]);
  if (inputNames.length > 0) {
    const componentBlockRe = /@Component\(\{([\s\S]*?)\n\}\)/;
    const cm = next.match(componentBlockRe);
    if (cm) {
      const meta = cm[1];
      const attrLines = inputNames
        .map((n) => `    '[attr.${n}]': 'null',`)
        .join('\n');
      // Match either multi-line `host: { ... \n  }` or single-line
      // `host: { '[class]': 'foo' }`. Capture body between first `{` and
      // its matching `}` non-greedily, then normalize to multi-line.
      const hostBlockRe = /host:\s*\{([^{}]*)\}/;
      if (hostBlockRe.test(meta)) {
        const newMeta = meta.replace(hostBlockRe, (_, body) => {
          const existing = body.trim();
          const present = new Set(
            [...existing.matchAll(/\[attr\.([\w$]+)\]/g)].map((m) => m[1]),
          );
          const filtered = inputNames.filter((n) => !present.has(n));
          const existingLines = existing
            ? splitHostEntries(existing)
                .map((s) => `    ${s},`)
                .join('\n')
            : '';
          const newLines = filtered
            .map((n) => `    '[attr.${n}]': 'null',`)
            .join('\n');
          const all = [existingLines, newLines].filter(Boolean).join('\n');
          return `host: {\n${all}\n  }`;
        });
        next = next.replace(componentBlockRe, `@Component({${newMeta}\n})`);
      } else {
        // Inject a fresh host block right after selector.
        const newMeta = meta.replace(
          /(selector:\s*['"`][^'"`]*['"`]\s*,)/,
          `$1\n  host: {\n${attrLines}\n  },`,
        );
        next = next.replace(componentBlockRe, `@Component({${newMeta}\n})`);
      }
    } else {
      warnings.push(
        'could not locate @Component({...}) block to inject [attr.X] bindings',
      );
    }
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
  let host = hostOverride;
  let hostSource = 'cli arg';
  if (!host) {
    const detected = detectReactRootTag(elementSelector);
    if (detected) {
      host = detected.tag;
      hostSource = detected.source;
      if (detected.unknown) {
        console.log(`  WARN: ${detected.source}`);
      }
    } else {
      host = 'div';
      hostSource = 'fallback (no React file found)';
      console.log(
        `  WARN: could not detect React root tag for ${elementSelector}; defaulting to <div>`,
      );
    }
  }

  console.log(
    `[${elementSelector}] → attribute [${attrName}], host=<${host}> (${hostSource})`,
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
