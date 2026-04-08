import { computed, Directive, input } from '@angular/core';
import {
  toTypographyCssVars,
  TypographyAlign,
  typographyClasses as classes,
  TypographyColor,
  TypographyDisplay,
} from '@mezzanine-ui/core/typography';
import { TypographySemanticType } from '@mezzanine-ui/system/typography';
import clsx from 'clsx';

/**
 * 文字排版 directive，提供一致的語意化文字樣式。
 *
 * 使用 attribute selector `[mznTypography]`，可套用於任意 HTML 元素，
 * 透過 `variant` 套用設計系統中定義的語意排版類型（如 `h1`、`body`、`caption` 等）。
 * 支援 `color`、`align`、`display` 等 CSS 變數控制，以及 `ellipsis` 單行截斷。
 *
 * @example
 * ```html
 * import { MznTypography } from '@mezzanine-ui/ng/typography';
 *
 * <h1 mznTypography variant="h1">頁面標題</h1>
 * <p mznTypography variant="body">這是一段說明文字。</p>
 * <span mznTypography variant="caption" color="text-secondary" [ellipsis]="true">截斷文字...</span>
 * ```
 */
@Directive({
  selector: '[mznTypography]',
  standalone: true,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
})
export class MznTypography {
  /**
   * 語意排版類型。
   * @default 'body'
   */
  readonly variant = input<TypographySemanticType>('body');

  /** CSS `text-align` 值。 */
  readonly align = input<TypographyAlign>();

  /** 文字語意色彩，對應 palette 調色盤。 */
  readonly color = input<TypographyColor>();

  /** CSS `display` 值。 */
  readonly display = input<TypographyDisplay>();

  /**
   * 啟用單行截斷省略號。需搭配 `block` 或 `inline-block` 容器。
   * @default false
   */
  readonly ellipsis = input(false);

  /**
   * 是否禁止文字換行。
   * @default false
   */
  readonly noWrap = input(false);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.type(this.variant()), {
      [classes.align]: this.align(),
      [classes.color]: this.color(),
      [classes.display]: this.display(),
      [classes.ellipsis]: this.ellipsis(),
      [classes.noWrap]: this.noWrap(),
    }),
  );

  protected readonly hostStyles = computed(
    (): Record<string, string | undefined> =>
      toTypographyCssVars({
        align: this.align(),
        color: this.color(),
        display: this.display(),
      }) as Record<string, string | undefined>,
  );
}
