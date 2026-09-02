/**
 * Shared file walking for the Vue static checks.
 */
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const vueRoot = resolve(repoRoot, 'packages', 'vue');

const IGNORE = new Set(['node_modules', 'dist', '.git', 'coverage']);

export async function walk(dir, predicate) {
  const out = [];
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const entry of entries) {
    if (IGNORE.has(entry.name) || entry.name.startsWith('.')) continue;

    const full = resolve(dir, entry.name);

    if (entry.isDirectory()) out.push(...(await walk(full, predicate)));
    else if (entry.isFile() && predicate(entry.name)) out.push(full);
  }

  return out;
}

export const rel = (f) => f.replace(`${repoRoot}/`, '');

/** Print a violation report and exit with the conventional code. */
export function report(name, scanned, problems) {
  if (problems.length === 0) {
    console.log(`${name}: ${scanned} file(s) scanned, 0 problems.`);
    process.exit(0);
  }

  console.error(`${name}: ${problems.length} problem(s):\n`);

  for (const p of problems) {
    console.error(`  ${rel(p.file)}${p.line ? `:${p.line}` : ''}`);
    console.error(`    ${p.reason}\n`);
  }

  process.exit(1);
}
