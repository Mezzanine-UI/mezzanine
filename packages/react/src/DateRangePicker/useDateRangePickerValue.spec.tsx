/* global document */
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ReactNode } from 'react';
import moment from 'moment';
import { act, cleanup, cleanupHook, renderHook } from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import { useDateRangePickerValue } from '.';

describe('useDateRangePickerValue', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children?: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  it('should display controlled value in inputs', () => {
    const value = ['2021-10-20', '2021-11-20'] as [DateType, DateType];
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(useDateRangePickerValue, {
      wrapper: wrapper as any,
      initialProps: {
        inputFromRef,
        inputToRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        value,
      },
    });

    expect(result.current.inputFromValue).toBe('2021-10-20');
    expect(result.current.inputToValue).toBe('2021-11-20');
  });

  it('onClear should call onChange with undefined (uncontrolled mode)', () => {
    const onChange = jest.fn();
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(useDateRangePickerValue, {
      wrapper: wrapper as any,
      initialProps: {
        inputFromRef,
        inputToRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        onChange,
      },
    });

    // Set some values first using calendar change
    act(() => {
      result.current.onCalendarChange(['2021-10-20', '2021-11-20']);
    });

    expect(result.current.inputFromValue).toBe('2021-10-20');
    expect(result.current.inputToValue).toBe('2021-11-20');

    act(() => {
      result.current.onClear();
    });

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it('onInputFromChange should update from value (uncontrolled mode)', () => {
    const onChange = jest.fn();
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(useDateRangePickerValue, {
      wrapper: wrapper as any,
      initialProps: {
        inputFromRef,
        inputToRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        onChange,
      },
    });

    act(() => {
      result.current.onInputFromChange('2021-12-25');
    });

    expect(result.current.inputFromValue).toBe('2021-12-25');
  });

  it('onInputToChange should update to value (uncontrolled mode)', () => {
    const onChange = jest.fn();
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(useDateRangePickerValue, {
      wrapper: wrapper as any,
      initialProps: {
        inputFromRef,
        inputToRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        onChange,
      },
    });

    act(() => {
      result.current.onInputToChange('2021-12-30');
    });

    expect(result.current.inputToValue).toBe('2021-12-30');
  });

  describe('prop: onChange', () => {
    it('should be invoked when onCalendarChange is called with complete range', () => {
      const onChange = jest.fn();
      const inputFromElement = document.createElement('input');
      const inputToElement = document.createElement('input');
      const inputFromRef = {
        current: inputFromElement,
      };
      const inputToRef = {
        current: inputToElement,
      };

      const { result } = renderHook(useDateRangePickerValue, {
        wrapper: wrapper as any,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
          onChange,
        },
      });

      act(() => {
        // Simulate calendar selection with complete range
        result.current.onCalendarChange(['2021-12-01', '2021-12-15']);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should not be invoked when onCalendarChange is called with incomplete range', () => {
      const onChange = jest.fn();
      const inputFromElement = document.createElement('input');
      const inputToElement = document.createElement('input');
      const inputFromRef = {
        current: inputFromElement,
      };
      const inputToRef = {
        current: inputToElement,
      };

      const { result } = renderHook(useDateRangePickerValue, {
        wrapper: wrapper as any,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
          onChange,
        },
      });

      act(() => {
        // Simulate calendar selection with only start date
        result.current.onCalendarChange(['2021-12-01', undefined]);
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should return calendarValue as array when both values are set', () => {
      const inputFromElement = document.createElement('input');
      const inputToElement = document.createElement('input');
      const inputFromRef = {
        current: inputFromElement,
      };
      const inputToRef = {
        current: inputToElement,
      };

      const { result } = renderHook(useDateRangePickerValue, {
        wrapper: wrapper as any,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        },
      });

      act(() => {
        result.current.onCalendarChange(['2021-12-01', '2021-12-15']);
      });

      expect(Array.isArray(result.current.calendarValue)).toBe(true);
      expect(result.current.calendarValue?.length).toBe(2);
      expect(
        moment(result.current.calendarValue?.[0]).format('YYYY-MM-DD'),
      ).toBe('2021-12-01');
      expect(
        moment(result.current.calendarValue?.[1]).format('YYYY-MM-DD'),
      ).toBe('2021-12-15');
    });
  });
});
