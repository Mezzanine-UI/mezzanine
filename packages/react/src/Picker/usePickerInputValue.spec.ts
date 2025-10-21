import { ChangeEvent } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { usePickerInputValue } from '.';

describe('usePickerInputValue', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should set value via inputChangeHandler', () => {
    const { result } = renderHook(usePickerInputValue);

    TestRenderer.act(() => {
      result.current.inputChangeHandler({
        target: { value: '2021-10-20' },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inputValue).toBe('2021-10-20');
  });

  describe('prop: onChange', () => {
    it('should be envoke when input changed', () => {
      const onChange = jest.fn();
      const { result } = renderHook(usePickerInputValue, {
        initialProps: {
          onChange,
        },
      });

      TestRenderer.act(() => {
        result.current.inputChangeHandler({
          target: { value: '2021-10-20' },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe('2021-10-20');
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('prop: defaultValue', () => {
    it('initially bind to returned value', () => {
      const { result } = renderHook(usePickerInputValue, {
        initialProps: {
          defaultValue: '2021-10-20',
        },
      });

      expect(result.current.inputValue).toBe('2021-10-20');
    });
  });
});
