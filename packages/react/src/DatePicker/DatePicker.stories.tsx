import { StoryFn, Meta } from '@storybook/react';
import {
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import { useState } from 'react';
import moment from 'moment';
import DatePicker, { DatePickerProps } from './DatePicker';
import Typography from '../Typography';
import { CalendarConfigProvider } from '../Calendar';
import ConfigProvider from '../Provider';

export default {
  title: 'Data Entry/DatePicker',
} as Meta;

function usePickerChange() {
  const [val, setVal] = useState<DateType | undefined>('2022-01-05');
  const onChange = (v?: DateType) => { setVal(v); };

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
      <Typography variant="h5" style={typoStyle}>{val}</Typography>
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
    control: {
      type: 'select',
      options: [
        'day',
        'week',
        'month',
        'year',
      ],
    },
  },
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
  format: 'YYYY-MM-DD',
  fullWidth: false,
  mode: 'day',
  placeholder: '',
  readOnly: false,
  size: 'medium',
};

export const Basic = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, setVal] = useState<DateType | undefined>('2022-01-05');
  const onChange = (v?: DateType) => { setVal(v); };

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Normal
        </Typography>
        <DatePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Disabled
        </Typography>
        <DatePicker value={new Date().toISOString()} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Error
        </Typography>
        <DatePicker value={new Date().toISOString()} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
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
  const [val, setVal] = useState<DateType>(new Date());
  const onChange = (v?: DateType) => { setVal(v); };

  return (
    <>
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsMoment
          </Typography>
          <DatePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsDayjs}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsDayjs
          </Typography>
          <DatePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsLuxon}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
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
  const [valSm, onChangeSm] = usePickerChange();
  const [valMd, onChangeMd] = usePickerChange();
  const [valLg, onChangeLg] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Small
        </Typography>
        <DatePicker value={valSm} onChange={onChangeSm} size="small" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Medium
        </Typography>
        <DatePicker value={valMd} onChange={onChangeMd} size="medium" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Large
        </Typography>
        <ConfigProvider size="large">
          <DatePicker value={valLg} onChange={onChangeLg} />
        </ConfigProvider>
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

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Day
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(valD).format(getDefaultModeFormat('day'))}`}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Week
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(valW).format(getDefaultModeFormat('week'))}`}
        </Typography>
        <DatePicker
          value={valW}
          onChange={onChangeW}
          mode="week"
          format="gggg-wo"
          placeholder="gggg-wo"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Month
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(valM).format(getDefaultModeFormat('month'))}`}
        </Typography>
        <DatePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format="YYYY-MM"
          placeholder="YYYY-MM"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h4" style={typoStyle}>
          Year
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: ${moment(valY).format(getDefaultModeFormat('year'))}`}
        </Typography>
        <DatePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format="YYYY"
          placeholder="YYYY"
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const CustomDisable = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [valD, onChangeD] = usePickerChange();
  const [valM, onChangeM] = usePickerChange();
  const [valY, onChangeY] = usePickerChange();

  // We use moment.date  instead of moment.add is because storybook currently has internal conflict with the method.
  const disabledDatesStart = moment().date(moment().date() - 7);
  const disabledDatesEnd = moment().date(moment().date() + 7);
  const disabledMonthsStart = moment().month(moment().month() - 2);
  const disabledMonthsEnd = moment().month(moment().month() + 2);
  const disabledYearsStart = moment().year(moment().year() - 2);
  const disabledYearsEnd = moment().year(moment().year() + 2);

  const isDateDisabled = (target: DateType) => (
    moment(target).isBetween(
      disabledDatesStart,
      disabledDatesEnd,
      'day',
      '[]',
    )
  );

  const isMonthDisabled = (target: DateType) => (
    moment(target).isBetween(
      disabledMonthsStart,
      disabledMonthsEnd,
      'month',
      '[]',
    )
  );

  const isYearDisabled = (target: DateType) => (
    moment(target).isBetween(
      disabledYearsStart,
      disabledYearsEnd,
      'year',
      '[]',
    )
  );

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`Disabled Dates: ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`}
        </Typography>
        <DatePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          placeholder="YYYY-MM-DD"
          isDateDisabled={isDateDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`Disabled Months:
          ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`}
        </Typography>
        <DatePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format="YYYY-MM"
          placeholder="YYYY-MM"
          isMonthDisabled={isMonthDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`Disabled Years:
          ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`}
        </Typography>
        <DatePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format="YYYY"
          placeholder="YYYY"
          isYearDisabled={isYearDisabled}
        />
      </div>
    </CalendarConfigProvider>
  );
};
