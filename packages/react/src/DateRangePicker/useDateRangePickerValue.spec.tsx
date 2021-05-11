import { CalendarMethodsMoment, DateType } from '@mezzanine-ui/core/calendar';
import { ReactNode, KeyboardEvent } from 'react';
import moment from 'moment';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
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
    const value = [moment('2021-10-20'), moment('2021-11-20')] as [DateType, DateType];
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(
      useDateRangePickerValue,
      {
        wrapper,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
          value,
        },
      },
    );

    expect(result.current.value[0]?.format('YYYY-MM-DD')).toBe('2021-10-20');
    expect(result.current.value[1]?.format('YYYY-MM-DD')).toBe('2021-11-20');

    TestRenderer.act(() => {
      result.current.onClear();
    });

    expect(result.current.value[0]).toBe(undefined);
    expect(result.current.value[1]).toBe(undefined);
  });

  it('onFromKeyDown should clear picking value when excape key down', () => {
    const value = [moment('2021-10-20'), moment('2021-11-20')] as [DateType, DateType];
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(
      useDateRangePickerValue,
      {
        wrapper,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
          value,
        },
      },
    );

    TestRenderer.act(() => {
      result.current.onChange([moment('2021-11-20'), moment('2021-12-20')]);
    });

    expect(result.current.value[0]?.format('YYYY-MM-DD')).toBe('2021-11-20');
    expect(result.current.value[1]?.format('YYYY-MM-DD')).toBe('2021-12-20');

    TestRenderer.act(() => {
      result.current.onFromKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.value[0]?.format('YYYY-MM-DD')).toBe('2021-10-20');
    expect(result.current.value[1]?.format('YYYY-MM-DD')).toBe('2021-11-20');
  });

  it('onToKeyDown should clear picking value when excape key down', () => {
    const value = [moment('2021-10-20'), moment('2021-11-20')] as [DateType, DateType];
    const inputFromElement = document.createElement('input');
    const inputToElement = document.createElement('input');
    const inputFromRef = {
      current: inputFromElement,
    };
    const inputToRef = {
      current: inputToElement,
    };

    const { result } = renderHook(
      useDateRangePickerValue,
      {
        wrapper,
        initialProps: {
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
          value,
        },
      },
    );

    TestRenderer.act(() => {
      result.current.onChange([moment('2021-11-20'), moment('2021-12-20')]);
    });

    expect(result.current.value[0]?.format('YYYY-MM-DD')).toBe('2021-11-20');
    expect(result.current.value[1]?.format('YYYY-MM-DD')).toBe('2021-12-20');

    TestRenderer.act(() => {
      result.current.onToKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>);
    });

    expect(result.current.value[0]?.format('YYYY-MM-DD')).toBe('2021-10-20');
    expect(result.current.value[1]?.format('YYYY-MM-DD')).toBe('2021-11-20');
  });

  describe('prop: onChange', () => {
    it('should be invoked when inputFrom keydown and has both value', () => {
      const value = [moment('2021-10-20'), moment('2021-11-20')] as [DateType, DateType];
      const onChange = jest.fn();
      const inputFromElement = document.createElement('input');
      const inputToElement = document.createElement('input');
      const inputFromRef = {
        current: inputFromElement,
      };
      const inputToRef = {
        current: inputToElement,
      };

      const { result } = renderHook(
        useDateRangePickerValue,
        {
          wrapper,
          initialProps: {
            inputFromRef,
            inputToRef,
            format: 'YYYY-MM-DD',
            formats: ['YYYY-MM-DD'],
            value,
            onChange,
          },
        },
      );

      TestRenderer.act(() => {
        result.current.onFromKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(onChange).toBeCalledTimes(1);
    });

    it('should be invoked when inputTo keydown and has both value', () => {
      const value = [moment('2021-10-20'), moment('2021-11-20')] as [DateType, DateType];
      const onChange = jest.fn();
      const inputFromElement = document.createElement('input');
      const inputToElement = document.createElement('input');
      const inputFromRef = {
        current: inputFromElement,
      };
      const inputToRef = {
        current: inputToElement,
      };

      const { result } = renderHook(
        useDateRangePickerValue,
        {
          wrapper,
          initialProps: {
            inputFromRef,
            inputToRef,
            format: 'YYYY-MM-DD',
            formats: ['YYYY-MM-DD'],
            value,
            onChange,
          },
        },
      );

      TestRenderer.act(() => {
        result.current.onToKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(onChange).toBeCalledTimes(1);
    });
  });
});
