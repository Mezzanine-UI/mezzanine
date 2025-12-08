import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, fireEvent, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarConfigProvider } from '.';
import CalendarHalfYears from './CalendarHalfYears';

describe('<CalendarHalfYears />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarHalfYears
          referenceDate={moment().toISOString()}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarHalfYears referenceDate={moment().toISOString()} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: isHalfYearDisabled', () => {
    it('should disable half year when matching the condition', () => {
      const referenceDate = '2021-06-15';
      const isHalfYearDisabled = (date: string) => {
        const month = moment(date).month();
        return month >= 6; // H2
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears
            referenceDate={referenceDate}
            isHalfYearDisabled={isHalfYearDisabled}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h2Buttons = Array.from(buttons).filter(
        (btn) => btn.textContent === 'H2',
      );

      h2Buttons.forEach((btn) => {
        expect(btn.getAttribute('aria-disabled')).toBe('true');
        expect(btn.classList.contains('mzn-calendar-button--disabled')).toBe(
          true,
        );
      });
    });
  });

  describe('prop: isHalfYearInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const referenceDate = '2021-06-15';
      const isHalfYearInRange = (date: string) => {
        const month = moment(date).month();
        return month < 6; // H1
      };

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears
            referenceDate={referenceDate}
            isHalfYearInRange={isHalfYearInRange}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Buttons = Array.from(buttons).filter(
        (btn) => btn.textContent === 'H1',
      );

      h1Buttons.forEach((btn) => {
        expect(btn.classList.contains('mzn-calendar-button--inRange')).toBe(
          true,
        );
      });
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears referenceDate={moment().toISOString()} />
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
          <CalendarHalfYears
            referenceDate={moment().toISOString()}
            onClick={onClick}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'H1',
      )!;

      fireEvent.click(h1Button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const onClick = jest.fn();
      const isHalfYearDisabled = () => true;

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears
            referenceDate={moment().toISOString()}
            onClick={onClick}
            isHalfYearDisabled={isHalfYearDisabled}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'H1',
      )!;

      fireEvent.click(h1Button);

      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('prop: onHalfYearHover', () => {
    it('should have no mouseenter handler if onHalfYearHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears referenceDate={moment().toISOString()} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const [firstButton] = element.getElementsByTagName('button');

      expect(() => {
        fireEvent.mouseEnter(firstButton);
      }).not.toThrow();
    });

    it('should bind to every cell button if provided', () => {
      const onHalfYearHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears
            referenceDate={moment().toISOString()}
            onHalfYearHover={onHalfYearHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'H1',
      )!;

      fireEvent.mouseEnter(h1Button);

      expect(onHalfYearHover).toHaveBeenCalledTimes(1);
    });

    it('should not call onHalfYearHover when disabled', () => {
      const onHalfYearHover = jest.fn();
      const isHalfYearDisabled = () => true;

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears
            referenceDate={moment().toISOString()}
            onHalfYearHover={onHalfYearHover}
            isHalfYearDisabled={isHalfYearDisabled}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Button = Array.from(buttons).find(
        (btn) => btn.textContent === 'H1',
      )!;

      fireEvent.mouseEnter(h1Button);

      expect(onHalfYearHover).not.toHaveBeenCalled();
    });
  });

  describe('prop: value', () => {
    it('should have the half year matches the value have active class', () => {
      const referenceDate = '2021-06-15';
      const value = [moment('2021-02-01').toISOString()]; // H1 2021

      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarHalfYears referenceDate={referenceDate} value={value} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('button');
      const h1Buttons = Array.from(buttons).filter(
        (btn) => btn.textContent === 'H1',
      );
      const year2021H1Button = h1Buttons.find((btn) => {
        const row = btn.closest('.mzn-calendar-row');
        return row?.textContent?.includes('2021');
      });

      expect(
        year2021H1Button?.classList.contains('mzn-calendar-button--active'),
      ).toBe(true);
    });
  });
});
