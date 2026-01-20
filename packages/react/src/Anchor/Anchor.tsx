'use client';

import { Fragment, ReactElement } from 'react';
import AnchorItem, { AnchorItemData } from './AnchorItem';
import { parseChildren } from './utils';

export interface AnchorPropsWithAnchors {
  /**
   * ```tsx
   * interface AnchorItemData {
   *   autoScrollTo?: boolean;
   *   children?: AnchorItemData[];
   *   disabled?: boolean;
   *   href: string;
   *   id: string;
   *   name: string;
   *   onClick?: VoidFunction;
   *   title?: string;
   * }
   * ```
   */
  anchors: AnchorItemData[];
  children?: never;
}

export interface AnchorPropsWithChildren {
  anchors?: never;
  /**
   * Whether to enable smooth scrolling to the target element when clicked.
   */
  autoScrollTo?: boolean;
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
  children:
  | string
  | ReactElement<AnchorPropsWithChildren, typeof Anchor>
  | Array<string | ReactElement<AnchorPropsWithChildren, typeof Anchor>>;
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
  title?: string;
}

export type AnchorProps = AnchorPropsWithAnchors | AnchorPropsWithChildren;

/**
 * The `mezzanine` Anchor component provides navigation menu for page sections with automatic hash tracking.
 * Nested structure supports up to 3 levels; deeper levels will be ignored.
 */
function Anchor(props: AnchorProps) {
  const anchorItems: AnchorItemData[] =
    'anchors' in props && props.anchors
      ? props.anchors
      : 'children' in props && props.children
        ? parseChildren(props.children, Anchor)
        : [];

  return (
    <Fragment>
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
    </Fragment>
  );
}

export default Anchor;
