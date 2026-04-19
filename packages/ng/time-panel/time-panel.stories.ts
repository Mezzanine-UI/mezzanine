import { Component, input, signal } from '@angular/core';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import {
  MZN_CALENDAR_CONFIG,
  createCalendarConfig,
} from '@mezzanine-ui/ng/calendar';
import { MznTimePanel } from './time-panel.component';

const meta: Meta<MznTimePanel> = {
  title: 'Internal/Time Panel',
  component: MznTimePanel,
  decorators: [
    moduleMetadata({
      providers: [
        // MznTimePanel 透過 `inject(MZN_CALENDAR_CONFIG)` 讀取日期/時間
        // 處理工具。Storybook 的 standalone wrapper 沒有 app-level
        // providers,這裡提供一份 Dayjs 版 config(對齊 date-time-range-picker
        // 等 story 的作法)以避免 NG0201 No provider 錯誤。
        {
          provide: MZN_CALENDAR_CONFIG,
          useValue: createCalendarConfig(CalendarMethodsDayjs),
        },
      ],
    }),
  ],
};

export default meta;

type Story = StoryObj<MznTimePanel>;

@Component({
  selector: 'story-time-panel-playground',
  standalone: true,
  imports: [MznTimePanel],
  template: `
    <div style="display: flex; flex-flow: row; gap: 32px;">
      <div style="display: flex; flex-flow: column;">
        Default
        <div
          mznTimePanel
          [hourStep]="hourStep()"
          [minuteStep]="minuteStep()"
          [secondStep]="secondStep()"
          [value]="val1()"
          (timeChanged)="val1.set($event)"
          (confirmed)="val1.set(val1())"
          (cancelled)="val1.set(undefined)"
        ></div>
      </div>
      <div style="display: flex; flex-flow: column;">
        Hide Second
        <div
          mznTimePanel
          [hideSecond]="true"
          [hourStep]="hourStep()"
          [minuteStep]="minuteStep()"
          [secondStep]="secondStep()"
          [value]="val2()"
          (timeChanged)="val2.set($event)"
          (confirmed)="val2.set(val2())"
          (cancelled)="val2.set(undefined)"
        ></div>
      </div>
      <div style="display: flex; flex-flow: column;">
        Custom Steps (1h, 5m, 10s)
        <div
          mznTimePanel
          [hourStep]="1"
          [minuteStep]="5"
          [secondStep]="10"
          [value]="val3()"
          (timeChanged)="val3.set($event)"
          (confirmed)="val3.set(val3())"
          (cancelled)="val3.set(undefined)"
        ></div>
      </div>
    </div>
  `,
})
class TimePanelPlaygroundComponent {
  readonly hourStep = input(1);
  readonly minuteStep = input(1);
  readonly secondStep = input(1);
  readonly val1 = signal<string | undefined>(undefined);
  readonly val2 = signal<string | undefined>(undefined);
  readonly val3 = signal<string | undefined>(undefined);
}

export const Playground: Story = {
  argTypes: {
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
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
  },
  decorators: [moduleMetadata({ imports: [TimePanelPlaygroundComponent] })],
  render: (args) => ({
    props: args,
    template: `
      <story-time-panel-playground
        [hourStep]="hourStep"
        [minuteStep]="minuteStep"
        [secondStep]="secondStep"
      />
    `,
  }),
};
