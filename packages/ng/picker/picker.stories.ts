import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CalendarIcon } from '@mezzanine-ui/icons';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { MznIcon } from '@mezzanine-ui/ng/icon';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznFormattedInput } from './formatted-input.component';
import { MznPickerTrigger } from './picker-trigger.component';
import { MznPickerTriggerWithSeparator } from './picker-trigger-with-separator.component';
import { MznRangePickerTrigger } from './range-picker-trigger.component';

const meta: Meta = {
  title: 'Internal/Picker',
  decorators: [
    moduleMetadata({
      imports: [
        MznFormattedInput,
        MznPickerTrigger,
        MznPickerTriggerWithSeparator,
        MznRangePickerTrigger,
        MznIcon,
      ],
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

// ---------------------------------------------------------------------------
// FormattedInput Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-formatted-input',
  standalone: true,
  imports: [MznFormattedInput],
  template: `
    <div mznCalendarConfigProvider>
      <p style="margin: 0 0 8px 0">Value: {{ value() }}</p>
      <div
        mznFormattedInput
        [format]="format"
        [value]="value()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (valueChanged)="onValueChanged($event)"
        (valueCleared)="onValueCleared()"
      ></div>
    </div>
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
      <div mznCalendarConfigProvider>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div mznFormattedInput
            format="YYYY-MM-DD"
            [disabled]="true"
            placeholder="Disabled"
          ></div>
          <div mznFormattedInput
            format="HH:mm:ss"
            placeholder="Time format"
          ></div>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// PickerTrigger Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-picker-trigger',
  standalone: true,
  imports: [MznPickerTrigger, MznIcon],
  template: `
    <div mznCalendarConfigProvider>
      <p style="margin: 0 0 8px 0">Value: {{ value() }}</p>
      <div
        mznPickerTrigger
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
      </div>
    </div>
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
      <div mznCalendarConfigProvider>
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 200px;">
          <div mznPickerTrigger
            format="YYYY-MM-DD"
            placeholder="Default"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </div>
          <div mznPickerTrigger
            format="YYYY-MM-DD"
            placeholder="Disabled"
            [disabled]="true"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </div>
          <div mznPickerTrigger
            format="YYYY-MM-DD"
            placeholder="ReadOnly"
            [readOnly]="true"
            value="2024-01-15"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </div>
          <div mznPickerTrigger
            format="YYYY-MM-DD"
            placeholder="Error"
            [error]="true"
          >
            <i mznIcon suffix [icon]="CalendarIcon" ></i>
          </div>
        </div>
      </div>
    `,
  }),
};

// ---------------------------------------------------------------------------
// PickerTriggerWithSeparator Playground
// ---------------------------------------------------------------------------

@Component({
  selector: 'story-picker-trigger-with-separator',
  standalone: true,
  imports: [MznPickerTriggerWithSeparator, MznIcon],
  template: `
    <div mznCalendarConfigProvider>
      <p style="margin: 0 0 8px 0"
        >Date: {{ dateValue() }} | Time: {{ timeValue() }}</p
      >
      <div
        mznPickerTriggerWithSeparator
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
      </div>
    </div>
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
  imports: [MznRangePickerTrigger, MznIcon],
  template: `
    <div mznCalendarConfigProvider>
      <p style="margin: 0 0 8px 0"
        >From: {{ fromValue() }} | To: {{ toValue() }}</p
      >
      <div
        mznRangePickerTrigger
        format="YYYY-MM-DD"
        [inputFromValue]="fromValue()"
        [inputToValue]="toValue()"
        inputFromPlaceholder="Start date"
        inputToPlaceholder="End date"
        (inputFromChanged)="onFromChange($event)"
        (inputToChanged)="onToChange($event)"
        (cleared)="onCleared()"
      ></div>
    </div>
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
      <div mznCalendarConfigProvider>
        <div style="display: flex; flex-direction: column; gap: 12px; min-width: 300px;">
          <div mznRangePickerTrigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Start date"
            inputToPlaceholder="End date"
          ></div>
          <div mznRangePickerTrigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Disabled"
            inputToPlaceholder="Disabled"
            [disabled]="true"
          ></div>
          <div mznRangePickerTrigger
            format="YYYY-MM-DD"
            inputFromPlaceholder="Error"
            inputToPlaceholder="Error"
            [error]="true"
          ></div>
        </div>
      </div>
    `,
  }),
};
