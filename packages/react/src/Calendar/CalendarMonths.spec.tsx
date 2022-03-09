import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  cleanup,
  fireEvent,
  render,
} from '../../__test-utils__';
import {
  describeHostElementClassNameAppendable,
} from '../../__test-utils__/common';
import {
  CalendarConfigProvider,
  CalendarMonths,
  CalendarMonthsProps,
} from '.';

describe('<CalendarMonths />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarMonths
          referenceDate={moment().format('YYYY-MM-DD')}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarMonths referenceDate={moment().format('YYYY-MM-DD')} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: displayMonthLocale', () => {
    it('should pass to getMonthShortNames method', () => {
      const getMonthShortNamesSpy = jest.spyOn(CalendarMethodsMoment, 'getMonthShortNames');

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            displayMonthLocale="zh-TW"
          />
        </CalendarConfigProvider>,
      );

      expect(getMonthShortNamesSpy).toBeCalledWith('zh-TW');
    });
  });

  describe('prop: isMonthDisabled', () => {
    it('should disable month when matching the condition', () => {
      const monthNames = CalendarMethodsMoment.getMonthShortNames('en-US');
      const testMonth = 9;
      const testMonthName = monthNames[testMonth];
      const disableMonth = moment().month(testMonth);
      const isMonthDisabled: CalendarMonthsProps['isMonthDisabled'] = (date) => (
        moment(date).isSame(disableMonth, 'month'));

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            isMonthDisabled={isMonthDisabled}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(testMonthName);

      expect(target.classList.contains('mzn-calendar-button--disabled')).toBe(true);
    });
  });

  describe('prop: isMonthInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const monthNames = CalendarMethodsMoment.getMonthShortNames('en-US');
      const testRangeStart = 4;
      const testTargetMonth = 5;
      const testRangeEnd = 6;
      const testTargetName = monthNames[testTargetMonth];
      const rangeStart = moment().month(testRangeStart);
      const rangeEnd = moment().month(testRangeEnd);
      const isMonthInRange: CalendarMonthsProps['isMonthInRange'] = (date) => (
        moment(date).isBetween(rangeStart, rangeEnd, undefined, '[]')
      );

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            isMonthInRange={isMonthInRange}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(testTargetName);

      expect(target.classList.contains('mzn-calendar-button--inRange')).toBe(true);
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll<HTMLButtonElement>('.mzn-calendar-button');

      buttons.forEach((btn) => {
        expect(btn.onclick).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            onClick={onClick}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('.mzn-calendar-button');

      buttons.forEach((btn) => {
        fireEvent.click(btn);

        expect(onClick).toBeCalledTimes(1);

        onClick.mockClear();
      });
    });
  });

  describe('prop: onMonthHover', () => {
    it('should have no mouseenter handler if onMonthHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll<HTMLButtonElement>('.mzn-calendar-button');

      buttons.forEach((btn) => {
        expect(btn.onmouseenter).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onMonthHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            onMonthHover={onMonthHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('.mzn-calendar-button');

      buttons.forEach((btn) => {
        fireEvent.mouseEnter(btn);

        expect(onMonthHover).toBeCalledTimes(1);

        onMonthHover.mockClear();
      });
    });
  });

  describe('prop: value', () => {
    it('should have the month matches the value have active class', () => {
      const monthNames = CalendarMethodsMoment.getMonthShortNames('en-US');
      const testMonth = 9;
      const testMonthName = monthNames[testMonth];
      const value = [moment().month(testMonth).format('YYYY-MM-DD')];

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarMonths
            referenceDate={moment().format('YYYY-MM-DD')}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const activeElements = element.querySelectorAll('mzn-calendar-button--active');

      activeElements.forEach((activeElement) => {
        expect(activeElement.textContent).toBe(testMonthName);
      });
    });
  });
});
