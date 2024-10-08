import { MouseEvent } from 'react';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useAutoCompleteValueControl } from './useAutoCompleteValueControl';
import { SelectValue } from '../Select/typings';

describe('useAutoCompleteValueControl()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  describe('prop: onClose', () => {
    (['single', 'multiple'] as ('single' | 'multiple')[]).forEach((mode) => {
      it(`onClose behavior on mode="${mode}"`, () => {
        const onClose = jest.fn<void, [void]>(() => {});
        const { result } = renderHook(() =>
          useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode,
            onClose,
            options: [
              {
                id: 'foo',
                name: 'foo',
              },
              {
                id: 'bar',
                name: 'bar',
              },
            ],
          }),
        );

        const { onChange } = result.current;

        TestRenderer.act(() => {
          onChange({ id: 'foo', name: 'foo' });
        });

        const calledTimes = mode === 'single' ? 1 : 0;

        expect(onClose).toBeCalledTimes(calledTimes);
      });
    });
  });

  describe('prop: onChange', () => {
    describe('single mode', () => {
      it('should set option value when changed', () => {
        const { result } = renderHook(() =>
          useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode: 'single',
            options: [
              {
                id: 'foo',
                name: 'foo',
              },
              {
                id: 'bar',
                name: 'bar',
              },
            ],
          }),
        );

        const { onChange } = result.current;

        TestRenderer.act(() => {
          onChange({ id: 'foo', name: 'foo' });
        });

        const { value } = result.current;

        expect((value as SelectValue)!.id).toBe('foo');
        expect((value as SelectValue)!.name).toBe('foo');
      });

      it('should do nothing when onChange given null', () => {
        const { result } = renderHook(() =>
          useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode: 'single',
            options: [
              {
                id: 'foo',
                name: 'foo',
              },
              {
                id: 'bar',
                name: 'bar',
              },
            ],
          }),
        );

        const { onChange } = result.current;

        TestRenderer.act(() => {
          onChange(null);
        });

        const { value } = result.current;

        expect(value).toBe(null);
      });
    });

    describe('multiple mode', () => {
      it('should set option value when changed', () => {
        const { result } = renderHook(() =>
          useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode: 'multiple',
            options: [
              {
                id: 'foo',
                name: 'foo',
              },
              {
                id: 'bar',
                name: 'bar',
              },
            ],
          }),
        );

        const { onChange } = result.current;

        TestRenderer.act(() => {
          onChange({ id: 'foo', name: 'foo' });
        });

        const { value } = result.current;

        expect((value as SelectValue[])!.length).toBe(1);
        expect((value as SelectValue[])[0]!.id).toBe('foo');
      });

      it('should do nothing when onChange given null', () => {
        const { result } = renderHook(() =>
          useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode: 'multiple',
            options: [
              {
                id: 'foo',
                name: 'foo',
              },
              {
                id: 'bar',
                name: 'bar',
              },
            ],
          }),
        );

        const { onChange } = result.current;

        TestRenderer.act(() => {
          onChange(null);
        });

        const { value } = result.current;

        expect((value as SelectValue[]).length).toBe(0);
      });
    });
  });

  it('when disabledOptionsFilter is true, return options directly', () => {
    const originOptions = [
      {
        id: 'foo',
        name: 'foo',
      },
      {
        id: 'bar',
        name: 'bar',
      },
    ];
    const { result } = renderHook(() =>
      useAutoCompleteValueControl({
        disabledOptionsFilter: true,
        mode: 'single',
        options: originOptions,
      }),
    );

    const { options } = result.current;

    expect(options.length).toBe(originOptions.length);
  });

  it('when props onChange is given, should called whenever change event invoked', () => {
    let myOption: SelectValue | null = null;

    const onChangeProp = jest.fn<void, [SelectValue]>((newOption) => {
      myOption = newOption;
    });

    const { result } = renderHook(() =>
      useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        onChange: onChangeProp,
        mode: 'single',
        options: [
          {
            id: 'foo',
            name: 'foo',
          },
          {
            id: 'bar',
            name: 'bar',
          },
        ],
      }),
    );

    const { onChange } = result.current;

    TestRenderer.act(() => {
      onChange({ id: 'foo', name: 'foo' });
    });

    expect(myOption!.id).toBe('foo');
  });

  describe('onChangeProp will return null when trig onClear on single mode', () => {
    let myValue: SelectValue | null = null;

    const onChangeProp = jest.fn<void, [SelectValue | null]>((newOption) => {
      myValue = newOption;
    });
    const stopPropagation = jest.fn();

    const { result } = renderHook(() =>
      useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        onChange: onChangeProp,
        mode: 'single',
        options: [
          {
            id: 'foo',
            name: 'foo',
          },
          {
            id: 'bar',
            name: 'bar',
          },
        ],
      }),
    );

    const { onClear } = result.current;

    TestRenderer.act(() => {
      onClear({
        stopPropagation,
      } as unknown as MouseEvent<Element>);
    });

    expect(myValue).toBe(null);
  });

  describe('onChangeProp will return empty array when trig onClear on multiple mode', () => {
    let myValue: SelectValue[] = [];

    const onChangeProp = jest.fn<void, [SelectValue[]]>((newOption) => {
      myValue = newOption;
    });
    const stopPropagation = jest.fn();

    const { result } = renderHook(() =>
      useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        onChange: onChangeProp,
        mode: 'multiple',
        options: [
          {
            id: 'foo',
            name: 'foo',
          },
          {
            id: 'bar',
            name: 'bar',
          },
        ],
      }),
    );

    const { onClear } = result.current;

    TestRenderer.act(() => {
      onClear({
        stopPropagation,
      } as unknown as MouseEvent<Element>);
    });

    expect(myValue.length).toBe(0);
  });
});
