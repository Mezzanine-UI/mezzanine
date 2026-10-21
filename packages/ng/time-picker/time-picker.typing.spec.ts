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
import { MznTimePicker } from './time-picker.component';

@Component({
  standalone: true,
  imports: [MznTimePicker],
  template: `
    <div
      mznTimePicker
      format="HH:mm"
      [hideSecond]="true"
      [value]="value()"
      (timeChanged)="onTimeChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly value = signal<DateType | undefined>(
    moment('2026-08-01 15:30').toISOString(),
  );
  readonly committed: string[] = [];

  onTimeChanged(next?: DateType): void {
    this.value.set(next);
    this.committed.push(next ? moment(next).format('HH:mm') : '');
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

describe('MznTimePicker typing over an existing value', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it.each<[string, CalendarMethods]>([
    ['Dayjs', CalendarMethodsDayjs],
    ['Moment', CalendarMethodsMoment],
  ])(
    'should emit timeChanged for a typed time with the %s adapter',
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
      el.setSelectionRange(0, el.value.length);
      await typeKeys(fixture, el, '21:30');

      expect(el.value).toBe('21:30');
      expect(fixture.componentInstance.committed).toEqual(['21:30']);
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
    el.setSelectionRange(0, el.value.length);
    await typeKeys(fixture, el, '21:30');

    const ok = Array.from(document.body.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Ok',
    );

    expect(ok).toBeDefined();
    ok?.click();
    fixture.detectChanges();

    expect(el.value).toBe('21:30');
    expect(fixture.componentInstance.committed.at(-1)).toBe('21:30');
  });
});
