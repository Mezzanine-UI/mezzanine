import moment from 'moment';
import { CalendarMethodsMoment } from '@mezzanine-ui/core/calendar';
import { ReactNode } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
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
      const initialReferenceDate = moment('2021-10-20');

      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
        ),
        { wrapper },
      );

      const {
        currentMode,
      } = result.current;

      expect(currentMode).toBe('day');
    });
  });

  describe('onNext/onPrev', () => {
    it('should minus one month on referenceDate when mode="day"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onPrev,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onPrev();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'month')).toBe(1);
    });

    it('should add one month on referenceDate when mode="day"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onNext,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onNext();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'month')).toBe(-1);
    });

    it('should minus one month on referenceDate when mode="week"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onPrev,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onPrev();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'month')).toBe(1);
    });

    it('should add one month on referenceDate when mode="week"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onNext,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onNext();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'month')).toBe(-1);
    });

    it('should minus one year on referenceDate when mode="month"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onPrev,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onPrev();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'year')).toBe(1);
    });

    it('should add one year on referenceDate when mode="month"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onNext,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onNext();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'year')).toBe(-1);
    });

    it('should minus 12 year on referenceDate when mode="year"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onPrev,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onPrev();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'year')).toBe(12);
    });

    it('should add 12 year on referenceDate when mode="year"', () => {
      const initialReferenceDate = moment('2021-10-20');
      const { result } = renderHook(
        () => useCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onNext,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onNext();
      });

      expect(initialReferenceDate.diff(result.current.referenceDate, 'year')).toBe(-12);
    });
  });
});
