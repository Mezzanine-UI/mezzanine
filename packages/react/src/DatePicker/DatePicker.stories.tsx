import { StoryFn, Meta } from '@storybook/react-webpack5';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import { CSSProperties, useState } from 'react';
import moment from 'moment';
import DatePicker, { DatePickerProps } from './DatePicker';
import Typography from '../Typography';
import { CalendarConfigProvider } from '../Calendar';

export default {
  title: 'Data Entry/DatePicker',
} as Meta;

function usePickerChange() {
  const [val, setVal] = useState<DateType | undefined>();
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = DatePickerProps;

export const Playground: StoryFn<PlaygroundArgs> = ({
  clearable,
  disabled,
  error,
  format,
  fullWidth,
  mode,
  placeholder,
  readOnly,
  size,
}) => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography variant="h3" style={typoStyle}>
        {`Value: ${val}`}
      </Typography>
      <DatePicker
        value={val}
        onChange={onChange}
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={format}
        fullWidth={fullWidth}
        mode={mode}
        placeholder={placeholder}
        readOnly={readOnly}
        size={size}
      />
    </CalendarConfigProvider>
  );
};

Playground.argTypes = {
  mode: {
    options: ['day', 'week', 'month', 'year'],
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
};

Playground.args = {
  clearable: false,
  disabled: false,
  error: false,
  format: 'YYYY-MM-DD',
  fullWidth: false,
  mode: 'day',
  placeholder: 'Start Date',
  readOnly: false,
  size: 'main',
};

export const Basic = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType | undefined>('2022-01-05');
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Normal
        </Typography>
        <DatePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled
        </Typography>
        <DatePicker value={new Date().toISOString()} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Error
        </Typography>
        <DatePicker value={new Date().toISOString()} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Read only
        </Typography>
        <DatePicker value={new Date().toISOString()} readOnly />
      </div>
    </CalendarConfigProvider>
  );
};

export const Method = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType | undefined>(
    new Date().toISOString(),
  );
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return (
    <>
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            CalendarMethodsMoment
          </Typography>
          <DatePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsDayjs}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            CalendarMethodsDayjs
          </Typography>
          <DatePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsLuxon}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            CalendarMethodsLuxon
          </Typography>
          <DatePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
    </>
  );
};

export const Sizes = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [valMain, onChangeMain] = usePickerChange();
  const [valSub, onChangeSub] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size: Main
        </Typography>
        <DatePicker value={valMain} onChange={onChangeMain} size="main" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Size: Sub
        </Typography>
        <DatePicker value={valSub} onChange={onChangeSub} size="sub" />
      </div>
    </CalendarConfigProvider>
  );
};

