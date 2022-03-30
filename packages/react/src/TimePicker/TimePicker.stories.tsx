import { Story, Meta } from '@storybook/react';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useState } from 'react';
import moment from 'moment';
import { CalendarConfigProvider } from '../Calendar';
import TimePicker, { TimePickerProps } from './TimePicker';
import Typography from '../Typography';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Entry/TimePicker',
} as Meta;

function usePickerChange<T = DateType>() {
  const [val, setVal] = useState<T>();
  const onChange = (v?: T) => { setVal(v); };

  return [val, onChange] as const;
}

type PlaygroundArgs = TimePickerProps;

export const Playground: Story<PlaygroundArgs> = ({
  clearable,
  disabled,
  error,
  format,
  fullWidth,
  hideHour,
  hideMinute,
  hideSecond,
  hourPrefix,
  hourStep = 1,
  minutePrefix,
  minuteStep = 1,
  placeholder,
  readOnly,
  required,
  secondPrefix,
  secondStep = 1,
  size,
}) => {
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography variant="h5" style={typoStyle}>
        {`current value: ${moment(val).format(format)}`}
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
        hourPrefix={hourPrefix}
        hourStep={hourStep}
        minutePrefix={minutePrefix}
        minuteStep={minuteStep}
        placeholder={placeholder}
        readOnly={readOnly}
        required={required}
        secondPrefix={secondPrefix}
        secondStep={secondStep}
        size={size}
      />
    </CalendarConfigProvider>
  );
};

Playground.argTypes = {
  size: {
    control: {
      type: 'select',
      options: [
        'small',
        'medium',
        'large',
      ],
    },
  },
};

Playground.args = {
  clearable: false,
  disabled: false,
  error: false,
  format: 'HH:mm:ss',
  fullWidth: false,
  hideHour: false,
  hideMinute: false,
  hideSecond: false,
  hourPrefix: 'Hrs',
  hourStep: 1,
  minutePrefix: 'Min',
  minuteStep: 1,
  placeholder: '',
  readOnly: false,
  required: false,
  secondPrefix: 'Sec',
  secondStep: 1,
  size: 'medium',
};

export const Basic = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType>();
  const onChange = (v?: DateType) => { setVal(v); };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Normal
        </Typography>
        <TimePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Disabled
        </Typography>
        <TimePicker value={moment().toISOString()} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Error
        </Typography>
        <TimePicker value={moment().toISOString()} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
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
  const [val3, onChange3] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Small
        </Typography>
        <TimePicker value={val1} onChange={onChange1} size="small" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Medium
        </Typography>
        <TimePicker value={val2} onChange={onChange2} size="medium" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Large
        </Typography>
        <ConfigProvider size="large">
          <TimePicker value={val3} onChange={onChange3} />
        </ConfigProvider>
      </div>
    </CalendarConfigProvider>
  );
};

export const DisplayColumn = () => {
  const containerStyle = { margin: '0 0 32px 0' };
  const typoStyle = { margin: '0 0 8px 0' };
  const [val1, onChange1] = usePickerChange();
  const [val2, onChange2] = usePickerChange();
  const [val3, onChange3] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours, minutes, seconds
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val1).format('HH:mm:ss')}`}
        </Typography>
        <TimePicker
          value={val1}
          onChange={onChange1}
          format="HH:mm:ss"
          placeholder="HH:mm:ss"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours, minutes
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val2).format('HH:mm')}`}
        </Typography>
        <TimePicker
          value={val2}
          onChange={onChange2}
          hideSecond
          format="HH:mm"
          placeholder="HH:mm"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val3).format('HH')}`}
        </Typography>
        <TimePicker
          value={val3}
          onChange={onChange3}
          hideSecond
          hideMinute
          format="HH"
          placeholder="HH"
        />
      </div>
    </CalendarConfigProvider>
  );
};
