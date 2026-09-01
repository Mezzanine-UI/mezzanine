import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { DateType } from '@mezzanine-ui/core/calendar';
import { ReactNode } from 'react';
import { cleanup, cleanupHook, renderHook } from '../../__test-utils__';
import { CalendarConfigProvider } from '.';
import {
  UseHasDisabledDateInRangeProps,
  useHasDisabledDateInRange,
} from './useHasDisabledDateInRange';

describe('useHasDisabledDateInRange', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  const renderScan = (props: UseHasDisabledDateInRangeProps) =>
    renderHook(() => useHasDisabledDateInRange(props), { wrapper }).result;

  describe('when no predicate is supplied for the current mode', () => {
    it('should return false without walking the range', () => {
      const isYearDisabled = jest.fn(() => true);
      const { current: hasDisabledDateInRange } = renderScan({
        // Deliberately the wrong mode for the supplied predicate.
        isYearDisabled,
        mode: 'day',
      });

      expect(hasDisabledDateInRange('2006-09-01', '2026-08-31')).toBe(false);
      expect(isYearDisabled).not.toHaveBeenCalled();
    });

    it('should return false when nothing at all is supplied', () => {
      const { current: hasDisabledDateInRange } = renderScan({ mode: 'day' });

      expect(hasDisabledDateInRange('2006-09-01', '2026-08-31')).toBe(false);
    });
  });

  describe('step width', () => {
    it('should consult isDateDisabled once per day in "day" mode', () => {
      const isDateDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled,
        mode: 'day',
      });

      // 2026-08-01 .. 2026-08-31 inclusive.
      expect(hasDisabledDateInRange('2026-08-01', '2026-08-31')).toBe(false);
      expect(isDateDisabled).toHaveBeenCalledTimes(31);
    });

    it('should consult isMonthDisabled once per month, not once per day', () => {
      const isMonthDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isMonthDisabled,
        mode: 'month',
      });

      // 2026-01 .. 2026-12 is twelve months but 365 days.
      expect(hasDisabledDateInRange('2026-01-15', '2026-12-15')).toBe(false);
      expect(isMonthDisabled).toHaveBeenCalledTimes(12);
    });

    it('should consult isYearDisabled once per year, not once per day', () => {
      const isYearDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isYearDisabled,
        mode: 'year',
      });

      // 2006 .. 2026 is 21 years but 7,304 days.
      expect(hasDisabledDateInRange('2006-09-01', '2026-08-31')).toBe(false);
      expect(isYearDisabled).toHaveBeenCalledTimes(21);
    });

    it('should consult isWeekDisabled once per week', () => {
      const isWeekDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isWeekDisabled,
        mode: 'week',
      });

      // Four weeks of coverage, whichever weekday the range starts on.
      expect(hasDisabledDateInRange('2026-08-01', '2026-08-28')).toBe(false);
      expect(isWeekDisabled.mock.calls.length).toBeLessThanOrEqual(5);
      expect(isWeekDisabled.mock.calls.length).toBeGreaterThanOrEqual(4);
    });

    it('should consult isQuarterDisabled once per quarter', () => {
      const isQuarterDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isQuarterDisabled,
        mode: 'quarter',
      });

      expect(hasDisabledDateInRange('2026-01-15', '2026-12-15')).toBe(false);
      expect(isQuarterDisabled).toHaveBeenCalledTimes(4);
    });

    it('should consult isHalfYearDisabled once per half year', () => {
      const isHalfYearDisabled = jest.fn(() => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isHalfYearDisabled,
        mode: 'half-year',
      });

      expect(hasDisabledDateInRange('2026-01-15', '2026-12-15')).toBe(false);
      expect(isHalfYearDisabled).toHaveBeenCalledTimes(2);
    });
  });

  describe('detection', () => {
    it('should return true when a disabled date sits inside the range', () => {
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-08-20',
        mode: 'day',
      });

      expect(hasDisabledDateInRange('2026-08-01', '2026-08-31')).toBe(true);
    });

    it('should return false when the disabled date sits outside the range', () => {
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-09-20',
        mode: 'day',
      });

      expect(hasDisabledDateInRange('2026-08-01', '2026-08-31')).toBe(false);
    });

    it('should accept the range ends in either order', () => {
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-08-20',
        mode: 'day',
      });

      expect(hasDisabledDateInRange('2026-08-31', '2026-08-01')).toBe(true);
    });

    it('should still catch a disabled date on the last day when the ends carry different times', () => {
      const isDateDisabled = jest.fn(
        (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-08-03',
      );
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled,
        mode: 'day',
      });

      expect(
        hasDisabledDateInRange('2026-08-01T10:00:00', '2026-08-03T09:00:00'),
      ).toBe(true);
    });
  });

  describe('argument: bounds', () => {
    it('should not consult the predicate outside the bounds', () => {
      const isDateDisabled = jest.fn((_target: DateType) => false);
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled,
        mode: 'day',
      });

      hasDisabledDateInRange('2006-09-01', '2026-08-31', [
        '2026-08-01',
        '2026-08-31',
      ]);

      expect(isDateDisabled).toHaveBeenCalledTimes(31);
      isDateDisabled.mock.calls.forEach(([target]) => {
        expect(moment(target).format('YYYY-MM')).toBe('2026-08');
      });
    });

    it('should ignore a disabled date that falls outside the bounds', () => {
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2027-03-15',
        mode: 'day',
      });

      expect(hasDisabledDateInRange('2026-08-01', '2027-06-30')).toBe(true);
      expect(
        hasDisabledDateInRange('2026-08-01', '2027-06-30', [
          '2026-08-01',
          '2026-09-30',
        ]),
      ).toBe(false);
    });

    it('should return false when the range and the bounds do not overlap', () => {
      const isDateDisabled = jest.fn(() => true);
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled,
        mode: 'day',
      });

      expect(
        hasDisabledDateInRange('2026-08-01', '2026-08-31', [
          '2027-01-01',
          '2027-01-31',
        ]),
      ).toBe(false);
      expect(isDateDisabled).not.toHaveBeenCalled();
    });

    it('should accept the bounds in either order', () => {
      const { current: hasDisabledDateInRange } = renderScan({
        isDateDisabled: (target: DateType) =>
          moment(target).format('YYYY-MM-DD') === '2026-08-20',
        mode: 'day',
      });

      expect(
        hasDisabledDateInRange('2026-08-01', '2026-08-31', [
          '2026-09-30',
          '2026-08-01',
        ]),
      ).toBe(true);
    });
  });
});
