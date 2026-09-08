import type { Meta, StoryObj } from '@storybook/vue3-vite';
import moment from 'moment';
import {
  getDefaultModeFormat,
  type CalendarMode,
  type DateType,
} from '@mezzanine-ui/core/calendar';
import { computed, ref } from 'vue';
import type { CSSProperties } from 'vue';
import MznDatePicker from './date-picker.vue';
import MznButton from '../button/button.vue';
import MznModal from '../modal/modal.vue';
import MznTypography from '../typography/typography.vue';
import MznCalendarConfigProviderDayjs from '../calendar/calendar-config-provider-dayjs.vue';
import MznCalendarConfigProviderLuxon from '../calendar/calendar-config-provider-luxon.vue';
import MznCalendarConfigProviderMoment from '../calendar/calendar-config-provider-moment.vue';

const meta: Meta<typeof MznDatePicker> = {
  title: 'Data Entry/DatePicker',
  component: MznDatePicker,
};

export default meta;

type Story = StoryObj<typeof MznDatePicker>;

function usePickerChange() {
  const val = ref<DateType | undefined>();
  const onChange = (v?: DateType): void => {
    val.value = v;
  };

  return [val, onChange] as const;
}

export const Playground: Story = {
  args: {
    clearable: false,
    disabled: false,
    error: false,
    format: 'YYYY-MM-DD',
    fullWidth: false,
    mode: 'day',
    placeholder: 'Start Date',
    readOnly: false,
    size: 'main',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['main', 'sub'],
      control: {
        type: 'select',
      },
    },
  },
  render: (args) => ({
    components: {
      MznCalendarConfigProviderDayjs,
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [val, onChange] = usePickerChange();

      return {
        args,
        errorMessages: {
          enabled: true,
          invalidInput: '輸入字串不正確。',
          invalidPaste: '貼上的內容不正確。',
        },
        onChange,
        typoStyle: { margin: '0 0 12px 0' },
        val,
        valueText: computed(() => `Value: ${val.value || ''}`),
      };
    },
    template: `
      <MznCalendarConfigProviderDayjs locale="zh-TW">
        <MznTypography variant="h3" :style="typoStyle">{{ valueText }}</MznTypography>
        <MznDatePicker
          v-bind="args"
          :value="val"
          placeholder="輸入日期"
          :error-messages="errorMessages"
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
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const val = ref<DateType | undefined>('2025-12-04T16:00:00.000Z');
      const onChange = (v?: DateType): void => {
        val.value = v;
      };

      return {
        containerStyle: { margin: '0 0 24px 0' },
        now: () => new Date().toISOString(),
        onChange,
        typoStyle: { margin: '0 0 12px 0' },
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Normal</MznTypography>
          <MznDatePicker :value="val" @change="onChange" />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Disabled</MznTypography>
          <MznDatePicker :value="now()" disabled />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Error</MznTypography>
          <MznDatePicker :value="now()" error />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Read only</MznTypography>
          <MznDatePicker :value="now()" read-only />
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
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const val = ref<DateType | undefined>(new Date().toISOString());
      const onChange = (v?: DateType): void => {
        val.value = v;
      };

      return {
        containerStyle: { margin: '0 0 24px 0' },
        onChange,
        typoStyle: { margin: '0 0 12px 0' },
        val,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">CalendarMethodsMoment</MznTypography>
          <MznDatePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderMoment>
      <MznCalendarConfigProviderDayjs>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">CalendarMethodsDayjs</MznTypography>
          <MznDatePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderDayjs>
      <MznCalendarConfigProviderLuxon>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">CalendarMethodsLuxon</MznTypography>
          <MznDatePicker :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderLuxon>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [valMain, onChangeMain] = usePickerChange();
      const [valSub, onChangeSub] = usePickerChange();

      return {
        containerStyle: { margin: '0 0 24px 0' },
        onChangeMain,
        onChangeSub,
        typoStyle: { margin: '0 0 12px 0' },
        valMain,
        valSub,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Size: Main</MznTypography>
          <MznDatePicker :value="valMain" size="main" @change="onChangeMain" />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Size: Sub</MznTypography>
          <MznDatePicker :value="valSub" size="sub" @change="onChangeSub" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

export const Modes: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [valD, onChangeD] = usePickerChange();
      const [valW, onChangeW] = usePickerChange();
      const [valM, onChangeM] = usePickerChange();
      const [valY, onChangeY] = usePickerChange();
      const [valQ, onChangeQ] = usePickerChange();
      const [valH, onChangeH] = usePickerChange();

      // Helper function to format values with [H]n support
      const formatWithHalfYear = (
        value: DateType | undefined,
        mode: string,
      ): string => {
        if (!value) return '';

        const format = getDefaultModeFormat(mode as CalendarMode);
        const m = moment(value);

        // Handle [H]n format for half-year
        if (format === 'YYYY-[H]n') {
          const quarter = m.quarter();
          const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2

          return `${m.format('YYYY')}-H${halfYear}`;
        }

        return m.format(format);
      };

      const summary = (
        value: DateType | undefined,
        mode: CalendarMode,
      ): string =>
        `origin value: ${value || ''}
format value: ${value ? moment(value).format(getDefaultModeFormat(mode)) : ''}`;

      return {
        containerStyle: { margin: '0 0 32px 0' },
        format: (mode: CalendarMode) => getDefaultModeFormat(mode),
        halfYearText: computed(
          () => `origin value: ${valH.value || ''}
format value: ${formatWithHalfYear(valH.value, 'half-year')}`,
        ),
        onChangeD,
        onChangeH,
        onChangeM,
        onChangeQ,
        onChangeW,
        onChangeY,
        summary,
        typoStyle: { margin: '0 0 8px 0' },
        valD,
        valH,
        valM,
        valQ,
        valW,
        valY,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Day</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ summary(valD, 'day') }}</MznTypography>
          <MznDatePicker
            :value="valD"
            mode="day"
            :format="format('day')"
            placeholder="輸入日期"
            @change="onChangeD"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Week</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ summary(valW, 'week') }}</MznTypography>
          <MznDatePicker
            :value="valW"
            mode="week"
            :format="format('week')"
            placeholder="輸入日期"
            @change="onChangeW"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Month</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ summary(valM, 'month') }}</MznTypography>
          <MznDatePicker
            :value="valM"
            mode="month"
            :format="format('month')"
            placeholder="輸入日期"
            @change="onChangeM"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Year</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ summary(valY, 'year') }}</MznTypography>
          <MznDatePicker
            :value="valY"
            mode="year"
            :format="format('year')"
            placeholder="輸入日期"
            @change="onChangeY"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Quarter</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ summary(valQ, 'quarter') }}</MznTypography>
          <MznDatePicker
            :value="valQ"
            mode="quarter"
            :format="format('quarter')"
            placeholder="輸入日期"
            @change="onChangeQ"
          />
        </div>
        <div :style="containerStyle">
          <MznTypography variant="h3" :style="typoStyle">Half year</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ halfYearText }}</MznTypography>
          <MznDatePicker
            :value="valH"
            mode="half-year"
            :format="format('half-year')"
            placeholder="輸入日期"
            @change="onChangeH"
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
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [valD, onChangeD] = usePickerChange();
      const [valW, onChangeW] = usePickerChange();
      const [valM, onChangeM] = usePickerChange();
      const [valY, onChangeY] = usePickerChange();
      const [valQ, onChangeQ] = usePickerChange();
      const [valH, onChangeH] = usePickerChange();
      const [valMinMax, onChangeMinMax] = usePickerChange();

      // Define disabled ranges relative to today
      const today = moment();

      // Disable specific date range: 3-7 days from today
      const disabledDatesStart = moment().date(today.date() + 3);
      const disabledDatesEnd = moment().date(today.date() + 7);

      // Disable specific week range: 5 weeks ago to 2 weeks ago
      const disabledWeeksStart = moment().week(today.week() - 5);
      const disabledWeeksEnd = moment().week(today.week() - 2);

      // Disable specific month range: 5 months ago to 1 month ago
      const disabledMonthsStart = moment().month(today.month() - 5);
      const disabledMonthsEnd = moment().month(today.month() - 1);

      // Disable specific year range: 20 years ago to 1 year ago
      const disabledYearsStart = moment().year(today.year() - 20);
      const disabledYearsEnd = moment().year(today.year() - 1);

      // Min/Max date constraints
      const minDate = moment().subtract(30, 'days');
      const maxDate = moment().add(30, 'days');

      // Disable functions
      const isDateDisabled = (target: DateType): boolean =>
        moment(target).isBetween(
          disabledDatesStart,
          disabledDatesEnd,
          'day',
          '[]',
        );

      const isWeekDisabled = (target: DateType): boolean =>
        moment(target).isBetween(
          disabledWeeksStart,
          disabledWeeksEnd,
          'week',
          '[]',
        );

      const isMonthDisabled = (target: DateType): boolean =>
        moment(target).isBetween(
          disabledMonthsStart,
          disabledMonthsEnd,
          'month',
          '[]',
        );

      const isYearDisabled = (target: DateType): boolean =>
        moment(target).isBetween(
          disabledYearsStart,
          disabledYearsEnd,
          'year',
          '[]',
        );

      const isQuarterDisabled = (target: DateType): boolean => {
        const q = moment(target).quarter();
        const y = moment(target).year();

        // Disable Q1 and Q2 of current year
        return y === today.year() && (q === 1 || q === 2);
      };

      const isHalfYearDisabled = (target: DateType): boolean => {
        const h = Math.ceil(moment(target).quarter() / 2);
        const y = moment(target).year();

        // Disable H1 of current year
        return y === today.year() && h === 1;
      };

      // Min/Max constraint
      const isDateOutOfRange = (target: DateType): boolean =>
        moment(target).isBefore(minDate, 'day') ||
        moment(target).isAfter(maxDate, 'day');

      return {
        containerStyle: { margin: '0 0 32px 0' },
        dayRangeText: `Day: Disable ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`,
        format: (mode: CalendarMode) => getDefaultModeFormat(mode),
        headingStyle: { margin: '0 0 16px 0' },
        isDateDisabled,
        isDateOutOfRange,
        isHalfYearDisabled,
        isMonthDisabled,
        isQuarterDisabled,
        isWeekDisabled,
        isYearDisabled,
        minMaxText: `Only allow dates within a specific range.
Available range: ${minDate.format('YYYY-MM-DD')} ~ ${maxDate.format('YYYY-MM-DD')} (±30 days from today)`,
        monthRangeText: `Month: Disable ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`,
        onChangeD,
        onChangeH,
        onChangeM,
        onChangeMinMax,
        onChangeQ,
        onChangeW,
        onChangeY,
        sectionStyle: {
          margin: '0 0 48px 0',
          padding: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        },
        typoStyle: {
          margin: '0 0 12px 0',
          whiteSpace: 'pre-line',
        } as CSSProperties,
        valD,
        valH,
        valM,
        valMinMax,
        valQ,
        valW,
        valY,
        weekRangeText: `Week: Disable ${disabledWeeksStart.format('YYYY-MM-DD')} ~ ${disabledWeeksEnd.format('YYYY-MM-DD')}`,
        yearRangeText: `Year: Disable ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">1. Disable Navigation Controls</MznTypography>
          <MznTypography variant="body" :style="typoStyle">
            Disable month/year switching buttons and navigation arrows. Useful
            when you want to restrict user to current view only.
          </MznTypography>
          <MznDatePicker
            :value="valD"
            mode="day"
            format="YYYY-MM-DD"
            full-width
            placeholder="Date"
            disabled-month-switch
            disabled-year-switch
            disable-on-next
            disable-on-double-next
            disable-on-prev
            disable-on-double-prev
            @change="onChangeD"
          />
        </div>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">2. Min/Max Date Range</MznTypography>
          <MznTypography variant="body" :style="typoStyle">{{ minMaxText }}</MznTypography>
          <MznDatePicker
            :value="valMinMax"
            mode="day"
            format="YYYY-MM-DD"
            full-width
            placeholder="Date"
            :is-date-disabled="isDateOutOfRange"
            @change="onChangeMinMax"
          />
        </div>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">3. Mode-specific Disable Examples</MznTypography>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">{{ dayRangeText }}</MznTypography>
            <MznDatePicker
              :value="valD"
              mode="day"
              :format="format('day')"
              placeholder="Date"
              :is-date-disabled="isDateDisabled"
              @change="onChangeD"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">{{ weekRangeText }}</MznTypography>
            <MznDatePicker
              :value="valW"
              mode="week"
              :format="format('week')"
              placeholder="Week"
              :is-week-disabled="isWeekDisabled"
              @change="onChangeW"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">{{ monthRangeText }}</MznTypography>
            <MznDatePicker
              :value="valM"
              mode="month"
              :format="format('month')"
              placeholder="Month"
              :is-month-disabled="isMonthDisabled"
              @change="onChangeM"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">{{ yearRangeText }}</MznTypography>
            <MznDatePicker
              :value="valY"
              mode="year"
              :format="format('year')"
              placeholder="Year"
              :is-year-disabled="isYearDisabled"
              @change="onChangeY"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">Quarter: Disable Q1 and Q2 of current year</MznTypography>
            <MznDatePicker
              :value="valQ"
              mode="quarter"
              :format="format('quarter')"
              placeholder="Quarter"
              :is-quarter-disabled="isQuarterDisabled"
              @change="onChangeQ"
            />
          </div>

          <div :style="containerStyle">
            <MznTypography variant="h3" :style="typoStyle">Half Year: Disable H1 of current year</MznTypography>
            <MznDatePicker
              :value="valH"
              mode="half-year"
              :format="format('half-year')"
              placeholder="Half Year"
              :is-half-year-disabled="isHalfYearDisabled"
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
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [valAnnotation, onChangeAnnotation] = usePickerChange();
      const valQuickSelect = ref<DateType | undefined>();
      const onChangeQuickSelect = (v?: DateType): void => {
        valQuickSelect.value = v;
      };

      const annotationData: Record<
        string,
        {
          value: string;
          color:
            | 'text-success'
            | 'text-error'
            | 'text-warning'
            | 'text-neutral';
        }
      > = {
        [moment().format('YYYY-MM-DD')]: {
          value: '+5.2%',
          color: 'text-success',
        },
        [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
          value: '-3.1%',
          color: 'text-error',
        },
        [moment().subtract(2, 'days').format('YYYY-MM-DD')]: {
          value: '+1.8%',
          color: 'text-warning',
        },
        [moment().subtract(3, 'days').format('YYYY-MM-DD')]: {
          value: '+8.4%',
          color: 'text-success',
        },
        [moment().subtract(4, 'days').format('YYYY-MM-DD')]: {
          value: '-7.2%',
          color: 'text-error',
        },
        [moment().add(1, 'days').format('YYYY-MM-DD')]: {
          value: '+2.1%',
          color: 'text-warning',
        },
        [moment().add(2, 'days').format('YYYY-MM-DD')]: {
          value: '-0.5%',
          color: 'text-neutral',
        },
        [moment().add(3, 'days').format('YYYY-MM-DD')]: {
          value: '+6.7%',
          color: 'text-success',
        },
      };

      // Quick select options
      const quickSelectOptions = [
        {
          id: 'today',
          name: 'Today',
          onClick: () => onChangeQuickSelect(moment().toISOString()),
        },
        {
          id: 'yesterday',
          name: 'Yesterday',
          onClick: () =>
            onChangeQuickSelect(moment().subtract(1, 'day').toISOString()),
        },
        {
          id: 'lastWeek',
          name: 'Last Week',
          disabled: true,
          onClick: () =>
            onChangeQuickSelect(moment().subtract(7, 'days').toISOString()),
        },
        {
          id: 'lastMonth',
          name: 'Last Month',
          onClick: () =>
            onChangeQuickSelect(moment().subtract(1, 'month').toISOString()),
        },
      ];

      const getQuickSelectActiveId = (val?: DateType): string | undefined => {
        if (!val) return undefined;

        const selected = moment(val);
        const today = moment();

        if (selected.isSame(today, 'day')) return 'today';
        if (selected.isSame(today.clone().subtract(1, 'day'), 'day'))
          return 'yesterday';
        if (selected.isSame(today.clone().subtract(7, 'days'), 'day'))
          return 'lastWeek';
        if (selected.isSame(today.clone().subtract(1, 'month'), 'day'))
          return 'lastMonth';

        return undefined;
      };

      return {
        annotationCalendarProps: {
          renderAnnotations: (date: DateType) =>
            annotationData[moment(date).format('YYYY-MM-DD')],
        },
        containerStyle: { margin: '0 0 32px 0' },
        headingStyle: { margin: '0 0 16px 0' },
        onChangeAnnotation,
        onChangeQuickSelect,
        quickSelectCalendarProps: computed(() => ({
          quickSelect: {
            activeId: getQuickSelectActiveId(valQuickSelect.value),
            options: quickSelectOptions,
          },
        })),
        sectionStyle: {
          margin: '0 0 48px 0',
          padding: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
        },
        selectedText: computed(
          () =>
            `Selected: ${valQuickSelect.value ? moment(valQuickSelect.value).format('YYYY-MM-DD') : 'None'}`,
        ),
        typoStyle: {
          margin: '0 0 12px 0',
          whiteSpace: 'pre-line',
        } as CSSProperties,
        valAnnotation,
        valQuickSelect,
      };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">1. Date Annotations (renderAnnotations)</MznTypography>
          <MznTypography variant="body" :style="typoStyle">
            Display additional information on each date cell via calendarProps.
            Perfect for showing metrics, events, or status indicators.
          </MznTypography>
          <div :style="containerStyle">
            <MznTypography variant="body" :style="typoStyle">Example: Stock market daily changes</MznTypography>
            <MznDatePicker
              :value="valAnnotation"
              mode="day"
              format="YYYY-MM-DD"
              placeholder="Date"
              :calendar-props="annotationCalendarProps"
              @change="onChangeAnnotation"
            />
          </div>
        </div>
        <div :style="sectionStyle">
          <MznTypography variant="h2" :style="headingStyle">2. Quick Select Options</MznTypography>
          <MznTypography variant="body" :style="typoStyle">
            Provide shortcut buttons for commonly selected dates via
            calendarProps. Great for improving UX in dashboards and reports.
          </MznTypography>
          <div :style="containerStyle">
            <MznTypography variant="body" :style="typoStyle">{{ selectedText }}</MznTypography>
            <MznDatePicker
              :value="valQuickSelect"
              mode="day"
              format="YYYY-MM-DD"
              placeholder="Date"
              :calendar-props="quickSelectCalendarProps"
              @change="onChangeQuickSelect"
            />
          </div>
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

/**
 * Regression guard for DatePicker rendered inside a Modal: because the Modal
 * body has `overflow: hidden` / `overflow-y: auto`, the calendar popper must
 * portal out of the modal DOM subtree so it can visually overflow the modal
 * bounds when anchored near the bottom. The trigger is deliberately placed at
 * the end of a tall body so the dropdown would otherwise be clipped.
 */
export const InsideModal: Story = {
  render: () => ({
    components: {
      MznButton,
      MznCalendarConfigProviderMoment,
      MznDatePicker,
      MznModal,
      MznTypography,
    },
    setup: () => {
      const open = ref(false);
      const [val, onChange] = usePickerChange();

      return { onChange, open, typoStyle: { margin: '0 0 12px 0' }, val };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <MznButton variant="base-primary" @click="open = true">Open Modal</MznButton>
        <MznModal
          cancel-text="Cancel"
          confirm-text="OK"
          modal-type="standard"
          :open="open"
          show-modal-footer
          show-modal-header
          size="regular"
          title="DatePicker inside Modal"
          @cancel="open = false"
          @close="open = false"
          @confirm="open = false"
        >
          <div
            style="display: flex; flex-direction: column; height: 360px; justify-content: flex-end"
          >
            <MznTypography :style="typoStyle" variant="body">
              The calendar popper should visually overflow the modal bounds.
            </MznTypography>
            <MznDatePicker placeholder="選擇日期" :value="val" @change="onChange" />
          </div>
        </MznModal>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};

/**
 * Regression guard for DatePicker anchored near the bottom edge of the
 * viewport: floating-ui's `flip` middleware must detect insufficient bottom
 * space and render the calendar above the trigger instead of clipping it.
 */
export const NearViewportEdge: Story = {
  render: () => ({
    components: {
      MznCalendarConfigProviderMoment,
      MznDatePicker,
      MznTypography,
    },
    setup: () => {
      const [val, onChange] = usePickerChange();

      return { onChange, typoStyle: { margin: '0 0 12px 0' }, val };
    },
    template: `
      <MznCalendarConfigProviderMoment>
        <div
          style="display: flex; flex-direction: column; height: 100vh; justify-content: flex-end; padding: 16px"
        >
          <MznTypography :style="typoStyle" variant="body">
            Trigger sits at the bottom edge — calendar should flip upward.
          </MznTypography>
          <MznDatePicker placeholder="選擇日期" :value="val" @change="onChange" />
        </div>
      </MznCalendarConfigProviderMoment>
    `,
  }),
};
