import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type DeviationKey = `${string}::${string}::${string}`;

const FILE = resolve(process.cwd(), 'DEVIATIONS.md');

/**
 * Strip markdown emphasis wrappers (`**`, `__`, `*`, `_`, `` ` ``) that
 * prettier/formatters may add around cell contents. E.g. a story name
 * of literal `__api__` in source gets normalized by prettier to the
 * markdown-bold form `**api**` when prettier sees the underscores as
 * emphasis. Normalizing both sides to the bare token `api` makes the
 * suppression match robust against either formatting.
 */
function stripEmphasis(cell: string): string {
  let s = cell.trim();
  const wrappers = ['**', '__', '`', '*', '_'];
  let changed = true;
  while (changed) {
    changed = false;
    for (const w of wrappers) {
      if (s.startsWith(w) && s.endsWith(w) && s.length > 2 * w.length) {
        s = s.slice(w.length, s.length - w.length);
        changed = true;
        break;
      }
    }
  }
  return s;
}

/**
 * Parses DEVIATIONS.md and returns a Set of `component::story::kind` keys to suppress.
 *
 * Expected table format (pipes, with header + separator row):
 *
 * | Component | Story | Kind | React | Angular | Reason | Approved |
 * |-----------|-------|------|-------|---------|--------|----------|
 * | dialog    | *     | tag  | <div> | <ng...> | reason | 2026-04-08 |
 *
 * `*` in Story matches any story for that component+kind. Cell values
 * are passed through `stripEmphasis` so markdown-bold/italic/code
 * wrappers are tolerated.
 */
export function loadDeviations(): Set<DeviationKey> {
  const out = new Set<DeviationKey>();
  if (!existsSync(FILE)) return out;
  const text = readFileSync(FILE, 'utf-8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line.startsWith('|')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => stripEmphasis(c));
    if (cells.length < 3) continue;
    const [component, story, kind] = cells;
    if (!component || component === 'Component' || /^[-:]+$/.test(component))
      continue;
    out.add(`${component}::${story}::${kind}` as DeviationKey);
  }
  return out;
}

export function isSuppressed(
  suppressions: Set<DeviationKey>,
  component: string,
  story: string,
  kind: string,
): boolean {
  // Normalize incoming story/kind too — compare.ts may pass `__api__`
  // literally, which after `stripEmphasis` becomes `api`, matching
  // the normalized deviation key regardless of how prettier formatted
  // the source table.
  const normStory = stripEmphasis(story);
  const normKind = stripEmphasis(kind);
  return (
    suppressions.has(
      `${component}::${normStory}::${normKind}` as DeviationKey,
    ) || suppressions.has(`${component}::*::${normKind}` as DeviationKey)
  );
}
