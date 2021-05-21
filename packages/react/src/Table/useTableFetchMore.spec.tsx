import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../__test-utils__';
import { useTableFetchMore } from './useTableFetchMore';

describe('useTableFetchMore()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  it('isFetching status should changed', () => {
    const defaultSources = [{
      id: 'foo',
      name: 'foo',
    }];

    const { result, rerender } = renderHook(
      ({ callback, dataSource }) => useTableFetchMore({
        callback,
        dataSource,
      }),
      {
        initialProps: {
          dataSource: defaultSources,
          callback: () => {},
        },
      },
    );

    const {
      fetchMore,
    } = result.current;

    TestRenderer.act(() => {
      fetchMore?.();
    });

    expect(result.current.isFetching).toBe(true);

    const newSources = [{
      id: 'foo',
      name: 'foo',
    }, {
      id: 'bar',
      name: 'bar',
    }];

    rerender({
      dataSource: newSources,
      callback: () => {},
    });

    expect(result.current.isFetching).toBe(false);
  });
});
