import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export type DeviationKey = `${string}::${string}::${string}`;

const FILE = resolve(process.cwd(), 'DEVIATIONS.md');

/**
 * Parses DEVIATIONS.md and returns a Set of `component::story::kind` keys to suppress.
 *
 * Expected table format (pipes, with header + separator row):
 *
 * | Component | Story | Kind | React | Angular | Reason | Approved |
 * |-----------|-------|------|-------|---------|--------|----------|
 * | dialog    | *     | tag  | <div> | <ng...> | reason | 2026-04-08 |
 *
 * `*` in Story matches any story for that component+kind.
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
      .map((c) => c.trim());
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
  return (
    suppressions.has(`${component}::${story}::${kind}` as DeviationKey) ||
    suppressions.has(`${component}::*::${kind}` as DeviationKey)
  );
}
