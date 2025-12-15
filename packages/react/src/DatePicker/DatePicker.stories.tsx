import { Meta, StoryObj } from '@storybook/react-webpack5';
// import dayjs from 'dayjs';
// import UpdateLocale from 'dayjs/plugin/updateLocale';
import moment from 'moment';
import { DateType, getDefaultModeFormat } from '@mezzanine-ui/core/calendar';
import CalendarMethodsDayjs from '@mezzanine-ui/core/calendarMethodsDayjs';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import CalendarMethodsLuxon from '@mezzanine-ui/core/calendarMethodsLuxon';
import { CSSProperties, useState } from 'react';
import DatePicker from './DatePicker';
import Typography from '../Typography';
import { CalendarConfigProvider } from '../Calendar';

const meta: Meta<typeof DatePicker> = {
  title: 'Data Entry/DatePicker',
  component: DatePicker,
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

/**
 * @NOTE Set week to start on Monday for dayjs and moment
 */
// dayjs.extend(UpdateLocale);
// dayjs.updateLocale('en', {
//   weekStart: 1, // Set week to start on Monday
// });

// moment.updateLocale('en', {
//   week: {
//     dow: 1, // Set week to start on Monday
//   },
// });

export const Playground: Story = {
  args: {
    clearable: false,
    disabled: false,
    error: false,
    format: 'YYYY-MM-DD',
    fullWidth: false,
    mode: 'day',
    placeholder: 'Start Date',
    readOnly: false,
    size: 'main',
  },
  argTypes: {
    mode: {
      options: ['day', 'week', 'month', 'year', 'quarter', 'half-year'],
      control: {
        type: 'select',
      },
    },
    size: {
      options: ['main', 'sub'],
      control: {
        type: 'select',
      },
    },
  },
  render: function Render(args) {
    const [val, setVal] = useState<DateType | undefined>();

    return (
      <CalendarConfigProvider methods={CalendarMethodsDayjs} locale="en-us">
        <Typography variant="h3" style={{ margin: '0 0 12px 0' }}>
          {`Value: ${val || ''}`}
        </Typography>
        <DatePicker
          {...args}
          value={val}
          onChange={setVal}
          errorMessages={{
            enabled: true,
            invalidInput: '輸入字串不正確。',
            invalidPaste: '貼上的內容不正確。',
          }}
        />
      </CalendarConfigProvider>
    );
  },
};

export const Basic: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, setVal] = useState<DateType | undefined>(
      '2025-12-04T16:00:00.000Z',
    );

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Normal
          </Typography>
          <DatePicker value={val} onChange={setVal} />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Disabled
          </Typography>
          <DatePicker value={new Date().toISOString()} disabled />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Error
          </Typography>
          <DatePicker value={new Date().toISOString()} error />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Read only
          </Typography>
          <DatePicker value={new Date().toISOString()} readOnly />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const Method: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [val, setVal] = useState<DateType | undefined>(
      new Date().toISOString(),
    );

    return (
      <>
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              CalendarMethodsMoment
            </Typography>
            <DatePicker value={val} onChange={setVal} />
          </div>
        </CalendarConfigProvider>
        <CalendarConfigProvider methods={CalendarMethodsDayjs}>
          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              CalendarMethodsDayjs
            </Typography>
            <DatePicker value={val} onChange={setVal} />
          </div>
        </CalendarConfigProvider>
        <CalendarConfigProvider methods={CalendarMethodsLuxon}>
          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              CalendarMethodsLuxon
            </Typography>
            <DatePicker value={val} onChange={setVal} />
          </div>
        </CalendarConfigProvider>
      </>
    );
  },
};

