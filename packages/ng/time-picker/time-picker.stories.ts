import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznTimePicker } from './time-picker.component';

const meta: Meta = {
  title: 'Data Entry/TimePicker',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MznTimePicker, MznTypography],
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
type Story = StoryObj;

@Component({
  selector: 'story-time-picker-playground',
  standalone: true,
  imports: [MznTimePicker],
  template: `
    <div
      mznTimePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [format]="format"
      [fullWidth]="fullWidth"
      [hideHour]="hideHour"
      [hideMinute]="hideMinute"
      [hideSecond]="hideSecond"
      [hourStep]="hourStep"
      [minuteStep]="minuteStep"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [secondStep]="secondStep"
      [size]="size"
      [value]="value()"
      (timeChanged)="value.set($event)"
    ></div>
  `,
})
class TimePickerPlaygroundComponent {
  clearable = true;
  disabled = false;
  error = false;
  format: string | undefined = 'HH:mm:ss';
  fullWidth = false;
  hideHour = false;
  hideMinute = false;
  hideSecond = false;
  hourStep = 1;
  minuteStep = 1;
  placeholder = 'Select time';
  readOnly = false;
  secondStep = 1;
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
        defaultValue: { summary: 'true' },
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
    format: {
      control: { type: 'text' },
      description: 'Display format string for the time value.',
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
      description: 'Whether to hide the hour column.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideMinute: {
      control: { type: 'boolean' },
      description: 'Whether to hide the minute column.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    hideSecond: {
      control: { type: 'boolean' },
      description: 'Whether to hide the second column.',
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
    size: {
      options: ['main', 'sub'],
      control: { type: 'select' },
      description: 'Input size.',
      table: {
        type: { summary: "'main' | 'sub'" },
        defaultValue: { summary: "'main'" },
      },
    },
  },
  args: {
    clearable: true,
    disabled: false,
    error: false,
    format: 'HH:mm:ss',
    fullWidth: false,
    hideHour: false,
    hideMinute: false,
    hideSecond: false,
    hourStep: 1,
    minuteStep: 1,
    placeholder: 'Select time',
    readOnly: false,
    secondStep: 1,
    size: 'main',
  },
  decorators: [moduleMetadata({ imports: [TimePickerPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-time-picker-playground
        [clearable]="clearable"
        [disabled]="disabled"
        [error]="error"
        [format]="format"
        [fullWidth]="fullWidth"
        [hideHour]="hideHour"
        [hideMinute]="hideMinute"
        [hideSecond]="hideSecond"
        [hourStep]="hourStep"
        [minuteStep]="minuteStep"
        [placeholder]="placeholder"
        [readOnly]="readOnly"
        [secondStep]="secondStep"
        [size]="size"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      time: undefined as string | undefined,
      now: dayjs().toISOString(),
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Normal</h3>
        <div mznTimePicker [(ngModel)]="time" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Disabled</h3>
        <div mznTimePicker [value]="now" [disabled]="true" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Error</h3>
        <div mznTimePicker [value]="now" [error]="true" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Read only</h3>
        <div mznTimePicker [value]="now" [readOnly]="true" ></div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      time1: undefined as string | undefined,
      time2: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Main (Default)</strong></p>
        <div mznTimePicker [(ngModel)]="time1" size="main" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Sub</strong></p>
        <div mznTimePicker [(ngModel)]="time2" size="sub" ></div>
      </div>
    `,
  }),
};

export const DisplayColumn: Story = {
  render: () => ({
    props: {
      time1: undefined as string | undefined,
      time2: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Hours, minutes, seconds</strong></p>
        <div mznTimePicker [(ngModel)]="time1" format="HH:mm:ss" placeholder="HH:mm:ss" ></div>
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Hours, minutes</strong></p>
        <div mznTimePicker [(ngModel)]="time2" [hideSecond]="true" format="HH:mm" placeholder="HH:mm" ></div>
      </div>
    `,
  }),
};

export const Steps: Story = {
  render: () => ({
    props: {
      time1: undefined as string | undefined,
      time2: undefined as string | undefined,
      time3: undefined as string | undefined,
    },
    template: `
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Hour step (15 minutes)</strong></p>
        <div mznTimePicker [(ngModel)]="time1" [hourStep]="1" [minuteStep]="15" placeholder="HH:mm:ss" ></div>
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>Minute step (30 seconds)</strong></p>
        <div mznTimePicker [(ngModel)]="time2" [minuteStep]="1" [secondStep]="30" placeholder="HH:mm:ss" ></div>
      </div>
      <div style="margin: 0 0 32px 0">
        <p style="margin: 0 0 8px 0"><strong>All steps (6 hours, 15 minutes, 20 seconds)</strong></p>
        <div mznTimePicker [(ngModel)]="time3" [hourStep]="6" [minuteStep]="15" [secondStep]="20" placeholder="HH:mm:ss" ></div>
      </div>
    `,
  }),
};
