'use client';

import { useCallback, useMemo } from 'react';
import {
  getRowKey,
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
  const {
    selectedRowKeys = [],
    isCheckboxDisabled,
    onChange,
    onSelectAll,
    preserveSelectedRowKeys = false,
  } = rowSelection || {};

  const selectableKeys = useMemo(() => {
    if (!rowSelection) return [];

    return dataSource
      .filter((record) => {
        if (!isCheckboxDisabled) return true;

        const disabled = isCheckboxDisabled(record);

        return !disabled;
      })
      .map((record) => getRowKey(record));
  }, [dataSource, isCheckboxDisabled, rowSelection]);

  const isRowSelected = useCallback(
    (key: string | number) => {
      return selectedRowKeys.includes(key);
    },
    [selectedRowKeys],
  );

  const isRowDisabled = useCallback(
    (record: T) => {
      if (!isCheckboxDisabled) return false;
      const disabled = isCheckboxDisabled(record);

      return disabled;
    },
    [isCheckboxDisabled],
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
    (key: string | number) => {
      const newKeys = selectedRowKeys.includes(key)
        ? selectedRowKeys.filter((k) => k !== key)
        : [...selectedRowKeys, key];

      const selectedRow = dataSource.find((r) => getRowKey(r) === key) || null;

      const selectedRows = dataSource.filter((r) =>
        newKeys.includes(getRowKey(r)),
      );

      onChange?.(newKeys, selectedRow, selectedRows);
    },
    [selectedRowKeys, dataSource, onChange],
  );

  const toggleAll = useCallback(() => {
    let newKeys: (string | number)[];
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

    onChange?.(newKeys, null, selectedRows);
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
    selectedRowKeys,
    toggleAll,
    toggleRow,
  };
}
