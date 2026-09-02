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
import RangeCalendar, { RangeCalendarProps } from './RangeCalendar';
import Typography from '../Typography/Typography';
import { useCalendarControls } from './useCalendarControls';
import Toggle from '../Toggle';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import { Temporal } from '@js-temporal/polyfill';
// Register the polyfill so CalendarMethodsTemporal can use globalThis.Temporal.
(globalThis as { Temporal?: unknown }).Temporal = Temporal;
import CalendarMethodsTemporal from '@mezzanine-ui/core/calendarMethodsTemporal';

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
        <div>
          Temporal
          <CalendarConfigProvider
            methods={CalendarMethodsTemporal}
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

export const RangeCalendarDisabledInRange: StoryObj<typeof RangeCalendar> = {
  render: function RangeCalendarDisabledInRange() {
    const value = ['2026-08-05', '2026-09-25'];

    return (
      <CalendarConfigProvider locale="en-US" methods={CalendarMethodsLuxon}>
        <Typography variant="h3">
          Disabled date inside a custom range
        </Typography>
        <Typography variant="body">
          August 20 is disabled. The caller supplies a custom highlight, but the
          range must remain unhighlighted.
        </Typography>
        <RangeCalendar
          isDateDisabled={(target) =>
            moment(target).format('YYYY-MM-DD') === '2026-08-20'
          }
          isDateInRange={(target) =>
            moment(target).isBetween(value[0], value[1], 'day', '[]')
          }
          referenceDate="2026-08-01"
          value={value}
        />
      </CalendarConfigProvider>
    );
  },
};

function RangeCalendarValidationExample({
  initialValue,
  ...props
}: Omit<RangeCalendarProps, 'onChange' | 'value'> & {
  initialValue: DateType[];
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <>
      <button onClick={() => setValue(initialValue)} type="button">
        Reset selection
      </button>
      <Typography variant="body">
        Selected:{' '}
        {value.map((date) => moment(date).format('YYYY-MM-DD')).join(' / ')}
        {value.length === 1 ? ' / awaiting end' : ''}
      </Typography>
      <RangeCalendar
        {...props}
        onChange={([start, end]) => setValue(end ? [start, end] : [start])}
        value={value}
      />
    </>
  );
}

export const RangeCalendarWeekLocale: StoryObj<typeof RangeCalendar> = {
  render: function RangeCalendarWeekLocale() {
    return (
      <CalendarConfigProvider locale="en-US" methods={CalendarMethodsLuxon}>
        <Typography variant="h3">
          Monday-first calendar with a Sunday-first provider
        </Typography>
        <Typography variant="body">
          September 7 is selected; the week starting September 14 is disabled.
          Click September 21. Before review fixes: September 7–27 is submitted.
          After: selection restarts at September 21, awaiting an end.
        </Typography>
        <RangeCalendarValidationExample
          displayWeekDayLocale="en-GB"
          initialValue={['2026-09-07']}
          isWeekDisabled={(date) =>
            moment(date).format('YYYY-MM-DD') === '2026-09-14'
          }
          mode="week"
          referenceDate="2026-09-01"
        />
      </CalendarConfigProvider>
    );
  },
};

export const RangeCalendarScanLimit: StoryObj<typeof RangeCalendar> = {
  render: function RangeCalendarScanLimit() {
    return (
      <CalendarConfigProvider locale="en-US" methods={CalendarMethodsLuxon}>
        <Typography variant="h3">Restricted long-range selection</Typography>
        <Typography variant="body">
          January 1, 2000 is selected; January 1, 2015 is disabled. Click
          September 11, 2020. Before review fixes: the entire range is
          submitted. After: selection restarts at September 11 because the long
          range could not be fully checked. Then click September 12 to complete
          a shorter range.
        </Typography>
        <RangeCalendarValidationExample
          initialValue={['2000-01-01']}
          isDateDisabled={(date) =>
            moment(date).format('YYYY-MM-DD') === '2015-01-01'
          }
          referenceDate="2020-09-01"
        />
      </CalendarConfigProvider>
    );
  },
};
