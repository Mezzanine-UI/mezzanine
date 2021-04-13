import { Story, Meta } from '@storybook/react';
import moment, { Moment } from 'moment';
import { CalendarMethodsMoment, CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import { useState } from 'react';
import CalendarDays from './CalendarDays';
import CalendarCell, {
  CalendarCellProps,
} from './CalendarCell';
import CalendarWeeks from './CalendarWeeks';
import CalendarMonths from './CalendarMonths';
import CalendarYears from './CalendarYears';
import CalendarConfigProvider from './CalendarContext';
import CalendarControls, { CalendarControlsProps } from './CalendarControls';
import Calendar, { CalendarProps } from './Calendar';
import Typography from '../Typography/Typography';
import { useCalendarControls } from './useCalendarControls';

export default {
  title: 'Utility/Calendar',
} as Meta;

declare module '@mezzanine-ui/core/calendar' {
  export type DateType = Moment;
}

const InnerCalendarPlayground = ({
  mode = 'day',
}: {
  mode: CalendarMode
}) => {
  const formats = {
    day: 'YYYY-MM-DD',
    week: 'gggg-wo',
    month: 'YYYY-MM',
    year: 'YYYY',
  };
  const initialReferenceDate = moment();
  const [val, setVal] = useState<DateType>();
  const {
    currentMode,
    onMonthControlClick,
    onNext,
    onPrev,
    onYearControlClick,
    popModeStack,
    referenceDate,
    updateReferenceDate,
  } = useCalendarControls(val || initialReferenceDate, mode);

  const onChange = (target: DateType) => {
    updateReferenceDate(target);

    popModeStack();

    if (currentMode === mode) {
      setVal(target);
    }
  };

  return (
    <>
      <Typography style={{ margin: '0 0 12px 0' }}>
        {`current value: ${val?.format(formats[mode])}`}
      </Typography>
      <div style={{ width: '224px' }}>
        <Calendar
          mode={currentMode}
          onChange={onChange}
          onMonthControlClick={onMonthControlClick}
          onNext={onNext}
          onPrev={onPrev}
          onYearControlClick={onYearControlClick}
          referenceDate={referenceDate}
          value={val}
        />
      </div>
    </>
  );
};

type CalendarPlaygroundArgs = Pick<CalendarProps, 'mode'>;
export const CalendarPlayground: Story<CalendarPlaygroundArgs> = ({
  mode = 'day',
}) => (
  <CalendarConfigProvider methods={CalendarMethodsMoment}>
    <InnerCalendarPlayground mode={mode} />
  </CalendarConfigProvider>
);

CalendarPlayground.argTypes = {
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
};

CalendarPlayground.args = {
  mode: 'day',
};

export const Calendars = () => {
  const calendarStyles = {
    width: '224px',
    margin: '0 0 48px 0',
  };
  const titleStyles = {
    margin: '0 0 12px 0',
  };

  const startDate = moment().date(17);
  const endDate = moment().date(26);
  const isDateInRange = (date: DateType) => date.isBetween(startDate, endDate);

  const startWeek = moment().date(7);
  const endWeek = moment().date(21);
  const isWeekInRange = (date: DateType) => date.isBetween(startWeek, endWeek, 'date', '[]');

  const startMonth = moment().month(2);
  const endMonth = moment().month(5);
  const isMonthInRange = (date: DateType) => date.isBetween(startMonth, endMonth, 'month', '[]');

  const startYear = moment().year(2021);
  const endYear = moment().year(2025);
  const isYearInRange = (date: DateType) => date.isBetween(startYear, endYear, 'year', '[]');

  return (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      <Typography variant="h4" style={titleStyles}>Days Calendar</Typography>
      <div style={calendarStyles}>
        <CalendarDays
          referenceDate={moment()}
          isDateInRange={isDateInRange}
          value={[startDate, endDate]}
        />
      </div>
      <Typography variant="h4" style={titleStyles}>Weeks Calendar</Typography>
      <div style={calendarStyles}>
        <CalendarWeeks
          referenceDate={startWeek}
          isWeekInRange={isWeekInRange}
          value={[startWeek, endWeek]}
        />
      </div>
      <Typography variant="h4" style={titleStyles}>Months Calendar</Typography>
      <div style={calendarStyles}>
        <CalendarMonths
          referenceDate={startMonth}
          isMonthInRange={isMonthInRange}
          value={[startMonth, endMonth]}
        />
      </div>
      <Typography variant="h4" style={titleStyles}>Years Calendar</Typography>
      <div style={calendarStyles}>
        <CalendarYears
          referenceDate={startYear}
          value={[startYear, endYear]}
          isYearInRange={isYearInRange}
        />
      </div>
    </CalendarConfigProvider>

  );
};

type CellPlaygroundArgs = CalendarCellProps;
export const CellPlayground: Story<CellPlaygroundArgs> = ({
  today,
  active,
  disabled,
}) => (
  <div style={{ width: 32 }}>
    <CalendarCell
      today={today}
      active={active}
      disabled={disabled}
    >
      {moment().date()}
    </CalendarCell>
  </div>
);

CellPlayground.args = {
  today: false,
  active: false,
  disabled: false,
};

type ControlPlaygroundArgs = Pick<CalendarControlsProps, 'disableOnNext' | 'disableOnPrev'>;
export const ControlPlayground: Story<ControlPlaygroundArgs> = ({
  disableOnNext,
  disableOnPrev,
}) => (
  <div style={{ width: '224px' }}>
    <CalendarControls
      disableOnNext={disableOnNext}
      disableOnPrev={disableOnPrev}
      onPrev={() => {}}
      onNext={() => {}}
    />
  </div>
);

ControlPlayground.args = {
  disableOnNext: false,
  disableOnPrev: false,
};
