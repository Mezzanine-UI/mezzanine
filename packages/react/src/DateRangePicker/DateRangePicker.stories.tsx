import { Meta, StoryObj } from '@storybook/react-webpack5';
import {
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { CSSProperties, useState } from 'react';
import moment from 'moment';
import { RangePickerValue } from '@mezzanine-ui/core/picker';
import DateRangePicker from '.';
import { DateRangePickerProps } from './DateRangePicker';
import Typography from '../Typography';
import { CalendarConfigProvider } from '../Calendar';

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

export const Playground: Story = {
  args: {
    clearable: false,
    disabled: false,
    error: false,
    fullWidth: false,
    inputFromPlaceholder: '',
    inputToPlaceholder: '',
    mode: 'day',
    readOnly: false,
    size: 'main',
  },
  argTypes: {
    mode: {
      control: {
        type: 'select',
      },
      options: ['day', 'week', 'month', 'year'],
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['main', 'sub'],
    },
  },
  render: function Playground({
    clearable,
    disabled,
    error,
    fullWidth,
    inputFromPlaceholder,
    inputToPlaceholder,
    mode,
    readOnly,
    size,
  }: PlaygroundArgs) {
    const [val, onChange] = usePickerChange();

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Typography style={typoStyle} variant="h3">
          {getUpperCase(mode || 'day')}
        </Typography>
        <Typography style={typoStyle} variant="body">
          {`current value: [
            ${moment(val?.[0]).format(getDefaultModeFormat(mode || 'day'))},
            ${moment(val?.[1]).format(getDefaultModeFormat(mode || 'day'))}
          ]`}
        </Typography>
        <Typography style={typoStyle} variant="body">
          {`format in YYYY-MM-DD: [
            ${moment(val?.[0]).format(getDefaultModeFormat('day'))},
            ${moment(val?.[1]).format(getDefaultModeFormat('day'))}
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
  },
};

export const Basic: Story = {
  render: function Basic() {
    const [val, onChange] = usePickerChange();

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
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
            value={[moment().toISOString(), moment().toISOString()]}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Error
          </Typography>
          <DateRangePicker
            error
            value={[moment().toISOString(), moment().toISOString()]}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Read only
          </Typography>
          <DateRangePicker
            readOnly
            value={[moment().toISOString(), moment().toISOString()]}
          />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const Method: Story = {
  render: function Method() {
    const [val, onChange] = usePickerChange();

    return (
      <>
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsMoment
            </Typography>
            <DateRangePicker onChange={onChange} value={val} />
          </div>
        </CalendarConfigProvider>
        <CalendarConfigProvider methods={CalendarMethodsDayjs}>
          <div style={containerStyle}>
            <Typography style={typoStyle} variant="h3">
              CalendarMethodsDayjs
            </Typography>
            <DateRangePicker onChange={onChange} value={val} />
          </div>
        </CalendarConfigProvider>
      </>
    );
  },
};

export const Sizes: Story = {
  render: function Sizes() {
    const [valMain, onChangeMain] = usePickerChange();
    const [valSub, onChangeSub] = usePickerChange();

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Main
          </Typography>
          <DateRangePicker
            onChange={onChangeMain}
            size="main"
            value={valMain}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Sub
          </Typography>
          <DateRangePicker onChange={onChangeSub} size="sub" value={valSub} />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const Modes: Story = {
  render: function Modes() {
    const [valD, onChangeD] = usePickerChange();
    const [valW, onChangeW] = usePickerChange();
    const [valM, onChangeM] = usePickerChange();
    const [valY, onChangeY] = usePickerChange();

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography style={typoStyle} variant="h3">
            Day
          </Typography>
          <Typography style={typoStyle} variant="body">
            {`current value: [${valD?.[0]}, ${valD?.[1]}]`}
          </Typography>
          <DateRangePicker
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
            {`current value: [${valW?.[0]}, ${valW?.[1]}]`}
          </Typography>
          <DateRangePicker
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
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
            {`current value: [${valM?.[0]}, ${valM?.[1]}]`}
          </Typography>
          <DateRangePicker
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
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
            {`current value: [${valY?.[0]}, ${valY?.[1]}]`}
          </Typography>
          <DateRangePicker
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            mode="year"
            onChange={onChangeY}
            value={valY}
          />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const CustomDisable: Story = {
  render: function CustomDisable() {
    const typoStylePre = {
      margin: '0 0 8px 0',
      whiteSpace: 'pre-line',
    } as CSSProperties;
    const [valMix, onChangeMix] = usePickerChange();
    const [valD, onChangeD] = usePickerChange();
    const [valW, onChangeW] = usePickerChange();
    const [valM, onChangeM] = usePickerChange();
    const [valY, onChangeY] = usePickerChange();

    // We use moment.date instead of moment.add is because storybook currently has internal conflict with the method.
    const disabledDatesStart = moment().date(moment().date() + 3);
    const disabledDatesEnd = moment().date(moment().date() + 7);
    const disabledWeeksStart = moment().week(moment().week() - 5);
    const disabledWeeksEnd = moment().week(moment().week() - 2);
    const disabledMonthsStart = moment().month(moment().month() - 5);
    const disabledMonthsEnd = moment().month(moment().month() - 1);
    const disabledYearsStart = moment().year(moment().year() - 5);
    const disabledYearsEnd = moment().year(moment().year() - 1);

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

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography style={typoStylePre} variant="h3">
            {`(mode='day')
            disabledMonthSwitch = true
            disabledYearSwitch = true
            disableOnNext = true
            disableOnPrev = true
            disableOnDoubleNext = true
            disableOnDoublePrev = true`}
          </Typography>
          <DateRangePicker
            disableOnNext
            disableOnPrev
            disabledMonthSwitch
            disabledYearSwitch
            disableOnDoubleNext
            disableOnDoublePrev
            format="YYYY-MM-DD"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            mode="day"
            onChange={onChangeD}
            value={valD}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStylePre} variant="h3">
            {`(mode='day') Disabled
            Dates: ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`}
          </Typography>
          <DateRangePicker
            format="YYYY-MM-DD"
            inputFromPlaceholder="Start Date"
            inputToPlaceholder="End Date"
            isDateDisabled={isDateDisabled}
            mode="day"
            onChange={onChangeMix}
            value={valMix}
          />
        </div>
        <div style={containerStyle}>
          <Typography style={typoStylePre} variant="h3">
            {`(mode='week') Disabled
            Weeks: ${disabledWeeksStart.format(getDefaultModeFormat('week'))} ~ ${disabledWeeksEnd.format(getDefaultModeFormat('week'))}`}
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
            {`(mode='month') Disabled Months:
            ${disabledMonthsStart.format(getDefaultModeFormat('month'))} ~ ${disabledMonthsEnd.format(getDefaultModeFormat('month'))}`}
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
            {`(mode='year') Disabled Years:
            ${disabledYearsStart.format(getDefaultModeFormat('year'))} ~ ${disabledYearsEnd.format(getDefaultModeFormat('year'))}`}
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
      </CalendarConfigProvider>
    );
  },
};
