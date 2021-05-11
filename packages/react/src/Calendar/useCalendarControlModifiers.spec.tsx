import moment from 'moment';
import { CalendarMethodsMoment } from '@mezzanine-ui/core/calendar';
import { ReactNode } from 'react';
import {
  renderHook,
} from '../../__test-utils__';
import { useCalendarControlModifiers, CalendarConfigProvider } from '.';

describe('useCalendarControlModifiers', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );
  const renderResult = renderHook(useCalendarControlModifiers, { wrapper });
  const {
    year,
    month,
    week,
    day,
  } = renderResult.result.current;

  it('should add or remove 12 years for year modifier', () => {
    const current = moment();
    const [minus, add] = year;

    expect(current.diff(add(current), 'year')).toBe(-12);
    expect(current.diff(minus(current), 'year')).toBe(12);
  });

  it('should add or remove 1 year for month modifier', () => {
    const current = moment();
    const [minus, add] = month;

    expect(current.diff(add(current), 'year')).toBe(-1);
    expect(current.diff(minus(current), 'year')).toBe(1);
  });

  it('should add or remove 1 month for week modifier', () => {
    const current = moment();
    const [minus, add] = week;

    expect(current.diff(add(current), 'month')).toBe(-1);
    expect(current.diff(minus(current), 'month')).toBe(1);
  });

  it('should add or remove 1 month for day modifier', () => {
    const current = moment();
    const [minus, add] = day;

    expect(current.diff(add(current), 'month')).toBe(-1);
    expect(current.diff(minus(current), 'month')).toBe(1);
  });
});
