import { Comment, Fragment, Text, type Component, type VNode } from 'vue';
import type { AnchorItemData } from './anchor-item.types';

/** Flatten fragments so nested template groups behave like a flat child list. */
function flatten(nodes: VNode[]): VNode[] {
  return nodes.flatMap((node) =>
    node.type === Fragment && Array.isArray(node.children)
      ? flatten(node.children as VNode[])
      : [node],
  );
}

/**
 * Normalise anything a slot or a children field may hold into vnodes. A slot
 * is free to return a bare string or a single vnode rather than an array —
 * `h(Comp, props, () => 'text')` does exactly that — so this has to cope with
 * all three shapes.
 */
function toVNodes(value: unknown): VNode[] {
  if (value == null || typeof value === 'boolean') return [];

  if (Array.isArray(value)) return flatten(value as VNode[]);

  if (typeof value === 'string' || typeof value === 'number') {
    return [{ type: Text, children: String(value) } as VNode];
  }

  return flatten([value as VNode]);
}

/** The children of a vnode, whether they arrived as a slot, an array or text. */
function childrenOf(node: VNode): VNode[] {
  const { children } = node;

  if (children && typeof children === 'object' && !Array.isArray(children)) {
    const slot = (children as { default?: () => unknown }).default;

    if (typeof slot === 'function') return toVNodes(slot());
  }

  return toVNodes(children);
}

/**
 * Extract text content from a node tree, skipping anchors themselves.
 * Mirrors React's `extractTextContent`.
 */
export function extractTextContent(
  nodes: VNode[],
  anchorComponent: Component,
): string {
  return nodes
    .map((node) => {
      if (node.type === Text) return String(node.children ?? '');
      if (node.type === Comment) return '';
      if (node.type === anchorComponent) return '';

      return extractTextContent(childrenOf(node), anchorComponent);
    })
    .join('');
}

/**
 * Parse slot children into anchor data. Mirrors React's `parseChildren`,
 * including its precedence: an `anchors` prop on a child replaces that child
 * entirely, an anchor without `href` is dropped, and a nested single element
 * lends its first parsed item's id and name to its parent.
 */
export function parseChildren(
  nodes: VNode[],
  anchorComponent: Component,
): AnchorItemData[] {
  const items: AnchorItemData[] = [];

  for (const node of flatten(nodes)) {
    if (node.type === Text || node.type === Comment) continue;

    if (node.type !== anchorComponent) {
      const name =
        typeof node.type === 'string'
          ? node.type
          : ((node.type as { name?: string })?.name ?? 'Unknown');

      console.warn(
        `[Anchor] Invalid child type: <${name}>. Only <MznAnchor> components or strings are allowed as children. This element will be ignored.`,
      );

      continue;
    }

    const props = (node.props ?? {}) as {
      anchors?: AnchorItemData[];
      autoScrollTo?: boolean;
      disabled?: boolean;
      href?: string;
      onClick?: VoidFunction;
      title?: string;
    };

    if (props.anchors) {
      items.push(...props.anchors);
      continue;
    }

    const { href } = props;

    if (!href) continue;

    const nested = childrenOf(node);
    const nestedItems = parseChildren(nested, anchorComponent);
    const onlyText =
      nested.length === 1 && nested[0].type === Text
        ? String(nested[0].children ?? '')
        : undefined;

    const identity =
      onlyText ??
      (nested.length === 1 && nestedItems.length > 0
        ? nestedItems[0].id
        : extractTextContent(nested, anchorComponent));

    items.push({
      autoScrollTo: props.autoScrollTo,
      children: nestedItems.length > 0 ? nestedItems : undefined,
      disabled: props.disabled,
      href,
      id: identity,
      name:
        onlyText ??
        (nested.length === 1 && nestedItems.length > 0
          ? nestedItems[0].name
          : extractTextContent(nested, anchorComponent)),
      onClick: props.onClick,
      title: props.title,
    });
  }

  return items;
}
