'use client';

import { Children, isValidElement, ReactElement, ReactNode, Ref } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import Anchor from './Anchor';
import { AnchorItemData } from './AnchorItem';
import type { AnchorProps, AnchorPropsWithChildren } from './Anchor';
import { cx } from '../utils/cx';

type AnchorElement = ReactElement<AnchorPropsWithChildren>;
type OnlyAnchorChildren = AnchorElement | AnchorElement[];

function parseChildren(children: ReactNode): AnchorItemData[] {
  const items: AnchorItemData[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement<AnchorProps>(child) && child.type === Anchor) {
      const { children: nestedChildren, ...childProps } = child.props;

      let id: string;
      let name: string;
      let href: string | undefined;
      let nestedItems: AnchorItemData[] = [];

      if ('anchors' in childProps && childProps.anchors) {
        items.push(...childProps.anchors);
        return;
      }

      // Get href from props (required)
      if ('href' in childProps) {
        href = childProps.href;
      }

      // Skip this anchor if no href is provided
      if (!href) {
        return;
      }

      if (typeof nestedChildren === 'string') {
        id = nestedChildren;
        name = nestedChildren;
      } else if (isValidElement(nestedChildren)) {
        nestedItems = parseChildren(nestedChildren);

        id = nestedItems[0]?.id || '';
        name = nestedItems[0]?.name || '';
      } else {
        const parsedNested = parseChildren(nestedChildren);

        if (parsedNested.length > 0) {
          nestedItems = parsedNested;
        }

        const textContent = extractTextContent(nestedChildren);
        id = textContent;
        name = textContent;
      }

      items.push({
        children: nestedItems.length > 0 ? nestedItems : undefined,
        disabled: 'disabled' in childProps ? childProps.disabled : undefined,
        href,
        id,
        name,
        onClick: 'onClick' in childProps ? childProps.onClick : undefined,
      });
    }
  });

  return items;
}

function extractTextContent(node: ReactNode): string {
  if (typeof node === 'string') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(extractTextContent).join('');
  }

  if (isValidElement(node)) {
    if (node.type === Anchor) {
      return '';
    }
    return extractTextContent((node.props as { children?: ReactNode }).children);
  }

  return '';
}

export interface AnchorGroupPropsWithAnchors {
  anchors: AnchorProps['anchors'];
  children?: never;
}

export interface AnchorGroupPropsWithChildren {
  anchors?: never;
  children: OnlyAnchorChildren;
}

type AnchorGroupBaseProps = AnchorGroupPropsWithAnchors | AnchorGroupPropsWithChildren;

export type AnchorGroupProps = AnchorGroupBaseProps & {
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/**
 * The `mezzanine` AnchorGroup component renders a group of anchor links,
 * configured via an `anchors` prop or parsed from `Anchor` child components.
 *
 * ```tsx
 * // Using children
 * <AnchorGroup>
 *   <Anchor href="#section1">Section 1</Anchor>
 *   <Anchor href="#section2">Section 2</Anchor>
 * </AnchorGroup>
 * ```
 *
 * ```tsx
 * // Using anchors prop
 * <AnchorGroup anchors={[
 *   { id: 'section1', name: 'Section 1', href: '#section1' },
 *   { id: 'section2', name: 'Section 2', href: '#section2' }
 * ]} />
 * ```
 */

function AnchorGroup(props: AnchorGroupProps) {
  const { ref, className } = props;

  const anchorItems: AnchorItemData[] =
    'anchors' in props && props.anchors
      ? props.anchors
      : 'children' in props && props.children
        ? parseChildren(props.children)
        : [];

  return (
    <div ref={ref} className={cx(classes.group, className)}>
      <Anchor anchors={anchorItems} />
    </div>
  );
}

export default AnchorGroup;
