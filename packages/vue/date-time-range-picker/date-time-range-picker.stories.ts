import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { computed, ref } from 'vue';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';
import MznDateTimeRangePicker from './date-time-range-picker.vue';
import type {
  DateTimeRangePickerProps,
  DateTimeRangePickerValue,
} from './date-time-range-picker.types';
import MznTypography from '../typography/typography.vue';

export default {
  title: 'Data Entry/DateTimeRangePicker',
  component: MznDateTimeRangePicker,
} as Meta;

function useRangePickerChange() {
  const val = ref<DateTimeRangePickerValue>([undefined, undefined]);
  const onChange = (v: DateTimeRangePickerValue) => {
    val.value = v;
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = DateTimeRangePickerProps;

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    direction: {
      control: {
        type: 'radio',
      },
      options: ['row', 'column'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sub', 'main'],
    },
  },
  args: {
    clearable: true,
    direction: 'row',
    disabled: false,
    error: false,
    formatDate: 'YYYY-MM-DD',
    formatTime: 'HH:mm:ss',
    fullWidth: false,
    hideHour: false,
    hideMinute: false,
    hideSecond: false,
    hourStep: 1,
    minuteStep: 1,
    readOnly: false,
    secondStep: 1,
    size: 'main',
    placeholderLeft: 'Select date',
    placeholderRight: 'Select time',
  },
  render: (args) => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimeRangePicker,
      MznTypography,
    },
    setup: () => {
      const typoStyle = { margin: '0 0 12px 0' };
      const [val, onChange] = useRangePickerChange();

      return {
        args,
        fromText: computed(() => `From: ${val.value[0] ?? 'undefined'}`),
        onChange,
        toText: computed(() => `To: ${val.value[1] ?? 'undefined'}`),
        typoStyle,
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <MznTypography :style="typoStyle" variant="h3">{{ fromText }}</MznTypography>
        <MznTypography :style="typoStyle" variant="h3">{{ toText }}</MznTypography>
        <MznDateTimeRangePicker
          :clearable="args.clearable"
          :direction="args.direction"
          :disabled="args.disabled"
          :error="args.error"
          :format-date="args.formatDate"
          :format-time="args.formatTime"
          :full-width="args.fullWidth"
          :hide-hour="args.hideHour"
          :hide-minute="args.hideMinute"
          :hide-second="args.hideSecond"
          :hour-step="args.hourStep"
          :minute-step="args.minuteStep"
          :read-only="args.readOnly"
          :second-step="args.secondStep"
          :size="args.size"
          :value="val"
          :placeholder-left="args.placeholderLeft"
          :placeholder-right="args.placeholderRight"
          @change="onChange"
        />
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Direction: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimeRangePicker,
      MznTypography,
    },
    setup: () => {
      const typoStyle = { margin: '0 0 12px 0' };
      const [rowVal, onRowChange] = useRangePickerChange();
      const [colVal, onColChange] = useRangePickerChange();

      return {
        colVal,
        gapStyle: { marginTop: '32px' },
        onColChange,
        onRowChange,
        rowVal,
        typoStyle,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <MznTypography :style="typoStyle" variant="h3">Row Direction (default)</MznTypography>
        <MznDateTimeRangePicker
          direction="row"
          :value="rowVal"
          @change="onRowChange"
        />

        <div :style="gapStyle" />

        <MznTypography :style="typoStyle" variant="h3">Column Direction</MznTypography>
        <MznDateTimeRangePicker
          direction="column"
          :value="colVal"
          @change="onColChange"
        />
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const States: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimeRangePicker,
      MznTypography,
    },
    setup: () => ({
      typoStyle: { margin: '0 0 12px 0' },
      wrapperStyle: { marginBottom: '24px' },
    }),
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Normal</MznTypography>
          <MznDateTimeRangePicker />
        </div>

        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Disabled</MznTypography>
          <MznDateTimeRangePicker disabled />
        </div>

        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Error</MznTypography>
          <MznDateTimeRangePicker error />
        </div>

        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Read Only</MznTypography>
          <MznDateTimeRangePicker read-only />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Sizes: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimeRangePicker,
      MznTypography,
    },
    setup: () => ({
      typoStyle: { margin: '0 0 12px 0' },
      wrapperStyle: { marginBottom: '24px' },
    }),
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: main (default)</MznTypography>
          <MznDateTimeRangePicker size="main" />
        </div>

        <div :style="wrapperStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: sub</MznTypography>
          <MznDateTimeRangePicker size="sub" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};
