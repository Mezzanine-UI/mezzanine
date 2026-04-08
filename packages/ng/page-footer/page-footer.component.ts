import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { IconDefinition, DotHorizontalIcon } from '@mezzanine-ui/icons';
import { pageFooterClasses as classes } from '@mezzanine-ui/core/page-footer';
import { ButtonVariant } from '@mezzanine-ui/core/button';
import {
  typographyClasses,
  toTypographyCssVars,
} from '@mezzanine-ui/core/typography';
import clsx from 'clsx';
import { MznButton } from '@mezzanine-ui/ng/button';
import { MznIcon } from '@mezzanine-ui/ng/icon';

export type PageFooterType = 'standard' | 'overflow' | 'information';

/**
 * 頁面頁腳元件，包含操作按鈕與可選的警示訊息。
 *
 * 支援三種類型：
 * - `standard`：左側顯示支援操作按鈕（`supportingActionName`）
 * - `overflow`：左側顯示僅含圖示的按鈕（`supportingActionIcon`），通常配合下拉選單使用
 * - `information`：左側顯示純文字說明（`annotation`）
 *
 * 中間區域可顯示警示訊息（`warningMessage`），右側投影 `[actions]` 插槽。
 *
 * @example
 * ```html
 * import { MznPageFooter } from '@mezzanine-ui/ng/page-footer';
 * import { MznButton } from '@mezzanine-ui/ng/button';
 *
 * <!-- standard type -->
 * <mzn-page-footer
 *   type="standard"
 *   supportingActionName="查看發佈紀錄"
 *   warningMessage="部分內容未通過驗證"
 * >
 *   <div actions>
 *     <button mznButton variant="base-secondary">儲存草稿</button>
 *     <button mznButton variant="base-primary">發佈</button>
 *   </div>
 * </mzn-page-footer>
 *
 * <!-- information type -->
 * <mzn-page-footer
 *   type="information"
 *   annotation="發佈後將無法編輯，請確認內容無誤"
 * >
 *   <div actions>
 *     <button mznButton variant="base-primary">發佈</button>
 *   </div>
 * </mzn-page-footer>
 * ```
 *
 * @see MznButton
 */
@Component({
  selector: 'mzn-page-footer',
  standalone: true,
  imports: [MznButton, MznIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `
    <div [class]="annotationClass">
      @switch (type()) {
        @case ('standard') {
          @if (supportingActionName()) {
            <button
              mznButton
              [attr.type]="supportingActionType()"
              [variant]="supportingActionVariant()"
              size="main"
              (click)="supportingActionClick.emit($event)"
            >
              @if (supportingActionIcon()) {
                <i mznIcon [icon]="supportingActionIcon()!"></i>
              }
              {{ supportingActionName() }}
            </button>
          }
        }
        @case ('overflow') {
          <button
            mznButton
            type="button"
            iconType="icon-only"
            variant="base-ghost"
            size="main"
          >
            <i mznIcon [icon]="resolvedSupportingActionIcon()"></i>
          </button>
        }
        @case ('information') {
          @if (annotation()) {
            <span [class]="annotationTextClass" [style]="annotationTextStyles">
              {{ annotation() }}
            </span>
          }
        }
      }
    </div>
    <div [class]="messageClass">
      @if (warningMessage()) {
        <span [class]="warningTextClass" [style]="warningTextStyles">
          {{ warningMessage() }}
        </span>
      }
    </div>
    <ng-content select="[actions]" />
  `,
})
export class MznPageFooter {
  /**
   * 資訊類型下顯示的純文字說明（僅在 `type="information"` 時生效）。
   */
  readonly annotation = input<string>();

  /** 額外 CSS class。 */
  readonly hostClass = input('');

  /**
   * 下拉選單按鈕的圖示（僅在 `type="overflow"` 時生效）。
   * @default DotHorizontalIcon
   */
  readonly supportingActionIcon = input<IconDefinition>();

  /**
   * 支援操作按鈕的文字（僅在 `type="standard"` 時生效）。
   */
  readonly supportingActionName = input<string>();

  /**
   * 支援操作按鈕的 HTML type 屬性（僅在 `type="standard"` 時生效）。
   * @default 'button'
   */
  readonly supportingActionType = input<'button' | 'submit' | 'reset'>(
    'button',
  );

  /**
   * 支援操作按鈕的視覺樣式變體（僅在 `type="standard"` 時生效）。
   * @default 'base-ghost'
   */
  readonly supportingActionVariant = input<ButtonVariant>('base-ghost');

  /**
   * PageFooter 的版面類型。
   * @default 'standard'
   */
  readonly type = input<PageFooterType>('standard');

  /**
   * 中間區域顯示的警示訊息文字。
   */
  readonly warningMessage = input<string>();

  /** 支援操作按鈕點擊事件（僅在 `type="standard"` 時發出）。 */
  readonly supportingActionClick = output<MouseEvent>();

  protected readonly annotationClass = classes.annotation;
  protected readonly messageClass = classes.message;

  protected readonly annotationTextClass = clsx(
    typographyClasses.type('caption'),
    typographyClasses.color,
  );

  protected readonly annotationTextStyles = toTypographyCssVars({
    color: 'text-neutral',
  }) as Record<string, string>;

  protected readonly warningTextClass = clsx(
    typographyClasses.type('caption'),
    typographyClasses.color,
    typographyClasses.align,
  );

  protected readonly warningTextStyles = toTypographyCssVars({
    align: 'right',
    color: 'text-warning',
  }) as Record<string, string>;

  protected readonly resolvedSupportingActionIcon = computed(
    (): IconDefinition => this.supportingActionIcon() ?? DotHorizontalIcon,
  );

  protected hostClasses(): string {
    return clsx(classes.host, this.hostClass());
  }
}
