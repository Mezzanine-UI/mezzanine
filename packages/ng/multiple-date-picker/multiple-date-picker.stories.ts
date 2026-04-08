import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import { MznMultipleDatePicker } from './multiple-date-picker.component';

const meta: Meta<MznMultipleDatePicker> = {
  title: 'Data Entry/MultipleDatePicker',
  component: MznMultipleDatePicker,
  decorators: [moduleMetadata({ imports: [FormsModule] })],
};

export default meta;
type Story = StoryObj<MznMultipleDatePicker>;

@Component({
  selector: 'story-multiple-date-picker-playground',
  standalone: true,
  imports: [MznMultipleDatePicker],
  template: `
    <div
      mznMultipleDatePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [value]="value()"
      (datesChanged)="value.set($event)"
    ></div>
  `,
})
class MultipleDatePickerPlaygroundComponent {
  clearable = true;
  disabled = false;
  error = false;
  fullWidth = false;
  placeholder = 'Select dates';
  readOnly = false;
  readonly value = signal<ReadonlyArray<DateType>>([]);
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
    placeholder: 'Select dates',
    readOnly: false,
  },
  decorators: [
    moduleMetadata({ imports: [MultipleDatePickerPlaygroundComponent] }),
  ],
  render: (args) => ({
    props: args,
    template: `
      <story-multiple-date-picker-playground
        [clearable]="clearable"
        [disabled]="disabled"
        [error]="error"
        [fullWidth]="fullWidth"
        [placeholder]="placeholder"
        [readOnly]="readOnly"
      />
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Basic Multiple Date Picker</strong></p>
        <p style="margin: 0 0 12px 0">Click on dates to select/deselect. Click Confirm to apply changes.</p>
        <div style="width: 400px">
          <div mznMultipleDatePicker [(ngModel)]="dates" placeholder="Select multiple dates" ></div>
        </div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Selected dates:</strong></p>
        <p>{{ dates | json }}</p>
      </div>
    `,
  }),
};

export const MaxSelections: Story = {
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Max 3 Selections</strong></p>
        <p style="margin: 0 0 12px 0">You can only select up to 3 dates. Once reached, other dates become disabled.</p>
        <div mznMultipleDatePicker [(ngModel)]="dates" [maxSelections]="3" placeholder="Select up to 3 dates" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p>Selected: {{ dates.length }}/3</p>
      </div>
    `,
  }),
};

export const OverflowStrategies: Story = {
  render: () => ({
    props: {
      counterDates: [
        '2025-01-01',
        '2025-01-05',
        '2025-01-10',
        '2025-01-15',
        '2025-01-20',
      ],
      wrapDates: [
        '2025-01-01',
        '2025-01-05',
        '2025-01-10',
        '2025-01-15',
        '2025-01-20',
      ],
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Overflow Strategy: counter (default)</strong></p>
        <p style="margin: 0 0 12px 0">Shows visible tags with a counter for hidden ones.</p>
        <div style="max-width: 300px">
          <div mznMultipleDatePicker [(ngModel)]="counterDates" overflowStrategy="counter" ></div>
        </div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Overflow Strategy: wrap</strong></p>
        <p style="margin: 0 0 12px 0">Wraps tags to multiple lines.</p>
        <div style="max-width: 300px">
          <div mznMultipleDatePicker [(ngModel)]="wrapDates" overflowStrategy="wrap" ></div>
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  render: () => ({
    props: {},
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled</strong></p>
        <div mznMultipleDatePicker [disabled]="true" [value]="['2025-01-01', '2025-01-15']" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Read Only</strong></p>
        <div mznMultipleDatePicker [readOnly]="true" [value]="['2025-01-01', '2025-01-15']" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Error</strong></p>
        <div mznMultipleDatePicker [error]="true" [value]="['2025-01-01', '2025-01-15']" ></div>
      </div>
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Full Width</strong></p>
        <div mznMultipleDatePicker [fullWidth]="true" [value]="['2025-01-01', '2025-01-15']" ></div>
      </div>
    `,
  }),
};

export const CustomActions: Story = {
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Custom Action Button Text</strong></p>
        <p style="margin: 0 0 12px 0">Override confirm/cancel button text via actions prop.</p>
        <div mznMultipleDatePicker [(ngModel)]="dates" placeholder="選擇日期" ></div>
      </div>
    `,
  }),
};

export const DisabledDates: Story = {
  render: () => ({
    props: {
      dates: [] as string[],
      isWeekendDisabled: (date: string): boolean => {
        const d = new Date(date);
        const day = d.getDay();
        return day === 0 || day === 6;
      },
    },
    template: `
      <div style="margin: 0 0 24px 0">
        <p style="margin: 0 0 12px 0"><strong>Disabled Dates (Weekends)</strong></p>
        <p style="margin: 0 0 12px 0">Weekends (Saturday and Sunday) are disabled.</p>
        <div mznMultipleDatePicker
          [(ngModel)]="dates"
          [isDateDisabled]="isWeekendDisabled"
          placeholder="Select weekdays only"
        ></div>
      </div>
    `,
  }),
};
