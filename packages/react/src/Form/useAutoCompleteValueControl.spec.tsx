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
        const { result } = renderHook(
          () => useAutoCompleteValueControl({
            disabledOptionsFilter: false,
            mode,
            onClose,
            options: [{
              id: 'foo',
              name: 'foo',
            }, {
              id: 'bar',
              name: 'bar',
            }],
          }),
        );

        const {
          onChange,
        } = result.current;

        TestRenderer.act(() => {
          onChange({ id: 'foo', name: 'foo' });
        });

        const calledTimes = mode === 'single' ? 1 : 0;

        expect(onClose).toBeCalledTimes(calledTimes);
      });
    });
  });

  it('should set option name when changed on single mode', () => {
    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        mode: 'single',
        options: [{
          id: 'foo',
          name: 'foo',
        }, {
          id: 'bar',
          name: 'bar',
        }],
      }),
    );

    const {
      onChange,
    } = result.current;

    TestRenderer.act(() => {
      onChange({ id: 'foo', name: 'foo' });
    });

    const {
      value,
    } = result.current;

    expect(((value as SelectValue))!.id).toBe('foo');
    expect(((value as SelectValue))!.name).toBe('foo');
  });

  // it('should do nothing when onChange given null', () => {
  //   const { result } = renderHook(
  //     () => useAutoCompleteValueControl({
  //       disabledOptionsFilter: false,
  //       mode: 'single',
  //       options: [{
  //         id: 'foo',
  //         name: 'foo',
  //       }, {
  //         id: 'bar',
  //         name: 'bar',
  //       }],
  //     }),
  //   );

  //   const {
  //     onChange,
  //   } = result.current;

  //   TestRenderer.act(() => {
  //     onChange(null);
  //   });

  //   const {
  //     value,
  //   } = result.current;

  //   expect(value).toBe(null);
  // });

  // it('when disabledOptionsFilter is true, return options directly', () => {
  //   const originOptions = [{
  //     id: 'foo',
  //     name: 'foo',
  //   }, {
  //     id: 'bar',
  //     name: 'bar',
  //   }];
  //   const { result } = renderHook(
  //     () => useAutoCompleteValueControl({
  //       disabledOptionsFilter: true,
  //       mode: 'single',
  //       options: originOptions,
  //     }),
  //   );

  //   const {
  //     options,
  //   } = result.current;

  //   expect(options.length).toBe(originOptions.length);
  // });

  // it('when props onChange is given, should called whenever change event invoked', () => {
  //   let myOption = '';

  //   const onChangeProp = jest.fn<void, [string]>((name) => {
  //     myOption = name;
  //   });

  //   const { result } = renderHook(
  //     () => useAutoCompleteValueControl({
  //       disabledOptionsFilter: false,
  //       onChange: onChangeProp,
  //       mode: 'single',
  //       options: [{
  //         id: 'foo',
  //         name: 'foo',
  //       }, {
  //         id: 'bar',
  //         name: 'bar',
  //       }],
  //     }),
  //   );

  //   const {
  //     onChange,
  //   } = result.current;

  //   TestRenderer.act(() => {
  //     onChange({ id: 'foo', name: 'foo' });
  //   });

  //   expect(myOption).toBe('foo');
  // });
});
