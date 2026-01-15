import { Children, ElementType, isValidElement, ReactNode } from 'react';
import type { AnchorItemData } from './AnchorItem';
import type { AnchorProps } from './Anchor';

/**
 * Extract text content from ReactNode, excluding Anchor components
 */
export function extractTextContent(node: ReactNode, AnchorComponent: ElementType): string {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map((n) => extractTextContent(n, AnchorComponent)).join('');
  }

  if (isValidElement(node)) {
    if (node.type === AnchorComponent) {
      return '';
    }

    return extractTextContent((node.props as { children?: ReactNode }).children, AnchorComponent);
  }

  return '';
}

/**
 * Parse children to extract anchor data
 */
export function parseChildren(
  children: ReactNode,
  AnchorComponent: ElementType,
): AnchorItemData[] {
  const items: AnchorItemData[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<AnchorProps>(child) && child.type === AnchorComponent) {
      const { children: nestedChildren, ...childProps } = child.props;

      let href: string | undefined;
      let id: string;
      let name: string;
      let nestedItems: AnchorItemData[] = [];

      if ('anchors' in childProps && childProps.anchors) {
        items.push(...childProps.anchors);

        return;
      }

      if ('href' in childProps) {
        href = childProps.href;
      }

      if (!href) {
        return;
      }

      if (typeof nestedChildren === 'string') {
        id = nestedChildren;
        name = nestedChildren;
      } else if (isValidElement(nestedChildren)) {
        nestedItems = parseChildren(nestedChildren, AnchorComponent);

        id = nestedItems[0]?.id || '';
        name = nestedItems[0]?.name || '';
      } else {
        const parsedNested = parseChildren(nestedChildren, AnchorComponent);

        if (parsedNested.length > 0) {
          nestedItems = parsedNested;
        }

        const textContent = extractTextContent(nestedChildren, AnchorComponent);

        id = textContent;
        name = textContent;
      }

      items.push({
        autoScrollTo: 'autoScrollTo' in childProps ? childProps.autoScrollTo : undefined,
        children: nestedItems.length > 0 ? nestedItems : undefined,
        disabled: 'disabled' in childProps ? childProps.disabled : undefined,
        href,
        id,
        name,
        onClick: 'onClick' in childProps ? childProps.onClick : undefined,
        title: 'title' in childProps ? childProps.title : undefined,
      });
    }
  });

  return items;
}
