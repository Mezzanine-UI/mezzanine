#!/usr/bin/env tsx
/**
 * Static check: every `<slot>` a component renders is declared in
 * `defineSlots`, and every declared slot is actually rendered.
 *
 * Slots are the sanctioned escape hatch for React's `ReactNode` props, so
 * they are part of the public API — but they are invisible to a prop-name
 * differ. This is the Vue analogue of `check-ng-content-selectors.mjs`,
 * which exists because an unmatched Angular projection selector renders
 * *nothing*, and an empty slot looks perfectly legitimate in a DOM diff.
 *
 * Usage:  npx tsx tools/parity/check-vue-slots.ts
 */
import { readFileSync } from 'node:fs';
import { parse } from '@vue/compiler-sfc';
import { memberKey, parseMacroTypeMembers } from './vue-macros.ts';
// @ts-expect-error -- plain .mjs helper, no type declarations by design
import { report, vueRoot, walk } from './vue-fs.mjs';

type AstNode = {
  type: number;
  tag?: string;
  props?: { type: number; name?: string; value?: { content?: string } }[];
  children?: AstNode[];
};

const ELEMENT = 1;
const ATTRIBUTE = 6;

/** Collect the names of every `<slot>` rendered in a template AST. */
function collectRenderedSlots(node: AstNode, out: Set<string>): void {
  if (node.type === ELEMENT && node.tag === 'slot') {
    const nameAttr = node.props?.find(
      (p) => p.type === ATTRIBUTE && p.name === 'name',
    );

    out.add(nameAttr?.value?.content ?? 'default');
  }

  for (const child of node.children ?? []) collectRenderedSlots(child, out);
}

const files: string[] = await walk(vueRoot, (n: string) => n.endsWith('.vue'));
const problems: { file: string; line?: number; reason: string }[] = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const { descriptor, errors: parseErrors } = parse(src, { filename: file });

  if (parseErrors.length > 0) {
    for (const e of parseErrors) {
      problems.push({ file, reason: `SFC parse error: ${e.message}` });
    }
    continue;
  }

  const rendered = new Set<string>();

  if (descriptor.template?.ast) {
    collectRenderedSlots(
      descriptor.template.ast as unknown as AstNode,
      rendered,
    );
  }

  const script = `${descriptor.scriptSetup?.content ?? ''}\n${descriptor.script?.content ?? ''}`;
  const parsedSlots = parseMacroTypeMembers(script, 'defineSlots');
  const declared = new Set<string>();

  for (const e of parsedSlots?.errors ?? []) problems.push({ file, reason: e });

  for (const member of parsedSlots?.members ?? []) {
    const key = memberKey(member);

    if (key) declared.add(key);
    else
      problems.push({
        file,
        reason: `unparseable defineSlots member: \`${member.slice(0, 40)}\``,
      });
  }

  // A component with no slots at all needs no declaration.
  if (rendered.size === 0 && !parsedSlots) continue;

  if (rendered.size > 0 && !parsedSlots) {
    problems.push({
      file,
      reason:
        `renders slot(s) [${[...rendered].sort().join(', ')}] but declares no ` +
        '`defineSlots`. Slots are public API — declare and document them.',
    });
    continue;
  }

  for (const name of [...rendered].sort()) {
    if (!declared.has(name)) {
      problems.push({
        file,
        reason: `<slot name="${name}"> is rendered but not declared in defineSlots`,
      });
    }
  }

  for (const name of [...declared].sort()) {
    if (!rendered.has(name)) {
      problems.push({
        file,
        reason: `defineSlots declares "${name}" but no matching <slot> is rendered`,
      });
    }
  }
}

report('vue slot declaration check', files.length, problems);
