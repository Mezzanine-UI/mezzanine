import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { useTableFixedOffsets } from './use-table-fixed-offsets';
import type { UseTableFixedOffsetsOptions } from './use-table-fixed-offsets';
import type { ActionColumnConfig } from './table-hooks.types';
import type { TableColumn } from './table.types';

/** `useTableFixedOffsets` injects the super context, so it needs an instance. */
function run(options: UseTableFixedOffsetsOptions) {
  let result!: ReturnType<typeof useTableFixedOffsets>;

  mount(
    defineComponent({
      setup() {
        result = useTableFixedOffsets(options);

        return () => h('div');
      },
    }),
  );

  return result;
}

const noActionColumns: ActionColumnConfig = {
  collectableFixed: false,
  collectableMinWidth: 80,
  dragOrPinHandleFixed: false,
  expansionFixed: false,
  hasCollectable: false,
  hasDragOrPinHandle: false,
  hasExpansion: false,
  hasSelection: false,
  hasToggleable: false,
  selectionFixed: false,
  toggleableFixed: false,
  toggleableMinWidth: 80,
};

const col = (key: string, extra: Partial<TableColumn> = {}): TableColumn =>
  ({ dataIndex: key, key, ...extra }) as TableColumn;

describe('useTableFixedOffsets', () => {
  it('should stack the start-fixed columns left to right', () => {
    const offsets = run({
      actionConfig: () => ({
        ...noActionColumns,
        dragOrPinHandleFixed: true,
        expansionFixed: true,
        hasDragOrPinHandle: true,
        hasExpansion: true,
        hasSelection: true,
        selectionFixed: true,
      }),
      columns: () => [col('name', { fixed: 'start', width: 150 }), col('age')],
    });

    expect(offsets.value.getExpansionOffset()).toEqual({
      offset: 0,
      side: 'start',
    });
    expect(offsets.value.getDragOrPinHandleOffset()).toEqual({
      offset: 40,
      side: 'start',
    });
    expect(offsets.value.getSelectionOffset()).toEqual({
      offset: 80,
      side: 'start',
    });
    expect(offsets.value.getColumnOffset('name')).toEqual({
      offset: 120,
      side: 'start',
    });
    expect(offsets.value.getColumnOffset('age')).toBeNull();
  });

  it('should stack the end-fixed columns right to left', () => {
    const offsets = run({
      actionConfig: () => noActionColumns,
      columns: () => [
        col('a'),
        col('b', { fixed: 'end', width: 120 }),
        col('c', { fixed: 'end', width: 80 }),
      ],
    });

    expect(offsets.value.getColumnOffset('c')).toEqual({
      offset: 0,
      side: 'end',
    });
    expect(offsets.value.getColumnOffset('b')).toEqual({
      offset: 80,
      side: 'end',
    });
  });

  it('should measure a column at the width the user dragged it to', () => {
    const columns = () => [
      col('a', { fixed: 'start', width: 150 }),
      col('b', { fixed: 'start', width: 100 }),
      col('c', { fixed: 'start', width: 50 }),
    ];

    const declared = run({ actionConfig: () => noActionColumns, columns });
    const resized = run({
      actionConfig: () => noActionColumns,
      columns,
      getResizedColumnWidth: (key) => (key === 'b' ? 200 : undefined),
    });

    expect(declared.value.getColumnOffset('c')?.offset).toBe(250);
    expect(resized.value.getColumnOffset('c')?.offset).toBe(350);
  });

  it('should refuse an offset for a handle column that is not pinned', () => {
    const offsets = run({
      actionConfig: () => ({
        ...noActionColumns,
        hasCollectable: true,
        hasDragOrPinHandle: true,
        hasSelection: true,
        hasToggleable: true,
      }),
      columns: () => [col('a')],
    });

    expect(offsets.value.getDragOrPinHandleOffset()).toBeNull();
    expect(offsets.value.getSelectionOffset()).toBeNull();
    expect(offsets.value.getExpansionOffset()).toBeNull();
    expect(offsets.value.getToggleableOffset()).toBeNull();
    expect(offsets.value.getCollectableOffset()).toBeNull();
  });

  it('should shadow a start-fixed column only once it has actually stuck', () => {
    const offsets = run({
      actionConfig: () => noActionColumns,
      columns: () => [
        col('a', { fixed: 'start', width: 100 }),
        col('b', { width: 200 }),
        col('c', { width: 200 }),
      ],
    });

    expect(offsets.value.shouldShowShadow('a', 0, 500)).toBe(false);
    expect(offsets.value.shouldShowShadow('a', 10, 500)).toBe(true);
  });

  it('should not shadow a start-fixed column while the next one is flush against it', () => {
    const offsets = run({
      actionConfig: () => noActionColumns,
      columns: () => [
        col('a', { fixed: 'start', width: 100 }),
        col('b', { fixed: 'start', width: 100 }),
        col('c', { width: 200 }),
      ],
    });

    expect(offsets.value.shouldShowShadow('a', 50, 500)).toBe(false);
    expect(offsets.value.shouldShowShadow('b', 50, 500)).toBe(true);
  });

  it('should shadow an end-fixed column only while content runs past it', () => {
    const offsets = run({
      actionConfig: () => noActionColumns,
      columns: () => [
        col('a', { width: 200 }),
        col('b', { width: 200 }),
        col('c', { fixed: 'end', width: 100 }),
      ],
    });

    expect(offsets.value.shouldShowShadow('c', 0, 300)).toBe(true);
    expect(offsets.value.shouldShowShadow('c', 250, 300)).toBe(false);
  });

  it('should refuse a shadow for a column that is not fixed at all', () => {
    const offsets = run({
      actionConfig: () => noActionColumns,
      columns: () => [col('a', { width: 200 })],
    });

    expect(offsets.value.shouldShowShadow('a', 100, 300)).toBe(false);
  });
});
