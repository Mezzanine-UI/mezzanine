import { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import { CSSProperties, useState } from 'react';
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
