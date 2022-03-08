import moment from 'moment';
import { CalendarMethodsMoment } from '@mezzanine-ui/core/calendar';
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
  CalendarYears,
  CalendarYearsProps,
} from '.';

describe('<CalendarYears />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable(
    'foo',
    (className) => render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarYears
          referenceDate={moment().format('YYYY-MM-DD')}
          className={className}
        />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarYears referenceDate={moment().format('YYYY-MM-DD')} />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-board')).toBeTruthy();
  });

  describe('prop: isYearDisabled', () => {
    it('should disable year when matching the condition', () => {
      const today = moment();
      const isYearDisabled: CalendarYearsProps['isYearDisabled'] = (date) => today.isSame(date, 'year');

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears
            referenceDate={moment().format('YYYY-MM-DD')}
            isYearDisabled={isYearDisabled}
          />
        </CalendarConfigProvider>,
      );

      const buttonElement = getByText(`${today.year()}`);

      expect(buttonElement?.classList.contains('mzn-calendar-button--disabled')).toBe(true);
      expect(buttonElement?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('prop: isYearInRange', () => {
    it('should apply in range style when matching the condition', () => {
      const today = moment();
      const lastYear = moment().year(today.year() - 1);
      const nextYear = moment().year(today.year() + 1);
      const isYearInRange: CalendarYearsProps['isYearInRange'] = (date) => (
        moment(date).isBetween(lastYear, nextYear, undefined, '[]')
      );

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears
            referenceDate={moment().format('YYYY-MM-DD')}
            isYearInRange={isYearInRange}
          />
        </CalendarConfigProvider>,
      );

      const buttonElement = getByText(`${today.year()}`);

      expect(buttonElement?.classList.contains('mzn-calendar-button--inRange')).toBe(true);
    });
  });

  describe('prop: onClick', () => {
    it('should have no click handler if onClick is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears referenceDate={moment().format('YYYY-MM-DD')} />
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
          <CalendarYears
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

  describe('prop: onYearHover', () => {
    it('should have no mouseenter handler if onWeekHover is not provided', () => {
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears referenceDate={moment().format('YYYY-MM-DD')} />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll<HTMLButtonElement>('.mzn-calendar-button');

      buttons.forEach((btn) => {
        expect(btn.onmouseenter).toBe(null);
      });
    });

    it('should bind to every cell button if provided', () => {
      const onYearHover = jest.fn();
      const { getHostHTMLElement } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears
            referenceDate={moment().format('YYYY-MM-DD')}
            onYearHover={onYearHover}
          />
        </CalendarConfigProvider>,
      );
      const element = getHostHTMLElement();
      const buttons = element.querySelectorAll('.mzn-calendar-button');

      buttons.forEach((btn) => {
        fireEvent.mouseEnter(btn);

        expect(onYearHover).toBeCalledTimes(1);

        onYearHover.mockClear();
      });
    });
  });

  describe('prop: value', () => {
    it('should have the date matches the value have active class', () => {
      const value = [moment().format('YYYY-MM-DD')];

      const { getByText } = render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarYears
            referenceDate={moment().format('YYYY-MM-DD')}
            value={value}
          />
        </CalendarConfigProvider>,
      );
      const buttonElement = getByText(`${moment(value[0]).year()}`);

      expect(buttonElement?.classList.contains('mzn-calendar-button--active')).toBe(true);
    });
  });
});
