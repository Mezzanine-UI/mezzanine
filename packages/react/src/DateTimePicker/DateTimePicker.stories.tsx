import { StoryFn, Meta } from '@storybook/react';
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { CSSProperties, useState } from 'react';
import moment from 'moment';
import { CalendarConfigProvider } from '../Calendar';
import DateTimePicker, { DateTimePickerProps } from './DateTimePicker';
import Typography from '../Typography';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Entry/DateTimePicker',
} as Meta;

function usePickerChange() {
  const [val, setVal] = useState<DateType>();
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return [val, onChange] as const;
}

type PlaygroundArgs = DateTimePickerProps;

export const Playground: StoryFn<PlaygroundArgs> = ({
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
      <DateTimePicker
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
        secondPrefix={secondPrefix}
        secondStep={secondStep}
        size={size}
      />
    </CalendarConfigProvider>
  );
};

Playground.argTypes = {
  size: {
    options: ['small', 'medium', 'large'],
    control: {
      type: 'select',
    },
  },
};

Playground.args = {
  clearable: false,
  disabled: false,
  error: false,
  format: 'YYYY-MM-DD HH:mm:ss',
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
  secondPrefix: 'Sec',
  secondStep: 1,
  size: 'medium',
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
        <Typography variant="h5" style={typoStyle}>
          Normal
        </Typography>
        <DateTimePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Disabled
        </Typography>
        <DateTimePicker value={moment().toISOString()} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Error
        </Typography>
        <DateTimePicker value={moment().toISOString()} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Read only
        </Typography>
        <DateTimePicker value={moment().toISOString()} readOnly />
      </div>
    </CalendarConfigProvider>
  );
};

export const Method = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType>();
  const onChange = (v?: DateType) => {
    setVal(v);
  };

  return (
    <>
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsMoment
          </Typography>
          <DateTimePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsDayjs}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsDayjs
          </Typography>
          <DateTimePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
    </>
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
        <DateTimePicker value={val1} onChange={onChange1} size="small" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Medium
        </Typography>
        <DateTimePicker value={val2} onChange={onChange2} size="medium" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Large
        </Typography>
        <ConfigProvider size="large">
          <DateTimePicker value={val3} onChange={onChange3} />
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
  const fullFormat = 'YYYY-MM-DD HH:mm:ss';
  const withoutSecondFormat = 'YYYY-MM-DD HH:mm';
  const onlyHourFormat = 'YYYY-MM-DD HH';

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours, minutes, seconds
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val1).format(fullFormat)}`}
        </Typography>
        <DateTimePicker
          value={val1}
          onChange={onChange1}
          format={fullFormat}
          placeholder={fullFormat}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours, minutes
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val2).format(withoutSecondFormat)}`}
        </Typography>
        <DateTimePicker
          value={val2}
          onChange={onChange2}
          hideSecond
          format={withoutSecondFormat}
          placeholder={withoutSecondFormat}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Hours
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(val3).format(onlyHourFormat)}`}
        </Typography>
        <DateTimePicker
          value={val3}
          onChange={onChange3}
          hideSecond
          hideMinute
          format={onlyHourFormat}
          placeholder={onlyHourFormat}
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

  // We use moment.date  instead of moment.add is because storybook currently has internal conflict with the method.
  const disabledDatesStart = moment().date(moment().date() + 3);
  const disabledDatesEnd = moment().date(moment().date() + 7);
  const disabledMonthsStart = moment().month(moment().month() - 5);
  const disabledMonthsEnd = moment().month(moment().month() - 1);
  const disabledYearsStart = moment().year(moment().year() - 20);
  const disabledYearsEnd = moment().year(moment().year() - 1);
  const format = 'YYYY-MM-DD HH:mm:ss';

  const isDateDisabled = (target: DateType) =>
    moment(target).isBetween(disabledDatesStart, disabledDatesEnd, 'day', '[]');

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
        <Typography variant="h5" style={typoStyle}>
          {`(mode='day')
          disabledMonthSwitch = true
          disabledYearSwitch = true
          disableOnNext = true
          disableOnPrev = true`}
        </Typography>
        <DateTimePicker
          value={valD}
          onChange={onChangeD}
          format={format}
          placeholder={format}
          disabledMonthSwitch
          disabledYearSwitch
          disableOnNext
          disableOnPrev
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`(mode='day') Disabled
            Years: ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}
            Months: ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}
            Dates: ${disabledDatesStart.format(format)} ~ ${disabledDatesEnd.format(format)}
          `}
        </Typography>
        <DateTimePicker
          value={valD}
          onChange={onChangeD}
          format={format}
          placeholder={format}
          isYearDisabled={isYearDisabled}
          isMonthDisabled={isMonthDisabled}
          isDateDisabled={isDateDisabled}
        />
      </div>
    </CalendarConfigProvider>
  );
};
