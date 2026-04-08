import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { IconDefinition } from '@mezzanine-ui/icons';
import {
  iconClasses as classes,
  IconColor,
  toIconCssVars,
} from '@mezzanine-ui/core/icon';
import clsx from 'clsx';

/**
 * 渲染來自 `@mezzanine-ui/icons` 的 SVG 圖示元件。
 *
 * 使用 attribute selector `[mznIcon]` 套用於 `<i>` 元素，host element 為 `<i>`
 * 以對齊 React `<Icon>` 渲染為 `<i class="mzn-icon">` 的結構。
 * 透過 `icon` input 傳入圖示定義物件，支援調整顏色、尺寸與旋轉動畫。
 * 可透過 `title` input 提供無障礙標題文字。
 *
 * @example
 * ```html
 * import { MznIcon } from '@mezzanine-ui/ng/icon';
 * import { SearchIcon, LoadingIcon } from '@mezzanine-ui/icons';
 *
 * <i mznIcon [icon]="SearchIcon"></i>
 * <i mznIcon [icon]="LoadingIcon" [spin]="true"></i>
 * <i mznIcon [icon]="SearchIcon" color="success" [size]="24" title="搜尋"></i>
 * ```
 */
@Component({
  selector: '[mznIcon]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
    '[attr.data-icon-name]': 'icon().name',
  },
  template: `<svg
    [attr.viewBox]="svgAttrs().viewBox"
    [attr.fill]="svgAttrs().fill"
    focusable="false"
  >
    @if (titleText()) {
      <title>{{ titleText() }}</title>
    }
    <path
      [attr.d]="pathAttrs().d"
      [attr.fill]="pathAttrs().fill"
      [attr.fill-rule]="pathAttrs().fillRule"
      [attr.clip-rule]="pathAttrs().clipRule"
      [attr.stroke]="pathAttrs().stroke"
      [attr.stroke-width]="pathAttrs().strokeWidth"
      [attr.stroke-linecap]="pathAttrs().strokeLinecap"
      [attr.stroke-linejoin]="pathAttrs().strokeLinejoin"
      [attr.transform]="pathAttrs().transform"
    />
  </svg>`,
})
export class MznIcon {
  /** 來自 `@mezzanine-ui/icons` 的圖示定義物件。 */
  readonly icon = input.required<IconDefinition>();

  /**
   * 是否為可點擊圖示，設為 true 時游標顯示為 pointer。
   * @default false
   */
  readonly clickable = input(false);

  /** 圖示顏色，對應 palette 語意色。 */
  readonly color = input<IconColor>();

  /** 圖示尺寸（px）。 */
  readonly size = input<number>();

  /**
   * 是否啟用旋轉動畫。
   * @default false
   */
  readonly spin = input(false);

  /** 無障礙標題文字。 */
  readonly title = input<string>();

  protected readonly hostClasses = computed((): string =>
    clsx(classes.host, {
      [classes.color]: this.color(),
      [classes.spin]: this.spin(),
      [classes.size]: this.size(),
    }),
  );

  protected readonly hostStyles = computed(
    (): Record<string, string> => ({
      ...(toIconCssVars({
        color: this.color(),
        size: this.size(),
      }) as Record<string, string>),
      ...(this.clickable() ? { '--mzn-icon-cursor': 'pointer' } : {}),
    }),
  );

  protected readonly svgAttrs = computed(() => {
    const { svg } = this.icon().definition;

    return {
      viewBox: svg?.viewBox,
      fill: svg?.fill,
    };
  });

  protected readonly pathAttrs = computed(() => {
    const { path } = this.icon().definition;

    return {
      d: path?.d,
      fill: path?.fill,
      fillRule: path?.fillRule,
      clipRule: path?.clipRule,
      stroke: path?.stroke,
      strokeWidth: path?.strokeWidth,
      strokeLinecap: path?.strokeLinecap,
      strokeLinejoin: path?.strokeLinejoin,
      transform: path?.transform,
    };
  });

  protected readonly titleText = computed(
    (): string | undefined => this.title() || this.icon().definition.title,
  );
}
