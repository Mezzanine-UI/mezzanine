import { Component, inject, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import {
  CalendarLocale,
  CalendarMode,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  MznCalendarConfigProvider,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznDateRangePicker } from './date-range-picker.component';

const meta: Meta<MznDateRangePicker> = {
  title: 'Data Entry/DateRangePicker',
  component: MznDateRangePicker,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
      providers: [
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsMoment, {
            locale: CalendarLocale.ZH_TW,
          }),
        },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<MznDateRangePicker>;

@Component({
  selector: 'story-date-range-picker-playground',
  standalone: true,
  imports: [MznDateRangePicker, MznTypography],
  template: `
    <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
      {{ modeLabel() }}
    </h3>
    <p mznTypography variant="body" style="margin: 0 0 12px 0;">
      current value: [{{ value()?.[0] || '' }}, {{ value()?.[1] || '' }}]
    </p>
    <p mznTypography variant="body" style="margin: 0 0 12px 0;">
      format: [{{ formattedFrom() }}, {{ formattedTo() }}]
    </p>
    <div
      mznDateRangePicker
      [clearable]="clearable"
      [confirmMode]="confirmMode"
      [disabled]="disabled"
      [error]="error"
      [format]="resolvedFormat()"
      [fullWidth]="fullWidth"
      [inputFromPlaceholder]="inputFromPlaceholder"
      [inputToPlaceholder]="inputToPlaceholder"
      [mode]="mode"
      [readOnly]="readOnly"
      [size]="size"
      [value]="value()"
      (rangeChanged)="value.set($event)"
    ></div>
  `,
})
class DateRangePickerPlaygroundComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  clearable = false;
  confirmMode: 'immediate' | 'manual' = 'immediate';
  disabled = false;
  error = false;
  fullWidth = false;
  inputFromPlaceholder = 'Start Date';
  inputToPlaceholder = 'End Date';
  mode: CalendarMode = 'day';
  readOnly = false;
  size: 'main' | 'sub' = 'main';
  readonly value = signal<RangePickerValue | undefined>(undefined);

  modeLabel(): string {
    const m = this.mode;
    return m.charAt(0).toUpperCase() + m.slice(1);
  }

  resolvedFormat(): string {
    return getDefaultModeFormat(this.mode);
  }

  formattedFrom(): string {
    const v = this.value()?.[0];
    if (!v) return '';
    return this.config.formatToString(
      this.config.locale,
      v,
      this.resolvedFormat(),
    );
  }

  formattedTo(): string {
    const v = this.value()?.[1];
    if (!v) return '';
    return this.config.formatToString(
      this.config.locale,
      v,
      this.resolvedFormat(),
    );
  }
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
    confirmMode: {
      options: ['immediate', 'manual'],
      control: { type: 'select' },
      description:
        'How range selection is confirmed. Immediate auto-closes after two picks; manual requires an Ok button.',
      table: {
        type: { summary: "'immediate' | 'manual'" },
        defaultValue: { summary: "'immediate'" },
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
    inputFromPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the start date input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Start Date'" },
      },
    },
    inputToPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the end date input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'End Date'" },
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
    confirmMode: 'immediate',
    disabled: false,
    error: false,
    fullWidth: false,
    inputFromPlaceholder: 'Start Date',
    inputToPlaceholder: 'End Date',
    mode: 'day',
    readOnly: false,
    size: 'main',
  },
  decorators: [
    moduleMetadata({ imports: [DateRangePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-date-range-picker-playground
        [clearable]="clearable"
        [confirmMode]="confirmMode"
        [disabled]="disabled"
        [error]="error"
        [fullWidth]="fullWidth"
        [inputFromPlaceholder]="inputFromPlaceholder"
        [inputToPlaceholder]="inputToPlaceholder"
        [mode]="mode"
        [readOnly]="readOnly"
        [size]="size"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Normal</strong></p>
        <div mznDateRangePicker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <div mznDateRangePicker [disabled]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <div mznDateRangePicker [error]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read only</strong></p>
        <div mznDateRangePicker [readOnly]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-date-range-picker-method',
  standalone: true,
  imports: [
    FormsModule,
    MznCalendarConfigProvider,
    MznDateRangePicker,
    MznTypography,
  ],
  template: `
    <div [mznCalendarConfigProvider] [methods]="momentMethods" locale="zh-TW">
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;"
          >CalendarMethodsMoment</h3
        >
        <div
          mznDateRangePicker
          [(ngModel)]="rangeMoment"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        ></div>
      </div>
    </div>
    <div [mznCalendarConfigProvider] [methods]="dayjsMethods" locale="zh-TW">
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;"
          >CalendarMethodsDayjs</h3
        >
        <div
          mznDateRangePicker
          [(ngModel)]="rangeDayjs"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        ></div>
      </div>
    </div>
    <div [mznCalendarConfigProvider] [methods]="luxonMethods" locale="zh-TW">
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;"
          >CalendarMethodsLuxon</h3
        >
        <div
          mznDateRangePicker
          [(ngModel)]="rangeLuxon"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        ></div>
      </div>
    </div>
  `,
})
class DateRangePickerMethodStoryComponent {
  readonly momentMethods = CalendarMethodsMoment;
  readonly dayjsMethods = CalendarMethodsDayjs;
  readonly luxonMethods = CalendarMethodsLuxon;
  rangeMoment: RangePickerValue | undefined;
  rangeDayjs: RangePickerValue | undefined;
  rangeLuxon: RangePickerValue | undefined;
}

export const Method: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [DateRangePickerMethodStoryComponent] }),
  ],
  render: () => ({
    template: `<story-date-range-picker-method />`,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      rangeMain: undefined,
      rangeSub: undefined,
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Main</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeMain" size="main" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Sub</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeSub" size="sub" ></div>
      </div>
    `,
  }),
};

@Component({
  selector: 'story-date-range-picker-modes',
  standalone: true,
  imports: [FormsModule, MznDateRangePicker, MznTypography],
  template: `
    @for (m of modes; track m.mode) {
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">{{
          m.label
        }}</h3>
        <p mznTypography variant="body" style="margin: 0 0 4px 0;">
          origin value: [{{ m.value?.[0] || '' }}, {{ m.value?.[1] || '' }}]
        </p>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          format value: [{{ formatOne(m.mode, m.value?.[0]) }},
          {{ formatOne(m.mode, m.value?.[1]) }}]
        </p>
        <div
          mznDateRangePicker
          [mode]="m.mode"
          [format]="resolvedFormat(m.mode)"
          [value]="m.value"
          [inputFromPlaceholder]="m.fromPlaceholder"
          [inputToPlaceholder]="m.toPlaceholder"
          (rangeChanged)="onChange(m, $event)"
        ></div>
      </div>
    }
  `,
})
class DateRangePickerModesStoryComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  readonly modes: Array<{
    mode: CalendarMode;
    label: string;
    fromPlaceholder: string;
    toPlaceholder: string;
    value: RangePickerValue | undefined;
  }> = [
    {
      mode: 'day',
      label: 'Day',
      fromPlaceholder: 'Start Date',
      toPlaceholder: 'End Date',
      value: undefined,
    },
    {
      mode: 'week',
      label: 'Week',
      fromPlaceholder: 'Start Week',
      toPlaceholder: 'End Week',
      value: undefined,
    },
    {
      mode: 'month',
      label: 'Month',
      fromPlaceholder: 'Start Month',
      toPlaceholder: 'End Month',
      value: undefined,
    },
    {
      mode: 'year',
      label: 'Year',
      fromPlaceholder: 'Start Year',
      toPlaceholder: 'End Year',
      value: undefined,
    },
    {
      mode: 'quarter',
      label: 'Quarter',
      fromPlaceholder: 'Start Quarter',
      toPlaceholder: 'End Quarter',
      value: undefined,
    },
    {
      mode: 'half-year',
      label: 'Half Year',
      fromPlaceholder: 'Start Half Year',
      toPlaceholder: 'End Half Year',
      value: undefined,
    },
  ];

  resolvedFormat(mode: CalendarMode): string {
    return getDefaultModeFormat(mode);
  }

  formatOne(mode: CalendarMode, val: string | undefined): string {
    if (!val) return '';
    return this.config.formatToString(
      this.config.locale,
      val,
      this.resolvedFormat(mode),
    );
  }

  onChange(
    m: (typeof this.modes)[number],
    range: RangePickerValue | undefined,
  ): void {
    m.value = range;
  }
}

export const Modes: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [DateRangePickerModesStoryComponent] }),
  ],
  render: () => ({
    template: `<story-date-range-picker-modes />`,
  }),
};

@Component({
  selector: 'story-date-range-picker-custom-disable',
  standalone: true,
  imports: [MznDateRangePicker, MznTypography],
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
        mznDateRangePicker
        [value]="valNav"
        [disabledMonthSwitch]="true"
        [disabledYearSwitch]="true"
        [disableOnNext]="true"
        [disableOnDoubleNext]="true"
        [disableOnPrev]="true"
        [disableOnDoublePrev]="true"
        mode="day"
        format="YYYY-MM-DD"
        inputFromPlaceholder="Start Date"
        inputToPlaceholder="End Date"
        (rangeChanged)="valNav = $event"
      ></div>
    </div>

    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >2. Mode-specific Disable Examples</h2
      >
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        When selecting a range that crosses disabled dates, the range will be
        blocked and selection will restart.
      </p>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Day: Disable {{ disabledDatesStartStr }} ~ {{ disabledDatesEndStr }}
        </h3>
        <div
          mznDateRangePicker
          [value]="valD"
          [isDateDisabled]="isDateDisabled"
          [format]="dayFormat"
          mode="day"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          (rangeChanged)="valD = $event"
        ></div>
      </div>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Week: Disable {{ disabledWeeksStartStr }} ~ {{ disabledWeeksEndStr }}
        </h3>
        <div
          mznDateRangePicker
          [value]="valW"
          [isWeekDisabled]="isWeekDisabled"
          [format]="weekFormat"
          mode="week"
          inputFromPlaceholder="Start Week"
          inputToPlaceholder="End Week"
          (rangeChanged)="valW = $event"
        ></div>
      </div>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Month: Disable {{ disabledMonthsStartStr }} ~
          {{ disabledMonthsEndStr }}
        </h3>
        <div
          mznDateRangePicker
          [value]="valM"
          [isMonthDisabled]="isMonthDisabled"
          [format]="monthFormat"
          mode="month"
          inputFromPlaceholder="Start Month"
          inputToPlaceholder="End Month"
          (rangeChanged)="valM = $event"
        ></div>
      </div>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Year: Disable {{ disabledYearsStartStr }} ~ {{ disabledYearsEndStr }}
        </h3>
        <div
          mznDateRangePicker
          [value]="valY"
          [isYearDisabled]="isYearDisabled"
          [format]="yearFormat"
          mode="year"
          inputFromPlaceholder="Start Year"
          inputToPlaceholder="End Year"
          (rangeChanged)="valY = $event"
        ></div>
      </div>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Quarter: Disable Q1 and Q2 of current year
        </h3>
        <div
          mznDateRangePicker
          [value]="valQ"
          [isQuarterDisabled]="isQuarterDisabled"
          [format]="quarterFormat"
          mode="quarter"
          inputFromPlaceholder="Start Quarter"
          inputToPlaceholder="End Quarter"
          (rangeChanged)="valQ = $event"
        ></div>
      </div>

      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Half Year: Disable H1 of current year
        </h3>
        <div
          mznDateRangePicker
          [value]="valH"
          [isHalfYearDisabled]="isHalfYearDisabled"
          [format]="halfYearFormat"
          mode="half-year"
          inputFromPlaceholder="Start Half Year"
          inputToPlaceholder="End Half Year"
          (rangeChanged)="valH = $event"
        ></div>
      </div>
    </div>
  `,
})
class DateRangePickerCustomDisableStoryComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  valNav: RangePickerValue | undefined;
  valD: RangePickerValue | undefined;
  valW: RangePickerValue | undefined;
  valM: RangePickerValue | undefined;
  valY: RangePickerValue | undefined;
  valQ: RangePickerValue | undefined;
  valH: RangePickerValue | undefined;

  readonly dayFormat = getDefaultModeFormat('day');
  readonly weekFormat = getDefaultModeFormat('week');
  readonly monthFormat = getDefaultModeFormat('month');
  readonly yearFormat = getDefaultModeFormat('year');
  readonly quarterFormat = getDefaultModeFormat('quarter');
  readonly halfYearFormat = getDefaultModeFormat('half-year');

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
    this.weekFormat,
  );
  readonly disabledWeeksEndStr = this.fmt(
    this.disabledWeeksEnd,
    this.weekFormat,
  );

  // Disabled month range: 5 months ago to 1 month ago
  private readonly disabledMonthsStart = this.addMonths(this.today, -5);
  private readonly disabledMonthsEnd = this.addMonths(this.today, -1);

  readonly disabledMonthsStartStr = this.fmt(
    this.disabledMonthsStart,
    'YYYY-MM',
  );
  readonly disabledMonthsEndStr = this.fmt(this.disabledMonthsEnd, 'YYYY-MM');

  // Disabled year range: 5 years ago to 1 year ago
  readonly disabledYearsStartStr = String(this.today.getFullYear() - 5);
  readonly disabledYearsEndStr = String(this.today.getFullYear() - 1);

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
      y >= this.today.getFullYear() - 5 && y <= this.today.getFullYear() - 1
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
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({ imports: [DateRangePickerCustomDisableStoryComponent] }),
  ],
  render: () => ({
    template: `<story-date-range-picker-custom-disable />`,
  }),
};

