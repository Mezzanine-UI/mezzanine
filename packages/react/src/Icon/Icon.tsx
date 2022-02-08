import { forwardRef } from 'react';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  iconClasses as classes,
  IconColor,
  toIconCssVars,
} from '@mezzanine-ui/core/icon';
import { cx } from '../utils/cx';
import { NativeElementPropsWithoutKeyAndRef } from '../utils/jsx-types';

export interface IconProps extends NativeElementPropsWithoutKeyAndRef<'i'> {
  /**
   * Color name provided by palette.
   */
  color?: IconColor;
  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  icon: IconDefinition;
  /**
   * Icon size in px
   */
  size?: number;
  /**
   * Whether to spin the icon or not.
   * @default false
   */
  spin?: boolean;
}

/**
 * The react component for `mezzanine` icon.
 */
const Icon = forwardRef<HTMLElement, IconProps>(function Icon(props, ref) {
  const {
    className,
    color,
    icon,
    size,
    spin = false,
    style: styleProp,
    ...rest
  } = props;
  const { definition } = icon;
  const cssVars = toIconCssVars({ color, size });
  const style = {
    '--mzn-icon-cursor': props.onClick || props.onMouseOver ? 'pointer' : 'inherit',
    ...cssVars,
    ...styleProp,
  };

  return (
    <i
      {...rest}
      ref={ref}
      aria-hidden
      className={cx(
        classes.host,
        {
          [classes.color]: color,
          [classes.spin]: spin,
          [classes.size]: size,
        },
        className,
      )}
      data-icon-name={icon.name}
      style={style}
    >
      <svg
        {...definition.svg}
        focusable={false}
      >
        <path {...definition.path} />
      </svg>
    </i>
  );
});

export default Icon;
