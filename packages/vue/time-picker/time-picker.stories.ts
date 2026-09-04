import type { Meta, StoryFn } from '@storybook/vue3-vite';
import type { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ref } from 'vue';
import moment from 'moment';
import MznCalendarConfigProvider from '../calendar/calendar-config-provider.vue';
import MznTimePicker from './time-picker.vue';
import type { TimePickerProps } from './time-picker.types';
import MznTypography from '../typography/typography.vue';

export default {
  title: 'Data Entry/TimePicker',
} as Meta;

function usePickerChange<T = DateType>() {
  const val = ref<T>();
  const onChange = (v?: T) => {
    val.value = v;
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = TimePickerProps;

export const Playground: StoryFn<PlaygroundArgs> = (args) => ({
  components: { MznCalendarConfigProvider, MznTimePicker, MznTypography },
  setup: () => {
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange();

    return {
      CalendarMethodsMoment,
      args,
      currentText: () =>
        `current value: ${val.value ? moment(val.value).format(args.format) : ''}`,
      onChange,
      typoStyle,
      val,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <MznTypography variant="h3" :style="typoStyle">{{ currentText() }}</MznTypography>
      <MznTimePicker
        :value="val"
        :clearable="args.clearable"
        :disabled="args.disabled"
        :error="args.error"
        :format="args.format"
        :full-width="args.fullWidth"
        :hide-hour="args.hideHour"
        :hide-minute="args.hideMinute"
        :hide-second="args.hideSecond"
        :hour-step="args.hourStep"
        :minute-step="args.minuteStep"
        :placeholder="args.placeholder"
        :read-only="args.readOnly"
        :required="args.required"
        :second-step="args.secondStep"
        :size="args.size"
        @change="onChange"
      />
    </MznCalendarConfigProvider>
  `,
});

Playground.argTypes = {
  size: {
    options: ['main', 'sub'],
    control: {
      type: 'select',
    },
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
  minuteStep: 1,
  placeholder: 'Select time',
  readOnly: false,
  required: false,
  secondStep: 1,
  size: 'main',
};

export const Basic = () => ({
  components: { MznCalendarConfigProvider, MznTimePicker, MznTypography },
  setup: () => {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const val = ref<DateType>();
    const onChange = (v?: DateType) => {
      val.value = v;
    };

    return {
      CalendarMethodsMoment,
      containerStyle,
      // React reads `moment()` inside its JSX, so the three static pickers
      // pick up a fresh value on every render rather than freezing the one
      // from the first.
      now: () => moment().toISOString(),
      onChange,
      typoStyle,
      val,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Normal</MznTypography>
        <MznTimePicker :value="val" @change="onChange" />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Disabled</MznTypography>
        <MznTimePicker :value="now()" disabled />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Error</MznTypography>
        <MznTimePicker :value="now()" error />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Read only</MznTypography>
        <MznTimePicker :value="now()" read-only />
      </div>
    </MznCalendarConfigProvider>
  `,
});

export const Sizes = () => ({
  components: { MznCalendarConfigProvider, MznTimePicker, MznTypography },
  setup: () => {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val1, onChange1] = usePickerChange();
    const [val2, onChange2] = usePickerChange();

    return {
      CalendarMethodsMoment,
      containerStyle,
      onChange1,
      onChange2,
      typoStyle,
      val1,
      val2,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Main (Default)</MznTypography>
        <MznTimePicker :value="val1" size="main" @change="onChange1" />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Sub</MznTypography>
        <MznTimePicker :value="val2" size="sub" @change="onChange2" />
      </div>
    </MznCalendarConfigProvider>
  `,
});

export const DisplayColumn = () => ({
  components: { MznCalendarConfigProvider, MznTimePicker, MznTypography },
  setup: () => {
    const containerStyle = { margin: '0 0 32px 0' };
    const typoStyle = { margin: '0 0 8px 0' };
    const [val1, onChange1] = usePickerChange();
    const [val2, onChange2] = usePickerChange();

    return {
      CalendarMethodsMoment,
      containerStyle,
      onChange1,
      onChange2,
      text1: () => `origin value: ${val1.value}
          current value: ${val1.value ? moment(val1.value).format('HH:mm:ss') : ''}`,
      text2: () => `origin value: ${val2.value}
          current value: ${val2.value ? moment(val2.value).format('HH:mm') : ''}`,
      typoStyle,
      val1,
      val2,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Hours, minutes, seconds</MznTypography>
        <MznTypography variant="body" :style="typoStyle">{{ text1() }}</MznTypography>
        <MznTimePicker
          :value="val1"
          format="HH:mm:ss"
          placeholder="HH:mm:ss"
          @change="onChange1"
        />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Hours, minutes</MznTypography>
        <MznTypography variant="body" :style="typoStyle">{{ text2() }}</MznTypography>
        <MznTimePicker
          :value="val2"
          hide-second
          format="HH:mm"
          placeholder="HH:mm"
          @change="onChange2"
        />
      </div>
    </MznCalendarConfigProvider>
  `,
});

export const Steps = () => ({
  components: { MznCalendarConfigProvider, MznTimePicker, MznTypography },
  setup: () => {
    const containerStyle = { margin: '0 0 32px 0' };
    const typoStyle = { margin: '0 0 8px 0' };
    const [val1, onChange1] = usePickerChange();
    const [val2, onChange2] = usePickerChange();
    const [val3, onChange3] = usePickerChange();
    const describe = (value?: DateType) => `origin value: ${value}
          current value: ${value ? moment(value).format('HH:mm:ss') : ''}`;

    return {
      CalendarMethodsMoment,
      containerStyle,
      onChange1,
      onChange2,
      onChange3,
      text1: () => describe(val1.value),
      text2: () => describe(val2.value),
      text3: () => describe(val3.value),
      typoStyle,
      val1,
      val2,
      val3,
    };
  },
  template: `
    <MznCalendarConfigProvider :methods="CalendarMethodsMoment">
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Hour step (15 minutes)</MznTypography>
        <MznTypography variant="body" :style="typoStyle">{{ text1() }}</MznTypography>
        <MznTimePicker
          :value="val1"
          :hour-step="1"
          :minute-step="15"
          placeholder="HH:mm:ss"
          @change="onChange1"
        />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">Minute step (30 seconds)</MznTypography>
        <MznTypography variant="body" :style="typoStyle">{{ text2() }}</MznTypography>
        <MznTimePicker
          :value="val2"
          :minute-step="1"
          :second-step="30"
          placeholder="HH:mm:ss"
          @change="onChange2"
        />
      </div>
      <div :style="containerStyle">
        <MznTypography variant="h3" :style="typoStyle">All steps (6 hours, 15 minutes, 20 seconds)</MznTypography>
        <MznTypography variant="body" :style="typoStyle">{{ text3() }}</MznTypography>
        <MznTimePicker
          :value="val3"
          :hour-step="6"
          :minute-step="15"
          :second-step="20"
          placeholder="HH:mm:ss"
          @change="onChange3"
        />
      </div>
    </MznCalendarConfigProvider>
  `,
});
