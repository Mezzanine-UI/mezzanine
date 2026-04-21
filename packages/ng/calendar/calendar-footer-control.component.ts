import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';

/**
 * 日曆頁腳控制按鈕元件（如「Today」、「This month」）。
 *
 * @example
 * ```html
 * <div mznCalendarFooterControl label="Today" (click)="goToToday()" ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarFooterControl]',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.label]': 'null',
  },
  template: `
    <button
      type="button"
      class="mzn-button mzn-button--base-ghost mzn-button--minor"
      (click)="footerClick.emit()"
      >{{ label() }}</button
    >
  `,
})
export class MznCalendarFooterControl {
  /** 按鈕文字。 */
  readonly label = input('Today');

  /** 點擊事件。 */
  readonly footerClick = output<void>();

  protected readonly hostClass = classes.footerControl;
}
