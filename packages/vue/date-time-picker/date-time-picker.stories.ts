import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { DateType } from '@mezzanine-ui/core/calendar';
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';
import moment from 'moment';
import MznCalendarConfigProviderDayjs from '../calendar/calendar-config-provider-dayjs.vue';
import MznCalendarConfigProviderLuxon from '../calendar/calendar-config-provider-luxon.vue';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';
import MznDateTimePicker from './date-time-picker.vue';
import type { DateTimePickerProps } from './date-time-picker.types';
import MznTypography from '../typography/typography.vue';

export default {
  title: 'Data Entry/DateTimePicker',
  component: MznDateTimePicker,
} as Meta;

function usePickerChange() {
  const val = ref<DateType | undefined>();
  const onChange = (v?: DateType) => {
    val.value = v;
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = DateTimePickerProps;

export const Playground: StoryObj<PlaygroundArgs> = {
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['sub', 'main'],
    },
  },
  args: {
    clearable: false,
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
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const typoStyle = { margin: '0 0 12px 0' };
      const [val, onChange] = usePickerChange();

      return {
        args,
        onChange,
        originText: computed(() => `origin value: ${val.value}`),
        typoStyle,
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <MznTypography :style="typoStyle" variant="h3">{{ originText }}</MznTypography>
        <MznDateTimePicker
          :clearable="args.clearable"
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

export const Basic: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const containerStyle = { width: '320px', margin: '0 0 24px 0' };
      const typoStyle = { margin: '0 0 12px 0' };
      const val = ref<DateType>();

      const onChange = (v?: DateType) => {
        val.value = v;
      };

      return {
        containerStyle,
        normalText: computed(
          () => `Normal
            Origin Value: ${val.value}`,
        ),
        now: () => moment().toISOString(),
        onChange,
        typoStyle,
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">{{ normalText }}</MznTypography>
          <MznDateTimePicker :value="val" @change="onChange" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Disabled</MznTypography>
          <MznDateTimePicker disabled :value="now()" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Error</MznTypography>
          <MznDateTimePicker error :value="now()" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Read only</MznTypography>
          <MznDateTimePicker read-only :value="now()" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Method: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderDayjs,
      MznCalendarConfigProviderLuxon,
      MznCalendarConfigProviderMoment,
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const containerStyle = { margin: '0 0 24px 0' };
      const typoStyle = { margin: '0 0 12px 0' };
      const val = ref<DateType>();
      const onChange = (v?: DateType) => {
        val.value = v;
      };

      return { containerStyle, onChange, typoStyle, val };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodsMoment</MznTypography>
          <MznDateTimePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderMoment>
      <MznCalendarConfigProviderDayjs>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodsDayjs</MznTypography>
          <MznDateTimePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderDayjs>
      <MznCalendarConfigProviderLuxon>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodLuxon</MznTypography>
          <MznDateTimePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderLuxon>
    `,
  }),
};

export const Sizes: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const containerStyle = { margin: '0 0 24px 0' };
      const typoStyle = { margin: '0 0 12px 0' };
      const [val1, onChange1] = usePickerChange();
      const [val2, onChange2] = usePickerChange();

      return {
        containerStyle,
        onChange1,
        onChange2,
        typoStyle,
        val1,
        val2,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: main</MznTypography>
          <MznDateTimePicker size="main" :value="val2" @change="onChange2" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: sub</MznTypography>
          <MznDateTimePicker size="sub" :value="val1" @change="onChange1" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const DisplayColumn: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const containerStyle = { margin: '0 0 32px 0' };
      const typoStyle = { margin: '0 0 8px 0' };
      const [val1, onChange1] = usePickerChange();
      const [val2, onChange2] = usePickerChange();

      return {
        containerStyle,
        onChange1,
        onChange2,
        text1: computed(
          () =>
            `current value: ${val1.value ? moment(val1.value).format('YYYY-MM-DD HH:mm:ss') : 'undefined'}`,
        ),
        text2: computed(
          () =>
            `current value: ${val2.value ? moment(val2.value).format('YYYY-MM-DD HH:mm') : 'undefined'}`,
        ),
        typoStyle,
        val1,
        val2,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Hours, minutes, seconds</MznTypography>
          <MznTypography :style="typoStyle" variant="body">{{ text1 }}</MznTypography>
          <MznDateTimePicker
            format-date="YYYY-MM-DD"
            format-time="HH:mm:ss"
            :value="val1"
            @change="onChange1"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Hours, minutes</MznTypography>
          <MznTypography :style="typoStyle" variant="body">{{ text2 }}</MznTypography>
          <MznDateTimePicker
            format-date="YYYY-MM-DD"
            format-time="HH:mm"
            hide-second
            :value="val2"
            @change="onChange2"
          />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const CustomDisable: StoryObj = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateTimePicker,
      MznTypography,
    },
    setup: () => {
      const containerStyle = { margin: '0 0 24px 0' };
      const typoStyle = {
        margin: '0 0 12px 0',
        whiteSpace: 'pre-line',
      } as CSSProperties;
      const [valD, onChangeD] = usePickerChange();

      const disabledDatesStart = moment().date(moment().date() + 3);
      const disabledDatesEnd = moment().date(moment().date() + 7);
      const disabledMonthsStart = moment().month(moment().month() - 5);
      const disabledMonthsEnd = moment().month(moment().month() - 1);
      const disabledYearsStart = moment().year(moment().year() - 20);
      const disabledYearsEnd = moment().year(moment().year() - 1);
      const formatDate = 'YYYY-MM-DD';
      const formatTime = 'HH:mm:ss';

      return {
        containerStyle,
        disabledText: `(mode='day') Disabled
              Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}
              Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}
              Dates: ${disabledDatesStart.format(`${formatDate} ${formatTime}`)} ~ ${disabledDatesEnd.format(`${formatDate} ${formatTime}`)}
            `,
        formatDate,
        formatTime,
        isDateDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledDatesStart,
            disabledDatesEnd,
            'day',
            '[]',
          ),
        isMonthDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledMonthsStart,
            disabledMonthsEnd,
            'month',
            '[]',
          ),
        isYearDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledYearsStart,
            disabledYearsEnd,
            'year',
            '[]',
          ),
        navigationText: `(mode='day')
            disabledMonthSwitch = true
            disabledYearSwitch = true
            disableOnNext = true
            disableOnPrev = true`,
        onChangeD,
        typoStyle,
        valD,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">{{ navigationText }}</MznTypography>
          <MznDateTimePicker
            disabled-month-switch
            disabled-year-switch
            disable-on-next
            disable-on-prev
            :format-date="formatDate"
            :format-time="formatTime"
            :value="valD"
            @change="onChangeD"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">{{ disabledText }}</MznTypography>
          <MznDateTimePicker
            :format-date="formatDate"
            :format-time="formatTime"
            :is-date-disabled="isDateDisabled"
            :is-month-disabled="isMonthDisabled"
            :is-year-disabled="isYearDisabled"
            :value="valD"
            @change="onChangeD"
          />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};
