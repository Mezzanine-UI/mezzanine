import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ReactNode } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import { useDateRangeCalendarControls } from '.';

describe('useDateRangeCalendarControls', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  describe('onNext/onPrev', () => {
    it('should onPrev of the first calendar minus one month on referenceDates when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(0);
    });

    it('should onNext of the first calendar add one month on referenceDates when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(-2);
    });

    it('should onPrev of the second calendar minus one month on referenceDates when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(0);
    });

    it('should onNext of the second calendar add one month on referenceDates when mode="day"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'day',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('day');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(-2);
    });

    it('should onPrev of the first calendar minus one month on referenceDates when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(0);
    });

    it('should onNext of the first calendar add one month on referenceDates when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(-2);
    });

    it('should onPrev of the second calendar minus one month on referenceDates when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(0);
    });

    it('should onNext of the second calendar add one month on referenceDates when mode="week"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'week',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('week');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'month')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'month')).toBe(-2);
    });

    it('should onPrev of the first calendar minus one year on referenceDates when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(0);
    });

    it('should onNext of the first calendar add one year on referenceDates when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(-2);
    });

    it('should onPrev of the second calendar minus one year on referenceDates when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(0);
    });

    it('should onNext of the second calendar add one year on referenceDates when mode="month"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'month',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('month');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(-1);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(-2);
    });

    it('should onPrev of the first calendar minus 10 years on referenceDates when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(12);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(2);
    });

    it('should onNext of the first calendar add 10 years on referenceDates when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(-12);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(-22);
    });

    it('should onPrev of the second calendar minus 10 years on referenceDates when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstPrev,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onFirstPrev();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(12);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(2);
    });

    it('should onNext of the second calendar add 10 years on referenceDates when mode="year"', () => {
      const initialReferenceDate = '2021-10-20';
      const { result } = renderHook(
        () => useDateRangeCalendarControls(
          initialReferenceDate,
          'year',
        ),
        { wrapper },
      );

      const {
        currentMode,
        onFirstNext,
      } = result.current;

      expect(currentMode).toBe('year');

      TestRenderer.act(() => {
        onFirstNext();
      });

      expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(-12);
      expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(-22);
    });

    describe('should guard months and years when switching calendars', () => {
      it('case: first calendar switching month with onNext when mode="day"', () => {
        const initialReferenceDate = '2021-10-20';
        const { result } = renderHook(
          () => useDateRangeCalendarControls(
            initialReferenceDate,
            'day',
          ),
          { wrapper },
        );

        TestRenderer.act(() => {
          result.current.onMonthControlClick();
        });

        expect(result.current.currentMode).toBe('month');

        TestRenderer.act(() => {
          result.current.onFirstNext();
        });

        expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(-1);
      });

      it('case: first calendar switching month with onPrev when mode="day"', () => {
        const initialReferenceDate = '2021-10-20';
        const { result } = renderHook(
          () => useDateRangeCalendarControls(
            initialReferenceDate,
            'day',
          ),
          { wrapper },
        );

        TestRenderer.act(() => {
          result.current.onMonthControlClick();
        });

        expect(result.current.currentMode).toBe('month');

        TestRenderer.act(() => {
          result.current.onFirstPrev();
        });

        expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(1);
      });

      it('case: second calendar switching month with onNext when mode="day"', () => {
        const initialReferenceDate = '2021-10-20';
        const { result } = renderHook(
          () => useDateRangeCalendarControls(
            initialReferenceDate,
            'day',
          ),
          { wrapper },
        );

        TestRenderer.act(() => {
          result.current.onMonthControlClick();
        });

        expect(result.current.currentMode).toBe('month');

        TestRenderer.act(() => {
          result.current.onSecondNext();
        });

        expect(moment(initialReferenceDate).diff(result.current.referenceDates[1], 'year')).toBe(-1);
      });

      it('case: second calendar switching month with onPrev when mode="day"', () => {
        const initialReferenceDate = '2021-10-20';
        const { result } = renderHook(
          () => useDateRangeCalendarControls(
            initialReferenceDate,
            'day',
          ),
          { wrapper },
        );

        TestRenderer.act(() => {
          result.current.onMonthControlClick();
        });

        expect(result.current.currentMode).toBe('month');

        TestRenderer.act(() => {
          result.current.onSecondPrev();
        });

        expect(moment(initialReferenceDate).diff(result.current.referenceDates[0], 'year')).toBe(0);
      });
    });
  });
});
