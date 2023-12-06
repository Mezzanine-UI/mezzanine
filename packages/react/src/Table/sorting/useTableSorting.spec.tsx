import { TableDataSource } from '@mezzanine-ui/core/table';
import {
  TestRenderer,
  cleanup,
  cleanupHook,
  renderHook,
} from '../../../__test-utils__';
import { useTableSorting } from './useTableSorting';

describe('useTableSorting()', () => {
  afterEach(() => {
    cleanup();
    cleanupHook();
  });

  const minAgeId = 'foo';
  const maxAgeId = 'bar';

  const originSources: TableDataSource[] = [{
    id: minAgeId,
    name: 'foo',
    age: 10,
    count: 300,
  }, {
    id: maxAgeId,
    name: 'bar',
    age: 15,
    count: 200,
  }, {
    id: 'bob',
    name: 'bob',
    age: 13,
    count: 250,
  }];

  const numberSorter = (a: number, b: number) => b - a;

  it('should sorted order be `none -> desc -> asc -> none`', () => {
    const { result } = renderHook(
      () => useTableSorting({
        dataSource: originSources,
      }),
    );

    /** current should be 'none' */
    const [
      dataSource,
      onChange,
      {
        sortedType,
      },
    ] = result.current;

    expect(dataSource[0].id).toBe(originSources[0].id);
    expect(dataSource[2].id).toBe(originSources[2].id);
    expect(sortedType).toBe('none');

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
        sorter: numberSorter,
      });
    });

    /** current should be 'desc' */
    expect(result.current[2].sortedOn).toBe('age');
    expect(result.current[2].sortedType).toBe('desc');
    expect(result.current[0][0].id).toBe(maxAgeId);
    expect(result.current[0][2].id).toBe(minAgeId);

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
        sorter: numberSorter,
      });
    });

    /** current should be 'asc' */
    expect(result.current[2].sortedOn).toBe('age');
    expect(result.current[2].sortedType).toBe('asc');
    expect(result.current[0][0].id).toBe(minAgeId);
    expect(result.current[0][2].id).toBe(maxAgeId);

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
        sorter: numberSorter,
      });
    });

    /** current should be 'none' */
    expect(result.current[2].sortedOn).toBe('');
    expect(result.current[2].sortedType).toBe('none');
    expect(result.current[0][0].id).toBe(originSources[0].id);
    expect(result.current[0][2].id).toBe(originSources[2].id);
  });

  it('should set to `desc` when sortedOn switch from another', () => {
    /** ex: sortedOn: 'age' -> sortedOn: 'name' */
    const { result } = renderHook(
      () => useTableSorting({
        dataSource: originSources,
      }),
    );

    const [,
      onChange,
    ] = result.current;

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
        sorter: numberSorter,
      });
    });

    expect(result.current[2].sortedOn).toBe('age');
    expect(result.current[2].sortedType).toBe('desc');
    expect(result.current[0][0].id).toBe(maxAgeId);
    expect(result.current[0][2].id).toBe(minAgeId);

    TestRenderer.act(() => {
      onChange({
        key: 'count',
        dataIndex: 'count',
        sorter: numberSorter,
      });
    });

    expect(result.current[2].sortedOn).toBe('count');
    expect(result.current[2].sortedType).toBe('desc');
    expect(result.current[0][0].id).toBe(originSources[0].id);
    expect(result.current[0][2].id).toBe(originSources[1].id);
  });

  it('should notify parent for dataIndex and sortedType changing when onSorted given', () => {
    let afterSortedType = 'none';
    let currentSortedIndex = '';

    const onAgeSorted = jest.fn((dataIndex, sortedType) => {
      currentSortedIndex = dataIndex;
      afterSortedType = sortedType;
    });

    const { result } = renderHook(
      () => useTableSorting({
        dataSource: originSources,
      }),
    );

    /** current should be 'none' */
    const [,
      onChange,
    ] = result.current;

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
        sorter: numberSorter,
        onSorted: onAgeSorted,
      });
    });

    /** current should be 'desc' */
    expect(currentSortedIndex).toBe('age');
    expect(afterSortedType).toBe('desc');
  });

  it('should `resetAll` reset all the current status', () => {
    const { result } = renderHook(
      () => useTableSorting({
        dataSource: originSources,
      }),
    );

    /** current should be 'none' */
    const [,,
      {
        onResetAll,
      },
    ] = result.current;

    TestRenderer.act(() => {
      onResetAll();
    });

    const [,,
      {
        sortedOn,
        sortedType,
      },
    ] = result.current;

    expect(sortedOn).toBe('');
    expect(sortedType).toBe('none');
  });

  it('should nothing happen when sorter is not given', () => {
    const { result } = renderHook(
      () => useTableSorting({
        dataSource: originSources,
      }),
    );

    /** current should be 'none' */
    const [,
      onChange,
    ] = result.current;

    TestRenderer.act(() => {
      onChange({
        key: 'age',
        dataIndex: 'age',
      });
    });

    const [
      dataSource,,
      {
        sortedType,
      },
    ] = result.current;

    expect(dataSource[0].id).toBe(originSources[0].id);
    expect(dataSource[2].id).toBe(originSources[2].id);
    expect(sortedType).toBe('none');
  });
});
