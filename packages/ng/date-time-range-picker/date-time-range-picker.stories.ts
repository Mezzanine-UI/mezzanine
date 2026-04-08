import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import { MznDateTimeRangePicker } from './date-time-range-picker.component';

const meta: Meta<MznDateTimeRangePicker> = {
  title: 'Data Entry/DateTimeRangePicker',
  component: MznDateTimeRangePicker,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
};

export default meta;
type Story = StoryObj<MznDateTimeRangePicker>;

@Component({
  selector: 'story-date-time-range-picker-playground',
  standalone: true,
  imports: [MznDateTimeRangePicker],
  template: `
    <div
      mznDateTimeRangePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [hideSecond]="hideSecond"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [value]="value()"
      (rangeChanged)="value.set($event)"
    ></div>
  `,
})
class DateTimeRangePickerPlaygroundComponent {
  clearable = true;
  disabled = false;
  error = false;
  fullWidth = false;
  hideSecond = false;
  placeholder = 'Select date-time range';
  readOnly = false;
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
    fullWidth: {
      control: { type: 'boolean' },
      description: 'Whether the picker takes full width.',
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
  },
  args: {
    clearable: true,
    disabled: false,
    error: false,
    fullWidth: false,
    hideSecond: false,
    placeholder: 'Select date-time range',
    readOnly: false,
  },
  decorators: [
    moduleMetadata({ imports: [DateTimeRangePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-date-time-range-picker-playground
        [clearable]="clearable"
        [disabled]="disabled"
        [error]="error"
        [fullWidth]="fullWidth"
        [hideSecond]="hideSecond"
        [placeholder]="placeholder"
        [readOnly]="readOnly"
      />
    `,
  }),
};

export const Direction: Story = {
  render: () => ({
    props: {
      rangeRow: undefined,
      rangeCol: undefined,
    },
    template: `
      <p style="margin: 0 0 12px 0"><strong>Row Direction (default)</strong></p>
      <div mznDateTimeRangePicker [(ngModel)]="rangeRow" direction="row" ></div>

      <div style="margin-top: 32px"></div>

      <p style="margin: 0 0 12px 0"><strong>Column Direction</strong></p>
      <div mznDateTimeRangePicker [(ngModel)]="rangeCol" direction="column" ></div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Normal</strong></p>
        <div mznDateTimeRangePicker ></div>
      </div>
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <div mznDateTimeRangePicker [disabled]="true" ></div>
      </div>
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <div mznDateTimeRangePicker [error]="true" ></div>
      </div>
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Read Only</strong></p>
        <div mznDateTimeRangePicker [readOnly]="true" ></div>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Size: main (default)</strong></p>
        <div mznDateTimeRangePicker size="main" ></div>
      </div>
      <div style="margin-bottom: 24px">
        <p style="margin: 0 0 12px 0"><strong>Size: sub</strong></p>
        <div mznDateTimeRangePicker size="sub" ></div>
      </div>
    `,
  }),
};
