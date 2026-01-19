import { PropsWithoutRef, ReactElement, RefAttributes } from 'react';
import { ButtonComponent, ButtonPropsBase } from './typings';
import Button, { ButtonProps } from './Button';

export type {
  ButtonIconType,
  ButtonGroupOrientation,
  ButtonSize,
  ButtonVariant,
} from '@mezzanine-ui/core/button';
export { default as ButtonGroup } from './ButtonGroup';
export type { ButtonGroupChild, ButtonGroupProps } from './ButtonGroup';

export type { ButtonComponent, ButtonProps, ButtonPropsBase };

/**
 * @remark
 * Add type alias here for parsable to react docgen typescript.
 */
type GenericButton = <C extends ButtonComponent = 'button'>(
  props: PropsWithoutRef<ButtonProps<C>> & RefAttributes<HTMLElement>,
) => ReactElement<any>;

export default Button as GenericButton;
