import { JSXElementConstructor } from 'react';
import {
  ComponentOverridableForwardRefComponentPropsFactory,
  NativeElementPropsWithoutKeyAndRef,
} from 'react/src/utils/jsx-types';

export interface BreadcrumbProps
  extends Omit<NativeElementPropsWithoutKeyAndRef<'nav'>, 'children'> {
  items: Array<BreadcrumbItemProps>;
  /**
   * only display the last two items with ellipsis
   */
  condensed?: boolean;
}

export type BreadcrumbItemComponent =
  | 'button'
  | 'a'
  | JSXElementConstructor<any>;

export type BreadcrumbItemProps<C extends BreadcrumbItemComponent = 'button'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    BreadcrumbItemComponent,
    C,
    | BreadcrumbDropdownItemProps
    | BreadcrumbItemTextProps
    | BreadcrumbLinkItemProps
  >;

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
  label: string;
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
  label: string;
  options?: never;
  target?: '_self' | '_blank' | '_parent' | '_top' | string;
};

export type BreadcrumbDropdownItemProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'button'>,
  'children'
> & {
  component?: 'button';
  current?: boolean;
  /**
   * Whether to expand the dropdown item icon.
   */
  expand: boolean;
  href?: never;
  label?: string;
  /**
   * The dropdown options.
   */
  options: Array<{
    id?: string;
    /**
     * The content of dropdown item.
     */
    label: string;
    /**
     * The href of dropdown item.
     */
    href?: string;
    target?: '_self' | '_blank' | '_parent' | '_top' | string;
  }>;
  target?: never;
};
