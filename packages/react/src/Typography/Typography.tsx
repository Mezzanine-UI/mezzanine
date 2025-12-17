import { forwardRef, JSXElementConstructor } from 'react';
import {
  toTypographyCssVars,
  TypographyAlign,
  typographyClasses as classes,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
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

function getComponentFromType(
  type: TypographySemanticType,
): TypographyComponent {
  if (type === 'h1' || type === 'h2' || type === 'h3') {
    return type as TypographyComponent;
  }

  if (type.startsWith('body') || type.startsWith('text-link-body')) {
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
   * The text semantic color from the palette.
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
   * Applies the typography semantic type.
   * @default 'body'
   */
  variant?: TypographySemanticType;
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
      variant = 'body',
      style: styleProp,
      ...rest
    } = props;
    const Component = component || (getComponentFromType(variant) as any);
    const cssVars = toTypographyCssVars({
      align,
      color,
      display,
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
          classes.type(variant),
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
  },
);

export default Typography;
