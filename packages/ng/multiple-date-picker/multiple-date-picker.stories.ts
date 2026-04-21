import { Component, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { FormsModule } from '@angular/forms';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTypography } from '@mezzanine-ui/ng/typography';
import { MznMultipleDatePicker } from './multiple-date-picker.component';

const meta: Meta<MznMultipleDatePicker> = {
  title: 'Data Entry/MultipleDatePicker',
  component: MznMultipleDatePicker,
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
type Story = StoryObj<MznMultipleDatePicker>;

@Component({
  selector: 'story-multiple-date-picker-playground',
  standalone: true,
  imports: [MznMultipleDatePicker, MznTypography],
  template: `
    <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
      Selected: {{ value().length }} date(s)
    </h3>
    <p mznTypography variant="body" style="margin: 0 0 12px 0;">
      {{ value().length > 0 ? value().join(', ') : 'No dates selected' }}
    </p>
    <div
      mznMultipleDatePicker
      [clearable]="clearable"
      [disabled]="disabled"
      [error]="error"
      [fullWidth]="fullWidth"
      [overflowStrategy]="overflowStrategy"
      [placeholder]="placeholder"
      [readOnly]="readOnly"
      [size]="size"
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
  overflowStrategy: 'counter' | 'wrap' = 'counter';
  placeholder = 'Select dates';
  readOnly = false;
  size: 'main' | 'sub' = 'main';
  readonly value = signal<ReadonlyArray<DateType>>([]);
}

export const Playground: Story = {
  argTypes: {
    clearable: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    error: {
      control: { type: 'boolean' },
    },
    fullWidth: {
      control: { type: 'boolean' },
    },
    overflowStrategy: {
      control: { type: 'radio' },
      options: ['counter', 'wrap'],
    },
    placeholder: {
      control: { type: 'text' },
    },
    readOnly: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'radio' },
      options: ['main', 'sub'],
    },
  },
  args: {
    clearable: true,
    disabled: false,
    error: false,
    fullWidth: false,
    overflowStrategy: 'counter',
    placeholder: 'Select dates',
    readOnly: false,
    size: 'main',
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
        [overflowStrategy]="overflowStrategy"
        [placeholder]="placeholder"
        [readOnly]="readOnly"
        [size]="size"
      />
    `,
  }),
};

export const Basic: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Basic Multiple Date Picker
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Click on dates to select/deselect. Click Confirm to apply changes.
        </p>
        <div style="width: 400px;">
          <div mznMultipleDatePicker [(ngModel)]="dates" placeholder="Select multiple dates"></div>
        </div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Selected dates:
        </h3>
        @if (dates.length > 0) {
          <ul>
            @for (d of dates; track d) {
              <li>{{ d }}</li>
            }
          </ul>
        } @else {
          <p mznTypography variant="caption" style="margin: 0 0 12px 0;">No dates selected</p>
        }
      </div>
    `,
  }),
};

export const MaxSelections: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Max 3 Selections
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          You can only select up to 3 dates. Once reached, other dates become disabled.
        </p>
        <div mznMultipleDatePicker [(ngModel)]="dates" [maxSelections]="3" placeholder="Select up to 3 dates"></div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Selected: {{ dates.length }}/3
        </h3>
      </div>
    `,
  }),
};

export const OverflowStrategies: Story = {
  parameters: { controls: { disable: true } },
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
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Overflow Strategy: counter (default)
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Shows visible tags with a counter for hidden ones.
        </p>
        <div style="max-width: 300px;">
          <div mznMultipleDatePicker [(ngModel)]="counterDates" overflowStrategy="counter"></div>
        </div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Overflow Strategy: wrap
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Wraps tags to multiple lines.
        </p>
        <div style="max-width: 300px;">
          <div mznMultipleDatePicker [(ngModel)]="wrapDates" overflowStrategy="wrap"></div>
        </div>
      </div>
    `,
  }),
};

export const States: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">Disabled</h3>
        <div mznMultipleDatePicker [disabled]="true" [value]="['2025-01-01', '2025-01-15']"></div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">Read Only</h3>
        <div mznMultipleDatePicker [readOnly]="true" [value]="['2025-01-01', '2025-01-15']"></div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">Error</h3>
        <div mznMultipleDatePicker [error]="true" [value]="['2025-01-01', '2025-01-15']"></div>
      </div>
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">Full Width</h3>
        <div mznMultipleDatePicker [fullWidth]="true" [value]="['2025-01-01', '2025-01-15']"></div>
      </div>
    `,
  }),
};

export const CustomActions: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { dates: [] as string[] },
    template: `
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Custom Action Button Text
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Override confirm/cancel button text via cancelText and confirmText inputs.
        </p>
        <div mznMultipleDatePicker
          [(ngModel)]="dates"
          cancelText="取消"
          confirmText="確認"
          placeholder="選擇日期"
        ></div>
      </div>
    `,
  }),
};

export const DisabledDates: Story = {
  parameters: { controls: { disable: true } },
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
      <div style="margin: 0 0 24px 0;">
        <h3 mznTypography variant="h3" style="margin: 0 0 12px 0;">
          Disabled Dates (Weekends)
        </h3>
        <p mznTypography variant="body" style="margin: 0 0 12px 0;">
          Weekends (Saturday and Sunday) are disabled.
        </p>
        <div mznMultipleDatePicker
          [(ngModel)]="dates"
          [isDateDisabled]="isWeekendDisabled"
          placeholder="Select weekdays only"
        ></div>
      </div>
    `,
  }),
};
