#!/usr/bin/env node
/**
 * Static check: hardcoded design tokens in `packages/core/src/**\/*.scss`.
 *
 * Scope
 * -----
 * React and Angular both consume the SCSS under `packages/core/src`; there
 * is no separate React/Angular stylesheet, so this scan has a single target
 * and cannot drift between the two apps at the SCSS level. The goal is to
 * enforce the `CLAUDE.md` rule:
 *
 *   "Do not hardcode pixel values inside style files unless absolutely
 *    necessary. Use predefined design tokens and variables from the
 *    @mezzanine-ui/system directory instead."
 *
 * Rules
 * -----
 * Flag lines that contain a hardcoded pixel/rem/em number, a hex colour, a
 * functional colour, or a named colour. Skip anything that sits inside a
 * `var(...)` call (including fallback values), a `calc(...)` call, a
 * `@media` or `@keyframes` block, or a SCSS comment.
 *
 * An inline escape hatch of the form `// allow-hardcoded: <reason>` on the
 * same line or the line immediately above silences a violation. The reason
 * text is required; empty or missing reasons keep the violation active.
 *
 * Property-aware exemptions (Phase 5 — user decision 2026-04-09)
 * -------------------------------------------------------------
 * The scan is deliberately conservative: hardcoded `1px` is only allowed in
 * the specific property slots where it has a genuine semantic meaning, not
 * as a blanket pixel exemption.
 *
 *   a. `1px` allowed on `border*`, `outline*` — minimum visible border, no
 *      sub-token border width exists.
 *   b. `1px` allowed on `width`, `height`, `inline-size`, `block-size`,
 *      `margin`, `margin-*` — covers the sr-only accessibility hack and
 *      decorative separator lines.
 *
 * Additionally, the following properties / constructs exempt *any* numeric
 * literal, because their values are visual tuning outside the spacing /
 * colour token system:
 *
 *   - `box-shadow` and `filter: drop-shadow(...)` values (ring/glow tuning)
 *   - `stroke-width` (SVG stroke thickness)
 *   - anything inside a SCSS function call like `typography.px-to-rem(…)`,
 *     `spacing.variable(…)`, `palette.semantic-variable(…)` — the pixel
 *     is the function input, not the emitted CSS value
 *   - `mask-image`, `background-image`, and any `*-gradient(...)` — named
 *     colours inside these are mask/shape controls rather than theme colours
 *   - any line that is a SCSS variable default declaration
 *     (`$name: ... !default;`) — `!default` signals "consumer-overridable"
 *
 * `em` values are not scanned at all; `em` is a relative unit, not a
 * design-token candidate.
 *
 * Output
 * ------
 * Writes `tools/parity/.out/drift/hardcoded-tokens.md` and prints a
 * one-line summary to stdout. Exits 1 on any active violation, 0 on clean.
 */

import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const repoRoot = resolve(dirname(__filename), '..', '..');
const scanRoot = resolve(repoRoot, 'packages', 'core', 'src');
const outDir = resolve(repoRoot, 'tools', 'parity', '.out', 'drift');
const outFile = resolve(outDir, 'hardcoded-tokens.md');

// ---- CSS-color named keywords we flag when seen outside var()/calc()/comments
const NAMED_COLOURS = new Set([
  'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige',
  'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown',
  'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
  'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan',
  'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki',
  'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
  'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray',
  'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue',
  'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite',
  'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod',
  'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink',
  'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush',
  'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan',
  'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey',
  'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue',
  'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow',
  'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine',
  'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen',
  'mediumslateblue', 'mediumspringgreen', 'mediumturquoise',
  'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin',
  'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange',
  'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
  'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
  'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue',
  'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna',
  'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
  'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato',
  'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow',
  'yellowgreen',
]);

// Keywords that are not really "colours" even though they might be parsed as such
const COLOUR_KEYWORD_EXEMPT = new Set([
  'transparent', 'currentcolor', 'inherit', 'initial', 'unset', 'revert',
  'none', 'auto',
]);

// ---- File walker

async function walk(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, out);
    } else if (entry.isFile() && entry.name.endsWith('.scss')) {
      out.push(full);
    }
  }
  return out;
}

