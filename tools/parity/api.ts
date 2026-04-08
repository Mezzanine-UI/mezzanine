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
]);

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
  file: string;
  extendsClause: string | null;
  body: string;
};

let interfaceIndex: Map<string, InterfaceEntry> | null = null;

/**
 * Build a repo-wide index of interface declarations. We scan source
 * files under packages/react/src and capture name, extends clause, and
 * body for each `interface Name { ... }` block.
 */
function buildInterfaceIndex(): Map<string, InterfaceEntry> {
  const index = new Map<string, InterfaceEntry>();

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
      const headerPattern =
        /(?:export\s+)?interface\s+(\w+)(?:<[^>]*>)?\s*(?:extends\s+([^{]+?))?\s*\{/g;
      for (const match of text.matchAll(headerPattern)) {
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
          index.set(name, { file: full, extendsClause, body });
        }
      }
    }
  };

  walk(REACT_ROOT);
  return index;
}

function getInterfaceIndex(): Map<string, InterfaceEntry> {
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
 * Resolve an interface name to its full prop set, following `extends`
 * chains. HTML passthrough and unknown interfaces are treated as empty.
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

  const result: ApiSet = { inputs: new Set(), outputs: new Set() };

  if (entry.extendsClause) {
    const parents = parseExtends(entry.extendsClause);
    for (const parent of parents) {
      const parentProps = resolveInterfaceProps(parent.name, visited);
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
 * back to `${pascalName}Props`. Follows `extends` chains recursively.
 */
export function extractReactApi(_file: string, pascalName: string): ApiSet {
  const index = getInterfaceIndex();
  const baseCandidates = [`${pascalName}PropsBase`, `${pascalName}Props`];
  for (const candidate of baseCandidates) {
    if (index.has(candidate)) return resolveInterfaceProps(candidate);
  }
  return { inputs: new Set(), outputs: new Set() };
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
