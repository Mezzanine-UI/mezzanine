import type { JSXElementConstructor, ReactElement } from 'react';
import type {
  ComponentOverridableForwardRefComponentPropsFactory,
  NativeElementPropsWithoutKeyAndRef,
} from '../utils/jsx-types';
import type { DropdownProps } from '../Dropdown';

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

export type BreadcrumbItemComponent = 'a' | 'span' | JSXElementConstructor<any>;

export type BreadcrumbItemProps<C extends BreadcrumbItemComponent = 'span'> =
  | Omit<
      ComponentOverridableForwardRefComponentPropsFactory<
        BreadcrumbItemComponent,
        C,
        BreadcrumbItemTextProps | BreadcrumbLinkItemProps
      >,
      'children' | 'onSelect'
    >
  | BreadcrumbDropdownProps;

export type BreadcrumbItemTextProps = {
  component?: 'span';
  /**
   * Whether is the current page item.
   */
  current?: boolean;
  href?: never;
  id?: string;
  /**
   * The content of breadcrumb item text.
   */
  name: string;
  onClick?: never;
  target?: never;
};

export type BreadcrumbLinkItemProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'a'>,
  'children'
> & {
  component?: 'a';
  current?: boolean;
  /**
   * The href of breadcrumb link.
   */
  href: string;
  id?: string;
  name: string;
  onClick?: () => void;
  /**
   * The target attribute specifies where to open the linked document.
   */
  target?: '_blank' | '_parent' | '_self' | '_top' | string;
};

export type BreadcrumbDropdownProps = Omit<DropdownProps, 'children'> & {
  className?: string;
  current?: boolean;
  href?: never;
  id?: string;
  name: string;
  onClick?: () => void;
  open?: boolean;
  target?: never;
};
