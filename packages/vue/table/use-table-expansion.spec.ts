import { shallowRef } from 'vue';
import { useTableExpansion } from './use-table-expansion';
import type { TableExpandable } from './table.types';

interface Row extends Record<string, unknown> {
  key: string;
}

const rowA: Row = { key: 'a' };

const expandable = (
  extra: Partial<TableExpandable<Row>> = {},
): TableExpandable<Row> => ({
  expandedRowRender: () => null,
  ...extra,
});

describe('useTableExpansion', () => {
  it('should hand back nothing when the table is not expandable', () => {
    const expansion = useTableExpansion<Row>({
      expandable: () => undefined,
      hasDragOrPinHandle: () => false,
    });

    expect(expansion.value).toBeUndefined();
  });

  it('should keep its own expanded keys when uncontrolled', () => {
    const onExpand = vi.fn();
    const onExpandedRowsChange = vi.fn();
    const expansion = useTableExpansion<Row>({
      expandable: () => expandable({ onExpand, onExpandedRowsChange }),
      hasDragOrPinHandle: () => false,
    });

    expansion.value?.toggleExpand('a', rowA);

    expect(expansion.value?.expandedRowKeys).toEqual(['a']);
    expect(expansion.value?.isRowExpanded('a')).toBe(true);
    expect(onExpand).toHaveBeenCalledWith(true, rowA);
    expect(onExpandedRowsChange).toHaveBeenCalledWith(['a']);

    expansion.value?.toggleExpand('a', rowA);

    expect(expansion.value?.expandedRowKeys).toEqual([]);
    expect(onExpand).toHaveBeenLastCalledWith(false, rowA);
  });

  it('should leave the keys to the consumer when controlled', () => {
    const expandedRowKeys = shallowRef<string[]>(['a']);
    const onExpandedRowsChange = vi.fn();
    const expansion = useTableExpansion<Row>({
      expandable: () =>
        expandable({
          expandedRowKeys: expandedRowKeys.value,
          onExpandedRowsChange,
        }),
      hasDragOrPinHandle: () => false,
    });

    expect(expansion.value?.isRowExpanded('a')).toBe(true);

    expansion.value?.toggleExpand('a', rowA);

    // The consumer has not written the new keys back yet.
    expect(expansion.value?.expandedRowKeys).toEqual(['a']);
    expect(onExpandedRowsChange).toHaveBeenCalledWith([]);

    expandedRowKeys.value = [];

    expect(expansion.value?.expandedRowKeys).toEqual([]);
  });

  it('should indent the expanded content past the columns before it', () => {
    const withHandle = useTableExpansion<Row>({
      expandable: () => expandable(),
      hasDragOrPinHandle: () => true,
    });
    const withoutHandle = useTableExpansion<Row>({
      expandable: () => expandable(),
      hasDragOrPinHandle: () => false,
    });

    expect(withHandle.value?.expansionLeftPadding).toBe(80);
    expect(withoutHandle.value?.expansionLeftPadding).toBe(40);
  });
});
