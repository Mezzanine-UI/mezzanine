import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
      [class]="resolvedCancelButtonClass()"
      [disabled]="cancelDisabled()"
      (click)="cancelled.emit()"
      >{{ cancelText() }}</button
    >
    <button
      type="button"
      [class]="resolvedConfirmButtonClass()"
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

  private readonly cancelButtonBase = `${buttonClasses.host} ${buttonClasses.variant('base-tertiary')} ${buttonClasses.size('minor')}`;
  private readonly confirmButtonBase = `${buttonClasses.host} ${buttonClasses.variant('base-primary')} ${buttonClasses.size('minor')}`;

  protected readonly resolvedCancelButtonClass = computed((): string =>
    this.cancelDisabled()
      ? `${this.cancelButtonBase} ${buttonClasses.disabled}`
      : this.cancelButtonBase,
  );

  protected readonly resolvedConfirmButtonClass = computed((): string =>
    this.confirmDisabled()
      ? `${this.confirmButtonBase} ${buttonClasses.disabled}`
      : this.confirmButtonBase,
  );
}
