import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  CalendarMode,
  calendarClasses as classes,
} from '@mezzanine-ui/core/calendar';
import clsx from 'clsx';

/**
 * 日曆單元格元件，呈現單一日期/月份/年份的格子。
 *
 * @example
 * ```html
 * <mzn-calendar-cell [active]="true" [today]="true" mode="day">
 *   <button>15</button>
 * </mzn-calendar-cell>
 * ```
 */
@Component({
  selector: 'mzn-calendar-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
  template: `<span [class]="innerClass"><ng-content /></span>`,
})
export class MznCalendarCell {
  /** 是否為選取中狀態。 */
  readonly active = input(false);

  /** 是否為禁用狀態。 */
  readonly disabled = input(false);

  /** 日曆模式。 */
  readonly mode = input<CalendarMode>('day');

  /** 是否為今天。 */
  readonly today = input(false);

  /** 是否為區間起始。 */
  readonly isRangeStart = input(false);

  /** 是否為區間結束。 */
  readonly isRangeEnd = input(false);

  /** 是否為週末。 */
  readonly isWeekend = input(false);

  /** 是否帶有註解。 */
  readonly withAnnotation = input(false);

  /** 元素 role。 */
  readonly role = input<string | undefined>(undefined);

  protected readonly innerClass = classes.cellInner;

  protected hostClasses(): string {
    return clsx(classes.cell, classes.cellMode(this.mode()), {
      [classes.cellToday]: this.today(),
      [classes.cellActive]: this.active(),
      [classes.cellDisabled]: this.disabled(),
      [classes.cellWithAnnotation]: this.withAnnotation(),
      [classes.cellWeekend]: this.isWeekend(),
      [classes.cellRangeStart]: this.isRangeStart(),
      [classes.cellRangeEnd]: this.isRangeEnd(),
    });
  }
}
