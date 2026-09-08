import type { Meta, StoryObj } from '@storybook/vue3-vite';
import moment from 'moment';
import {
  computed,
  defineComponent,
  ref,
  type FunctionalComponent,
  type PropType,
} from 'vue';
import {
  CalendarLocale,
  getDefaultModeFormat,
  type CalendarLocaleValue,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import MznCalendarConfigProvider from './calendar-config-provider.vue';
import MznCalendar from './calendar.vue';
import MznRangeCalendar from './range-calendar.vue';
import type { RangeCalendarProps } from './range-calendar.types';
import MznTypography from '../typography/typography.vue';
import { useCalendarControls } from './use-calendar-controls';
import MznToggle from '../toggle/toggle.vue';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { Temporal } from '@js-temporal/polyfill';
// Register the polyfill so CalendarMethodsTemporal can use globalThis.Temporal.
(globalThis as { Temporal?: unknown }).Temporal = Temporal;
import CalendarMethodsTemporal from '@mezzanine-ui/core/calendarMethodsTemporal';

const meta: Meta<typeof MznCalendar> = {
  title: 'Internal/Calendar',
  component: MznCalendar,
};

export default meta;

type Story = StoryObj<typeof MznCalendar>;

const InnerCalendarPlayground = defineComponent({
  name: 'InnerCalendarPlayground',
  components: { MznCalendar, MznToggle, MznTypography },
  props: {
    mode: {
      type: String as PropType<CalendarMode>,
      default: 'day',
    },
    locale: {
      type: String as PropType<CalendarLocaleValue>,
      default: CalendarLocale.EN_US,
    },
  },
  setup(props) {
    const formats = {
      day: getDefaultModeFormat('day', props.locale),
      week: getDefaultModeFormat('week', props.locale),
      month: getDefaultModeFormat('month', props.locale),
      year: getDefaultModeFormat('year', props.locale),
      quarter: getDefaultModeFormat('quarter', props.locale),
      'half-year': getDefaultModeFormat('half-year', props.locale),
    };
    const initialReferenceDate = moment().toISOString();
    const showQuickSelect = ref(false);
    const showAnnotations = ref(false);
    const val = ref<DateType>();
    const {
      currentMode,
      onMonthControlClick,
      onNext,
      onPrev,
      onDoubleNext,
      onDoublePrev,
      onYearControlClick,
      popModeStack,
      referenceDate,
      updateReferenceDate,
    } = useCalendarControls(
      () => val.value || initialReferenceDate,
      props.mode,
    );

    const onChange = (target: DateType) => {
      // React reads `currentMode` from the render closure, so the comparison
      // below sees the mode as it was *before* the stack was popped.
      const modeBeforePop = currentMode.value;

      updateReferenceDate(target);

      popModeStack();

      if (modeBeforePop === props.mode) {
        val.value = target;
      }
    };

    const formatValue = (value: DateType | undefined) => {
      if (!value) return '';
      const format = formats[props.mode];
      const m = moment(value);

      // Handle [H]n format for half-year
      if (format === 'YYYY-[H]n') {
        const quarter = m.quarter();
        const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
        return m.format('YYYY') + '-H' + halfYear;
      }

      return m.format(format);
    };

    const quickSelectOptions = [
      {
        id: 'yesterday',
        name: 'Yesterday',
        onClick: () => onChange(moment().subtract(1, 'day').toISOString()),
      },
      {
        id: 'today',
        name: 'Today',
        onClick: () => onChange(moment().toISOString()),
      },
      {
        id: 'tomorrow',
        name: 'Tomorrow',
        onClick: () => onChange(moment().add(1, 'day').toISOString()),
      },
    ];

    const renderAnnotations = computed(() =>
      showAnnotations.value
        ? (date: DateType) => {
            // your custom annotations
            const availableAnnotations: Record<
              string,
              { color: 'text-success' | 'text-error'; value: string }
            > = {
              [moment().format('YYYY-MM-DD')]: {
                color: 'text-success' as const,
                value: '12.4%',
              },
              [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
                color: 'text-error' as const,
                value: '-8%',
              },
            };

            const dateKey = moment(date).format('YYYY-MM-DD');
            const annotation = availableAnnotations[dateKey];

            return annotation;
          }
        : undefined,
    );

    const quickSelect = computed(() =>
      showQuickSelect.value
        ? {
            activeId: (() => {
              if (!val.value) return undefined;

              const todayId = 'today';
              const valMoment = moment(val.value);
              const todayMoment = moment();

              if (valMoment.isSame(todayMoment, 'day')) {
                return todayId;
              }
              if (
                valMoment.isSame(todayMoment.clone().subtract(1, 'day'), 'day')
              ) {
                return 'yesterday';
              }
              if (valMoment.isSame(todayMoment.clone().add(1, 'day'), 'day')) {
                return 'tomorrow';
              }

              return undefined;
            })(),
            options: quickSelectOptions,
          }
        : undefined,
    );

    return {
      currentMode,
      onChange,
      onDoubleNext,
      onDoublePrev,
      onMonthControlClick,
      onNext,
      onPrev,
      onYearControlClick,
      quickSelect,
      referenceDate,
      renderAnnotations,
      showAnnotations,
      showQuickSelect,
      val,
      valueText: computed(
        () => `original value: ${val.value},
        formatted value: ${formatValue(val.value)}`,
      ),
    };
  },
  template: `
    <template v-if="mode === 'day'">
      <MznToggle
        :checked="showQuickSelect"
        label="Enabled QuickSelect"
        @click="showQuickSelect = !showQuickSelect"
      />
      <MznToggle
        :checked="showAnnotations"
        label="Enabled Annotations"
        @click="showAnnotations = !showAnnotations"
      />
    </template>
    <MznTypography :style="{ margin: '0 0 12px 0' }">{{ valueText }}</MznTypography>
    <MznCalendar
      :mode="currentMode"
      :render-annotations="renderAnnotations"
      :quick-select="quickSelect"
      :reference-date="referenceDate"
      :value="val"
      @change="onChange"
      @month-control-click="onMonthControlClick"
      @double-next="onDoubleNext"
      @next="onNext"
      @double-prev="onDoublePrev"
      @prev="onPrev"
      @year-control-click="onYearControlClick"
    />
  `,
});

export const CalendarPlayground: Story = {
  args: {
    mode: 'day',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
  },
  render: (args) => ({
    components: { InnerCalendarPlayground, MznCalendarConfigProvider },
    setup: () => ({
      CalendarMethodsDayjs,
      CalendarMethodsLuxon,
      CalendarMethodsMoment,
      CalendarMethodsTemporal,
      locale: CalendarLocale.EN_US,
      mode: args.mode ?? 'day',
    }),
    template: `
      <div
        style="display: flex; flex-flow: row wrap; gap: 12px"
      >
        <div>
          Moment
          <MznCalendarConfigProvider
            :methods="CalendarMethodsMoment"
            :locale="locale"
          >
            <InnerCalendarPlayground :mode="mode" :locale="locale" />
          </MznCalendarConfigProvider>
        </div>
        <div>
          Dayjs
          <MznCalendarConfigProvider
            :methods="CalendarMethodsDayjs"
            :locale="locale"
          >
            <InnerCalendarPlayground :mode="mode" :locale="locale" />
          </MznCalendarConfigProvider>
        </div>
        <div>
          Luxon
          <MznCalendarConfigProvider
            :methods="CalendarMethodsLuxon"
            :locale="locale"
          >
            <InnerCalendarPlayground :mode="mode" :locale="locale" />
          </MznCalendarConfigProvider>
        </div>
        <div>
          Temporal
          <MznCalendarConfigProvider
            :methods="CalendarMethodsTemporal"
            :locale="locale"
          >
            <InnerCalendarPlayground :mode="mode" :locale="locale" />
          </MznCalendarConfigProvider>
        </div>
      </div>
    `,
  }),
};

const InnerRangeCalendarPlayground = defineComponent({
  name: 'InnerRangeCalendarPlayground',
  components: { MznRangeCalendar, MznToggle, MznTypography },
  props: {
    mode: {
      type: String as PropType<CalendarMode>,
      default: 'day',
    },
    locale: {
      type: String as PropType<string>,
      default: undefined,
    },
  },
  setup(props) {
    const formats = {
      day: getDefaultModeFormat('day', props.locale),
      week: getDefaultModeFormat('week', props.locale),
      month: getDefaultModeFormat('month', props.locale),
      year: getDefaultModeFormat('year', props.locale),
      quarter: getDefaultModeFormat('quarter', props.locale),
      'half-year': getDefaultModeFormat('half-year', props.locale),
    };
    const initialReferenceDate = moment().toISOString();
    const showQuickSelect = ref(false);

    // Final confirmed values
    const confirmedStartVal = ref<DateType>();
    const confirmedEndVal = ref<DateType>();

    // Temporary selection values
    const tempStartVal = ref<DateType>();
    const tempEndVal = ref<DateType>();

    const formatValue = (value: DateType | undefined) => {
      if (!value) return '';
      const format = formats[props.mode];
      const m = moment(value);

      // Handle [H]n format for half-year
      if (format === 'YYYY-[H]n') {
        const quarter = m.quarter();
        const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
        return m.format('YYYY') + '-H' + halfYear;
      }

      return m.format(format);
    };

    const handleChange = (target: [DateType, DateType | undefined]) => {
      // RangeCalendar already handles sorting and normalization
      // Just use the values as-is
      tempStartVal.value = target[0];
      tempEndVal.value = target[1];
    };

    const handleOk = () => {
      // Apply temporary selection to confirmed values
      confirmedStartVal.value = tempStartVal.value;
      confirmedEndVal.value = tempEndVal.value;
    };

    const handleCancel = () => {
      // Revert to confirmed values
      tempStartVal.value = confirmedStartVal.value;
      tempEndVal.value = confirmedEndVal.value;
    };

    const isDateInRange = (date: DateType) => {
      if (!tempStartVal.value || !tempEndVal.value) return false;

      return moment(date).isBetween(
        tempStartVal.value,
        tempEndVal.value,
        null,
        '[]',
      );
    };

    const quickSelectOptions = [
      {
        id: 'lastWeek',
        name: 'Last 7 Days',
        onClick: () => {
          const end = moment();
          const start = moment().subtract(7, 'days');
          tempStartVal.value = start.toISOString();
          tempEndVal.value = end.toISOString();
        },
      },
      {
        id: 'lastMonth',
        name: 'Last 30 Days',
        onClick: () => {
          const end = moment();
          const start = moment().subtract(30, 'days');
          tempStartVal.value = start.toISOString();
          tempEndVal.value = end.toISOString();
        },
      },
    ];

    return {
      confirmedText: computed(
        () =>
          `Confirmed Range: ${formatValue(confirmedStartVal.value)} ~ ${formatValue(confirmedEndVal.value)}`,
      ),
      currentText: computed(
        () =>
          `Current Selection: ${formatValue(tempStartVal.value)} ~ ${formatValue(tempEndVal.value)}`,
      ),
      actions: computed(() => ({
        primaryButtonProps: {
          children: 'Ok',
          onClick: handleOk,
          disabled: !tempStartVal.value || !tempEndVal.value,
        },
        secondaryButtonProps: {
          children: 'Cancel',
          onClick: handleCancel,
        },
      })),
      handleChange,
      isDateInRange,
      quickSelect: computed(() =>
        showQuickSelect.value
          ? {
              activeId: (() => {
                if (!tempStartVal.value || !tempEndVal.value) return undefined;

                const lastWeekId = 'lastWeek';
                const lastMonthId = 'lastMonth';
                const endMoment = moment(tempEndVal.value);
                const startMoment = moment(tempStartVal.value);
                const todayMoment = moment();

                if (
                  startMoment.isSame(
                    todayMoment.clone().subtract(7, 'days'),
                    'day',
                  ) &&
                  endMoment.isSame(todayMoment, 'day')
                ) {
                  return lastWeekId;
                }

                if (
                  startMoment.isSame(
                    todayMoment.clone().subtract(30, 'days'),
                    'day',
                  ) &&
                  endMoment.isSame(todayMoment, 'day')
                ) {
                  return lastMonthId;
                }

                return undefined;
              })(),
              options: quickSelectOptions,
            }
          : undefined,
      ),
      referenceDate: computed(
        () =>
          tempStartVal.value || confirmedStartVal.value || initialReferenceDate,
      ),
      showQuickSelect,
      value: computed(() =>
        tempStartVal.value && tempEndVal.value
          ? [tempStartVal.value, tempEndVal.value]
          : tempStartVal.value
            ? [tempStartVal.value]
            : undefined,
      ),
    };
  },
  template: `
    <MznToggle
      v-if="mode === 'day'"
      :checked="showQuickSelect"
      label="Enabled QuickSelect"
      @click="showQuickSelect = !showQuickSelect"
    />
    <MznTypography :style="{ margin: '0 0 12px 0' }">{{ confirmedText }}</MznTypography>
    <MznTypography :style="{ margin: '0 0 12px 0', color: '#999' }">{{ currentText }}</MznTypography>
    <MznRangeCalendar
      :mode="mode"
      :reference-date="referenceDate"
      :value="value"
      :is-date-in-range="isDateInRange"
      :is-month-in-range="isDateInRange"
      :is-week-in-range="isDateInRange"
      :is-year-in-range="isDateInRange"
      :is-quarter-in-range="isDateInRange"
      :is-half-year-in-range="isDateInRange"
      :actions="actions"
      :quick-select="quickSelect"
      @change="handleChange"
    />
  `,
});

export const RangeCalendarPlayground: StoryObj<typeof MznRangeCalendar> = {
  args: {
    mode: 'day',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
  },
  render: (args) => ({
    components: { InnerRangeCalendarPlayground, MznCalendarConfigProvider },
    setup: () => ({
      CalendarMethodsMoment,
      locale: CalendarLocale.EN_US,
      mode: args.mode ?? 'day',
    }),
    template: `
      <MznCalendarConfigProvider :methods="CalendarMethodsMoment" :locale="locale">
        <InnerRangeCalendarPlayground :mode="mode" :locale="locale" />
      </MznCalendarConfigProvider>
    `,
  }),
};

export const RangeCalendarDisabledInRange: StoryObj<typeof MznRangeCalendar> = {
  render: () => ({
    components: {
      MznCalendarConfigProvider,
      MznRangeCalendar,
      MznTypography,
    },
    setup: () => {
      const value = ['2026-08-05', '2026-09-25'];

      return {
        CalendarMethodsLuxon,
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-08-20',
        isDateInRange: (target: DateType) =>
          moment(target).isBetween(value[0], value[1], 'day', '[]'),
        value,
      };
    },
    template: `
      <MznCalendarConfigProvider locale="en-US" :methods="CalendarMethodsLuxon">
        <MznTypography variant="h3">Disabled date inside a custom range</MznTypography>
        <MznTypography variant="body">August 20 is disabled. The caller supplies a custom highlight, but the range must remain unhighlighted.</MznTypography>
        <MznRangeCalendar
          :is-date-disabled="isDateDisabled"
          :is-date-in-range="isDateInRange"
          reference-date="2026-08-01"
          :value="value"
        />
      </MznCalendarConfigProvider>
    `,
  }),
};

/**
 * React writes `Selected:{' '}{joined}{suffix}`, which is three text nodes
 * inside the paragraph. A Vue template merges adjacent text and
 * interpolations into one, so the children are handed over as an array.
 */
const SelectedText: FunctionalComponent<{ dates: string; suffix: string }> = (
  props,
) => ['Selected: ', props.dates, props.suffix];

const RangeCalendarValidationExample = defineComponent({
  name: 'RangeCalendarValidationExample',
  components: { MznRangeCalendar, MznTypography, SelectedText },
  props: {
    displayWeekDayLocale: {
      type: String as PropType<RangeCalendarProps['displayWeekDayLocale']>,
      default: undefined,
    },
    initialValue: {
      type: Array as PropType<DateType[]>,
      required: true,
    },
    isDateDisabled: {
      type: Function as PropType<RangeCalendarProps['isDateDisabled']>,
      default: undefined,
    },
    isWeekDisabled: {
      type: Function as PropType<RangeCalendarProps['isWeekDisabled']>,
      default: undefined,
    },
    mode: {
      type: String as PropType<CalendarMode>,
      default: undefined,
    },
    referenceDate: {
      type: String as PropType<DateType>,
      required: true,
    },
  },
  setup(props) {
    const value = ref<DateType[]>(props.initialValue);

    return {
      onChange: ([start, end]: [DateType, DateType | undefined]) => {
        value.value = end ? [start, end] : [start];
      },
      reset: () => {
        value.value = props.initialValue;
      },
      dates: computed(() =>
        value.value
          .map((date) => moment(date).format('YYYY-MM-DD'))
          .join(' / '),
      ),
      suffix: computed(() =>
        value.value.length === 1 ? ' / awaiting end' : '',
      ),
      value,
    };
  },
  template: `
    <button @click="reset" type="button">Reset selection</button>
    <MznTypography variant="body"><SelectedText :dates="dates" :suffix="suffix" /></MznTypography>
    <MznRangeCalendar
      :display-week-day-locale="displayWeekDayLocale"
      :is-date-disabled="isDateDisabled"
      :is-week-disabled="isWeekDisabled"
      :mode="mode"
      :reference-date="referenceDate"
      :value="value"
      @change="onChange"
    />
  `,
});

export const RangeCalendarWeekLocale: StoryObj<typeof MznRangeCalendar> = {
  render: () => ({
    components: {
      MznCalendarConfigProvider,
      MznTypography,
      RangeCalendarValidationExample,
    },
    setup: () => ({
      CalendarMethodsLuxon,
      initialValue: ['2026-09-07'],
      isWeekDisabled: (date: DateType) =>
        moment(date).format('YYYY-MM-DD') === '2026-09-14',
    }),
    template: `
      <MznCalendarConfigProvider locale="en-US" :methods="CalendarMethodsLuxon">
        <MznTypography variant="h3">Monday-first calendar with a Sunday-first provider</MznTypography>
        <MznTypography variant="body">September 7 is selected; the week starting September 14 is disabled. Click September 21. Before review fixes: September 7–27 is submitted. After: selection restarts at September 21, awaiting an end.</MznTypography>
        <RangeCalendarValidationExample
          display-week-day-locale="en-GB"
          :initial-value="initialValue"
          :is-week-disabled="isWeekDisabled"
          mode="week"
          reference-date="2026-09-01"
        />
      </MznCalendarConfigProvider>
    `,
  }),
};

export const RangeCalendarScanLimit: StoryObj<typeof MznRangeCalendar> = {
  render: () => ({
    components: {
      MznCalendarConfigProvider,
      MznTypography,
      RangeCalendarValidationExample,
    },
    setup: () => ({
      CalendarMethodsLuxon,
      initialValue: ['2000-01-01'],
      isDateDisabled: (date: DateType) =>
        moment(date).format('YYYY-MM-DD') === '2015-01-01',
    }),
    template: `
      <MznCalendarConfigProvider locale="en-US" :methods="CalendarMethodsLuxon">
        <MznTypography variant="h3">Restricted long-range selection</MznTypography>
        <MznTypography variant="body">January 1, 2000 is selected; January 1, 2015 is disabled. Click September 11, 2020. Before review fixes: the entire range is submitted. After: selection restarts at September 11 because the long range could not be fully checked. Then click September 12 to complete a shorter range.</MznTypography>
        <RangeCalendarValidationExample
          :initial-value="initialValue"
          :is-date-disabled="isDateDisabled"
          reference-date="2020-09-01"
        />
      </MznCalendarConfigProvider>
    `,
  }),
};
