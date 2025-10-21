/* global document */
import { DateType } from '@mezzanine-ui/core/calendar';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ReactNode, KeyboardEvent } from 'react';
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

  it('onClear should clear picking value', () => {
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

    expect(moment(result.current.value[0])?.format('YYYY-MM-DD')).toBe(
      '2021-10-20',
    );
    expect(moment(result.current.value[1])?.format('YYYY-MM-DD')).toBe(
      '2021-11-20',
    );

    act(() => {
      result.current.onClear();
    });

    expect(result.current.value[0]).toBe(undefined);
    expect(result.current.value[1]).toBe(undefined);
  });

  it('onFromKeyDown should clear picking value when excape key down', () => {
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

    act(() => {
      result.current.onChange(['2021-11-20', '2021-12-20']);
    });

    expect(moment(result.current.value[0])?.format('YYYY-MM-DD')).toBe(
      '2021-11-20',
    );
    expect(moment(result.current.value[1])?.format('YYYY-MM-DD')).toBe(
      '2021-12-20',
    );

    act(() => {
      result.current.onFromKeyDown({
        key: 'Escape',
      } as KeyboardEvent<HTMLInputElement>);
    });

    expect(moment(result.current.value[0])?.format('YYYY-MM-DD')).toBe(
      '2021-10-20',
    );
    expect(moment(result.current.value[1])?.format('YYYY-MM-DD')).toBe(
      '2021-11-20',
    );
  });

  it('onToKeyDown should clear picking value when excape key down', () => {
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

    act(() => {
      result.current.onChange(['2021-11-20', '2021-12-20']);
    });

    expect(moment(result.current.value[0])?.format('YYYY-MM-DD')).toBe(
      '2021-11-20',
    );
    expect(moment(result.current.value[1])?.format('YYYY-MM-DD')).toBe(
      '2021-12-20',
    );

    act(() => {
      result.current.onToKeyDown({
        key: 'Escape',
      } as KeyboardEvent<HTMLInputElement>);
    });

    expect(moment(result.current.value[0])?.format('YYYY-MM-DD')).toBe(
      '2021-10-20',
    );
    expect(moment(result.current.value[1])?.format('YYYY-MM-DD')).toBe(
      '2021-11-20',
    );
  });

  describe('prop: onChange', () => {
    it('should be invoked when inputFrom keydown and has both value', () => {
      const value = ['2021-10-20', '2021-11-20'] as [DateType, DateType];
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
          value,
          onChange,
        },
      });

      act(() => {
        result.current.onFromKeyDown({
          key: 'Enter',
        } as KeyboardEvent<HTMLInputElement>);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('should be invoked when inputTo keydown and has both value', () => {
      const value = ['2021-10-20', '2021-11-20'] as [DateType, DateType];
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
          value,
          onChange,
        },
      });

      act(() => {
        result.current.onToKeyDown({
          key: 'Enter',
        } as KeyboardEvent<HTMLInputElement>);
      });

      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
