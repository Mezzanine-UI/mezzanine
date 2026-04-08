import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import {
  filterAreaClasses as classes,
  filterAreaPrefix,
  FilterAlign,
  FilterSpan,
} from '@mezzanine-ui/core/filter-area';
import clsx from 'clsx';
import { MZN_FILTER_AREA_CONTEXT } from './filter-area-context';

/**
 * 單一篩選條件元件，用於在 MznFilterLine 中定義欄位的佔位寬度。
 *
 * 使用 6 欄 Grid，`span` 決定欄位佔用幾欄（1-6）；
 * `grow` 設為 `true` 時欄位自動填滿整行。
 * 從 MZN_FILTER_AREA_CONTEXT 繼承 `size`，統一套用至內部的輸入元件。
 *
 * @example
 * ```html
 * import { MznFilter } from '@mezzanine-ui/ng/filter-area';
 *
 * <mzn-filter [span]="2">
 *   <div mznTextField label="Name">
 *     <input mznInput placeholder="Enter name" />
 *   </div>
 * </mzn-filter>
 * ```
 *
 * @see {@link MznFilterLine} 包含 MznFilter 的行容器
 * @see {@link MznFilterArea} 管理整個篩選器的容器
 */
@Component({
  selector: 'mzn-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
    '[style]': 'hostStyles()',
  },
  template: '<ng-content />',
})
export class MznFilter {
  private readonly context = inject(MZN_FILTER_AREA_CONTEXT, {
    optional: true,
  });

  /**
   * 欄位的垂直對齊方式。
   * @default 'stretch'
   */
  readonly align = input<FilterAlign>('stretch');

  /**
   * 是否自動填滿整行（等同 span=6）。
   * @default false
   */
  readonly grow = input(false);

  /**
   * 欄位的最小寬度。
   */
  readonly minWidth = input<string>();

  /**
   * 欄位在 Grid 中佔用的欄數（1-6）。
   * 當 `grow` 為 `true` 時此屬性無效。
   * @default 2
   */
  readonly span = input<FilterSpan>(2);

  protected readonly hostClasses = computed((): string =>
    clsx(classes.filter, {
      [classes.filterGrow]: this.grow(),
      [classes.filterAlign(this.align())]: this.align(),
    }),
  );

  protected readonly hostStyles = computed(
    (): Record<string, string | number> => {
      const styles: Record<string, string | number> = {};
      const minW = this.minWidth();
      const grow = this.grow();
      const span = this.span();

      if (minW) {
        styles['min-width'] = minW;
      }

      if (!grow) {
        styles[`--${filterAreaPrefix}-filter-span`] = span;
      }

      return styles;
    },
  );

  /** 從 FilterArea context 取得的 size。 */
  readonly contextSize = computed(() => this.context?.size);
}
