import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { CalendarMode } from '@mezzanine-ui/core/calendar';
import { MznDatePicker } from './date-picker.component';

const meta: Meta<MznDatePicker> = {
  title: 'Data Entry/DatePicker',
  component: MznDatePicker,
  decorators: [
    moduleMetadata({
      imports: [FormsModule],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznDatePicker>;

@Component({
  selector: 'story-date-picker-playground',
  standalone: true,
  imports: [MznDatePicker],
  template: `
    <mzn-date-picker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [mode]="mode"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [size]="size"
      [value]="value()"
      (dateChanged)="value.set($event)"
    />
  `,
})
class DatePickerPlaygroundComponent {
  clearable = false;
  disabled = false;
  error = false;
  fullWidth = false;
  mode: CalendarMode = 'day';
  placeholder = 'Select date';
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
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "''" },
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
    fullWidth: false,
    mode: 'day',
    placeholder: 'Select date',
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
        [fullWidth]="fullWidth"
        [mode]="mode"
        [placeholder]="placeholder"
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
        <mzn-date-picker [(ngModel)]="date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <mzn-date-picker [disabled]="true" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <mzn-date-picker [error]="true" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read only</strong></p>
        <mzn-date-picker [readOnly]="true" />
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
        <mzn-date-picker [(ngModel)]="date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsDayjs</strong></p>
        <mzn-date-picker [(ngModel)]="date" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsLuxon</strong></p>
        <mzn-date-picker [(ngModel)]="date" />
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
        <mzn-date-picker [(ngModel)]="dateMain" size="main" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: Sub</strong></p>
        <mzn-date-picker [(ngModel)]="dateSub" size="sub" />
      </div>
    `,
  }),
};

export const Modes: Story = {
  render: () => ({
    props: {
      dateD: undefined as string | undefined,
      dateW: undefined as string | undefined,
      dateM: undefined as string | undefined,
      dateY: undefined as string | undefined,
      dateQ: undefined as string | undefined,
      dateH: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Day</strong></p>
        <mzn-date-picker [(ngModel)]="dateD" mode="day" placeholder="輸入日期" />
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Week</strong></p>
        <mzn-date-picker [(ngModel)]="dateW" mode="week" placeholder="輸入日期" />
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Month</strong></p>
        <mzn-date-picker [(ngModel)]="dateM" mode="month" placeholder="輸入日期" />
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Year</strong></p>
        <mzn-date-picker [(ngModel)]="dateY" mode="year" placeholder="輸入日期" />
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Quarter</strong></p>
        <mzn-date-picker [(ngModel)]="dateQ" mode="quarter" placeholder="輸入日期" />
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Half year</strong></p>
        <mzn-date-picker [(ngModel)]="dateH" mode="half-year" placeholder="輸入日期" />
      </div>
    `,
  }),
};

export const CustomDisable: Story = {
  render: () => ({
    props: { date: undefined as string | undefined },
    template: `
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>1. Disable Navigation Controls</strong></p>
        <p style="margin: 0 0 12px 0">Disable month/year switching buttons and navigation arrows.</p>
        <mzn-date-picker
          [(ngModel)]="date"
          mode="day"
          [fullWidth]="true"
          placeholder="Date"
        />
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Mode-specific Disable Examples</strong></p>
        <div style="margin: 0 0 32px 0">
          <p style="margin: 0 0 8px 0"><strong>Day: Custom disabled dates</strong></p>
          <mzn-date-picker [(ngModel)]="date" mode="day" placeholder="Date" />
        </div>
      </div>
    `,
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
          <mzn-date-picker [(ngModel)]="dateAnnotation" mode="day" placeholder="Date" />
        </div>
      </div>
      <div style="margin: 0 0 48px 0; padding: 16px; border: 1px solid #e0e0e0; border-radius: 8px">
        <p style="margin: 0 0 16px 0"><strong>2. Quick Select Options</strong></p>
        <p style="margin: 0 0 12px 0">Provide shortcut buttons for commonly selected dates via calendarProps.</p>
        <div style="margin: 0 0 32px 0">
          <mzn-date-picker [(ngModel)]="dateQuickSelect" mode="day" placeholder="Date" />
        </div>
      </div>
    `,
  }),
};
