import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MznDateTimeRangePicker } from './date-time-range-picker.component';

const meta: Meta<MznDateTimeRangePicker> = {
  title: 'Data Entry/DateTimeRangePicker',
  component: MznDateTimeRangePicker,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MznTypography],
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
type Story = StoryObj<MznDateTimeRangePicker>;

@Component({
  selector: 'story-date-time-range-picker-playground',
  standalone: true,
  imports: [MznDateTimeRangePicker, MznTypography],
  template: `
    <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">
      From: {{ value()?.[0] ?? 'undefined' }}
    </h3>
    <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">
      To: {{ value()?.[1] ?? 'undefined' }}
    </h3>
    <div
      mznDateTimeRangePicker
      [clearable]="clearable"
      [direction]="direction"
      [disabled]="disabled"
      [error]="error"
      [formatDate]="formatDate"
      [formatTime]="formatTime"
      [fullWidth]="fullWidth"
      [hideHour]="hideHour"
      [hideMinute]="hideMinute"
      [hideSecond]="hideSecond"
      [hourStep]="hourStep"
      [minuteStep]="minuteStep"
      [placeholderLeft]="placeholderLeft"
      [placeholderRight]="placeholderRight"
      [readOnly]="readOnly"
      [secondStep]="secondStep"
      [size]="size"
      [value]="value()"
      (rangeChanged)="value.set($event)"
    ></div>
  `,
})
class DateTimeRangePickerPlaygroundComponent {
  clearable = true;
  direction: 'row' | 'column' = 'row';
  disabled = false;
  error = false;
  formatDate: string | undefined = 'YYYY-MM-DD';
  formatTime: string | undefined = 'HH:mm:ss';
  fullWidth = false;
  hideHour = false;
  hideMinute = false;
  hideSecond = false;
  hourStep = 1;
  minuteStep = 1;
  placeholderLeft: string | undefined = 'Select date';
  placeholderRight: string | undefined = 'Select time';
  readOnly = false;
  secondStep = 1;
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
        defaultValue: { summary: 'true' },
      },
    },
    direction: {
      control: { type: 'radio' },
      options: ['row', 'column'],
      description: 'Layout direction of the range picker.',
      table: {
        type: { summary: "'row' | 'column'" },
        defaultValue: { summary: "'row'" },
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
    formatDate: {
      control: { type: 'text' },
      description: 'Display format for the date portion.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'YYYY-MM-DD'" },
      },
    },
    formatTime: {
      control: { type: 'text' },
      description: 'Display format for the time portion.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'HH:mm:ss'" },
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
    hideHour: {
      control: { type: 'boolean' },
      description: 'Whether to hide the hour column in the time panels.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideMinute: {
      control: { type: 'boolean' },
      description: 'Whether to hide the minute column in the time panels.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideSecond: {
      control: { type: 'boolean' },
      description: 'Whether to hide the second column in the time panels.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hourStep: {
      control: { type: 'number' },
      description: 'Step interval for hours.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    minuteStep: {
      control: { type: 'number' },
      description: 'Step interval for minutes.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    placeholderLeft: {
      control: { type: 'text' },
      description: 'Placeholder text for the date input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Select date'" },
      },
    },
    placeholderRight: {
      control: { type: 'text' },
      description: 'Placeholder text for the time input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Select time'" },
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
    secondStep: {
      control: { type: 'number' },
      description: 'Step interval for seconds.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    size: {
      control: { type: 'select' },
      options: ['sub', 'main'],
      description: 'Text field size.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    clearable: true,
    direction: 'row',
    disabled: false,
    error: false,
    formatDate: 'YYYY-MM-DD',
    formatTime: 'HH:mm:ss',
    fullWidth: false,
    hideHour: false,
    hideMinute: false,
    hideSecond: false,
    hourStep: 1,
    minuteStep: 1,
    placeholderLeft: 'Select date',
    placeholderRight: 'Select time',
    readOnly: false,
    secondStep: 1,
    size: 'main',
  },
  decorators: [
    moduleMetadata({ imports: [DateTimeRangePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-date-time-range-picker-playground
        [clearable]="clearable"
        [direction]="direction"
        [disabled]="disabled"
        [error]="error"
        [formatDate]="formatDate"
        [formatTime]="formatTime"
        [fullWidth]="fullWidth"
        [hideHour]="hideHour"
        [hideMinute]="hideMinute"
        [hideSecond]="hideSecond"
        [hourStep]="hourStep"
        [minuteStep]="minuteStep"
        [placeholderLeft]="placeholderLeft"
        [placeholderRight]="placeholderRight"
        [readOnly]="readOnly"
        [secondStep]="secondStep"
        [size]="size"
      />
    `,
  }),
};

export const Direction: Story = {
  render: () => ({
    props: {
      rangeRow: undefined as RangePickerValue | undefined,
      rangeCol: undefined as RangePickerValue | undefined,
    },
    template: `
      <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">
        Row Direction (default)
      </h3>
      <div mznDateTimeRangePicker [(ngModel)]="rangeRow" direction="row"></div>

      <div style="margin-top: 32px"></div>

      <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">
        Column Direction
      </h3>
      <div mznDateTimeRangePicker [(ngModel)]="rangeCol" direction="column"></div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Normal</h3>
        <div mznDateTimeRangePicker></div>
      </div>
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Disabled</h3>
        <div mznDateTimeRangePicker [disabled]="true"></div>
      </div>
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Error</h3>
        <div mznDateTimeRangePicker [error]="true"></div>
      </div>
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Read Only</h3>
        <div mznDateTimeRangePicker [readOnly]="true"></div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Size: main (default)</h3>
        <div mznDateTimeRangePicker size="main"></div>
      </div>
      <div style="margin-bottom: 24px">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Size: sub</h3>
        <div mznDateTimeRangePicker size="sub"></div>
      </div>
    `,
  }),
};
