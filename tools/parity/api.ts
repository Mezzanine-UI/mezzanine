import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REACT_ROOT = resolve(process.cwd(), 'packages/react/src');
const NG_ROOT = resolve(process.cwd(), 'packages/ng');

export type ApiSet = {
  inputs: Set<string>;
  outputs: Set<string>;
};

export type ApiDiff = {
  kind: 'input' | 'output';
  side: 'missing' | 'extra';
  name: string;
};

/** PascalCase → kebab-case (`ButtonGroup` → `button-group`). */
function kebab(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

/** Singularize a kebab name (`inline-messages` → `inline-message`). */
function singular(k: string): string {
  if (k.endsWith('ies')) return `${k.slice(0, -3)}y`;
  if (k.endsWith('s') && !k.endsWith('ss')) return k.slice(0, -1);
  return k;
}

function findFile(
  root: string,
  predicate: (full: string) => boolean,
): string | null {
  if (!existsSync(root)) return null;
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
      const found = findFile(full, predicate);
      if (found) return found;
    } else if (predicate(full)) {
      return full;
    }
  }
  return null;
}

export function locateReactFile(pascalName: string): string | null {
  const candidates = [pascalName, `${pascalName}Manager`];
  if (pascalName.endsWith('s')) candidates.push(pascalName.slice(0, -1));
  for (const name of candidates) {
    const found = findFile(
      REACT_ROOT,
      (f) =>
        f.endsWith(`/${name}.tsx`) &&
        !f.endsWith('.spec.tsx') &&
        !f.endsWith('.stories.tsx'),
    );
    if (found) return found;
  }
  return null;
}

export function locateAngularFile(pascalName: string): string | null {
  const k = kebab(pascalName);
  const candidates = [k, k.replace(/-/g, ''), `${k}s`, singular(k)];
  for (const name of candidates) {
    const found = findFile(
      NG_ROOT,
      (f) =>
        (f.endsWith(`/${name}.component.ts`) ||
          f.endsWith(`/${name}.directive.ts`)) &&
        !f.endsWith('.spec.ts') &&
        !f.endsWith('.d.ts'),
    );
    if (found) return found;
  }
  return null;
}

const SKIP_PROP_NAMES = new Set([
  'children',
  'className',
  'classes',
  'ref',
  'key',
  'style',
  // Content projection slots — Angular uses `<ng-content select="[prefix]">`
  // and `<ng-content select="[suffix]">` instead of React's ReactNode props.
  // Not representable as signal inputs, so not counted as parity diffs.
  'prefix',
  'suffix',
]);

/**
 * Skip React props that represent ref forwarding (e.g. `calendarRef`,
 * `inputLeftRef`). Angular's idiomatic pattern for this is `@ViewChild` +
 * template reference variable (`#picker="mznDateTimePicker"`), not a prop,
 * so these have no input equivalent and should not be counted as diffs.
 */
function isRefProp(name: string): boolean {
  return name.length > 3 && name.endsWith('Ref');
}

/**
 * Interface names that represent HTML attribute pass-through — treated
 * as empty so extends chains bottom out cleanly without pulling in every
 * HTML attr. Matched by prefix.
 */
const HTML_PASSTHROUGH_PREFIXES = [
  'HTMLAttributes',
  'DetailedHTMLProps',
  'ComponentProps',
  'ComponentPropsWithoutRef',
  'ComponentPropsWithRef',
  'PropsWithChildren',
  'PropsWithRef',
  'NativeElementProps',
  'NativeElementPropsWithoutKeyAndRef',
  'ForwardRefExoticComponent',
  'RefAttributes',
  'AriaAttributes',
];

function isHtmlPassthrough(name: string): boolean {
  return HTML_PASSTHROUGH_PREFIXES.some((p) => name.startsWith(p));
}

type InterfaceEntry = {
  kind: 'interface';
  file: string;
  extendsClause: string | null;
  body: string;
};

