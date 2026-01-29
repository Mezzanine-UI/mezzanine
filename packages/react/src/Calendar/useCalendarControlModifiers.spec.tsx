import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ReactNode } from 'react';
import { renderHook } from '../../__test-utils__';
import { useCalendarControlModifiers, CalendarConfigProvider } from '.';

describe('useCalendarControlModifiers', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );
  const renderResult = renderHook(useCalendarControlModifiers, { wrapper });
  const { year, month, week, day } = renderResult.result.current;

  it('should add or remove 20 years for year modifier', () => {
    const current = '2022-01-02';
    const [minus, add] = year.single!;

    expect(moment(current).diff(add(current), 'year')).toBe(-20);
    expect(moment(current).diff(minus(current), 'year')).toBe(20);
  });

  it('should add or remove 1 year for month single modifier', () => {
    const current = '2022-01-02';
    const [minus, add] = month.single!;

    expect(moment(current).diff(add(current), 'year')).toBe(-1);
    expect(moment(current).diff(minus(current), 'year')).toBe(1);
  });

  it('should add or remove 1 month for week single modifier', () => {
    const current = '2022-01-02';
    const [minus, add] = week.single!;

    expect(moment(current).diff(add(current), 'month')).toBe(-1);
    expect(moment(current).diff(minus(current), 'month')).toBe(1);
  });

  it('should add or remove 1 month for day single modifier', () => {
    const current = '2022-01-02';
    const [minus, add] = day.single!;

    expect(moment(current).diff(add(current), 'month')).toBe(-1);
    expect(moment(current).diff(minus(current), 'month')).toBe(1);
  });
});
