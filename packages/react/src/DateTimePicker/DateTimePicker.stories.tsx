import { Meta, StoryObj } from '@storybook/react-webpack5';
import { DateType } from '@mezzanine-ui/core/calendar';
import { CSSProperties, useState } from 'react';
import moment from 'moment';
import {
  CalendarConfigProviderDayjs,
  CalendarConfigProviderMoment,
  CalendarConfigProviderLuxon,
} from '../Calendar';
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker';
import Typography from '../Typography';

export default {
  title: 'Data Entry/DateTimePicker',
  component: DateTimePicker,
} as Meta;

function usePickerChange() {
  const [val, setVal] = useState<DateType | undefined>();
  const onChange = (v?: DateType) => {
    setVal(v);
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
  render: function Render({
    clearable,
    disabled,
    error,
    formatDate,
    formatTime,
    fullWidth,
    hideHour,
    hideMinute,
    hideSecond,
    hourStep,
    minuteStep,
    readOnly,
    secondStep,
    size,
    placeholderLeft,
    placeholderRight,
  }) {
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, onChange] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <Typography style={typoStyle} variant="h3">
          {`origin value: ${val}`}
        </Typography>
        <DateTimePicker
          clearable={clearable}
          disabled={disabled}
          error={error}
          formatDate={formatDate}
          formatTime={formatTime}
          fullWidth={fullWidth}
          hideHour={hideHour}
          hideMinute={hideMinute}
          hideSecond={hideSecond}
          hourStep={hourStep}
          minuteStep={minuteStep}
          onChange={onChange}
          readOnly={readOnly}
          secondStep={secondStep}
          size={size}
          value={val}
          placeholderLeft={placeholderLeft}
          placeholderRight={placeholderRight}
        />
      </CalendarConfigProviderMoment>
    );
  },
};

export const Basic: StoryObj = {
  render: function Render() {
    const containerStyle = { width: '320px', margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, setVal] = useState<DateType>();

    const onChange = (v?: DateType) => {
      setVal(v);
    };

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            {`Normal
            Origin Value: ${val}`}
          </Typography>
          <DateTimePicker onChange={onChange} value={val} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Disabled
          </Typography>
          <DateTimePicker disabled value={moment().toISOString()} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Error
          </Typography>
          <DateTimePicker error value={moment().toISOString()} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Read only
          </Typography>
          <DateTimePicker readOnly value={moment().toISOString()} />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const Method: StoryObj = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, setVal] = useState<DateType>();
    const onChange = (v?: DateType) => {
      setVal(v);
    };

    return (
      <>
        <CalendarConfigProviderMoment>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsMoment
            </Typography>
            <DateTimePicker onChange={onChange} value={val} />
          </div>
        </CalendarConfigProviderMoment>
        <CalendarConfigProviderDayjs>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsDayjs
            </Typography>
            <DateTimePicker onChange={onChange} value={val} />
          </div>
        </CalendarConfigProviderDayjs>
        <CalendarConfigProviderLuxon>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodLuxon
            </Typography>
            <DateTimePicker onChange={onChange} value={val} />
          </div>
        </CalendarConfigProviderLuxon>
      </>
    );
  },
};

export const Sizes: StoryObj = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val1, onChange1] = usePickerChange();
    const [val2, onChange2] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: main
          </Typography>
          <DateTimePicker onChange={onChange2} size="main" value={val2} />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: sub
          </Typography>
          <DateTimePicker onChange={onChange1} size="sub" value={val1} />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const DisplayColumn: StoryObj = {
  render: function Render() {
    const containerStyle = { margin: '0 0 32px 0' };
    const typoStyle = { margin: '0 0 8px 0' };
    const [val1, onChange1] = usePickerChange();
    const [val2, onChange2] = usePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Hours, minutes, seconds
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`current value: ${val1 ? moment(val1).format('YYYY-MM-DD HH:mm:ss') : 'undefined'}`}
          </Typography>
          <DateTimePicker
            formatDate="YYYY-MM-DD"
            formatTime="HH:mm:ss"
            onChange={onChange1}
            value={val1}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Hours, minutes
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`current value: ${val2 ? moment(val2).format('YYYY-MM-DD HH:mm') : 'undefined'}`}
          </Typography>
          <DateTimePicker
            formatDate="YYYY-MM-DD"
            formatTime="HH:mm"
            hideSecond
            onChange={onChange2}
            value={val2}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const CustomDisable: StoryObj = {
  render: function Render() {
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

    const isDateDisabled = (target: DateType) =>
      moment(target).isBetween(
        disabledDatesStart,
        disabledDatesEnd,
        'day',
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
      <CalendarConfigProviderMoment>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            {`(mode='day')
            disabledMonthSwitch = true
            disabledYearSwitch = true
            disableOnNext = true
            disableOnPrev = true`}
          </Typography>
          <DateTimePicker
            disabledMonthSwitch
            disabledYearSwitch
            disableOnNext
            disableOnPrev
            formatDate={formatDate}
            formatTime={formatTime}
            onChange={onChangeD}
            value={valD}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            {`(mode='day') Disabled
              Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}
              Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}
              Dates: ${disabledDatesStart.format(`${formatDate} ${formatTime}`)} ~ ${disabledDatesEnd.format(`${formatDate} ${formatTime}`)}
            `}
          </Typography>
          <DateTimePicker
            formatDate={formatDate}
            formatTime={formatTime}
            isDateDisabled={isDateDisabled}
            isMonthDisabled={isMonthDisabled}
            isYearDisabled={isYearDisabled}
            onChange={onChangeD}
            value={valD}
          />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};