@Component({
  selector: 'story-date-range-picker-calendar-integration',
  standalone: true,
  imports: [MznDateRangePicker, MznTypography],
  template: `
    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >1. Date Annotations (renderAnnotations)</h2
      >
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        Display additional information on each date cell via calendarProps.
        Perfect for showing metrics, events, or status indicators.
      </p>
      <div style="margin: 0 0 32px 0;">
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Example: Stock market daily changes
        </p>
        <div
          mznDateRangePicker
          [value]="valAnnotation"
          [renderAnnotations]="annotationFn"
          mode="day"
          format="YYYY-MM-DD"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          (rangeChanged)="valAnnotation = $event"
        ></div>
      </div>
    </div>

    <div
      style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px;"
    >
      <h2 mznTypography variant="h2" style="margin: 0 0 16px 0;"
        >2. Quick Select Options</h2
      >
      <p mznTypography variant="body" style="margin: 0 0 12px 0;">
        Provide shortcut buttons for commonly selected date ranges. Great for
        improving UX in dashboards and reports.
      </p>
      <div style="margin: 0 0 32px 0;">
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Selected: [{{ selectedFrom() }}, {{ selectedTo() }}]
        </p>
        <div
          mznDateRangePicker
          [value]="valQuickSelect"
          [quickSelect]="quickSelectConfig()"
          mode="day"
          format="YYYY-MM-DD"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          (rangeChanged)="valQuickSelect = $event"
        ></div>
      </div>
    </div>
  `,
})
class DateRangePickerCalendarIntegrationStoryComponent {
  private readonly config = inject(MZN_CALENDAR_CONFIG);

