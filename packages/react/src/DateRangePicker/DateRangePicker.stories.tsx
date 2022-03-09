import { Story, Meta } from '@storybook/react';
import {
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useState } from 'react';
import moment from 'moment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import DateRangePicker from '.';
import { DateRangePickerProps } from './DateRangePicker';
import Typography from '../Typography';
import { CalendarConfigProvider } from '../Calendar';

export default {
  title: 'Data Entry/DateRangePicker',
} as Meta;

function usePickerChange() {
  const [val, setVal] = useState<RangePickerValue>();
  const onChange = (v?: RangePickerValue) => { setVal(v); };

  return [val, onChange] as const;
}

const getUpperCase = (mode: CalendarMode) => mode.charAt(0).toUpperCase() + mode.slice(1);

type PlaygroundArgs = DateRangePickerProps;

export const Playground: Story<PlaygroundArgs> = ({
  clearable,
  disabled,
  error,
  fullWidth,
  inputFromPlaceholder,
  inputToPlaceholder,
  mode,
  readOnly,
  size,
}) => {
  const typoStyle = { margin: '0 0 8px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography variant="h5" style={typoStyle}>
        {getUpperCase(mode || 'day')}
      </Typography>
      <Typography variant="body1" style={typoStyle}>
        {`current value: [
            ${moment(val?.[0]).format(getDefaultModeFormat(mode || 'day'))},
            ${moment(val?.[1]).format(getDefaultModeFormat(mode || 'day'))}
          ]`}
      </Typography>
      <DateRangePicker
        clearable={clearable}
        disabled={disabled}
        error={error}
        format={getDefaultModeFormat(mode || 'day')}
        fullWidth={fullWidth}
        inputFromPlaceholder={inputFromPlaceholder}
        inputToPlaceholder={inputToPlaceholder}
        mode={mode}
        onChange={onChange}
        readOnly={readOnly}
        size={size}
        value={val}
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
  fullWidth: false,
  inputFromPlaceholder: '',
  inputToPlaceholder: '',
  mode: 'day',
  readOnly: false,
  size: 'medium',
};

export const Basic = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Normal
        </Typography>
        <DateRangePicker value={val} onChange={onChange} />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Disabled
        </Typography>
        <DateRangePicker value={[moment().toISOString(), moment().toISOString()]} disabled />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Error
        </Typography>
        <DateRangePicker value={[moment().toISOString(), moment().toISOString()]} error />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Read only
        </Typography>
        <DateRangePicker value={[moment().toISOString(), moment().toISOString()]} readOnly />
      </div>
    </CalendarConfigProvider>
  );
};

export const Method = () => {
  const containerStyle = { margin: '0 0 24px 0' };
  const typoStyle = { margin: '0 0 12px 0' };
  const [val, onChange] = usePickerChange();

  return (
    <>
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsMoment
          </Typography>
          <DateRangePicker value={val} onChange={onChange} />
        </div>
      </CalendarConfigProvider>
      <CalendarConfigProvider methods={CalendarMethodsDayjs}>
        <div style={containerStyle}>
          <Typography variant="h5" style={typoStyle}>
            CalendarMethodsDayjs
          </Typography>
          <DateRangePicker value={val} onChange={onChange} />
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
        <DateRangePicker value={valSm} onChange={onChangeSm} size="small" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Medium
        </Typography>
        <DateRangePicker value={valMd} onChange={onChangeMd} size="medium" />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Large
        </Typography>
        <DateRangePicker value={valLg} onChange={onChangeLg} size="large" />
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
        <Typography variant="h5" style={typoStyle}>
          Day
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: [
            ${moment(valD?.[0]).format(getDefaultModeFormat('day'))},
            ${moment(valD?.[1]).format(getDefaultModeFormat('day'))}
          ]`}
        </Typography>
        <DateRangePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Week
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: [
            ${moment(valW?.[0]).format(getDefaultModeFormat('week'))},
            ${moment(valW?.[1]).format(getDefaultModeFormat('week'))}
          ]`}
        </Typography>
        <DateRangePicker
          value={valW}
          onChange={onChangeW}
          mode="week"
          format="gggg-wo"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Month
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: [
            ${moment(valM?.[0]).format(getDefaultModeFormat('month'))},
            ${moment(valM?.[1]).format(getDefaultModeFormat('month'))}
          ]`}
        </Typography>
        <DateRangePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format="YYYY-MM"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          Year
        </Typography>
        <Typography variant="body1" style={typoStyle}>
          {`current value: [
            ${moment(valY?.[0]).format(getDefaultModeFormat('year'))},
            ${moment(valY?.[1]).format(getDefaultModeFormat('year'))}
          ]`}
        </Typography>
        <DateRangePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format="YYYY"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
        />
      </div>
    </CalendarConfigProvider>
  );
};

export const CustomDisable = () => {
  const containerStyle = { margin: '0 0 36px 0' };
  const typoStyle = { margin: '0 0 8px 0' };
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
        <DateRangePicker
          value={valD}
          onChange={onChangeD}
          mode="day"
          format="YYYY-MM-DD"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          isDateDisabled={isDateDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`Disabled Months:
          ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`}
        </Typography>
        <DateRangePicker
          value={valM}
          onChange={onChangeM}
          mode="month"
          format="YYYY-MM"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          isMonthDisabled={isMonthDisabled}
        />
      </div>
      <div style={containerStyle}>
        <Typography variant="h5" style={typoStyle}>
          {`Disabled Years:
          ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`}
        </Typography>
        <DateRangePicker
          value={valY}
          onChange={onChangeY}
          mode="year"
          format="YYYY"
          inputFromPlaceholder="Start Date"
          inputToPlaceholder="End Date"
          isYearDisabled={isYearDisabled}
        />
      </div>
    </CalendarConfigProvider>
  );
};