export const Modes = () => {
  const containerStyle = { margin: '0 0 32px 0' };
  const typoStyle = { margin: '0 0 8px 0' };
  const [valD, onChangeD] = usePickerChange();
  const [valW, onChangeW] = usePickerChange();
  const [valM, onChangeM] = usePickerChange();
  const [valY, onChangeY] = usePickerChange();
  const [valQ, onChangeQ] = usePickerChange();
  const [valH, onChangeH] = usePickerChange();

  // Helper function to format values with [H]n support
  const formatWithHalfYear = (value: DateType | undefined, mode: string) => {
    if (!value) return '';
    const format = getDefaultModeFormat(mode as any);
    const m = moment(value);

    // Handle [H]n format for half-year
    if (format === 'YYYY-[H]n') {
      const quarter = m.quarter();
      const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
      return m.format('YYYY') + '-H' + halfYear;
    }

    return m.format(format);
  };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Day
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valD || ''}
          format value: ${valD ? moment(valD).format(getDefaultModeFormat('day')) : ''}`}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format={getDefaultModeFormat('day')}
          placeholder="輸入日期"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Week
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valW || ''}
          format value: ${valW ? moment(valW).format(getDefaultModeFormat('week')) : ''}`}
        </Typography>
        <DatePicker
          value={valW}
          onChange={onChangeW}
          mode="week"
          format={getDefaultModeFormat('week')}
          placeholder="輸入日期"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Month
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valM || ''}
          format value: ${valM ? moment(valM).format(getDefaultModeFormat('month')) : ''}`}
        </Typography>
        <DatePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format={getDefaultModeFormat('month')}
          placeholder="輸入日期"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Year
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valY || ''}
          format value: ${valY ? moment(valY).format(getDefaultModeFormat('year')) : ''}`}
        </Typography>
        <DatePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format={getDefaultModeFormat('year')}
          placeholder="輸入日期"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Quarter
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valQ || ''}
          format value: ${valQ ? moment(valQ).format(getDefaultModeFormat('quarter')) : ''}`}
        </Typography>
        <DatePicker
          value={valQ}
          onChange={onChangeQ}
          mode="quarter"
          format={getDefaultModeFormat('quarter')}
          placeholder="輸入日期"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Half year
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`origin value: ${valH || ''}
          format value: ${formatWithHalfYear(valH, 'half-year')}`}
        </Typography>
        <DatePicker
          value={valH}
          onChange={onChangeH}
          mode="half-year"
          format={getDefaultModeFormat('half-year')}
          placeholder="輸入日期"
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const CustomDisable = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = {
    margin: '0 0 12px 0',
    whiteSpace: 'pre-line',
  } as CSSProperties;
  const [valD, onChangeD] = usePickerChange();
  const [valW, onChangeW] = usePickerChange();
  const [valM, onChangeM] = usePickerChange();
  const [valY, onChangeY] = usePickerChange();

  // We use moment.date  instead of moment.add is because storybook currently has internal conflict with the method.
  const disabledDatesStart = moment().date(moment().date() + 3);
  const disabledDatesEnd = moment().date(moment().date() + 7);
  const disabledWeeksStart = moment().week(moment().week() - 5);
  const disabledWeeksEnd = moment().week(moment().week() - 2);
  const disabledMonthsStart = moment().month(moment().month() - 5);
  const disabledMonthsEnd = moment().month(moment().month() - 1);
  const disabledYearsStart = moment().year(moment().year() - 20);
  const disabledYearsEnd = moment().year(moment().year() - 1);

  const isDateDisabled = (target: DateType) =>
    moment(target).isBetween(disabledDatesStart, disabledDatesEnd, 'day', '[]');

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

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='day')
          disabledMonthSwitch = true
          disabledYearSwitch = true
          disableOnNext = true
          disableOnPrev = true`}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          disabledMonthSwitch
          disabledYearSwitch
          disableOnNext
          disableOnPrev
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='day') Disabled
            Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}
            Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}
            Dates: ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}
          `}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          isDateDisabled={isDateDisabled}
          isMonthDisabled={isMonthDisabled}
          isYearDisabled={isYearDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='week') Disabled
          Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}
          Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}
          Weeks: ${disabledWeeksStart.format(getDefaultModeFormat('week'))} ~ ${disabledWeeksEnd.format(getDefaultModeFormat('week'))}`}
        </Typography>
        <DatePicker
          value={valW}
          onChange={onChangeW}
          mode="week"
          format={getDefaultModeFormat('week')}
          placeholder={getDefaultModeFormat('week')}
          isYearDisabled={isYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isWeekDisabled={isWeekDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='day') Disabled Dates:
          ${disabledDatesStart.format(getDefaultModeFormat('day'))} ~ ${disabledDatesEnd.format(getDefaultModeFormat('day'))}`}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format={getDefaultModeFormat('day')}
          placeholder={getDefaultModeFormat('day')}
          isDateDisabled={isDateDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='month') Disabled Months:
          ${disabledMonthsStart.format(getDefaultModeFormat('month'))} ~ ${disabledMonthsEnd.format(getDefaultModeFormat('month'))}`}
        </Typography>
        <DatePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format={getDefaultModeFormat('month')}
          placeholder={getDefaultModeFormat('month')}
          isMonthDisabled={isMonthDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          {`(mode='year') Disabled Years:
          ${disabledYearsStart.format(getDefaultModeFormat('year'))} ~ ${disabledYearsEnd.format(getDefaultModeFormat('year'))}`}
        </Typography>
        <DatePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format={getDefaultModeFormat('year')}
          placeholder={getDefaultModeFormat('year')}
          isYearDisabled={isYearDisabled}
        />
      </div>
    </CalendarConfigProvider>
  );
};
