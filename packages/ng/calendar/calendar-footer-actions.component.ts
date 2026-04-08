import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';

/**
 * 日曆頁腳操作按鈕元件（如 Cancel / Ok）。
 *
 * @example
 * ```html
 * <div mznCalendarFooterActions
 *   [cancelText]="'Cancel'"
 *   [confirmText]="'Ok'"
 *   (cancelled)="onCancel()"
 *   (confirmed)="onConfirm()"
 * ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarFooterActions]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.cancelText]': 'null',
    '[attr.confirmText]': 'null',
    '[attr.cancelDisabled]': 'null',
    '[attr.confirmDisabled]': 'null',
  },
  template: `
    <button
      type="button"
      class="mzn-button mzn-button--base-tertiary mzn-button--minor"
      [disabled]="cancelDisabled()"
      (click)="cancelled.emit()"
      >{{ cancelText() }}</button
    >
    <button
      type="button"
      class="mzn-button mzn-button--base-primary mzn-button--minor"
      [disabled]="confirmDisabled()"
      (click)="confirmed.emit()"
      >{{ confirmText() }}</button
    >
  `,
})
export class MznCalendarFooterActions {
  /** 取消按鈕文字。 */
  readonly cancelText = input('Cancel');
  /** 確認按鈕文字。 */
  readonly confirmText = input('Ok');
  /** 取消按鈕禁用。 */
  readonly cancelDisabled = input(false);
  /** 確認按鈕禁用。 */
  readonly confirmDisabled = input(false);

  /** 取消事件。 */
  readonly cancelled = output<void>();
  /** 確認事件。 */
  readonly confirmed = output<void>();

  protected readonly hostClass = classes.footerActions;
}
