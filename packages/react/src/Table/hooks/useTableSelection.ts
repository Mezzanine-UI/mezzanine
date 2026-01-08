'use client';

import { useCallback, useMemo } from 'react';
import {
  getRowKey,
  TableRowSelectionCheckbox,
  TableRowSelectionRadio,
  type TableDataSource,
  type TableRowSelection,
} from '@mezzanine-ui/core/table';
import type { TableSelectionState } from '../TableContext';

export interface UseTableSelectionOptions<T extends TableDataSource> {
  dataSource: T[];
  rowSelection?: TableRowSelection<T>;
}

export function useTableSelection<T extends TableDataSource>({
  dataSource,
  rowSelection,
}: UseTableSelectionOptions<T>): TableSelectionState<T> | undefined {
  // Extract common props
  const { onChange, mode = 'checkbox' } = rowSelection || {};

  const selections =
    mode === 'radio'
      ? (rowSelection as TableRowSelectionRadio).selectedRowKey
      : (rowSelection as TableRowSelectionCheckbox | undefined)
          ?.selectedRowKeys;
  const isSelectionDisabled = rowSelection?.isSelectionDisabled;
  const onSelectAll = mode === 'radio' ? undefined : rowSelection?.onSelectAll;
  const preserveSelectedRowKeys =
    mode === 'radio' ? false : (rowSelection?.preserveSelectedRowKeys ?? false);

  const selectedRowKeys: string[] = useMemo(() => {
    if (mode === 'radio') {
      const key = selections as string | undefined;
      return key !== undefined ? [key] : [];
    }

    return (selections as string[] | undefined) ?? [];
  }, [mode, selections]);

  const selectableKeys = useMemo(() => {
    if (!rowSelection) return [];

    return dataSource
      .filter((record) => {
        if (!isSelectionDisabled) return true;

        const disabled = isSelectionDisabled(record);

        return !disabled;
      })
      .map((record) => getRowKey(record));
  }, [dataSource, isSelectionDisabled, rowSelection]);

  const isRowSelected = useCallback(
    (key: string) => {
      return selectedRowKeys.includes(key);
    },
    [selectedRowKeys],
  );

  const isRowDisabled = useCallback(
    (record: T) => {
      if (!isSelectionDisabled) return false;
      const disabled = isSelectionDisabled(record);

      return disabled;
    },
    [isSelectionDisabled],
  );

  const isAllSelected = useMemo(() => {
    if (!selectableKeys.length) return false;

    return selectableKeys.every((key) => selectedRowKeys.includes(key));
  }, [selectableKeys, selectedRowKeys]);

  const isIndeterminate = useMemo(() => {
    if (!selectableKeys.length) return false;

    const selectedCount = selectableKeys.filter((key) =>
      selectedRowKeys.includes(key),
    ).length;

    return selectedCount > 0 && selectedCount < selectableKeys.length;
  }, [selectableKeys, selectedRowKeys]);

  const toggleRow = useCallback(
    (key: string) => {
      // Radio mode: only one selection allowed
      if (mode === 'radio') {
        const selectedRow =
          dataSource.find((r) => getRowKey(r) === key) || null;

        (onChange as TableRowSelectionRadio['onChange'])?.(key, selectedRow);

        return;
      }

      // Checkbox mode: toggle selection
      const newKeys = selectedRowKeys.includes(key)
        ? selectedRowKeys.filter((k) => k !== key)
        : [...selectedRowKeys, key];

      const selectedRow = dataSource.find((r) => getRowKey(r) === key) || null;

      const selectedRows = dataSource.filter((r) =>
        newKeys.includes(getRowKey(r)),
      );

      (onChange as TableRowSelectionCheckbox['onChange'])?.(
        newKeys,
        selectedRow,
        selectedRows,
      );
    },
    [mode, selectedRowKeys, dataSource, onChange],
  );

  const toggleAll = useCallback(() => {
    let newKeys: string[];
    let type: 'all' | 'none';

    if (isAllSelected) {
      if (preserveSelectedRowKeys) {
        const currentDataKeys = dataSource.map(getRowKey);

        newKeys = selectedRowKeys.filter(
          (key) => !currentDataKeys.includes(String(key)),
        );
      } else {
        newKeys = selectedRowKeys.filter(
          (key) => !selectableKeys.includes(String(key)),
        );
      }

      type = 'none';
    } else {
      const existingNonDataKeys = preserveSelectedRowKeys
        ? selectedRowKeys.filter(
            (key) => !dataSource.some((r) => getRowKey(r) === String(key)),
          )
        : [];

      newKeys = [...existingNonDataKeys, ...selectableKeys];
      type = 'all';
    }

    const selectedRows = dataSource.filter((r) =>
      newKeys.includes(getRowKey(r)),
    );

    (onChange as TableRowSelectionCheckbox['onChange'])?.(
      newKeys,
      null,
      selectedRows,
    );
    onSelectAll?.(type);
  }, [
    dataSource,
    isAllSelected,
    onSelectAll,
    onChange,
    preserveSelectedRowKeys,
    selectableKeys,
    selectedRowKeys,
  ]);

  if (!rowSelection) {
    return undefined;
  }

  return {
    config: rowSelection,
    isAllSelected,
    isIndeterminate,
    isRowDisabled,
    isRowSelected,
    mode,
    selectedRowKeys,
    toggleAll,
    toggleRow,
  };
}
