import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  calendarClasses as classes,
  CalendarFooterControlChildren,
} from '@mezzanine-ui/core/calendar';
import { MznButton } from '@mezzanine-ui/ng/button';

/**
 * Bundle of the calendar footer control, mirroring React
 * `calendarFooterControlProps`.
 */
export interface MznCalendarFooterControlProps {
  /**
   * The label: a string applies to every mode, while a map overrides the listed
   * modes and keeps the default label for the others. Prefer a map in pickers,
   * whose footer follows the panel the user drilled down to.
   */
  readonly children?: CalendarFooterControlChildren;
  /** Extra class of the footer control host. */
  readonly className?: string;
  /** Whether the button is disabled. */
  readonly disabled?: boolean;
}

/**
 * Footer shortcut of the calendar, such as "Today" or "This month".
 *
 * The label is projected, mirroring the `children` of React's
 * `CalendarFooterControl`.
 *
 * @example
 * ```html
 * <div mznCalendarFooterControl (footerClick)="goToToday()">Today</div>
 * ```
 *
 * @see {@link MznCalendar} The calendar rendering this control
 */
@Component({
  selector: '[mznCalendarFooterControl]',
  standalone: true,
  imports: [MznButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass',
    '[attr.disabled]': 'null',
  },
  template: `
    <button
      mznButton
      type="button"
      size="minor"
      variant="base-ghost"
      [disabled]="disabled()"
      (click)="footerClick.emit()"
    >
      <ng-content />
    </button>
  `,
})
export class MznCalendarFooterControl {
  /**
   * Whether the button is disabled.
   * @default false
   */
  readonly disabled = input(false);

  /** Fired when the button is clicked. */
  readonly footerClick = output<void>();

  protected readonly hostClass = classes.footerControl;
}
