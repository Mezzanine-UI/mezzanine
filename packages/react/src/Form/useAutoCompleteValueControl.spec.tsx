import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useAutoCompleteValueControl } from './useAutoCompleteValueControl';

describe('useAutoCompleteValueControl()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('should onClose called when changed', () => {
    const onClose = jest.fn<void, [void]>(() => {});
    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        onClose,
        options: ['foo', 'bar'],
      }),
    );

    const {
      onChange,
    } = result.current;

    TestRenderer.act(() => {
      onChange({ id: 'foo', name: 'foo' });
    });

    expect(onClose).toBeCalledTimes(1);
  });

  it('should set option name when changed', () => {
    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        options: ['foo', 'bar'],
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

    expect(value!.name).toBe('foo');
  });

  it('should do nothing when onChange given null', () => {
    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        options: ['foo', 'bar'],
      }),
    );

    const {
      onChange,
    } = result.current;

    TestRenderer.act(() => {
      onChange(null);
    });

    const {
      value,
    } = result.current;

    expect(value).toBe(null);
  });

  it('when disabledOptionsFilter is true, return options directly', () => {
    const originOptions = ['foo', 'bar'];
    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: true,
        options: originOptions,
      }),
    );

    const {
      options,
    } = result.current;

    expect(options.length).toBe(originOptions.length);
  });

  it('when props onChange is given, should called whenever change event invoked', () => {
    let myOption = '';

    const onChangeProp = jest.fn<void, [string]>((name) => {
      myOption = name;
    });

    const { result } = renderHook(
      () => useAutoCompleteValueControl({
        disabledOptionsFilter: false,
        onChange: onChangeProp,
        options: ['foo', 'bar'],
      }),
    );

    const {
      onChange,
    } = result.current;

    TestRenderer.act(() => {
      onChange({ id: 'foo', name: 'foo' });
    });

    expect(myOption).toBe('foo');
  });
});