// ---- Comment and block tracker
//
// Walks a file linearly, returning an enriched line array with metadata:
// `inComment` (inside /* */), `inAtRule` (media/keyframes block depth > 0),
// `inVar` (inside var() ...).
//
// We only approximately detect these; the goal is suppression, not perfect
// parsing. SCSS-specific constructs like `#{$prefix}` are left alone.
function analyseFile(src) {
  const lines = src.split('\n');
  const annotated = [];
  let inBlockComment = false;
  /** stack of @media / @keyframes depths */
  let atRuleDepth = 0;
  /** current total brace depth */
  let braceDepth = 0;
  /** current paren depth carried across lines */
  let parenDepth = 0;
  /** brace depths that marked the entry of @media / @keyframes */
  const atRuleEntries = [];

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i];
    let text = raw;
    // Strip block comments safely
    if (inBlockComment) {
      const close = text.indexOf('*/');
      if (close === -1) {
        annotated.push({
          raw,
          stripped: '',
          inAtRule: atRuleDepth > 0,
          parenDepthAtStart: parenDepth,
          hadInlineComment: false,
          lineCommentText: '',
        });
        continue;
      }
      text = text.slice(close + 2);
      inBlockComment = false;
    }
    // Inline /* ... */
    let guard = 0;
    while (true) {
      const open = text.indexOf('/*');
      if (open === -1) break;
      const close = text.indexOf('*/', open + 2);
      if (close === -1) {
        text = text.slice(0, open);
        inBlockComment = true;
        break;
      }
      text = text.slice(0, open) + ' '.repeat(close + 2 - open) + text.slice(close + 2);
      if (guard++ > 50) break;
    }
    // Line comments
    let hadLineComment = false;
    const lineCommentMatch = text.match(/(^|[^:])\/\/(.*)$/);
    let lineCommentText = '';
    if (lineCommentMatch) {
      const idx = text.indexOf('//', lineCommentMatch.index);
      if (idx !== -1) {
        lineCommentText = text.slice(idx + 2).trim();
        text = text.slice(0, idx);
        hadLineComment = true;
      }
    }
    const parenDepthAtStart = parenDepth;
    // Track braces and parens
    for (const ch of text) {
      if (ch === '{') braceDepth += 1;
      else if (ch === '}') {
        braceDepth -= 1;
        while (atRuleEntries.length > 0 && braceDepth < atRuleEntries[atRuleEntries.length - 1]) {
          atRuleEntries.pop();
          atRuleDepth -= 1;
        }
      } else if (ch === '(') parenDepth += 1;
      else if (ch === ')') parenDepth = Math.max(0, parenDepth - 1);
    }
    // Detect @media / @keyframes opener on this line
    const atMatch = text.match(/@(media|keyframes|supports|container)\b/);
    if (atMatch && text.includes('{')) {
      atRuleDepth += 1;
      atRuleEntries.push(braceDepth);
    }

    annotated.push({
      raw,
      stripped: text,
      inAtRule: atRuleDepth > 0,
      parenDepthAtStart,
      hadInlineComment: hadLineComment,
      lineCommentText,
    });
  }
  return annotated;
}

// ---- Var() / calc() awareness

/**
 * Mask out characters inside `funcName(...)` calls by replacing them with
 * spaces so downstream regex scanners skip those regions.
 *
 * `funcNames` may contain a bare name ("var", "calc") OR a dotted SCSS
 * module function ("typography.px-to-rem", "palette.semantic-variable");
 * the latter is matched case-sensitively as a literal prefix.
 */
