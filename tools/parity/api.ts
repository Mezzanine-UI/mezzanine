import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

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

/** Singularize a kebab name (`inline-messages` → `inline-message`). */
function singular(k: string): string {
  if (k.endsWith('ies')) return `${k.slice(0, -3)}y`;
  if (k.endsWith('s') && !k.endsWith('ss')) return k.slice(0, -1);
  return k;
}

export function locateReactFile(pascalName: string): string | null {
  const candidates = [pascalName, `${pascalName}Manager`];
  // Singular fallback for plural slugs (e.g. InlineMessages → InlineMessage).
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
  const candidates = [
    k,
    k.replace(/-/g, ''), // auto-complete → autocomplete
    `${k}s`, // tab → tabs
    singular(k), // inline-messages → inline-message
  ];
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
 * Extract React props by locating an `interface XxxPropsBase` (preferred) or
 * `interface XxxProps` block and reading top-level property names.
 *
 * Searches the component file plus siblings (e.g. `typings.ts`) since the
 * interface is often in a separate file.
 */
export function extractReactApi(file: string, pascalName: string): ApiSet {
  const inputs = new Set<string>();
  const outputs = new Set<string>();

  // Collect candidate texts: the file itself plus sibling .ts/.tsx files.
  const dir = dirname(file);
  const candidates: string[] = [file];
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.ts') && !entry.endsWith('.tsx')) continue;
    if (
      entry.endsWith('.spec.ts') ||
      entry.endsWith('.spec.tsx') ||
      entry.endsWith('.stories.tsx')
    )
      continue;
    const full = join(dir, entry);
    if (full !== file) candidates.push(full);
  }

  const baseName = `${pascalName}Props`;
  const ifaceRe = new RegExp(
    `(?:export\\s+)?interface\\s+(${baseName}Base|${baseName})\\s*(?:extends[^{]+)?\\{`,
    'g',
  );

  let body: string | null = null;
  for (const candidate of candidates) {
    const text = readFileSync(candidate, 'utf-8');
    const matches = [...text.matchAll(ifaceRe)];
    if (matches.length === 0) continue;
    const preferred = matches.find((m) => m[1].endsWith('Base')) ?? matches[0];
    const startIndex = preferred.index! + preferred[0].length;
    let depth = 1;
    let i = startIndex;
    while (i < text.length && depth > 0) {
      const ch = text[i];
      if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
      i += 1;
    }
    body = text.slice(startIndex, i - 1);
    break;
  }
  if (body === null) return { inputs, outputs };

  // Property lines: `name?:` or `name:` at depth 0 inside the interface body.
  let bd = 0;
  for (const line of body.split('\n')) {
    const trimmed = line.replace(/\/\/.*$/, '').trim();
    // Track nested braces
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
 * Extract Angular @Input/@Output names from a component or directive class.
 * Supports decorator syntax (`@Input() name`) and signal-based APIs
 * (`name = input(...)`, `name = input.required(...)`, `name = model(...)`,
 * `name = output(...)`).
 */
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
