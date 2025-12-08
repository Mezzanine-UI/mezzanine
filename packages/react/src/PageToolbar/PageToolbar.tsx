import {
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  ReactElement,
} from 'react';
import { pageToolbarClasses as classes } from '@mezzanine-ui/core/page-toolbar';
import Button, { ButtonGroup, ButtonGroupChild, ButtonProps } from '../Button';
import { SearchInputProps } from '../Input';
import { SelectProps } from '../Select';
import Tooltip from '../Tooltip';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

type SegmentedControlProps = {
  mock: 'SegmentedControlProps';
};

/**
 * Actions configuration for PageToolbar.
 * Can be either an object with specific button types or a single button element/props.
 */
type PageToolbarActions =
  | {
      destructiveButton?: ReactElement<ButtonProps> | ButtonProps;
      primaryButton?: ReactElement<ButtonProps> | ButtonProps;
      secondaryButton?: ReactElement<ButtonProps> | ButtonProps;
    }
  | ReactElement<ButtonProps>
  | ButtonProps;

/**
 * Props for the PageToolbar component.
 */
export type PageToolbarProps = NativeElementPropsWithoutKeyAndRef<'div'> & {
  /**
   * Button configuration for primary, secondary, and destructive actions. <br />
   * Automatically applies proper styling and order. <br />
   */
  actions: PageToolbarActions;
  /** Filter component (SearchInput, Select, or SegmentedControl) */
  filter?: ReactElement<SearchInputProps | SelectProps | SegmentedControlProps>;
  /**
   * Size variant of the toolbar. <br />
   * Affects the size of buttons and filter component. <br />
   */
  size?: 'main' | 'sub';
  /**
   * Icon-only utility buttons `<Button title="..." icon="..." />`. <br />
   * Wrapped with Tooltip automatically. <br />
   * Supports a single Button or a Fragment of Buttons. <br />
   * `<> <Button ... /> <Button ... /> </>` <br />
   */
  utilities?: ButtonGroupChild;
};

type ButtonVariant =
  | 'base-primary'
  | 'base-secondary'
  | 'destructive-secondary';

/**
 * Renders a button from either ButtonProps or a React element.
 * Applies the specified size and variant to the button.
 */
const renderButton = (
  button: ButtonProps | ButtonGroupChild | undefined,
  size: ButtonProps['size'],
  variant: ButtonVariant,
): ReactElement | null => {
  if (!button) {
    return null;
  }

  if (isValidElement(button)) {
    return cloneElement(button, {
      size,
      variant,
      key: variant,
    });
  }

  return <Button key={variant} {...button} size={size} variant={variant} />;
};

/**
 * Clones filter component with the specified size prop.
 */
const withSize = (target: PageToolbarProps['filter'], size: 'main' | 'sub') => {
  if (!target) {
    return null;
  }

  if (isValidElement(target)) {
    return cloneElement(target, { size });
  }

  return target;
};

/**
 * Wraps an icon button with a Tooltip.
 * Uses the button's title prop or children text as tooltip content.
 */
const createIconButtonWithTooltip = (
  child: ReactElement<ButtonProps>,
  size: ButtonProps['size'],
  index: number = 0,
): ReactElement<ButtonProps> => {
  const { children, title, ...childProps } = child.props;
  const tooltipText: string | undefined =
    title || (typeof children === 'string' ? children : undefined);

  return (
    <Tooltip title={tooltipText} key={childProps.id || tooltipText || index}>
      {(tooltipProps) =>
        cloneElement(child, {
          ...tooltipProps,
          icon: childProps.icon
            ? {
                ...(childProps.icon || {}),
                position: 'icon-only',
              }
            : undefined,
          size,
          title: undefined,
          variant: 'base-secondary',
        })
      }
    </Tooltip>
  );
};

/**
 * Renders utility icon buttons wrapped in tooltips.
 * Handles both single Button elements and Fragment containing multiple Buttons.
 */
const renderIconButtons = (
  utilities: ButtonGroupChild | undefined,
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] | null => {
  if (!utilities) {
    return null;
  }

  if (!isValidElement(utilities)) {
    return null;
  }

  if (utilities.type === Fragment) {
    const children = Children.map(utilities.props.children, (child, index) => {
      if (!isValidElement(child) || child.type !== Button) {
        return null;
      }

      return createIconButtonWithTooltip(
        child as ReactElement<ButtonProps>,
        size,
        index,
      );
    });

    return children?.filter(Boolean) as ButtonGroupChild[] | null;
  }

  if (utilities.type === Button) {
    return createIconButtonWithTooltip(utilities, size);
  }

  return null;
};

/**
 * Renders action buttons based on the actions configuration.
 * Supports both structured actions object and single button element/props.
 */
const renderActions = (
  actions: PageToolbarActions,
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] => {
  if (
    'primaryButton' in actions ||
    'secondaryButton' in actions ||
    'destructiveButton' in actions
  ) {
    return [
      renderButton(actions.destructiveButton, size, 'destructive-secondary'),
      renderButton(actions.secondaryButton, size, 'base-secondary'),
      renderButton(actions.primaryButton, size, 'base-primary'),
    ].filter(Boolean) as ButtonGroupChild[];
  }

  if (isValidElement(actions)) {
    return renderButton(actions, size, 'base-primary') as ButtonGroupChild;
  }

  return <Button {...actions} size={size} variant="base-primary" />;
};

/**
 * PageToolbar component provides a flexible toolbar with filter, action buttons, and utility icons.
 * Commonly used in page headers for primary user actions.
 */
const PageToolbar = forwardRef<HTMLDivElement, PageToolbarProps>(
  function PageToolbar(props, ref) {
    const {
      actions,
      className,
      filter,
      size = 'main',
      utilities,
      ...rest
    } = props;

    const filterWithSize = withSize(filter, size);
    const fragmentActions = renderActions(actions, size);
    const fragmentUtilities = renderIconButtons(utilities, size);

    return (
      <div
        {...rest}
        className={cx(classes.host, classes.size(size), className)}
        ref={ref}
      >
        {filterWithSize}
        <ButtonGroup>{fragmentActions}</ButtonGroup>
        <ButtonGroup>{fragmentUtilities}</ButtonGroup>
      </div>
    );
  },
);

export default PageToolbar;
