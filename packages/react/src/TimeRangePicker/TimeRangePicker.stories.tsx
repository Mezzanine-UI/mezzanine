import { Meta, StoryFn } from '@storybook/react-webpack5';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import moment from 'moment';
import { useState } from 'react';
import { CalendarConfigProvider } from '../Calendar';
import Typography from '../Typography';
import TimeRangePicker, { TimeRangePickerProps } from './TimeRangePicker';
import { TimeRangePickerValue } from './useTimeRangePickerValue';

export default {
  title: 'Data Entry/TimeRangePicker',
} as Meta;

function usePickerChange<T = DateType>() {
  const [val, setVal] = useState<T>();
  const onChange = (v?: T) => {
    setVal(v);
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = TimeRangePickerProps;

export const Playground: StoryFn<PlaygroundArgs> = ({
  clearable,
  disabled,
  error,
  format,
  fullWidth,
  hideHour,
  hideMinute,
  hideSecond,
  hourStep = 1,
  inputFromPlaceholder,
  inputToPlaceholder,
  minuteStep = 1,
  readOnly,
  required,
  secondStep = 1,
  size,
}) => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange<TimeRangePickerValue>();

  const formatValue = (v: TimeRangePickerValue | undefined) => {
    if (!v) return '';
    const [from, to] = v;
    const fromStr = from ? moment(from).format(format) : '-';
    const toStr = to ? moment(to).format(format) : '-';

    return `${fromStr} ~ ${toStr}`;
  };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography style={typoStyle} variant="h3">
        {`current value: ${formatValue(val)}`}
      </Typography>
      <TimeRangePicker
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={format}
        fullWidth={fullWidth}
        hideHour={hideHour}
        hideMinute={hideMinute}
        hideSecond={hideSecond}
        hourStep={hourStep}
        inputFromPlaceholder={inputFromPlaceholder}
        inputToPlaceholder={inputToPlaceholder}
        minuteStep={minuteStep}
        onChange={onChange}
        readOnly={readOnly}
        required={required}
        secondStep={secondStep}
        size={size}
        value={val}
      />
    </CalendarConfigProvider>
  );
};

Playground.argTypes = {
  size: {
    control: {
      type: 'select',
    },
    options: ['main', 'sub'],
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
  inputFromPlaceholder: 'Start time',
  inputToPlaceholder: 'End time',
  minuteStep: 1,
  readOnly: false,
  required: false,
  secondStep: 1,
  size: 'main',
};

export const Basic = () => {
  const groupStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange<TimeRangePickerValue>();
  const defaultVal: TimeRangePickerValue = [
    moment().hour(9).minute(0).second(0).toISOString(),
    moment().hour(17).minute(30).second(0).toISOString(),
  ];
  const [val2, onChange2] = usePickerChange<TimeRangePickerValue>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={groupStyle}>
        <Typography style={typoStyle} variant="h3">
          Basic Usage
        </Typography>
        <TimeRangePicker onChange={onChange} value={val} />
      </div>
      <div style={groupStyle}>
        <Typography style={typoStyle} variant="h3">
          With Default Value (09:00:00 ~ 17:30:00)
        </Typography>
        <TimeRangePicker
          defaultValue={defaultVal}
          onChange={onChange2}
          value={val2}
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const HideSecond = () => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange<TimeRangePickerValue>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography style={typoStyle} variant="h3">
        Hide Second (HH:mm format)
      </Typography>
      <TimeRangePicker
        format="HH:mm"
        hideSecond
        onChange={onChange}
        value={val}
      />
    </CalendarConfigProvider>
  );
};

export const WithSteps = () => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange<TimeRangePickerValue>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography style={typoStyle} variant="h3">
        With Steps (Hour: 2, Minute: 15, Second: 30)
      </Typography>
      <TimeRangePicker
        hourStep={2}
        minuteStep={15}
        onChange={onChange}
        secondStep={30}
        value={val}
      />
    </CalendarConfigProvider>
  );
};

export const States = () => {
  const groupStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const defaultVal: TimeRangePickerValue = [
    moment().hour(9).minute(0).second(0).toISOString(),
    moment().hour(17).minute(30).second(0).toISOString(),
  ];
  const [val, onChange] = usePickerChange<TimeRangePickerValue>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={groupStyle}>
        <Typography style={typoStyle} variant="h3">
          Disabled
        </Typography>
        <TimeRangePicker defaultValue={defaultVal} disabled />
      </div>
      <div style={groupStyle}>
        <Typography style={typoStyle} variant="h3">
          Read Only
        </Typography>
        <TimeRangePicker defaultValue={defaultVal} readOnly />
      </div>
      <div style={groupStyle}>
        <Typography style={typoStyle} variant="h3">
          With Error State
        </Typography>
        <TimeRangePicker
          defaultValue={defaultVal}
          value={val}
          onChange={onChange}
          error
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const Sizes = () => {
  const typoStyle = { margin: '12px 0' };
  const [val1, onChange1] = usePickerChange<TimeRangePickerValue>();
  const [val2, onChange2] = usePickerChange<TimeRangePickerValue>();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography style={typoStyle} variant="h3">
        Size: Main
      </Typography>
      <TimeRangePicker onChange={onChange1} size="main" value={val1} />
      <Typography style={typoStyle} variant="h3">
        Size: Sub
      </Typography>
      <TimeRangePicker onChange={onChange2} size="sub" value={val2} />
    </CalendarConfigProvider>
  );
};
