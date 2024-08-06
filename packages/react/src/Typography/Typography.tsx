import { forwardRef, JSXElementConstructor } from 'react';
import {
  toTypographyCssVars,
  TypographyAlign,
  typographyClasses as classes,
  TypographyColor,
  TypographyDisplay,
  TypographyVariant,
  TypographyWeight,
} from '@mezzanine-ui/core/typography';
import { cx } from '../utils/cx';
import { ComponentOverridableForwardRefComponentPropsFactory } from '../utils/jsx-types';

export type TypographyComponent =
  | `h${1 | 2 | 3 | 4 | 5 | 6}`
  | 'p'
  | 'span'
  | 'label'
  | 'div'
  | 'caption'
  | 'a'
  | JSXElementConstructor<any>;

function getComponentFromVariant(
  variant: TypographyVariant,
): TypographyComponent {
  if (variant.startsWith('h')) {
    return variant as TypographyComponent;
  }

  if (variant.startsWith('body')) {
    return 'p';
  }

  return 'span';
}

interface TypographyPropsBase {
  /**
   * The css variable for `text-align`.
   */
  align?: TypographyAlign;
  /**
   * The color name provided by palette.
   */
  color?: TypographyColor;
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
  /**
   * The css variable for customizing `font-weight`.
   */
  weight?: TypographyWeight;
}

export type TypographyProps<C extends TypographyComponent = 'p'> =
  ComponentOverridableForwardRefComponentPropsFactory<
    TypographyComponent,
    C,
    TypographyPropsBase
  >;

/**
 * The react component for `mezzanine` typography.
 */
const Typography = forwardRef<HTMLParagraphElement, TypographyProps<'p'>>(
  function Typography(props, ref) {
    const {
      align,
      children,
      className,
      color,
      component,
      display,
      ellipsis = false,
      noWrap = false,
      variant = 'body1',
      style: styleProp,
      weight,
      ...rest
    } = props;
    const Component = component || (getComponentFromVariant(variant) as any);
    const cssVars = toTypographyCssVars({
      align,
      color,
      display,
      weight,
    });
    const style = {
      ...cssVars,
      ...styleProp,
    };
    const title =
      ellipsis && typeof children === 'string' ? children : undefined;

    return (
      <Component
        {...rest}
        ref={ref}
        className={cx(
          classes.variant(variant),
          {
            [classes.align]: align,
            [classes.color]: color,
            [classes.display]: display,
            [classes.ellipsis]: ellipsis,
            [classes.noWrap]: noWrap,
            [classes.weight]: weight,
          },
          className,
        )}
        style={style}
        title={title}
      >
        {children}
      </Component>
    );
  },
);

export default Typography;
