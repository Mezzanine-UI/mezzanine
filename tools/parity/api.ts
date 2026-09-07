import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { memberKey, parseMacroTypeMembers } from './vue-macros.ts';

const REACT_ROOT = resolve(process.cwd(), 'packages/react/src');
const CORE_ROOT = resolve(process.cwd(), 'packages/core/src');
const NG_ROOT = resolve(process.cwd(), 'packages/ng');
const VUE_ROOT = resolve(process.cwd(), 'packages/vue');

/**
 * Which port is being compared. React is always the reference side; the
 * target is whichever framework mirrors it.
 */
export type ParityTarget = 'ng' | 'vue';

/**
 * Which source tree a type name is resolved against. React prop interfaces
 * live under `packages/react/src`; Vue prop interfaces live in
 * `packages/vue/<component>/<component>.types.ts`. Both may `extends` shared
 * interfaces from `packages/core/src`, so every scope also walks core.
 */
type IndexScope = 'react' | 'vue';

export type ApiSet = {
  inputs: Set<string>;
  outputs: Set<string>;
};

export type ApiDiff = {
  /**
   * `error` is reported when the target's API could not be extracted at all
   * (e.g. a Vue `defineEmits` written in an unsupported form). It must never
   * be silently treated as "no diffs" — an empty extraction reads exactly
   * like perfect parity, which is the most dangerous failure mode there is.
   */
  kind: 'input' | 'output' | 'error';
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

  // A component whose file is named after something else still has to be
  // compared: React's `AutoCompleteInside.tsx` declares
  // `AutoCompleteInsideTriggerProps` for its `AutoCompleteInsideTrigger`. The
  // props interface is the contract the extractor reads anyway, so the file
  // declaring it is the right file — and the name is specific enough that this
  // cannot pair two unrelated components.
  const byPropsInterface = findFile(REACT_ROOT, (f) => {
    if (!f.endsWith('.tsx') && !f.endsWith('.ts')) return false;
    if (f.endsWith('.spec.tsx') || f.endsWith('.spec.ts')) return false;
    if (f.endsWith('.stories.tsx') || f.endsWith('.stories.ts')) return false;

    return new RegExp(
      `export\\s+(?:interface|type)\\s+${pascalName}Props\\b`,
    ).test(readFileSync(f, 'utf-8'));
  });

  return byPropsInterface;
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

/**
 * Locate the Vue props contract for a component. The interface deliberately
 * lives in a plain `.ts` sibling of the SFC (see the
 * `architecting-vue-components` skill) so it can be resolved by the very same
 * machinery as the React side, rather than needing SFC type inference.
 */
export function locateVueFile(
  pascalName: string,
): { typesFile: string; sfcFile: string | null } | null {
  const k = kebab(pascalName);
  const candidates = [k, k.replace(/-/g, ''), `${k}s`, singular(k)];

  for (const name of candidates) {
    const typesFile = findFile(
      VUE_ROOT,
      (f) => f.endsWith(`/${name}.types.ts`) && !f.endsWith('.d.ts'),
    );

    if (!typesFile) continue;

    const sfcFile = findFile(VUE_ROOT, (f) => f.endsWith(`/${name}.vue`));

    return { typesFile, sfcFile };
  }

  return null;
}

/**
 * Names to try when looking up a props interface. `locateReactFile` and
 * `locateVueFile` already fall back to the singular when a story title is
 * plural — `Inline Messages` finds `InlineMessage.tsx` — but the interface
 * lookup did not, so `InlineMessagesProps` was searched for, never found, and
 * the component's whole API silently extracted as empty on both sides.
 */
function pascalCandidates(pascalName: string): string[] {
  const names = [pascalName];

  if (pascalName.endsWith('s') && !pascalName.endsWith('ss')) {
    names.push(pascalName.slice(0, -1));
  }

  return names;
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
  /**
   * The alias's own type parameters, in declaration order. Needed to resolve a
   * generic factory: `ButtonProps` is
   * `ComponentOverridableForwardRefComponentPropsFactory<…, ButtonPropsBase>`,
   * and without substituting `P` the factory's `& P` contributes nothing —
   * every prop a polymorphic component declares went missing that way.
   */
  params: string[];
};

type IndexEntry = InterfaceEntry | TypeAliasEntry;

/**
 * Split a generic argument or parameter list at its top-level commas.
 * `VC extends NativeElementTag | JSXElementConstructor<any>, C extends VC, P`
 * is three entries, not five.
 */
function splitTypeList(text: string): string[] {
  const out: string[] = [];
  let angle = 0;
  let paren = 0;
  let curly = 0;
  let bracket = 0;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (ch === '=' && text[i + 1] === '>') {
      i += 1;
      continue;
    }
    if (ch === '<') angle += 1;
    else if (ch === '>') angle -= 1;
    else if (ch === '(') paren += 1;
    else if (ch === ')') paren -= 1;
    else if (ch === '{') curly += 1;
    else if (ch === '}') curly -= 1;
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket -= 1;
    else if (
      ch === ',' &&
      angle === 0 &&
      paren === 0 &&
      curly === 0 &&
      bracket === 0
    ) {
      out.push(text.slice(start, i).trim());
      start = i + 1;
    }
  }

  const last = text.slice(start).trim();

  if (last) out.push(last);

  return out.filter((part) => part.length > 0);
}

