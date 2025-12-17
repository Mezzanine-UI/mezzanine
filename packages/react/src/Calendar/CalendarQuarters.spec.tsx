import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarConfigProvider } from '.';
import CalendarQuarters from './CalendarQuarters';

describe('<CalendarQuarters />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarQuarters
          referenceDate={moment().toISOString()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarQuarters referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: isQuarterDisabled', () => {
    it('should disable quarter when matching the condition', () => {
      const referenceDate = '2021-06-15';
      const isQuarterDisabled = (date: string) => {
        return moment(date).quarter() === 2;
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters
            referenceDate={referenceDate}
            isQuarterDisabled={isQuarterDisabled}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const q2Buttons = Array.from(buttons).filter(
        (btn) => btn.textContent === 'Q2',
      );

      q2Buttons.forEach((btn) => {
        expect(btn.disabled).toBe(true);
        expect(btn.classList.contains('mzn-calendar-button--disabled')).toBe(
          true,
        );
      });
    });
  });

  describe('prop: isQuarterInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const referenceDate = moment().toISOString();
      const quarterStart = moment().quarter(2).startOf('quarter');
      const quarterEnd = moment().quarter(2).endOf('quarter');
      const isQuarterInRange = (date: string) =>
        moment(date).isBetween(quarterStart, quarterEnd, undefined, '[]');

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters
            referenceDate={referenceDate}
            isQuarterInRange={isQuarterInRange}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('.mzn-calendar-button--inRange');
      const q2Buttons = Array.from(buttons).filter(
        (btn) => btn.textContent === 'Q2',
      );

      expect(q2Buttons.length).toBeGreaterThan(0);
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const [firstButton] = element.getElementsByTagName('button');

      expect(() => {
        fireEvent.click(firstButton);
      }).not.toThrow();
    });

    it('should bind to every cell button if provided', () => {
      const onClick = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters
            referenceDate={moment().toISOString()}
            onClick={onClick}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const q1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'Q1',
      )!;

      fireEvent.click(q1Button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: onQuarterHover', () => {
    it('should have no mouseenter handler if onQuarterHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const [firstButton] = element.getElementsByTagName('button');

      expect(() => {
        fireEvent.mouseEnter(firstButton);
      }).not.toThrow();
    });

    it('should bind to every cell button if provided', () => {
      const onQuarterHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters
            referenceDate={moment().toISOString()}
            onQuarterHover={onQuarterHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const q1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'Q1',
      )!;

      fireEvent.mouseEnter(q1Button);

      expect(onQuarterHover).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: value', () => {
    it('should have the quarter matches the value have active class', () => {
      const referenceDate = moment().toISOString();
      const value = [moment().quarter(1).toISOString()]; // Q1 of current year

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarQuarters referenceDate={referenceDate} value={value} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const activeButtons = element.querySelectorAll(
        '.mzn-calendar-button--active',
      );

      // Should have at least one active button (Q1)
      expect(activeButtons.length).toBeGreaterThan(0);
    });
  });
});
