import type { Meta, StoryObj } from '@storybook/vue3-vite';
import {
  getDefaultModeFormat,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { computed, defineComponent, ref } from 'vue';
import type { CSSProperties, FunctionalComponent } from 'vue';
import moment from 'moment';
import type { RangePickerValue } from '@mezzanine-ui/core/picker';
import MznDateRangePicker from './date-range-picker.vue';
import MznTypography from '../typography/typography.vue';
import MznCalendarConfigProviderDayjs from '../calendar/calendar-config-provider-dayjs.vue';
import MznCalendarConfigProviderLuxon from '../calendar/calendar-config-provider-luxon.vue';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';

const meta: Meta<typeof MznDateRangePicker> = {
  component: MznDateRangePicker,
  title: 'Data Entry/DateRangePicker',
};

export default meta;

type Story = StoryObj<typeof MznDateRangePicker>;

function usePickerChange() {
  const val = ref<RangePickerValue>();
  const onChange = (v?: RangePickerValue) => {
    val.value = v;
  };

  return [val, onChange] as const;
}

const getUpperCase = (mode: CalendarMode) =>
  mode.charAt(0).toUpperCase() + mode.slice(1);

const containerStyle = { margin: '0 0 24px 0' };
const typoStyle = { margin: '0 0 12px 0' };

// Helper function to format values with [H]n support
const formatWithHalfYear = (value: DateType | undefined, mode: string) => {
  if (!value) return '';
  const format = getDefaultModeFormat(mode as CalendarMode);
  const m = moment(value);

  // Handle [H]n format for half-year
  if (format === 'YYYY-[H]n') {
    const quarter = m.quarter();
    const halfYear = Math.ceil(quarter / 2);
    return m.format('YYYY') + '-H' + halfYear;
  }

  return m.format(format);
};

export const Playground: Story = {
  args: {
    clearable: false,
    disabled: false,
    error: false,
    fullWidth: false,
    inputFromPlaceholder: 'Start Date',
    inputToPlaceholder: 'End Date',
    mode: 'day',
    readOnly: false,
    size: 'main',
    confirmMode: 'immediate',
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['main', 'sub'],
    },
    confirmMode: {
      control: {
        type: 'select',
      },
      options: ['immediate', 'manual'],
    },
  },
  render: (args) => ({
    components: {
      MznCalendarConfigProviderDayjs,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const [val, onChange] = usePickerChange();
      const mode = computed((): CalendarMode => args.mode ?? 'day');

      return {
        args,
        currentText: computed(
          () =>
            `current value: [${val.value?.[0] || ''}, ${val.value?.[1] || ''}]`,
        ),
        format: computed(() => getDefaultModeFormat(mode.value)),
        formatText: computed(
          () =>
            `format: [${formatWithHalfYear(val.value?.[0], mode.value)}, ${formatWithHalfYear(val.value?.[1], mode.value)}]`,
        ),
        mode,
        modeTitle: computed(() => getUpperCase(mode.value)),
        onChange,
        typoStyle,
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznTypography :style="typoStyle" variant="h3">{{ modeTitle }}</MznTypography>
        <MznTypography :style="typoStyle" variant="body">{{ currentText }}</MznTypography>
        <MznTypography :style="typoStyle" variant="body">{{ formatText }}</MznTypography>
        <MznDateRangePicker
          :clearable="args.clearable"
          :disabled="args.disabled"
          :error="args.error"
          :format="format"
          :full-width="args.fullWidth"
          :input-from-placeholder="args.inputFromPlaceholder"
          :input-to-placeholder="args.inputToPlaceholder"
          :mode="mode"
          :read-only="args.readOnly"
          :size="args.size"
          :confirm-mode="args.confirmMode"
          :value="val"
          @change="onChange"
        />
      </MznCalendarConfigProviderDayjs>
    `,
  }),
};

export const Basic: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const [val, onChange] = usePickerChange();

      return {
        containerStyle,
        onChange,
        typoStyle,
        val,
        weekRange: () => [
          moment().toISOString(),
          moment().add(7, 'days').toISOString(),
        ],
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Normal</MznTypography>
          <MznDateRangePicker :value="val" @change="onChange" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Disabled</MznTypography>
          <MznDateRangePicker disabled :value="weekRange()" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Error</MznTypography>
          <MznDateRangePicker error :value="weekRange()" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Read only</MznTypography>
          <MznDateRangePicker read-only :value="weekRange()" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Method: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderDayjs,
      MznCalendarConfigProviderLuxon,
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const [valMoment, onChangeMoment] = usePickerChange();
      const [valDayjs, onChangeDayjs] = usePickerChange();
      const [valLuxon, onChangeLuxon] = usePickerChange();

      return {
        containerStyle,
        onChangeDayjs,
        onChangeLuxon,
        onChangeMoment,
        typoStyle,
        valDayjs,
        valLuxon,
        valMoment,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodsMoment</MznTypography>
          <MznDateRangePicker :value="valMoment" @change="onChangeMoment" />
        </div>
      </MznCalendarConfigProviderMoment>
      <MznCalendarConfigProviderDayjs>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodsDayjs</MznTypography>
          <MznDateRangePicker :value="valDayjs" @change="onChangeDayjs" />
        </div>
      </MznCalendarConfigProviderDayjs>
      <MznCalendarConfigProviderLuxon>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">CalendarMethodsLuxon</MznTypography>
          <MznDateRangePicker :value="valLuxon" @change="onChangeLuxon" />
        </div>
      </MznCalendarConfigProviderLuxon>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const [valMain, onChangeMain] = usePickerChange();
      const [valSub, onChangeSub] = usePickerChange();

      return {
        containerStyle,
        onChangeMain,
        onChangeSub,
        typoStyle,
        valMain,
        valSub,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: Main</MznTypography>
          <MznDateRangePicker size="main" :value="valMain" @change="onChangeMain" />
        </div>
        <div :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">Size: Sub</MznTypography>
          <MznDateRangePicker size="sub" :value="valSub" @change="onChangeSub" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

const modeSections: {
  fromPlaceholder: string;
  mode: CalendarMode;
  title: string;
  toPlaceholder: string;
}[] = [
  {
    fromPlaceholder: 'Start Date',
    mode: 'day',
    title: 'Day',
    toPlaceholder: 'End Date',
  },
  {
    fromPlaceholder: 'Start Week',
    mode: 'week',
    title: 'Week',
    toPlaceholder: 'End Week',
  },
  {
    fromPlaceholder: 'Start Month',
    mode: 'month',
    title: 'Month',
    toPlaceholder: 'End Month',
  },
  {
    fromPlaceholder: 'Start Year',
    mode: 'year',
    title: 'Year',
    toPlaceholder: 'End Year',
  },
  {
    fromPlaceholder: 'Start Quarter',
    mode: 'quarter',
    title: 'Quarter',
    toPlaceholder: 'End Quarter',
  },
  {
    fromPlaceholder: 'Start Half Year',
    mode: 'half-year',
    title: 'Half Year',
    toPlaceholder: 'End Half Year',
  },
];

export const Modes: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const values = modeSections.map(() => usePickerChange());

      return {
        containerStyle,
        describe: (index: number) => {
          const [val] = values[index];
          const { mode } = modeSections[index];
          const format = getDefaultModeFormat(mode);
          const formatValue = (value?: DateType) => {
            if (!value) return '';

            return mode === 'half-year'
              ? formatWithHalfYear(value, mode)
              : moment(value).format(format);
          };

          return `origin value: [${val.value?.[0] || ''}, ${val.value?.[1] || ''}]
format value: [${formatValue(val.value?.[0])}, ${formatValue(val.value?.[1])}]`;
        },
        formatOf: (mode: CalendarMode) => getDefaultModeFormat(mode),
        onChangeOf: (index: number) => values[index][1],
        sections: modeSections,
        typoStyle,
        valueOf: (index: number) => values[index][0].value,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div v-for="(section, index) in sections" :key="section.mode" :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">{{ section.title }}</MznTypography>
          <MznTypography :style="typoStyle" variant="body">{{ describe(index) }}</MznTypography>
          <MznDateRangePicker
            :format="formatOf(section.mode)"
            :input-from-placeholder="section.fromPlaceholder"
            :input-to-placeholder="section.toPlaceholder"
            :mode="section.mode"
            :value="valueOf(index)"
            @change="onChangeOf(index)"
          />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const CustomDisable: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const sectionStyle = {
        margin: '0 0 48px 0',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      };
      const typoStylePre = {
        margin: '0 0 12px 0',
        whiteSpace: 'pre-line',
      } as CSSProperties;

      const [valNav, onChangeNav] = usePickerChange();
      const [valD, onChangeD] = usePickerChange();
      const [valW, onChangeW] = usePickerChange();
      const [valM, onChangeM] = usePickerChange();
      const [valY, onChangeY] = usePickerChange();
      const [valQ, onChangeQ] = usePickerChange();
      const [valH, onChangeH] = usePickerChange();

      const today = moment();

      // Disable specific ranges
      const disabledDatesStart = moment().date(today.date() + 3);
      const disabledDatesEnd = moment().date(today.date() + 7);
      const disabledWeeksStart = moment().week(today.week() - 5);
      const disabledWeeksEnd = moment().week(today.week() - 2);
      const disabledMonthsStart = moment().month(today.month() - 5);
      const disabledMonthsEnd = moment().month(today.month() - 1);
      const disabledYearsStart = moment().year(today.year() - 5);
      const disabledYearsEnd = moment().year(today.year() - 1);

      return {
        containerStyle,
        disabledDatesText: `Day: Disable ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`,
        disabledMonthsText: `Month: Disable ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`,
        disabledWeeksText: `Week: Disable ${disabledWeeksStart.format(getDefaultModeFormat('week'))} ~ ${disabledWeeksEnd.format(getDefaultModeFormat('week'))}`,
        disabledYearsText: `Year: Disable ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`,
        formatOf: (mode: CalendarMode) => getDefaultModeFormat(mode),
        headingStyle: { margin: '0 0 16px 0' },
        isDateDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledDatesStart,
            disabledDatesEnd,
            'day',
            '[]',
          ),
        isHalfYearDisabled: (target: DateType) => {
          const h = Math.ceil(moment(target).quarter() / 2);
          const y = moment(target).year();

          // Disable H1 of current year
          return y === today.year() && h === 1;
        },
        isMonthDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledMonthsStart,
            disabledMonthsEnd,
            'month',
            '[]',
          ),
        isQuarterDisabled: (target: DateType) => {
          const q = moment(target).quarter();
          const y = moment(target).year();

          // Disable Q1 and Q2 of current year
          return y === today.year() && (q === 1 || q === 2);
        },
        isWeekDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledWeeksStart,
            disabledWeeksEnd,
            'week',
            '[]',
          ),
        isYearDisabled: (target: DateType) =>
          moment(target).isBetween(
            disabledYearsStart,
            disabledYearsEnd,
            'year',
            '[]',
          ),
        onChangeD,
        onChangeH,
        onChangeM,
        onChangeNav,
        onChangeQ,
        onChangeW,
        onChangeY,
        sectionStyle,
        typoStylePre,
        valD,
        valH,
        valM,
        valNav,
        valQ,
        valW,
        valY,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">1. Disable Navigation Controls</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">Disable month/year switching buttons and navigation arrows. Useful when you want to restrict user to current view only.</MznTypography>
          <MznDateRangePicker
            disabled-month-switch
            disabled-year-switch
            disable-on-double-next
            disable-on-double-prev
            disable-on-next
            disable-on-prev
            format="YYYY-MM-DD"
            input-from-placeholder="Start Date"
            input-to-placeholder="End Date"
            mode="day"
            :value="valNav"
            @change="onChangeNav"
          />
        </div>

        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">2. Mode-specific Disable Examples</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">When selecting a range that crosses disabled dates, the range will be blocked and selection will restart.</MznTypography>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">{{ disabledDatesText }}</MznTypography>
            <MznDateRangePicker
              :format="formatOf('day')"
              input-from-placeholder="Start Date"
              input-to-placeholder="End Date"
              :is-date-disabled="isDateDisabled"
              mode="day"
              :value="valD"
              @change="onChangeD"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">{{ disabledWeeksText }}</MznTypography>
            <MznDateRangePicker
              :format="formatOf('week')"
              input-from-placeholder="Start Week"
              input-to-placeholder="End Week"
              :is-week-disabled="isWeekDisabled"
              mode="week"
              :value="valW"
              @change="onChangeW"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">{{ disabledMonthsText }}</MznTypography>
            <MznDateRangePicker
              :format="formatOf('month')"
              input-from-placeholder="Start Month"
              input-to-placeholder="End Month"
              :is-month-disabled="isMonthDisabled"
              mode="month"
              :value="valM"
              @change="onChangeM"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">{{ disabledYearsText }}</MznTypography>
            <MznDateRangePicker
              :format="formatOf('year')"
              input-from-placeholder="Start Year"
              input-to-placeholder="End Year"
              :is-year-disabled="isYearDisabled"
              mode="year"
              :value="valY"
              @change="onChangeY"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">Quarter: Disable Q1 and Q2 of current year</MznTypography>
            <MznDateRangePicker
              :format="formatOf('quarter')"
              input-from-placeholder="Start Quarter"
              input-to-placeholder="End Quarter"
              :is-quarter-disabled="isQuarterDisabled"
              mode="quarter"
              :value="valQ"
              @change="onChangeQ"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="h3">Half Year: Disable H1 of current year</MznTypography>
            <MznDateRangePicker
              :format="formatOf('half-year')"
              input-from-placeholder="Start Half Year"
              input-to-placeholder="End Half Year"
              :is-half-year-disabled="isHalfYearDisabled"
              mode="half-year"
              :value="valH"
              @change="onChangeH"
            />
          </div>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const CalendarIntegration: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const sectionStyle = {
        margin: '0 0 48px 0',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      };
      const typoStylePre = {
        margin: '0 0 12px 0',
        whiteSpace: 'pre-line',
      } as CSSProperties;

      const [valAnnotation, onChangeAnnotation] = usePickerChange();
      const [valQuickSelect, onChangeQuickSelect] = usePickerChange();

      const annotationData: Record<
        string,
        {
          color:
            | 'text-error'
            | 'text-neutral'
            | 'text-success'
            | 'text-warning';
          value: string;
        }
      > = {
        [moment().format('YYYY-MM-DD')]: {
          color: 'text-success',
          value: '+5.2%',
        },
        [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
          color: 'text-error',
          value: '-3.1%',
        },
        [moment().subtract(2, 'days').format('YYYY-MM-DD')]: {
          color: 'text-warning',
          value: '+1.8%',
        },
        [moment().subtract(3, 'days').format('YYYY-MM-DD')]: {
          color: 'text-success',
          value: '+8.4%',
        },
        [moment().subtract(4, 'days').format('YYYY-MM-DD')]: {
          color: 'text-error',
          value: '-7.2%',
        },
        [moment().add(1, 'days').format('YYYY-MM-DD')]: {
          color: 'text-warning',
          value: '+2.1%',
        },
        [moment().add(2, 'days').format('YYYY-MM-DD')]: {
          color: 'text-neutral',
          value: '-0.5%',
        },
        [moment().add(3, 'days').format('YYYY-MM-DD')]: {
          color: 'text-success',
          value: '+6.7%',
        },
      };

      // Quick select options for range picker
      const quickSelectOptions = [
        {
          id: 'today',
          name: 'Today',
          onClick: () =>
            onChangeQuickSelect([
              moment().startOf('day').toISOString(),
              moment().endOf('day').toISOString(),
            ]),
        },
        {
          id: 'last7days',
          name: 'Last 7 Days',
          onClick: () =>
            onChangeQuickSelect([
              moment().subtract(6, 'days').startOf('day').toISOString(),
              moment().endOf('day').toISOString(),
            ]),
        },
        {
          id: 'last30days',
          name: 'Last 30 Days',
          onClick: () =>
            onChangeQuickSelect([
              moment().subtract(29, 'days').startOf('day').toISOString(),
              moment().endOf('day').toISOString(),
            ]),
        },
        {
          id: 'thisMonth',
          name: 'This Month',
          onClick: () =>
            onChangeQuickSelect([
              moment().startOf('month').toISOString(),
              moment().endOf('month').toISOString(),
            ]),
        },
        {
          id: 'lastMonth',
          name: 'Last Month',
          onClick: () =>
            onChangeQuickSelect([
              moment().subtract(1, 'month').startOf('month').toISOString(),
              moment().subtract(1, 'month').endOf('month').toISOString(),
            ]),
        },
      ];

      const getQuickSelectActiveId = (val?: RangePickerValue) => {
        if (!val || !val[0] || !val[1]) return undefined;
        const [start, end] = val;
        const startMoment = moment(start);
        const endMoment = moment(end);
        const today = moment();

        // Check Today
        if (
          startMoment.isSame(today, 'day') &&
          endMoment.isSame(today, 'day')
        ) {
          return 'today';
        }

        // Check Last 7 Days
        if (
          startMoment.isSame(today.clone().subtract(6, 'days'), 'day') &&
          endMoment.isSame(today, 'day')
        ) {
          return 'last7days';
        }

        // Check Last 30 Days
        if (
          startMoment.isSame(today.clone().subtract(29, 'days'), 'day') &&
          endMoment.isSame(today, 'day')
        ) {
          return 'last30days';
        }

        // Check This Month
        if (
          startMoment.isSame(today.clone().startOf('month'), 'day') &&
          endMoment.isSame(today.clone().endOf('month'), 'day')
        ) {
          return 'thisMonth';
        }

        // Check Last Month
        const lastMonth = today.clone().subtract(1, 'month');

        if (
          startMoment.isSame(lastMonth.clone().startOf('month'), 'day') &&
          endMoment.isSame(lastMonth.clone().endOf('month'), 'day')
        ) {
          return 'lastMonth';
        }

        return undefined;
      };

      return {
        containerStyle,
        headingStyle: { margin: '0 0 16px 0' },
        onChangeAnnotation,
        onChangeQuickSelect,
        quickSelect: computed(() => ({
          activeId: getQuickSelectActiveId(valQuickSelect.value),
          options: quickSelectOptions,
        })),
        quickSelectText: computed(
          () =>
            `Selected: [${valQuickSelect.value?.[0] ? moment(valQuickSelect.value[0]).format('YYYY-MM-DD') : ''}, ${valQuickSelect.value?.[1] ? moment(valQuickSelect.value[1]).format('YYYY-MM-DD') : ''}]`,
        ),
        renderAnnotations: (date: DateType) => {
          const dateKey = moment(date).format('YYYY-MM-DD');

          return annotationData[dateKey];
        },
        sectionStyle,
        typoStylePre,
        valAnnotation,
        valQuickSelect,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">1. Date Annotations (renderAnnotations)</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">Display additional information on each date cell via calendarProps. Perfect for showing metrics, events, or status indicators.</MznTypography>
          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="body">Example: Stock market daily changes</MznTypography>
            <MznDateRangePicker
              :render-annotations="renderAnnotations"
              format="YYYY-MM-DD"
              input-from-placeholder="Start Date"
              input-to-placeholder="End Date"
              mode="day"
              :value="valAnnotation"
              @change="onChangeAnnotation"
            />
          </div>
        </div>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">2. Quick Select Options</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">Provide shortcut buttons for commonly selected date ranges. Great for improving UX in dashboards and reports.</MznTypography>
          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="body">{{ quickSelectText }}</MznTypography>
            <MznDateRangePicker
              format="YYYY-MM-DD"
              input-from-placeholder="Start Date"
              input-to-placeholder="End Date"
              mode="day"
              :quick-select="quickSelect"
              :value="valQuickSelect"
              @change="onChangeQuickSelect"
            />
          </div>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const ConfirmMode: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => {
      const sectionStyle = {
        margin: '0 0 48px 0',
        padding: '16px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
      };
      const typoStylePre = {
        margin: '0 0 12px 0',
        whiteSpace: 'pre-line',
      } as CSSProperties;

      const [valImmediate, onChangeImmediate] = usePickerChange();
      const [valManual, onChangeManual] = usePickerChange();

      const changeCount = ref(0);
      const manualChangeCount = ref(0);

      const handleImmediateChange = (v?: RangePickerValue) => {
        onChangeImmediate(v);

        if (v && v[0] && v[1]) {
          changeCount.value += 1;
        }
      };

      const handleManualChange = (v?: RangePickerValue) => {
        onChangeManual(v);

        if (v && v[0] && v[1]) {
          manualChangeCount.value += 1;
        }
      };

      const describe = (val?: RangePickerValue) =>
        `Selected: [${val?.[0] ? moment(val[0]).format('YYYY-MM-DD') : ''}, ${val?.[1] ? moment(val[1]).format('YYYY-MM-DD') : ''}]`;

      return {
        actions: {
          primaryButtonProps: {
            children: '確定',
          },
          secondaryButtonProps: {
            children: '取消',
          },
        },
        containerStyle,
        handleImmediateChange,
        handleManualChange,
        headingStyle: { margin: '0 0 16px 0' },
        immediateSummary: computed(
          () => `confirmMode="immediate" (default behavior)
- onChange is triggered immediately after selecting both dates
- Calendar auto-closes after range selection
- onChange triggered count: ${changeCount.value}`,
        ),
        immediateText: computed(() => describe(valImmediate.value)),
        manualSummary: computed(
          () => `confirmMode="manual"
- Auto-generates Confirm/Cancel buttons
- onChange is only triggered when clicking "Confirm"
- Confirm button is disabled until both dates are selected
- onChange triggered count: ${manualChangeCount.value}`,
        ),
        manualText: computed(() => describe(valManual.value)),
        sectionStyle,
        typoStylePre,
        valImmediate,
        valManual,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">1. Immediate Mode (Default)</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">{{ immediateSummary }}</MznTypography>
          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="body">{{ immediateText }}</MznTypography>
            <MznDateRangePicker
              confirm-mode="immediate"
              format="YYYY-MM-DD"
              input-from-placeholder="Start Date"
              input-to-placeholder="End Date"
              mode="day"
              :value="valImmediate"
              @change="handleImmediateChange"
            />
          </div>
        </div>

        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">2. Manual Mode</MznTypography>
          <MznTypography :style="typoStylePre" variant="body">{{ manualSummary }}</MznTypography>
          <div :style="containerStyle">
            <MznTypography :style="typoStylePre" variant="body">{{ manualText }}</MznTypography>
            <MznDateRangePicker
              :actions="actions"
              confirm-mode="manual"
              format="YYYY-MM-DD"
              input-from-placeholder="Start Date"
              input-to-placeholder="End Date"
              mode="day"
              :value="valManual"
              @change="handleManualChange"
            />
          </div>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

const disabledRangeCases = [
  {
    description:
      'A disabled date inside a short range suppresses its highlight.',
    disabledDay: '2026-08-20',
    title: 'Disabled date inside the range',
    value: ['2026-08-01', '2026-09-30'] as RangePickerValue,
  },
  {
    description:
      'Before review fixes: highlighted. After: no highlight, because the restricted range cannot be fully checked.',
    disabledDay: '2040-01-01',
    title: 'Restricted range beyond the scan limit',
    value: ['2026-08-01', '4026-08-01'] as RangePickerValue,
  },
  {
    description:
      'With no disabled predicate, even a very long range remains highlighted and opens without scanning.',
    disabledDay: undefined,
    title: 'Unrestricted long range',
    value: ['2026-08-01', '4026-08-01'] as RangePickerValue,
  },
];

export const DisabledInRangeBehavior: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderLuxon,
      MznDateRangePicker,
      MznTypography,
    },
    setup: () => ({
      containerStyle,
      isDateDisabledOf: (disabledDay?: string) =>
        disabledDay
          ? (target: DateType) =>
              moment(target).format('YYYY-MM-DD') === disabledDay
          : undefined,
      items: disabledRangeCases,
      typoStyle,
    }),
    template: `
      <MznCalendarConfigProviderLuxon locale="en-US">
        <section v-for="item in items" :key="item.title" :style="containerStyle">
          <MznTypography :style="typoStyle" variant="h3">{{ item.title }}</MznTypography>
          <MznTypography :style="typoStyle" variant="body">{{ item.description }}</MznTypography>
          <MznDateRangePicker
            format="YYYY-MM-DD"
            input-from-placeholder="Start Date"
            input-to-placeholder="End Date"
            :is-date-disabled="isDateDisabledOf(item.disabledDay)"
            reference-date="2026-08-01"
            :value="item.value"
          />
        </section>
      </MznCalendarConfigProviderLuxon>
    `,
  }),
};

/**
 * React writes `Submitted:{' '}{value}`, which is two text nodes inside the
 * paragraph; a Vue template would merge them into one.
 */
const SubmittedText: FunctionalComponent<{ value: string }> = (props) => [
  'Submitted: ',
  props.value,
];

const HoverRangeExample = defineComponent({
  name: 'HoverRangeExample',
  components: { MznDateRangePicker, MznTypography, SubmittedText },
  props: {
    description: {
      required: true,
      type: String,
    },
    disabledDay: {
      default: undefined,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const resetKey = ref(0);
    const value = ref<RangePickerValue>();

    return {
      containerStyle,
      isDateDisabled: props.disabledDay
        ? (date: DateType) =>
            moment(date).format('YYYY-MM-DD') === props.disabledDay
        : undefined,
      onChange: (v?: RangePickerValue) => {
        value.value = v;
      },
      reset: () => {
        value.value = undefined;
        resetKey.value += 1;
      },
      resetKey,
      submitted: computed(() =>
        value.value
          ? value.value
              .map((date) => moment(date).format('YYYY-MM-DD'))
              .join(' / ')
          : 'none',
      ),
      typoStyle,
      value,
    };
  },
  template: `
    <section :style="containerStyle">
      <MznTypography :style="typoStyle" variant="h3">{{ title }}</MznTypography>
      <MznTypography :style="typoStyle" variant="body">{{ description }}</MznTypography>
      <button @click="reset" type="button">Reset example</button>
      <MznTypography :style="typoStyle" variant="body"><SubmittedText :value="submitted" /></MznTypography>
      <MznDateRangePicker
        :key="resetKey"
        input-from-placeholder="Start Date"
        input-to-placeholder="End Date"
        :is-date-disabled="isDateDisabled"
        reference-date="2026-09-01"
        :value="value"
        @change="onChange"
      />
    </section>
  `,
});

export const HoverRangeSelection: Story = {
  render: () => ({
    components: { HoverRangeExample, MznCalendarConfigProviderLuxon },
    template: `
      <MznCalendarConfigProviderLuxon locale="en-US">
        <HoverRangeExample
          description="Click September 1, move over September 11, then click it. Repeat after navigating next and back. The submitted range must remain September 1–11."
          title="Normal hover selection"
        />
        <HoverRangeExample
          description="September 5 is disabled. Click September 1 and hover September 11: no range highlight. Clicking September 11 restarts selection without submitting. September 12 then completes a valid short range."
          disabled-day="2026-09-05"
          title="Disabled date inside the range"
        />
        <HoverRangeExample
          description="Click September 1, navigate forward twice, and hover November 18. October 5 is disabled and off-screen. The preview must remain unhighlighted and clicking must not submit the range."
          disabled-day="2026-10-05"
          title="Disabled date outside the visible months"
        />
      </MznCalendarConfigProviderLuxon>
    `,
  }),
};
