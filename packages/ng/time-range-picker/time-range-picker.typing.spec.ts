import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTimeRangePicker } from './time-range-picker.component';

@Component({
  standalone: true,
  imports: [MznTimeRangePicker],
  template: `
    <div
      mznTimeRangePicker
      format="HH:mm"
      [value]="value()"
      (rangeChanged)="onRangeChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly value = signal<RangePickerValue | undefined>([
    moment('2026-08-01 09:00').toISOString(),
    moment('2026-08-01 18:00').toISOString(),
  ]);
  readonly committed: string[] = [];

  onRangeChanged(next: RangePickerValue): void {
    this.value.set(next);
    this.committed.push(
      next.map((time) => moment(time).format('HH:mm')).join(' ~ '),
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

describe('MznTimeRangePicker typing with a strict adapter (Moment)', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it.each([
    [0, '10', '10:00 ~ 18:00'],
    [1, '17', '09:00 ~ 17:00'],
  ])(
    'should commit an hour typed into input %i',
    async (index, hour, expected) => {
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
      el.setSelectionRange(0, 0);
      await typeKeys(fixture, el, hour);

      expect(fixture.componentInstance.committed).toEqual([expected]);
    },
  );

  it('should keep a typed time when the panel is confirmed', async () => {
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

    const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    el.focus();
    fixture.detectChanges();
    el.setSelectionRange(0, 0);
    await typeKeys(fixture, el, '10');

    const ok = Array.from(document.body.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ok',
    );

    expect(ok).toBeDefined();
    ok?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.committed.at(-1)).toBe('10:00 ~ 18:00');
  });
});