/** The declared names of a type-parameter list, dropping constraints and defaults. */
function parseTypeParams(paramList: string): string[] {
  if (!paramList.trim()) return [];

  return splitTypeList(paramList)
    .map((part) => part.match(/^([A-Za-z_$][\w$]*)/)?.[1] ?? '')
    .filter(Boolean);
}

/**
 * A generic reference split into its name and its argument expressions, or
 * `null` when the expression is not one. Depth-aware, unlike the regexes it
 * replaces: `Omit<Foo<C>, 'a'>` has one nested `>` that a `[^>]*` match stops
 * at, which is why every polymorphic component resolved to nothing.
 */
function matchGeneric(expr: string): { name: string; args: string[] } | null {
  const head = expr.match(/^([A-Za-z_$][\w$.]*)\s*</);

  if (!head || !expr.endsWith('>')) return null;

  let depth = 0;

  for (let i = head[0].length - 1; i < expr.length; i += 1) {
    const ch = expr[i];

    if (ch === '<') depth += 1;
    else if (ch === '>') {
      depth -= 1;

      // The closing angle has to be the last character, or this is something
      // like `Partial<A> | Partial<B>` rather than one generic reference.
      if (depth === 0) {
        if (i !== expr.length - 1) return null;

        return {
          name: head[1],
          args: splitTypeList(expr.slice(head[0].length, i)),
        };
      }
    }
  }

  return null;
}

/**
 * Substitute a generic alias's arguments into its right-hand side.
 *
 * Textual, on whole-word boundaries: the alias body is small and its parameter
 * names are single identifiers, so this reaches `& P` without needing a type
 * checker.
 */
function substituteTypeParams(
  rhs: string,
  params: string[],
  args: string[],
): string {
  let out = rhs;

  params.forEach((param, index) => {
    const arg = args[index];

    if (!arg) return;

    out = out.replace(new RegExp(`\\b${param}\\b`, 'g'), arg);
  });

  return out;
}

