import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { calendarClasses as classes } from '@mezzanine-ui/core/calendar';
import { MZN_CALENDAR_CONFIG } from './calendar-config';
import { MznCalendarCell } from './calendar-cell.component';

/**
 * 日曆星期名稱列元件，顯示一行星期名稱（Sun/Mon/...）。
 *
 * @example
 * ```html
 * <div mznCalendarDayOfWeek ></div>
 * ```
 */
@Component({
  selector: '[mznCalendarDayOfWeek]',
  standalone: true,
  imports: [MznCalendarCell],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'row',
    'aria-label': 'Days of the week',
    '[class]': 'rowClass',
    '[attr.displayWeekDayLocale]': 'null',
  },
  template: `
    @for (item of dayItems(); track item.name) {
      <div mznCalendarCell role="columnheader" [isWeekend]="item.isWeekend">
        {{ item.name }}
      </div>
    }
  `,
})
export class MznCalendarDayOfWeek {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  /** 顯示星期名稱的語系。 */
  readonly displayWeekDayLocale = input<string | undefined>(undefined);

  protected readonly rowClass = classes.row;

  protected readonly dayItems = computed(() => {
    const locale = this.displayWeekDayLocale() ?? this.config.locale;
    const names = this.config.getWeekDayNames(locale);
    const weekends = this.config.getWeekends(locale);

    return names.map((name, idx) => ({
      name,
      isWeekend: weekends[idx],
    }));
  });
}
