import type { JSXElementConstructor, ReactElement } from 'react';
import type {
  ComponentOverridableForwardRefComponentPropsFactory,
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';

export type BreadcrumbProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'nav'>,
  'children'
> &
  (
    | {
        /**
         * Display only the last two items with an ellipsis dropdown for all previous items
         */
        condensed?: boolean;
        items: Array<BreadcrumbItemProps>;
        children?: never;
      }
    | {
        condensed?: boolean;
        items?: never;
        children:
          | ReactElement<BreadcrumbItemProps>
          | ReactElement<BreadcrumbItemProps>[];
      }
  );

export type BreadcrumbItemComponent =
  | 'a'
  | 'button'
  | JSXElementConstructor<any>;

export type BreadcrumbItemProps<C extends BreadcrumbItemComponent = 'button'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    BreadcrumbItemComponent,
    C,
    | BreadcrumbDropdownItemProps
    | BreadcrumbItemTextProps
    | BreadcrumbLinkItemProps
  >;

export type BreadcrumbDropdownItemProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'children'
> & {
  component?: 'button';
  /**
   * Whether is the current page item.
   */
  current?: boolean;
  /**
   * Whether to expand the dropdown item icon.
   */
  expand?: boolean;
  href?: string;
  name?: string;
  /**
   * The dropdown options.
   */
  options: Array<{
    /**
     * The href of dropdown item.
     */
    href?: string;
    id?: string;
    /**
     * The content of dropdown item.
     */
    name?: string;
    target?: '_blank' | '_parent' | '_self' | '_top' | string;
    options?: Array<{
      href?: string;
      id?: string;
      name?: string;
      target?: '_blank' | '_parent' | '_self' | '_top' | string;
    }>;
  }>;
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
};

export type BreadcrumbItemTextProps = {
  component?: 'div';
  /**
   * Whether is the current page item.
   */
  current?: boolean;
  expand?: never;
  href?: never;
  /**
   * The content of breadcrumb text.
   */
  name: string;
  options?: never;
  target?: never;
};

export type BreadcrumbLinkItemProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'a'>,
  'children'
> & {
  component?: 'a';
  current?: boolean;
  expand?: never;
  /**
   * The href of breadcrumb link.
   */
  href: string;
  name: string;
  options?: never;
  /**
   * The target attribute specifies where to open the linked document.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
};
