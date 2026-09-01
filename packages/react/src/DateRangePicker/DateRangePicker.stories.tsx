import { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import {
  CSSProperties,
  Profiler,
  ProfilerOnRenderCallback,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import moment from 'moment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import DateRangePicker from '.';
import { DateRangePickerProps } from './DateRangePicker';
import Typography from '../Typography';
import {
  CalendarConfigProviderDayjs,
  CalendarConfigProviderLuxon,
  CalendarConfigProviderMoment,
} from '../Calendar';

const meta: Meta<typeof DateRangePicker> = {
  component: DateRangePicker,
  title: 'Data Entry/DateRangePicker',
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

function usePickerChange() {
  const [val, setVal] = useState<RangePickerValue>();
  const onChange = (v?: RangePickerValue) => {
    setVal(v);
  };

  return [val, onChange] as const;
}

const getUpperCase = (mode: CalendarMode) =>
  mode.charAt(0).toUpperCase() + mode.slice(1);

type PlaygroundArgs = DateRangePickerProps;

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
  render: function Playground({
    clearable,
    disabled,
    error,
    fullWidth,
    inputFromPlaceholder,
    inputToPlaceholder,
    mode = 'day',
    readOnly,
    size,
    confirmMode,
  }: PlaygroundArgs) {
    const [val, onChange] = usePickerChange();

    return (
      <CalendarConfigProviderDayjs locale="zh-TW">
        <Typography style={typoStyle} variant="h3">
          {getUpperCase(mode)}
        </Typography>
        <Typography style={typoStyle} variant="body">
          {`current value: [${val?.[0] || ''}, ${val?.[1] || ''}]`}
        </Typography>
        <Typography style={typoStyle} variant="body">
          {`format: [${formatWithHalfYear(val?.[0], mode)}, ${formatWithHalfYear(val?.[1], mode)}]`}
        </Typography>
        <DateRangePicker
          clearable={clearable}
          disabled={disabled}
          error={error}
          format={getDefaultModeFormat(mode)}
          fullWidth={fullWidth}
          inputFromPlaceholder={inputFromPlaceholder}
          inputToPlaceholder={inputToPlaceholder}
          mode={mode}
          onChange={onChange}
          readOnly={readOnly}
          size={size}
          confirmMode={confirmMode}
          value={val}
        />
      </CalendarConfigProviderDayjs>
    );
  },
};

export const Basic: Story = {
  render: function Basic() {
    const [val, onChange] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Normal
          </Typography>
          <DateRangePicker onChange={onChange} value={val} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Disabled
          </Typography>
          <DateRangePicker
            disabled
            value={[
              moment().toISOString(),
              moment().add(7, 'days').toISOString(),
            ]}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Error
          </Typography>
          <DateRangePicker
            error
            value={[
              moment().toISOString(),
              moment().add(7, 'days').toISOString(),
            ]}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Read only
          </Typography>
          <DateRangePicker
            readOnly
            value={[
              moment().toISOString(),
              moment().add(7, 'days').toISOString(),
            ]}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const Method: Story = {
  render: function Method() {
    const [valMoment, onChangeMoment] = usePickerChange();
    const [valDayjs, onChangeDayjs] = usePickerChange();
    const [valLuxon, onChangeLuxon] = usePickerChange();

    return (
      <>
        <CalendarConfigProviderMoment>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsMoment
            </Typography>
            <DateRangePicker onChange={onChangeMoment} value={valMoment} />
          </div>
        </CalendarConfigProviderMoment>
        <CalendarConfigProviderDayjs>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsDayjs
            </Typography>
            <DateRangePicker onChange={onChangeDayjs} value={valDayjs} />
          </div>
        </CalendarConfigProviderDayjs>
        <CalendarConfigProviderLuxon>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsLuxon
            </Typography>
            <DateRangePicker onChange={onChangeLuxon} value={valLuxon} />
          </div>
        </CalendarConfigProviderLuxon>
      </>
    );
  },
};

export const Sizes: Story = {
  render: function Sizes() {
    const [valMain, onChangeMain] = usePickerChange();
    const [valSub, onChangeSub] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: Main
          </Typography>
          <DateRangePicker
            onChange={onChangeMain}
            size="main"
            value={valMain}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: Sub
          </Typography>
          <DateRangePicker onChange={onChangeSub} size="sub" value={valSub} />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const Modes: Story = {
  render: function Modes() {
    const [valD, onChangeD] = usePickerChange();
    const [valW, onChangeW] = usePickerChange();
    const [valM, onChangeM] = usePickerChange();
    const [valY, onChangeY] = usePickerChange();
    const [valQ, onChangeQ] = usePickerChange();
    const [valH, onChangeH] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Day
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valD?.[0] || ''}, ${valD?.[1] || ''}]
format value: [${valD?.[0] ? moment(valD[0]).format(getDefaultModeFormat('day')) : ''}, ${valD?.[1] ? moment(valD[1]).format(getDefaultModeFormat('day')) : ''}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('day')}
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            mode="day"
            onChange={onChangeD}
            value={valD}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Week
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valW?.[0] || ''}, ${valW?.[1] || ''}]
format value: [${valW?.[0] ? moment(valW[0]).format(getDefaultModeFormat('week')) : ''}, ${valW?.[1] ? moment(valW[1]).format(getDefaultModeFormat('week')) : ''}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('week')}
            inputFromPlaceholder="Start Week"
            inputToPlaceholder="End Week"
            mode="week"
            onChange={onChangeW}
            value={valW}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Month
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valM?.[0] || ''}, ${valM?.[1] || ''}]
format value: [${valM?.[0] ? moment(valM[0]).format(getDefaultModeFormat('month')) : ''}, ${valM?.[1] ? moment(valM[1]).format(getDefaultModeFormat('month')) : ''}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('month')}
            inputFromPlaceholder="Start Month"
            inputToPlaceholder="End Month"
            mode="month"
            onChange={onChangeM}
            value={valM}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Year
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valY?.[0] || ''}, ${valY?.[1] || ''}]
format value: [${valY?.[0] ? moment(valY[0]).format(getDefaultModeFormat('year')) : ''}, ${valY?.[1] ? moment(valY[1]).format(getDefaultModeFormat('year')) : ''}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('year')}
            inputFromPlaceholder="Start Year"
            inputToPlaceholder="End Year"
            mode="year"
            onChange={onChangeY}
            value={valY}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Quarter
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valQ?.[0] || ''}, ${valQ?.[1] || ''}]
format value: [${valQ?.[0] ? moment(valQ[0]).format(getDefaultModeFormat('quarter')) : ''}, ${valQ?.[1] ? moment(valQ[1]).format(getDefaultModeFormat('quarter')) : ''}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('quarter')}
            inputFromPlaceholder="Start Quarter"
            inputToPlaceholder="End Quarter"
            mode="quarter"
            onChange={onChangeQ}
            value={valQ}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Half Year
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`origin value: [${valH?.[0] || ''}, ${valH?.[1] || ''}]
format value: [${formatWithHalfYear(valH?.[0], 'half-year')}, ${formatWithHalfYear(valH?.[1], 'half-year')}]`}
          </Typography>
          <DateRangePicker
            format={getDefaultModeFormat('half-year')}
            inputFromPlaceholder="Start Half Year"
            inputToPlaceholder="End Half Year"
            mode="half-year"
            onChange={onChangeH}
            value={valH}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const CustomDisable: Story = {
  render: function CustomDisable() {
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

    const isDateDisabled = (target: DateType) =>
      moment(target).isBetween(
        disabledDatesStart,
        disabledDatesEnd,
        'day',
        '[]',
      );

    const isWeekDisabled = (target: DateType) =>
      moment(target).isBetween(
        disabledWeeksStart,
        disabledWeeksEnd,
        'week',
        '[]',
      );

    const isMonthDisabled = (target: DateType) =>
      moment(target).isBetween(
        disabledMonthsStart,
        disabledMonthsEnd,
        'month',
        '[]',
      );

    const isYearDisabled = (target: DateType) =>
      moment(target).isBetween(
        disabledYearsStart,
        disabledYearsEnd,
        'year',
        '[]',
      );

    const isQuarterDisabled = (target: DateType) => {
      const q = moment(target).quarter();
      const y = moment(target).year();
      // Disable Q1 and Q2 of current year
      return y === today.year() && (q === 1 || q === 2);
    };

    const isHalfYearDisabled = (target: DateType) => {
      const h = Math.ceil(moment(target).quarter() / 2);
      const y = moment(target).year();
      // Disable H1 of current year
      return y === today.year() && h === 1;
    };

    return (
      <CalendarConfigProviderMoment>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            1. Disable Navigation Controls
          </Typography>
          <Typography style={typoStylePre} variant="body">
            Disable month/year switching buttons and navigation arrows. Useful
            when you want to restrict user to current view only.
          </Typography>
          <DateRangePicker
            disabledMonthSwitch
            disabledYearSwitch
            disableOnDoubleNext
            disableOnDoublePrev
            disableOnNext
            disableOnPrev
            format="YYYY-MM-DD"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            mode="day"
            onChange={onChangeNav}
            value={valNav}
          />
        </div>

        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            2. Mode-specific Disable Examples
          </Typography>
          <Typography style={typoStylePre} variant="body">
            When selecting a range that crosses disabled dates, the range will
            be blocked and selection will restart.
          </Typography>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              {`Day: Disable ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`}
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('day')}
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              isDateDisabled={isDateDisabled}
              mode="day"
              onChange={onChangeD}
              value={valD}
            />
          </div>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              {`Week: Disable ${disabledWeeksStart.format(getDefaultModeFormat('week'))} ~ ${disabledWeeksEnd.format(getDefaultModeFormat('week'))}`}
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('week')}
              inputFromPlaceholder="Start Week"
              inputToPlaceholder="End Week"
              isWeekDisabled={isWeekDisabled}
              mode="week"
              onChange={onChangeW}
              value={valW}
            />
          </div>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              {`Month: Disable ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`}
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('month')}
              inputFromPlaceholder="Start Month"
              inputToPlaceholder="End Month"
              isMonthDisabled={isMonthDisabled}
              mode="month"
              onChange={onChangeM}
              value={valM}
            />
          </div>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              {`Year: Disable ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`}
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('year')}
              inputFromPlaceholder="Start Year"
              inputToPlaceholder="End Year"
              isYearDisabled={isYearDisabled}
              mode="year"
              onChange={onChangeY}
              value={valY}
            />
          </div>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              Quarter: Disable Q1 and Q2 of current year
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('quarter')}
              inputFromPlaceholder="Start Quarter"
              inputToPlaceholder="End Quarter"
              isQuarterDisabled={isQuarterDisabled}
              mode="quarter"
              onChange={onChangeQ}
              value={valQ}
            />
          </div>

          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="h3">
              Half Year: Disable H1 of current year
            </Typography>
            <DateRangePicker
              format={getDefaultModeFormat('half-year')}
              inputFromPlaceholder="Start Half Year"
              inputToPlaceholder="End Half Year"
              isHalfYearDisabled={isHalfYearDisabled}
              mode="half-year"
              onChange={onChangeH}
              value={valH}
            />
          </div>
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const CalendarIntegration: Story = {
  render: function CalendarIntegration() {
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
        color: 'text-error' | 'text-neutral' | 'text-success' | 'text-warning';
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
      if (startMoment.isSame(today, 'day') && endMoment.isSame(today, 'day')) {
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

    return (
      <CalendarConfigProviderMoment>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            1. Date Annotations (renderAnnotations)
          </Typography>
          <Typography style={typoStylePre} variant="body">
            Display additional information on each date cell via calendarProps.
            Perfect for showing metrics, events, or status indicators.
          </Typography>
          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="body">
              Example: Stock market daily changes
            </Typography>
            <DateRangePicker
              renderAnnotations={(date: DateType) => {
                const dateKey = moment(date).format('YYYY-MM-DD');
                return annotationData[dateKey];
              }}
              format="YYYY-MM-DD"
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              mode="day"
              onChange={onChangeAnnotation}
              value={valAnnotation}
            />
          </div>
        </div>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            2. Quick Select Options
          </Typography>
          <Typography style={typoStylePre} variant="body">
            Provide shortcut buttons for commonly selected date ranges. Great
            for improving UX in dashboards and reports.
          </Typography>
          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="body">
              {`Selected: [${valQuickSelect?.[0] ? moment(valQuickSelect[0]).format('YYYY-MM-DD') : ''}, ${valQuickSelect?.[1] ? moment(valQuickSelect[1]).format('YYYY-MM-DD') : ''}]`}
            </Typography>
            <DateRangePicker
              format="YYYY-MM-DD"
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              mode="day"
              onChange={onChangeQuickSelect}
              quickSelect={{
                activeId: getQuickSelectActiveId(valQuickSelect),
                options: quickSelectOptions,
              }}
              value={valQuickSelect}
            />
          </div>
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const ConfirmMode: Story = {
  render: function ConfirmMode() {
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

    const [changeCount, setChangeCount] = useState(0);
    const [manualChangeCount, setManualChangeCount] = useState(0);

    const handleImmediateChange = (v?: RangePickerValue) => {
      onChangeImmediate(v);
      if (v && v[0] && v[1]) {
        setChangeCount((c) => c + 1);
      }
    };

    const handleManualChange = (v?: RangePickerValue) => {
      onChangeManual(v);
      if (v && v[0] && v[1]) {
        setManualChangeCount((c) => c + 1);
      }
    };

    return (
      <CalendarConfigProviderMoment>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            1. Immediate Mode (Default)
          </Typography>
          <Typography style={typoStylePre} variant="body">
            {`confirmMode="immediate" (default behavior)
- onChange is triggered immediately after selecting both dates
- Calendar auto-closes after range selection
- onChange triggered count: ${changeCount}`}
          </Typography>
          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="body">
              {`Selected: [${valImmediate?.[0] ? moment(valImmediate[0]).format('YYYY-MM-DD') : ''}, ${valImmediate?.[1] ? moment(valImmediate[1]).format('YYYY-MM-DD') : ''}]`}
            </Typography>
            <DateRangePicker
              confirmMode="immediate"
              format="YYYY-MM-DD"
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              mode="day"
              onChange={handleImmediateChange}
              value={valImmediate}
            />
          </div>
        </div>

        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            2. Manual Mode
          </Typography>
          <Typography style={typoStylePre} variant="body">
            {`confirmMode="manual"
- Auto-generates Confirm/Cancel buttons
- onChange is only triggered when clicking "Confirm"
- Confirm button is disabled until both dates are selected
- onChange triggered count: ${manualChangeCount}`}
          </Typography>
          <div style={containerStyle}>
            <Typography style={typoStylePre} variant="body">
              {`Selected: [${valManual?.[0] ? moment(valManual[0]).format('YYYY-MM-DD') : ''}, ${valManual?.[1] ? moment(valManual[1]).format('YYYY-MM-DD') : ''}]`}
            </Typography>
            <DateRangePicker
              actions={{
                primaryButtonProps: {
                  children: '確定',
                },
                secondaryButtonProps: {
                  children: '取消',
                },
              }}
              confirmMode="manual"
              format="YYYY-MM-DD"
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              mode="day"
              onChange={handleManualChange}
              value={valManual}
            />
          </div>
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

/* -------------------------------------------------------------------------- *
 * Issue #460 — https://github.com/Mezzanine-UI/mezzanine/issues/460
 *
 * `DateRangePicker` used to walk the selected range one day at a time, six
 * times per render (once per granularity), even with no disabled-date
 * predicate supplied. The two stories below make both sides of the fix
 * observable: `RangeScanPerformance` measures the cost, and
 * `DisabledInRangeBehavior` shows the one semantic change the fix introduces.
 * -------------------------------------------------------------------------- */

const issue460BaselineKey = 'mzn-issue-460-baseline';

/** Flipped to false once localStorage proves unavailable, so we stop retrying. */
let issue460StorageAvailable = true;

interface Issue460Measurement {
  predicateCalls: number;
  renders: number;
  worstCommit: number;
}

type Issue460Baseline = Record<string, Issue460Measurement>;

const issue460EmptyMeasurement: Issue460Measurement = {
  predicateCalls: 0,
  renders: 0,
  worstCommit: 0,
};

function readIssue460Baseline(): Issue460Baseline {
  if (!issue460StorageAvailable) return {};

  try {
    const raw = window.localStorage.getItem(issue460BaselineKey);

    return raw ? (JSON.parse(raw) as Issue460Baseline) : {};
  } catch {
    issue460StorageAvailable = false;

    return {};
  }
}

function writeIssue460Baseline(next: Issue460Baseline) {
  if (!issue460StorageAvailable) return;

  try {
    window.localStorage.setItem(issue460BaselineKey, JSON.stringify(next));
  } catch {
    issue460StorageAvailable = false;
  }
}

const issue460RangeEnd = '2026-08-31';

const issue460Ranges = [
  { days: 30, from: '2026-08-01', label: '1 month', to: issue460RangeEnd },
  { days: 364, from: '2025-09-01', label: '1 year', to: issue460RangeEnd },
  { days: 1825, from: '2021-09-01', label: '5 years', to: issue460RangeEnd },
  { days: 7304, from: '2006-09-01', label: '20 years', to: issue460RangeEnd },
  {
    days: 730455,
    from: '2026-08-31',
    label: 'mistyped 4026',
    to: '4026-08-01',
  },
] as const;

const issue460Modes: CalendarMode[] = ['day', 'week', 'month', 'year'];

const issue460PanelStyle: CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  margin: '0 0 24px 0',
  padding: '16px',
};

const issue460CellStyle: CSSProperties = {
  borderBottom: '1px solid #eee',
  padding: '4px 12px 4px 0',
  textAlign: 'right',
};

const issue460LabelCellStyle: CSSProperties = {
  ...issue460CellStyle,
  textAlign: 'left',
};

function formatIssue460Delta(current: number, baseline?: number) {
  if (baseline === undefined) return '—';
  if (baseline === 0) return current === 0 ? '±0' : `+${current}`;

  const ratio = ((current - baseline) / baseline) * 100;

  return `${ratio > 0 ? '+' : ''}${ratio.toFixed(1)}%`;
}

export const RangeScanPerformance: Story = {
  render: function RangeScanPerformance() {
    const [baseline, setBaseline] = useState<Issue460Baseline>(() =>
      readIssue460Baseline(),
    );
    const [mode, setMode] = useState<CalendarMode>('day');
    const [rangeLabel, setRangeLabel] = useState<string>(
      issue460Ranges[0].label,
    );
    const [snapshot, setSnapshot] = useState<Issue460Measurement>(
      issue460EmptyMeasurement,
    );
    const [withPredicate, setWithPredicate] = useState(false);

    const predicateCallsRef = useRef(0);
    const rendersRef = useRef(0);
    const worstCommitRef = useRef(0);

    const range =
      issue460Ranges.find((item) => item.label === rangeLabel) ??
      issue460Ranges[0];
    const scenarioKey = `${rangeLabel}|${mode}|${withPredicate ? 'with' : 'without'}`;
    const recordedBaseline = baseline[scenarioKey];

    const resetMeters = useCallback(() => {
      predicateCallsRef.current = 0;
      rendersRef.current = 0;
      worstCommitRef.current = 0;
      setSnapshot(issue460EmptyMeasurement);
    }, []);

    const onProfilerRender = useCallback<ProfilerOnRenderCallback>(
      (_id, _phase, actualDuration) => {
        rendersRef.current += 1;

        if (actualDuration > worstCommitRef.current) {
          worstCommitRef.current = actualDuration;
        }
      },
      [],
    );

    /**
     * Poll the meters instead of pushing them from the Profiler callback,
     * which would feed straight back into the render loop. Returning the
     * previous object unchanged lets React bail out, so this settles as soon
     * as the numbers stop moving — and it keeps picking up work driven from
     * inside the calendar, not just from the controls above.
     */
    useEffect(() => {
      const timer = window.setInterval(() => {
        setSnapshot((previous) =>
          previous.predicateCalls === predicateCallsRef.current &&
          previous.renders === rendersRef.current &&
          previous.worstCommit === worstCommitRef.current
            ? previous
            : {
                predicateCalls: predicateCallsRef.current,
                renders: rendersRef.current,
                worstCommit: worstCommitRef.current,
              },
        );
      }, 500);

      return () => window.clearInterval(timer);
    }, []);

    /** Always returns false, so the scan runs to completion — the worst case. */
    const countingPredicate = useCallback((_target: DateType) => {
      predicateCallsRef.current += 1;

      return false;
    }, []);

    const predicateProps = withPredicate
      ? {
          isDateDisabled: countingPredicate,
          isHalfYearDisabled: countingPredicate,
          isMonthDisabled: countingPredicate,
          isQuarterDisabled: countingPredicate,
          isWeekDisabled: countingPredicate,
          isYearDisabled: countingPredicate,
        }
      : {};

    const onRecordBaseline = () => {
      const next = { ...baseline, [scenarioKey]: snapshot };

      setBaseline(next);
      writeIssue460Baseline(next);
    };

    const onClearBaseline = () => {
      setBaseline({});
      writeIssue460Baseline({});
    };

    const rows = [
      {
        baselineValue: recordedBaseline?.worstCommit,
        currentValue: snapshot.worstCommit,
        format: (value: number) => `${value.toFixed(1)} ms`,
        label: '最差 commit',
      },
      {
        baselineValue: recordedBaseline?.renders,
        currentValue: snapshot.renders,
        format: (value: number) => `${value}`,
        label: 'render 次數',
      },
      {
        baselineValue: recordedBaseline?.predicateCalls,
        currentValue: snapshot.predicateCalls,
        format: (value: number) => value.toLocaleString(),
        label: 'predicate 呼叫次數',
      },
    ];

    return (
      <CalendarConfigProviderLuxon locale="zh-TW">
        <Typography style={typoStyle} variant="h3">
          Issue #460 — range scan performance
        </Typography>
        <Typography style={typoStyle} variant="body">
          選一個區間 → 量測會在 0.5 秒後定格 → 按「📌 記錄為 baseline」。 在
          <b>修正前</b>的程式碼上把每個情境都記錄一次，套用修正後 HMR 重載，
          baseline 欄會保留舊數字，current 欄變成修正後，Δ 直接可讀。
        </Typography>

        <div style={issue460PanelStyle}>
          <Typography style={typoStyle} variant="body-highlight">
            1. 區間
          </Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {issue460Ranges.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setRangeLabel(item.label);
                  resetMeters();
                }}
                style={{
                  background:
                    item.label === rangeLabel ? '#1976d2' : 'transparent',
                  border: '1px solid #1976d2',
                  borderRadius: '4px',
                  color: item.label === rangeLabel ? '#fff' : '#1976d2',
                  cursor: 'pointer',
                  padding: '6px 12px',
                }}
                type="button"
              >
                {item.label} ({item.days.toLocaleString()} 天)
              </button>
            ))}
          </div>
          <Typography style={{ margin: '8px 0 0 0' }} variant="caption">
            ⚠️ 「mistyped 4026」在<b>修正前</b>會讓分頁凍結數十秒（730,455 天 ×
            6 次掃描）。這正是 issue 描述的鍵盤誤植情境。
          </Typography>
        </div>

        <div style={issue460PanelStyle}>
          <Typography style={typoStyle} variant="body-highlight">
            2. mode 與 predicate
          </Typography>
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <label htmlFor="issue460-mode">
              mode:{' '}
              <select
                id="issue460-mode"
                onChange={(event) => {
                  setMode(event.target.value as CalendarMode);
                  resetMeters();
                }}
                value={mode}
              >
                {issue460Modes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="issue460-predicate">
              <input
                checked={withPredicate}
                id="issue460-predicate"
                onChange={(event) => {
                  setWithPredicate(event.target.checked);
                  resetMeters();
                }}
                type="checkbox"
              />{' '}
              傳入 disabled predicate（永遠回傳 false，讓掃描跑滿）
            </label>
            <button onClick={resetMeters} type="button">
              重設量測
            </button>
          </div>
          <Typography style={{ margin: '8px 0 0 0' }} variant="caption">
            不勾 predicate = 大多數消費端的情況；修正後這條路徑應完全不掃描。
            勾起來則展示逐單位步進 + 掃描上限的效果（例如 20 years 在 year mode
            下，呼叫次數應從 7,304 掉到數十次）。
          </Typography>
        </div>

        <div style={issue460PanelStyle}>
          <Typography style={typoStyle} variant="body-highlight">
            3. 量測：{scenarioKey}
          </Typography>
          <table style={{ borderCollapse: 'collapse', minWidth: '420px' }}>
            <thead>
              <tr>
                <th style={issue460LabelCellStyle}>指標</th>
                <th style={issue460CellStyle}>baseline</th>
                <th style={issue460CellStyle}>current</th>
                <th style={issue460CellStyle}>Δ</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <td style={issue460LabelCellStyle}>{row.label}</td>
                  <td style={issue460CellStyle}>
                    {row.baselineValue === undefined
                      ? '—'
                      : row.format(row.baselineValue)}
                  </td>
                  <td style={{ ...issue460CellStyle, fontWeight: 600 }}>
                    {row.format(row.currentValue)}
                  </td>
                  <td style={issue460CellStyle}>
                    {formatIssue460Delta(row.currentValue, row.baselineValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button onClick={onRecordBaseline} type="button">
              📌 記錄為 baseline
            </button>
            <button onClick={onClearBaseline} type="button">
              清除所有 baseline
            </button>
          </div>
        </div>

        <Profiler id="issue-460-picker" onRender={onProfilerRender}>
          <DateRangePicker
            {...predicateProps}
            format={getDefaultModeFormat(mode)}
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            mode={mode}
            value={[range.from, range.to] as RangePickerValue}
          />
        </Profiler>
      </CalendarConfigProviderLuxon>
    );
  },
};

const isSameIssue460Day = (target: DateType, isoDay: string) =>
  String(target).slice(0, 10) === isoDay;

const issue460BehaviorCases = [
  {
    after: '相同——完全不反白（不變）',
    before: '完全不反白',
    disabledDay: '2026-08-20',
    hint: '一般長度的區間，掃描走得完，判斷與修正前完全一致。',
    id: 'A',
    title: 'A. disabled 在區間內，區間長度在掃描上限內',
    value: ['2026-08-01', '2026-09-30'] as RangePickerValue,
  },
  {
    after: '正常反白，且瞬間完成 ← 唯一的語意變更',
    before: '完全不反白，但要先凍結分頁約 50 秒才畫得出來',
    disabledDay: '2040-01-01',
    hint: '這格是要謹慎評估的重點：區間超過掃描上限後，掃描會放棄並回報「找不到 disabled」，讓區間維持可用而不是被靜默封鎖。',
    id: 'B',
    title: 'B. 區間超過掃描上限（誤植成 4026）',
    value: ['2026-08-01', '4026-08-01'] as RangePickerValue,
  },
  {
    after: '相同——正常反白（不變）',
    before: '正常反白',
    disabledDay: undefined,
    hint: '沒有任何 predicate，就是絕大多數消費端的情況。',
    id: 'C',
    title: 'C. 完全沒有 disabled predicate',
    value: ['2026-08-01', '2027-06-30'] as RangePickerValue,
  },
] as const;

export const DisabledInRangeBehavior: Story = {
  render: function DisabledInRangeBehavior() {
    return (
      <CalendarConfigProviderLuxon locale="zh-TW">
        <Typography style={typoStyle} variant="h3">
          Issue #460 — 修正前後的行為差異
        </Typography>
        <Typography style={typoStyle} variant="body">
          點每一格的輸入框把月曆打開，對照下方標註的「修正前 / 修正後」預期。
          「區間跨越 disabled 日期就整段不反白」這條規則<b>仍然是全域判斷</b>，
          與點選時的守門一致，所以預覽不會亮著卻點不成。唯一的變化是加了
          <b>掃描步數上限</b>，情境 B 就是唯一會改變的地方。
        </Typography>

        {issue460BehaviorCases.map((item) => (
          <div key={item.id} style={issue460PanelStyle}>
            <Typography style={typoStyle} variant="body-highlight">
              {item.title}
            </Typography>
            <Typography style={typoStyle} variant="body">
              區間 <code>{item.value[0]}</code> → <code>{item.value[1]}</code>
              {item.disabledDay ? (
                <>
                  ，disabled <code>{item.disabledDay}</code>
                </>
              ) : (
                '，不傳任何 predicate'
              )}
            </Typography>
            <Typography style={typoStyle} variant="body">
              修正前：{item.before}
              <br />
              修正後：{item.after}
            </Typography>
            <Typography style={typoStyle} variant="caption">
              {item.hint}
            </Typography>
            <DateRangePicker
              format="YYYY-MM-DD"
              inputFromPlaceholder="Start Date"
              inputToPlaceholder="End Date"
              isDateDisabled={
                item.disabledDay
                  ? (target: DateType) =>
                      isSameIssue460Day(target, item.disabledDay)
                  : undefined
              }
              mode="day"
              value={item.value}
            />
          </div>
        ))}
      </CalendarConfigProviderLuxon>
    );
  },
};
