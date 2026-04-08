import { Component, Input, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { MznCalendar, CalendarDayAnnotation } from './calendar.component';
import { MznCalendarConfigProvider } from './calendar-config-provider.component';
import { MznRangeCalendar } from './range-calendar.component';

const meta: Meta<MznCalendar> = {
  title: 'Internal/Calendar',
  component: MznCalendar,
  decorators: [
    moduleMetadata({
      providers: [],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznCalendar>;

@Component({
  selector: 'story-calendar-playground',
  standalone: true,
  imports: [MznCalendar, MznCalendarConfigProvider],
  template: `
    <mzn-calendar-config-provider [methods]="methods">
      <p style="margin: 0 0 12px 0"
        >original value: {{ value() }}, formatted value: {{ value() }}</p
      >
      <mzn-calendar
        [mode]="mode"
        [referenceDate]="referenceDate()"
        [value]="value()"
        [renderAnnotations]="showAnnotations ? annotationFn : undefined"
        (dateChanged)="onDateChanged($event)"
      />
    </mzn-calendar-config-provider>
  `,
})
class CalendarPlaygroundComponent {
  @Input() mode: CalendarMode = 'day';
  @Input() showAnnotations = false;

  readonly methods = CalendarMethodsDayjs;
  readonly value = signal<DateType | undefined>(undefined);
  readonly referenceDate = signal<DateType>(new Date().toISOString());

  readonly annotationFn = (date: DateType): CalendarDayAnnotation => {
    const d = new Date(date as string);
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const dateStr = d.toISOString().slice(0, 10);

    const annotations: Record<string, CalendarDayAnnotation> = {
      [todayStr]: { color: 'text-success', value: '12.4%' },
      [yesterdayStr]: { color: 'text-error', value: '-8%' },
    };

    return annotations[dateStr] ?? { value: '--' };
  };

  onDateChanged(date: DateType): void {
    this.value.set(date);
    this.referenceDate.set(date);
  }
}

export const CalendarPlayground: Story = {
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: { type: 'select' },
      description: 'The calendar selection mode.',
      table: {
        type: {
          summary:
            "'day' | 'week' | 'month' | 'year' | 'quarter' | 'half-year'",
        },
        defaultValue: { summary: "'day'" },
      },
    },
  },
  args: {
    mode: 'day',
  },
  decorators: [moduleMetadata({ imports: [CalendarPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-calendar-playground [mode]="mode" />
    `,
  }),
};

@Component({
  selector: 'story-range-calendar-playground',
  standalone: true,
  imports: [MznRangeCalendar, MznCalendarConfigProvider],
  template: `
    <mzn-calendar-config-provider [methods]="methods">
      <p style="margin: 0 0 12px 0">
        Confirmed Range: {{ startVal() }} ~ {{ endVal() }}
      </p>
      <p style="margin: 0 0 12px 0; color: #999">
        Current Selection: {{ tempStartVal() }} ~ {{ tempEndVal() }}
      </p>
      <mzn-range-calendar
        [mode]="mode"
        [referenceDate]="referenceDate()"
        [value]="selectedValues()"
        [isDateInRange]="isDateInRange"
        [isMonthInRange]="isDateInRange"
        [isWeekInRange]="isDateInRange"
        [isYearInRange]="isDateInRange"
        [isQuarterInRange]="isDateInRange"
        [isHalfYearInRange]="isDateInRange"
        [showFooterActions]="true"
        (rangeChanged)="onRangeChanged($event)"
        (confirmed)="onOk()"
        (cancelled)="onCancel()"
      />
    </mzn-calendar-config-provider>
  `,
})
class RangeCalendarPlaygroundComponent {
  @Input() mode: CalendarMode = 'day';

  readonly methods = CalendarMethodsDayjs;
  readonly startVal = signal<DateType | undefined>(undefined);
  readonly endVal = signal<DateType | undefined>(undefined);
  readonly tempStartVal = signal<DateType | undefined>(undefined);
  readonly tempEndVal = signal<DateType | undefined>(undefined);
  readonly referenceDate = signal<DateType>(new Date().toISOString());

  readonly selectedValues = signal<ReadonlyArray<DateType> | undefined>(
    undefined,
  );

  readonly isDateInRange = (date: DateType): boolean => {
    const start = this.tempStartVal();
    const end = this.tempEndVal();
    if (!start || !end) return false;
    const d = new Date(date as string).getTime();
    return (
      d >= new Date(start as string).getTime() &&
      d <= new Date(end as string).getTime()
    );
  };

  onRangeChanged(range: [DateType, DateType | undefined]): void {
    this.tempStartVal.set(range[0]);
    this.tempEndVal.set(range[1]);

    if (range[0] && range[1]) {
      this.selectedValues.set([range[0], range[1]]);
    } else if (range[0]) {
      this.selectedValues.set([range[0]]);
    } else {
      this.selectedValues.set(undefined);
    }
  }

  onOk(): void {
    this.startVal.set(this.tempStartVal());
    this.endVal.set(this.tempEndVal());
  }

  onCancel(): void {
    this.tempStartVal.set(this.startVal());
    this.tempEndVal.set(this.endVal());
  }
}

export const RangeCalendarPlayground: StoryObj = {
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: { type: 'select' },
      description: 'The calendar selection mode.',
      table: {
        type: {
          summary:
            "'day' | 'week' | 'month' | 'year' | 'quarter' | 'half-year'",
        },
        defaultValue: { summary: "'day'" },
      },
    },
  },
  args: {
    mode: 'day',
  },
  decorators: [moduleMetadata({ imports: [RangeCalendarPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-range-calendar-playground [mode]="mode" />
    `,
  }),
};
