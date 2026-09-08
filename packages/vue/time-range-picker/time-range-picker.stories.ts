import type { Meta, StoryFn } from '@storybook/vue3-vite';
import type { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import { computed, ref } from 'vue';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznTypography from '../typography/typography.vue';
import MznTimeRangePicker from './time-range-picker.vue';
import type { TimeRangePickerProps } from './time-range-picker.types';
import type { TimeRangePickerValue } from './use-time-range-picker-value';

export default {
  title: 'Data Entry/TimeRangePicker',
} as Meta;

function usePickerChange<T = DateType>() {
  const val = ref<T>();
  const onChange = (v?: T) => {
    val.value = v;
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = TimeRangePickerProps;

export const Playground: StoryFn<PlaygroundArgs> = (args) => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange<TimeRangePickerValue>();

    const formatValue = (v: TimeRangePickerValue | undefined) => {
      if (!v) return '';
      const [from, to] = v;
      const fromStr = from ? moment(from).format(args.format) : '-';
      const toStr = to ? moment(to).format(args.format) : '-';

      return `${fromStr} ~ ${toStr}`;
    };

    return {
      CalendarMethodsMoment,
      args,
      currentText: computed(() => `current value: ${formatValue(val.value)}`),
      onChange,
      typoStyle,
      val,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <MznTypography :style="typoStyle" variant="h3">{{ currentText }}</MznTypography>
      <MznTimeRangePicker
        :clearable="args.clearable"
        :disabled="args.disabled"
        :error="args.error"
        :format="args.format"
        :full-width="args.fullWidth"
        :hide-hour="args.hideHour"
        :hide-minute="args.hideMinute"
        :hide-second="args.hideSecond"
        :hour-step="args.hourStep"
        :input-from-placeholder="args.inputFromPlaceholder"
        :input-to-placeholder="args.inputToPlaceholder"
        :minute-step="args.minuteStep"
        :read-only="args.readOnly"
        :required="args.required"
        :second-step="args.secondStep"
        :size="args.size"
        :value="val"
        @change="onChange"
      />
    </MznCalendarConfigProvider>
  `,
});

Playground.argTypes = {
  size: {
    control: {
      type: 'select',
    },
    options: ['main', 'sub'],
  },
};

Playground.args = {
  clearable: true,
  disabled: false,
  error: false,
  format: 'HH:mm:ss',
  fullWidth: false,
  hideHour: false,
  hideMinute: false,
  hideSecond: false,
  hourStep: 1,
  inputFromPlaceholder: 'Start time',
  inputToPlaceholder: 'End time',
  minuteStep: 1,
  readOnly: false,
  required: false,
  secondStep: 1,
  size: 'main',
};

export const Basic = () => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const groupStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange<TimeRangePickerValue>();

    return {
      CalendarMethodsMoment,
      groupStyle,
      onChange,
      typoStyle,
      val,
      valueText: computed(
        () => `Value: ${val.value ? `[${val.value}]` : 'undefined'}`,
      ),
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="groupStyle">
        <MznTypography :style="typoStyle" variant="h3">{{ valueText }}</MznTypography>
        <MznTimeRangePicker :value="val" @change="onChange" />
      </div>
    </MznCalendarConfigProvider>
  `,
});

export const HideSecond = () => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange<TimeRangePickerValue>();

    return { CalendarMethodsMoment, onChange, typoStyle, val };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <MznTypography :style="typoStyle" variant="h3">Hide Second (HH:mm format)</MznTypography>
      <MznTimeRangePicker
        format="HH:mm"
        hide-second
        :value="val"
        @change="onChange"
      />
    </MznCalendarConfigProvider>
  `,
});

export const WithSteps = () => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange<TimeRangePickerValue>();

    return { CalendarMethodsMoment, onChange, typoStyle, val };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <MznTypography :style="typoStyle" variant="h3">With Steps (Hour: 2, Minute: 15, Second: 30)</MznTypography>
      <MznTimeRangePicker
        :hour-step="2"
        :minute-step="15"
        :second-step="30"
        :value="val"
        @change="onChange"
      />
    </MznCalendarConfigProvider>
  `,
});

export const States = () => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const groupStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const defaultVal: TimeRangePickerValue = [
      moment().hour(9).minute(0).second(0).toISOString(),
      moment().hour(17).minute(30).second(0).toISOString(),
    ];
    const [val, onChange] = usePickerChange<TimeRangePickerValue>();

    return {
      CalendarMethodsMoment,
      defaultVal,
      groupStyle,
      onChange,
      typoStyle,
      val,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="groupStyle">
        <MznTypography :style="typoStyle" variant="h3">Disabled</MznTypography>
        <MznTimeRangePicker :value="defaultVal" disabled />
      </div>
      <div :style="groupStyle">
        <MznTypography :style="typoStyle" variant="h3">Read Only</MznTypography>
        <MznTimeRangePicker :value="defaultVal" read-only />
      </div>
      <div :style="groupStyle">
        <MznTypography :style="typoStyle" variant="h3">With Error State</MznTypography>
        <MznTimeRangePicker :value="val" error @change="onChange" />
      </div>
    </MznCalendarConfigProvider>
  `,
});

export const Sizes = () => ({
  components: { MznCalendarConfigProvider, MznTimeRangePicker, MznTypography },
  setup: () => {
    const typoStyle = { margin: '12px 0' };
    const [val1, onChange1] = usePickerChange<TimeRangePickerValue>();
    const [val2, onChange2] = usePickerChange<TimeRangePickerValue>();

    return {
      CalendarMethodsMoment,
      onChange1,
      onChange2,
      typoStyle,
      val1,
      val2,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <MznTypography :style="typoStyle" variant="h3">Size: Main</MznTypography>
      <MznTimeRangePicker size="main" :value="val1" @change="onChange1" />
      <MznTypography :style="typoStyle" variant="h3">Size: Sub</MznTypography>
      <MznTimeRangePicker size="sub" :value="val2" @change="onChange2" />
    </MznCalendarConfigProvider>
  `,
});
