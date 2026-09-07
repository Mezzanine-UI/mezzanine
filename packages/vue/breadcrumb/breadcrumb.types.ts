import type { BreadcrumbItemProps } from './breadcrumb-item.types';

/**
 * React's two members — items as data, or items as children — flattened into
 * one interface, since `defineProps` cannot resolve a union that discriminates
 * on which of two props is present.
 */
export interface BreadcrumbProps {
  /**
   * Display only the last two items with an ellipsis dropdown for all previous items
   */
  condensed?: boolean;
  /**
   * The items, as data. The default slot is the other way to give them.
   */
  items?: BreadcrumbItemProps[];
}
