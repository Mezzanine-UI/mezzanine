import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { paginationJumperClasses as classes } from '@mezzanine-ui/core/pagination/paginationJumper';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznTypography } from '@mezzanine-ui/ng/typography';

/**
 * 頁碼跳轉元件，提供文字輸入框讓使用者直接跳至指定頁碼。
 *
 * 等效 React 的 `PaginationJumper` 子元件。
 *
 * @example
 * ```html
 * import { MznPaginationJumper } from '@mezzanine-ui/ng/pagination';
 *
 * <div mznPaginationJumper
 *   buttonText="確認"
 *   hintText="前往"
 *   inputPlaceholder="1"
 *   [pageSize]="10"
 *   [total]="100"
 *   (pageChanged)="onPageChange($event)"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznPaginationJumper]',
  standalone: true,
  imports: [MznButton, MznTypography],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.buttonText]': 'null',
    '[attr.disabled]': 'null',
    '[attr.hintText]': 'null',
    '[attr.inputPlaceholder]': 'null',
    '[attr.pageSize]': 'null',
    '[attr.total]': 'null',
  },
  template: `
    @if (hintText()) {
      <div mznTypography variant="label-primary" [ellipsis]="true">{{
        hintText()
      }}</div>
    }
    <input
      #jumperInput
      type="number"
      [class]="inputClass"
      [disabled]="disabled()"
      [placeholder]="inputPlaceholder() ?? ''"
      (keydown.enter)="onSubmit(jumperInput)"
    />
    <button
      mznButton
      type="button"
      size="sub"
      [disabled]="disabled()"
      (click)="onSubmit(jumperInput)"
      >{{ buttonText() }}</button
    >
  `,
})
export class MznPaginationJumper {
  /** 跳轉按鈕文字。 */
  readonly buttonText = input<string | undefined>(undefined);

  /**
   * 是否禁用。
   * @default false
   */
  readonly disabled = input(false);

  /** 跳轉輸入框前的提示文字。 */
  readonly hintText = input<string | undefined>(undefined);

  /** 跳轉輸入框的 placeholder。 */
  readonly inputPlaceholder = input<string | undefined>(undefined);

  /**
   * 每頁筆數，用於計算總頁數。
   * @default 10
   */
  readonly pageSize = input(10);

  /**
   * 總筆數。
   * @default 0
   */
  readonly total = input(0);

  /** 頁碼變更事件。 */
  readonly pageChanged = output<number>();

  protected readonly hostClass = classes.host;
  protected readonly inputClass = classes.input;

  private readonly totalPages = computed((): number => {
    const t = this.total();

    return t ? Math.ceil(t / this.pageSize()) : 1;
  });

  protected onSubmit(inputEl: HTMLInputElement): void {
    const raw = Number(inputEl.value);
    const tp = this.totalPages();

    if (raw >= 1 && raw <= tp && Number.isInteger(raw)) {
      this.pageChanged.emit(raw);
    }

    inputEl.value = '';
  }
}
