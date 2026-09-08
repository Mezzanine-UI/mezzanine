import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import {
  getRowKey,
  type TableDataSource,
  type TableRowSelection,
  type TableRowSelectionCheckbox,
  type TableRowSelectionRadio,
} from '@mezzanine-ui/core/table';
import type { TableSelectionState } from './table-context';

export interface UseTableSelectionOptions<T extends TableDataSource> {
  /** The rows the table is showing. */
  dataSource: () => T[];
  /** The `rowSelection` prop the table was given. */
  rowSelection: () => TableRowSelection<T> | undefined;
}

/**
 * 把受控的選取狀態換算成表頭與每一列需要的旗標。
 *
 * 選取完全由使用端持有，這裡只負責算出「全選 / 半選」、哪些列可選，以及點擊時該把
 * 什麼新的 key 陣列交回 `onChange`。`radio` 模式只留一個 key，`preserveSelectedRowKeys`
 * 為真時全不選只會移掉目前這頁的 key。
 *
 * @example
 * ```ts
 * const selection = useTableSelection({
 *   dataSource: () => props.dataSource,
 *   rowSelection: () => props.rowSelection,
 * });
 * ```
 *
 * @see MznTableSelectionCell 每一列的勾選格
 */
export function useTableSelection<T extends TableDataSource>({
  dataSource,
  rowSelection,
}: UseTableSelectionOptions<T>): ComputedRef<
  TableSelectionState<T> | undefined
> {
  const mode = computed(() => rowSelection()?.mode ?? 'checkbox');

  const selectedRowKeys = computed((): string[] => {
    const config = rowSelection();

    if (mode.value === 'radio') {
      const key = (config as TableRowSelectionRadio | undefined)
        ?.selectedRowKey;

      return key !== undefined ? [key] : [];
    }

    return (
      (config as TableRowSelectionCheckbox | undefined)?.selectedRowKeys ?? []
    );
  });

  const selectableKeys = computed((): string[] => {
    const config = rowSelection();

    if (!config) return [];

    const { isSelectionDisabled } = config;

    return dataSource()
      .filter((record) => {
        if (!isSelectionDisabled) return true;

        return !isSelectionDisabled(record);
      })
      .map((record) => getRowKey(record));
  });

  const isRowSelected = (key: string): boolean =>
    selectedRowKeys.value.includes(key);

  const isRowDisabled = (record: T): boolean => {
    const isSelectionDisabled = rowSelection()?.isSelectionDisabled;

    if (!isSelectionDisabled) return false;

    return isSelectionDisabled(record);
  };

  const isAllSelected = computed((): boolean => {
    if (!selectableKeys.value.length) return false;

    return selectableKeys.value.every((key) =>
      selectedRowKeys.value.includes(key),
    );
  });

  const isIndeterminate = computed((): boolean => {
    if (!selectableKeys.value.length) return false;

    const selectedCount = selectableKeys.value.filter((key) =>
      selectedRowKeys.value.includes(key),
    ).length;

    return selectedCount > 0 && selectedCount < selectableKeys.value.length;
  });

  const toggleRow = (key: string): void => {
    const config = rowSelection();
    const rows = dataSource();

    // Radio mode: only one selection allowed
    if (mode.value === 'radio') {
      const selectedRow = rows.find((r) => getRowKey(r) === key) || null;

      (config as TableRowSelectionRadio | undefined)?.onChange?.(
        key,
        selectedRow,
      );

      return;
    }

    // Checkbox mode: toggle selection
    const newKeys = selectedRowKeys.value.includes(key)
      ? selectedRowKeys.value.filter((k) => k !== key)
      : [...selectedRowKeys.value, key];

    const selectedRow = rows.find((r) => getRowKey(r) === key) || null;

    const selectedRows = rows.filter((r) => newKeys.includes(getRowKey(r)));

    (config as TableRowSelectionCheckbox | undefined)?.onChange?.(
      newKeys,
      selectedRow,
      selectedRows,
    );
  };

  const toggleAll = (): void => {
    const config = rowSelection();
    const rows = dataSource();
    const preserveSelectedRowKeys =
      mode.value === 'radio'
        ? false
        : (config?.preserveSelectedRowKeys ?? false);
    const onSelectAll =
      mode.value === 'radio' ? undefined : config?.onSelectAll;
    let newKeys: string[];
    let type: 'all' | 'none';

    if (isAllSelected.value) {
      if (preserveSelectedRowKeys) {
        const currentDataKeys = rows.map(getRowKey);

        newKeys = selectedRowKeys.value.filter(
          (key) => !currentDataKeys.includes(String(key)),
        );
      } else {
        newKeys = selectedRowKeys.value.filter(
          (key) => !selectableKeys.value.includes(String(key)),
        );
      }

      type = 'none';
    } else {
      const existingNonDataKeys = preserveSelectedRowKeys
        ? selectedRowKeys.value.filter(
            (key) => !rows.some((r) => getRowKey(r) === String(key)),
          )
        : [];

      newKeys = [...existingNonDataKeys, ...selectableKeys.value];
      type = 'all';
    }

    const selectedRows = rows.filter((r) => newKeys.includes(getRowKey(r)));

    (config as TableRowSelectionCheckbox | undefined)?.onChange?.(
      newKeys,
      null,
      selectedRows,
    );
    onSelectAll?.(type);
  };

  return computed((): TableSelectionState<T> | undefined => {
    const config = rowSelection();

    if (!config) {
      return undefined;
    }

    return {
      config,
      isAllSelected: isAllSelected.value,
      isIndeterminate: isIndeterminate.value,
      isRowDisabled,
      isRowSelected,
      mode: mode.value,
      selectedRowKeys: selectedRowKeys.value,
      toggleAll,
      toggleRow,
    };
  });
}
