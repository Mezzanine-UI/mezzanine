import {
  ReactElement,
  isValidElement,
  cloneElement,
  Children,
  ReactNode,
} from 'react';
import Button, {
  ButtonProps,
  ButtonGroupChild,
  ButtonComponent,
} from '../Button';
import Input, { SearchInputProps, InputProps } from '../Input';
import Select, { SelectProps } from '../Select';
import { ContentHeaderProps } from './ContentHeader';
import { flattenChildren } from '../utils/flatten-children';
import Dropdown, { DropdownProps } from '../Dropdown';
import { ChevronLeftIcon } from '@mezzanine-ui/icons';

// TODO: Replace with actual SegmentedControlProps when SegmentedControl component is complete
type SegmentedControlProps = {
  mock: 'SegmentedControlProps';
};

/**
 * Renders a button from either ButtonProps or a React element.
 * Applies the specified size and variant to the button.
 */
export const renderButton = (
  button: ButtonProps | ButtonGroupChild | undefined,
  size: ButtonProps['size'],
): ReactElement<ButtonProps> | null => {
  if (!button) {
    return null;
  }

  if (isValidElement(button)) {
    return cloneElement(button, {
      size,
      type: 'button',
    });
  }

  return <Button {...button} size={size} type="button" />;
};

const withSize = (
  target: ReactElement<SearchInputProps | SelectProps | SegmentedControlProps>,
  size: 'main' | 'sub',
) => {
  return cloneElement(target, { size });
};

export const renderFilterProp = (
  prop: ContentHeaderProps['filter'],
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
    icon,
    iconType: 'icon-only',
    size,
    variant: 'base-secondary',
    type: 'button',
  });
};

export const renderIconButtonsProp = (
  utilities: ContentHeaderProps['utilities'],
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] => {
  const result: ButtonGroupChild[] = [];

  utilities?.forEach((props) => {
    if (props instanceof Object && 'icon' in props) {
      result.push(
        <Button
          {...props}
          type="button"
          size={size}
          iconType="icon-only"
          variant="base-secondary"
        />,
      );
    }

    if (props instanceof Object && 'options' in props) {
      if (
        !isValidElement((props as DropdownProps).children) ||
        !((props as DropdownProps).children.type === Button)
      ) {
        console.warn(
          '[Mezzanine][ContentHeader]: Dropdown in utilities should have Button with icon as its children.',
        );

        return;
      }

      result.push(
        <Dropdown {...(props as DropdownProps)}>
          {cloneElement(
            (props as DropdownProps).children as ReactElement<ButtonProps>,
            {
              type: 'button',
              size: size,
              iconType: 'icon-only',
              variant: 'base-secondary',
            },
          )}
        </Dropdown>,
      );
    }
  });

  return result;
};

const variantOrder: Record<NonNullable<ButtonProps['variant']>, number> = {
  'destructive-secondary': 0,
  'base-secondary': 1,
  'base-primary': 2,
  // undefined: 2,
  'base-tertiary': 0,
  'base-ghost': 0,
  'base-dashed': 0,
  'base-text-link': 0,
  'destructive-primary': 0,
  'destructive-ghost': 0,
  'destructive-text-link': 0,
  inverse: 0,
  'inverse-ghost': 0,
};
/**
 * Renders action buttons based on the actions configuration.
 * Supports both structured actions object and single button element/props.
 */
export const renderActionsProp = (
  actions: ContentHeaderProps['actions'],
  size: ButtonProps['size'],
): ButtonGroupChild | ButtonGroupChild[] => {
  if (actions) {
    return actions
      .filter((v) => {
        if (
          v.variant === 'destructive-secondary' ||
          v.variant === 'base-secondary' ||
          v.variant === 'base-primary' ||
          v.variant === undefined
        ) {
          return true;
        } else {
          console.warn(
            `[Mezzanine][ContentHeader]: Button with variant "${v.variant}" will not be rendered in ContentHeader actions.`,
          );

          return false;
        }
      })
      .sort(
        (a, b) =>
          variantOrder[a.variant || 'base-primary'] -
          variantOrder[b.variant || 'base-primary'],
      )
      .map((v) => renderButton(v, size)) as ButtonGroupChild[];
  }

  return null;
};

