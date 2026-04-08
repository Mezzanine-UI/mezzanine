import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CalendarIcon } from '@mezzanine-ui/icons';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import { MznCalendarConfigProvider } from '@mezzanine-ui/ng/calendar';
import { MznFormattedInput } from './formatted-input.component';
import { MznPickerTrigger } from './picker-trigger.component';
import { MznPickerTriggerWithSeparator } from './picker-trigger-with-separator.component';
import { MznRangePickerTrigger } from './range-picker-trigger.component';

const meta: Meta = {
  title: 'Internal/Picker',
  decorators: [
    moduleMetadata({
      imports: [
        MznCalendarConfigProvider,
        MznFormattedInput,
        MznPickerTrigger,
        MznPickerTriggerWithSeparator,
        MznRangePickerTrigger,
        MznIcon,
      ],
    }),
  ],
};

export default meta;

// ---------------------------------------------------------------------------
// FormattedInput Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-formatted-input',
  standalone: true,
  imports: [MznCalendarConfigProvider, MznFormattedInput],
  template: `
    <mzn-calendar-config-provider>
      <p style="margin: 0 0 8px 0">Value: {{ value() }}</p>
      <mzn-formatted-input
        [format]="format"
        [value]="value()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (valueChanged)="onValueChanged($event)"
        (valueCleared)="onValueCleared()"
      />
    </mzn-calendar-config-provider>
  `,
})
class FormattedInputStoryComponent {
  format = 'YYYY-MM-DD';
  placeholder: string | undefined = 'Select date';
  disabled = false;

  readonly value = signal<string | undefined>(undefined);

  onValueChanged(payload: { isoValue: string; rawDigits: string }): void {
    this.value.set(payload.isoValue);
  }

  onValueCleared(): void {
    this.value.set(undefined);
  }
}

export const FormattedInputPlayground: StoryObj = {
  decorators: [moduleMetadata({ imports: [FormattedInputStoryComponent] })],
  render: () => ({
    template: `<story-formatted-input />`,
  }),
};

