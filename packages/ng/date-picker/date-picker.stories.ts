import { Component, inject, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import {
  CalendarLocale,
  CalendarMode,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznDatePicker } from './date-picker.component';

const meta: Meta<MznDatePicker> = {
  title: 'Data Entry/DatePicker',
  component: MznDatePicker,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsDayjs, {
            locale: CalendarLocale.ZH_TW,
          }),
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznDatePicker>;

@Component({
  selector: 'story-date-picker-playground',
  standalone: true,
  imports: [MznDatePicker, MznTypography],
  template: `
    <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
      Value: {{ value() ?? '' }}
    </h3>
    <div
      mznDatePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [format]="format"
      [fullWidth]="fullWidth"
      [mode]="mode"
      placeholder="輸入日期"
      [readOnly]="readOnly"
      [size]="size"
      [value]="value()"
      (dateChanged)="value.set($event)"
    ></div>
  `,
})
class DatePickerPlaygroundComponent {
  clearable = false;
  disabled = false;
  error = false;
  format = 'YYYY-MM-DD';
  fullWidth = false;
  mode: CalendarMode = 'day';
  readOnly = false;
  size: 'main' | 'sub' = 'main';
  readonly value = signal<string | undefined>(undefined);
}

export const Playground: Story = {
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
      description: 'Whether the picker value can be cleared.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the picker is disabled.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      control: { type: 'boolean' },
      description: 'Whether the picker is in error state.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the picker takes full width.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
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
    format: {
      control: { type: 'text' },
      description: 'The date format string.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'YYYY-MM-DD'" },
      },
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Whether the picker is read-only.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
      description: 'The size of the picker.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    clearable: false,
    disabled: false,
    error: false,
    format: 'YYYY-MM-DD',
    fullWidth: false,
    mode: 'day',
    readOnly: false,
    size: 'main',
  },
  decorators: [moduleMetadata({ imports: [DatePickerPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-date-picker-playground
        [clearable]="clearable"
        [disabled]="disabled"
        [error]="error"
        [format]="format"
        [fullWidth]="fullWidth"
        [mode]="mode"
        [readOnly]="readOnly"
        [size]="size"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      date: '2025-12-04T16:00:00.000Z',
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Normal</strong></p>
        <div mznDatePicker [(ngModel)]="date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <div mznDatePicker [disabled]="true" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <div mznDatePicker [error]="true" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read only</strong></p>
        <div mznDatePicker [readOnly]="true" ></div>
      </div>
    `,
  }),
};

export const Method: Story = {
  render: () => ({
    props: { date: undefined as string | undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsMoment</strong></p>
        <div mznDatePicker [(ngModel)]="date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsDayjs</strong></p>
        <div mznDatePicker [(ngModel)]="date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsLuxon</strong></p>
        <div mznDatePicker [(ngModel)]="date" ></div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      dateMain: undefined as string | undefined,
      dateSub: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Main</strong></p>
        <div mznDatePicker [(ngModel)]="dateMain" size="main" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Sub</strong></p>
        <div mznDatePicker [(ngModel)]="dateSub" size="sub" ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-date-picker-modes',
  standalone: true,
  imports: [MznDatePicker, MznTypography],
  template: `
    @for (m of modes; track m.mode) {
      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 8px 0;">{{
          m.label
        }}</h3>
        <p mznTypography variant="body" style="margin: 0 0 4px 0;">
          origin value: {{ m.value ?? '' }}
        </p>
        <p mznTypography variant="body" style="margin: 0 0 8px 0;">
          format value: {{ m.formatted }}
        </p>
        <div
          mznDatePicker
          [mode]="m.mode"
          [value]="m.value"
          placeholder="輸入日期"
          (dateChanged)="onDateChange(m, $event)"
        ></div>
      </div>
    }
  `,
})
class ModesStoryComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  readonly modes = [
    {
      mode: 'day' as const,
      label: 'Day',
      value: undefined as string | undefined,
      formatted: '',
    },
    {
      mode: 'week' as const,
      label: 'Week',
      value: undefined as string | undefined,
      formatted: '',
    },
    {
      mode: 'month' as const,
      label: 'Month',
      value: undefined as string | undefined,
      formatted: '',
    },
    {
      mode: 'year' as const,
      label: 'Year',
      value: undefined as string | undefined,
      formatted: '',
    },
    {
      mode: 'quarter' as const,
      label: 'Quarter',
      value: undefined as string | undefined,
      formatted: '',
    },
    {
      mode: 'half-year' as const,
      label: 'Half year',
      value: undefined as string | undefined,
      formatted: '',
    },
  ];

  onDateChange(m: (typeof this.modes)[number], val: string | undefined): void {
    m.value = val;
    const fmt = getDefaultModeFormat(m.mode);
    m.formatted = val
      ? this.config.formatToString(this.config.locale, val, fmt)
      : '';
  }
}

export const Modes: Story = {
  decorators: [moduleMetadata({ imports: [ModesStoryComponent] })],
  render: () => ({
    template: `<story-date-picker-modes />`,
  }),
};

@Component({
  selector: 'story-date-picker-custom-disable',
  standalone: true,
  imports: [MznDatePicker, MznTypography],
  template: `
    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >1. Disable Navigation Controls</h2
      >
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        Disable month/year switching buttons and navigation arrows. Useful when
        you want to restrict user to current view only.
      </p>
      <div
        mznDatePicker
        [value]="valNav"
        [fullWidth]="true"
        [disabledMonthSwitch]="true"
        [disabledYearSwitch]="true"
        [disableOnNext]="true"
        [disableOnDoubleNext]="true"
        [disableOnPrev]="true"
        [disableOnDoublePrev]="true"
        mode="day"
        format="YYYY-MM-DD"
        placeholder="Date"
        (dateChanged)="valNav = $event"
      ></div>
    </div>

    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >2. Min/Max Date Range</h2
      >
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        Only allow dates within a specific range.
      </p>
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        Available range: {{ minDateStr }} ~ {{ maxDateStr }} (±30 days from
        today)
      </p>
      <div
        mznDatePicker
        [value]="valMinMax"
        [fullWidth]="true"
        [isDateDisabled]="isDateOutOfRange"
        mode="day"
        format="YYYY-MM-DD"
        placeholder="Date"
        (dateChanged)="valMinMax = $event"
      ></div>
    </div>

    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >3. Mode-specific Disable Examples</h2
      >

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Day: Disable {{ disabledDatesStartStr }} ~ {{ disabledDatesEndStr }}
        </h3>
        <div
          mznDatePicker
          [value]="valD"
          [isDateDisabled]="isDateDisabled"
          mode="day"
          placeholder="Date"
          (dateChanged)="valD = $event"
        ></div>
      </div>

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Week: Disable {{ disabledWeeksStartStr }} ~ {{ disabledWeeksEndStr }}
        </h3>
        <div
          mznDatePicker
          [value]="valW"
          [isWeekDisabled]="isWeekDisabled"
          mode="week"
          placeholder="Week"
          (dateChanged)="valW = $event"
        ></div>
      </div>

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Month: Disable {{ disabledMonthsStartStr }} ~
          {{ disabledMonthsEndStr }}
        </h3>
        <div
          mznDatePicker
          [value]="valM"
          [isMonthDisabled]="isMonthDisabled"
          mode="month"
          placeholder="Month"
          (dateChanged)="valM = $event"
        ></div>
      </div>

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Year: Disable {{ disabledYearsStartStr }} ~ {{ disabledYearsEndStr }}
        </h3>
        <div
          mznDatePicker
          [value]="valY"
          [isYearDisabled]="isYearDisabled"
          mode="year"
          placeholder="Year"
          (dateChanged)="valY = $event"
        ></div>
      </div>

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Quarter: Disable Q1 and Q2 of current year
        </h3>
        <div
          mznDatePicker
          [value]="valQ"
          [isQuarterDisabled]="isQuarterDisabled"
          mode="quarter"
          placeholder="Quarter"
          (dateChanged)="valQ = $event"
        ></div>
      </div>

      <div style="margin: 0 0 32px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Half Year: Disable H1 of current year
        </h3>
        <div
          mznDatePicker
          [value]="valH"
          [isHalfYearDisabled]="isHalfYearDisabled"
          mode="half-year"
          placeholder="Half Year"
          (dateChanged)="valH = $event"
        ></div>
      </div>
    </div>
  `,
})
class CustomDisableStoryComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  valNav: string | undefined;
  valMinMax: string | undefined;
  valD: string | undefined;
  valW: string | undefined;
  valM: string | undefined;
  valY: string | undefined;
  valQ: string | undefined;
  valH: string | undefined;

  private readonly today = new Date();
  private readonly todayMs = this.today.getTime();
  private readonly dayMs = 86_400_000;

  // Disabled date range: 3-7 days from today
  private readonly disabledDatesStart = new Date(this.todayMs + 3 * this.dayMs);
  private readonly disabledDatesEnd = new Date(this.todayMs + 7 * this.dayMs);

  readonly disabledDatesStartStr = this.fmt(
    this.disabledDatesStart,
    'YYYY-MM-DD',
  );
  readonly disabledDatesEndStr = this.fmt(this.disabledDatesEnd, 'YYYY-MM-DD');

  // Disabled week range: 5 weeks ago to 2 weeks ago
  private readonly disabledWeeksStart = new Date(
    this.todayMs - 35 * this.dayMs,
  );
  private readonly disabledWeeksEnd = new Date(this.todayMs - 14 * this.dayMs);

  readonly disabledWeeksStartStr = this.fmt(
    this.disabledWeeksStart,
    'YYYY-MM-DD',
  );
  readonly disabledWeeksEndStr = this.fmt(this.disabledWeeksEnd, 'YYYY-MM-DD');

  // Disabled month range: 5 months ago to 1 month ago
  private readonly disabledMonthsStart = this.addMonths(this.today, -5);
  private readonly disabledMonthsEnd = this.addMonths(this.today, -1);

  readonly disabledMonthsStartStr = this.fmt(
    this.disabledMonthsStart,
    'YYYY-MM',
  );
  readonly disabledMonthsEndStr = this.fmt(this.disabledMonthsEnd, 'YYYY-MM');

  // Disabled year range: 20 years ago to 1 year ago
  readonly disabledYearsStartStr = String(this.today.getFullYear() - 20);
  readonly disabledYearsEndStr = String(this.today.getFullYear() - 1);

  // Min/Max: ±30 days
  private readonly minDate = new Date(this.todayMs - 30 * this.dayMs);
  private readonly maxDate = new Date(this.todayMs + 30 * this.dayMs);

  readonly minDateStr = this.fmt(this.minDate, 'YYYY-MM-DD');
  readonly maxDateStr = this.fmt(this.maxDate, 'YYYY-MM-DD');

  readonly isDateOutOfRange = (target: string): boolean => {
    const d = this.toDay(target);
    return d < this.toDay(this.minDate) || d > this.toDay(this.maxDate);
  };

  readonly isDateDisabled = (target: string): boolean => {
    const d = this.toDay(target);
    return (
      d >= this.toDay(this.disabledDatesStart) &&
      d <= this.toDay(this.disabledDatesEnd)
    );
  };

  readonly isWeekDisabled = (target: string): boolean => {
    const d = this.toDay(target);
    return (
      d >= this.toDay(this.disabledWeeksStart) &&
      d <= this.toDay(this.disabledWeeksEnd)
    );
  };

  readonly isMonthDisabled = (target: string): boolean => {
    const d = new Date(target);
    const ym = d.getFullYear() * 12 + d.getMonth();
    const startYm =
      this.disabledMonthsStart.getFullYear() * 12 +
      this.disabledMonthsStart.getMonth();
    const endYm =
      this.disabledMonthsEnd.getFullYear() * 12 +
      this.disabledMonthsEnd.getMonth();
    return ym >= startYm && ym <= endYm;
  };

  readonly isYearDisabled = (target: string): boolean => {
    const y = new Date(target).getFullYear();
    return (
      y >= this.today.getFullYear() - 20 && y <= this.today.getFullYear() - 1
    );
  };

  readonly isQuarterDisabled = (target: string): boolean => {
    const d = new Date(target);
    const q = Math.ceil((d.getMonth() + 1) / 3);
    return d.getFullYear() === this.today.getFullYear() && (q === 1 || q === 2);
  };

  readonly isHalfYearDisabled = (target: string): boolean => {
    const d = new Date(target);
    const h = Math.ceil((d.getMonth() + 1) / 6);
    return d.getFullYear() === this.today.getFullYear() && h === 1;
  };

  private fmt(date: Date, format: string): string {
    return this.config.formatToString(
      this.config.locale,
      date.toISOString(),
      format,
    );
  }

  /** Truncate to YYYYMMDD integer for day-level comparison (avoids time-of-day drift). */
  private toDay(d: Date | string): number {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }
}

export const CustomDisable: Story = {
  decorators: [moduleMetadata({ imports: [CustomDisableStoryComponent] })],
  render: () => ({
    template: `<story-date-picker-custom-disable />`,
  }),
};

export const CalendarIntegration: Story = {
  render: () => ({
    props: {
      dateAnnotation: undefined as string | undefined,
      dateQuickSelect: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>1. Date Annotations (renderAnnotations)</strong></p>
        <p style="margin: 0 0 12px 0">Display additional information on each date cell via calendarProps.</p>
        <div style="margin: 0 0 32px 0">
          <p style="margin: 0 0 12px 0">Example: Stock market daily changes</p>
          <div mznDatePicker [(ngModel)]="dateAnnotation" mode="day" placeholder="Date" ></div>
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Quick Select Options</strong></p>
        <p style="margin: 0 0 12px 0">Provide shortcut buttons for commonly selected dates via calendarProps.</p>
        <div style="margin: 0 0 32px 0">
          <div mznDatePicker [(ngModel)]="dateQuickSelect" mode="day" placeholder="Date" ></div>
        </div>
      </div>
    `,
  }),
};
