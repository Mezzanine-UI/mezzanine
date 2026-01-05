import {
  getRowKey,
  TableDataSource,
  TableRowSelectionCheckbox,
} from '@mezzanine-ui/core/table';
import { useCallback, useMemo, useState } from 'react';

export interface UseTableRowSelectionProps<T extends TableDataSource> {
  getSubData: (record: T) => T[] | undefined;
}

/**
 * Custom hook for users to manage row selection state in a table with expandable rows.
 */
export function useTableRowSelection<
  T extends TableDataSource = TableDataSource,
>(props: UseTableRowSelectionProps<T>) {
  const { getSubData } = props;

  const [selectedKeys, setSelectedKeys] = useState<
    { key: string | number; subKeys?: (string | number)[] }[]
  >([]);

  const parentSelectedKeys = useMemo(
    () => selectedKeys.map((item) => item.key),
    [selectedKeys],
  );

  const parentOnChange: TableRowSelectionCheckbox<T>['onChange'] = useCallback(
    (_, __, selectedRows) => {
      setSelectedKeys(
        selectedRows.map((row) => {
          const subData = getSubData(row);
          const pk = getRowKey(row);

          return {
            key: pk,
            subKeys: subData?.length
              ? subData.map((subRow) => getRowKey(subRow))
              : undefined,
          };
        }),
      );
    },
    [getSubData],
  );

  const parentGetCheckboxProps: TableRowSelectionCheckbox<T>['getCheckboxProps'] =
    useCallback(
      (record: T) => {
        const subData = getSubData(record);
        const selectedItem = selectedKeys.find(
          (item) => item.key === getRowKey(record),
        );

        if (!subData?.length) {
          return {};
        }

        return {
          indeterminate:
            !!subData?.length &&
            selectedItem?.subKeys &&
            selectedItem.subKeys.length > 0 &&
            selectedItem.subKeys.length < subData.length,
          selected:
            subData?.length > 0 &&
            selectedItem?.subKeys &&
            selectedItem.subKeys.length === subData.length,
        };
      },
      [selectedKeys, getSubData],
    );

  const getChildOnChange: (
    record: T,
  ) => TableRowSelectionCheckbox<T>['onChange'] = useCallback(
    (record: T) => (keys) => {
      setSelectedKeys((prevSelected) => {
        const otherSelected = prevSelected.filter(
          (item) => item.key !== getRowKey(record),
        );

        if (!keys.length) {
          return otherSelected;
        }

        return [...otherSelected, { key: getRowKey(record), subKeys: keys }];
      });
    },
    [],
  );

  const getChildSelectedRowKeys = useCallback(
    (record: T) => {
      const selectedItem = selectedKeys.find(
        (item) => item.key === getRowKey(record),
      );

      return selectedItem?.subKeys || [];
    },
    [selectedKeys],
  );

  const totalSelectionCount = useMemo(
    () =>
      selectedKeys.reduce((acc, item) => acc + (item.subKeys?.length || 1), 0),
    [selectedKeys],
  );

  return {
    parentSelectedKeys,
    parentOnChange,
    parentGetCheckboxProps,
    getChildOnChange,
    getChildSelectedRowKeys,
    totalSelectionCount,
  };
}
