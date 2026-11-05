import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDateRangePicker } from './date-range-picker.component';

@Component({
  standalone: true,
  imports: [MznDateRangePicker],
  template: `
    <div
      mznDateRangePicker
      [value]="value()"
      (rangeChanged)="onRangeChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly value = signal<RangePickerValue | undefined>([
    moment('2026-08-10').toISOString(),
    moment('2026-08-20').toISOString(),
  ]);
  readonly committed: string[] = [];

  onRangeChanged(next: RangePickerValue): void {
    this.value.set(next);
    this.committed.push(
      next.map((date) => moment(date).format('YYYY-MM-DD')).join(' ~ '),
    );
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

describe('MznDateRangePicker typing with a strict adapter (Moment)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it.each([
    [0, '12', '2026-08-12 ~ 2026-08-20'],
    [1, '18', '2026-08-10 ~ 2026-08-18'],
  ])(
    'should commit a day typed into input %i',
    async (index, day, expected) => {
      await TestBed.configureTestingModule({
        imports: [HostComponent],
        providers: [
          {
            provide: MZN_CALENDAR_CONFIG,
            useValue: createCalendarConfig(CalendarMethodsMoment),
          },
        ],
      }).compileComponents();

      const fixture = TestBed.createComponent(HostComponent);

      fixture.detectChanges();

      const el = fixture.nativeElement.querySelectorAll('input')[
        index
      ] as HTMLInputElement;

      el.focus();
      fixture.detectChanges();
      el.setSelectionRange(8, 8);
      await typeKeys(fixture, el, day);

      expect(fixture.componentInstance.committed).toEqual([expected]);
    },
  );

  it('should keep the cursor on the next cell when the typed year swaps from and to', async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsMoment),
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(HostComponent);

    fixture.componentInstance.value.set([
      moment('2026-08-01').toISOString(),
      moment('2027-02-28').toISOString(),
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    el.focus();
    fixture.detectChanges();
    el.setSelectionRange(0, 0);

    for (const key of '2028') {
      el.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key }),
      );
      fixture.detectChanges();
    }

    expect(el.value).toBe('2027-02-28');
    expect(el.selectionStart).toBe(5);
  });
});
