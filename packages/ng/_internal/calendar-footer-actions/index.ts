import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { buttonClasses } from '@mezzanine-ui/core/button';

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
  selector: 'mzn-calendar-footer-actions',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
  },
  template: `
    <button
      type="button"
      [class]="cancelButtonClass"
      [disabled]="cancelDisabled()"
      (click)="cancelled.emit()"
      >{{ cancelText() }}</button
    >
    <button
      type="button"
      [class]="confirmButtonClass"
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
  protected readonly cancelButtonClass = `${buttonClasses.host} ${buttonClasses.variant('base-tertiary')} ${buttonClasses.size('minor')}`;
  protected readonly confirmButtonClass = `${buttonClasses.host} ${buttonClasses.variant('base-primary')} ${buttonClasses.size('minor')}`;
}
