import { StoryFn, Meta } from '@storybook/react-webpack5';
import moment from 'moment';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useMemo, useState } from 'react';
import CalendarConfigProvider from './CalendarContext';
import Calendar, { CalendarProps } from './Calendar';
import Typography from '../Typography/Typography';
import { useCalendarControls } from './useCalendarControls';

export default {
  title: 'Utility/Calendar',
} as Meta;

const InnerCalendarPlayground = ({ mode = 'day' }: { mode: CalendarMode }) => {
  const formats = {
    day: 'YYYY-MM-DD',
    week: 'gggg-wo',
    month: 'YYYY-MM',
    year: 'YYYY',
    quarter: 'YYYY-[Q]Q',
    'half-year': 'YYYY-[Q]Q', // Will convert Q to H (Q1,Q2→H1, Q3,Q4→H2)
  };
  const initialReferenceDate = useMemo(() => moment().toISOString(), []);
  const [val, setVal] = useState<DateType>();
  const {
    currentMode,
    onMonthControlClick,
    onNext,
    onPrev,
    onDoubleNext,
    onDoublePrev,
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

  const formatValue = (value: DateType | undefined) => {
    if (!value) return '';
    const formatted = moment(value).format(formats[mode]);

    if (mode === 'half-year') {
      // Convert: Q1,Q2 → H1 and Q3,Q4 → H2
      return formatted.replace(/Q([1-4])/, (_, quarter) => {
        const q = parseInt(quarter, 10);
        const halfYear = Math.ceil(q / 2);
        return `H${halfYear}`;
      });
    }

    return formatted;
  };

  return (
    <>
      <Typography style={{ margin: '0 0 12px 0' }}>
        {`current value: ${formatValue(val)}`}
      </Typography>
      <Calendar
        mode={currentMode}
        onChange={onChange}
        onMonthControlClick={onMonthControlClick}
        onDoubleNext={onDoubleNext}
        onNext={onNext}
        onDoublePrev={onDoublePrev}
        onPrev={onPrev}
        onYearControlClick={onYearControlClick}
        referenceDate={referenceDate}
        value={val}
      />
    </>
  );
};

type CalendarPlaygroundArgs = Pick<CalendarProps, 'mode'>;
export const CalendarPlayground: StoryFn<CalendarPlaygroundArgs> = ({
  mode = 'day',
}) => (
  <CalendarConfigProvider methods={CalendarMethodsMoment}>
    <InnerCalendarPlayground mode={mode} />
  </CalendarConfigProvider>
);

CalendarPlayground.argTypes = {
  mode: {
    options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
    control: {
      type: 'select',
    },
  },
};

CalendarPlayground.args = {
  mode: 'day',
};