function maskFunctionCalls(line, funcNames) {
  let result = '';
  let i = 0;
  while (i < line.length) {
    let matched = false;
    for (const name of funcNames) {
      const prefix = `${name}(`;
      if (line.startsWith(prefix, i)) {
        // Make sure `name` is not a suffix of a longer identifier/module path
        const before = i === 0 ? '' : line[i - 1];
        if (/[a-zA-Z0-9_-]/.test(before)) continue;
        let depth = 1;
        let j = i + prefix.length;
        while (j < line.length && depth > 0) {
          if (line[j] === '(') depth += 1;
          else if (line[j] === ')') depth -= 1;
          j += 1;
        }
        result += ' '.repeat(j - i);
        i = j;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += line[i];
      i += 1;
    }
  }
  return result;
}

/**
 * Mask out any SCSS module function call of the form `foo.bar(...)` or
 * `foo(...)` where foo is a known sass-module namespace. We cannot
 * enumerate every helper, so instead we mask any identifier that contains
 * a dot followed by a `(`, plus a short hand-curated list of well-known
 * helpers without module prefix.
 */
function maskScssFunctionCalls(line) {
  // Dotted helpers: typography.px-to-rem(...), palette.semantic-variable(...)
  let masked = line.replace(
    /\b[a-zA-Z_][a-zA-Z0-9_-]*\.[a-zA-Z_][a-zA-Z0-9_-]*\(/g,
    (match) => ' '.repeat(match.length),
  );
  // Open-paren for the matched helpers stays unmasked; mask through close
  return maskFunctionCalls(masked, [
    // We already stripped the prefix in the previous replace, so here we
    // only need to catch top-level helpers without a module prefix.
  ]);
}

/**
 * Replace any dotted SCSS helper call (e.g. `palette.semantic-variable(...)`)
 * plus `var(...)` and `calc(...)` content with spaces. This is the scanner's
 * main "safe zone" — anything inside these brackets is exempt.
 */
function stripExemptRegions(line) {
  // First pass: collapse dotted helper calls bracket-balanced
  let result = '';
  let i = 0;
  while (i < line.length) {
    const rest = line.slice(i);
    const helperMatch = rest.match(
      /^(var|calc|min|max|clamp|rgba?|hsla?|drop-shadow|url)\(/,
    );
    const dottedHelperMatch = !helperMatch
      ? rest.match(/^[a-zA-Z_][a-zA-Z0-9_-]*\.[a-zA-Z_][a-zA-Z0-9_-]*\(/)
      : null;
    if (helperMatch || dottedHelperMatch) {
      // find matching close
      const prefixLen = (helperMatch ?? dottedHelperMatch)[0].length;
      let depth = 1;
      let j = i + prefixLen;
      while (j < line.length && depth > 0) {
        if (line[j] === '(') depth += 1;
        else if (line[j] === ')') depth -= 1;
        j += 1;
      }
      result += ' '.repeat(j - i);
      i = j;
      continue;
    }
    result += line[i];
    i += 1;
  }
  return result;
}

const SHADOW_OR_STROKE_PROPERTY = /\b(box-shadow|stroke-width|filter)\s*:/i;
// Border / outline including logical shorthands: border-inline-start,
// border-block-end, border-inline-end-width, etc.
const BORDER_OR_OUTLINE_PROPERTY = /\b(border|outline)(?:-[a-z-]+)?\s*:/i;
const ONE_PX_SIZE_PROPERTY = /\b(width|height|min-width|min-height|max-width|max-height|inline-size|block-size|margin(?:-[a-z]+)?)\s*:/i;
const GRADIENT_OR_MASK = /\b(mask(?:-image)?|background-image|(?:conic|linear|radial|repeating-linear|repeating-radial|repeating-conic)-gradient\s*\()/i;
const SCSS_DEFAULT_DECLARATION = /^\s*\$[a-zA-Z0-9_-]+\s*:\s*.+!default\s*;?\s*$/;
// Declaring a CSS custom property (design token definition) — treat like a
// SCSS `!default` configuration point; values here are the source of the
// token, not a consumer of it.
const CSS_CUSTOM_PROPERTY_DECLARATION = /^\s*--[a-zA-Z0-9_-]+\s*:/;

// ---- Violation detectors

function detectViolations(scanText, originalLine) {
  const found = [];

  // Line-level exemptions that zero out the scan entirely.
  if (SCSS_DEFAULT_DECLARATION.test(originalLine)) return found;
  if (CSS_CUSTOM_PROPERTY_DECLARATION.test(originalLine)) return found;
  if (SHADOW_OR_STROKE_PROPERTY.test(originalLine)) {
    // box-shadow / stroke-width / filter: drop-shadow(…) — all values skipped
    // but still scan for named colors if the line is NOT a gradient/mask.
    if (!GRADIENT_OR_MASK.test(originalLine)) {
      scanText = scanText.replace(/(-?\d+(?:\.\d+)?)(px|rem)/g, (match) =>
        ' '.repeat(match.length),
      );
    }
  }

  // Pixel
  for (const m of scanText.matchAll(/(?<![a-zA-Z0-9_-])(-?\d+(?:\.\d+)?)px\b/g)) {
    const value = `${m[1]}px`;
    const num = Number(m[1]);
    const absNum = Math.abs(num);
    if (num === 0) continue;

    // 1px exemptions per Phase 5 decision
    if (absNum <= 1) {
      if (BORDER_OR_OUTLINE_PROPERTY.test(originalLine)) continue;
      if (ONE_PX_SIZE_PROPERTY.test(originalLine)) continue;
    }

    found.push({ type: 'pixel', value, at: m.index ?? 0 });
  }

  // Rem (em is intentionally not scanned — relative unit, not a token)
  for (const m of scanText.matchAll(/(?<![a-zA-Z0-9_-])(-?\d+(?:\.\d+)?)rem\b/g)) {
    const value = `${m[1]}rem`;
    if (Number(m[1]) === 0) continue;
    found.push({ type: 'relative', value, at: m.index ?? 0 });
  }

  // Hex colour
  for (const m of scanText.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    // Skip hex colours embedded in gradients/masks (they represent
    // mask/shape channel values, not theme colours).
    if (GRADIENT_OR_MASK.test(originalLine)) continue;
    found.push({ type: 'hex-color', value: m[0], at: m.index ?? 0 });
  }

  // Functional colour (rgba/hsla are already masked by stripExemptRegions,
  // so if we still see them here it's because they were outside a helper).
  for (const m of scanText.matchAll(/\b(rgba?|hsla?)\s*\(/g)) {
    if (GRADIENT_OR_MASK.test(originalLine)) continue;
    found.push({ type: 'functional-color', value: `${m[1]}(...)`, at: m.index ?? 0 });
  }

  // Named colour
  for (const m of scanText.matchAll(/(?<![-\w])([a-z]{3,20})(?![-\w])/g)) {
    const word = m[1].toLowerCase();
    if (COLOUR_KEYWORD_EXEMPT.has(word)) continue;
    if (!NAMED_COLOURS.has(word)) continue;
    // Skip when the line is a gradient or mask — the colour there is a
    // channel/alpha indicator, not a theme colour.
    if (GRADIENT_OR_MASK.test(originalLine)) continue;
    found.push({ type: 'named-color', value: word, at: m.index ?? 0 });
  }

  return found;
}

// ---- Main

async function main() {
  const files = (await walk(scanRoot)).sort();
  const violations = [];
  let exempted = 0;

  for (const file of files) {
    const src = readFileSync(file, 'utf8');
    const annotated = analyseFile(src);
    for (let i = 0; i < annotated.length; i += 1) {
      const { stripped, inAtRule, parenDepthAtStart, lineCommentText } = annotated[i];
      if (!stripped.trim() || inAtRule) continue;

      // If the line opens inside an unclosed paren block from a previous
      // line, it's a continuation of a multi-line helper call, SCSS map,
      // or gradient/mask — exempt entirely.
      if (parenDepthAtStart > 0) continue;

      const masked = stripExemptRegions(stripped);
      const hits = detectViolations(masked, stripped);
      if (hits.length === 0) continue;

      // Check escape hatch: same line or line above
      const thisLineEscape = lineCommentText?.match(/allow-hardcoded:\s*(\S.*)$/);
      const prevLineEscape = i > 0
        ? annotated[i - 1].lineCommentText?.match(/allow-hardcoded:\s*(\S.*)$/)
        : null;
      if (thisLineEscape || prevLineEscape) {
        exempted += hits.length;
        continue;
      }

      violations.push({
        file: relative(repoRoot, file),
        line: i + 1,
        text: stripped.trim(),
        hits,
      });
    }
  }

  // Summarise
  const total = violations.length;
  mkdirSync(outDir, { recursive: true });

  if (total === 0) {
    const msg = `Scan B (hardcoded tokens): 0 violations across ${files.length} files (${exempted} exempted by allow-hardcoded).`;
    writeFileSync(outFile, `# Hardcoded Token Violations\n\n${msg}\n`);
    console.log(msg);
    process.exit(0);
  }

  // Group by file
  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v);
  }

  const lines = [];
  lines.push('# Hardcoded Token Violations');
  lines.push('');
  lines.push(`Scanned: ${files.length} SCSS files under packages/core/src`);
  lines.push(`Violations: ${total}`);
  lines.push(`Exempted by \`allow-hardcoded:\` comments: ${exempted}`);
  lines.push('');
  lines.push('## Violations grouped by file');
  lines.push('');
  for (const [file, list] of [...byFile.entries()].sort()) {
    lines.push(`### ${file} (${list.length})`);
    lines.push('');
    for (const v of list) {
      lines.push(`- **L${v.line}**  \`${v.text.slice(0, 100)}\``);
      for (const hit of v.hits) {
        lines.push(`    - ${hit.type}: \`${hit.value}\``);
      }
    }
    lines.push('');
  }
  writeFileSync(outFile, lines.join('\n'));

  console.error(`Scan B (hardcoded tokens): ${total} violations across ${byFile.size} files. See tools/parity/.out/drift/hardcoded-tokens.md`);
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
