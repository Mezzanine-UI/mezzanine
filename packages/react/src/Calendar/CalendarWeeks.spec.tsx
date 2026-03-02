import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarConfigProvider, CalendarWeeks } from '.';
import { CalendarWeeksProps } from './CalendarWeeks';

const mockCalendarDayOfWeekRender = jest.fn();

jest.mock('./CalendarDayOfWeek', () => {
  return function MockCalendarDayOfWeek(props: any) {
    mockCalendarDayOfWeekRender(props);
    return <div>Mock Child</div>;
  };
});

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
      const displayWeekDayLocale = 'zh-TW';

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
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

  describe('prop: isWeekDisabled', () => {
    it('should disable week when matching the condition', () => {
      const testDate = 15;
      const today = moment().date(testDate);
      const isWeekDisabled: CalendarWeeksProps['isWeekDisabled'] = (date) =>
        moment(date).isSame(today, 'week');

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            isWeekDisabled={isWeekDisabled}
          />
        </CalendarConfigProvider>,
      );

      // Outer week rows are <button.mzn-calendar-button>. Find the one containing day 15.
      const element = getHostHTMLElement();
      const weekButtons = Array.from(
        element.querySelectorAll<HTMLButtonElement>(
          'button.mzn-calendar-button',
        ),
      );
      const buttonElement = weekButtons.find((btn) =>
        [...btn.querySelectorAll('.mzn-calendar-cell')].some(
          (cell) => cell.textContent?.trim() === `${testDate}`,
        ),
      )!;

      expect(
        buttonElement?.classList.contains('mzn-calendar-button--disabled'),
      ).toBe(true);
      expect(buttonElement?.getAttribute('aria-disabled')).toBe('true');
      expect(buttonElement?.getAttribute('disabled')).toBe('');
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

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            isWeekInRange={isWeekInRange}
          />
        </CalendarConfigProvider>,
      );

      // Outer week rows are <button.mzn-calendar-button>. Find the one containing day 14.
      const element = getHostHTMLElement();
      const weekButtons = Array.from(
        element.querySelectorAll<HTMLButtonElement>(
          'button.mzn-calendar-button',
        ),
      );
      const buttonElement = weekButtons.find((btn) =>
        [...btn.querySelectorAll('.mzn-calendar-cell')].some(
          (cell) => cell.textContent?.trim() === `${testTargetDate}`,
        ),
      )!;

      expect(
        buttonElement?.classList.contains('mzn-calendar-button--inRange'),
      ).toBe(true);
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

        expect(onClick).toHaveBeenCalledTimes(1);

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

        expect(onWeekHover).toHaveBeenCalledTimes(1);

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

      expect(getCalendarGridSpy).toHaveBeenCalledWith(referenceDate, 'en-us');
    });
  });

  describe('prop: value', () => {
    it('should have the date matches the value have active class', () => {
      const testDate = 15;
      const value = [moment().date(testDate).format('YYYY-MM-DD')];

      const { getAllByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarWeeks
            referenceDate={moment().format('YYYY-MM-DD')}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      // .at(-1) is the innermost element (div.mzn-calendar-button), which carries the active class.
      const innerButton = getAllByText(`${testDate}`).at(-1)!;

      expect(
        innerButton?.classList.contains('mzn-calendar-button--active'),
      ).toBe(true);
    });
  });
});
