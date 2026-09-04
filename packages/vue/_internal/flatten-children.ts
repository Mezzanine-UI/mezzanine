import { Comment, Fragment, Text } from 'vue';
import type { VNode, VNodeArrayChildren } from 'vue';

/**
 * Flatten a slot's output into the vnodes a parent can actually operate on,
 * the way React's `Children.toArray` does.
 *
 * A `v-for` compiles to a single Fragment holding the list, so a component
 * that clones its children — to inject props, as ButtonGroup and Stepper do —
 * sees one Fragment instead of the items and silently clones nothing useful.
 * Comment nodes (`v-if` placeholders) and whitespace-only text are dropped for
 * the same reason React drops `null` and `false`.
 */
export function flattenChildren(children: VNodeArrayChildren = []): VNode[] {
  const out: VNode[] = [];

  for (const child of children) {
    if (child === null || child === undefined || typeof child === 'boolean') {
      continue;
    }

    if (Array.isArray(child)) {
      out.push(...flattenChildren(child));
      continue;
    }

    if (typeof child === 'string' || typeof child === 'number') continue;

    const vnode = child as VNode;

    if (vnode.type === Comment) continue;

    if (vnode.type === Fragment) {
      out.push(
        ...flattenChildren(vnode.children as VNodeArrayChildren | undefined),
      );
      continue;
    }

    if (vnode.type === Text && !String(vnode.children ?? '').trim()) continue;

    out.push(vnode);
  }

  return out;
}