const interfaceIndexes = new Map<IndexScope, Map<string, IndexEntry>>();

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
function buildInterfaceIndex(scope: IndexScope): Map<string, IndexEntry> {
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
      if (full.endsWith('.stories.tsx') || full.endsWith('.stories.ts'))
        continue;

      const text = readFileSync(full, 'utf-8');

      // --- Interfaces --------------------------------------------------------
      const interfacePattern = /(?:export\s+)?interface\s+(\w+)/g;
      for (const match of text.matchAll(interfacePattern)) {
        const name = match[1];
        // Walk the header instead of matching it: an extends clause can carry
        // an object type — `PickRenameMulti<…, { options: 'popperOptions' }>` —
        // and a regex that stops at the first `{` reads that as the body, so
        // every own prop of the interface goes missing. `AutoCompleteBaseProps`
        // lost thirty of them that way.
        let cursor = (match.index ?? 0) + match[0].length;
        // The type parameter list belongs to the name, not to the extends
        // clause: its own `extends` (`<T extends DropdownType>`) must not be
        // mistaken for the interface's.
        while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
        if (text[cursor] === '<') {
          let params = 0;

          while (cursor < text.length) {
            const ch = text[cursor];

            if (ch === '=' && text[cursor + 1] === '>') {
              cursor += 2;
              continue;
            }
            if (ch === '<') params += 1;
            else if (ch === '>') {
              params -= 1;
              if (params === 0) {
                cursor += 1;
                break;
              }
            }
            cursor += 1;
          }
        }
        const headerStart = cursor;
        let angle = 0;
        let paren = 0;
        let bracket = 0;

        while (cursor < text.length) {
          const ch = text[cursor];

          if (ch === '{' && angle === 0 && paren === 0 && bracket === 0) break;
          if (ch === '=' && text[cursor + 1] === '>') {
            cursor += 2;
            continue;
          }
          if (ch === '<') angle += 1;
          else if (ch === '>') angle -= 1;
          else if (ch === '(') paren += 1;
          else if (ch === ')') paren -= 1;
          else if (ch === '[') bracket += 1;
          else if (ch === ']') bracket -= 1;
          cursor += 1;
        }
        if (cursor >= text.length) continue;
        const extendsMatch = text
          .slice(headerStart, cursor)
          .match(/^\s*extends\s+([\s\S]+)$/);
        const extendsClause = extendsMatch ? extendsMatch[1].trim() : null;
        const headerEnd = cursor + 1;
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
      //
      // The alias's own parameter list is skipped by tracking angle depth
      // rather than by a `<[^>]*>` match: a parameter constrained by a generic
      // (`C extends JSXElementConstructor<any>`) contains a `>` of its own, and
      // the simple form stopped there and never reached the `=`. The whole
      // alias then went unindexed, which is what hid `component` from every
      // polymorphic component's props.
      const aliasHeaderPattern = /(?:export\s+)?type\s+(\w+)\s*/g;
      for (const match of text.matchAll(aliasHeaderPattern)) {
        const name = match[1];
        if (index.has(name)) continue; // interface wins if both exist

        let cursor = (match.index ?? 0) + match[0].length;
        let paramList = '';

        if (text[cursor] === '<') {
          let params = 0;
          const paramStart = cursor + 1;

          while (cursor < text.length) {
            const ch = text[cursor];

            if (ch === '<') params += 1;
            else if (ch === '>') {
              params -= 1;

              if (params === 0) {
                paramList = text.slice(paramStart, cursor);
                cursor += 1;
                break;
              }
            }

            cursor += 1;
          }
        }

        while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
        if (text[cursor] !== '=') continue;

        cursor += 1;
        while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;

        const rhsStart = cursor;
        // Scan forward until a top-level `;` respecting `{}`, `<>`, `()`, `[]`.
        let depthCurly = 0;
        let depthAngle = 0;
        let depthParen = 0;
        let depthBracket = 0;
        let i = rhsStart;
        while (i < text.length) {
          const ch = text[i];
          // A function type's `=>` is not a generic argument list: counting its
          // `>` as one leaves the angle depth negative for the rest of the
          // alias, so the terminating `;` is never recognised and the captured
          // RHS runs on into whatever follows. That is what hid every prop of
          // `SelectInputProps` — the only Input variant with a callback.
          if (ch === '=' && text[i + 1] === '>') {
            i += 2;
            continue;
          }

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
          index.set(name, {
            kind: 'alias',
            file: full,
            rhs,
            params: parseTypeParams(paramList),
          });
        }
      }
    }
  };

  walk(scope === 'vue' ? VUE_ROOT : REACT_ROOT);
  // Also index shared type declarations under packages/core/src. React prop
  // interfaces frequently `extends` core interfaces (e.g. `DropdownProps
  // extends DropdownItemSharedProps`), so without this the inherited props
  // (value / mode / …) are silently dropped from the React side. REACT_ROOT is
  // walked first so a react-side declaration wins on any name collision.
  walk(CORE_ROOT);
  return index;
}

function getInterfaceIndex(scope: IndexScope): Map<string, IndexEntry> {
  let index = interfaceIndexes.get(scope);

  if (!index) {
    index = buildInterfaceIndex(scope);
    interfaceIndexes.set(scope, index);
  }

  return index;
}

