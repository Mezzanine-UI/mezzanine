import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render, TestRenderer } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarConfigProvider, CalendarDayOfWeek, CalendarWeeks } from '.';
import { CalendarWeeksProps } from './CalendarWeeks';

describe('<CalendarWeeks />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarWeeks
          referenceDate={moment().format('YYYY-MM-DD')}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarWeeks referenceDate={moment().format('YYYY-MM-DD')} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: displayWeekDayLocale', () => {
    it('should pass to CalendarDayOfWeek', () => {
      const testInstance = TestRenderer.create(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            displayWeekDayLocale="zh-TW"
          />
          ,
        </CalendarConfigProvider>,
      );

      const calendarDayOfWeekInstance =
        testInstance.root.findByType(CalendarDayOfWeek);

      expect(calendarDayOfWeekInstance.props.displayWeekDayLocale).toBe(
        'zh-TW',
      );
    });
  });

  describe('prop: isWeekDisabled', () => {
    it('should disable week when matching the condition', () => {
      const testDate = 15;
      const today = moment().date(testDate);
      const isWeekDisabled: CalendarWeeksProps['isWeekDisabled'] = (date) =>
        moment(date).isSame(today, 'week');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            isWeekDisabled={isWeekDisabled}
          />
        </CalendarConfigProvider>,
      );

      const cellElement = getByText(`${testDate}`).parentElement!;
      const buttonElement = cellElement.parentElement;

      expect(
        buttonElement?.classList.contains('mzn-calendar-button--disabled'),
      ).toBe(true);
      expect(buttonElement?.getAttribute('aria-disabled')).toBe('true');
      expect(
        cellElement.classList.contains('mzn-calendar-cell--disabled'),
      ).toBe(true);
    });
  });

  describe('prop: isWeekInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const testRangeStart = 7;
      const testTargetDate = 14;
      const testRangeEnd = 21;
      const rangeStart = moment().date(testRangeStart);
      const rangeEnd = moment().date(testRangeEnd);
      const isWeekInRange: CalendarWeeksProps['isWeekInRange'] = (date) =>
        moment(date).isBetween(rangeStart, rangeEnd, undefined, '[]');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            isWeekInRange={isWeekInRange}
          />
        </CalendarConfigProvider>,
      );

      const target = getByText(`${testTargetDate}`).parentElement
        ?.parentElement;

      expect(target?.classList.contains('mzn-calendar-button--inRange')).toBe(
        true,
      );
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll<HTMLButtonElement>(
        '.mzn-calendar-button',
      );

      buttons.forEach((btn) => {
        expect(btn.onclick).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
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

  describe('prop: onWeekHover', () => {
    it('should have no mouseenter handler if onWeekHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll<HTMLButtonElement>(
        '.mzn-calendar-button',
      );

      buttons.forEach((btn) => {
        expect(btn.onmouseenter).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onWeekHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            onWeekHover={onWeekHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('.mzn-calendar-button');

      buttons.forEach((btn) => {
        fireEvent.mouseEnter(btn);

        expect(onWeekHover).toBeCalledTimes(1);

        onWeekHover.mockClear();
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
          <CalendarWeeks referenceDate={referenceDate} />
        </CalendarConfigProvider>,
      );

      expect(getCalendarGridSpy).toBeCalledWith(referenceDate);
    });
  });

  describe('prop: value', () => {
    it('should have the date matches the value have active class', () => {
      const testDate = 15;
      const value = [moment().date(testDate).format('YYYY-MM-DD')];

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      const dateElement = getByText(`${testDate}`);
      const buttonElement = dateElement.parentElement?.parentElement;

      expect(
        buttonElement?.classList.contains('mzn-calendar-button--active'),
      ).toBe(true);
    });
  });
});