export const Sizes: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 24px 0' };
    const typoStyle = { margin: '0 0 12px 0' };
    const [valMain, setValMain] = useState<DateType | undefined>();
    const [valSub, setValSub] = useState<DateType | undefined>();

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Size: Main
          </Typography>
          <DatePicker value={valMain} onChange={setValMain} size="main" />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Size: Sub
          </Typography>
          <DatePicker value={valSub} onChange={setValSub} size="sub" />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const Modes: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 32px 0' };
    const typoStyle = { margin: '0 0 8px 0' };
    const [valD, setValD] = useState<DateType | undefined>();
    const [valW, setValW] = useState<DateType | undefined>();
    const [valM, setValM] = useState<DateType | undefined>();
    const [valY, setValY] = useState<DateType | undefined>();
    const [valQ, setValQ] = useState<DateType | undefined>();
    const [valH, setValH] = useState<DateType | undefined>();

    // Helper function to format values with [H]n support
    const formatWithHalfYear = (value: DateType | undefined, mode: string) => {
      if (!value) return '';
      const format = getDefaultModeFormat(mode as any);
      const m = moment(value);

      // Handle [H]n format for half-year
      if (format === 'YYYY-[H]n') {
        const quarter = m.quarter();
        const halfYear = Math.ceil(quarter / 2); // Q1,Q2→1  Q3,Q4→2
        return m.format('YYYY') + '-H' + halfYear;
      }

      return m.format(format);
    };

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Day
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valD || ''}
format value: ${valD ? moment(valD).format(getDefaultModeFormat('day')) : ''}`}
          </Typography>
          <DatePicker
            value={valD}
            onChange={setValD}
            mode="day"
            format={getDefaultModeFormat('day')}
            placeholder="輸入日期"
          />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Week
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valW || ''}
format value: ${valW ? moment(valW).format(getDefaultModeFormat('week')) : ''}`}
          </Typography>
          <DatePicker
            value={valW}
            onChange={setValW}
            mode="week"
            format={getDefaultModeFormat('week')}
            placeholder="輸入日期"
          />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Month
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valM || ''}
format value: ${valM ? moment(valM).format(getDefaultModeFormat('month')) : ''}`}
          </Typography>
          <DatePicker
            value={valM}
            onChange={setValM}
            mode="month"
            format={getDefaultModeFormat('month')}
            placeholder="輸入日期"
          />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Year
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valY || ''}
format value: ${valY ? moment(valY).format(getDefaultModeFormat('year')) : ''}`}
          </Typography>
          <DatePicker
            value={valY}
            onChange={setValY}
            mode="year"
            format={getDefaultModeFormat('year')}
            placeholder="輸入日期"
          />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Quarter
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valQ || ''}
format value: ${valQ ? moment(valQ).format(getDefaultModeFormat('quarter')) : ''}`}
          </Typography>
          <DatePicker
            value={valQ}
            onChange={setValQ}
            mode="quarter"
            format={getDefaultModeFormat('quarter')}
            placeholder="輸入日期"
          />
        </div>
        <div style={containerStyle}>
          <Typography variant="h3" style={typoStyle}>
            Half year
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`origin value: ${valH || ''}
format value: ${formatWithHalfYear(valH, 'half-year')}`}
          </Typography>
          <DatePicker
            value={valH}
            onChange={setValH}
            mode="half-year"
            format={getDefaultModeFormat('half-year')}
            placeholder="輸入日期"
          />
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const CustomDisable: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 32px 0' };
    const sectionStyle = {
      margin: '0 0 48px 0',
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
    };
    const typoStyle = {
      margin: '0 0 12px 0',
      whiteSpace: 'pre-line',
    } as CSSProperties;

    const [valD, setValD] = useState<DateType | undefined>();
    const [valW, setValW] = useState<DateType | undefined>();
    const [valM, setValM] = useState<DateType | undefined>();
    const [valY, setValY] = useState<DateType | undefined>();
    const [valQ, setValQ] = useState<DateType | undefined>();
    const [valH, setValH] = useState<DateType | undefined>();
    const [valMinMax, setValMinMax] = useState<DateType | undefined>();

    // Define disabled ranges relative to today
    const today = moment();

    // Disable specific date range: 3-7 days from today
    const disabledDatesStart = moment().date(today.date() + 3);
    const disabledDatesEnd = moment().date(today.date() + 7);

    // Disable specific week range: 5 weeks ago to 2 weeks ago
    const disabledWeeksStart = moment().week(today.week() - 5);
    const disabledWeeksEnd = moment().week(today.week() - 2);

    // Disable specific month range: 5 months ago to 1 month ago
    const disabledMonthsStart = moment().month(today.month() - 5);
    const disabledMonthsEnd = moment().month(today.month() - 1);

    // Disable specific year range: 20 years ago to 1 year ago
    const disabledYearsStart = moment().year(today.year() - 20);
    const disabledYearsEnd = moment().year(today.year() - 1);

    // Min/Max date constraints
    const minDate = moment().subtract(30, 'days');
    const maxDate = moment().add(30, 'days');

    // Disable functions
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

    const isQuarterDisabled = (target: DateType) => {
      const q = moment(target).quarter();
      const y = moment(target).year();
      // Disable Q1 and Q2 of current year
      return y === today.year() && (q === 1 || q === 2);
    };

    const isHalfYearDisabled = (target: DateType) => {
      const h = Math.ceil(moment(target).quarter() / 2);
      const y = moment(target).year();
      // Disable H1 of current year
      return y === today.year() && h === 1;
    };

    // Min/Max constraint
    const isDateOutOfRange = (target: DateType) =>
      moment(target).isBefore(minDate, 'day') ||
      moment(target).isAfter(maxDate, 'day');

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            1. Disable Navigation Controls
          </Typography>
          <Typography variant="body" style={typoStyle}>
            Disable month/year switching buttons and navigation arrows. Useful
            when you want to restrict user to current view only.
          </Typography>
          <DatePicker
            value={valD}
            onChange={setValD}
            mode="day"
            format="YYYY-MM-DD"
            fullWidth
            placeholder="Date"
            disabledMonthSwitch
            disabledYearSwitch
            disableOnNext
            disableOnDoubleNext
            disableOnPrev
            disableOnDoublePrev
          />
        </div>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            2. Min/Max Date Range
          </Typography>
          <Typography variant="body" style={typoStyle}>
            {`Only allow dates within a specific range.