type TypeAliasEntry = {
  kind: 'alias';
  file: string;
  /** Right-hand side of the `type X = RHS;` declaration (trimmed, no trailing `;`). */
  rhs: string;
};

type IndexEntry = InterfaceEntry | TypeAliasEntry;

let interfaceIndex: Map<string, IndexEntry> | null = null;

/**
 * Build a repo-wide index of TypeScript type declarations. We scan source
 * files under packages/react/src and capture two things:
 *
 * 1. `interface Name [extends ...] { ... }` → InterfaceEntry
 * 2. `type Name [<T>] = RHS;`                → TypeAliasEntry
 *
 * Type aliases are essential for resolving props like
 * `TextFieldProps = TextFieldBaseProps & TextFieldAffixProps & TextFieldInteractiveStateProps;`
 * where the "real" props live inside multiple intersected parents.
 */
function buildInterfaceIndex(): Map<string, IndexEntry> {
  const index = new Map<string, IndexEntry>();

  const walk = (dir: string): void => {
    let entries: string[] = [];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue;
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
      if (!full.endsWith('.ts') && !full.endsWith('.tsx')) continue;
      if (full.endsWith('.spec.ts') || full.endsWith('.spec.tsx')) continue;
      if (full.endsWith('.stories.tsx')) continue;

      const text = readFileSync(full, 'utf-8');

      // --- Interfaces --------------------------------------------------------
      const interfacePattern =
        /(?:export\s+)?interface\s+(\w+)(?:<[^>]*>)?\s*(?:extends\s+([^{]+?))?\s*\{/g;
      for (const match of text.matchAll(interfacePattern)) {
        const name = match[1];
        const extendsClause = match[2] ? match[2].trim() : null;
        const headerEnd = (match.index ?? 0) + match[0].length;
        let depth = 1;
        let i = headerEnd;
        while (i < text.length && depth > 0) {
          const ch = text[i];
          if (ch === '{') depth += 1;
          else if (ch === '}') depth -= 1;
          i += 1;
        }
        const body = text.slice(headerEnd, i - 1);
        if (!index.has(name)) {
          index.set(name, {
            kind: 'interface',
            file: full,
            extendsClause,
            body,
          });
        }
      }

      // --- Type aliases ------------------------------------------------------
      // Greedy match up to the first top-level `;` — we track paren/bracket
      // depth so nested objects and generics don't terminate early.
      const aliasHeaderPattern =
        /(?:export\s+)?type\s+(\w+)(?:<[^>]*>)?\s*=\s*/g;
      for (const match of text.matchAll(aliasHeaderPattern)) {
        const name = match[1];
        if (index.has(name)) continue; // interface wins if both exist
        const rhsStart = (match.index ?? 0) + match[0].length;
        // Scan forward until a top-level `;` respecting `{}`, `<>`, `()`, `[]`.
        let depthCurly = 0;
        let depthAngle = 0;
        let depthParen = 0;
        let depthBracket = 0;
        let i = rhsStart;
        while (i < text.length) {
          const ch = text[i];
          if (ch === '{') depthCurly += 1;
          else if (ch === '}') depthCurly -= 1;
          else if (ch === '<') depthAngle += 1;
          else if (ch === '>') depthAngle -= 1;
          else if (ch === '(') depthParen += 1;
          else if (ch === ')') depthParen -= 1;
          else if (ch === '[') depthBracket += 1;
          else if (ch === ']') depthBracket -= 1;
          else if (
            ch === ';' &&
            depthCurly === 0 &&
            depthAngle === 0 &&
            depthParen === 0 &&
            depthBracket === 0
          ) {
            break;
          }
          i += 1;
        }
        const rhs = text.slice(rhsStart, i).trim();
        if (rhs) {
          index.set(name, { kind: 'alias', file: full, rhs });
        }
      }
    }
  };

  walk(REACT_ROOT);
  return index;
}

function getInterfaceIndex(): Map<string, IndexEntry> {
  if (!interfaceIndex) interfaceIndex = buildInterfaceIndex();
  return interfaceIndex;
}

type ParentRef = {
  name: string;
  omit?: Set<string>;
  pick?: Set<string>;
};

/**
 * Parse an `extends` clause into parent refs. Supports plain `X`,
 * `Omit<X, 'a' | 'b'>`, and `Pick<X, 'a'>` forms. Unknown constructs
 * are silently skipped.
 */
function parseExtends(clause: string): ParentRef[] {
  const out: ParentRef[] = [];
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < clause.length; i += 1) {
    const ch = clause[i];
    if (ch === '<') depth += 1;
    else if (ch === '>') depth -= 1;
    else if (ch === ',' && depth === 0) {
      parts.push(clause.slice(start, i).trim());
      start = i + 1;
    }
  }
  parts.push(clause.slice(start).trim());

  for (const p of parts) {
    if (!p) continue;
    const omitMatch = p.match(
      /^Omit\s*<\s*([\w.]+)(?:<[^>]*>)?\s*,\s*([^>]+)>$/,
    );
    if (omitMatch) {
      const keys = new Set(
        omitMatch[2]
          .split('|')
          .map((k) => k.trim().replace(/^['"`]|['"`]$/g, '')),
      );
      out.push({ name: omitMatch[1], omit: keys });
      continue;
    }
    const pickMatch = p.match(
      /^Pick\s*<\s*([\w.]+)(?:<[^>]*>)?\s*,\s*([^>]+)>$/,
    );
    if (pickMatch) {
      const keys = new Set(
        pickMatch[2]
          .split('|')
          .map((k) => k.trim().replace(/^['"`]|['"`]$/g, '')),
      );
      out.push({ name: pickMatch[1], pick: keys });
      continue;
    }
    const plain = p.match(/^(\w+)(?:<[^>]*>)?$/);
    if (plain) out.push({ name: plain[1] });
  }
  return out;
}

function extractBodyProps(body: string): ApiSet {
  const inputs = new Set<string>();
  const outputs = new Set<string>();
  let bd = 0;
  for (const line of body.split('\n')) {
    const trimmed = line.replace(/\/\/.*$/, '').trim();
    for (const ch of trimmed) {
      if (ch === '{') bd += 1;
      else if (ch === '}') bd -= 1;
    }
    if (bd !== 0 && !trimmed.endsWith('{')) continue;
    const m = trimmed.match(/^(\w+)\??\s*:/);
    if (!m) continue;
    const name = m[1];
    if (SKIP_PROP_NAMES.has(name)) continue;
    if (isRefProp(name)) continue;
    if (
      name.startsWith('on') &&
      name.length > 2 &&
      name[2] === name[2].toUpperCase()
    ) {
      outputs.add(name[2].toLowerCase() + name.slice(3));
    } else {
      inputs.add(name);
    }
  }
  return { inputs, outputs };
}

/**
 * Split a type-alias RHS expression into top-level operands at the given
 * operator (`&` for intersections, `|` for unions), respecting nested
 * `<>`, `()`, `{}`, `[]` depths.
 */
function splitTopLevel(expr: string, operator: '&' | '|'): string[] {
  const out: string[] = [];
  let depthAngle = 0;
  let depthParen = 0;
  let depthCurly = 0;
  let depthBracket = 0;
  let start = 0;
  for (let i = 0; i < expr.length; i += 1) {
    const ch = expr[i];
    if (ch === '<') depthAngle += 1;
    else if (ch === '>') depthAngle -= 1;
    else if (ch === '(') depthParen += 1;
    else if (ch === ')') depthParen -= 1;
    else if (ch === '{') depthCurly += 1;
    else if (ch === '}') depthCurly -= 1;
    else if (ch === '[') depthBracket += 1;
    else if (ch === ']') depthBracket -= 1;
    else if (
      ch === operator &&
      depthAngle === 0 &&
      depthParen === 0 &&
      depthCurly === 0 &&
      depthBracket === 0
    ) {
      // Reject `&&` / `||` (expression operators, shouldn't appear in types
      // but just in case) and compound assignment tokens.
      if (expr[i + 1] === operator) {
        i += 1;
        continue;
      }
      out.push(expr.slice(start, i).trim());
      start = i + 1;
    }
  }
  out.push(expr.slice(start).trim());
  return out.filter((p) => p.length > 0);
}

/**
 * Resolve a type-alias RHS expression to its full prop set. The expression
 * may be a plain reference (`X`), a generic reference (`X<T>`), an
 * `Omit<X, ...>` / `Pick<X, ...>`, an intersection (`A & B`), a union
 * (`A | B`), an inline type literal (`{ x: T; y: T }`), or combinations.
 */
function resolveTypeExpression(expr: string, visited: Set<string>): ApiSet {
  const result: ApiSet = { inputs: new Set(), outputs: new Set() };

  // Strip a single layer of wrapping parentheses. Unions like
  // `(A & B) | (A & C)` keep each branch wrapped; without unwrapping, the
  // inner intersection never sees the `&` operator and resolves to empty.
  let trimmed = expr.trim();
  while (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    // Only strip if the outer pair actually wraps the whole expression.
    let depth = 0;
    let paired = true;
    for (let i = 0; i < trimmed.length - 1; i += 1) {
      const ch = trimmed[i];
      if (ch === '(') depth += 1;
      else if (ch === ')') depth -= 1;
      if (depth === 0 && i < trimmed.length - 1) {
        paired = false;
        break;
      }
    }
    if (!paired) break;
    trimmed = trimmed.slice(1, -1).trim();
  }
  expr = trimmed;

  // Split on top-level `|` first (union) — for parity purposes, we want the
  // union of props across all branches (any branch may expose any prop).
  // Clone `visited` per sibling branch to avoid cross-branch poisoning.
  const unionParts = splitTopLevel(expr, '|');
  if (unionParts.length > 1) {
    for (const part of unionParts) {
      const sub = resolveTypeExpression(part, new Set(visited));
      for (const k of sub.inputs) result.inputs.add(k);
      for (const k of sub.outputs) result.outputs.add(k);
    }
    return result;
  }

  // Intersection — merge props from every operand. Clone `visited` per
  // sibling operand for the same reason.
  const intersectionParts = splitTopLevel(expr, '&');
  if (intersectionParts.length > 1) {
    for (const part of intersectionParts) {
      const sub = resolveTypeExpression(part, new Set(visited));
      for (const k of sub.inputs) result.inputs.add(k);
      for (const k of sub.outputs) result.outputs.add(k);
    }
    return result;
  }

  const single = expr.trim();

  // Inline type literal `{ a: T; b: T }` — treat its body as an anonymous
  // interface. The outer `{` / `}` are stripped before extracting props.
  if (single.startsWith('{') && single.endsWith('}')) {
    const body = single.slice(1, -1);
    const inner = extractBodyProps(body);
    for (const k of inner.inputs) result.inputs.add(k);
    for (const k of inner.outputs) result.outputs.add(k);
    return result;
  }

  // Omit<X, 'a' | 'b'> — resolve X then filter.
  const omitMatch = single.match(
    /^Omit\s*<\s*([\w.]+)(?:<[^>]*>)?\s*,\s*([\s\S]+)>$/,
  );
  if (omitMatch) {
    const keys = new Set(
      omitMatch[2]
        .split('|')
        .map((k) => k.trim().replace(/^['"`]|['"`]$/g, '')),
    );
    const base = resolveInterfaceProps(omitMatch[1], visited);
    for (const k of base.inputs) if (!keys.has(k)) result.inputs.add(k);
    for (const k of base.outputs) if (!keys.has(k)) result.outputs.add(k);
    return result;
  }

  // Pick<X, 'a' | 'b'> — resolve X then filter to the picked keys only.
  const pickMatch = single.match(
    /^Pick\s*<\s*([\w.]+)(?:<[^>]*>)?\s*,\s*([\s\S]+)>$/,
  );
  if (pickMatch) {
    const keys = new Set(
      pickMatch[2]
        .split('|')
        .map((k) => k.trim().replace(/^['"`]|['"`]$/g, '')),
    );
    const base = resolveInterfaceProps(pickMatch[1], visited);
    for (const k of base.inputs) if (keys.has(k)) result.inputs.add(k);
    for (const k of base.outputs) if (keys.has(k)) result.outputs.add(k);
    return result;
  }

  // Plain reference — `X` or `X<Y, Z>`.
  const plain = single.match(/^(\w+)(?:\s*<[^>]*>)?$/);
  if (plain) {
    const base = resolveInterfaceProps(plain[1], visited);
    for (const k of base.inputs) result.inputs.add(k);
    for (const k of base.outputs) result.outputs.add(k);
  }
  return result;
}

/**
 * Resolve a type or interface name to its full prop set, following
 * `extends` chains and intersection/union operands in type aliases.
 * HTML passthrough and unknown types are treated as empty.
 */
function resolveInterfaceProps(
  name: string,
  visited = new Set<string>(),
): ApiSet {
  if (visited.has(name)) return { inputs: new Set(), outputs: new Set() };
  visited.add(name);

  if (isHtmlPassthrough(name)) return { inputs: new Set(), outputs: new Set() };

  // Fallback to `${name}Base` when the direct name is a type alias (common
  // pattern: `type ButtonProps = Factory<..., ButtonPropsBase>`).
  const index = getInterfaceIndex();
  const entry =
    index.get(name) ??
    (name.endsWith('Props') ? index.get(`${name}Base`) : undefined);
  if (!entry) return { inputs: new Set(), outputs: new Set() };

  // Type alias — recursively resolve its RHS expression.
  if (entry.kind === 'alias') {
    return resolveTypeExpression(entry.rhs, visited);
  }

  const result: ApiSet = { inputs: new Set(), outputs: new Set() };

  if (entry.extendsClause) {
    const parents = parseExtends(entry.extendsClause);
    for (const parent of parents) {
      // Clone `visited` per sibling parent so that resolution of one branch
      // does not poison resolution of the next. `visited` only needs to
      // prevent infinite recursion within a single ancestor chain — sibling
      // parents are independent and must re-resolve types the previous
      // sibling happened to touch internally. Concretely: `CalendarProps`
      // extends `Pick<CalendarDaysProps, ...>` AND `Pick<CalendarMonthsProps, ...>`;
      // `CalendarDaysProps` internally references `CalendarMonthsProps`, which
      // used to leak into `visited` and silently drop the second Pick's props.
      const parentVisited = new Set(visited);
      const parentProps = resolveInterfaceProps(parent.name, parentVisited);
      const mergeSet = (target: Set<string>, source: Set<string>): void => {
        for (const k of source) {
          if (parent.pick && !parent.pick.has(k)) continue;
          if (parent.omit && parent.omit.has(k)) continue;
          target.add(k);
        }
      };
      mergeSet(result.inputs, parentProps.inputs);
      mergeSet(result.outputs, parentProps.outputs);
    }
  }

  const own = extractBodyProps(entry.body);
  for (const k of own.inputs) result.inputs.add(k);
  for (const k of own.outputs) result.outputs.add(k);

  return result;
}

/**
 * Extract React props by resolving `${pascalName}PropsBase` first, falling
 * back to `${pascalName}Props`, then `${pascalName}Data` (covers notifier-
 * pattern components like `Message` whose FC is typed as `FC<MessageData>`).
 * If none of those match, scan the component file for the FC's type
 * annotation `FC<...>` or `FC<PropsWithChildren<...>>` and resolve the inner
 * interface — this picks up shapes like `NotificationCenterFC:
 * FC<PropsWithChildren<NotificationData>>` where the data interface is named
 * without the component prefix. Follows `extends` chains recursively.
 */
export function extractReactApi(file: string, pascalName: string): ApiSet {
  const index = getInterfaceIndex();
  const baseCandidates = [
    `${pascalName}PropsBase`,
    `${pascalName}Props`,
    `${pascalName}Data`,
  ];
  for (const candidate of baseCandidates) {
    if (index.has(candidate)) return resolveInterfaceProps(candidate);
  }

  // Fallback: parse the component source for an explicit FC<...> type
  // annotation near the component declaration and resolve that inner type.
  const fcInterface = findFcTypeAnnotation(file, pascalName);
  if (fcInterface && index.has(fcInterface)) {
    return resolveInterfaceProps(fcInterface);
  }
  return { inputs: new Set(), outputs: new Set() };
}

/**
 * Scan a React component source file for a declaration like
 * `const FooFC: FC<X>` or `const FooFC: FC<PropsWithChildren<X>>` and
 * return X. Used when the public data interface is not named after the
 * component (e.g. `NotificationCenterFC: FC<PropsWithChildren<NotificationData>>`).
 */
function findFcTypeAnnotation(file: string, pascalName: string): string | null {
  if (!existsSync(file)) return null;
  const text = readFileSync(file, 'utf-8');
  // Prefer the canonical `${pascalName}FC: FC<…>` shape first (avoids
  // accidentally binding to a sibling `${pascalName}Container: FC<PropsWithChildren>`
  // type annotation that predates the real implementation).
  const specificPatterns = [
    new RegExp(
      `const\\s+${pascalName}FC\\s*:\\s*FC\\s*<\\s*(?:PropsWithChildren\\s*<\\s*)?(\\w+)`,
    ),
    new RegExp(
      `const\\s+${pascalName}\\s*:\\s*FC\\s*<\\s*(?:PropsWithChildren\\s*<\\s*)?(\\w+)`,
    ),
  ];
  for (const re of specificPatterns) {
    const m = text.match(re);
    if (!m) continue;
    // Reject `PropsWithChildren` itself — that means the FC has no inner
    // data interface and our regex caught the passthrough wrapper.
    if (m[1] === 'PropsWithChildren') continue;
    return m[1];
  }
  return null;
}

export function extractAngularApi(file: string): ApiSet {
  const text = readFileSync(file, 'utf-8');
  const inputs = new Set<string>();
  const outputs = new Set<string>();

  const decoratorRe = /@(Input|Output)\s*\([^)]*\)\s*(?:readonly\s+)?(\w+)/g;
  for (const m of text.matchAll(decoratorRe)) {
    const [, kind, name] = m;
    (kind === 'Input' ? inputs : outputs).add(name);
  }

  const signalRe =
    /(?:readonly\s+)?(\w+)\s*=\s*(input(?:\.required)?|model(?:\.required)?|output)\s*[<(]/g;
  for (const m of text.matchAll(signalRe)) {
    const [, name, kind] = m;
    if (kind.startsWith('output')) outputs.add(name);
    else inputs.add(name);
  }
  return { inputs, outputs };
}

export function diffApi(pascalName: string): {
  diffs: ApiDiff[];
  reactFile: string | null;
  ngFile: string | null;
} {
  const reactFile = locateReactFile(pascalName);
  const ngFile = locateAngularFile(pascalName);
  if (!reactFile || !ngFile) {
    return { diffs: [], reactFile, ngFile };
  }
  const r = extractReactApi(reactFile, pascalName);
  const n = extractAngularApi(ngFile);
  const diffs: ApiDiff[] = [];
  for (const name of [...r.inputs].sort()) {
    if (!n.inputs.has(name))
      diffs.push({ kind: 'input', side: 'missing', name });
  }
  for (const name of [...n.inputs].sort()) {
    if (!r.inputs.has(name)) diffs.push({ kind: 'input', side: 'extra', name });
  }
  for (const name of [...r.outputs].sort()) {
    if (!n.outputs.has(name))
      diffs.push({ kind: 'output', side: 'missing', name });
  }
  for (const name of [...n.outputs].sort()) {
    if (!r.outputs.has(name))
      diffs.push({ kind: 'output', side: 'extra', name });
  }
  return { diffs, reactFile, ngFile };
}
