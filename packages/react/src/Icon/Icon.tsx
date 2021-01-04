import { forwardRef, SVGProps } from 'react';
import { IconDefinition } from '@mezzanine-ui/icons';
import { classes, IconColor, toIconCssVars } from '@mezzanine-ui/core/icon';
import { cx } from '../utils/cx';

export interface IconProps extends SVGProps<SVGSVGElement> {
  /**
   * Color name provided by palette.
   */
  color?: IconColor;
  /**
   * The icon provided by `@mezzanine-ui/icons` package.
   */
  icon: IconDefinition;
  /**
   * Whether to spin the icon or not.
   * @default false
   */
  spin?: boolean;
}

/**
 * The react component for `mezzanine` icon.
 */
const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(props, ref) {
  const {
    className,
    color,
    icon,
    spin = false,
    style: styleProp,
    ...rest
  } = props;
  const { definition } = icon;
  const cssVars = toIconCssVars({ color });
  const style = {
    ...cssVars,
    ...styleProp,
  };

  return (
    <svg
      {...definition.svg}
      {...rest}
      ref={ref}
      aria-hidden
      className={cx(
        classes.host,
        {
          [classes.color]: color,
          [classes.spin]: spin,
        },
        className,
      )}
      data-icon-name={icon.name}
      focusable={false}
      style={style}
    >
      <path {...definition.path} />
    </svg>
  );
});

export default Icon;
