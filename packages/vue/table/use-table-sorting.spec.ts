import { useTableSorting } from './use-table-sorting';
import type { TableColumn } from './table.types';

const columnsWith = (sortOrder: TableColumn['sortOrder'], onSort = vi.fn()) => [
  { dataIndex: 'name', key: 'name', onSort, sortOrder } as TableColumn,
];

describe('useTableSorting', () => {
  it('should start an unsorted column at ascend', () => {
    const onSort = vi.fn();

    useTableSorting({ columns: () => columnsWith(null, onSort) }).onSort(
      'name',
    );

    expect(onSort).toHaveBeenCalledWith('name', 'ascend');
  });

  it('should step ascend to descend and descend back to unsorted', () => {
    const ascending = vi.fn();
    const descending = vi.fn();

    useTableSorting({
      columns: () => columnsWith('ascend', ascending),
    }).onSort('name');
    useTableSorting({
      columns: () => columnsWith('descend', descending),
    }).onSort('name');

    expect(ascending).toHaveBeenCalledWith('name', 'descend');
    expect(descending).toHaveBeenCalledWith('name', null);
  });

  it('should do nothing for a column that declares no onSort', () => {
    const columns = [{ dataIndex: 'name', key: 'name' } as TableColumn];

    expect(() =>
      useTableSorting({ columns: () => columns }).onSort('name'),
    ).not.toThrow();
  });

  it('should do nothing for a key no column owns', () => {
    const onSort = vi.fn();

    useTableSorting({ columns: () => columnsWith(null, onSort) }).onSort('age');

    expect(onSort).not.toHaveBeenCalled();
  });

  it('should read the columns afresh on every call', () => {
    const onSort = vi.fn();
    let sortOrder: TableColumn['sortOrder'] = null;
    const sorting = useTableSorting({
      columns: () => columnsWith(sortOrder, onSort),
    });

    sorting.onSort('name');
    sortOrder = 'ascend';
    sorting.onSort('name');

    expect(onSort.mock.calls).toEqual([
      ['name', 'ascend'],
      ['name', 'descend'],
    ]);
  });
});
