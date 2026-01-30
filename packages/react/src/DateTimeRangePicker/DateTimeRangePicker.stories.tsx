import { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { CalendarConfigProviderMoment } from '../Calendar';
import DateTimeRangePicker, {
  DateTimeRangePickerProps,
  DateTimeRangePickerValue,
} from './DateTimeRangePicker';
import Typography from '../Typography';

export default {
  title: 'Data Entry/DateTimeRangePicker',
  component: DateTimeRangePicker,
} as Meta;

function useRangePickerChange() {
  const [val, setVal] = useState<DateTimeRangePickerValue>([
    undefined,
    undefined,
  ]);
  const onChange = (v: DateTimeRangePickerValue) => {
    setVal(v);
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
  render: function Render({
    clearable,
    direction,
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
    const [val, onChange] = useRangePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <Typography style={typoStyle} variant="h3">
          {`From: ${val[0] ?? 'undefined'}`}
        </Typography>
        <Typography style={typoStyle} variant="h3">
          {`To: ${val[1] ?? 'undefined'}`}
        </Typography>
        <DateTimeRangePicker
          clearable={clearable}
          direction={direction}
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

export const Direction: StoryObj = {
  render: function Render() {
    const typoStyle = { margin: '0 0 12px 0' };
    const [rowVal, onRowChange] = useRangePickerChange();
    const [colVal, onColChange] = useRangePickerChange();

    return (
      <CalendarConfigProviderMoment>
        <Typography style={typoStyle} variant="h3">
          Row Direction (default)
        </Typography>
        <DateTimeRangePicker
          direction="row"
          onChange={onRowChange}
          value={rowVal}
        />

        <div style={{ marginTop: 32 }} />

        <Typography style={typoStyle} variant="h3">
          Column Direction
        </Typography>
        <DateTimeRangePicker
          direction="column"
          onChange={onColChange}
          value={colVal}
        />
      </CalendarConfigProviderMoment>
    );
  },
};

export const States: StoryObj = {
  render: function Render() {
    const typoStyle = { margin: '0 0 12px 0' };
    const wrapperStyle = { marginBottom: 24 };

    return (
      <CalendarConfigProviderMoment>
        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Normal
          </Typography>
          <DateTimeRangePicker />
        </div>

        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Disabled
          </Typography>
          <DateTimeRangePicker disabled />
        </div>

        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Error
          </Typography>
          <DateTimeRangePicker error />
        </div>

        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Read Only
          </Typography>
          <DateTimeRangePicker readOnly />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};

export const Sizes: StoryObj = {
  render: function Render() {
    const typoStyle = { margin: '0 0 12px 0' };
    const wrapperStyle = { marginBottom: 24 };

    return (
      <CalendarConfigProviderMoment>
        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: main (default)
          </Typography>
          <DateTimeRangePicker size="main" />
        </div>

        <div style={wrapperStyle}>
          <Typography style={typoStyle} variant="h3">
            Size: sub
          </Typography>
          <DateTimeRangePicker size="sub" />
        </div>
      </CalendarConfigProviderMoment>
    );
  },
};
