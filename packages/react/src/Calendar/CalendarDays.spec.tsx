import moment from 'moment';
import { CalendarMethodsMoment } from '@mezzanine-ui/core/calendar';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  cleanup,
  fireEvent,
  render,
  TestRenderer,
} from '../../__test-utils__';
import {
  CalendarConfigProvider,
  CalendarDayOfWeek,
  CalendarDays,
  CalendarDaysProps,
} from '.';

describe('<CalendarDays />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDays
          referenceDate={moment()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDays referenceDate={moment()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: displayWeekDayLocale', () => {
    it('should pass to CalendarDayOfWeek', () => {
      const testInstance = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            displayWeekDayLocale="zh-TW"
          />
          ,
        </CalendarConfigProvider>,
      );

      const calendarDayOfWeekInstance = testInstance.root.findByType(CalendarDayOfWeek);

      expect(calendarDayOfWeekInstance.props.displayWeekDayLocale).toBe('zh-TW');
    });
  });

  describe('prop: isDateDisabled', () => {
    it('should disable Date when matching the condition', () => {
      const testDate = 15;
      const today = moment().date(testDate);
      const isDateDisabled: CalendarDaysProps['isDateDisabled'] = (date) => date.isSame(today, 'date');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            isDateDisabled={isDateDisabled}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(`${testDate}`);

      expect(target.classList.contains('mzn-calendar-button--disabled')).toBe(true);
    });
  });

  describe('prop: isDateInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const testRangeStart = 13;
      const testTargetDate = 14;
      const testRangeEnd = 15;
      const rangeStart = moment().date(testRangeStart);
      const rangeEnd = moment().date(testRangeEnd);
      const isDateInRange: CalendarDaysProps['isDateInRange'] = (date) => (
        date.isBetween(rangeStart, rangeEnd, undefined, '[]')
      );

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            isDateInRange={isDateInRange}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(`${testTargetDate}`);

      expect(target.classList.contains('mzn-calendar-button--inRange')).toBe(true);
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={moment()} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll<HTMLButtonElement>('.mzn-calendar-cell .mzn-calendar-button');

      cellButtons.forEach((btn) => {
        expect(btn.onclick).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            onClick={onClick}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll('.mzn-calendar-cell .mzn-calendar-button');

      cellButtons.forEach((btn) => {
        fireEvent.click(btn);

        expect(onClick).toBeCalledTimes(1);

        onClick.mockClear();
      });
    });
  });

  describe('prop: onDateHover', () => {
    it('should have no mouseenter handler if onDateHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={moment()} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll<HTMLButtonElement>('.mzn-calendar-cell .mzn-calendar-button');

      cellButtons.forEach((btn) => {
        expect(btn.onmouseenter).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onDateHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            onDateHover={onDateHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const cellButtons = element.querySelectorAll('.mzn-calendar-cell .mzn-calendar-button');

      cellButtons.forEach((btn) => {
        fireEvent.mouseEnter(btn);

        expect(onDateHover).toBeCalledTimes(1);

        onDateHover.mockClear();
      });
    });
  });

  describe('prop: referenceDate', () => {
    it('should pass to getCalendarGrid method', () => {
      const referenceDate = moment();
      const getCalendarGridSpy = jest.spyOn(CalendarMethodsMoment, 'getCalendarGrid');

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      expect(getCalendarGridSpy).toBeCalledWith(referenceDate);
    });
  });

  describe('prop: value', () => {
    it('should have the date matches the value have active class', () => {
      const testDate = 15;
      const value = [moment().date(testDate)];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDays
            referenceDate={moment()}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const activeElements = element.querySelectorAll('mzn-calendar-cell--active');

      activeElements.forEach((activeElement) => {
        expect(activeElement.textContent).toBe(`${testDate}`);
      });
    });
  });
});
