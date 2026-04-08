import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { paginationPageSizeClasses as classes } from '@mezzanine-ui/core/pagination/paginationPageSize';
import { DropdownOption } from '@mezzanine-ui/core/dropdown';
import { MznSelect } from '@mezzanine-ui/ng/select';
import { MznTypography } from '@mezzanine-ui/ng/typography';

/**
 * 每頁筆數選擇器，透過下拉選單讓使用者切換每頁顯示筆數。
 *
 * 等效 React 的 `PaginationPageSize` 子元件。
 *
 * @example
 * ```html
 * import { MznPaginationPageSize } from '@mezzanine-ui/ng/pagination';
 *
 * <mzn-pagination-page-size
 *   label="每頁顯示："
 *   [options]="[10, 20, 50, 100]"
 *   [value]="pageSize"
 *   (pageSizeChanged)="onPageSizeChange($event)"
 * />
 * ```
 */
@Component({
  selector: 'mzn-pagination-page-size',
  standalone: true,
  imports: [FormsModule, MznSelect, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `
    @if (label()) {
      <div mznTypography variant="label-primary" [ellipsis]="true">{{
        label()
      }}</div>
    }
    <div
      mznSelect
      [class]="selectClass"
      [disabled]="disabled()"
      [options]="selectOptions()"
      [ngModel]="currentValueId()"
      (selectionChange)="onSelectionChange($event)"
    ></div>
  `,
})
export class MznPaginationPageSize {
  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /** 選擇器前方的標籤文字。 */
  readonly label = input<string | undefined>(undefined);

  /**
   * 可選的每頁筆數選項。
   * @default [10, 20, 50, 100]
   */
  readonly options = input<ReadonlyArray<number> | undefined>(undefined);

  /**
   * 自訂每頁筆數選項名稱的渲染函式。
   * 等效 React 版 `renderOptionName` prop。
   * @example (pageSize) => `${pageSize} 筆`
   */
  readonly renderOptionName = input<((pageSize: number) => string) | undefined>(
    undefined,
  );

  /**
   * 目前的每頁筆數。
   * @default 10
   */
  readonly value = input(10);

  /** 每頁筆數變更事件。 */
  readonly pageSizeChanged = output<number>();

  protected readonly hostClass = classes.host;
  protected readonly selectClass = classes.select;

  protected readonly selectOptions = computed(
    (): ReadonlyArray<DropdownOption> => {
      const opts = this.options() ?? [10, 20, 50, 100];
      const renderFn = this.renderOptionName();

      return opts.map((n) => ({
        id: String(n),
        name: renderFn ? renderFn(n) : String(n),
      }));
    },
  );

  protected readonly currentValueId = computed((): string =>
    String(this.value()),
  );

  protected onSelectionChange(option: DropdownOption): void {
    const size = Number(option.id);

    if (!Number.isNaN(size)) {
      this.pageSizeChanged.emit(size);
    }
  }
}
