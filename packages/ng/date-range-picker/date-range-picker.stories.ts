import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CalendarMode } from '@mezzanine-ui/core/calendar';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { MznDateRangePicker } from './date-range-picker.component';

const meta: Meta<MznDateRangePicker> = {
  title: 'Data Entry/DateRangePicker',
  component: MznDateRangePicker,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
};

export default meta;
type Story = StoryObj<MznDateRangePicker>;

@Component({
  selector: 'story-date-range-picker-playground',
  standalone: true,
  imports: [MznDateRangePicker],
  template: `
    <mzn-date-range-picker
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
    />
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
        <mzn-date-range-picker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <mzn-date-range-picker [disabled]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <mzn-date-range-picker [error]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read only</strong></p>
        <mzn-date-range-picker [readOnly]="true" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
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
        <mzn-date-range-picker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsDayjs</strong></p>
        <mzn-date-range-picker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsLuxon</strong></p>
        <mzn-date-range-picker [(ngModel)]="range" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
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
        <mzn-date-range-picker [(ngModel)]="rangeMain" size="main" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Sub</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeSub" size="sub" />
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
        <mzn-date-range-picker [(ngModel)]="rangeD" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Week</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeW" mode="week" inputFromPlaceholder="Start Week" inputToPlaceholder="End Week" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Month</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeM" mode="month" inputFromPlaceholder="Start Month" inputToPlaceholder="End Month" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Year</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeY" mode="year" inputFromPlaceholder="Start Year" inputToPlaceholder="End Year" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Quarter</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeQ" mode="quarter" inputFromPlaceholder="Start Quarter" inputToPlaceholder="End Quarter" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Half Year</strong></p>
        <mzn-date-range-picker [(ngModel)]="rangeH" mode="half-year" inputFromPlaceholder="Start Half Year" inputToPlaceholder="End Half Year" />
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
        <mzn-date-range-picker
          [(ngModel)]="range"
          mode="day"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        />
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Mode-specific Disable Examples</strong></p>
        <p style="margin: 0 0 12px 0">When selecting a range that crosses disabled dates, the range will be blocked.</p>
        <div style="margin: 0 0 24px 0">
          <p style="margin: 0 0 8px 0"><strong>Day: Custom disabled dates</strong></p>
          <mzn-date-range-picker [(ngModel)]="range" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
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
          <mzn-date-range-picker [(ngModel)]="rangeAnnotation" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Quick Select Options</strong></p>
        <p style="margin: 0 0 12px 0">Provide shortcut buttons for commonly selected date ranges.</p>
        <div style="margin: 0 0 32px 0">
          <mzn-date-range-picker [(ngModel)]="rangeQuickSelect" mode="day" inputFromPlaceholder="Start Date" inputToPlaceholder="End Date" />
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
          <mzn-date-range-picker
            [(ngModel)]="rangeImmediate"
            confirmMode="immediate"
            mode="day"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
          />
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Manual Mode</strong></p>
        <p style="margin: 0 0 12px 0">confirmMode="manual" — onChange is only triggered when clicking "Confirm".</p>
        <div style="margin: 0 0 24px 0">
          <mzn-date-range-picker
            [(ngModel)]="rangeManual"
            confirmMode="manual"
            mode="day"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
          />
        </div>
      </div>
    `,
  }),
};
