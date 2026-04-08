import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznDateTimePicker } from './date-time-picker.component';

const meta: Meta<MznDateTimePicker> = {
  title: 'Data Entry/DateTimePicker',
  component: MznDateTimePicker,
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
type Story = StoryObj<MznDateTimePicker>;

@Component({
  selector: 'story-date-time-picker-playground',
  standalone: true,
  imports: [MznDateTimePicker],
  template: `
    <div
      mznDateTimePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [hideHour]="hideHour"
      [hideMinute]="hideMinute"
      [hideSecond]="hideSecond"
      [hourStep]="hourStep"
      [minuteStep]="minuteStep"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [secondStep]="secondStep"
      [value]="value()"
      (dateTimeChanged)="value.set($event)"
    ></div>
  `,
})
class DateTimePickerPlaygroundComponent {
  clearable = false;
  disabled = false;
  error = false;
  fullWidth = false;
  hideHour = false;
  hideMinute = false;
  hideSecond = false;
  hourStep = 1;
  minuteStep = 1;
  placeholder = 'Select date and time';
  readOnly = false;
  secondStep = 1;
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
    hideHour: {
      control: { type: 'boolean' },
      description: 'Whether to hide the hour column in the time panel.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideMinute: {
      control: { type: 'boolean' },
      description: 'Whether to hide the minute column in the time panel.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideSecond: {
      control: { type: 'boolean' },
      description: 'Whether to hide the second column in the time panel.',
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
    secondStep: {
      control: { type: 'number' },
      description: 'Step interval for seconds.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
  },
  args: {
    clearable: false,
    disabled: false,
    error: false,
    fullWidth: false,
    hideHour: false,
    hideMinute: false,
    hideSecond: false,
    hourStep: 1,
    minuteStep: 1,
    placeholder: 'Select date and time',
    readOnly: false,
    secondStep: 1,
  },
  decorators: [
    moduleMetadata({ imports: [DateTimePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-date-time-picker-playground
        [clearable]="clearable"
        [disabled]="disabled"
        [error]="error"
        [fullWidth]="fullWidth"
        [hideHour]="hideHour"
        [hideMinute]="hideMinute"
        [hideSecond]="hideSecond"
        [hourStep]="hourStep"
        [minuteStep]="minuteStep"
        [placeholder]="placeholder"
        [readOnly]="readOnly"
        [secondStep]="secondStep"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: { dateTime: undefined as string | undefined },
    template: `
      <div style="width: 320px; margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Normal</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <div mznDateTimePicker [disabled]="true" ></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <div mznDateTimePicker [error]="true" ></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read only</strong></p>
        <div mznDateTimePicker [readOnly]="true" ></div>
      </div>
    `,
  }),
};

export const Method: Story = {
  render: () => ({
    props: { dateTime: undefined as string | undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsMoment</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodsDayjs</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>CalendarMethodLuxon</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
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
        <p style="margin: 0 0 12px 0"><strong>Size: main</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateMain" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Size: sub</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateSub" ></div>
      </div>
    `,
  }),
};

export const DisplayColumn: Story = {
  render: () => ({
    props: {
      date1: undefined as string | undefined,
      date2: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Hours, minutes, seconds</strong></p>
        <div mznDateTimePicker [(ngModel)]="date1" ></div>
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Hours, minutes</strong></p>
        <div mznDateTimePicker [(ngModel)]="date2" [hideSecond]="true" ></div>
      </div>
    `,
  }),
};

export const CustomDisable: Story = {
  render: () => ({
    props: { dateTime: undefined as string | undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>(mode='day') Disable navigation controls</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>(mode='day') Custom disabled dates</strong></p>
        <div mznDateTimePicker [(ngModel)]="dateTime" ></div>
      </div>
    `,
  }),
};