  valAnnotation: RangePickerValue | undefined;
  valQuickSelect: RangePickerValue | undefined;

  private readonly todayMs = Date.now();
  private readonly dayMs = 86_400_000;

  private readonly annotationMap: Record<
    string,
    {
      value: string;
      color: 'text-success' | 'text-error' | 'text-warning' | 'text-neutral';
    }
  > = {
    [this.toDayKey(0)]: { value: '+5.2%', color: 'text-success' },
    [this.toDayKey(-1)]: { value: '-3.1%', color: 'text-error' },
    [this.toDayKey(-2)]: { value: '+1.8%', color: 'text-warning' },
    [this.toDayKey(-3)]: { value: '+8.4%', color: 'text-success' },
    [this.toDayKey(-4)]: { value: '-7.2%', color: 'text-error' },
    [this.toDayKey(1)]: { value: '+2.1%', color: 'text-warning' },
    [this.toDayKey(2)]: { value: '-0.5%', color: 'text-neutral' },
    [this.toDayKey(3)]: { value: '+6.7%', color: 'text-success' },
  };

  readonly annotationFn = (
    date: string,
  ):
    | {
        value: string;
        color: 'text-success' | 'text-error' | 'text-warning' | 'text-neutral';
      }
    | undefined => {
    const key = this.config.formatToString(
      this.config.locale,
      date,
      'YYYY-MM-DD',
    );
    return this.annotationMap[key];
  };

