import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { skeletonClasses as classes } from '@mezzanine-ui/core/skeleton';
import { TypographySemanticType } from '@mezzanine-ui/core/typography';
import clsx from 'clsx';

/**
 * 骨架屏佔位元件，用於載入中狀態的視覺提示。
 *
 * 支援兩種模式：當設定 `variant` 且未指定 `height`/`circle` 時，
 * 以文字排版的高度呈現長條形；否則以指定尺寸呈現方形或圓形。
 *
 * @example
 * ```html
 * import { MznSkeleton } from '@mezzanine-ui/ng/skeleton';
 *
 * <mzn-skeleton variant="h3" />
 * <mzn-skeleton [circle]="true" width="40px" height="40px" />
 * <mzn-skeleton width="200px" height="16px" />
 * ```
 */
@Component({
  selector: 'mzn-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
  template: `
    @if (isStripMode()) {
      <span [class]="classes.bg"></span>
    }
  `,
})
export class MznSkeleton {
  protected readonly classes = classes;

  /**
   * 是否為圓形。
   * @default false
   */
  readonly circle = input(false);

  /**
   * 元件高度。
   * @default '100%'
   */
  readonly height = input<number | string>();

  /**
   * 排版變體，僅在非 circle 且未設定 height 時生效，
   * 以對應文字排版的高度呈現長條形骨架。
   */
  readonly variant = input<TypographySemanticType>();

  /**
   * 元件寬度。
   * @default '100%'
   */
  readonly width = input<number | string>();

  protected readonly isStripMode = computed(
    (): boolean => !this.height() && !this.circle() && !!this.variant(),
  );

  protected readonly hostClasses = computed((): string => {
    const variant = this.variant();

    if (this.isStripMode() && variant) {
      return clsx(classes.host, classes.type(variant));
    }

    return clsx(classes.host, classes.bg, this.circle() && classes.circle);
  });

  protected readonly hostStyles = computed((): Record<string, string> => {
    const styles: Record<string, string> = {};
    const w = this.width();
    const h = this.height();

    if (w !== undefined) {
      styles['width'] = typeof w === 'number' ? `${w}px` : w;
    }

    if (h !== undefined) {
      styles['height'] = typeof h === 'number' ? `${h}px` : h;
    }

    return styles;
  });
}
