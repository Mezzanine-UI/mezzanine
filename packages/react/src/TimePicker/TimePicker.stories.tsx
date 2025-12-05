import { StoryFn, Meta } from '@storybook/react-webpack5';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useState } from 'react';
import moment from 'moment';
import { CalendarConfigProvider } from '../Calendar';
import TimePicker, { TimePickerProps } from './TimePicker';
import Typography from '../Typography';

export default {
  title: 'Data Entry/TimePicker',
} as Meta;

function usePickerChange<T = DateType>() {
  const [val, setVal] = useState<T>();
  const onChange = (v?: T) => {
    setVal(v);
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = TimePickerProps;

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
  minuteStep = 1,
  placeholder,
  readOnly,
  required,
  secondStep = 1,
  size,
}) => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography variant="h3" style={typoStyle}>
        {`current value: ${val ? moment(val).format(format) : 'None'}`}
      </Typography>
      <TimePicker
        value={val}
        onChange={onChange}
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={format}
        fullWidth={fullWidth}
        hideHour={hideHour}
        hideMinute={hideMinute}
        hideSecond={hideSecond}
        hourStep={hourStep}
        minuteStep={minuteStep}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        secondStep={secondStep}
        size={size}
      />
    </CalendarConfigProvider>
  );
};

Playground.argTypes = {
  size: {
    options: ['main', 'sub'],
    control: {
      type: 'select',
    },
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
  minuteStep: 1,
  placeholder: 'Select time',
  readOnly: false,
  required: false,
  secondStep: 1,
  size: 'main',
};

export const Basic = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType>();
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Normal
        </Typography>
        <TimePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Disabled
        </Typography>
        <TimePicker value={moment().toISOString()} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Error
        </Typography>
        <TimePicker value={moment().toISOString()} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Read only
        </Typography>
        <TimePicker value={moment().toISOString()} readOnly />
      </div>
    </CalendarConfigProvider>
  );
};

export const Sizes = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val1, onChange1] = usePickerChange();
  const [val2, onChange2] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Main (Default)
        </Typography>
        <TimePicker value={val1} onChange={onChange1} size="main" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Sub
        </Typography>
        <TimePicker value={val2} onChange={onChange2} size="sub" />
      </div>
    </CalendarConfigProvider>
  );
};

export const DisplayColumn = () => {
  const containerStyle = { margin: '0 0 32px 0' };
  const typoStyle = { margin: '0 0 8px 0' };
  const [val1, onChange1] = usePickerChange();
  const [val2, onChange2] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Hours, minutes, seconds
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`current value: ${val1 ? moment(val1).format('HH:mm:ss') : 'None'}`}
        </Typography>
        <TimePicker
          value={val1}
          onChange={onChange1}
          format="HH:mm:ss"
          placeholder="HH:mm:ss"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Hours, minutes
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`current value: ${val2 ? moment(val2).format('HH:mm') : 'None'}`}
        </Typography>
        <TimePicker
          value={val2}
          onChange={onChange2}
          hideSecond
          format="HH:mm"
          placeholder="HH:mm"
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const Steps = () => {
  const containerStyle = { margin: '0 0 32px 0' };
  const typoStyle = { margin: '0 0 8px 0' };
  const [val1, onChange1] = usePickerChange();
  const [val2, onChange2] = usePickerChange();
  const [val3, onChange3] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Hour step (15 minutes)
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`current value: ${val1 ? moment(val1).format('HH:mm:ss') : 'None'}`}
        </Typography>
        <TimePicker
          value={val1}
          onChange={onChange1}
          hourStep={1}
          minuteStep={15}
          placeholder="HH:mm:ss"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          Minute step (30 seconds)
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`current value: ${val2 ? moment(val2).format('HH:mm:ss') : 'None'}`}
        </Typography>
        <TimePicker
          value={val2}
          onChange={onChange2}
          minuteStep={1}
          secondStep={30}
          placeholder="HH:mm:ss"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h3" style={typoStyle}>
          All steps (6 hours, 15 minutes, 20 seconds)
        </Typography>
        <Typography variant="body" style={typoStyle}>
          {`current value: ${val3 ? moment(val3).format('HH:mm:ss') : 'None'}`}
        </Typography>
        <TimePicker
          value={val3}
          onChange={onChange3}
          hourStep={6}
          minuteStep={15}
          secondStep={20}
          placeholder="HH:mm:ss"
        />
      </div>
    </CalendarConfigProvider>
  );
};
