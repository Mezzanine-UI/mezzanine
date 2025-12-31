import { Meta, StoryObj } from '@storybook/react-webpack5';
import moment from 'moment';
import {
  CalendarLocale,
  CalendarLocaleValue,
  CalendarMode,
  DateType,
  getDefaultModeFormat,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { useMemo, useState } from 'react';
import CalendarConfigProvider from './CalendarContext';
import Calendar from './Calendar';
import RangeCalendar from './RangeCalendar';
import Typography from '../Typography/Typography';
import { useCalendarControls } from './useCalendarControls';
import Toggle from '../Toggle';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';

const meta: Meta<typeof Calendar> = {
  title: 'Internal/Calendar',
  component: Calendar,
};

export default meta;

type Story = StoryObj<typeof Calendar>;

const InnerCalendarPlayground = ({
  mode = 'day',
  locale = CalendarLocale.EN_US,
}: {
  mode: CalendarMode;
  locale?: CalendarLocaleValue;
}) => {
  const formats = {
    day: getDefaultModeFormat('day', locale),
    week: getDefaultModeFormat('week', locale),
    month: getDefaultModeFormat('month', locale),
    year: getDefaultModeFormat('year', locale),
    quarter: getDefaultModeFormat('quarter', locale),
    'half-year': getDefaultModeFormat('half-year', locale),
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
    const format = formats[mode];
    const m = moment(value);

    // Handle [H]n format for half-year
    if (format === 'YYYY-[H]n') {
      const quarter = m.quarter();
      const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
      return m.format('YYYY') + '-H' + halfYear;
    }

    return m.format(format);
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
      {mode === 'day' && (
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
        </>
      )}
      <Typography style={{ margin: '0 0 12px 0' }}>
        {`original value: ${val},
        formatted value: ${formatValue(val)}`}
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

export const CalendarPlayground: Story = {
  args: {
    mode: 'day',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
  },
  render: function Render({ mode = 'day' }) {
    const locale = CalendarLocale.EN_US;

    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          gap: '12px',
        }}
      >
        <div>
          Moment
          <CalendarConfigProvider
            methods={CalendarMethodsMoment}
            locale={locale}
          >
            <InnerCalendarPlayground mode={mode} locale={locale} />
          </CalendarConfigProvider>
        </div>
        <div>
          Dayjs
          <CalendarConfigProvider
            methods={CalendarMethodsDayjs}
            locale={locale}
          >
            <InnerCalendarPlayground mode={mode} locale={locale} />
          </CalendarConfigProvider>
        </div>
        <div>
          Luxon
          <CalendarConfigProvider
            methods={CalendarMethodsLuxon}
            locale={locale}
          >
            <InnerCalendarPlayground mode={mode} locale={locale} />
          </CalendarConfigProvider>
        </div>
      </div>
    );
  },
};

const InnerRangeCalendarPlayground = ({
  mode = 'day',
  locale,
}: {
  mode: CalendarMode;
  locale?: string;
}) => {
  const formats = {
    day: getDefaultModeFormat('day', locale),
    week: getDefaultModeFormat('week', locale),
    month: getDefaultModeFormat('month', locale),
    year: getDefaultModeFormat('year', locale),
    quarter: getDefaultModeFormat('quarter', locale),
    'half-year': getDefaultModeFormat('half-year', locale),
  };
  const initialReferenceDate = useMemo(() => moment().toISOString(), []);
  const [showQuickSelect, setShowQuickSelect] = useState(false);

  // Final confirmed values
  const [confirmedStartVal, setConfirmedStartVal] = useState<DateType>();
  const [confirmedEndVal, setConfirmedEndVal] = useState<DateType>();

  // Temporary selection values
  const [tempStartVal, setTempStartVal] = useState<DateType>();
  const [tempEndVal, setTempEndVal] = useState<DateType | undefined>();

  const formatValue = (value: DateType | undefined) => {
    if (!value) return '';
    const format = formats[mode];
    const m = moment(value);

    // Handle [H]n format for half-year
    if (format === 'YYYY-[H]n') {
      const quarter = m.quarter();
      const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
      return m.format('YYYY') + '-H' + halfYear;
    }

    return m.format(format);
  };

  const handleChange = (target: [DateType, DateType | undefined]) => {
    // RangeCalendar already handles sorting and normalization
    // Just use the values as-is
    setTempStartVal(target[0]);
    setTempEndVal(target[1]);
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

    return moment(date).isBetween(tempStartVal, tempEndVal, null, '[]');
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
      {mode === 'day' && (
        <Toggle
          checked={showQuickSelect}
          label="Enabled QuickSelect"
          onClick={() => setShowQuickSelect((prev) => !prev)}
        />
      )}
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

export const RangeCalendarPlayground: StoryObj<typeof RangeCalendar> = {
  args: {
    mode: 'day',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
  },
  render: function Render({ mode = 'day' }) {
    const locale = CalendarLocale.EN_US;

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment} locale={locale}>
        <InnerRangeCalendarPlayground mode={mode} locale={locale} />
      </CalendarConfigProvider>
    );
  },
};
