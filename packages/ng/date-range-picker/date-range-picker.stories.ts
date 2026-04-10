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

export const CustomDisable: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>1. Disable Navigation Controls</strong></p>
        <p style="margin: 0 0 12px 0">Disable month/year switching buttons and navigation arrows.</p>
        <div mznDateRangePicker
          [(ngModel)]="range"
          mode="day"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        ></div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Mode-specific Disable Examples</strong></p>
        <p style="margin: 0 0 12px 0">When selecting a range that crosses disabled dates, the range will be blocked.</p>
        <div style="margin: 0 0 24px 0">
          <p style="margin: 0 0 8px 0"><strong>Day: Custom disabled dates</strong></p>
          <div mznDateRangePicker [(ngModel)]="range" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
        </div>
      </div>
    `,
  }),
};

export const CalendarIntegration: Story = {
  render: () => ({
    props: {
      rangeAnnotation: undefined,
      rangeQuickSelect: undefined,
    },
    template: `
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>1. Date Annotations (renderAnnotations)</strong></p>
        <p style="margin: 0 0 12px 0">Display additional information on each date cell.</p>
        <div style="margin: 0 0 32px 0">
          <div mznDateRangePicker [(ngModel)]="rangeAnnotation" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Quick Select Options</strong></p>
        <p style="margin: 0 0 12px 0">Provide shortcut buttons for commonly selected date ranges.</p>
        <div style="margin: 0 0 32px 0">
          <div mznDateRangePicker [(ngModel)]="rangeQuickSelect" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
        </div>
      </div>
    `,
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
