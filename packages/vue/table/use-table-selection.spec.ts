import { shallowRef } from 'vue';
import type {
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
} from '@mezzanine-ui/core/table';
import { useTableSelection } from './use-table-selection';

interface Row extends Record<string, unknown> {
  key: string;
}

const rows: Row[] = [{ key: 'a' }, { key: 'b' }, { key: 'c' }];

describe('useTableSelection', () => {
  it('should hand back nothing when the table has no rowSelection', () => {
    expect(
      useTableSelection<Row>({
        dataSource: () => rows,
        rowSelection: () => undefined,
      }).value,
    ).toBeUndefined();
  });

  it('should report all-selected and indeterminate from the selected keys', () => {
    const selectedRowKeys = shallowRef<string[]>([]);
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          selectedRowKeys: selectedRowKeys.value,
        }) as TableRowSelectionCheckbox<Row>,
    });

    expect(selection.value?.isAllSelected).toBe(false);
    expect(selection.value?.isIndeterminate).toBe(false);

    selectedRowKeys.value = ['a'];

    expect(selection.value?.isAllSelected).toBe(false);
    expect(selection.value?.isIndeterminate).toBe(true);

    selectedRowKeys.value = ['a', 'b', 'c'];

    expect(selection.value?.isAllSelected).toBe(true);
    expect(selection.value?.isIndeterminate).toBe(false);
  });

  it('should leave a disabled row out of the select-all maths', () => {
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          isSelectionDisabled: (record: Row) => record.key === 'c',
          selectedRowKeys: ['a', 'b'],
        }) as TableRowSelectionCheckbox<Row>,
    });

    expect(selection.value?.isAllSelected).toBe(true);
    expect(selection.value?.isRowDisabled(rows[2])).toBe(true);
  });

  it('should report the new keys, the row and every selected row on toggle', () => {
    const onChange = vi.fn();
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          onChange,
          selectedRowKeys: ['a'],
        }) as unknown as TableRowSelectionCheckbox<Row>,
    });

    selection.value?.toggleRow('b', rows[1]);

    expect(onChange).toHaveBeenCalledWith(['a', 'b'], rows[1], [
      rows[0],
      rows[1],
    ]);
  });

  it('should deselect a row that was already selected', () => {
    const onChange = vi.fn();
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          onChange,
          selectedRowKeys: ['a', 'b'],
        }) as unknown as TableRowSelectionCheckbox<Row>,
    });

    selection.value?.toggleRow('a', rows[0]);

    expect(onChange).toHaveBeenCalledWith(['b'], rows[0], [rows[1]]);
  });

  it('should keep only one key in radio mode', () => {
    const onChange = vi.fn();
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          mode: 'radio',
          onChange,
          selectedRowKey: 'a',
        }) as unknown as TableRowSelectionRadio<Row>,
    });

    expect(selection.value?.selectedRowKeys).toEqual(['a']);

    selection.value?.toggleRow('b', rows[1]);

    expect(onChange).toHaveBeenCalledWith('b', rows[1]);
  });

  it('should select every selectable row and report the type', () => {
    const onChange = vi.fn();
    const onSelectAll = vi.fn();
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          isSelectionDisabled: (record: Row) => record.key === 'c',
          onChange,
          onSelectAll,
          selectedRowKeys: [],
        }) as unknown as TableRowSelectionCheckbox<Row>,
    });

    selection.value?.toggleAll();

    expect(onChange).toHaveBeenCalledWith(['a', 'b'], null, [rows[0], rows[1]]);
    expect(onSelectAll).toHaveBeenCalledWith('all');
  });

  it('should keep keys from other pages when preserveSelectedRowKeys is on', () => {
    const onChange = vi.fn();
    const selection = useTableSelection<Row>({
      dataSource: () => rows,
      rowSelection: () =>
        ({
          onChange,
          preserveSelectedRowKeys: true,
          selectedRowKeys: ['a', 'b', 'c', 'z'],
        }) as unknown as TableRowSelectionCheckbox<Row>,
    });

    selection.value?.toggleAll();

    expect(onChange).toHaveBeenCalledWith(['z'], null, []);
  });
});
