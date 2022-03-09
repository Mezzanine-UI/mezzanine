/* global document */
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import {
  ChangeEvent, ReactNode, KeyboardEvent, FocusEvent,
} from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import { usePickerValue, UsePickerValueProps } from '.';

describe('usePickerValue', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children?: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  describe('onChange', () => {
    it('should set value and inputValue', () => {
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onChange('2021-10-20');
      });

      expect(moment(result.current.value)?.format('YYYY-MM-DD')).toBe('2021-10-20');
      expect(result.current.inputValue).toBe('2021-10-20');
    });

    it('should set value and inputValue if pass in undefined', () => {
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onChange();
      });

      expect(result.current.value).toBe(undefined);
      expect(result.current.inputValue).toBe('');
    });
  });

  describe('should update value if pass-in value changed', () => {
    it('case: valid value', () => {
      jest.useFakeTimers();

      const value = '2021-10-20';
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result, rerender } = renderHook<UsePickerValueProps, ReturnType<typeof usePickerValue>>(
        usePickerValue,
        {
          wrapper,
          initialProps: {
            inputRef,
            format: 'YYYY-MM-DD',
            formats: ['YYYY-MM-DD'],
            value,
          },
        },
      );

      rerender({
        inputRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        value: moment(value).add(1, 'month').toISOString(),
      });

      expect(moment(result.current.value)?.format('YYYY-MM-DD')).toBe('2021-11-20');
    });

    it('case: undefined', () => {
      const value = '2021-10-20';
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result, rerender } = renderHook<UsePickerValueProps, ReturnType<typeof usePickerValue>>(
        usePickerValue,
        {
          wrapper,
          initialProps: {
            inputRef,
            format: 'YYYY-MM-DD',
            formats: ['YYYY-MM-DD'],
            value,
          },
        },
      );

      rerender({
        inputRef,
        format: 'YYYY-MM-DD',
        formats: ['YYYY-MM-DD'],
        value: undefined,
      });

      expect(result.current.value).toBe(undefined);
    });
  });

  describe('should guard input value format', () => {
    it('clear input value on blur if invalid', () => {
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputChange({ target: { value: 'foo' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onBlur({} as FocusEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe('');
    });

    it('clear input value on keydown if invalid', () => {
      const inputRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputChange({ target: { value: 'foo' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe('');

      TestRenderer.act(() => {
        result.current.onInputChange({ target: { value: 'foo' } } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe('foo');

      TestRenderer.act(() => {
        result.current.onKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe('');
    });
  });

  describe('should blur input when keydown', () => {
    it('case: enter key down', () => {
      const inputElement = document.createElement('input');

      document.body.appendChild(inputElement);

      const inputRef = {
        current: inputElement,
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      inputElement.focus();

      expect(document.activeElement).toBe(inputElement);

      TestRenderer.act(() => {
        result.current.onKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(document.activeElement).not.toBe(inputElement);
    });

    it('case: escape key down', () => {
      const inputElement = document.createElement('input');

      document.body.appendChild(inputElement);

      const inputRef = {
        current: inputElement,
      };
      const { result } = renderHook(
        () => usePickerValue({
          inputRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      inputElement.focus();

      expect(document.activeElement).toBe(inputElement);

      TestRenderer.act(() => {
        result.current.onKeyDown({ key: 'Escape' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(document.activeElement).not.toBe(inputElement);
    });
  });
});
