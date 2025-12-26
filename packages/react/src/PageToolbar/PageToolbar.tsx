import { forwardRef, ReactElement } from 'react';
import { pageToolbarClasses as classes } from '@mezzanine-ui/core/page-toolbar';
import { ButtonGroup, ButtonProps } from '../Button';
import { SearchInputProps } from '../Input';
import { SelectProps } from '../Select';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  renderActionsProp,
  renderFilterProp,
  renderIconButtonsProp,
  resolvePageToolbarChild,
} from './utils';

// TODO: Replace with actual SegmentedControlProps when SegmentedControl component is complete
type SegmentedControlProps = {
  mock: 'SegmentedControlProps';
};

type PageToolbarChild =
  | ReactElement<
      SearchInputProps | SelectProps | SegmentedControlProps | ButtonProps
    >
  | null
  | false
  | undefined;

/**
 * Props for the PageToolbar component.
 *
 * PageToolbar provides a flexible toolbar layout for page-level actions,
 * including filter components, action buttons, and utility buttons.
 *
 * @example
 * ```tsx
 * <PageToolbar
 *   size="main"
 *   filter={{ variant: 'search', placeholder: 'Search...' }}
 *   actions={{
 *     primaryButton: { children: 'Save' },
 *     secondaryButton: { children: 'Cancel' },
 *   }}
 *   utilities={[{ icon: { src: settingsIcon }, title: 'Settings' }]}
 * />
 * ```
 */
export type PageToolbarProps = Omit<
  NativeElementPropsWithoutKeyAndRef<'div'>,
  'children'
> & {
  /**
   * Button configuration for primary, secondary, and destructive actions. <br />
   * Automatically applies proper styling and order. <br />
   */
  actions?: {
    destructiveButton?: ButtonProps;
    primaryButton?: ButtonProps;
    secondaryButton?: ButtonProps;
  };
  /**
   * Children elements: <br />
   * - Filter component (SearchInput, Select, or SegmentedControl) <br />
   * - Action buttons `<Button />` <br />
   * - Icon-only utility buttons `<Button icon="..." />` <br />
   * <br />
   * Can mix and match the above children. <br />
   * The order of children does not matter as they will be arranged properly. <br />
   * When conflicting with other props, props take priority over children. <br />
   */
  children?: PageToolbarChild[] | PageToolbarChild;
  /** Filter component (SearchInput, Select, or SegmentedControl) */
  filter?: { variant: 'search' | 'select' | 'segmentedControl' } & (
    | SearchInputProps
    | SelectProps
    | SegmentedControlProps
  );
  /**
   * Size variant of the toolbar. <br />
   * Affects the size of buttons and filter component. <br />
   */
  size?: 'main' | 'sub';
  /**
   * Icon-only utility buttons `<Button icon="..." />`. <br />
   * They usually appear as smaller buttons with only an icon and no text.
   */
  utilities?: (ButtonProps & {
    icon: { src: IconDefinition };
  })[];
};

/**
 * PageToolbar component provides a flexible toolbar with filter, action buttons, and utility icons.
 * Commonly used in page headers for primary user actions.
 */
const PageToolbar = forwardRef<HTMLDivElement, PageToolbarProps>(
  function PageToolbar(props, ref) {
    const {
      actions,
      children,
      className,
      filter,
      size = 'main',
      utilities,
      ...rest
    } = props;

    const renderFilter = renderFilterProp(filter, size);
    const renderActions = actions ? renderActionsProp(actions, size) : null;
    const renderUtilities = utilities
      ? renderIconButtonsProp(utilities, size)
      : null;

    const {
      filter: filterFromChildren,
      actions: actionsFromChildren,
      utilities: utilitiesFromChildren,
    } = resolvePageToolbarChild(children, size);

    return (
      <div
        {...rest}
        className={cx(classes.host, classes.size(size), className)}
        ref={ref}
      >
        {renderFilter || filterFromChildren}
        <ButtonGroup>{renderActions || actionsFromChildren}</ButtonGroup>
        <ButtonGroup>{renderUtilities || utilitiesFromChildren}</ButtonGroup>
      </div>
    );
  },
);

export default PageToolbar;
