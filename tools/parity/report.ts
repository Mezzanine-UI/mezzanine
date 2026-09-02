import type { Diff } from './compare.ts';

function kindLabels(targetLabel: string): Record<Diff['kind'], string> {
  return {
    tag: 'TAG',
    attr: 'ATTR',
    style: 'STYLE',
    text: 'TEXT',
    args: 'ARGS',
    missing: 'MISSING (only in React)',
    extra: `EXTRA (only in ${targetLabel})`,
    error: 'ERROR',
    input: 'INPUT',
    output: 'OUTPUT',
  };
}

export function renderReport(
  component: string,
  diffs: Diff[],
  targetLabel = 'Angular',
): string {
  const KIND_LABEL = kindLabels(targetLabel);
  const targetKey = targetLabel.toLowerCase();
  if (diffs.length === 0) {
    return `# ${component}\n\nPARITY OK — no diffs.\n`;
  }
  const byStory = new Map<string, Diff[]>();
  for (const d of diffs) {
    const arr = byStory.get(d.story) ?? [];
    arr.push(d);
    byStory.set(d.story, arr);
  }
  const lines: string[] = [
    `# ${component}`,
    ``,
    `${diffs.length} diff(s) across ${byStory.size} story(ies).`,
    ``,
  ];
  for (const [story, items] of [...byStory.entries()].sort()) {
    lines.push(`## ${story}  (${items.length})`);
    for (const d of items) {
      lines.push(`  - [${KIND_LABEL[d.kind]}] ${d.path}`);
      if (d.react !== undefined)
        lines.push(`      react:  ${truncate(d.react)}`);
      if (d.target !== undefined)
        lines.push(`      ${targetKey}: ${truncate(d.target)}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

function truncate(value: unknown): string {
  const s = typeof value === 'string' ? value : JSON.stringify(value);
  return s.length > 200 ? `${s.slice(0, 197)}...` : s;
}
