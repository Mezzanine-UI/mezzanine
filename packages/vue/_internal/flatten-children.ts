import { Comment, createTextVNode, Fragment, Text } from 'vue';
import type { VNode, VNodeArrayChildren, VNodeChild } from 'vue';

export interface FlattenChildrenOptions {
  /**
   * Keep text among the results instead of dropping it.
   *
   * The callers that clone their children to inject props have no use for text
   * and are better off without it, so it goes by default. Accordion is the
   * other kind of caller: the children it does not recognise become the
   * accordion's content, text included.
   * @default false
   */
  keepText?: boolean;
}

/**
 * Flatten a slot's output into the vnodes a parent can actually operate on,
 * the way React's `Children.toArray` does.
 *
 * A `v-for` compiles to a single Fragment holding the list, so a component
 * that clones its children — to inject props, as ButtonGroup and Stepper do —
 * sees one Fragment instead of the items and silently clones nothing useful.
 * Comment nodes (`v-if` placeholders) and whitespace-only text are dropped for
 * the same reason React drops `null` and `false`.
 *
 * A slot normally hands back an array, but one written as a bare `h(...)` hands
 * back the node itself. `Children.toArray` takes either, so this does too.
 */
export function flattenChildren(
  children: VNodeArrayChildren | VNodeChild = [],
  options: FlattenChildrenOptions = {},
): VNode[] {
  const { keepText = false } = options;
  const out: VNode[] = [];

  for (const child of Array.isArray(children) ? children : [children]) {
    if (child === null || child === undefined || typeof child === 'boolean') {
      continue;
    }

    if (Array.isArray(child)) {
      out.push(...flattenChildren(child, options));
      continue;
    }

    if (typeof child === 'string' || typeof child === 'number') {
      if (keepText) out.push(createTextVNode(String(child)));
      continue;
    }

    const vnode = child as VNode;

    if (vnode.type === Comment) continue;

    if (vnode.type === Fragment) {
      out.push(
        ...flattenChildren(
          vnode.children as VNodeArrayChildren | undefined,
          options,
        ),
      );
      continue;
    }

    if (
      vnode.type === Text &&
      !keepText &&
      !String(vnode.children ?? '').trim()
    )
      continue;

    out.push(vnode);
  }

  return out;
}
