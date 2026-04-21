import { FormsModule } from '@angular/forms';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { DateType } from '@mezzanine-ui/core/calendar';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { MznDateTimePicker } from './date-time-picker.component';

dayjs.extend(isBetween);

const meta: Meta<MznDateTimePicker> = {
  title: 'Data Entry/DateTimePicker',
  component: MznDateTimePicker,
  decorators: [
    moduleMetadata({
      imports: [FormsModule, MznDateTimePicker, MznTypography],
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
    formatDate: {
      control: { type: 'text' },
      description: 'Display format for the date input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'YYYY-MM-DD'" },
      },
    },
    formatTime: {
      control: { type: 'text' },
      description: 'Display format for the time input.',
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
    placeholderLeft: {
      control: { type: 'text' },
      description: 'Placeholder text for the date (left) input.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'Select date'" },
      },
    },
    placeholderRight: {
      control: { type: 'text' },
      description: 'Placeholder text for the time (right) input.',
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
      options: ['main', 'sub'],
      description: 'Text field size.',
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
  render: (args) => ({
    props: args,
    template: `
      <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">origin value: undefined</h3>
      <div
        mznDateTimePicker
        [clearable]="clearable"
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
      ></div>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: {
      dateTime: undefined as string | undefined,
      normalLabel: 'Normal\n            Origin Value: undefined',
    },
    template: `
      <div style="width: 320px; margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">{{ normalLabel }}</h3>
        <div mznDateTimePicker [(ngModel)]="dateTime"></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Disabled</h3>
        <div mznDateTimePicker [disabled]="true"></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Error</h3>
        <div mznDateTimePicker [error]="true"></div>
      </div>
      <div style="width: 320px; margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Read only</h3>
        <div mznDateTimePicker [readOnly]="true"></div>
      </div>
    `,
  }),
};

export const Method: Story = {
  render: () => ({
    props: { dateTime: undefined as string | undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">CalendarMethodsMoment</h3>
        <div mznDateTimePicker [(ngModel)]="dateTime"></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">CalendarMethodsDayjs</h3>
        <div mznDateTimePicker [(ngModel)]="dateTime"></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">CalendarMethodLuxon</h3>
        <div mznDateTimePicker [(ngModel)]="dateTime"></div>
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
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Size: main</h3>
        <div mznDateTimePicker [(ngModel)]="dateMain" size="main"></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0">Size: sub</h3>
        <div mznDateTimePicker [(ngModel)]="dateSub" size="sub"></div>
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
        <h3 mznTypography variant="h3" style="margin: 0 0 8px 0">Hours, minutes, seconds</h3>
        <p mznTypography variant="body" style="margin: 0 0 8px 0">current value: undefined</p>
        <div
          mznDateTimePicker
          [(ngModel)]="date1"
          formatDate="YYYY-MM-DD"
          formatTime="HH:mm:ss"
        ></div>
      </div>
      <div style="margin: 0 0 32px 0">
        <h3 mznTypography variant="h3" style="margin: 0 0 8px 0">Hours, minutes</h3>
        <p mznTypography variant="body" style="margin: 0 0 8px 0">current value: undefined</p>
        <div
          mznDateTimePicker
          [(ngModel)]="date2"
          [hideSecond]="true"
          formatDate="YYYY-MM-DD"
          formatTime="HH:mm"
        ></div>
      </div>
    `,
  }),
};

export const CustomDisable: Story = {
  render: () => {
    const formatDate = 'YYYY-MM-DD';
    const formatTime = 'HH:mm:ss';

    const disabledDatesStart = dayjs().add(3, 'day');
    const disabledDatesEnd = dayjs().add(7, 'day');
    const disabledMonthsStart = dayjs().subtract(5, 'month');
    const disabledMonthsEnd = dayjs().subtract(1, 'month');
    const disabledYearsStart = dayjs().subtract(20, 'year');
    const disabledYearsEnd = dayjs().subtract(1, 'year');

    const disabledLabel =
      `(mode='day') Disabled\n` +
      `  Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}\n` +
      `  Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}\n` +
      `  Dates: ${disabledDatesStart.format(`${formatDate} ${formatTime}`)} ~ ${disabledDatesEnd.format(`${formatDate} ${formatTime}`)}`;

    return {
      props: {
        dateTime: undefined as string | undefined,
        modeLabel:
          "(mode='day')\n            disabledMonthSwitch = true\n            disabledYearSwitch = true\n            disableOnNext = true\n            disableOnPrev = true",
        disabledLabel,
        isDateDisabled: (target: DateType): boolean =>
          dayjs(target).isBetween(
            disabledDatesStart,
            disabledDatesEnd,
            'day',
            '[]',
          ),
        isMonthDisabled: (target: DateType): boolean =>
          dayjs(target).isBetween(
            disabledMonthsStart,
            disabledMonthsEnd,
            'month',
            '[]',
          ),
        isYearDisabled: (target: DateType): boolean =>
          dayjs(target).isBetween(
            disabledYearsStart,
            disabledYearsEnd,
            'year',
            '[]',
          ),
      },
      template: `
        <div style="margin: 0 0 24px 0">
          <h3 mznTypography variant="h3" style="margin: 0 0 12px 0; white-space: pre-line">{{ modeLabel }}</h3>
          <div
            mznDateTimePicker
            [(ngModel)]="dateTime"
            [disabledMonthSwitch]="true"
            [disabledYearSwitch]="true"
            [disableOnNext]="true"
            [disableOnPrev]="true"
            formatDate="YYYY-MM-DD"
            formatTime="HH:mm:ss"
          ></div>
        </div>
        <div style="margin: 0 0 24px 0">
          <h3 mznTypography variant="h3" style="margin: 0 0 12px 0; white-space: pre-line">{{ disabledLabel }}</h3>
          <div
            mznDateTimePicker
            [(ngModel)]="dateTime"
            [isDateDisabled]="isDateDisabled"
            [isMonthDisabled]="isMonthDisabled"
            [isYearDisabled]="isYearDisabled"
            formatDate="YYYY-MM-DD"
            formatTime="HH:mm:ss"
          ></div>
        </div>
      `,
    };
  },
};