Available range: ${minDate.format('YYYY-MM-DD')} ~ ${maxDate.format('YYYY-MM-DD')} (±30 days from today)`}
          </Typography>
          <DatePicker
            value={valMinMax}
            onChange={setValMinMax}
            mode="day"
            format="YYYY-MM-DD"
            fullWidth
            placeholder="Date"
            isDateDisabled={isDateOutOfRange}
          />
        </div>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            3. Mode-specific Disable Examples
          </Typography>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              {`Day: Disable ${disabledDatesStart.format('YYYY-MM-DD')} ~ ${disabledDatesEnd.format('YYYY-MM-DD')}`}
            </Typography>
            <DatePicker
              value={valD}
              onChange={setValD}
              mode="day"
              format={getDefaultModeFormat('day')}
              placeholder="Date"
              isDateDisabled={isDateDisabled}
            />
          </div>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              {`Week: Disable ${disabledWeeksStart.format('YYYY-MM-DD')} ~ ${disabledWeeksEnd.format('YYYY-MM-DD')}`}
            </Typography>
            <DatePicker
              value={valW}
              onChange={setValW}
              mode="week"
              format={getDefaultModeFormat('week')}
              placeholder="Week"
              isWeekDisabled={isWeekDisabled}
            />
          </div>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              {`Month: Disable ${disabledMonthsStart.format('YYYY-MM')} ~ ${disabledMonthsEnd.format('YYYY-MM')}`}
            </Typography>
            <DatePicker
              value={valM}
              onChange={setValM}
              mode="month"
              format={getDefaultModeFormat('month')}
              placeholder="Month"
              isMonthDisabled={isMonthDisabled}
            />
          </div>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              {`Year: Disable ${disabledYearsStart.format('YYYY')} ~ ${disabledYearsEnd.format('YYYY')}`}
            </Typography>
            <DatePicker
              value={valY}
              onChange={setValY}
              mode="year"
              format={getDefaultModeFormat('year')}
              placeholder="Year"
              isYearDisabled={isYearDisabled}
            />
          </div>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              Quarter: Disable Q1 and Q2 of current year
            </Typography>
            <DatePicker
              value={valQ}
              onChange={setValQ}
              mode="quarter"
              format={getDefaultModeFormat('quarter')}
              placeholder="Quarter"
              isQuarterDisabled={isQuarterDisabled}
            />
          </div>

          <div style={containerStyle}>
            <Typography variant="h3" style={typoStyle}>
              Half Year: Disable H1 of current year
            </Typography>
            <DatePicker
              value={valH}
              onChange={setValH}
              mode="half-year"
              format={getDefaultModeFormat('half-year')}
              placeholder="Half Year"
              isHalfYearDisabled={isHalfYearDisabled}
            />
          </div>
        </div>
      </CalendarConfigProvider>
    );
  },
};

export const CalendarIntegration: Story = {
  render: function Render() {
    const containerStyle = { margin: '0 0 32px 0' };
    const sectionStyle = {
      margin: '0 0 48px 0',
      padding: '16px',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
    };
    const typoStyle = {
      margin: '0 0 12px 0',
      whiteSpace: 'pre-line',
    } as CSSProperties;

    const [valAnnotation, setValAnnotation] = useState<DateType | undefined>();
    const [valQuickSelect, setValQuickSelect] = useState<
      DateType | undefined
    >();

    const annotationData: Record<
      string,
      {
        value: string;
        color: 'text-success' | 'text-error' | 'text-warning' | 'text-neutral';
      }
    > = {
      [moment().format('YYYY-MM-DD')]: {
        value: '+5.2%',
        color: 'text-success',
      },
      [moment().subtract(1, 'days').format('YYYY-MM-DD')]: {
        value: '-3.1%',
        color: 'text-error',
      },
      [moment().subtract(2, 'days').format('YYYY-MM-DD')]: {
        value: '+1.8%',
        color: 'text-warning',
      },
      [moment().subtract(3, 'days').format('YYYY-MM-DD')]: {
        value: '+8.4%',
        color: 'text-success',
      },
      [moment().subtract(4, 'days').format('YYYY-MM-DD')]: {
        value: '-7.2%',
        color: 'text-error',
      },
      [moment().add(1, 'days').format('YYYY-MM-DD')]: {
        value: '+2.1%',
        color: 'text-warning',
      },
      [moment().add(2, 'days').format('YYYY-MM-DD')]: {
        value: '-0.5%',
        color: 'text-neutral',
      },
      [moment().add(3, 'days').format('YYYY-MM-DD')]: {
        value: '+6.7%',
        color: 'text-success',
      },
    };

    // Quick select options
    const quickSelectOptions = [
      {
        id: 'today',
        name: 'Today',
        onClick: () => setValQuickSelect(moment().toISOString()),
      },
      {
        id: 'yesterday',
        name: 'Yesterday',
        onClick: () =>
          setValQuickSelect(moment().subtract(1, 'day').toISOString()),
      },
      {
        id: 'lastWeek',
        name: 'Last Week',
        onClick: () =>
          setValQuickSelect(moment().subtract(7, 'days').toISOString()),
      },
      {
        id: 'lastMonth',
        name: 'Last Month',
        onClick: () =>
          setValQuickSelect(moment().subtract(1, 'month').toISOString()),
      },
    ];

    const getQuickSelectActiveId = (val?: DateType) => {
      if (!val) return undefined;
      const selected = moment(val);
      const today = moment();

      if (selected.isSame(today, 'day')) return 'today';
      if (selected.isSame(today.clone().subtract(1, 'day'), 'day'))
        return 'yesterday';
      if (selected.isSame(today.clone().subtract(7, 'days'), 'day'))
        return 'lastWeek';
      if (selected.isSame(today.clone().subtract(1, 'month'), 'day'))
        return 'lastMonth';
      return undefined;
    };

    return (
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            1. Date Annotations (renderAnnotations)
          </Typography>
          <Typography variant="body" style={typoStyle}>
            Display additional information on each date cell via calendarProps.
            Perfect for showing metrics, events, or status indicators.
          </Typography>
          <div style={containerStyle}>
            <Typography variant="body" style={typoStyle}>
              Example: Stock market daily changes
            </Typography>
            <DatePicker
              value={valAnnotation}
              onChange={setValAnnotation}
              mode="day"
              format="YYYY-MM-DD"
              placeholder="Date"
              calendarProps={{
                renderAnnotations: (date: DateType) => {
                  const dateKey = moment(date).format('YYYY-MM-DD');
                  return annotationData[dateKey];
                },
              }}
            />
          </div>
        </div>
        <div style={sectionStyle}>
          <Typography variant="h2" style={{ margin: '0 0 16px 0' }}>
            2. Quick Select Options
          </Typography>
          <Typography variant="body" style={typoStyle}>
            Provide shortcut buttons for commonly selected dates via
            calendarProps. Great for improving UX in dashboards and reports.
          </Typography>
          <div style={containerStyle}>
            <Typography variant="body" style={typoStyle}>
              {`Selected: ${valQuickSelect ? moment(valQuickSelect).format('YYYY-MM-DD') : 'None'}`}
            </Typography>
            <DatePicker
              value={valQuickSelect}
              onChange={setValQuickSelect}
              mode="day"
              format="YYYY-MM-DD"
              placeholder="Date"
              calendarProps={{
                quickSelect: {
                  activeId: getQuickSelectActiveId(valQuickSelect),
                  options: quickSelectOptions,
                },
              }}
            />
          </div>
        </div>
      </CalendarConfigProvider>
    );
  },
};
