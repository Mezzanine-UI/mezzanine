import { Component, Input, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import moment from 'moment';
import {
  CalendarLocale,
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { MznToggle } from '@mezzanine-ui/ng/toggle';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import {
  MznCalendar,
  CalendarDayAnnotation,
  CalendarQuickSelectOption,
} from './calendar.component';
import { MznCalendarConfigProvider } from './calendar-config-provider.component';
import { MZN_CALENDAR_CONFIG, createCalendarConfig } from './calendar-config';
import { MznRangeCalendar } from './range-calendar.component';

const LOCALE = CalendarLocale.EN_US;

/**
 * 對齊 React `formatValue`：以 moment 處理所有 mode 的格式化，半年模式
 * 做 `[H]n` 的 token 展開（moment 不原生支援半年 token）。
 */
function formatValueByMode(value: DateType, mode: CalendarMode): string {
  const format = getDefaultModeFormat(mode, LOCALE);
  const m = moment(value as string);

  if (format === 'YYYY-[H]n') {
    const quarter = m.quarter();
    const halfYear = Math.ceil(quarter / 2);
    return `${m.format('YYYY')}-H${halfYear}`;
  }

  return m.format(format);
}

const meta: Meta<MznCalendar> = {
  title: 'Internal/Calendar',
  component: MznCalendar,
  decorators: [
    moduleMetadata({
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsDayjs),
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznCalendar>;

/**
 * 對齊 React `InnerCalendarPlayground`：mode=day 時提供 QuickSelect /
 * Annotations 兩個 Toggle；上方 Typography 顯示原始值 + 模式化後的值；
 * 下方 MznCalendar 受控 by `val` / `referenceDate` signals。三個函式庫
 * (Moment / Dayjs / Luxon) 的 column 共用此元件，差異由外層父元件透過
 * `[mznCalendarConfigProvider]` 提供對應的 methods。
 */
@Component({
  selector: 'story-inner-calendar-playground',
  standalone: true,
  imports: [FormsModule, MznCalendar, MznToggle, MznTypography],
  template: `
    @if (mode === 'day') {
      <div
        mznToggle
        label="Enabled QuickSelect"
        [(ngModel)]="showQuickSelect"
      ></div>
      <div
        mznToggle
        label="Enabled Annotations"
        [(ngModel)]="showAnnotations"
      ></div>
    }
    <p mznTypography style="margin: 0 0 12px 0;">
      original value: {{ val() }}, formatted value: {{ formattedVal() }}
    </p>
    <div
      mznCalendar
      [mode]="mode"
      [referenceDate]="referenceDate()"
      [value]="val()"
      [renderAnnotations]="showAnnotations ? annotationFn : undefined"
      [quickSelect]="showQuickSelect ? quickSelectCfg() : undefined"
      (dateChanged)="onDateChanged($event)"
    ></div>
  `,
})
class InnerCalendarPlaygroundComponent {
  @Input() mode: CalendarMode = 'day';

  showQuickSelect = false;
  showAnnotations = false;

  readonly val = signal<DateType | undefined>(undefined);
  readonly referenceDate = signal<DateType>(moment().toISOString());

  readonly formattedVal = computed((): string => {
    const v = this.val();

    if (!v) return '';

    return formatValueByMode(v, this.mode);
  });

  readonly annotationFn = (
    date: DateType,
  ): CalendarDayAnnotation | undefined => {
    const dateKey = moment(date as string).format('YYYY-MM-DD');
    const availableAnnotations: Record<string, CalendarDayAnnotation> = {
      [moment().format('YYYY-MM-DD')]: {
        color: 'text-success',
        value: '12.4%',
      },
      [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
        color: 'text-error',
        value: '-8%',
      },
    };

    return availableAnnotations[dateKey];
  };

  private readonly quickSelectOptions: ReadonlyArray<CalendarQuickSelectOption> =
    [
      {
        id: 'yesterday',
        name: 'Yesterday',
        onClick: (): void =>
          this.onDateChanged(moment().subtract(1, 'day').toISOString()),
      },
      {
        id: 'today',
        name: 'Today',
        onClick: (): void => this.onDateChanged(moment().toISOString()),
      },
      {
        id: 'tomorrow',
        name: 'Tomorrow',
        onClick: (): void =>
          this.onDateChanged(moment().add(1, 'day').toISOString()),
      },
    ];

  readonly quickSelectCfg = computed(() => ({
    activeId: this.computeActiveQuickSelectId(),
    options: this.quickSelectOptions,
  }));

  private computeActiveQuickSelectId(): string | undefined {
    const v = this.val();

    if (!v) return undefined;

    const vm = moment(v as string);
    const todayMoment = moment();

    if (vm.isSame(todayMoment, 'day')) return 'today';

    if (vm.isSame(todayMoment.clone().subtract(1, 'day'), 'day')) {
      return 'yesterday';
    }

    if (vm.isSame(todayMoment.clone().add(1, 'day'), 'day')) {
      return 'tomorrow';
    }

    return undefined;
  }

  onDateChanged(date: DateType): void {
    this.val.set(date);
    this.referenceDate.set(date);
  }
}

/**
 * 對齊 React `CalendarPlayground`：三個函式庫的 calendar 並排展示。
 * 以 `[mznCalendarConfigProvider]` 指令包裹每個 column，提供不同的
 * methods (Moment / Dayjs / Luxon)，透過 DI 灌入到內層 MznCalendar。
 */
@Component({
  selector: 'story-calendar-playground',
  standalone: true,
  imports: [
    InnerCalendarPlaygroundComponent,
    MznCalendarConfigProvider,
    MznTypography,
  ],
  template: `
    <div style="display: flex; flex-flow: row wrap; gap: 12px;">
      <div mznCalendarConfigProvider [methods]="momentMethods" locale="en-US">
        <p mznTypography>Moment</p>
        <story-inner-calendar-playground [mode]="mode" />
      </div>
      <div mznCalendarConfigProvider [methods]="dayjsMethods" locale="en-US">
        <p mznTypography>Dayjs</p>
        <story-inner-calendar-playground [mode]="mode" />
      </div>
      <div mznCalendarConfigProvider [methods]="luxonMethods" locale="en-US">
        <p mznTypography>Luxon</p>
        <story-inner-calendar-playground [mode]="mode" />
      </div>
    </div>
  `,
})
class CalendarPlaygroundComponent {
  @Input() mode: CalendarMode = 'day';

  readonly momentMethods = CalendarMethodsMoment;
  readonly dayjsMethods = CalendarMethodsDayjs;
  readonly luxonMethods = CalendarMethodsLuxon;
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

/**
 * 對齊 React `InnerRangeCalendarPlayground`：day mode 提供 QuickSelect
 * Toggle；上方 Typography 顯示 Confirmed Range 與 Current Selection；
 * 下方 MznRangeCalendar 有 footer actions (Ok / Cancel)。
 */
@Component({
  selector: 'story-range-calendar-playground',
  standalone: true,
  imports: [FormsModule, MznRangeCalendar, MznToggle, MznTypography],
  template: `
    @if (mode === 'day') {
      <div
        mznToggle
        label="Enabled QuickSelect"
        [(ngModel)]="showQuickSelect"
      ></div>
    }
    <p mznTypography style="margin: 0 0 12px 0;">
      Confirmed Range: {{ confirmedStart() }} ~ {{ confirmedEnd() }}
    </p>
    <p mznTypography style="margin: 0 0 12px 0; color: #999;">
      Current Selection: {{ tempStart() }} ~ {{ tempEnd() }}
    </p>
    <div
      mznRangeCalendar
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
      [quickSelect]="showQuickSelect ? quickSelectCfg() : undefined"
      (rangeChanged)="onRangeChanged($event)"
      (confirmed)="onOk()"
      (cancelled)="onCancel()"
    ></div>
  `,
})
class RangeCalendarPlaygroundComponent {
  @Input() mode: CalendarMode = 'day';

  showQuickSelect = false;

  readonly confirmedStart = signal<DateType | undefined>(undefined);
  readonly confirmedEnd = signal<DateType | undefined>(undefined);
  readonly tempStart = signal<DateType | undefined>(undefined);
  readonly tempEnd = signal<DateType | undefined>(undefined);
  readonly referenceDate = signal<DateType>(moment().toISOString());

  readonly selectedValues = signal<ReadonlyArray<DateType> | undefined>(
    undefined,
  );

  readonly isDateInRange = (date: DateType): boolean => {
    const start = this.tempStart();
    const end = this.tempEnd();

    if (!start || !end) return false;

    return moment(date as string).isBetween(
      start as string,
      end as string,
      null,
      '[]',
    );
  };

  private readonly quickSelectOptions: ReadonlyArray<CalendarQuickSelectOption> =
    [
      {
        id: 'lastWeek',
        name: 'Last 7 Days',
        onClick: (): void => {
          const end = moment();
          const start = moment().subtract(7, 'days');

          this.tempStart.set(start.toISOString());
          this.tempEnd.set(end.toISOString());
          this.selectedValues.set([start.toISOString(), end.toISOString()]);
        },
      },
      {
        id: 'lastMonth',
        name: 'Last 30 Days',
        onClick: (): void => {
          const end = moment();
          const start = moment().subtract(30, 'days');

          this.tempStart.set(start.toISOString());
          this.tempEnd.set(end.toISOString());
          this.selectedValues.set([start.toISOString(), end.toISOString()]);
        },
      },
    ];

  readonly quickSelectCfg = computed(() => ({
    activeId: this.computeActiveQuickSelectId(),
    options: this.quickSelectOptions,
  }));

  private computeActiveQuickSelectId(): string | undefined {
    const start = this.tempStart();
    const end = this.tempEnd();

    if (!start || !end) return undefined;

    const endMoment = moment(end as string);
    const startMoment = moment(start as string);
    const todayMoment = moment();

    if (
      startMoment.isSame(todayMoment.clone().subtract(7, 'days'), 'day') &&
      endMoment.isSame(todayMoment, 'day')
    ) {
      return 'lastWeek';
    }

    if (
      startMoment.isSame(todayMoment.clone().subtract(30, 'days'), 'day') &&
      endMoment.isSame(todayMoment, 'day')
    ) {
      return 'lastMonth';
    }

    return undefined;
  }

  onRangeChanged(range: [DateType, DateType | undefined]): void {
    this.tempStart.set(range[0]);
    this.tempEnd.set(range[1]);

    if (range[0] && range[1]) {
      this.selectedValues.set([range[0], range[1]]);
    } else if (range[0]) {
      this.selectedValues.set([range[0]]);
    } else {
      this.selectedValues.set(undefined);
    }
  }

  onOk(): void {
    this.confirmedStart.set(this.tempStart());
    this.confirmedEnd.set(this.tempEnd());
  }

  onCancel(): void {
    this.tempStart.set(this.confirmedStart());
    this.tempEnd.set(this.confirmedEnd());
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
