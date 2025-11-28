import { StoryFn, Meta } from '@storybook/react-webpack5';
import moment from 'moment';
import { CalendarMode, DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useMemo, useState } from 'react';
import CalendarConfigProvider from './CalendarContext';
import Calendar, { CalendarProps } from './Calendar';
import RangeCalendar, { RangeCalendarProps } from './RangeCalendar';
import Typography from '../Typography/Typography';
import { useCalendarControls } from './useCalendarControls';
import Toggle from '../Toggle';

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
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
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

  const quickSelectOptions = [
    {
      id: 'yesterday',
      name: 'Yesterday',
      onClick: () => onChange(moment().subtract(1, 'day').toISOString()),
    },
    {
      id: 'today',
      name: 'Today',
      onClick: () => onChange(moment().toISOString()),
    },
    {
      id: 'tomorrow',
      name: 'Tomorrow',
      onClick: () => onChange(moment().add(1, 'day').toISOString()),
    },
  ];

  return (
    <>
      <Toggle
        checked={showQuickSelect}
        label="Enabled QuickSelect"
        onClick={() => setShowQuickSelect((prev) => !prev)}
      />
      <Toggle
        checked={showAnnotations}
        label="Enabled Annotations"
        onClick={() => setShowAnnotations((prev) => !prev)}
      />
      <Typography style={{ margin: '0 0 12px 0' }}>
        {`current value: ${formatValue(val)}`}
      </Typography>
      <Calendar
        mode={currentMode}
        renderAnnotations={
          showAnnotations
            ? (date) => {
                // your custom annotations
                const availableAnnotations = {
                  [moment().format('YYYY-MM-DD')]: {
                    color: 'text-success' as const,
                    value: '12.4%',
                  },
                  [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
                    color: 'text-error' as const,
                    value: '-8%',
                  },
                };

                const dateKey = moment(date).format('YYYY-MM-DD');
                const annotation = availableAnnotations[dateKey];

                return annotation;
              }
            : undefined
        }
        onChange={onChange}
        onMonthControlClick={onMonthControlClick}
        onDoubleNext={onDoubleNext}
        onNext={onNext}
        onDoublePrev={onDoublePrev}
        onPrev={onPrev}
        onYearControlClick={onYearControlClick}
        referenceDate={referenceDate}
        value={val}
        quickSelect={
          showQuickSelect
            ? {
                activeId: (() => {
                  if (!val) return undefined;

                  const todayId = 'today';
                  const valMoment = moment(val);
                  const todayMoment = moment();

                  if (valMoment.isSame(todayMoment, 'day')) {
                    return todayId;
                  }
                  if (
                    valMoment.isSame(
                      todayMoment.clone().subtract(1, 'day'),
                      'day',
                    )
                  ) {
                    return 'yesterday';
                  }
                  if (
                    valMoment.isSame(todayMoment.clone().add(1, 'day'), 'day')
                  ) {
                    return 'tomorrow';
                  }

                  return undefined;
                })(),
                options: quickSelectOptions,
              }
            : undefined
        }
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

const InnerRangeCalendarPlayground = ({
  mode = 'day',
}: {
  mode: CalendarMode;
}) => {
  const formats = {
    day: 'YYYY-MM-DD',
    week: 'gggg-wo',
    month: 'YYYY-MM',
    year: 'YYYY',
    quarter: 'YYYY-[Q]Q',
    'half-year': 'YYYY-[Q]Q',
  };
  const initialReferenceDate = useMemo(() => moment().toISOString(), []);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // Final confirmed values
  const [confirmedStartVal, setConfirmedStartVal] = useState<DateType>();
  const [confirmedEndVal, setConfirmedEndVal] = useState<DateType>();

  // Temporary selection values
  const [tempStartVal, setTempStartVal] = useState<DateType>();
  const [tempEndVal, setTempEndVal] = useState<DateType>();

  const formatValue = (value: DateType | undefined) => {
    if (!value) return '';
    const formatted = moment(value).format(formats[mode]);

    if (mode === 'half-year') {
      return formatted.replace(/Q([1-4])/, (_, quarter) => {
        const q = parseInt(quarter, 10);
        const halfYear = Math.ceil(q / 2);
        return `H${halfYear}`;
      });
    }

    return formatted;
  };

  const handleChange = (target: DateType) => {
    if (!tempStartVal || (tempStartVal && tempEndVal)) {
      // Start new selection
      setTempStartVal(target);
      setTempEndVal(undefined);
    } else {
      // Set end value
      const start = moment(tempStartVal);
      const end = moment(target);

      if (end.isBefore(start)) {
        setTempStartVal(target);
        setTempEndVal(tempStartVal);
      } else {
        setTempEndVal(target);
      }
    }
  };

  const handleOk = () => {
    // Apply temporary selection to confirmed values
    setConfirmedStartVal(tempStartVal);
    setConfirmedEndVal(tempEndVal);
  };

  const handleCancel = () => {
    // Revert to confirmed values
    setTempStartVal(confirmedStartVal);
    setTempEndVal(confirmedEndVal);
  };

  const isDateInRange = (date: DateType) => {
    if (!tempStartVal || !tempEndVal) return false;
    const granularity = mode === 'half-year' ? 'quarter' : (mode as any);
    return moment(date).isBetween(tempStartVal, tempEndVal, granularity, '[]');
  };

  const quickSelectOptions = [
    {
      id: 'lastWeek',
      name: 'Last 7 Days',
      onClick: () => {
        const end = moment();
        const start = moment().subtract(7, 'days');
        setTempStartVal(start.toISOString());
        setTempEndVal(end.toISOString());
      },
    },
    {
      id: 'lastMonth',
      name: 'Last 30 Days',
      onClick: () => {
        const end = moment();
        const start = moment().subtract(30, 'days');
        setTempStartVal(start.toISOString());
        setTempEndVal(end.toISOString());
      },
    },
  ];

  return (
    <>
      <Toggle
        checked={showQuickSelect}
        label="Enabled QuickSelect"
        onClick={() => setShowQuickSelect((prev) => !prev)}
      />
      <Typography style={{ margin: '0 0 12px 0' }}>
        {`Confirmed Range: ${formatValue(confirmedStartVal)} ~ ${formatValue(confirmedEndVal)}`}
      </Typography>
      <Typography style={{ margin: '0 0 12px 0', color: '#999' }}>
        {`Current Selection: ${formatValue(tempStartVal)} ~ ${formatValue(tempEndVal)}`}
      </Typography>
      <RangeCalendar
        mode={mode}
        onChange={handleChange}
        referenceDate={
          tempStartVal || confirmedStartVal || initialReferenceDate
        }
        value={
          tempStartVal && tempEndVal
            ? [tempStartVal, tempEndVal]
            : tempStartVal
              ? [tempStartVal]
              : undefined
        }
        isDateInRange={isDateInRange}
        isMonthInRange={isDateInRange}
        isWeekInRange={isDateInRange}
        isYearInRange={isDateInRange}
        isQuarterInRange={isDateInRange}
        isHalfYearInRange={isDateInRange}
        actions={{
          primaryButtonProps: {
            children: 'Ok',
            onClick: handleOk,
            disabled: !tempStartVal || !tempEndVal,
          },
          secondaryButtonProps: {
            children: 'Cancel',
            onClick: handleCancel,
          },
        }}
        quickSelect={
          showQuickSelect
            ? {
                activeId: (() => {
                  if (!tempStartVal || !tempEndVal) return undefined;

                  const lastWeekId = 'lastWeek';
                  const lastMonthId = 'lastMonth';
                  const endMoment = moment(tempEndVal);
                  const startMoment = moment(tempStartVal);
                  const todayMoment = moment();

                  if (
                    startMoment.isSame(
                      todayMoment.clone().subtract(7, 'days'),
                      'day',
                    ) &&
                    endMoment.isSame(todayMoment, 'day')
                  ) {
                    return lastWeekId;
                  }

                  if (
                    startMoment.isSame(
                      todayMoment.clone().subtract(30, 'days'),
                      'day',
                    ) &&
                    endMoment.isSame(todayMoment, 'day')
                  ) {
                    return lastMonthId;
                  }

                  return undefined;
                })(),
                options: quickSelectOptions,
              }
            : undefined
        }
      />
    </>
  );
};

type RangeCalendarPlaygroundArgs = Pick<RangeCalendarProps, 'mode'>;
export const RangeCalendarPlayground: StoryFn<RangeCalendarPlaygroundArgs> = ({
  mode = 'day',
}) => (
  <CalendarConfigProvider methods={CalendarMethodsMoment}>
    <InnerRangeCalendarPlayground mode={mode} />
  </CalendarConfigProvider>
);

RangeCalendarPlayground.argTypes = {
  mode: {
    options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
    control: {
      type: 'select',
    },
  },
};

RangeCalendarPlayground.args = {
  mode: 'day',
};