type ParentRef = {
  name: string;
  omit?: Set<string>;
  pick?: Set<string>;
};

const TRANSPARENT_WRAPPERS = new Set([
  'NonNullable',
  'Partial',
  'Readonly',
  'Required',
]);

/**
 * Strip wrapper generics that change only a type's modifiers, never its key
 * set. `Partial<Omit<ModalFooterProps, …>>` is the same contract as the `Omit`
 * it wraps, but neither the extends parser nor the alias resolver recognised
 * the outer form, so the whole clause was skipped in silence — Modal inherited
 * none of the sixteen footer props it declares and forwards.
 */
function stripTransparentWrappers(expr: string): string {
  let current = expr.trim();

  for (;;) {
    const match = current.match(/^([A-Za-z_$][\w$]*)\s*<([\s\S]*)>$/);

    if (!match || !TRANSPARENT_WRAPPERS.has(match[1])) return current;

    // The trailing `>` has to be the one that closes this wrapper, or
    // `Partial<A> | Partial<B>` would read as one wrapper around
    // `A> | Partial<B`.
    const inner = match[2];
    let depth = 0;

    for (const ch of inner) {
      if (ch === '<') depth += 1;
      else if (ch === '>') depth -= 1;
      if (depth < 0) return current;
    }

    if (depth !== 0) return current;

    current = inner.trim();
  }
}

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

  for (const rawPart of parts) {
    if (!rawPart) continue;
    const p = stripTransparentWrappers(rawPart);
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
  let braceDepth = 0;
  let parenDepth = 0;
  for (const line of body.split('\n')) {
    const trimmed = line.replace(/\/\/.*$/, '').trim();
    // A property declaration only counts at the interface top level. Decide
    // using depths carried from *previous* lines so that:
    //  - inline object types (`foo: { a: T; b: T }`) don't leak `a` / `b`, and
    //  - callback parameter lists (`onX?: (computed: T, target: U) => void`)
    //    don't leak the parameter names `computed` / `target` as props.
    // The property's own opening line is still at top level (depths are
    // updated *after* the decision), so the property itself is captured.
    const atTopLevel = braceDepth === 0 && parenDepth === 0;
    for (const ch of trimmed) {
      if (ch === '{') braceDepth += 1;
      else if (ch === '}') braceDepth -= 1;
      else if (ch === '(') parenDepth += 1;
      else if (ch === ')') parenDepth -= 1;
    }
    if (!atTopLevel) continue;
    const m = trimmed.match(/^(\w+)\??\s*[:(]/);
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
    // A function type's `=>` is not a generic argument list. Counting its `>`
    // leaves the angle depth negative for the rest of the expression, so every
    // later operator stops looking top-level and the split silently collapses
    // to one operand — which is how ContentHeader's `onBackClick` / `size`
    // union went missing. The alias scanner was taught this; the splitter it
    // hands its result to was not.
    if (ch === '=' && expr[i + 1] === '>') {
      i += 1;
      continue;
    }
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
/**
 * The name an `onXxx` prop takes in the outputs set.
 *
 * `Omit`/`Pick` key lists are written in prop form — `Omit<NotifierData,
 * 'onClose'>` — while callbacks have already been folded into outputs under
 * their event name, so filtering by the literal key missed them entirely.
 * Message omits `onClose` and still reported a `close` output; the transition
 * props picked into `MessageConfigProps` were dropped instead of kept.
 */
function outputName(name: string): string {
  return name.startsWith('on') &&
    name.length > 2 &&
    name[2] === name[2].toUpperCase()
    ? name[2].toLowerCase() + name.slice(3)
    : name;
}

/** A key list that matches both the prop spelling and the output spelling. */
function keyFilter(rawKeys: string[]): Set<string> {
  const keys = new Set<string>();

  rawKeys.forEach((key) => {
    keys.add(key);
    keys.add(outputName(key));
  });

  return keys;
}

function resolveTypeExpression(
  expr: string,
  visited: Set<string>,
  scope: IndexScope,
): ApiSet {
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

  const unwrapped = stripTransparentWrappers(expr);

  if (unwrapped !== expr) {
    return resolveTypeExpression(unwrapped, visited, scope);
  }

  // Split on top-level `|` first (union) — for parity purposes, we want the
  // union of props across all branches (any branch may expose any prop).
  // Clone `visited` per sibling branch to avoid cross-branch poisoning.
  const unionParts = splitTopLevel(expr, '|');
  if (unionParts.length > 1) {
    for (const part of unionParts) {
      const sub = resolveTypeExpression(part, new Set(visited), scope);
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
      const sub = resolveTypeExpression(part, new Set(visited), scope);
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

  const generic = matchGeneric(single);

  // Omit<X, 'a' | 'b'> / Pick<X, 'a'> — resolve X, then filter. `X` is resolved
  // as an expression rather than looked up as a name, because it is routinely
  // one: `Omit<Omit<ComponentProps<C>, keyof P> & P, 'component'>` is what a
  // polymorphic component's props alias expands to.
  if (
    generic &&
    (generic.name === 'Omit' || generic.name === 'Pick') &&
    generic.args.length === 2
  ) {
    const keys = keyFilter(
      generic.args[1]
        .split('|')
        .map((k) => k.trim().replace(/^['"`]|['"`]$/g, '')),
    );
    const base = resolveTypeExpression(generic.args[0], visited, scope);
    const keep = (key: string): boolean =>
      generic.name === 'Omit' ? !keys.has(key) : keys.has(key);

    for (const k of base.inputs) if (keep(k)) result.inputs.add(k);
    for (const k of base.outputs) if (keep(k)) result.outputs.add(k);
    return result;
  }

  // A generic alias reference — substitute the arguments into its right-hand
  // side before resolving, so the type parameters carrying the real props
  // (`P` in the factories) are not dropped.
  if (generic && !visited.has(generic.name)) {
    const entry = getInterfaceIndex(scope).get(generic.name);

    if (entry?.kind === 'alias' && entry.params.length) {
      const nested = new Set(visited);

      nested.add(generic.name);

      return resolveTypeExpression(
        substituteTypeParams(entry.rhs, entry.params, generic.args),
        nested,
        scope,
      );
    }
  }

  // Plain reference — `X` or `X<Y, Z>`.
  const plain = generic ? generic.name : single.match(/^(\w+)$/)?.[1];
  if (plain) {
    const base = resolveInterfaceProps(plain, scope, visited);
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
  scope: IndexScope,
  visited = new Set<string>(),
): ApiSet {
  if (visited.has(name)) return { inputs: new Set(), outputs: new Set() };
  visited.add(name);

  if (isHtmlPassthrough(name)) return { inputs: new Set(), outputs: new Set() };

  // Fallback to `${name}Base` when the direct name is a type alias (common
  // pattern: `type ButtonProps = Factory<..., ButtonPropsBase>`).
  const index = getInterfaceIndex(scope);
  const entry =
    index.get(name) ??
    (name.endsWith('Props') ? index.get(`${name}Base`) : undefined);
  if (!entry) return { inputs: new Set(), outputs: new Set() };

  // Type alias — recursively resolve its RHS expression.
  if (entry.kind === 'alias') {
    return resolveTypeExpression(entry.rhs, visited, scope);
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
      const parentProps = resolveInterfaceProps(
        parent.name,
        scope,
        parentVisited,
      );
      // Both spellings, because an `extends Omit<X, 'onClose'>` names the prop
      // while the set holds the output under its event name.
      const pick = parent.pick && keyFilter([...parent.pick]);
      const omit = parent.omit && keyFilter([...parent.omit]);
      const mergeSet = (target: Set<string>, source: Set<string>): void => {
        for (const k of source) {
          if (pick && !pick.has(k)) continue;
          if (omit && omit.has(k)) continue;
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
  const index = getInterfaceIndex('react');
  const baseCandidates = pascalCandidates(pascalName).flatMap((name) => [
    `${name}PropsBase`,
    `${name}Props`,
    `${name}Data`,
  ]);
  /**
   * Every candidate that exists contributes, rather than the first one only.
   *
   * A polymorphic component declares both: `ButtonPropsBase` holds its own
   * props, and `ButtonProps` is
   * `ComponentOverridableForwardRefComponentPropsFactory<…, ButtonPropsBase>`,
   * whose body ends in `& { component?: VC }`. Stopping at the first hit meant
   * `component` was never part of React's surface, so a Vue port that declared
   * it read as an extra input — the reason D12 said not to mirror it at all.
   * The same merge also picks up variant props on a `XProps` union built from
   * an `XPropsBase`.
   */
  const merged: ApiSet = { inputs: new Set(), outputs: new Set() };
  let found = false;

  for (const candidate of baseCandidates) {
    if (!index.has(candidate)) continue;

    found = true;

    const resolved = resolveInterfaceProps(candidate, 'react');

    for (const name of resolved.inputs) merged.inputs.add(name);
    for (const name of resolved.outputs) merged.outputs.add(name);
  }

  if (found) return merged;

  // Fallback: parse the component source for an explicit FC<...> type
  // annotation near the component declaration and resolve that inner type.
  const fcInterface = findFcTypeAnnotation(file, pascalName);
  if (fcInterface && index.has(fcInterface)) {
    return resolveInterfaceProps(fcInterface, 'react');
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
  // Apply the same skip-list as the React side (className/prefix/suffix/… are
  // content-projection / framework-intrinsic and not part of prop parity).
  for (const name of SKIP_PROP_NAMES) {
    inputs.delete(name);
    outputs.delete(name);
  }
  return { inputs, outputs };
}

/**
 * Parse a Vue SFC's `defineEmits<{ ... }>()` declaration.
 *
 * Only the named-tuple type form is accepted:
 *
 * ```ts
 * const emit = defineEmits<{
 *   change: [value: string];
 *   'update:value': [value: string];
 * }>();
 * ```
 *
 * The call-signature form and a bare type reference are reported as
 * malformed rather than yielding an empty set: silently extracting zero
 * emits is indistinguishable from perfect output parity.
 */
export function parseDefineEmits(text: string): {
  outputs: Set<string>;
  errors: string[];
} {
  const outputs = new Set<string>();
  const parsed = parseMacroTypeMembers(text, 'defineEmits');

  if (!parsed) return { outputs, errors: [] };

  const errors = [...parsed.errors];

  for (const member of parsed.members) {
    const name = memberKey(member);

    if (!name) {
      errors.push(
        member.startsWith('(')
          ? 'defineEmits uses the call-signature form; rewrite it as a ' +
              'named-tuple literal, e.g. `{ change: [value: string] }`'
          : `unparseable defineEmits member: \`${member.slice(0, 40)}\``,
      );
      continue;
    }

    // `update:<prop>` is the plumbing behind Vue's named `v-model`; it is
    // additive to the React-named event, never a replacement, so it is not
    // part of output parity.
    if (name.startsWith('update:')) continue;

    outputs.add(name);
  }

  return { outputs, errors };
}

export type VueApiResult = ApiSet & { errors: string[] };

/**
 * Extract the Vue side's public API: props from the `<component>.types.ts`
 * interface (resolved with the same inheritance machinery as the React side)
 * and emits from the SFC's `defineEmits`.
 */
/** Whether the types file's own directory contains any SFC. */
function dirHasSfc(typesFile: string): boolean {
  try {
    return readdirSync(dirname(typesFile)).some((f) => f.endsWith('.vue'));
  } catch {
    return false;
  }
}

export function extractVueApi(
  typesFile: string,
  sfcFile: string | null,
  pascalName: string,
): VueApiResult {
  const errors: string[] = [];
  const index = getInterfaceIndex('vue');
  // `${name}Data` matches the React side's candidate list: a factory-shaped
  // module — Notifier — describes its payload as `NotifierData`, and without
  // this the Vue interface is never found and the whole API extracts as empty.
  //
  // Every candidate that exists contributes, exactly as on the React side: a
  // component that is also a notifier — AlertBanner — splits its surface
  // across `XProps` and `XData`, and stopping at the first hid half of it.
  const candidates = pascalCandidates(pascalName)
    .flatMap((name) => [`${name}PropsBase`, `${name}Props`, `${name}Data`])
    .filter((c) => index.has(c));

  const props: ApiSet = { inputs: new Set(), outputs: new Set() };

  candidates.forEach((candidate) => {
    const resolved = resolveInterfaceProps(candidate, 'vue');

    for (const name of resolved.inputs) props.inputs.add(name);
    for (const name of resolved.outputs) props.outputs.add(name);
  });

  if (candidates.length === 0) {
    errors.push(
      `no \`${pascalName}Props\` interface exported from ${typesFile.replace(process.cwd(), '')}`,
    );
  }

  const outputs = new Set(props.outputs);

  if (sfcFile && existsSync(sfcFile)) {
    const emits = parseDefineEmits(readFileSync(sfcFile, 'utf-8'));

    for (const name of emits.outputs) outputs.add(name);
    errors.push(...emits.errors);
  } else if (dirHasSfc(typesFile)) {
    // Only an error when the directory holds components: then the SFC exists
    // under a name the lookup cannot see, and its emits are silently absent.
    // A directory with no `.vue` at all is a module by design — Notifier is a
    // factory, and React has no `Notifier.tsx` either.
    errors.push(`no SFC found next to ${typesFile.replace(process.cwd(), '')}`);
  }

  for (const name of SKIP_PROP_NAMES) {
    props.inputs.delete(name);
    outputs.delete(name);
  }

  return { inputs: props.inputs, outputs, errors };
}

/** Name-level set comparison shared by every target. */
function compareApiSets(react: ApiSet, target: ApiSet): ApiDiff[] {
  const diffs: ApiDiff[] = [];

  for (const name of [...react.inputs].sort()) {
    if (!target.inputs.has(name))
      diffs.push({ kind: 'input', side: 'missing', name });
  }
  for (const name of [...target.inputs].sort()) {
    if (!react.inputs.has(name))
      diffs.push({ kind: 'input', side: 'extra', name });
  }
  for (const name of [...react.outputs].sort()) {
    if (!target.outputs.has(name))
      diffs.push({ kind: 'output', side: 'missing', name });
  }
  for (const name of [...target.outputs].sort()) {
    if (!react.outputs.has(name))
      diffs.push({ kind: 'output', side: 'extra', name });
  }

  return diffs;
}

export function diffApi(
  pascalName: string,
  target: ParityTarget = 'ng',
): {
  diffs: ApiDiff[];
  reactFile: string | null;
  targetFile: string | null;
} {
  const reactFile = locateReactFile(pascalName);

  if (target === 'vue') {
    const located = locateVueFile(pascalName);

    if (!reactFile || !located) {
      // A component with an SFC but no props interface is not "not ported yet",
      // it is ported with its types file misplaced — and returning no diffs for
      // it reads as parity. ButtonGroup shipped that way for a few minutes,
      // with `ButtonGroupProps` living in `button.types.ts`.
      const orphanSfc =
        reactFile && !located
          ? findFile(VUE_ROOT, (f) => f.endsWith(`/${kebab(pascalName)}.vue`))
          : null;

      return {
        diffs: orphanSfc
          ? [
              {
                kind: 'error',
                side: 'extra',
                name:
                  `${orphanSfc.split('/packages/')[1]} has no ` +
                  `${kebab(pascalName)}.types.ts, ` +
                  'so its props were never compared',
              },
            ]
          : [],
        reactFile,
        targetFile: located?.typesFile ?? null,
      };
    }

    const r = extractReactApi(reactFile, pascalName);
    const v = extractVueApi(located.typesFile, located.sfcFile, pascalName);
    const diffs = compareApiSets(r, v);

    // Extraction failures come first: every diff below them is unreliable.
    for (const message of v.errors.reverse()) {
      diffs.unshift({ kind: 'error', side: 'extra', name: message });
    }

    return { diffs, reactFile, targetFile: located.typesFile };
  }

  const targetFile = locateAngularFile(pascalName);

  if (!reactFile || !targetFile) {
    return { diffs: [], reactFile, targetFile };
  }

  return {
    diffs: compareApiSets(
      extractReactApi(reactFile, pascalName),
      extractAngularApi(targetFile),
    ),
    reactFile,
    targetFile,
  };
}
