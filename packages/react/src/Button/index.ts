import {
  ElementRef,
  PropsWithoutRef,
  ReactElement,
  RefAttributes,
} from 'react';
import { ButtonComponent, ButtonPropsBase } from './typings';
import Button, { ButtonProps } from './Button';
import _IconButton, { IconButtonProps } from './IconButton';

export type {
  ButtonColor,
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
export {
  ButtonGroupChild,
  ButtonGroupProps,
  default as ButtonGroup,
} from './ButtonGroup';

export type { ButtonComponent, ButtonProps, ButtonPropsBase, IconButtonProps };

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericIconButton = <C extends ButtonComponent = 'button'>(
  props: PropsWithoutRef<IconButtonProps<C>> & RefAttributes<ElementRef<C>>,
) => ReactElement;
export const IconButton = _IconButton as GenericIconButton;

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericButton = <C extends ButtonComponent = 'button'>(
  props: PropsWithoutRef<ButtonProps<C>> & RefAttributes<ElementRef<C>>,
) => ReactElement;

export default Button as GenericButton;
