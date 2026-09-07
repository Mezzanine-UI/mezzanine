import type { Component } from 'vue';
import type { DropdownOption } from '@mezzanine-ui/core/dropdown';
import type { DropdownProps } from '../dropdown/dropdown.types';

/**
 * What a breadcrumb item may be rendered as. React's list, with Vue's
 * `Component` standing in for `JSXElementConstructor`.
 */
export type BreadcrumbItemComponent = 'a' | 'span' | Component;

/**
 * React's three shapes — plain text, link, and dropdown — flattened into one
 * interface.
 *
 * The union is discriminated structurally: an item with `options` is a
 * dropdown, one with an `href` is a link, and anything else is text. Vue's
 * `defineProps` resolves a union like that into something unusable, so every
 * shape's props live here as optional. The prop names, their types and the
 * runtime behaviour are unchanged; what is lost is the compile-time guarantee
 * that, say, a text item cannot also carry `options`.
 *
 * `rel` is not here for the same reason it is not in React's extracted
 * contract: it comes from the native anchor props, and reaches the trigger
 * through the attributes.
 */
export interface BreadcrumbItemProps
  extends Omit<DropdownProps, 'onScroll' | 'options'> {
  /**
   * Override the component used to render the trigger. Defaults to `a` for a
   * link or a clickable item, and `span` otherwise.
   */
  component?: BreadcrumbItemComponent;
  /**
   * Whether this is the current page item.
   */
  current?: boolean;
  /**
   * The href of the breadcrumb link.
   */
  href?: string;
  /**
   * The id of the item. Falls back to `name` when the breadcrumb needs one.
   */
  id?: string;
  /**
   * The content of the breadcrumb item.
   */
  name: string;
  /**
   * Whether the dropdown is open. Only used by an item with `options`.
   */
  open?: boolean;
  /**
   * The dropdown options. Giving them is what makes the item a dropdown, so
   * unlike the dropdown's own contract they are optional here.
   */
  options?: DropdownOption[];
  /**
   * The target attribute specifies where to open the linked document.
   */
  target?: string;
}
