/**
 * Shared parsing for Vue compiler macros whose type argument is an inline
 * type literal (`defineEmits<{ … }>()`, `defineSlots<{ … }>()`).
 *
 * Kept separate from `api.ts` so the parity extractor and the static checkers
 * cannot drift apart: a checker that accepts a form the extractor cannot read
 * would let a component pass review while its API is invisible to the harness.
 */

export type MacroMembers = {
  /** Raw top-level member sources, comments stripped. */
  members: string[];
  errors: string[];
};

/**
 * Comments are removed before anything else is read.
 *
 * A documented member (`/** The element you want to portal. *\/` above a slot)
 * would otherwise be split on its own newlines and reported as three
 * unparseable members — a checker that rejects documentation is a checker
 * people delete documentation to satisfy. Angle brackets and braces inside a
 * doc block would also unbalance the scan that finds the literal's end.
 */
const stripComments = (text: string): string =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');

/**
 * Locate `<macro><{ … }>` and split the literal body into top-level members.
 *
 * Returns `null` when the macro is absent. Returns an `errors` entry (and no
 * members) when the macro is present but not written as an inline type
 * literal — a bare type reference or the call-signature form. Both are
 * rejected on purpose: an unreadable declaration must never look like an
 * empty one.
 */
export function parseMacroTypeMembers(
  rawText: string,
  macro: string,
): MacroMembers | null {
  const text = stripComments(rawText);
  const needle = `${macro}<`;
  const start = text.indexOf(needle);

  if (start < 0) return null;

  let i = start + macro.length;
  let angle = 0;
  let curly = 0;
  let paren = 0;
  let bracket = 0;
  let end = -1;

  for (; i < text.length; i += 1) {
    const ch = text[i];

    // `=>` is an arrow, not a closing generic bracket. Without this guard a
    // function-typed member (`default?: () => unknown`) silently unbalances
    // the scan and the whole macro reads as malformed.
    if (ch === '>' && text[i - 1] === '=') continue;

    if (ch === '<') angle += 1;
    else if (ch === '>') {
      angle -= 1;
      if (angle === 0 && curly === 0 && paren === 0 && bracket === 0) {
        end = i;
        break;
      }
    } else if (ch === '{') curly += 1;
    else if (ch === '}') curly -= 1;
    else if (ch === '(') paren += 1;
    else if (ch === ')') paren -= 1;
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket -= 1;
  }

  if (end < 0) {
    return {
      members: [],
      errors: [`${macro}<...> type argument is unbalanced`],
    };
  }

  const inner = text.slice(start + needle.length, end).trim();

  if (!inner.startsWith('{') || !inner.endsWith('}')) {
    return {
      members: [],
      errors: [
        `${macro} must use an inline type literal, got ` +
          `\`${macro}<${inner.slice(0, 40)}>\``,
      ],
    };
  }

  return { members: splitTopLevelMembers(inner.slice(1, -1)), errors: [] };
}

/** Split a type-literal body on top-level `;` / `,` / newline separators. */
function splitTopLevelMembers(body: string): string[] {
  const out: string[] = [];
  let curly = 0;
  let paren = 0;
  let bracket = 0;
  let angle = 0;
  let start = 0;

  for (let i = 0; i < body.length; i += 1) {
    const ch = body[i];

    // See the arrow guard in parseMacroTypeMembers.
    if (ch === '>' && body[i - 1] === '=') continue;

    if (ch === '{') curly += 1;
    else if (ch === '}') curly -= 1;
    else if (ch === '(') paren += 1;
    else if (ch === ')') paren -= 1;
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket -= 1;
    else if (ch === '<') angle += 1;
    else if (ch === '>') angle -= 1;
    else if (
      (ch === ';' || ch === ',' || ch === '\n') &&
      curly === 0 &&
      paren === 0 &&
      bracket === 0 &&
      angle === 0
    ) {
      out.push(body.slice(start, i));
      start = i + 1;
    }
  }

  out.push(body.slice(start));

  return out
    .map((m) => m.replace(/\/\/.*$/gm, '').trim())
    .filter((m) => m.length > 0);
}

/**
 * Read a member's key. Returns `null` for the call-signature form
 * (`(e: 'change', v: T): void`) and for anything unparseable.
 */
export function memberKey(member: string): string | null {
  if (member.startsWith('(')) return null;

  const m = member.match(
    /^(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*\??\s*:/,
  );

  return m ? (m[1] ?? m[2] ?? m[3]) : null;
}
