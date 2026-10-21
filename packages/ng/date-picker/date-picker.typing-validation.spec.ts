import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDatePicker } from './date-picker.component';

type DisabledPredicate = (date: DateType) => boolean;

type PredicateName =
  | 'isDateDisabled'
  | 'isHalfYearDisabled'
  | 'isMonthDisabled'
  | 'isQuarterDisabled'
  | 'isWeekDisabled'
  | 'isYearDisabled';

const PREDICATE_NAMES: ReadonlyArray<PredicateName> = [
  'isDateDisabled',
  'isHalfYearDisabled',
  'isMonthDisabled',
  'isQuarterDisabled',
  'isWeekDisabled',
  'isYearDisabled',
];

@Component({
  standalone: true,
  imports: [MznDatePicker],
  template: `
    <div
      mznDatePicker
      [isDateDisabled]="isDateDisabled()"
      [isHalfYearDisabled]="isHalfYearDisabled()"
      [isMonthDisabled]="isMonthDisabled()"
      [isQuarterDisabled]="isQuarterDisabled()"
      [isWeekDisabled]="isWeekDisabled()"
      [isYearDisabled]="isYearDisabled()"
      [mode]="mode()"
      [value]="value()"
      (dateChanged)="onDateChanged($event)"
    ></div>
  `,
})
class HostComponent {
  readonly isDateDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly isHalfYearDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly isMonthDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly isQuarterDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly isWeekDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly isYearDisabled = input<DisabledPredicate | undefined>(undefined);
  readonly mode = input<CalendarMode>('day');
  readonly value = signal<DateType | undefined>(undefined);
  readonly committed: string[] = [];

  onDateChanged(next?: DateType): void {
    this.value.set(next);
    this.committed.push(next ? moment(next).format('YYYY-MM-DD') : '');
  }
}

async function setup(
  mode: CalendarMode,
  predicates: Partial<Record<PredicateName, DisabledPredicate>>,
): Promise<{
  el: HTMLInputElement;
  fixture: ComponentFixture<HostComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [HostComponent],
    providers: [
      {
        provide: MZN_CALENDAR_CONFIG,
        useValue: createCalendarConfig(CalendarMethodsDayjs),
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(HostComponent);

  fixture.componentRef.setInput('mode', mode);
  PREDICATE_NAMES.forEach((name) => {
    fixture.componentRef.setInput(name, predicates[name]);
  });
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelector('input') as HTMLInputElement;

  return { el, fixture };
}

/** Focus the input and press each key in turn, letting the formatter restore the cursor in between. */
async function typeKeys(
  fixture: ComponentFixture<HostComponent>,
  el: HTMLInputElement,
  keys: string,
): Promise<void> {
  el.focus();
  fixture.detectChanges();
  el.setSelectionRange(0, 0);

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

const alwaysDisabled: DisabledPredicate = () => true;

/** Each mode with the digits to type, the date they resolve to and the predicate React checks. */
const MODE_CASES: ReadonlyArray<[CalendarMode, string, string, PredicateName]> =
  [
    ['day', '20260820', '2026-08-20', 'isDateDisabled'],
    ['month', '202608', '2026-08-01', 'isMonthDisabled'],
    ['year', '2026', '2026-01-01', 'isYearDisabled'],
  ];

describe('MznDatePicker typed-input validation', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe.each(MODE_CASES)(
    'in %s mode',
    (mode, keys, expected, matchingPredicate) => {
      it('should ignore the disabled predicates of other modes', async () => {
        const predicates = Object.fromEntries(
          PREDICATE_NAMES.filter((name) => name !== matchingPredicate).map(
            (name) => [name, alwaysDisabled],
          ),
        );
        const { el, fixture } = await setup(mode, predicates);

        await typeKeys(fixture, el, keys);

        expect(fixture.componentInstance.committed).toEqual([expected]);
      });

      it(`should reject a typed value that ${matchingPredicate} disables`, async () => {
        const { el, fixture } = await setup(mode, {
          [matchingPredicate]: (date: DateType) =>
            moment(date).format('YYYY-MM-DD') === expected,
        });

        await typeKeys(fixture, el, keys);

        expect(fixture.componentInstance.committed).toEqual([]);
      });
    },
  );
});