export const FormattedInputDisabled: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <mzn-calendar-config-provider>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <mzn-formatted-input
            format="YYYY-MM-DD"
            [disabled]="true"
            placeholder="Disabled"
          />
          <mzn-formatted-input
            format="HH:mm:ss"
            placeholder="Time format"
          />
        </div>
      </mzn-calendar-config-provider>
    `,
  }),
};

// ---------------------------------------------------------------------------
// PickerTrigger Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-picker-trigger',
  standalone: true,
  imports: [MznCalendarConfigProvider, MznPickerTrigger, MznIcon],
  template: `
    <mzn-calendar-config-provider>
      <p style="margin: 0 0 8px 0">Value: {{ value() }}</p>
      <mzn-picker-trigger
        [format]="format"
        [value]="value()"
        [placeholder]="placeholder"
        [clearable]="clearable"
        [disabled]="disabled"
        [readOnly]="readOnly"
        [error]="error"
        (valueChanged)="onValueChanged($event)"
        (valueCleared)="onValueCleared()"
        (cleared)="onCleared()"
      >
        <i mznIcon suffix [icon]="calendarIcon"></i>
      </mzn-picker-trigger>
    </mzn-calendar-config-provider>
  `,
})
class PickerTriggerStoryComponent {
  format = 'YYYY-MM-DD';
  placeholder: string | undefined = 'Select date';
  clearable = true;
  disabled = false;
  readOnly = false;
  error = false;

  readonly calendarIcon = CalendarIcon;
  readonly value = signal<string | undefined>(undefined);

  onValueChanged(payload: { isoValue: string; rawDigits: string }): void {
    this.value.set(payload.isoValue);
  }

  onValueCleared(): void {
    this.value.set(undefined);
  }

  onCleared(): void {
    this.value.set(undefined);
  }
}

export const PickerTriggerPlayground: StoryObj = {
  decorators: [moduleMetadata({ imports: [PickerTriggerStoryComponent] })],
  render: () => ({
    template: `<story-picker-trigger />`,
  }),
};

export const PickerTriggerStates: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { CalendarIcon },
    template: `
      <mzn-calendar-config-provider>
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 200px;">
          <mzn-picker-trigger
            format="YYYY-MM-DD"
            placeholder="Default"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </mzn-picker-trigger>
          <mzn-picker-trigger
            format="YYYY-MM-DD"
            placeholder="Disabled"
            [disabled]="true"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </mzn-picker-trigger>
          <mzn-picker-trigger
            format="YYYY-MM-DD"
            placeholder="ReadOnly"
            [readOnly]="true"
            value="2024-01-15"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </mzn-picker-trigger>
          <mzn-picker-trigger
            format="YYYY-MM-DD"
            placeholder="Error"
            [error]="true"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </mzn-picker-trigger>
        </div>
      </mzn-calendar-config-provider>
    `,
  }),
};

// ---------------------------------------------------------------------------
// PickerTriggerWithSeparator Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-picker-trigger-with-separator',
  standalone: true,
  imports: [MznCalendarConfigProvider, MznPickerTriggerWithSeparator, MznIcon],
  template: `
    <mzn-calendar-config-provider>
      <p style="margin: 0 0 8px 0"
        >Date: {{ dateValue() }} | Time: {{ timeValue() }}</p
      >
      <mzn-picker-trigger-with-separator
        formatLeft="YYYY-MM-DD"
        formatRight="HH:mm:ss"
        [valueLeft]="dateValue()"
        [valueRight]="timeValue()"
        placeholderLeft="Select date"
        placeholderRight="Select time"
        (leftChanged)="onDateChange($event)"
        (rightChanged)="onTimeChange($event)"
        (cleared)="onCleared()"
      >
        <i mznIcon suffix [icon]="calendarIcon"></i>
      </mzn-picker-trigger-with-separator>
    </mzn-calendar-config-provider>
  `,
})
class PickerTriggerWithSeparatorStoryComponent {
  readonly calendarIcon = CalendarIcon;
  readonly dateValue = signal<string | undefined>(undefined);
  readonly timeValue = signal<string | undefined>(undefined);

  onDateChange(payload: { isoValue: string; rawDigits: string }): void {
    this.dateValue.set(payload.isoValue);
  }

  onTimeChange(payload: { isoValue: string; rawDigits: string }): void {
    this.timeValue.set(payload.isoValue);
  }

  onCleared(): void {
    this.dateValue.set(undefined);
    this.timeValue.set(undefined);
  }
}

export const PickerTriggerWithSeparatorPlayground: StoryObj = {
  decorators: [
    moduleMetadata({ imports: [PickerTriggerWithSeparatorStoryComponent] }),
  ],
  render: () => ({
    template: `<story-picker-trigger-with-separator />`,
  }),
};

// ---------------------------------------------------------------------------
// RangePickerTrigger Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-range-picker-trigger',
  standalone: true,
  imports: [MznCalendarConfigProvider, MznRangePickerTrigger, MznIcon],
  template: `
    <mzn-calendar-config-provider>
      <p style="margin: 0 0 8px 0"
        >From: {{ fromValue() }} | To: {{ toValue() }}</p
      >
      <mzn-range-picker-trigger
        format="YYYY-MM-DD"
        [inputFromValue]="fromValue()"
        [inputToValue]="toValue()"
        inputFromPlaceholder="Start date"
        inputToPlaceholder="End date"
        (inputFromChanged)="onFromChange($event)"
        (inputToChanged)="onToChange($event)"
        (cleared)="onCleared()"
      />
    </mzn-calendar-config-provider>
  `,
})
class RangePickerTriggerStoryComponent {
  readonly fromValue = signal<string | undefined>(undefined);
  readonly toValue = signal<string | undefined>(undefined);

  onFromChange(payload: { isoValue: string; rawDigits: string }): void {
    this.fromValue.set(payload.isoValue);
  }

  onToChange(payload: { isoValue: string; rawDigits: string }): void {
    this.toValue.set(payload.isoValue);
  }

  onCleared(): void {
    this.fromValue.set(undefined);
    this.toValue.set(undefined);
  }
}

export const RangePickerTriggerPlayground: StoryObj = {
  decorators: [moduleMetadata({ imports: [RangePickerTriggerStoryComponent] })],
  render: () => ({
    template: `<story-range-picker-trigger />`,
  }),
};

export const RangePickerTriggerStates: StoryObj = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <mzn-calendar-config-provider>
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 300px;">
          <mzn-range-picker-trigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Start date"
            inputToPlaceholder="End date"
          />
          <mzn-range-picker-trigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Disabled"
            inputToPlaceholder="Disabled"
            [disabled]="true"
          />
          <mzn-range-picker-trigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Error"
            inputToPlaceholder="Error"
            [error]="true"
          />
        </div>
      </mzn-calendar-config-provider>
    `,
  }),
};
