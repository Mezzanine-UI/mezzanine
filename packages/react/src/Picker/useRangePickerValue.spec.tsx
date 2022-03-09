/* global document */
import moment from 'moment';
import CalendarMethodsMoment from '@mezzanine-ui/core/calendarMethodsMoment';
import { ChangeEvent, ReactNode, KeyboardEvent } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { CalendarConfigProvider } from '../Calendar';
import { useRangePickerValue } from '.';

describe('useRangePickerValue', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CalendarConfigProvider methods={CalendarMethodsMoment}>
      {children}
    </CalendarConfigProvider>
  );

  describe('onChange', () => {
    it('case: valid value should be returned', () => {
      const from = '2021-10-20';
      const to = '2021-10-21';
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange([from, to]);

        expect(sortedValue?.[0] ? moment(sortedValue[0]).isSame(from, 'day') : false);
        expect(sortedValue?.[1] ? moment(sortedValue[1]).isSame(to, 'day') : false);
      });
    });

    it('case: wrong ordered value should be sorted in returned value', () => {
      const from = '2021-10-21';
      const to = '2021-10-20';
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange([from, to]);

        expect(sortedValue?.[0] ? moment(sortedValue[0]).isSame(from, 'day') : false);
        expect(sortedValue?.[1] ? moment(sortedValue[1]).isSame(to, 'day') : false);
      });
    });

    it('case: value with only from should be returned with [from, undefind]', () => {
      const from = '2021-10-20';
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange([from, undefined]);

        expect(sortedValue).toBeInstanceOf(Array);
        expect(sortedValue?.[0] ? moment(sortedValue[0]).isSame(from, 'day') : false);
        expect(sortedValue?.[1]).toBe(undefined);
      });
    });

    it('case: value with only to should be returned with [undefined, to]', () => {
      const to = '2021-10-20';
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange([undefined, to]);

        expect(sortedValue).toBeInstanceOf(Array);
        expect(sortedValue?.[0]).toBe(undefined);
        expect(sortedValue?.[1] ? moment(sortedValue[1]).isSame(to, 'day') : false);
      });
    });

    it('case: value with both undefined to should be returned with [undefined, undefined]', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange([undefined, undefined]);

        expect(sortedValue).toBeInstanceOf(Array);
        expect(sortedValue?.[0]).toBe(undefined);
        expect(sortedValue?.[1]).toBe(undefined);
      });
    });

    it('case: value of undefined to should be returned with undefined', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        const sortedValue = result.current.onChange();

        expect(sortedValue).toBe(undefined);
      });
    });
  });

  describe('should guard input order on inputs change', () => {
    it('case: inputFrom should be cleared if inputTo has a prior value to inputFrom', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputFromChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      expect(moment(result.current.value[0]).format('YYYY-MM-DD')).toBe('2021-10-20');

      TestRenderer.act(() => {
        result.current.onInputToChange({ target: { value: '2021-10-17' } } as ChangeEvent<HTMLInputElement>);
      });

      expect(moment(result.current.value[1]).format('YYYY-MM-DD')).toBe('2021-10-17');
      expect(result.current.value[0]).toBe(undefined);
    });

    it('case: inputTo should be cleared if inputFrom has a later value to inputTo', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };
      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputToChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      expect(moment(result.current.value[1]).format('YYYY-MM-DD')).toBe('2021-10-20');

      TestRenderer.act(() => {
        result.current.onInputFromChange({ target: { value: '2021-10-21' } } as ChangeEvent<HTMLInputElement>);
      });

      expect(moment(result.current.value[0]).format('YYYY-MM-DD')).toBe('2021-10-21');
      expect(result.current.value[1]).toBe(undefined);
    });
  });

  describe('on input keydown', () => {
    it('case: inputFrom should get focus when inputFrom keydown and has no value and inputTo has value', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };

      document.body.appendChild(inputFromRef.current);
      document.body.appendChild(inputToRef.current);

      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputToChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onInputFromChange({ target: { value: 'foo' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onFromKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(inputFromRef.current).toEqual(document.activeElement);
    });

    it('case: inputTo should get focus when inputTo keydown and has no value and inputTo has value', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };

      document.body.appendChild(inputFromRef.current);
      document.body.appendChild(inputToRef.current);

      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputFromChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onInputToChange({ target: { value: 'foo' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onToKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(inputToRef.current).toEqual(document.activeElement);
    });

    it('case: inputFrom should get focus if inputTo keydown and inputTo has no value', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };

      document.body.appendChild(inputFromRef.current);
      document.body.appendChild(inputToRef.current);

      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputToChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onToKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(inputFromRef.current).toEqual(document.activeElement);
    });

    it('case: inputTo should get focus if inputFrom keydown and inputTo has no value', () => {
      const inputFromRef = {
        current: document.createElement('input'),
      };
      const inputToRef = {
        current: document.createElement('input'),
      };

      document.body.appendChild(inputFromRef.current);
      document.body.appendChild(inputToRef.current);

      const { result } = renderHook(
        () => useRangePickerValue({
          inputFromRef,
          inputToRef,
          format: 'YYYY-MM-DD',
          formats: ['YYYY-MM-DD'],
        }),
        { wrapper },
      );

      TestRenderer.act(() => {
        result.current.onInputFromChange({ target: { value: '2021-10-20' } } as ChangeEvent<HTMLInputElement>);
      });

      TestRenderer.act(() => {
        result.current.onFromKeyDown({ key: 'Enter' } as KeyboardEvent<HTMLInputElement>);
      });

      expect(inputToRef.current).toEqual(document.activeElement);
    });
  });
});
