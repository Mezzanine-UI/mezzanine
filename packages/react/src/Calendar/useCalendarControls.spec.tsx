import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ReactNode } from 'react';
import { act, cleanup, cleanupHook, renderHook } from '../../__test-utils__';
import { useCalendarControls, CalendarConfigProvider } from '.';

describe('useCalendarControls', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  describe('prop: mode', () => {
    it('should defualt to "day"', () => {
      const initialReferenceDate = '2021-10-20';

      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate),
        { wrapper },
      );

      const { currentMode } = result.current;

      expect(currentMode).toBe('day');
    });
  });

  describe('onNext/onPrev', () => {
    it('should minus one month on referenceDate when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'day'),
        { wrapper },
      );

      const { currentMode, onPrev } = result.current;

      expect(currentMode).toBe('day');

      act(() => {
        onPrev();
      });

      expect(
        moment(initialReferenceDate).diff(
          result.current.referenceDate,
          'month',
        ),
      ).toBe(1);
    });

    it('should add one month on referenceDate when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'day'),
        { wrapper },
      );

      const { currentMode, onNext } = result.current;

      expect(currentMode).toBe('day');

      act(() => {
        onNext();
      });

      expect(
        moment(initialReferenceDate).diff(
          result.current.referenceDate,
          'month',
        ),
      ).toBe(-1);
    });

    it('should minus one month on referenceDate when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'week'),
        { wrapper },
      );

      const { currentMode, onPrev } = result.current;

      expect(currentMode).toBe('week');

      act(() => {
        onPrev();
      });

      expect(
        moment(initialReferenceDate).diff(
          result.current.referenceDate,
          'month',
        ),
      ).toBe(1);
    });

    it('should add one month on referenceDate when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'week'),
        { wrapper },
      );

      const { currentMode, onNext } = result.current;

      expect(currentMode).toBe('week');

      act(() => {
        onNext();
      });

      expect(
        moment(initialReferenceDate).diff(
          result.current.referenceDate,
          'month',
        ),
      ).toBe(-1);
    });

    it('should minus one year on referenceDate when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'month'),
        { wrapper },
      );

      const { currentMode, onPrev } = result.current;

      expect(currentMode).toBe('month');

      act(() => {
        onPrev();
      });

      expect(
        moment(initialReferenceDate).diff(result.current.referenceDate, 'year'),
      ).toBe(1);
    });

    it('should add one year on referenceDate when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'month'),
        { wrapper },
      );

      const { currentMode, onNext } = result.current;

      expect(currentMode).toBe('month');

      act(() => {
        onNext();
      });

      expect(
        moment(initialReferenceDate).diff(result.current.referenceDate, 'year'),
      ).toBe(-1);
    });

    it('should minus 10 year on referenceDate when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'year'),
        { wrapper },
      );

      const { currentMode, onPrev } = result.current;

      expect(currentMode).toBe('year');

      act(() => {
        onPrev();
      });

      expect(
        moment(initialReferenceDate).diff(result.current.referenceDate, 'year'),
      ).toBe(10);
    });

    it('should add 10 year on referenceDate when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useCalendarControls(initialReferenceDate, 'year'),
        { wrapper },
      );

      const { currentMode, onNext } = result.current;

      expect(currentMode).toBe('year');

      act(() => {
        onNext();
      });

      expect(
        moment(initialReferenceDate).diff(result.current.referenceDate, 'year'),
      ).toBe(-10);
    });
  });
});
