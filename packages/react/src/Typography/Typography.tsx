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
 * 文字排版元件，提供一致的語意化文字樣式。
 *
 * 透過 `variant` 套用設計系統中定義的語意排版類型（如 `h1`、`h2`、`h3`、`body`、`caption` 等），
 * 並自動推斷對應的 HTML 標籤（`h1–h3` → `<h1>–<h3>`，body 系列 → `<p>`，其餘 → `<span>`）。
 * 可透過 `color` 套用調色盤中的文字色彩，`align` 控制對齊方式，`ellipsis` 啟用單行截斷省略號。
 * 支援透過 `component` prop 覆寫根元素標籤。
 *
 * @example
 * ```tsx
 * import Typography from '@mezzanine-ui/react/Typography';
 *
 * // 標題
 * <Typography variant="h1">頁面標題</Typography>
 *
 * // 本文
 * <Typography variant="body">這是一段說明文字。</Typography>
 *
 * // 套用色彩
 * <Typography variant="body" color="error">錯誤提示訊息</Typography>
 *
 * // 單行截斷（需搭配 block 或 inline-block 容器）
 * <Typography variant="caption" ellipsis display="block">超長文字會在此被截斷顯示省略號...</Typography>
 * ```
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
