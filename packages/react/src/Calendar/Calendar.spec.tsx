import moment from 'moment';
import {
  CalendarMode,
  calendarYearModuler,
  getYearRange,
} from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import {
  describeForwardRefToHTMLElement,
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import Calendar, {
  CalendarConfigProvider,
  CalendarDays,
  CalendarMonths,
  CalendarWeeks,
  CalendarYears,
} from '.';

// Mock Calendar Component
const mockCalendarDaysRender = jest.fn();
const mockCalendarMonthsRender = jest.fn();
const mockCalendarWeeksRender = jest.fn();
const mockCalendarYearsRender = jest.fn();

jest.mock('./CalendarDays', () => {
  return function MockCalendarDays(props: any) {
    mockCalendarDaysRender(props);
    return <div data-testid="mock-calendar-days">Mock Child</div>;
  };
});

jest.mock('./CalendarMonths', () => {
  return function MockCalendarMonths(props: any) {
    mockCalendarMonthsRender(props);
    return <div data-testid="mock-calendar-months">Mock Child</div>;
  };
});

jest.mock('./CalendarWeeks', () => {
  return function MockCalendarWeeks(props: any) {
    mockCalendarWeeksRender(props);
    return <div data-testid="mock-calendar-weeks">Mock Child</div>;
  };
});

jest.mock('./CalendarYears', () => {
  return function MockCalendarYears(props: any) {
    mockCalendarYearsRender(props);
    return <div data-testid="mock-calendar-years">Mock Child</div>;
  };
});

const modes: CalendarMode[] = ['day', 'month', 'week', 'year'];
const calendars = {
  day: CalendarDays,
  month: CalendarMonths,
  week: CalendarWeeks,
  year: CalendarYears,
};

describe('<Calendar />', () => {
  afterEach(cleanup);

  describeForwardRefToHTMLElement(HTMLDivElement, (ref) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar ref={ref} referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    ),
  );

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar
          referenceDate={moment().toISOString()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <Calendar referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar')).toBeTruthy();
  });

  describe('prop: mode', () => {
    beforeEach(() => {
      mockCalendarDaysRender.mockClear();
      mockCalendarMonthsRender.mockClear();
      mockCalendarWeeksRender.mockClear();
      mockCalendarYearsRender.mockClear();
    });

    it('default to "day"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarDaysRender).toHaveBeenCalledTimes(1);
    });

    it('should render CalendarMonths when mode="month"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="month" />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarMonthsRender).toHaveBeenCalledTimes(1);
    });

    it('should render CalendarWeeks when mode="week"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="week" />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarWeeksRender).toHaveBeenCalledTimes(1);
    });

    it('should render CalendarYears when mode="year"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="year" />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarYearsRender).toHaveBeenCalledTimes(1);
    });

    describe('props should be passed to corresponded calendar', () => {
      it('case: mode="day"', () => {
        const isDateDisabled = jest.fn();
        const isDateInRange = jest.fn();
        const onChange = jest.fn();
        const onDateHover = jest.fn();
        const referenceDate = moment().toISOString();
        const displayWeekDayLocale = 'zh-TW';
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="day"
              referenceDate={referenceDate}
              isDateDisabled={isDateDisabled}
              isDateInRange={isDateInRange}
              onDateHover={onDateHover}
              displayWeekDayLocale={displayWeekDayLocale}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarDaysRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isDateDisabled,
            isDateInRange,
            onClick: onChange,
            onDateHover,
            referenceDate,
            displayWeekDayLocale,
          }),
        );
      });

      it('case: mode="week"', () => {
        const isWeekDisabled = jest.fn();
        const isWeekInRange = jest.fn();
        const onChange = jest.fn();
        const onWeekHover = jest.fn();
        const referenceDate = moment().toISOString();
        const displayWeekDayLocale = 'zh-TW';
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="week"
              referenceDate={referenceDate}
              isWeekDisabled={isWeekDisabled}
              isWeekInRange={isWeekInRange}
              onWeekHover={onWeekHover}
              displayWeekDayLocale={displayWeekDayLocale}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarWeeksRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isWeekDisabled,
            isWeekInRange,
            onClick: onChange,
            onWeekHover,
            referenceDate,
            displayWeekDayLocale,
          }),
        );
      });

      it('case: mode="month"', () => {
        const isMonthDisabled = jest.fn();
        const isMonthInRange = jest.fn();
        const onChange = jest.fn();
        const onMonthHover = jest.fn();
        const referenceDate = moment().toISOString();
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="month"
              referenceDate={referenceDate}
              isMonthDisabled={isMonthDisabled}
              isMonthInRange={isMonthInRange}
              onMonthHover={onMonthHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarMonthsRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isMonthDisabled,
            isMonthInRange,
            onClick: onChange,
            onMonthHover,
            referenceDate,
          }),
        );
      });

      it('case: mode="year"', () => {
        const isYearDisabled = jest.fn();
        const isYearInRange = jest.fn();
        const onChange = jest.fn();
        const onYearHover = jest.fn();
        const referenceDate = moment().toISOString();
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="year"
              referenceDate={referenceDate}
              isYearDisabled={isYearDisabled}
              isYearInRange={isYearInRange}
              onYearHover={onYearHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarYearsRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isYearDisabled,
            isYearInRange,
            onClick: onChange,
            onYearHover,
            referenceDate,
          }),
        );
      });
    });

    describe('should have relevant control buttons', () => {
      (['day', 'week'] as CalendarMode[]).forEach((mode) => {
        it(`should have month and year button if mode="${mode}", and receiving event handlers`, () => {
          const referenceDate = moment().toISOString();
          const displayMonthLocale = 'en-US';
          const displayMonthName = CalendarMethodsMoment.getMonthShortName(
            moment(referenceDate).month(),
            displayMonthLocale,
          );
          const onMonthControlClick = jest.fn();
          const onYearControlClick = jest.fn();
          const { getByText } = render(
            <CalendarConfigProvider methods={CalendarMethodsMoment}>
              <Calendar
                mode={mode}
                referenceDate={referenceDate}
                onMonthControlClick={onMonthControlClick}
                onYearControlClick={onYearControlClick}
              />
            </CalendarConfigProvider>,
          );

          const monthControlButton = getByText(displayMonthName);
          const yearControlButton = getByText(moment(referenceDate).year());

          expect(monthControlButton).toBeInstanceOf(HTMLButtonElement);
          expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);

          fireEvent.click(monthControlButton);
          expect(onMonthControlClick).toHaveBeenCalledTimes(1);

          fireEvent.click(yearControlButton);
          expect(onYearControlClick).toHaveBeenCalledTimes(1);
        });
      });

      it('should have year button if mode="month", and receiving event handlers', () => {
        const referenceDate = moment().toISOString();
        const onYearControlClick = jest.fn();
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="month"
              referenceDate={referenceDate}
              onYearControlClick={onYearControlClick}
            />
          </CalendarConfigProvider>,
        );

        const yearControlButton = getByText(moment(referenceDate).year());

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);

        fireEvent.click(yearControlButton);
        expect(onYearControlClick).toHaveBeenCalledTimes(1);
      });

      it('should have a disabled year range button if mode="year"', () => {
        const referenceDate = moment().toISOString();
        const [start, end] = getYearRange(
          moment(referenceDate).year(),
          calendarYearModuler,
        );
        const displayYearRange = `${start} - ${end}`;
        const onYearControlClick = jest.fn();
        const { getByText } = render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="year"
              referenceDate={referenceDate}
              onYearControlClick={onYearControlClick}
            />
          </CalendarConfigProvider>,
        );

        const yearControlButton = getByText(displayYearRange);

        expect(yearControlButton).toBeInstanceOf(HTMLButtonElement);
        expect(yearControlButton.getAttribute('aria-disabled')).toBe('true');
        expect((yearControlButton as HTMLButtonElement).disabled).toBe(true);
      });
    });
  });

  describe('prop: onNext', () => {
    it('CalendarControls should receive onNext if prop provided', () => {
      const onNext = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} onNext={onNext} />
        </CalendarConfigProvider>,
      );
      const hostElement = getHostHTMLElement();
      const nextButtonElement = hostElement.querySelector(
        '.mzn-calendar-controls__next',
      );

      expect(nextButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(nextButtonElement!);

      expect(onNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onPrev', () => {
    it('CalendarControls should receive onPrev if prop provided', () => {
      const onPrev = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} onPrev={onPrev} />
        </CalendarConfigProvider>,
      );
      const hostElement = getHostHTMLElement();
      const prevButtonElement = hostElement.querySelector(
        '.mzn-calendar-controls__prev',
      );

      expect(prevButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(prevButtonElement!);

      expect(onPrev).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: value', () => {
    beforeEach(() => {
      mockCalendarDaysRender.mockClear();
    });

    it('should be casted to array and pass to calendars', () => {
      const value = moment().toISOString();

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="day"
            value={value}
          />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarDaysRender).toHaveBeenCalledWith(
        expect.objectContaining({
          value: [value],
        }),
      );
    });
  });
});
