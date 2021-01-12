import {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
} from 'react';
import {
  toTypographyCssVars,
  TypographyAlign,
  typographyClasses as classes,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
} from '@mezzanine-ui/core/typography';
import { cx } from '../utils/cx';

export type TypographyComponent = `h${1 | 2 | 3 | 4 | 5 | 6}` | 'p' | 'span' | 'label' | 'div';

function getComponentFromVariant(variant: TypographyVariant): TypographyComponent {
  if (variant.startsWith('h')) {
    return variant as TypographyComponent;
  }

  if (variant.startsWith('body')) {
    return 'p';
  }

  return 'span';
}

export interface TypographyProps extends Omit<DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>, 'ref'> {
  /**
   * The css variable for `text-align`.
   */
  align?: TypographyAlign;
  /**
   * The color name provided by palette.
   */
  color?: TypographyColor;
  /**
   * Override the componoent used to render.
   * If no passed, will use the component corresponding to variant.
   */
  component?: TypographyComponent;
  /**
   * The css variable for `display`.
   */
  display?: TypographyDisplay;
  /**
   * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
   *
   * Note that text overflow can only happen with `block` or `inline-block` level elements
   * @default false
   */
  ellipsis?: boolean;
  /**
   * If `true`, the text will not wrap.
   * @default false
   */
  noWrap?: boolean;
  /**
   * Applies the typography variant.
   * @default 'body1'
   */
  variant?: TypographyVariant;
}

/**
 * The react component for `mezzanine` typography.
 */
const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(props, ref) {
  const {
    align,
    children,
    className,
    color,
    display,
    ellipsis = false,
    noWrap = false,
    variant = 'body1',
    component: Component = getComponentFromVariant(variant),
    style: styleProp,
    ...rest
  } = props;
  const cssVars = toTypographyCssVars({ align, color, display });
  const style = {
    ...cssVars,
    ...styleProp,
  };
  const title = ellipsis && typeof children === 'string'
    ? children
    : undefined;

  return (
    <Component
      ref={ref as any}
      {...rest}
      className={cx(
        classes.variant(variant),
        {
          [classes.align]: align,
          [classes.color]: color,
          [classes.display]: display,
          [classes.ellipsis]: ellipsis,
          [classes.noWrap]: noWrap,
        },
        className,
      )}
      style={style}
      title={title}
    >
      {children}
    </Component>
  );
});

export default Typography;
