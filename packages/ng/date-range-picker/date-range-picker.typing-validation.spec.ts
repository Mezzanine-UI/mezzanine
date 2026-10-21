import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import moment from 'moment';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDateRangePicker } from './date-range-picker.component';

type DisabledPredicate = (date: DateType) => boolean;

type Validator = (isoDate: string) => boolean;

type HostInputName =
  | 'isDateDisabled'
  | 'isHalfYearDisabled'
  | 'isMonthDisabled'
  | 'isQuarterDisabled'
  | 'isWeekDisabled'
  | 'isYearDisabled'
  | 'validateFrom'
  | 'validateTo';

const PREDICATE_NAMES: ReadonlyArray<HostInputName> = [
  'isDateDisabled',
  'isHalfYearDisabled',
  'isMonthDisabled',
  'isQuarterDisabled',
  'isWeekDisabled',
  'isYearDisabled',
];

@Component({
  standalone: true,
  imports: [MznDateRangePicker],
  template: `
    <div
      mznDateRangePicker
      [isDateDisabled]="isDateDisabled()"
      [isHalfYearDisabled]="isHalfYearDisabled()"
      [isMonthDisabled]="isMonthDisabled()"
      [isQuarterDisabled]="isQuarterDisabled()"
      [isWeekDisabled]="isWeekDisabled()"
      [isYearDisabled]="isYearDisabled()"
      [mode]="mode()"
      [validateFrom]="validateFrom()"
      [validateTo]="validateTo()"
      [value]="value()"
      (rangeChanged)="onRangeChanged($event)"
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
  readonly validateFrom = input<Validator | undefined>(undefined);
  readonly validateTo = input<Validator | undefined>(undefined);
  readonly value = signal<RangePickerValue | undefined>(undefined);
  readonly committed: string[] = [];

  onRangeChanged(next: RangePickerValue): void {
    this.value.set(next);
    this.committed.push(
      next.map((date) => moment(date).format('YYYY-MM-DD')).join(' ~ '),
    );
  }
}

/** Typed into the empty slot of a range whose other end is already set. */
const SLOT_CASES: ReadonlyArray<
  [string, number, RangePickerValue, string, string, HostInputName]
> = [
  [
    'from',
    0,
    [undefined, '2026-08-20'] as unknown as RangePickerValue,
    '20260812',
    '2026-08-12 ~ 2026-08-20',
    'validateFrom',
  ],
  [
    'to',
    1,
    ['2026-08-10', undefined] as unknown as RangePickerValue,
    '20260818',
    '2026-08-10 ~ 2026-08-18',
    'validateTo',
  ],
];

async function setup(
  initialValue: RangePickerValue,
  inputIndex: number,
  inputs: Partial<Record<HostInputName, DisabledPredicate | Validator>>,
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

  Object.entries(inputs).forEach(([name, fn]) => {
    fixture.componentRef.setInput(name, fn);
  });
  fixture.componentInstance.value.set(
    initialValue.map((date) =>
      date ? moment(date).toISOString() : undefined,
    ) as unknown as RangePickerValue,
  );
  fixture.detectChanges();

  const el = fixture.nativeElement.querySelectorAll('input')[
    inputIndex
  ] as HTMLInputElement;

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

const alwaysDisabled = (): boolean => true;

describe('MznDateRangePicker typed-input validation', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe.each(SLOT_CASES)(
    'typing into the %s input',
    (_, inputIndex, initialValue, keys, expected, ownValidator) => {
      const otherValidator: HostInputName =
        ownValidator === 'validateFrom' ? 'validateTo' : 'validateFrom';

      it('should not check the disabled predicates, like React', async () => {
        const predicates = Object.fromEntries(
          PREDICATE_NAMES.map((name) => [name, alwaysDisabled]),
        );
        const { el, fixture } = await setup(
          initialValue,
          inputIndex,
          predicates,
        );

        await typeKeys(fixture, el, keys);

        expect(fixture.componentInstance.committed).toEqual([expected]);
      });

      it(`should reject a typed value that ${ownValidator} rejects`, async () => {
        const validator = jest.fn<boolean, [string]>(() => false);
        const { el, fixture } = await setup(initialValue, inputIndex, {
          [ownValidator]: validator,
        });

        await typeKeys(fixture, el, keys);

        expect(fixture.componentInstance.committed).toEqual([]);
        expect(validator).toHaveBeenCalled();
        expect(moment(validator.mock.calls[0][0]).format('YYYY-MM-DD')).toBe(
          expected.split(' ~ ')[inputIndex],
        );
      });

      it(`should ignore ${otherValidator}`, async () => {
        const { el, fixture } = await setup(initialValue, inputIndex, {
          [otherValidator]: alwaysDisabled,
          [ownValidator]: () => true,
        });

        await typeKeys(fixture, el, keys);

        expect(fixture.componentInstance.committed).toEqual([expected]);
      });
    },
  );
});
