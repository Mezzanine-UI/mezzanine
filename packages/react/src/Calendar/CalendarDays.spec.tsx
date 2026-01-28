import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { CalendarConfigProvider, CalendarDays, CalendarDaysProps } from '.';

const mockCalendarDayOfWeekRender = jest.fn();

jest.mock('./CalendarDayOfWeek', () => {
  return function MockCalendarDayOfWeek(props: any) {
    mockCalendarDayOfWeekRender(props);
    return <div>Mock Child</div>;
  };
});

describe('<CalendarDays />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDays
          referenceDate={moment().format('YYYY-MM-DD')}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDays referenceDate={moment().format('YYYY-MM-DD')} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: displayWeekDayLocale', () => {
    it('should pass to CalendarDayOfWeek', () => {
      const displayWeekDayLocale = 'zh-TW';

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            displayWeekDayLocale={displayWeekDayLocale}
          />
          ,
        </CalendarConfigProvider>,
      );

      expect(mockCalendarDayOfWeekRender).toHaveBeenCalledWith(
        expect.objectContaining({
          displayWeekDayLocale,
        }),
      );
    });
  });

  describe('prop: isDateDisabled', () => {
    it('should disable Date when matching the condition', () => {
      const testDate = 15;
      const today = moment().date(testDate);
      const isDateDisabled: CalendarDaysProps['isDateDisabled'] = (date) =>
        moment(date).isSame(today, 'date');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            isDateDisabled={isDateDisabled}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(`${testDate}`);

      expect(target.classList.contains('mzn-calendar-button--disabled')).toBe(
        true,
      );
    });
  });

  describe('prop: isDateInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const testRangeStart = 13;
      const testTargetDate = 14;
      const testRangeEnd = 15;
      const rangeStart = moment().date(testRangeStart);
      const rangeEnd = moment().date(testRangeEnd);
      const isDateInRange: CalendarDaysProps['isDateInRange'] = (date) =>
        moment(date).isBetween(rangeStart, rangeEnd, undefined, '[]');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            isDateInRange={isDateInRange}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(`${testTargetDate}`);

      expect(target.classList.contains('mzn-calendar-button--inRange')).toBe(
        true,
      );
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll<HTMLButtonElement>(
        '.mzn-calendar-cell .mzn-calendar-button',
      );

      cellButtons.forEach((btn) => {
        expect(btn.onclick).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            onClick={onClick}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll(
        '.mzn-calendar-cell .mzn-calendar-button',
      );

      cellButtons.forEach((btn) => {
        fireEvent.click(btn);

        expect(onClick).toHaveBeenCalledTimes(1);

        onClick.mockClear();
      });
    });
  });

  describe('prop: onDateHover', () => {
    it('should have no mouseenter handler if onDateHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll<HTMLButtonElement>(
        '.mzn-calendar-cell .mzn-calendar-button',
      );

      cellButtons.forEach((btn) => {
        expect(btn.onmouseenter).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onDateHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            onDateHover={onDateHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll(
        '.mzn-calendar-cell .mzn-calendar-button',
      );

      cellButtons.forEach((btn) => {
        fireEvent.mouseEnter(btn);

        expect(onDateHover).toHaveBeenCalledTimes(1);

        onDateHover.mockClear();
      });
    });
  });

  describe('prop: referenceDate', () => {
    it('should pass to getCalendarGrid method', () => {
      const referenceDate = moment().format('YYYY-MM-DD');
      const getCalendarGridSpy = jest.spyOn(
        CalendarMethodsMoment,
        'getCalendarGrid',
      );

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      expect(getCalendarGridSpy).toHaveBeenCalledWith(referenceDate, 'en-us');
    });
  });

  describe('prop: value', () => {
    it('should have the date matches the value have active class', () => {
      const testDate = 15;
      const value = [moment().date(testDate).format('YYYY-MM-DD')];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment().format('YYYY-MM-DD')}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const activeElements = element.querySelectorAll(
        'mzn-calendar-cell--active',
      );

      activeElements.forEach((activeElement) => {
        expect(activeElement.textContent).toBe(`${testDate}`);
      });
    });
  });
});
