import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { MznTimeRangePicker } from './time-range-picker.component';

const meta: Meta<MznTimeRangePicker> = {
  title: 'Data Entry/TimeRangePicker',
  component: MznTimeRangePicker,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
};

export default meta;
type Story = StoryObj<MznTimeRangePicker>;

@Component({
  selector: 'story-time-range-picker-playground',
  standalone: true,
  imports: [MznTimeRangePicker],
  template: `
    <mzn-time-range-picker
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
      [value]="value()"
      (rangeChanged)="value.set($event)"
    />
  `,
})
class TimeRangePickerPlaygroundComponent {
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
  placeholder = 'Select time range';
  readOnly = false;
  secondStep = 1;
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
      description: 'Placeholder text for the range input.',
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
    placeholder: 'Select time range',
    readOnly: false,
    secondStep: 1,
  },
  decorators: [
    moduleMetadata({ imports: [TimeRangePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-time-range-picker-playground
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
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Value: {{ range | json }}</strong></p>
        <mzn-time-range-picker [(ngModel)]="range" />
      </div>
    `,
  }),
};

export const HideSecond: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <p style="margin: 0 0 12px 0"><strong>Hide Second (HH:mm format)</strong></p>
      <mzn-time-range-picker [(ngModel)]="range" format="HH:mm" [hideSecond]="true" />
    `,
  }),
};

export const WithSteps: Story = {
  render: () => ({
    props: { range: undefined },
    template: `
      <p style="margin: 0 0 12px 0"><strong>With Steps (Hour: 2, Minute: 15, Second: 30)</strong></p>
      <mzn-time-range-picker [(ngModel)]="range" [hourStep]="2" [minuteStep]="15" [secondStep]="30" />
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <mzn-time-range-picker [disabled]="true" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read Only</strong></p>
        <mzn-time-range-picker [readOnly]="true" />
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>With Error State</strong></p>
        <mzn-time-range-picker [error]="true" />
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {
      range1: undefined,
      range2: undefined,
    },
    template: `
      <p style="margin: 12px 0"><strong>Size: Main</strong></p>
      <mzn-time-range-picker [(ngModel)]="range1" />
      <p style="margin: 12px 0"><strong>Size: Sub</strong></p>
      <mzn-time-range-picker [(ngModel)]="range2" />
    `,
  }),
};
