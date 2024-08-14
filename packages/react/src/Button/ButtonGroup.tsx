import {
  Children,
  cloneElement,
  forwardRef,
  ReactElement,
  useContext,
} from 'react';
import {
  ButtonColor,
  buttonGroupClasses as classes,
  ButtonGroupOrientation,
  ButtonGroupSpacing,
  ButtonSize,
  ButtonVariant,
  toButtonGroupCssVars,
} from '@mezzanine-ui/core/button';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';
import { ButtonProps } from './Button';
import { IconButtonProps } from './IconButton';
import { MezzanineConfig } from '../Provider/context';

export type ButtonGroupChild =
  | ReactElement<ButtonProps | IconButtonProps>
  | null
  | undefined
  | false;

export interface ButtonGroupProps
  extends NativeElementPropsWithoutKeyAndRef<'div'> {
  /**
   * If `true`, all buttons will not have spacing between each others.
   * @default false
   */
  attached?: boolean;
  /**
   * Only accept button elements or icon button elements.
   */
  children: ButtonGroupChild | ButtonGroupChild[];
  /**
   * If the `color` of a button inside group not provided, the `color` of group will override it.
   * @default 'primary'
   */
  color?: ButtonColor;
  /**
   * If the `danger` of a button inside group not provided, the `danger` of group will override it.
   * @default false
   */
  danger?: boolean;
  /**
   * If the `disabled` of a button inside group not provided, the `disabled` of group will override it.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, set width: 100%.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * The orientation of button group.
   * @default horizontal
   */
  orientation?: ButtonGroupOrientation;
  /**
   * If the `size` of a button inside group not provided, the `size` of group will override it.
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * The spacing level of button gap between each buttons.
   * Will be added on if `attached`=false.
   * @default small:3,others:4
   */
  spacing?: ButtonGroupSpacing;
  /**
   * If the `variant` of a button inside group not provided, the `variant` of group will override it.
   * @default 'text'
   */
  variant?: ButtonVariant;
}

/**
 * The react component for `mezzanine` button group.
 */
const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroup(props, ref) {
    const { size: globalSize } = useContext(MezzanineConfig);
    const {
      attached = false,
      children,
      className,
      color = 'primary',
      danger = false,
      disabled = false,
      fullWidth = false,
      orientation = 'horizontal',
      role = 'group',
      size = globalSize,
      spacing,
      style: styleProp,
      variant = 'text',
      ...rest
    } = props;
    const cssVars = toButtonGroupCssVars({ size, spacing });
    const style = {
      ...styleProp,
      ...cssVars,
    };

    return (
      <div
        ref={ref}
        {...rest}
        aria-orientation={orientation}
        className={cx(
          classes.host,
          classes.orientation(orientation),
          {
            [classes.fullWidth]: fullWidth,
            [classes.attached]: attached,
          },
          className,
        )}
        role={role}
        style={style}
      >
        {Children.map(children, (unknownChild) => {
          const child = unknownChild as ButtonGroupChild;

          if (!child) {
            return null;
          }

          return cloneElement(child, {
            color: child.props.color || color,
            danger: child.props.danger ?? danger,
            disabled: child.props.disabled ?? disabled,
            size: child.props.size || size,
            variant: child.props.variant || variant,
          });
        })}
      </div>
    );
  },
);

export default ButtonGroup;
