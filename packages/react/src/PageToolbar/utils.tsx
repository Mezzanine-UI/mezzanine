import { ReactElement, isValidElement, cloneElement, Children } from 'react';
import Button, { ButtonProps, ButtonGroupChild } from '../Button';
import Input, { SearchInputProps, InputProps } from '../Input';
import Select, { SelectProps } from '../Select';
import { PageToolbarProps } from './PageToolbar';
import { flattenChildren } from '../utils/flatten-children';

// TODO: Replace with actual SegmentedControlProps when SegmentedControl component is complete
type SegmentedControlProps = {
  mock: 'SegmentedControlProps';
};

type ToolbarButtonVariant =
  | 'base-primary'
  | 'base-secondary'
  | 'destructive-secondary';

/**
 * Renders a button from either ButtonProps or a React element.
 * Applies the specified size and variant to the button.
 */
export const renderButton = (
  button: ButtonProps | ButtonGroupChild | undefined,
  size: ButtonProps['size'],
  variant: ToolbarButtonVariant,
): ReactElement<ButtonProps> | null => {
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
const withSize = (
  target: ReactElement<SearchInputProps | SelectProps | SegmentedControlProps>,
  size: 'main' | 'sub',
) => {
  if (!target) {
    return null;
  }

  if (isValidElement(target)) {
    return cloneElement(target, { size });
  }

  return target;
};

export const renderFilterProp = (
  prop: PageToolbarProps['filter'],
  size: 'main' | 'sub',
) => {
  if (!prop) {
    return null;
  }

  const { variant } = prop;

  if (variant === 'search') {
    return (
      <Input {...(prop as SearchInputProps)} size={size} variant="search" />
    );
  }

  if (variant === 'select') {
    return <Select {...(prop as SelectProps)} size={size} />;
  }

  if (variant === 'segmentedControl') {
    console.warn('SegmentedControl component is not implemented yet.');
    return null;
  }

  return null;
};

export const renderIconButtonWithProps = (
  child: ReactElement<ButtonProps>,
  size: ButtonProps['size'],
): ReactElement<ButtonProps> => {
  const { icon } = child.props;

  return cloneElement(child, {
    icon: icon
      ? {
          ...icon,
          position: 'icon-only',
        }
      : undefined,
    size,
    variant: 'base-secondary',
  });
};

export const renderIconButtonsProp = (
  utilities: PageToolbarProps['utilities'],
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] => {
  const result: ButtonGroupChild[] = [];

  utilities?.forEach((buttonProps) => {
    result.push(
      <Button
        {...buttonProps}
        size={size}
        icon={{
          ...buttonProps.icon,
          position: 'icon-only',
        }}
        variant="base-secondary"
      />,
    );
  });

  return result;
};

/**
 * Renders action buttons based on the actions configuration.
 * Supports both structured actions object and single button element/props.
 */
export const renderActionsProp = (
  actions: PageToolbarProps['actions'],
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] => {
  if (
    actions &&
    ('primaryButton' in actions ||
      'secondaryButton' in actions ||
      'destructiveButton' in actions)
  ) {
    return [
      renderButton(actions.destructiveButton, size, 'destructive-secondary'),
      renderButton(actions.secondaryButton, size, 'base-secondary'),
      renderButton(actions.primaryButton, size, 'base-primary'),
    ].filter(Boolean) as ButtonGroupChild[];
  }

  return <Button {...actions} size={size} variant="base-primary" />;
};

export const resolvePageToolbarChild = (
  children: PageToolbarProps['children'],
  size: 'main' | 'sub',
) => {
  let filter: ReactElement<
    SearchInputProps | SelectProps | SegmentedControlProps
  > | null = null;
  const actions: [ButtonGroupChild, ButtonGroupChild, ButtonGroupChild] = [
    null,
    null,
    null,
  ];
  const buttonsWithoutVariant: ReactElement<ButtonProps>[] = [];
  const utilities: ButtonGroupChild[] = [];

  if (children) {
    const flatChildren = flattenChildren(children);
    Children.forEach(flatChildren, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const { type, props } = child;

      // is filter
      if (type === Input && (props as InputProps).variant === 'search') {
        filter = withSize(child as ReactElement<SearchInputProps>, size);
      } else if (type === Select) {
        filter = withSize(child as ReactElement<SelectProps>, size);
      } else if (type.toString() === 'SegmentedControl') {
        console.warn('SegmentedControl component is not implemented yet.');
      }
      // is utilities (icon button)
      else if (type === Button && (props as ButtonProps).icon) {
        utilities.push(
          renderIconButtonWithProps(child as ReactElement<ButtonProps>, size),
        );
      }
      // is actions (normal button)
      else if (type === Button && (props as ButtonProps).variant) {
        // with variant prop
        const variant = (props as ButtonProps).variant;

        if (
          variant !== 'base-primary' &&
          variant !== 'base-secondary' &&
          variant !== 'destructive-secondary'
        ) {
          return;
        }

        const buttonElement = renderButton(
          child as ReactElement<ButtonProps>,
          size,
          variant,
        );

        if (variant === 'destructive-secondary') {
          actions[0] = buttonElement;
        } else if (variant === 'base-secondary') {
          actions[1] = buttonElement;
        } else if (variant === 'base-primary') {
          actions[2] = buttonElement;
        }
      } else if (type === Button) {
        // without variant prop
        buttonsWithoutVariant.push(child as ReactElement<ButtonProps>);
      }
    });

    // filling null action
    const fillIndexStartWith =
      3 -
      buttonsWithoutVariant.length -
      (actions[0] ? 1 : 0) -
      (actions[1] ? 1 : 0) -
      (actions[2] ? 1 : 0);

    buttonsWithoutVariant.forEach((button) => {
      if (fillIndexStartWith <= 0 && !actions[0]) {
        actions[0] = renderButton(button, size, 'destructive-secondary');
      } else if (fillIndexStartWith <= 1 && !actions[1]) {
        actions[1] = renderButton(button, size, 'base-secondary');
      } else if (fillIndexStartWith <= 2 && !actions[2]) {
        actions[2] = renderButton(button, size, 'base-primary');
      }
    });
  }

  return { filter, actions, utilities };
};
