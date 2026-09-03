import type { AnchorItemData } from './anchor-item.types';

export interface AnchorPropsWithAnchors {
  /**
   * ```ts
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
}

export interface AnchorPropsWithChildren {
  /** 此模式下不適用。 */
  anchors?: never;
  /**
   * Whether to enable smooth scrolling to the target element when clicked.
   */
  autoScrollTo?: boolean;
  /**
   * Whether the anchor is disabled.
   * If a parent anchor is disabled, all of its children are disabled too.
   */
  disabled?: boolean;
  /**
   * Required when used as a child component.
   */
  href?: string;
  /**
   * Shown as the link's tooltip.
   */
  title?: string;
}

export type AnchorProps = AnchorPropsWithAnchors | AnchorPropsWithChildren;