  quickSelectConfig(): {
    activeId?: string;
    options: ReadonlyArray<{ id: string; name: string; onClick: () => void }>;
  } {
    return {
      activeId: this.getActiveId(),
      options: [
        {
          id: 'today',
          name: 'Today',
          onClick: () => {
            const start = this.startOfDay(0);
            const end = this.endOfDay(0);
            this.valQuickSelect = [start, end];
          },
        },
        {
          id: 'last7days',
          name: 'Last 7 Days',
          onClick: () => {
            this.valQuickSelect = [this.startOfDay(-6), this.endOfDay(0)];
          },
        },
        {
          id: 'last30days',
          name: 'Last 30 Days',
          onClick: () => {
            this.valQuickSelect = [this.startOfDay(-29), this.endOfDay(0)];
          },
        },
        {
          id: 'thisMonth',
          name: 'This Month',
          onClick: () => {
            const d = new Date(this.todayMs);
            const start = new Date(d.getFullYear(), d.getMonth(), 1);
            const end = new Date(
              d.getFullYear(),
              d.getMonth() + 1,
              0,
              23,
              59,
              59,
              999,
            );
            this.valQuickSelect = [start.toISOString(), end.toISOString()];
          },
        },
        {
          id: 'lastMonth',
          name: 'Last Month',
          onClick: () => {
            const d = new Date(this.todayMs);
            const start = new Date(d.getFullYear(), d.getMonth() - 1, 1);
            const end = new Date(
              d.getFullYear(),
              d.getMonth(),
              0,
              23,
              59,
              59,
              999,
            );
            this.valQuickSelect = [start.toISOString(), end.toISOString()];
          },
        },
      ],
    };
  }

