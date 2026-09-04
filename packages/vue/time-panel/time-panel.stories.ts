import type { Meta, StoryFn } from '@storybook/vue3-vite';
import { ref } from 'vue';
import type { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznTimePanel from './time-panel.vue';
import type { TimePanelProps } from './time-panel.types';

export default {
  title: 'Internal/Time Panel',
} as Meta;

type PlaygroundArgs = Pick<
  TimePanelProps,
  'hourStep' | 'minuteStep' | 'secondStep'
>;

export const Playground: StoryFn<PlaygroundArgs> = (args) => ({
  components: { MznCalendarConfigProvider, MznTimePanel },
  setup: () => {
    const val = ref<DateType>();
    const val2 = ref<DateType>();
    const val3 = ref<DateType>();

    return {
      CalendarMethodsDayjs,
      CalendarMethodsLuxon,
      CalendarMethodsMoment,
      args,
      val,
      val2,
      val3,
    };
  },
  template: `
    <div
      style="display: flex; flex-flow: row; gap: 32px"
    >
      <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
        <div style="display: flex; flex-flow: column">
          Default
          <MznTimePanel
            :value="val"
            :hour-step="args.hourStep"
            :minute-step="args.minuteStep"
            :second-step="args.secondStep"
            @change="val = $event"
            @confirm="() => {}"
            @cancel="val = undefined"
          />
        </div>
      </MznCalendarConfigProvider>
      <MznCalendarConfigProvider :methods="CalendarMethodsDayjs">
        <div style="display: flex; flex-flow: column">
          Hide Second
          <MznTimePanel
            :value="val2"
            :hour-step="args.hourStep"
            :minute-step="args.minuteStep"
            :second-step="args.secondStep"
            hide-second
            @change="val2 = $event"
            @confirm="() => {}"
            @cancel="val2 = undefined"
          />
        </div>
      </MznCalendarConfigProvider>
      <MznCalendarConfigProvider :methods="CalendarMethodsLuxon">
        <div style="display: flex; flex-flow: column">
          Custom Steps (1h, 5m, 10s)
          <MznTimePanel
            :value="val3"
            :hour-step="1"
            :minute-step="5"
            :second-step="10"
            @change="val3 = $event"
            @confirm="() => {}"
            @cancel="val3 = undefined"
          />
        </div>
      </MznCalendarConfigProvider>
    </div>
  `,
});

Playground.args = {
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
};
