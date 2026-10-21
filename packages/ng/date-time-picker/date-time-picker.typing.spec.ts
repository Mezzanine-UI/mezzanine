import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { CalendarMethods, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDateTimePicker } from './date-time-picker.component';

@Component({
  standalone: true,
  imports: [MznDateTimePicker],
  template: `
    <div
      mznDateTimePicker
      [isDateDisabled]="isDateDisabled"
      [value]="value()"
      (change)="onChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly value = signal<DateType | undefined>(
    moment('2026-08-15 15:30').toISOString(),
  );
  readonly committed: string[] = [];

  readonly isDateDisabled = (date: DateType): boolean =>
    moment(date).format('YYYY-MM-DD') === '2026-08-20';

  onChanged(next?: DateType): void {
    this.value.set(next);
    this.committed.push(next ? moment(next).format('YYYY-MM-DD HH:mm') : '');
  }
}

/** Press each key in turn, letting the formatter restore the cursor in between. */
async function typeKeys(
  fixture: ComponentFixture<HostComponent>,
  el: HTMLInputElement,
  keys: string,
): Promise<void> {
  for (const key of keys) {
    el.dispatchEvent(
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }),
    );
    fixture.detectChanges();

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

describe('MznDateTimePicker typing with isDateDisabled', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it.each<[string, CalendarMethods]>([
    ['Dayjs', CalendarMethodsDayjs],
    ['Moment', CalendarMethodsMoment],
  ])(
    'should commit a typed date that is not disabled with the %s adapter',
    async (_, methods) => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [
          {
            provide: MZN_CALENDAR_CONFIG,
            useValue: createCalendarConfig(methods),
          },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(HostComponent);

      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector(
        'input',
      ) as HTMLInputElement;

      el.focus();
      fixture.detectChanges();
      el.setSelectionRange(8, 8);
      await typeKeys(fixture, el, '31');

      expect(el.value).toBe('2026-08-31');
      expect(fixture.componentInstance.committed).toEqual(['2026-08-31 15:30']);
    },
  );
});