export const resolveContentHeaderChild = (
  children: ContentHeaderProps['children'],
  size: 'main' | 'sub',
) => {
  let filter: ReactElement<
    SearchInputProps | SelectProps | SegmentedControlProps
  > | null = null;

  // [destructive-secondary[], base-secondary[], base-primary[]]
  const actionsWithOrder: [
    ReactElement<ButtonProps>[],
    ReactElement<ButtonProps>[],
    ReactElement<ButtonProps>[],
  ] = [[], [], []];
  const utilities: (ButtonGroupChild | ReactElement<DropdownProps>)[] = [];
  let backButton: ReactElement<{ href: string; children: ReactNode }> | null =
    null;

  if (children) {
    const flatChildren = flattenChildren(children);
    Children.forEach(flatChildren, (child) => {
      if (!isValidElement(child)) {
        return;
      }

      const { type, props } = child;

      if (type === 'a' || (props as { href: string }).href) {
        backButton = cloneElement(
          child as ReactElement<{ href: string; children: ReactNode }>,
          {
            children: (
              <Button
                component={'span' as ButtonComponent}
                iconType="icon-only"
                icon={ChevronLeftIcon}
                size="sub"
                variant="base-tertiary"
              />
            ),
          },
        );

        return;
      }

      const sizeProp = (props as { size: any }).size;

      if (size !== undefined && sizeProp !== size) {
        console.warn(
          '[Mezzanine][ContentHeader]: Input, Button, Select size in ContentHeader utilities is forced to match ContentHeader size.',
        );
      }

      // is filter
      if (
        (type === Input && (props as InputProps).variant === 'search') ||
        type === Select
      ) {
        if (filter) {
          console.warn(
            '[Mezzanine][ContentHeader]: ContentHeader only accepts one filter component.',
          );
        }

        filter = withSize(
          child as ReactElement<SearchInputProps | SelectProps>,
          size,
        );
      } else if (type.toString() === 'SegmentedControl') {
        console.warn('SegmentedControl component is not implemented yet.');
      }
      // is utilities (icon button)
      else if (
        (type === Button && (props as ButtonProps).iconType === 'icon-only') ||
        ((props as ButtonProps).icon && !(props as ButtonProps).children)
      ) {
        utilities.push(
          renderIconButtonWithProps(child as ReactElement<ButtonProps>, size),
        );
      } else if (type === Dropdown) {
        utilities.push(
          cloneElement(child as ReactElement<DropdownProps>, {
            children: renderIconButtonWithProps(
              (child as ReactElement<DropdownProps>).props
                .children as ReactElement<ButtonProps>,
              size,
            ),
          }),
        );
      }
      // is actions (normal button)
      else if (type === Button) {
        const variant = (props as ButtonProps).variant;

        if (
          variant !== 'base-primary' &&
          variant !== 'base-secondary' &&
          variant !== 'destructive-secondary' &&
          variant !== undefined
        ) {
          console.warn(
            `[Mezzanine][ContentHeader]: Button with variant "${variant}" will not be rendered in ContentHeader actions.`,
          );

          return;
        }

        const buttonElement = renderButton(
          child as ReactElement<ButtonProps>,
          size,
        );

        if (!buttonElement) {
          return;
        }

        if (variant === 'destructive-secondary') {
          actionsWithOrder[0].push(buttonElement);
        } else if (variant === 'base-secondary') {
          actionsWithOrder[1].push(buttonElement);
        } else if (variant === 'base-primary') {
          actionsWithOrder[2].push(buttonElement);
        } else if (variant === undefined) {
          actionsWithOrder[2].push(buttonElement);
        }
      } else {
        console.warn(
          '[Mezzanine][ContentHeader]: ContentHeader only accepts Input (search variant), Select, SegmentedControl, Dropdown with Icon Button, or Button as children.',
        );
      }
    });
  }

  return {
    filter,
    actions: [
      ...actionsWithOrder[0],
      ...actionsWithOrder[1],
      ...actionsWithOrder[2],
    ],
    utilities,
    backButton,
  };
};
