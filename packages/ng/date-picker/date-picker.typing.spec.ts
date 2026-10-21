import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import {
  CalendarMethods,
  CalendarMode,
  DateType,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDatePicker } from './date-picker.component';

@Component({
  standalone: true,
  imports: [MznDatePicker],
  template: `
    <div
      mznDatePicker
      [isDateDisabled]="isDateDisabled()"
      [mode]="mode()"
      [value]="value()"
      (dateChanged)="onDateChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly displayFormat = input('YYYY-MM');
  readonly isDateDisabled = input<((date: DateType) => boolean) | undefined>(
    undefined,
  );
  readonly mode = input<CalendarMode>('month');
  readonly value = signal<DateType | undefined>(undefined);
  readonly committed: string[] = [];

  onDateChanged(next?: DateType): void {
    this.value.set(next);
    this.committed.push(next ? moment(next).format(this.displayFormat()) : '');
  }
}

interface SetupOptions {
  displayFormat: string;
  initialValue: string;
  isDateDisabled?: (date: DateType) => boolean;
  methods: CalendarMethods;
  mode: CalendarMode;
}

async function setup(options: SetupOptions): Promise<{
  el: HTMLInputElement;
  fixture: ComponentFixture<HostComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [
      {
        provide: MZN_CALENDAR_CONFIG,
        useValue: createCalendarConfig(options.methods),
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);

  fixture.componentRef.setInput('displayFormat', options.displayFormat);
  fixture.componentRef.setInput('isDateDisabled', options.isDateDisabled);
  fixture.componentRef.setInput('mode', options.mode);
  fixture.componentInstance.value.set(
    moment(options.initialValue).toISOString(),
  );
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

  return { el, fixture };
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

/** Focus the input and select all of it, like Cmd/Ctrl+A. */
function selectAll(
  fixture: ComponentFixture<HostComponent>,
  el: HTMLInputElement,
): void {
  el.focus();
  fixture.detectChanges();
  el.setSelectionRange(0, el.value.length);
}

describe('MznDatePicker typing over an existing value', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe.each([
    ['Dayjs', CalendarMethodsDayjs],
    ['Moment', CalendarMethodsMoment],
  ])('with the %s adapter', (_, methods) => {
    it('should emit dateChanged once per completed cell that changes the value', async () => {
      const { el, fixture } = await setup({
        displayFormat: 'YYYY-MM',
        initialValue: '2026-08-01',
        methods,
        mode: 'month',
      });

      selectAll(fixture, el);
      await typeKeys(fixture, el, '2025-12');

      expect(el.value).toBe('2025-12');
      expect(fixture.componentInstance.committed).toEqual([
        '2025-08',
        '2025-12',
      ]);
    });

    it('should commit a typed date that is not disabled', async () => {
      const { el, fixture } = await setup({
        displayFormat: 'YYYY-MM-DD',
        initialValue: '2026-08-15',
        isDateDisabled: (date) =>
          moment(date).format('YYYY-MM-DD') === '2026-08-20',
        methods,
        mode: 'day',
      });

      el.focus();
      fixture.detectChanges();
      el.setSelectionRange(8, 8);
      await typeKeys(fixture, el, '31');

      expect(el.value).toBe('2026-08-31');
      expect(fixture.componentInstance.committed).toEqual(['2026-08-31']);
    });
  });
});
