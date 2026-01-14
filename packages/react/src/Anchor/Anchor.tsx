'use client';

import { Children, isValidElement, ReactElement, ReactNode, Ref } from 'react';
import { anchorClasses as classes } from '@mezzanine-ui/core/anchor';
import { cx } from '../utils/cx';
import AnchorItem, { AnchorItemData } from './AnchorItem';

interface AnchorPropsWithAnchors {
  anchors: AnchorItemData[];
  children?: never;
  className?: string;
  // onClick?: VoidFunction;
  ref?: Ref<HTMLDivElement>;
}

type AnchorChild = ReactElement<AnchorPropsWithChildren> | string;

export interface AnchorPropsWithChildren {
  anchors?: never;
  /**
   * Use nested `<Anchor>` components to create hierarchical navigation. <br />
   * Only accepts `<Anchor>` components and text content as children. <br />
   * ```tsx
   * <AnchorGroup>
   *   <Anchor href="#acr1">ACR 1</Anchor>
   *   <Anchor href="#acr2">
   *     anchor 2
   *     <Anchor href="#acr2-1">ACR 2-1</Anchor>
   *     <Anchor href="#acr2-2">ACR 2-2</Anchor>
   *   </Anchor>
   * </AnchorGroup>
   * ```
   */
  children: AnchorChild | AnchorChild[];
  className?: string;
  /**
   * Whether the anchor is disabled.<br>
   * If parent anchor is disabled, all its children will be disabled too. <br />
   */
  disabled?: boolean;
  /**
   * Required when used as child component.
   */
  href?: string;
  /**
   * Trigger when user click on any anchor.
   */
  onClick?: VoidFunction;
  ref?: Ref<HTMLDivElement>;
  title?: string;
}

export type AnchorProps = AnchorPropsWithAnchors | AnchorPropsWithChildren;

/**
 * Extract text content from ReactNode
 */
function extractTextContent(node: ReactNode, AnchorComponent: any): string {
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
function parseChildren(
  children: ReactNode,
  AnchorComponent: any,
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
        children: nestedItems.length > 0 ? nestedItems : undefined,
        disabled: 'disabled' in childProps ? childProps.disabled : undefined,
        href,
        id,
        name,
        onClick: ('onClick' in childProps ? childProps.onClick : undefined),
      });
    }
  });

  return items;
}

/**
 * The `mezzanine` Anchor component provides navigation menu for page sections with automatic hash tracking.
 * Nested structure supports up to 3 levels; deeper levels will be ignored.
 */
function Anchor(props: AnchorProps) {
  const {
    anchors,
    children,
    className,
    disabled: _disabled,
    href: _href,
    ref,
  } = props as AnchorPropsWithAnchors & AnchorPropsWithChildren;

  const anchorItems: AnchorItemData[] = anchors
    ? anchors
    : children
      ? parseChildren(children, Anchor)
      : [];

  return (
    <div
      ref={ref}
      className={cx(classes.host, className)}
    >
      {anchorItems.map((anchorItem) => (
        <AnchorItem
          autoScrollTo={anchorItem.autoScrollTo}
          disabled={anchorItem.disabled}
          href={anchorItem.href}
          id={anchorItem.id}
          key={anchorItem.id}
          name={anchorItem.name}
          onClick={anchorItem.onClick}
          subAnchors={anchorItem.children}
          title={anchorItem.title}
        />
      ))}
    </div>
  );
}

export default Anchor;
