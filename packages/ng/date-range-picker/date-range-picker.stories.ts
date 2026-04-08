import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CalendarMode } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
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
          useValue: createCalendarConfig(CalendarMethodsDayjs),
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
  imports: [MznDateRangePicker],
  template: `
    <div
      mznDateRangePicker
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
      [value]="value()"
      (rangeChanged)="value.set($event)"
    ></div>
  `,
})
class DateRangePickerPlaygroundComponent {
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

export const Method: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsMoment</strong></p>
        <div mznDateRangePicker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsDayjs</strong></p>
        <div mznDateRangePicker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsLuxon</strong></p>
        <div mznDateRangePicker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
    `,
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

export const Modes: Story = {
  render: () => ({
    props: {
      rangeD: undefined,
      rangeW: undefined,
      rangeM: undefined,
      rangeY: undefined,
      rangeQ: undefined,
      rangeH: undefined,
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Day</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeD" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Week</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeW" mode="week" inputFromPlaceholder="Start Week" inputToPlaceholder="End Week" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Month</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeM" mode="month" inputFromPlaceholder="Start Month" inputToPlaceholder="End Month" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Year</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeY" mode="year" inputFromPlaceholder="Start Year" inputToPlaceholder="End Year" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Quarter</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeQ" mode="quarter" inputFromPlaceholder="Start Quarter" inputToPlaceholder="End Quarter" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Half Year</strong></p>
        <div mznDateRangePicker [(ngModel)]="rangeH" mode="half-year" inputFromPlaceholder="Start Half Year" inputToPlaceholder="End Half Year" ></div>
      </div>
    `,
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