  selectedFrom(): string {
    const v = this.valQuickSelect?.[0];
    if (!v) return '';
    return this.config.formatToString(this.config.locale, v, 'YYYY-MM-DD');
  }

  selectedTo(): string {
    const v = this.valQuickSelect?.[1];
    if (!v) return '';
    return this.config.formatToString(this.config.locale, v, 'YYYY-MM-DD');
  }

  private getActiveId(): string | undefined {
    const val = this.valQuickSelect;
    if (!val || !val[0] || !val[1]) return undefined;
    const from = this.toDay(val[0]);
    const to = this.toDay(val[1]);
    const today = this.toDay(new Date(this.todayMs));

    if (from === today && to === today) return 'today';
    if (
      from === this.toDay(new Date(this.todayMs - 6 * this.dayMs)) &&
      to === today
    )
      return 'last7days';
    if (
      from === this.toDay(new Date(this.todayMs - 29 * this.dayMs)) &&
      to === today
    )
      return 'last30days';

    const d = new Date(this.todayMs);
    const thisMonthStart = this.toDay(
      new Date(d.getFullYear(), d.getMonth(), 1),
    );
    const thisMonthEnd = this.toDay(
      new Date(d.getFullYear(), d.getMonth() + 1, 0),
    );
    if (from === thisMonthStart && to === thisMonthEnd) return 'thisMonth';

    const lastMonthStart = this.toDay(
      new Date(d.getFullYear(), d.getMonth() - 1, 1),
    );
    const lastMonthEnd = this.toDay(new Date(d.getFullYear(), d.getMonth(), 0));
    if (from === lastMonthStart && to === lastMonthEnd) return 'lastMonth';

    return undefined;
  }

  private toDayKey(offsetDays: number): string {
    const iso = new Date(this.todayMs + offsetDays * this.dayMs).toISOString();
    return this.config.formatToString(this.config.locale, iso, 'YYYY-MM-DD');
  }

  private toDay(d: Date | string): number {
    const dt = typeof d === 'string' ? new Date(d) : d;
    return dt.getFullYear() * 10000 + (dt.getMonth() + 1) * 100 + dt.getDate();
  }

  private startOfDay(offsetDays: number): string {
    const d = new Date(this.todayMs + offsetDays * this.dayMs);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return start.toISOString();
  }

  private endOfDay(offsetDays: number): string {
    const d = new Date(this.todayMs + offsetDays * this.dayMs);
    const end = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      23,
      59,
      59,
      999,
    );
    return end.toISOString();
  }
}

export const CalendarIntegration: Story = {
  parameters: { controls: { disable: true } },
  decorators: [
    moduleMetadata({
      imports: [DateRangePickerCalendarIntegrationStoryComponent],
    }),
  ],
  render: () => ({
    template: `<story-date-range-picker-calendar-integration />`,
  }),
};

export const ConfirmMode: Story = {
  render: () => ({
    props: {
      rangeImmediate: undefined,
      rangeManual: undefined,
    },
    template: `
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>1. Immediate Mode (Default)</strong></p>
        <p style="margin: 0 0 12px 0">confirmMode="immediate" — onChange is triggered immediately after selecting both dates.</p>
        <div style="margin: 0 0 24px 0">
          <div mznDateRangePicker
            [(ngModel)]="rangeImmediate"
            confirmMode="immediate"
            mode="day"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
          ></div>
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Manual Mode</strong></p>
        <p style="margin: 0 0 12px 0">confirmMode="manual" — onChange is only triggered when clicking "Confirm".</p>
        <div style="margin: 0 0 24px 0">
          <div mznDateRangePicker
            [(ngModel)]="rangeManual"
            confirmMode="manual"
            mode="day"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
          ></div>
        </div>
      </div>
    `,
  }),
};
