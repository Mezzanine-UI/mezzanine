import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { cleanup, render } from '../../__test-utils__';
import { describeHostElementClassNameAppendable } from '../../__test-utils__/common';
import { CalendarDayOfWeek } from '.';
import CalendarConfigProvider from './CalendarContext';

describe('<CalendarDayOfWeek />', () => {
  afterEach(cleanup);

  describeHostElementClassNameAppendable('foo', (className) =>
    render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDayOfWeek className={className} />
      </CalendarConfigProvider>,
    ),
  );

  it('should bind host class', () => {
    const { getHostHTMLElement } = render(
      <CalendarConfigProvider methods={CalendarMethodsMoment}>
        <CalendarDayOfWeek />
      </CalendarConfigProvider>,
    );
    const element = getHostHTMLElement();

    expect(element.classList.contains('mzn-calendar-row')).toBeTruthy();
  });

  describe('prop: displayWeekDayLocale', () => {
    it('should pass to getWeekDayNames function', () => {
      const getWeekDayNamesSpy = jest.spyOn(
        CalendarMethodsMoment,
        'getWeekDayNames',
      );

      render(
        <CalendarConfigProvider methods={CalendarMethodsMoment}>
          <CalendarDayOfWeek displayWeekDayLocale="zh-TW" />
        </CalendarConfigProvider>,
      );

      expect(getWeekDayNamesSpy).toBeCalledWith('zh-TW');
    });
  });
});
