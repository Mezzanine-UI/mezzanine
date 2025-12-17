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
import Calendar, { CalendarConfigProvider } from '.';

// Mock Calendar Component
const mockCalendarDaysRender = jest.fn();
const mockCalendarMonthsRender = jest.fn();
const mockCalendarWeeksRender = jest.fn();
const mockCalendarYearsRender = jest.fn();
const mockCalendarQuartersRender = jest.fn();
const mockCalendarHalfYearsRender = jest.fn();

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

jest.mock('./CalendarQuarters', () => {
  return function MockCalendarQuarters(props: any) {
    mockCalendarQuartersRender(props);
    return <div data-testid="mock-calendar-quarters">Mock Child</div>;
  };
});

jest.mock('./CalendarHalfYears', () => {
  return function MockCalendarHalfYears(props: any) {
    mockCalendarHalfYearsRender(props);
    return <div data-testid="mock-calendar-half-years">Mock Child</div>;
  };
});

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
      mockCalendarQuartersRender.mockClear();
      mockCalendarHalfYearsRender.mockClear();
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

    it('should render CalendarQuarters when mode="quarter"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="quarter" />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarQuartersRender).toHaveBeenCalledTimes(1);
    });

    it('should render CalendarHalfYears when mode="half-year"', () => {
      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="half-year" />
        </CalendarConfigProvider>,
      );

      expect(mockCalendarHalfYearsRender).toHaveBeenCalledTimes(1);
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

      it('case: mode="quarter"', () => {
        const isQuarterDisabled = jest.fn();
        const isQuarterInRange = jest.fn();
        const onChange = jest.fn();
        const onQuarterHover = jest.fn();
        const referenceDate = moment().toISOString();
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="quarter"
              referenceDate={referenceDate}
              isQuarterDisabled={isQuarterDisabled}
              isQuarterInRange={isQuarterInRange}
              onQuarterHover={onQuarterHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarQuartersRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isQuarterDisabled,
            isQuarterInRange,
            onClick: onChange,
            onQuarterHover,
            referenceDate,
          }),
        );
      });

      it('case: mode="half-year"', () => {
        const isHalfYearDisabled = jest.fn();
        const isHalfYearInRange = jest.fn();
        const onChange = jest.fn();
        const onHalfYearHover = jest.fn();
        const referenceDate = moment().toISOString();
        render(
          <CalendarConfigProvider methods={CalendarMethodsMoment}>
            <Calendar
              mode="half-year"
              referenceDate={referenceDate}
              isHalfYearDisabled={isHalfYearDisabled}
              isHalfYearInRange={isHalfYearInRange}
              onHalfYearHover={onHalfYearHover}
              onChange={onChange}
            />
          </CalendarConfigProvider>,
        );

        expect(mockCalendarHalfYearsRender).toHaveBeenCalledWith(
          expect.objectContaining({
            isHalfYearDisabled,
            isHalfYearInRange,
            onClick: onChange,
            onHalfYearHover,
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
    it('CalendarControls should receive onNext if prop provided in day mode', () => {
      const onNext = jest.fn();
      const { getByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="day"
            onNext={onNext}
          />
        </CalendarConfigProvider>,
      );
      const nextButtonElement = getByTitle('Next');

      expect(nextButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(nextButtonElement);

      expect(onNext).toHaveBeenCalledTimes(1);
      expect(onNext).toHaveBeenCalledWith('day');
    });

    it('should not render single next button in year mode', () => {
      const onNext = jest.fn();
      const { queryByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="year"
            onNext={onNext}
          />
        </CalendarConfigProvider>,
      );
      const nextButtonElement = queryByTitle('Next');

      expect(nextButtonElement).toBeNull();
    });
  });

  describe('prop: onPrev', () => {
    it('CalendarControls should receive onPrev if prop provided in day mode', () => {
      const onPrev = jest.fn();
      const { getByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="day"
            onPrev={onPrev}
          />
        </CalendarConfigProvider>,
      );
      const prevButtonElement = getByTitle('Previous');

      expect(prevButtonElement).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(prevButtonElement);

      expect(onPrev).toHaveBeenCalledTimes(1);
      expect(onPrev).toHaveBeenCalledWith('day');
    });

    it('should not render single prev button in month mode', () => {
      const onPrev = jest.fn();
      const { queryByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="month"
            onPrev={onPrev}
          />
        </CalendarConfigProvider>,
      );
      const prevButtonElement = queryByTitle('Previous');

      expect(prevButtonElement).toBeNull();
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

  describe('prop: onDoubleNext', () => {
    it('should receive onDoubleNext handler and call it when double next button clicked', () => {
      const onDoubleNext = jest.fn();
      const { getByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            onDoubleNext={onDoubleNext}
          />
        </CalendarConfigProvider>,
      );
      const doubleNextButton = getByTitle('Double Next');

      expect(doubleNextButton).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(doubleNextButton);

      expect(onDoubleNext).toHaveBeenCalledTimes(1);
      expect(onDoubleNext).toHaveBeenCalledWith('day');
    });
  });

  describe('prop: onDoublePrev', () => {
    it('should receive onDoublePrev handler and call it when double prev button clicked', () => {
      const onDoublePrev = jest.fn();
      const { getByTitle } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            onDoublePrev={onDoublePrev}
          />
        </CalendarConfigProvider>,
      );
      const doublePrevButton = getByTitle('Double Previous');

      expect(doublePrevButton).toBeInstanceOf(HTMLButtonElement);

      fireEvent.click(doublePrevButton);

      expect(onDoublePrev).toHaveBeenCalledTimes(1);
      expect(onDoublePrev).toHaveBeenCalledWith('day');
    });
  });

  describe('prop: disabledFooterControl', () => {
    it('should render footer control by default', () => {
      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="day" />
        </CalendarConfigProvider>,
      );

      expect(getByText('Today')).toBeInstanceOf(HTMLButtonElement);
    });

    it('should not render footer control when disabledFooterControl is true', () => {
      const { queryByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            mode="day"
            disabledFooterControl
          />
        </CalendarConfigProvider>,
      );

      expect(queryByText('Today')).toBeNull();
    });

    it('should render correct footer text for different modes', () => {
      const { getByText, rerender } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="week" />
        </CalendarConfigProvider>,
      );

      expect(getByText('This week')).toBeInstanceOf(HTMLButtonElement);

      rerender(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="month" />
        </CalendarConfigProvider>,
      );

      expect(getByText('This month')).toBeInstanceOf(HTMLButtonElement);

      rerender(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="year" />
        </CalendarConfigProvider>,
      );

      expect(getByText('This year')).toBeInstanceOf(HTMLButtonElement);

      rerender(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="quarter" />
        </CalendarConfigProvider>,
      );

      expect(getByText('This quarter')).toBeInstanceOf(HTMLButtonElement);

      rerender(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} mode="half-year" />
        </CalendarConfigProvider>,
      );

      expect(getByText('This half year')).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('prop: quickSelect', () => {
    it('should render quick select when provided', () => {
      const options = [
        { id: 'today', name: 'Today', onClick: jest.fn() },
        { id: 'yesterday', name: 'Yesterday', onClick: jest.fn() },
      ];

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar
            referenceDate={moment().toISOString()}
            disabledFooterControl
            quickSelect={{
              activeId: 'today',
              options,
            }}
          />
        </CalendarConfigProvider>,
      );

      // Should have Today and Yesterday in quick select
      expect(getByText('Today')).toBeInstanceOf(HTMLSpanElement);
      expect(getByText('Yesterday')).toBeInstanceOf(HTMLSpanElement);
    });

    it('should not render quick select when not provided', () => {
      const { container } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <Calendar referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );

      const quickSelectElement = container.querySelector(
        '.mzn-calendar__quick-select',
      );

      expect(quickSelectElement).toBeNull();
    });
  });
});
